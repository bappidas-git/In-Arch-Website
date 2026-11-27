/* ============================================
   projects — the portfolio, built only from the client's photographs
   --------------------------------------------
   Categories: `details of in-arch.pdf` §5, names and one-line descriptions
   verbatim.

   Projects: seven entries made from the 13 supplied photographs (all
   completed residential interiors). Owner decision D-07:
   - titles describe what is visible — no invented names (the dummy's
     names are not used anywhere, D-21);
   - `location`, `area`, `year` and `client` exist but are empty: render
     them only when filled;
   - `verified: false` until the office confirms the entry. The grouping of
     photographs into projects is inferred from what the pictures show.
   - `scope` / `focus` for the first six are the wording of PDF §5
     "Project 08" (interior detailing) and "Project 04" (kitchens), which the
     PDF wrote from these same photographs. `type` is that PDF's "Project
     Type" without its "Renovation" qualifier, which cannot be attributed to
     a particular room.
   - `summary` says only what can be seen, with cautious material words
     ("timber-tone", "stone-look", "high-gloss"): no species, brand, size,
     cost, date, place or person.

   The PDF also suggests six entries with no photograph or render in the
   repository (a congregational hall, a multi-storey residential building,
   a commercial building, a modern house, an office interior, a resort);
   they are not created. Add them here, with their images in
   scripts/image-specs.js, when IN-ARCH supplies its own pictures.

   Image keys refer to src/data/imageManifest.json; `cover.tall` (4:5) and
   `cover.wide` (3:2) are the listing and case-study covers, `images` the
   gallery (cover photograph first).
   ============================================ */

export const categories = [
  { id: 'residential-architecture', title: 'Residential Architecture', description: 'Houses, villas, duplexes and apartments.' },
  {
    id: 'commercial-architecture',
    title: 'Commercial Architecture',
    description: 'Commercial buildings, offices and mixed-use developments.',
  },
  { id: 'interior-design', title: 'Interior Design', description: 'Residential and commercial interior spaces.' },
  { id: 'modular-kitchens', title: 'Modular Kitchens', description: 'Kitchen planning and interior execution.' },
  { id: 'institutional-projects', title: 'Institutional Projects', description: 'Community halls and specialised spaces.' },
  {
    id: 'landscape-outdoor',
    title: 'Landscape & Outdoor Spaces',
    description: 'Outdoor environments and landscaped spaces.',
  },
];

const INTERIOR_SCOPE = 'Interior detailing and design';
const INTERIOR_FOCUS = 'Wall panelling, lighting, furniture integration and decorative finishes';
const KITCHEN_SCOPE = 'Kitchen and interior design';
const KITCHEN_FOCUS = 'Modular storage, contemporary finishes, lighting and efficient kitchen planning';
const RESIDENTIAL_INTERIOR = 'Residential Interior';

const unconfirmed = { location: '', area: '', year: '', client: '', verified: false };

export const projects = [
  {
    slug: 'walnut-and-marble-living-hall',
    title: 'Living Hall with a Backlit Feature Wall',
    category: 'interior-design',
    type: RESIDENTIAL_INTERIOR,
    scope: INTERIOR_SCOPE,
    focus: INTERIOR_FOCUS,
    summary:
      'A long living hall arranged around one feature wall: a backlit veined stone-look panel set into fluted timber-tone boarding above a floating console. Open shelving with concealed light strips stands beside it, under tray ceilings outlined in light.',
    images: ['g-ph08', 'g-ph07'],
    cover: { tall: 'pr-walnut-cover-tall', wide: 'pr-walnut-cover-wide' },
    ...unconfirmed,
  },
  {
    slug: 'arched-niche-living-room',
    title: 'Living Room with Arched Niches',
    category: 'interior-design',
    type: RESIDENTIAL_INTERIOR,
    scope: INTERIOR_SCOPE,
    focus: INTERIOR_FOCUS,
    summary:
      'Two arched niches lined in green fluted panels, each with its own wall lamp, frame a buttoned sofa beneath a cove-lit ceiling. An arched open-shelf partition separates the room from the space beyond, where a buttoned bench forms a seating nook.',
    images: ['g-ph14', 'g-ph01', 'g-ph11'],
    cover: { tall: 'pr-arches-cover-tall', wide: 'pr-arches-cover-wide' },
    ...unconfirmed,
  },
  {
    slug: 'panelled-living-hall',
    title: 'Panelled Living Hall',
    category: 'interior-design',
    type: RESIDENTIAL_INTERIOR,
    scope: INTERIOR_SCOPE,
    focus: INTERIOR_FOCUS,
    summary:
      'Framed mouldings run across the walls beneath a tray ceiling outlined in light. At one end, a backlit wave-textured wall sits between fluted panels above a floating console.',
    images: ['g-ph06', 'g-ph05'],
    cover: { tall: 'pr-panelled-cover-tall', wide: 'pr-panelled-cover-wide' },
    ...unconfirmed,
  },
  {
    slug: 'graphite-gloss-kitchen',
    title: 'Graphite Gloss Kitchen',
    category: 'modular-kitchens',
    type: RESIDENTIAL_INTERIOR,
    scope: KITCHEN_SCOPE,
    focus: KITCHEN_FOCUS,
    summary:
      'A U-shaped kitchen in graphite high-gloss units, laid out symmetrically around the hob. Warm light runs beneath the wall units, and a lit frame is set into the ceiling.',
    images: ['g-ph03', 'g-ph10'],
    cover: { tall: 'pr-graphite-cover-tall', wide: 'pr-graphite-cover-wide' },
    ...unconfirmed,
  },
  {
    slug: 'black-and-veined-stone-kitchen',
    title: 'Black Kitchen with a Veined Splashback',
    category: 'modular-kitchens',
    type: RESIDENTIAL_INTERIOR,
    scope: KITCHEN_SCOPE,
    focus: KITCHEN_FOCUS,
    summary:
      'An L-shaped kitchen pairs black high-gloss wall units with a white worktop. A blue-veined stone-look splashback runs the length of the counter, lit from beneath the units.',
    images: ['g-ph02'],
    cover: { tall: 'pr-black-cover-tall', wide: 'pr-black-cover-wide' },
    ...unconfirmed,
  },
  {
    slug: 'ivory-kitchen',
    title: 'Ivory Kitchen with a Dark Worktop',
    category: 'modular-kitchens',
    type: RESIDENTIAL_INTERIOR,
    scope: KITCHEN_SCOPE,
    focus: KITCHEN_FOCUS,
    summary:
      'Ivory high-gloss units meet a dark stone-look worktop and a grey veined splashback lit from above. Wicker baskets fill an open base unit, and two glazed doors break the row of wall units.',
    images: ['g-ph04'],
    cover: { tall: 'pr-ivory-cover-tall', wide: 'pr-ivory-cover-wide' },
    ...unconfirmed,
  },
  {
    slug: 'prayer-units',
    title: 'Made-to-Measure Prayer Units',
    category: 'interior-design',
    type: RESIDENTIAL_INTERIOR,
    scope: INTERIOR_SCOPE,
    focus: 'Lattice-cut doors, concealed lighting and integrated storage',
    summary:
      'Two prayer units with lattice-cut doors that open onto backlit panels. One sets the panel between lit timber-tone shelves above a stone-look ledge and closed storage; the other stands against a mint wall.',
    images: ['g-ph09', 'g-ph12a', 'g-ph12b'],
    cover: { tall: 'pr-pooja-cover-tall', wide: 'pr-pooja-cover-wide' },
    ...unconfirmed,
  },
];

/** Project by slug, or undefined. */
export const getProject = (slug) => projects.find((p) => p.slug === slug);

/** Category by id, or undefined. */
export const getCategory = (id) => categories.find((c) => c.id === id);

/** Projects in a category, in portfolio order. */
export const projectsInCategory = (id) => projects.filter((p) => p.category === id);

/** The project after `slug`, wrapping round — the case study's "next project". */
export const nextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return i < 0 ? undefined : projects[(i + 1) % projects.length];
};

export default projects;
