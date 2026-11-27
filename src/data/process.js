/* ============================================
   process — how IN-ARCH works, seven steps
   --------------------------------------------
   Source: `details of in-arch.pdf` §7. Titles and descriptions verbatim.

   - `icon` names a static icon (public/images/inarch/icons/<icon>.svg).
   - `lottie` names the animated version (public/images/inarch/lottie/<lottie>.json),
     played once when half visible; the static icon replaces it under
     reduced motion.

   `phases` groups the steps for the Home page without changing what they
   say: Understand (1–2), Imagine (3–4), Detail (5), Deliver (6–7).
   ============================================ */

export const processSteps = [
  {
    id: 'step-01',
    num: '01',
    title: 'Initial Consultation',
    description:
      "Understanding the client's requirements, project objectives, budget, site conditions and expectations.",
    icon: 'process-01-consultation',
    lottie: 'process-01-consultation',
  },
  {
    id: 'step-02',
    num: '02',
    title: 'Site Study & Analysis',
    description: 'Evaluating the site, measurements, orientation, surrounding context and development possibilities.',
    icon: 'process-02-site-study',
    lottie: 'process-02-site-study',
  },
  {
    id: 'step-03',
    num: '03',
    title: 'Conceptual Design',
    description: 'Developing initial concepts, spatial layouts, planning solutions and architectural direction.',
    icon: 'process-03-concept',
    lottie: 'process-03-concept',
  },
  {
    id: 'step-04',
    num: '04',
    title: 'Design Development',
    description:
      'Refining the selected concept through plans, elevations, sections, material selection and 3D visualisation.',
    icon: 'process-04-development',
    lottie: 'process-04-development',
  },
  {
    id: 'step-05',
    num: '05',
    title: 'Detailed Drawings',
    description:
      'Preparing architectural and interior working drawings, specifications and relevant construction details.',
    icon: 'process-05-drawings',
    lottie: 'process-05-drawings',
  },
  {
    id: 'step-06',
    num: '06',
    title: 'Project Coordination',
    description:
      'Coordinating with consultants, contractors and other project stakeholders during implementation, as per the agreed scope.',
    icon: 'process-06-coordination',
    lottie: 'process-06-coordination',
  },
  {
    id: 'step-07',
    num: '07',
    title: 'Project Completion',
    description: 'Reviewing the completed work against the agreed design intent and project requirements.',
    icon: 'process-07-completion',
    lottie: 'process-07-completion',
  },
];

/** Four phases for the Home page; `steps` lists step numbers. */
export const phases = [
  { id: 'understand', title: 'Understand', steps: ['01', '02'] },
  { id: 'imagine', title: 'Imagine', steps: ['03', '04'] },
  { id: 'detail', title: 'Detail', steps: ['05'] },
  { id: 'deliver', title: 'Deliver', steps: ['06', '07'] },
];

/** The "sent / done" animated tick and its static fallback (enquiry success state). */
export const statusIcons = {
  done: { icon: 'status-done', lottie: 'status-done' },
};

/** The steps of one phase, in order. */
export const stepsOfPhase = (phaseId) => {
  const phase = phases.find((p) => p.id === phaseId);
  return phase ? processSteps.filter((s) => phase.steps.includes(s.num)) : [];
};

export default processSteps;
