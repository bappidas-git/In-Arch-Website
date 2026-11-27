/* ============================================
   Design Lab — section registry
   --------------------------------------------
   The Lab (`/__lab`, development only) renders these in order, each in its
   own <section> with an <h2> of `title` and an in-page link from the Lab's
   index. To add a section (prompts 02, 03, …): create a component in
   ./sections/ and append one entry here. `id` must be unique and URL-safe.
   ============================================ */

import ColourSection from './sections/ColourSection';
import TypeSection from './sections/TypeSection';
import FontsSection from './sections/FontsSection';
import SpaceSection from './sections/SpaceSection';
import GridSection from './sections/GridSection';
import MotionSection from './sections/MotionSection';

export const LAB_SECTIONS = [
  { id: 'colour', title: 'Colour and contrast', Component: ColourSection },
  { id: 'type', title: 'Type scale', Component: TypeSection },
  { id: 'fonts', title: 'Fonts and fallbacks', Component: FontsSection },
  { id: 'space', title: 'Space and layout tokens', Component: SpaceSection },
  { id: 'grid', title: 'Grid', Component: GridSection },
  { id: 'motion', title: 'Motion', Component: MotionSection },
];
