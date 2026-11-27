/* ============================================
   services — the seven services (IN-ARCH)
   --------------------------------------------
   Source: `details of in-arch.pdf` §4 A–G. `description` and `scope` are
   verbatim; `tagline` is the series' own short line. The PDF calls the list
   "proposed … the office should confirm"; owner decision D-06 adopts it as
   listed (to be confirmed by the client before launch).

   - `id` keeps the `/expertise#e0N` deep-link shape of the old site.
   - `title` is also the value stored in a lead's `service_interest`.
   - `icon` names a file in public/images/inarch/icons/ (<icon>.svg).
   - `image` is a key in src/data/imageManifest.json, or null: only the
     interior work has the client's own photographs. Architecture,
     visualisation and site work are carried by type and icons — never by
     borrowed buildings.

   The admin's "Interested In" filter still reads `expertiseTitles` from
   expertiseData.js until prompt 15 (owner decision D-02).
   ============================================ */

export const services = [
  {
    id: 'e01',
    num: '01',
    slug: 'architectural-design',
    title: 'Architectural Design & Consultancy',
    tagline: 'Concept, planning and technical design, considered together.',
    description:
      'We provide architectural design solutions that combine creative concepts, functional planning and technical considerations to create buildings that respond to their surroundings and users.',
    scope: [
      'Architectural concept development.',
      'Site analysis and feasibility studies.',
      'Building planning and space optimisation.',
      'Residential architecture.',
      'Commercial architecture.',
      'Institutional and public building design.',
      'Building elevations and facade development.',
      'Architectural working drawings.',
      'Building sections and construction details.',
      'Material and finish selection.',
      'Design coordination and consultancy.',
    ],
    group: 'architecture',
    icon: 'service-e01-architecture',
    image: null,
  },
  {
    id: 'e02',
    num: '02',
    slug: 'interior-design',
    title: 'Interior Design',
    tagline: 'Space, material, light and furniture, composed as one.',
    description:
      'We design interior environments that reflect individual requirements, combining spatial planning, materials, lighting and furniture to create comfortable and visually cohesive spaces.',
    scope: [
      'Residential interior design.',
      'Living room and bedroom design.',
      'Modular kitchen design.',
      'Bathroom design.',
      'Office and corporate interiors.',
      'Commercial and retail interiors.',
      'Institutional interiors.',
      'False ceiling and lighting design.',
      'Wall panelling and decorative finishes.',
      'Furniture and storage planning.',
      'Material and colour consultations.',
      'Detailed interior drawings.',
    ],
    group: 'interiors',
    icon: 'service-e02-interiors',
    image: 'expertise-interiors',
  },
  {
    id: 'e03',
    num: '03',
    slug: 'residential-architecture',
    title: 'Residential Architecture',
    tagline: 'Homes planned around the way a family lives.',
    description:
      'We develop residential design solutions that respond to lifestyle, family requirements, site conditions and budget.',
    scope: [
      'Independent houses and villas.',
      'Duplex residences.',
      'Multi-storey residential buildings.',
      'Apartment planning.',
      'Residential layouts.',
      'Facade design.',
      'Space planning and circulation.',
      'Terrace and balcony design.',
      'Interior integration.',
    ],
    group: 'architecture',
    icon: 'service-e03-residential',
    image: null,
  },
  {
    id: 'e04',
    num: '04',
    slug: 'commercial-institutional-architecture',
    title: 'Commercial & Institutional Architecture',
    tagline: 'Places of work and gathering, planned to run well.',
    description:
      'We undertake the design of commercial and institutional spaces with a focus on operational efficiency, architectural identity and user experience.',
    scope: [
      'Office buildings.',
      'Commercial complexes.',
      'Retail establishments and showrooms.',
      'Educational buildings.',
      'Community and multipurpose halls.',
      'Mixed-use developments.',
      'Institutional facilities.',
      'Functional planning and circulation.',
    ],
    group: 'architecture',
    icon: 'service-e04-commercial',
    image: null,
  },
  {
    id: 'e05',
    num: '05',
    slug: '3d-visualisation',
    title: '3D Visualisation & Architectural Presentation',
    tagline: 'See the design before it is built.',
    description:
      'We translate architectural concepts into realistic visual representations, helping clients understand the proposed design before construction.',
    scope: [
      '3D exterior rendering.',
      'Interior 3D rendering.',
      'Architectural walkthroughs.',
      'Conceptual visualisation.',
      'Material and lighting visualisation.',
      'Presentation drawings.',
      'Design development imagery.',
    ],
    group: 'visualisation',
    icon: 'service-e05-visualisation',
    image: null,
  },
  {
    id: 'e06',
    num: '06',
    slug: 'project-management',
    title: 'Project Management & Site Consultancy',
    tagline: 'Keeping the design intent intact on site.',
    description:
      'We provide professional coordination and consultancy during project development to help maintain design intent, technical quality and construction coordination.',
    scope: [
      'Project planning and coordination.',
      'Design and drawing coordination.',
      'Site inspections.',
      'Work progress monitoring.',
      'Contractor coordination.',
      'Material and workmanship review.',
      'Execution-stage design support.',
      'Project management consultancy.',
    ],
    group: 'delivery',
    icon: 'service-e06-site',
    image: null,
  },
  {
    id: 'e07',
    num: '07',
    slug: 'renovation',
    title: 'Renovation & Interior Upgradation',
    tagline: 'Existing spaces, thoughtfully reworked.',
    description:
      'We help transform existing spaces through thoughtful renovation, improved planning and contemporary design interventions.',
    scope: [
      'Residential renovation.',
      'Interior remodelling.',
      'Kitchen and bathroom upgrades.',
      'Facade renovation.',
      'Space reconfiguration.',
      'Furniture and storage upgrades.',
      'Finish and material replacement.',
    ],
    group: 'interiors',
    icon: 'service-e07-renovation',
    image: null,
  },
];

/** The four groups the services fall into, in display order. */
export const serviceGroups = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'visualisation', label: 'Visualisation' },
  { id: 'delivery', label: 'Delivery' },
];

/** The seven titles, in order — the form's options and `service_interest` values. */
export const serviceTitles = services.map((s) => s.title);

/**
 * The form's last option. Exactly this string: the admin's filter list
 * (src/admin/pages/LeadManagement.jsx) hard-codes it.
 */
export const SOMETHING_ELSE = 'Something else';

/** Service by id (`e01`…) or slug; undefined if unknown. */
export const getService = (idOrSlug) => services.find((s) => s.id === idOrSlug || s.slug === idOrSlug);

export default services;
