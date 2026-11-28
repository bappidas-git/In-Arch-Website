/* ============================================
   SEO Configuration
   --------------------------------------------
   Central configuration for every SEO setting, page title/description and
   schema input.

   IN-ARCH redesign (prompt 04 onwards): the SITE-LEVEL values (site name,
   default title and description, title template, organization, site URL)
   read `studio` (src/data/siteConfig.js) and the client's document
   (`details of in-arch.pdf` §12). The entries of the pages that are still
   the old Dulcey pages (home, about, expertise, industries, contact,
   notFound) are left exactly as they were until each page's prompt
   replaces it (home: prompt 06), and `pages.admin` is admin-bound
   (prompt 15 only).

   Everything here is generated from the single sources of truth so the
   metadata can never drift from the visible site:
     - company / contact facts   → src/data/siteConfig.js
     - the seven services        → src/data/services.js
     - the ten old expertise areas (old /expertise entry) → src/data/expertiseData.js
     - the seven sectors served  → src/data/industriesData.js
     - the nav labels (used for breadcrumb names) → src/data/navigation.js

   Two layers consume this file:
     1. runtime  — src/utils/seo.js generators + SEOHead inject JSON-LD by
        element id and rewrite the head on every client-side navigation.
     2. static   — public/index.html carries the home page's title,
        description and Open Graph / Twitter text. Its static JSON-LD
        blocks, canonical and og:url / twitter:url were removed in prompt 04
        (they named the previous domain); SEOHead creates all of them at run
        time, and prompt 18 restores a static copy once the domain is known.

   Deliberately NOT modelled (no fabricated facts — Google structured-data
   guidelines): LocalBusiness, PostalAddress, geo coordinates, opening
   hours, aggregate ratings, and FAQPage (the site has no visible FAQ).
   ============================================ */

import { siteConfig, studio, studioUrl } from '../data/siteConfig';
import { expertiseTitles } from '../data/expertiseData';
import { industries } from '../data/industriesData';
import { services, serviceTitles } from '../data/services';
import { NAV_LINKS } from '../data/navigation';

// The studio's domain is not known yet (owner decision D-05), so run-time
// tags use the origin the site is served from: `studioUrl()` returns
// `studio.siteUrl` once it is set. No trailing slash.
const SITE_URL = studioUrl('/').replace(/\/$/, '');

/** Absolute URL for a route path ('/' → siteUrl + '/'). */
const absolute = (path) => `${SITE_URL}${path}`;

/** The nav label for a route — breadcrumb names match the visible nav. */
const navLabel = (path) =>
  (NAV_LINKS.find((link) => link.to === path) || {}).label;

/** Comma-joined keyword string, brand-prefixed. */
const keywords = (...terms) => [siteConfig.brandName, ...terms].join(', ');

const industryNames = industries.map((industry) => industry.name);

// ---------- IN-ARCH site-level values (prompt 04) ----------

// `details of in-arch.pdf` §12, "Suggested Homepage SEO Title" and "Meta
// Description", verbatim.
const STUDIO_TITLE = `${studio.fullName} | Architects in Patna, Bihar`;
const STUDIO_DESCRIPTION =
  'In-Arch Architects & Interior Designer, led by Ar. Mohammad Hassanuddin, offers architectural design, residential planning, interior design, 3D visualisation and project consultancy in Patna, Bihar.';
const TITLE_TEMPLATE = `%s | ${studio.name}`;

/** A page title through the site template: "Portfolio | IN-ARCH". */
const titled = (title) => TITLE_TEMPLATE.replace('%s', title);

/** §12 "Suggested SEO Keywords", studio-prefixed. */
const studioKeywords = (...terms) => [studio.fullName, ...terms].join(', ');

/** The studio's social profiles that exist (D-12: none supplied yet). */
const studioSameAs = Object.values(studio.social).filter(Boolean);

export const seoConfig = {
  // =========================================
  // Site-level Settings
  // =========================================
  siteName: studio.fullName,
  siteUrl: SITE_URL,
  defaultTitle: STUDIO_TITLE,
  titleTemplate: TITLE_TEMPLATE,
  defaultDescription: STUDIO_DESCRIPTION,
  defaultImage: `${SITE_URL}/og-image.png`,
  locale: 'en_IN',
  language: 'en',

  // =========================================
  // Organization Details — IN-ARCH
  // --------------------------------------------
  // A plain `Organization` for now: the postal address is incomplete (no
  // building or PIN code, D-04), no email is published (D-03) and no hours
  // beyond "from 10:00 AM" are known (D-14), so nothing is claimed that the
  // client has not supplied. Prompt 18 owns the structured-data audit.
  // =========================================
  organization: {
    schemaType: 'Organization',
    name: studio.fullName,
    legalName: studio.fullName,
    url: SITE_URL,
    // The espresso lockup (light backgrounds), absolute for crawlers.
    logo: `${SITE_URL}${studio.logos.lockupOnLight.src}`,
    description: studio.blurb,
    slogan: studio.tagline,
    contactPoint: {
      // schema.org prefers a hyphenated E.164-ish string.
      telephone: studio.phoneDisplay.replace(/\s+/g, '-'),
      contactType: 'customer service',
      // Empty until supplied (D-03); the generator drops an empty email.
      email: studio.email,
    },
    // Empty arrays are dropped by the generator.
    sameAs: studioSameAs,
    knowsAbout: serviceTitles,
  },

  // =========================================
  // Service list (ItemList of Service)
  // --------------------------------------------
  // The seven services (src/data/services.js, PDF §4 A–G, owner decision
  // D-06), so the schema and the visible service list can never disagree.
  // Each item deep-links to its service on /expertise (#e01 … #e07).
  // =========================================
  services: {
    name: 'Services',
    items: services.map((service) => ({
      name: service.title,
      description: service.description,
      url: `${SITE_URL}/expertise#${service.id}`,
    })),
  },

  // =========================================
  // Page-specific SEO Settings
  // --------------------------------------------
  // Titles are the mockup <title> values verbatim. Descriptions are written
  // from each page's own visible copy and kept to ~150–160 characters.
  // `path` drives the canonical URL; `breadcrumb` is the nav label.
  // =========================================
  pages: {
    // IN-ARCH Home (prompt 06): PDF §12's homepage title and description,
    // verbatim, and its keyword list without "Best architects in Patna" —
    // a superlative the site does not claim.
    home: {
      path: '/',
      title: STUDIO_TITLE,
      description: STUDIO_DESCRIPTION,
      keywords: studioKeywords(
        'Architects in Patna',
        'Architecture firms in Patna',
        'Interior designers in Patna',
        'Residential architects in Patna',
        'Commercial architects in Bihar',
        'House design in Patna',
        'Modern house elevation design',
        'Interior design consultancy in Patna',
        'Architectural 3D visualisation',
        'Modular kitchen design in Patna',
        'Building planning and design in Patna',
      ),
      robots: 'index, follow',
      // The service list is relevant to the home index and /expertise only.
      services: true,
    },
    about: {
      path: '/about',
      breadcrumb: navLabel('/about'),
      title: `About — ${siteConfig.brandName}`,
      description:
        'Built on experience, defined by trust — Dulcey Lead Services brings people, processes, information, operations and leadership together, with depth in pharma.',
      keywords: keywords(
        'about Dulcey',
        'business consulting India',
        'organizational capability',
        'pharmaceutical business experience',
      ),
      robots: 'index, follow',
    },
    expertise: {
      path: '/expertise',
      breadcrumb: navLabel('/expertise'),
      title: `Our Expertise — ${siteConfig.brandName}`,
      description:
        'Ten connected areas of experience — HR, administration, analytics, pharma, corporate and legal, leadership, soft skills, academics, coaching and branding.',
      keywords: keywords(...expertiseTitles),
      robots: 'index, follow',
      services: true,
    },
    industries: {
      path: '/industries',
      breadcrumb: navLabel('/industries'),
      title: `Who We Serve — ${siteConfig.brandName}`,
      description:
        'Our expertise, your industry — pharma and healthcare, hospitals, corporates, marketing and sales teams, business schools, startups, entrepreneurs, investors.',
      keywords: keywords(...industryNames),
      robots: 'index, follow',
    },
    contact: {
      path: '/contact',
      breadcrumb: navLabel('/contact'),
      title: `Contact — ${siteConfig.brandName}`,
      description: `Let's build what comes next. Call ${siteConfig.phoneDisplay}, email us, or send an enquiry — we usually reply within a day. One conversation is where it starts.`,
      keywords: keywords(
        'contact',
        'business enquiry',
        'business consulting enquiry',
        siteConfig.phoneDisplay,
      ),
      robots: 'index, follow',
    },

    // ---- IN-ARCH pages added by prompt 04 ----
    // Titles from `details of in-arch.pdf` §12 ("Suggested individual page
    // SEO titles"). Until each page's prompt lands its route renders the
    // interim page and SEOHead resolves it to `pending` (noindex) instead.
    interiors: {
      path: '/interior-design',
      breadcrumb: navLabel('/interior-design'),
      title: titled('Interior Designers in Patna, Bihar'),
      description:
        'Interior design by In-Arch Architects & Interior Designer in Patna, Bihar: homes, modular kitchens, wall panelling, false ceilings, lighting and made-to-measure storage.',
      keywords: studioKeywords(
        'Interior designers in Patna',
        'Interior design consultancy in Patna',
        'Modular kitchen design in Patna',
      ),
      robots: 'index, follow',
    },
    portfolio: {
      path: '/portfolio',
      breadcrumb: navLabel('/portfolio'),
      title: titled('Architecture & Interior Design Portfolio'),
      description:
        'Selected interiors by In-Arch Architects & Interior Designer, Patna: living halls, kitchens and made-to-measure prayer units, photographed as completed.',
      keywords: studioKeywords('Architecture firms in Patna', 'Interior designers in Patna'),
      robots: 'index, follow',
    },
    // One case study at /portfolio/:slug. Prompt 12 gives each project its
    // own title and description from src/data/projects.js.
    project: {
      path: '/portfolio',
      breadcrumb: navLabel('/portfolio'),
      title: titled('Architecture & Interior Design Portfolio'),
      description: STUDIO_DESCRIPTION,
      robots: 'index, follow',
    },

    // ---- Non-indexable routes ----
    // A route whose page is still being built (prompt 04's interim page).
    pending: {
      path: '/',
      title: titled('This page is being prepared'),
      description: STUDIO_DESCRIPTION,
      robots: 'noindex, nofollow',
      noindex: true,
    },
    admin: {
      path: '/admin',
      // The admin panel's browser-tab title.
      title: `Admin Panel — ${siteConfig.brandName}`,
      description: '',
      robots: 'noindex, nofollow',
      noindex: true,
    },
    notFound: {
      path: '/404',
      title: `Page Not Found — ${siteConfig.brandName}`,
      description:
        'The page you are looking for does not exist. Return to Dulcey Lead Services to explore our expertise, the sectors we serve, or start a conversation.',
      robots: 'noindex, nofollow',
      noindex: true,
    },
  },

  // Convenience: absolute-URL helper shared with the runtime generators.
  absolute,
};

export default seoConfig;
