/* ============================================
   studioContent — the practice and its principal
   --------------------------------------------
   Source: `details of in-arch.pdf`. Everything here is verbatim:
   §1 brand positioning, §2 About / vision / mission / philosophy, §3 the
   principal, §6 why choose In-Arch, and the §9–§10 contact, CTA and
   homepage lines later prompts use.

   Not supplied by the client, so absent here and silent on the site: a
   registration number, a year of establishment, a quotation from the
   principal, a portrait (owner decisions D-11, D-23; prompts/00_INDEX.md
   §13). The Zenith row has no dates (the PDF says "Dates to be confirmed"),
   so its `period` is '' and nothing is shown for it.
   ============================================ */

/** §1 — brand positioning. */
export const positioning =
  'In-Arch is an architecture and interior design practice focused on creating functional, aesthetically refined and context-responsive spaces. The practice brings together architectural planning, contemporary design, interior detailing and project execution to deliver spaces that balance visual appeal with practical requirements.';

/** §2 — "About In-Arch", five paragraphs. */
export const about = [
  'In-Arch Architects & Interior Designer is an architectural and interior design practice based in Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin.',
  'The practice believes that architecture is more than the creation of buildings; it is about understanding people, their aspirations and the way they interact with their surroundings.',
  'With experience across architectural design and interior projects, In-Arch focuses on developing spaces that are functional, visually appealing and thoughtfully planned. From residential buildings and commercial establishments to interior environments and specialised spaces, the practice approaches every project with attention to detail, design sensitivity and a commitment to quality.',
  "The design philosophy combines contemporary architectural language, efficient space planning, appropriate material selection and practical construction solutions. Each project is approached individually, ensuring that the final outcome responds to the client's requirements, site conditions, budget and aspirations.",
  'At In-Arch, the objective is to transform ideas into meaningful spaces through a collaborative and detail-oriented design process.',
];

/** §2 — "Our Vision". */
export const vision =
  'To establish In-Arch as a trusted architectural and interior design practice recognised for thoughtful design, innovative solutions and the ability to create meaningful built environments.';

/** §2 — "Our Mission", five points. */
export const mission = [
  'To deliver architecture and interior design solutions that balance aesthetics, functionality and sustainability.',
  "To understand every client's requirements and translate their vision into practical design solutions.",
  'To maintain high standards of professional practice, technical detailing and material selection.',
  'To integrate contemporary design approaches with local context and environmental considerations.',
  'To ensure a collaborative approach throughout the design and project development process.',
];

/** §2 — "Our Design Philosophy", four principles. */
export const philosophy = [
  {
    id: 'purpose',
    title: 'Design with Purpose',
    text: 'Every design decision should have a purpose. We prioritise functional planning, spatial efficiency and the experience of the people who use the space.',
  },
  {
    id: 'function',
    title: 'Aesthetics with Functionality',
    text: 'We believe that beautiful spaces should also work efficiently. Our approach combines visual character with practical considerations.',
  },
  {
    id: 'detail',
    title: 'Attention to Detail',
    text: 'From conceptual planning to material selection and construction detailing, we focus on the elements that define the quality of a space.',
  },
  {
    id: 'client',
    title: 'Client-Centric Approach',
    text: "Every project begins with understanding the client's vision, lifestyle, requirements and budget.",
  },
];

/** §6 — "Why Choose In-Arch?": the lead and the seven key differentiators. */
export const differentiatorsIntro = {
  title: 'Spaces Designed Around You',
  text: "At In-Arch, we believe every project deserves an individual approach. We work towards creating spaces that reflect the client's vision while maintaining a strong focus on functionality, design quality and practicality.",
};

export const differentiators = [
  {
    num: '01',
    title: 'Client-Focused Design',
    text: "Every project starts with understanding the client's requirements, preferences and aspirations.",
  },
  {
    num: '02',
    title: 'Architectural Expertise',
    text: 'Professional architectural knowledge and design understanding guide every stage of the project.',
  },
  {
    num: '03',
    title: 'Integrated Design Approach',
    text: 'Architecture, interiors, materials, lighting and spatial planning are considered together.',
  },
  {
    num: '04',
    title: 'Attention to Detail',
    text: 'We emphasise thoughtful detailing, appropriate material selection and design coordination.',
  },
  {
    num: '05',
    title: 'Visualisation Before Execution',
    text: '3D visualisations help clients understand the proposed spaces before implementation.',
  },
  {
    num: '06',
    title: 'Practical Design Solutions',
    text: 'We balance aesthetics, functionality, site conditions and project budgets.',
  },
  {
    num: '07',
    title: 'Professional Coordination',
    text: 'We aim to maintain design consistency through proper drawings, coordination and site-level consultancy.',
  },
];

/** §3 — the principal architect. */
export const principal = {
  name: 'Ar. Mohammad Hassanuddin',
  role: 'Principal Architect | Founder, In-Arch Architects & Interior Designer',
  bio: [
    'Ar. Mohammad Hassanuddin is the Principal Architect at In-Arch Architects & Interior Designer, based in Patna, Bihar.',
    'A graduate of Piloo Mody College of Architecture (PMCA), Cuttack, he is a registered architect with the Council of Architecture, India, and has professional registrations with Patna Municipal Corporation and Gaya Municipal Corporation.',
    'His professional interests span architectural design, interior design, spatial planning and the development of contemporary built environments.',
    'His design approach is driven by a passion for architecture, continuous learning and the pursuit of better design solutions. Having worked on architectural and interior projects, he brings together creative thinking and practical design considerations to develop spaces that respond to the needs of their users.',
    'He believes in continuously improving design skills, exploring new ideas and delivering projects with a strong focus on functionality and aesthetics.',
  ],
  credentials: [
    'Principal Architect, In-Arch Architects & Interior Designer.',
    'Registered Architect, Council of Architecture, India.',
    'Registered Architect, Patna Municipal Corporation.',
    'Registered Architect, Gaya Municipal Corporation.',
    'Bachelor of Architecture (B.Arch), Piloo Mody College of Architecture, Cuttack.',
  ],
  education: {
    degree: 'Bachelor of Architecture (B.Arch)',
    institution: 'Piloo Mody College of Architecture (PMCA)',
    place: 'Cuttack, Odisha',
  },
  internship: {
    organisation: 'Novarch Consultants, New Delhi',
    period: 'May 2020 – November 2020',
    note: 'During his internship, he gained exposure to architectural practice and professional design processes.',
  },
  // In the PDF's order. `period: ''` = not supplied; show nothing (D-23).
  experience: [
    { organisation: 'Council of Architecture, India', designation: 'Registered Architect', period: 'December 2020 – Present' },
    { organisation: 'Zenith', designation: 'Project Architect', period: '' },
    { organisation: 'Patna Municipal Corporation', designation: 'Registered Architect', period: 'December 2020 – Present' },
    { organisation: 'Gaya Municipal Corporation', designation: 'Registered Architect', period: 'December 2020 – Present' },
    { organisation: 'Novarch Consultants, New Delhi', designation: 'Architectural Intern', period: 'May 2020 – November 2020' },
  ],
};

/** §10 B — homepage introduction. */
export const homeIntro = {
  title: 'Architecture That Reflects Your Vision.',
  paragraphs: [
    'At In-Arch Architects & Interior Designer, we believe that every space tells a story. Our approach combines architectural creativity, functional planning and thoughtful interior design to create environments that inspire and serve their purpose.',
    'Led by Ar. Mohammad Hassanuddin, our practice works across residential, commercial and interior design projects, transforming ideas into well-considered spaces.',
  ],
};

/** §10 A — the hero's supporting line. */
export const heroLine =
  'Architecture and interior design solutions that bring together creativity, functionality and thoughtful detailing.';

/** §10 A — the three words under the hero's credit line. */
export const heroDisciplines = ['Architecture', 'Interior Design', '3D Visualisation'];

/**
 * §2 — the Home opening statement: the second "About In-Arch" sentence with
 * only its opening words ("The practice believes that") removed, set as two
 * sentences. `accent` is its last clause, the headline's one italic phrase.
 */
export const homeStatement = {
  lead: 'Architecture is more than the creation of buildings. It is about understanding people, their aspirations and',
  accent: 'the way they interact with their surroundings.',
};

/** §9 — the contact invitation. */
export const contactInvitation = {
  title: "Let's Create Something Meaningful Together.",
  text: 'Whether you are planning a new home, developing a commercial property or transforming an existing interior, In-Arch Architects & Interior Designer is ready to discuss your project.',
};

/** §10 E — the closing call to action. */
export const closingCta = {
  title: 'Have a Project in Mind?',
  text: "Let's discuss your ideas and explore how thoughtful architectural and interior design can transform your space.",
  action: 'Start a Conversation With Us.',
};

/** §9 — the CTA labels the PDF suggests. */
export const ctaLabels = {
  consultation: 'Book a Consultation',
  discuss: 'Discuss Your Project',
  whatsapp: 'Connect on WhatsApp',
  portfolio: 'View Our Portfolio',
};

const studioContent = {
  positioning,
  about,
  vision,
  mission,
  philosophy,
  differentiatorsIntro,
  differentiators,
  principal,
  homeIntro,
  heroLine,
  heroDisciplines,
  homeStatement,
  contactInvitation,
  closingCta,
  ctaLabels,
};

export default studioContent;
