/* ============================================
   interiors — content for the Interior Design page
   --------------------------------------------
   Source: `details of in-arch.pdf` §4 B (Interior Design) and G
   (Renovation & Interior Upgradation). Scope items verbatim, regrouped
   under four headings; nothing added.

   `roomStories` pair short observational copy with the client's own
   photographs (image keys in src/data/imageManifest.json) and the projects
   they come from (src/data/projects.js). The copy describes only what the
   pictures show. `materials` are the six texture swatches cut from the same
   photographs for the material board.
   ============================================ */

import { getService } from './services';

const interiorService = getService('e02');
const renovationService = getService('e07');

/** §4 B — the service's own description, verbatim. */
export const intro = interiorService.description;

/** §4 B — the twelve scope items, verbatim, in four groups. */
export const scopeGroups = [
  {
    id: 'living',
    title: 'Living spaces',
    items: ['Residential interior design.', 'Living room and bedroom design.'],
  },
  {
    id: 'kitchens-bathrooms',
    title: 'Kitchens and bathrooms',
    items: ['Modular kitchen design.', 'Bathroom design.'],
  },
  {
    id: 'workplaces-retail',
    title: 'Workplaces and retail',
    items: ['Office and corporate interiors.', 'Commercial and retail interiors.', 'Institutional interiors.'],
  },
  {
    id: 'detail-finish',
    title: 'Detail and finish',
    items: [
      'False ceiling and lighting design.',
      'Wall panelling and decorative finishes.',
      'Furniture and storage planning.',
      'Material and colour consultations.',
      'Detailed interior drawings.',
    ],
  },
];

/** §4 G — renovation and upgradation, verbatim. */
export const renovation = {
  title: renovationService.title,
  description: renovationService.description,
  items: renovationService.scope,
};

/** The FAQs this page shows (ids in src/data/faqs.js). */
export const interiorFaqIds = ['q3', 'q4', 'q6', 'q7', 'q8'];

/** Three picture-led stories, each tied to the projects its photographs come from. */
export const roomStories = [
  {
    id: 'living',
    title: 'Living spaces',
    text: 'Arched niches lined in fluted panels, each lit by its own lamp, and an open-shelf partition that divides the room without closing it off.',
    images: ['interiors-living'],
    projects: ['arched-niche-living-room'],
  },
  {
    id: 'kitchens',
    title: 'Kitchens',
    text: 'High-gloss units, stone-look worktops and splashbacks, and light set beneath the wall units, planned around how the kitchen is used.',
    images: ['interiors-kitchen', 'interiors-detail-c'],
    projects: ['black-and-veined-stone-kitchen', 'ivory-kitchen'],
  },
  {
    id: 'made-to-measure',
    title: 'Made-to-measure details',
    text: 'Prayer units built to fit their walls: lattice-cut doors, backlit panels, lit shelves and closed storage beneath.',
    images: ['interiors-detail-a', 'interiors-detail-b'],
    projects: ['prayer-units'],
  },
];

/** The material board: six swatches cut from the client's photographs. */
export const materials = [
  { id: 'fluted', label: 'Fluted panelling', image: 'sw-fluted', project: 'arched-niche-living-room' },
  { id: 'stone', label: 'Veined stone-look surface', image: 'sw-stone', project: 'walnut-and-marble-living-hall' },
  { id: 'lattice', label: 'Lattice screen', image: 'sw-lattice', project: 'prayer-units' },
  { id: 'gloss', label: 'Gloss cabinetry', image: 'sw-gloss', project: 'ivory-kitchen' },
  { id: 'moulding', label: 'Wall moulding', image: 'sw-moulding', project: 'panelled-living-hall' },
  { id: 'tufting', label: 'Buttoned upholstery', image: 'sw-tufting', project: 'arched-niche-living-room' },
];

const interiors = { intro, scopeGroups, renovation, interiorFaqIds, roomStories, materials };

export default interiors;
