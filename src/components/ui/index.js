/* ============================================
   IN-ARCH UI kit — barrel
   --------------------------------------------
   import { Section, Container, Heading, Button } from '../../components/ui';

   Every primitive lives in its own folder (Name/Name.jsx + Name.module.css)
   and must sit inside an `.ia` scope. They read only the tone variables, so
   each is correct on light, sand, paper and dark without variants.

   Tree-shaking: ./package.json declares the kit free of side effects except
   its CSS, so webpack drops every re-export a page does not use — and with
   it that primitive's stylesheet. Importing one primitive never brings in
   the others' CSS, and lottie-web is only ever loaded by LottieIcon's
   dynamic import. Nothing here registers a listener at module scope.

   The overlay hooks live in src/hooks/ (useFocusTrap, useScrollLock);
   Portal is here.
   ============================================ */

// Layout
export { default as Container } from './Container/Container';
export { default as Grid, Col } from './Grid/Grid';
export { default as Section } from './Section/Section';
export { default as Stack } from './Stack/Stack';

// Type
export { default as Eyebrow } from './Eyebrow/Eyebrow';
export { default as Heading } from './Heading/Heading';
export { default as Text } from './Text/Text';
export { default as Lede } from './Lede/Lede';
export { default as VisuallyHidden } from './VisuallyHidden/VisuallyHidden';

// Actions
export { default as Button } from './Button/Button';
export { default as TextLink } from './TextLink/TextLink';
export { default as IconButton } from './IconButton/IconButton';
export { default as Icon, ICON_NAMES } from './Icon/Icon';
export { default as LinkProvider, useLinkComponent } from './LinkProvider/LinkProvider';

// Forms
export { default as Field, useField } from './Field/Field';
export { default as TextInput } from './TextInput/TextInput';
export { default as TextArea } from './TextArea/TextArea';
export { default as SelectInput } from './SelectInput/SelectInput';
export { default as ChoiceChips } from './ChoiceChips/ChoiceChips';
export { default as Notice } from './Notice/Notice';

// Media and brand
export { default as Logo } from './Logo/Logo';
export { default as Picture } from './Picture/Picture';
export { default as Frame } from './Frame/Frame';
export { default as Figure } from './Figure/Figure';
export { default as LineIcon } from './LineIcon/LineIcon';
export { default as LottieIcon } from './LottieIcon/LottieIcon';
export { default as Illustration } from './Illustration/Illustration';

// Content
export { default as ProjectTile } from './ProjectTile/ProjectTile';
export { default as Accordion, AccordionItem } from './Accordion/Accordion';
export { default as FactList } from './FactList/FactList';
export { default as Rule } from './Rule/Rule';
export { default as Chip } from './Chip/Chip';
export { default as ScrollMarquee } from './ScrollMarquee/ScrollMarquee';
export { default as Skeleton } from './Skeleton/Skeleton';

// Overlays
export { default as Portal } from './Portal/Portal';
