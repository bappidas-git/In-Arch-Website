/* ============================================
   Design Lab — the content dump (prompt 02)
   --------------------------------------------
   Every module in src/data/ written out plainly, so the copy can be
   proof-read against `details of in-arch.pdf` in one place. Empty facts are
   listed as "not supplied" here only; on the site they render nothing.
   Links are shown as their hrefs, not as live links.
   ============================================ */

import React from 'react';
import lab from '../LabPage.module.css';
import styles from './AssetsSection.module.css';
import {
  studio,
  studioAddressLines,
  studioHoursLabel,
  studioMailHref,
  studioMapsHref,
  studioTelHref,
  studioWhatsAppHref,
} from '../../data/siteConfig';
import { services, serviceTitles, SOMETHING_ELSE } from '../../data/services';
import { processSteps, phases } from '../../data/process';
import { faqs } from '../../data/faqs';
import studioContent from '../../data/studioContent';
import { categories, projects } from '../../data/projects';
import interiors from '../../data/interiors';
import { credits, footerCredits, pendingAssets } from '../../data/credits';

const Missing = () => <em className={styles.missing}>not supplied — renders nothing</em>;
const Fact = ({ label, children }) => (
  <>
    <dt className="ia-t-label">{label}</dt>
    <dd className="ia-t-body">{children}</dd>
  </>
);
const orMissing = (value) => (value ? value : <Missing />);

const Block = ({ title, source, children }) => (
  <div className={styles.dumpBlock}>
    <h4 className="ia-t-display-sm">{title}</h4>
    {source && <p className="ia-t-caption">{source}</p>}
    {children}
  </div>
);

const AssetsContent = () => (
  <div className={styles.block}>
    <h3 className="ia-t-display-sm">Content — proof-read against the PDF</h3>
    <p className={`ia-t-body ${lab.note}`}>
      Services, process and FAQs are verbatim from <code>details of in-arch.pdf</code> §4, §7 and §8; studio copy from
      §1–§3, §6, §9 and §10. Read them line by line against <code>pdftotext -layout</code>.
    </p>

    <Block title="Studio facts" source="src/data/siteConfig.js — studio">
      <dl className={styles.facts}>
        <Fact label="Name">{studio.name}</Fact>
        <Fact label="Full name">{studio.fullName}</Fact>
        <Fact label="Descriptor">{studio.descriptor}</Fact>
        <Fact label="Tagline">{studio.tagline}</Fact>
        <Fact label="Blurb">{studio.blurb}</Fact>
        <Fact label="Principal">
          {studio.principal.name} — {studio.principal.role}
        </Fact>
        <Fact label="Phone">
          {studio.phoneDisplay} · <code>{studioTelHref}</code>
        </Fact>
        <Fact label="WhatsApp">
          <code className={styles.wrap}>{studioWhatsAppHref('Hello IN-ARCH')}</code>
        </Fact>
        <Fact label="Email">{studioMailHref ? <code>{studioMailHref}</code> : <Missing />}</Fact>
        <Fact label="Address">{studioAddressLines.join(' · ')}</Fact>
        <Fact label="PIN code">{orMissing(studio.address.postalCode)}</Fact>
        <Fact label="Hours">{orMissing(studioHoursLabel)}</Fact>
        <Fact label="Site URL">{orMissing(studio.siteUrl)}</Fact>
        <Fact label="Map">
          {studio.map.query} · <code className={styles.wrap}>{studioMapsHref}</code>
        </Fact>
        <Fact label="Social">
          {Object.entries(studio.social).some(([, v]) => v) ? (
            Object.entries(studio.social)
              .filter(([, v]) => v)
              .map(([k]) => k)
              .join(', ')
          ) : (
            <Missing />
          )}
        </Fact>
      </dl>
    </Block>

    <Block title="Services" source="src/data/services.js — PDF §4 A–G (description and scope verbatim)">
      <ol className={styles.dumpList}>
        {services.map((s) => (
          <li key={s.id}>
            <p className="ia-t-label">
              {s.id} · {s.group} · #{s.slug}
            </p>
            <p className="ia-t-body-lg">
              <strong>{s.title}</strong> — {s.tagline}
            </p>
            <p className="ia-t-body">{s.description}</p>
            <ul className={styles.bullets}>
              {s.scope.map((item) => (
                <li key={item} className="ia-t-small">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="ia-t-small">
        Form options: {serviceTitles.join(' · ')} · {SOMETHING_ELSE}
      </p>
    </Block>

    <Block title="Process" source="src/data/process.js — PDF §7 (verbatim)">
      <ol className={styles.dumpList}>
        {processSteps.map((s) => (
          <li key={s.id}>
            <p className="ia-t-body">
              <strong>
                {s.num}. {s.title}
              </strong>{' '}
              — {s.description}
            </p>
          </li>
        ))}
      </ol>
      <p className="ia-t-small">
        Phases: {phases.map((p) => `${p.title} (${p.steps.join(', ')})`).join(' · ')}
      </p>
    </Block>

    <Block title="Frequently asked questions" source="src/data/faqs.js — PDF §8 (verbatim)">
      <ol className={styles.dumpList}>
        {faqs.map((f) => (
          <li key={f.id}>
            <p className="ia-t-body">
              <strong>
                {f.id.toUpperCase()}. {f.question}
              </strong>
            </p>
            <p className="ia-t-body">{f.answer}</p>
            <p className="ia-t-caption">Topics: {f.topics.join(', ')}</p>
          </li>
        ))}
      </ol>
    </Block>

    <Block title="Projects" source="src/data/projects.js — categories PDF §5; entries from the client's photographs, unverified (D-07)">
      <ul className={styles.dumpList}>
        {categories.map((c) => (
          <li key={c.id} className="ia-t-small">
            <strong>{c.title}</strong> — {c.description}
          </li>
        ))}
      </ul>
      <ol className={styles.dumpList}>
        {projects.map((p) => (
          <li key={p.slug}>
            <p className="ia-t-label">
              /portfolio/{p.slug} · {p.category} · verified: {String(p.verified)}
            </p>
            <p className="ia-t-body-lg">
              <strong>{p.title}</strong>
            </p>
            <p className="ia-t-body">{p.summary}</p>
            <p className="ia-t-small">
              {p.type} · Scope: {p.scope} · Focus: {p.focus}
            </p>
            <p className="ia-t-caption">
              Images: {p.images.join(', ')} · covers {p.cover.tall}, {p.cover.wide} · location, area, year, client: not
              supplied
            </p>
          </li>
        ))}
      </ol>
    </Block>

    <Block title="About the practice" source="src/data/studioContent.js — PDF §1, §2 (verbatim)">
      <p className="ia-t-body">{studioContent.positioning}</p>
      {studioContent.about.map((p) => (
        <p key={p.slice(0, 24)} className="ia-t-body">
          {p}
        </p>
      ))}
      <p className="ia-t-body">
        <strong>Vision.</strong> {studioContent.vision}
      </p>
      <ul className={styles.bullets}>
        {studioContent.mission.map((m) => (
          <li key={m} className="ia-t-body">
            {m}
          </li>
        ))}
      </ul>
      <dl className={styles.facts}>
        {studioContent.philosophy.map((p) => (
          <Fact key={p.id} label={p.title}>
            {p.text}
          </Fact>
        ))}
      </dl>
    </Block>

    <Block title="Why choose In-Arch" source="src/data/studioContent.js — PDF §6 (verbatim)">
      <p className="ia-t-body">
        <strong>{studioContent.differentiatorsIntro.title}.</strong> {studioContent.differentiatorsIntro.text}
      </p>
      <ol className={styles.dumpList}>
        {studioContent.differentiators.map((d) => (
          <li key={d.num} className="ia-t-body">
            <strong>
              {d.num}. {d.title}:
            </strong>{' '}
            {d.text}
          </li>
        ))}
      </ol>
    </Block>

    <Block title="Principal architect" source="src/data/studioContent.js — PDF §3 (verbatim)">
      <p className="ia-t-body-lg">
        <strong>{studioContent.principal.name}</strong> — {studioContent.principal.role}
      </p>
      {studioContent.principal.bio.map((p) => (
        <p key={p.slice(0, 24)} className="ia-t-body">
          {p}
        </p>
      ))}
      <ul className={styles.bullets}>
        {studioContent.principal.credentials.map((c) => (
          <li key={c} className="ia-t-body">
            {c}
          </li>
        ))}
      </ul>
      <table className={styles.bytes}>
        <caption className="ia-t-label">Professional experience</caption>
        <thead>
          <tr>
            <th scope="col">Organisation</th>
            <th scope="col">Designation</th>
            <th scope="col">Period</th>
          </tr>
        </thead>
        <tbody>
          {studioContent.principal.experience.map((r) => (
            <tr key={r.organisation + r.designation}>
              <td>{r.organisation}</td>
              <td>{r.designation}</td>
              <td>{r.period || <Missing />}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="ia-t-body">
        <strong>Education.</strong> {studioContent.principal.education.degree},{' '}
        {studioContent.principal.education.institution}, {studioContent.principal.education.place}.
      </p>
      <p className="ia-t-body">
        <strong>Internship.</strong> {studioContent.principal.internship.organisation},{' '}
        {studioContent.principal.internship.period}. {studioContent.principal.internship.note}
      </p>
    </Block>

    <Block title="Home, contact and CTA lines" source="src/data/studioContent.js — PDF §9, §10 (verbatim)">
      <p className="ia-t-body">
        <strong>{studioContent.homeIntro.title}</strong> {studioContent.homeIntro.paragraphs.join(' ')}
      </p>
      <p className="ia-t-body">{studioContent.heroLine}</p>
      <p className="ia-t-body">
        <strong>{studioContent.contactInvitation.title}</strong> {studioContent.contactInvitation.text}
      </p>
      <p className="ia-t-body">
        <strong>{studioContent.closingCta.title}</strong> {studioContent.closingCta.text} {studioContent.closingCta.action}
      </p>
      <p className="ia-t-small">CTA labels: {Object.values(studioContent.ctaLabels).join(' · ')}</p>
    </Block>

    <Block title="Interior Design page" source="src/data/interiors.js — PDF §4 B, G (verbatim items, regrouped)">
      <p className="ia-t-body">{interiors.intro}</p>
      <dl className={styles.facts}>
        {interiors.scopeGroups.map((g) => (
          <Fact key={g.id} label={g.title}>
            {g.items.join(' ')}
          </Fact>
        ))}
        <Fact label={interiors.renovation.title}>{interiors.renovation.items.join(' ')}</Fact>
        <Fact label="FAQs shown">{interiors.interiorFaqIds.join(', ')}</Fact>
      </dl>
      <ul className={styles.dumpList}>
        {interiors.roomStories.map((s) => (
          <li key={s.id} className="ia-t-body">
            <strong>{s.title}.</strong> {s.text}{' '}
            <span className="ia-t-caption">
              ({s.images.join(', ')} → {s.projects.join(', ')})
            </span>
          </li>
        ))}
      </ul>
      <p className="ia-t-small">
        Materials: {interiors.materials.map((m) => `${m.label} (${m.image})`).join(' · ')}
      </p>
    </Block>

    <Block title="Credits" source="src/data/credits.js and public/images/inarch/CREDITS.md">
      <ul className={styles.dumpList}>
        {credits.map((c) => (
          <li key={c.id} className="ia-t-small">
            <strong>{c.name}</strong> — {c.source}; {c.licence}. {c.changes}
          </li>
        ))}
      </ul>
      <p className="ia-t-small">
        Footer credits required: {footerCredits.length ? footerCredits.map((c) => c.label).join(', ') : 'none'}
      </p>
      <ul className={styles.dumpList}>
        {pendingAssets.map((p) => (
          <li key={p.id} className="ia-t-small">
            <strong>Pending: {p.wanted}</strong> — {p.reason} {p.fallback}
          </li>
        ))}
      </ul>
    </Block>
  </div>
);

export default AssetsContent;
