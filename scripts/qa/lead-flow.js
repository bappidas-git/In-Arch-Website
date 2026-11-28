#!/usr/bin/env node
/* ============================================
   lead-flow.js — form → API → admin, end to end (prompt 05)
   --------------------------------------------
   node scripts/qa/lead-flow.js [--base http://127.0.0.1:8080] [--width 390] [--keep]

   Runs against the production build served by PHP (see README.md), so the
   site, /api/leads.php and the admin share one origin. Every run uses fresh
   random mobile numbers. Steps:

   1. `/`: the dock's "Start a project" opens the dialog; focus is inside it
      (on its heading) and the dialog has a name; Escape closes it and focus
      returns to the CTA.
   2. An empty submit shows exactly three errors, focus on "Your name".
   3. The four compact fields plus the optional details are filled; the
      intercepted create request is checked: URL ends `?action=create`,
      POST, a `lead` whose keys are exactly the 21 frozen keys plus a subset
      of project_location / project_area / budget_range / context_label;
      status "new", notes [], activity[0].action "Lead created",
      organization and state empty, service_interest an allowed label,
      source "dock-cta", message = typed text + "Project details:".
      The success state names the visitor.
   4. `/contact`: the same mobile gives the duplicate notice with its
      WhatsApp link, and nothing typed is cleared.
   5. A forced network failure gives the error notice, values kept; with
      the network back, "Try again" stores the enquiry.
   6. Admin (credentials read from .env at run time, never printed): the
      lead is in /admin/lms with its name, mobile and source; its detail
      page shows the interested-in value and the composed message; the
      "Interested In" filter offers the new service title.
   7. The test leads are deleted (through the API, with the admin key from
      .env), also when a step fails. `--keep` leaves them.

   Exit code 1 on any failed check; screenshots of a failure go to
   qa-artifacts/lead-flow/.
   ============================================ */

const path = require('path');
const { ARTIFACTS, parseArgs, requirePlaywright, readEnv, ensureDir } = require('./_shared');

const args = parseArgs();
const BASE = String(args.base && args.base !== true ? args.base : 'http://127.0.0.1:8080').replace(/\/$/, '');
const WIDTH = Number(args.width) || 390;
const KEEP = Boolean(args.keep);
const OUT = path.join(ARTIFACTS, 'lead-flow');

const FROZEN_KEYS = [
  'lead_id', 'name', 'mobile', 'email', 'organization', 'service_interest', 'state', 'message', 'source',
  'status', 'submitted_at', 'updated_at', 'page_url', 'user_agent', 'utm_source', 'utm_medium',
  'utm_campaign', 'utm_term', 'utm_content', 'notes', 'activity',
];
const EXTRA_KEYS = ['project_location', 'project_area', 'budget_range', 'context_label'];
const SERVICES = [
  'Architectural Design & Consultancy',
  'Interior Design',
  'Residential Architecture',
  'Commercial & Institutional Architecture',
  '3D Visualisation & Architectural Presentation',
  'Project Management & Site Consultancy',
  'Renovation & Interior Upgradation',
  'Something else',
];
// A title the old (Dulcey) admin list never had, so the filter proves the new data.
const SERVICE = 'Residential Architecture';

const randomMobile = () => `9${String(Math.floor(Math.random() * 1e9)).padStart(9, '0')}`;
const MOBILE_A = randomMobile();
let MOBILE_B = randomMobile();
while (MOBILE_B === MOBILE_A) MOBILE_B = randomMobile();

const NAME_A = 'Leadflow Tester';
const NAME_B = 'Contactflow Tester';
const MESSAGE_A = 'A three-bedroom flat near the river, to be done before the monsoon.';

const results = [];
const check = (label, ok, detail = '') => {
  results.push({ label, ok: Boolean(ok), detail });
  console.log(`${ok ? '  ✓' : '  ✗'} ${label}${!ok && detail ? ` — ${detail}` : ''}`);
  return Boolean(ok);
};

const env = readEnv();
const apiUrl = `${BASE}/api/leads.php`;

const api = async (action, { method = 'GET', body } = {}) => {
  const res = await fetch(`${apiUrl}?action=${action}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Admin-Key': env.REACT_APP_LEADS_ADMIN_KEY || '' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
};

/** Every create request the page sends, with its parsed body. */
const watchCreates = (page) => {
  const seen = [];
  page.on('request', (req) => {
    if (req.method() === 'POST' && /\/api\/leads\.php\?action=create$/.test(req.url())) {
      let body = null;
      try {
        body = req.postDataJSON();
      } catch (err) {
        body = null;
      }
      seen.push({ url: req.url(), method: req.method(), body });
    }
  });
  return seen;
};

const shot = async (page, name) => {
  try {
    ensureDir(OUT);
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  } catch (err) {
    /* best effort */
  }
};

const dialog = (page) => page.locator('[role="dialog"]');
const inDialog = (page, label) => dialog(page).getByLabel(label);

const main = async () => {
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const mobile = WIDTH < 768;
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: mobile ? 844 : 900 },
    hasTouch: mobile,
    isMobile: mobile,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  const creates = watchCreates(page);
  const leadIds = new Set();

  console.log(`lead-flow · ${BASE} · ${WIDTH} px · mobiles ${MOBILE_A}, ${MOBILE_B}`);

  try {
    // ---------- 1. Open the sheet from the dock ----------
    console.log('\nModal from the dock');
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const cta = page.locator('nav[aria-label="Primary"] button:visible', { hasText: 'Start a project' }).first();
    await cta.click();
    await dialog(page).waitFor({ state: 'visible' });
    await page.waitForTimeout(700); // the sheet's 500 ms rise
    const opened = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      const labelledBy = d && d.getAttribute('aria-labelledby');
      const title = labelledBy && document.getElementById(labelledBy);
      return {
        modal: d && d.getAttribute('aria-modal'),
        name: title ? title.textContent.trim() : '',
        focusInside: Boolean(d && d.contains(document.activeElement)),
        focusOnTitle: Boolean(title && document.activeElement === title),
        locked: document.body.style.position === 'fixed',
      };
    });
    check('dialog is modal and named by its heading', opened.modal === 'true' && opened.name === 'Tell us about your space.', JSON.stringify(opened));
    check('focus is inside the dialog, on its heading', opened.focusInside && opened.focusOnTitle);
    check('the page behind is scroll-locked', opened.locked);

    await page.keyboard.press('Escape');
    await dialog(page).waitFor({ state: 'detached', timeout: 3000 });
    const back = await page.evaluate(() => {
      const el = document.activeElement;
      return { text: el ? el.textContent.trim() : '', unlocked: document.body.style.position !== 'fixed' };
    });
    check('Escape closes it, focus returns to the CTA, lock released', /start a project/i.test(back.text) && back.unlocked, JSON.stringify(back));

    await cta.click();
    await dialog(page).waitFor({ state: 'visible' });
    await page.waitForTimeout(700);

    // ---------- 2. Empty submit ----------
    console.log('\nValidation');
    await dialog(page).getByRole('button', { name: /send enquiry/i }).click();
    await page.waitForTimeout(200);
    const invalid = await dialog(page).locator('[aria-invalid="true"]').count();
    const shownErrors = await dialog(page).locator('p[id$="-error"]:not([hidden])').count();
    check('an empty submit shows exactly three errors', invalid === 3 && shownErrors === 3, `aria-invalid ${invalid}, messages ${shownErrors}`);
    const focusId = await page.evaluate(() => document.activeElement && document.activeElement.id);
    check('focus moves to "Your name"', focusId === 'modal-dock-cta-name', focusId);

    // ---------- 3. Fill and send ----------
    console.log('\nEnquiry through the modal');
    await inDialog(page, /^your name/i).fill(NAME_A);
    await inDialog(page, /^phone/i).fill(MOBILE_A);
    await inDialog(page, /^what do you need/i).selectOption(SERVICE);
    await inDialog(page, /^tell us about your project/i).fill(MESSAGE_A);
    await dialog(page).getByRole('button', { name: /add project details/i }).click();
    await inDialog(page, /^email/i).fill('leadflow@example.com');
    await inDialog(page, /^project location/i).fill('Boring Road, Patna');
    await inDialog(page, /^approximate area/i).fill('1,850 sq. ft.');
    await inDialog(page, /^indicative budget/i).selectOption('₹25 – 50 lakh');

    const sendA = page.waitForRequest((r) => /action=create$/.test(r.url()) && r.method() === 'POST');
    await dialog(page).getByRole('button', { name: /send enquiry/i }).click();
    await sendA;
    const success = dialog(page).getByRole('heading', { name: 'Thank you, Leadflow.' });
    const successShown = await success.waitFor({ state: 'visible', timeout: 10000 }).then(() => true, () => false);

    const reqA = creates[0];
    const lead = reqA && reqA.body && reqA.body.lead;
    if (lead && lead.lead_id) leadIds.add(lead.lead_id);
    check('request: URL ends ?action=create, method POST', reqA && reqA.url.endsWith('?action=create') && reqA.method === 'POST');
    check('request body has a `lead` object', lead && typeof lead === 'object');
    if (lead) {
      const keys = Object.keys(lead);
      const missing = FROZEN_KEYS.filter((k) => !keys.includes(k));
      const extra = keys.filter((k) => !FROZEN_KEYS.includes(k));
      const unknown = extra.filter((k) => !EXTRA_KEYS.includes(k));
      check('lead keys = the 21 frozen keys + a subset of the four extras', !missing.length && !unknown.length, `missing ${missing}, unknown ${unknown}`);
      check('status "new", notes [], activity[0].action "Lead created"', lead.status === 'new' && Array.isArray(lead.notes) && lead.notes.length === 0 && lead.activity && lead.activity[0] && lead.activity[0].action === 'Lead created');
      check('organization and state are empty strings', lead.organization === '' && lead.state === '');
      check('service_interest is an allowed label', SERVICES.includes(lead.service_interest) && lead.service_interest === SERVICE, lead.service_interest);
      check('source is "dock-cta"', lead.source === 'dock-cta', lead.source);
      check('message starts with the typed text and carries "Project details:"', typeof lead.message === 'string' && lead.message.startsWith(MESSAGE_A) && lead.message.includes('Project details:'), lead.message);
      check('mobile is stored as 10 digits', lead.mobile === MOBILE_A, lead.mobile);
      check('the details are also stored as their own keys', lead.project_location === 'Boring Road, Patna' && lead.project_area === '1,850 sq. ft.' && lead.budget_range === '₹25 – 50 lakh');
    }
    check('success state names the visitor', successShown);
    if (successShown) {
      const status = await dialog(page).locator('[role="status"]').innerText();
      check('success body quotes the mobile', status.includes(`+91 ${MOBILE_A.slice(0, 5)} ${MOBILE_A.slice(5)}`), status);
      const focusOnHeading = await page.evaluate(() => document.activeElement && document.activeElement.tagName === 'H3');
      check('focus moves to the success heading', focusOnHeading);
    } else {
      await shot(page, 'modal-success');
    }
    await dialog(page).getByRole('button', { name: 'Close' }).last().click();
    await dialog(page).waitFor({ state: 'detached', timeout: 3000 }).catch(() => {});

    // ---------- 4. Duplicate on /contact ----------
    console.log('\nDuplicate through /contact');
    await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' });
    const form = page.locator('form#contact-page');
    await form.waitFor({ state: 'visible' });
    await form.getByLabel(/^your name/i).fill(NAME_B);
    await form.getByLabel(/^phone/i).fill(MOBILE_A);
    await form.getByLabel(/^what do you need/i).selectOption('Interior Design');
    await form.getByLabel(/^tell us about your project/i).fill('A second brief from the same number.');
    await form.getByRole('button', { name: /send enquiry/i }).click();
    const dupTitle = form.getByText('We already have an enquiry from this number.');
    const dupShown = await dupTitle.waitFor({ state: 'visible', timeout: 10000 }).then(() => true, () => false);
    check('the same mobile shows the duplicate notice', dupShown);
    if (dupShown) {
      const notice = form.locator('[role="status"]').first();
      const wa = notice.getByRole('link', { name: /send this brief on whatsapp/i });
      const href = (await wa.getAttribute('href')) || '';
      const brief = decodeURIComponent(href.split('?text=')[1] || '');
      check('its WhatsApp link carries the brief', href.startsWith('https://wa.me/') && brief.includes(`Name: ${NAME_B}`) && brief.includes('Service: Interior Design') && brief.includes('A second brief'), brief);
      check('its call link dials the studio', (await notice.getByRole('link', { name: /^call/i }).getAttribute('href')) === 'tel:+917292831128');
    } else {
      await shot(page, 'contact-duplicate');
    }
    const keptDup = {
      name: await form.getByLabel(/^your name/i).inputValue(),
      mobile: await form.getByLabel(/^phone/i).inputValue(),
      message: await form.getByLabel(/^tell us about your project/i).inputValue(),
    };
    check('nothing typed was cleared', keptDup.name === NAME_B && keptDup.mobile === MOBILE_A && keptDup.message.startsWith('A second brief'), JSON.stringify(keptDup));

    // ---------- 5. Failure, then "Try again" ----------
    console.log('\nNetwork failure and retry');
    await form.getByLabel(/^phone/i).fill(MOBILE_B);
    const block = (route) => route.abort('internetdisconnected');
    await page.route('**/api/leads.php?action=create', block);
    await form.getByRole('button', { name: /send enquiry/i }).click();
    const alert = form.locator('[role="alert"]').filter({ hasText: /not been sent/i });
    const failShown = await alert.waitFor({ state: 'visible', timeout: 10000 }).then(() => true, () => false);
    check('a network failure shows the error notice', failShown);
    if (failShown) {
      const text = await alert.innerText();
      check('the notice quotes the studio phone number', text.includes('+91 72928 31128'), text);
      check('it offers WhatsApp instead and Call', (await alert.getByRole('link', { name: /send on whatsapp instead/i }).count()) === 1 && (await alert.getByRole('link', { name: /^call/i }).count()) === 1);
    } else {
      await shot(page, 'contact-failure');
    }
    const keptFail = {
      name: await form.getByLabel(/^your name/i).inputValue(),
      mobile: await form.getByLabel(/^phone/i).inputValue(),
    };
    check('values are kept after the failure', keptFail.name === NAME_B && keptFail.mobile === MOBILE_B, JSON.stringify(keptFail));

    await page.unroute('**/api/leads.php?action=create', block);
    const retry = page.waitForRequest((r) => /action=create$/.test(r.url()) && r.method() === 'POST');
    await alert.getByRole('button', { name: /try again/i }).click();
    await retry;
    const retried = await page
      .getByRole('heading', { name: 'Thank you, Contactflow.' })
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true, () => false);
    check('"Try again" stores the enquiry and shows success', retried);
    const reqB = creates[creates.length - 1];
    const leadB = reqB && reqB.body && reqB.body.lead;
    if (leadB && leadB.lead_id) leadIds.add(leadB.lead_id);
    check('the retried lead has source "contact-page"', leadB && leadB.source === 'contact-page' && leadB.mobile === MOBILE_B);

    // ---------- 6. Admin ----------
    console.log('\nAdmin');
    const user = env.REACT_APP_ADMIN_USERNAME;
    const pass = env.REACT_APP_ADMIN_PASSWORD;
    if (!check('admin credentials are present in .env', user && pass)) throw new Error('no admin credentials');
    const admin = await context.newPage();
    admin.on('pageerror', (err) => errors.push(`admin: ${err.message}`));
    await admin.setViewportSize({ width: 1440, height: 900 });
    await admin.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
    await admin.getByPlaceholder('Enter username').fill(user);
    await admin.getByPlaceholder('Enter password').fill(pass);
    await admin.locator('button[type="submit"]').click();
    await admin.waitForURL(/\/admin\/dashboard/, { timeout: 10000 });
    await admin.goto(`${BASE}/admin/lms`, { waitUntil: 'networkidle' });

    const search = admin.getByPlaceholder(/search by name/i);
    let row = null;
    for (let attempt = 0; attempt < 4 && !row; attempt += 1) {
      await search.fill(MOBILE_A);
      const candidate = admin.locator('tr', { hasText: MOBILE_A }).first();
      if (await candidate.waitFor({ state: 'visible', timeout: 4000 }).then(() => true, () => false)) row = candidate;
      else await admin.getByLabel('Refresh leads').click().catch(() => {});
    }
    check('the lead is listed in /admin/lms', Boolean(row));
    if (row) {
      const text = await row.innerText();
      check('…with its name, mobile and source', text.includes(NAME_A) && text.includes(MOBILE_A) && text.includes('dock-cta'), text.replace(/\s+/g, ' '));
    } else {
      await shot(admin, 'admin-lms');
    }

    const interest = admin
      .locator('.MuiFormControl-root', { has: admin.locator('label', { hasText: /^Interested In$/ }) })
      .locator('[aria-haspopup="listbox"]');
    await interest.click();
    const option = admin.getByRole('option', { name: SERVICE, exact: true });
    check(`the "Interested In" filter offers "${SERVICE}"`, await option.isVisible().catch(() => false));
    await admin.keyboard.press('Escape');

    if (lead && lead.lead_id) {
      await admin.goto(`${BASE}/admin/lms/lead/${lead.lead_id}`, { waitUntil: 'networkidle' });
      const detail = await admin.locator('main, body').first().innerText();
      check('the detail page shows the interested-in value', detail.includes(SERVICE));
      check('…and the composed message', detail.includes(MESSAGE_A) && detail.includes('Project details: Location: Boring Road, Patna; Area: 1,850 sq. ft.; Budget: ₹25 – 50 lakh'));
    }
  } catch (err) {
    check('the flow ran to the end', false, err.message);
    await shot(page, 'failure');
  } finally {
    check('no uncaught page errors', errors.length === 0, errors.join(' | '));

    // ---------- 7. Clean up ----------
    if (!KEEP) {
      const listed = await api('list').catch(() => ({ status: 0, data: {} }));
      if (listed.status === 200 && Array.isArray(listed.data.leads)) {
        listed.data.leads
          .filter((l) => l.mobile === MOBILE_A || l.mobile === MOBILE_B || leadIds.has(l.lead_id))
          .forEach((l) => leadIds.add(l.lead_id));
      }
      if (leadIds.size) {
        const removed = await api('delete', { method: 'POST', body: { lead_ids: [...leadIds] } }).catch(() => ({ status: 0, data: {} }));
        check(`test leads deleted (${leadIds.size})`, removed.status === 200 && removed.data.removed === leadIds.size, `status ${removed.status}, removed ${removed.data && removed.data.removed}`);
      }
    }
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  process.exit(failed.length ? 1 : 0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
