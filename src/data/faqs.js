/* ============================================
   faqs — eight questions and answers
   --------------------------------------------
   Source: `details of in-arch.pdf` §8, questions and answers verbatim.
   `topics` lets a page pick a subset: general, interiors, process, fees.
   The Expertise page shows all eight (with FAQ schema, prompt 09); the
   Interior Design page shows q3, q4, q6, q7 and q8 (see interiors.js).
   ============================================ */

export const FAQ_TOPICS = ['general', 'interiors', 'process', 'fees'];

export const faqs = [
  {
    id: 'q1',
    question: 'What services does In-Arch Architects & Interior Designer offer?',
    answer:
      'We provide architectural design, residential and commercial planning, interior design, 3D visualisation, renovation consultancy and project management services, subject to project requirements and agreed scope.',
    topics: ['general'],
  },
  {
    id: 'q2',
    question: 'Does In-Arch undertake residential projects?',
    answer:
      "Yes. The practice's portfolio includes residential architecture and interior design. Services can be tailored to independent houses, villas, duplexes and multi-storey residential buildings.",
    topics: ['general'],
  },
  {
    id: 'q3',
    question: 'Do you provide interior design services separately?',
    answer: 'Yes. Interior design can be undertaken as an independent service or integrated with architectural design.',
    topics: ['general', 'interiors'],
  },
  {
    id: 'q4',
    question: 'Can I get a 3D view of my proposed building or interior?',
    answer:
      '3D visualisation can be included in the design process to help clients understand the proposed architectural form, materials, finishes and spatial experience.',
    topics: ['process', 'interiors'],
  },
  {
    id: 'q5',
    question: 'Do you provide construction supervision?',
    answer: 'Project coordination and site consultancy can be discussed according to the requirements and scope of the project.',
    topics: ['process'],
  },
  {
    id: 'q6',
    question: 'Do you work outside Patna?',
    answer:
      'Project enquiries from locations outside Patna can be discussed with the office depending on the project type, location and scope.',
    topics: ['general', 'interiors'],
  },
  {
    id: 'q7',
    question: 'How can I start a project with In-Arch?',
    answer:
      'You can contact the office through the phone number, WhatsApp or website enquiry form to schedule an initial consultation.',
    topics: ['process', 'interiors'],
  },
  {
    id: 'q8',
    question: 'How much does architectural or interior design cost?',
    answer:
      'Fees depend on project type, area, complexity, scope of services and design requirements. Contact the office for a project-specific proposal.',
    topics: ['fees', 'interiors'],
  },
];

/** FAQs by id, in the order given. Unknown ids are skipped. */
export const faqsById = (ids) => ids.map((id) => faqs.find((f) => f.id === id)).filter(Boolean);

/** FAQs carrying a topic. */
export const faqsByTopic = (topic) => faqs.filter((f) => f.topics.includes(topic));

export default faqs;
