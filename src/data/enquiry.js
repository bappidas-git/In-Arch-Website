/* ============================================
   enquiry — the option lists of the lead form (prompt 05)
   --------------------------------------------
   - `serviceOptions`: what a lead's `service_interest` may hold — the seven
     service titles from services.js, in order, then "Something else".
     The value stored is always the visible label (the admin shows it as is).
   - `budgetRanges`: the optional "Indicative budget" select. Owner decision
     D-09 adopts these default ranges as an optional field; change them here
     (or turn the field into free text in UnifiedLeadForm) if it is revised.
     No fee is quoted anywhere: these are the visitor's own indication.
   - `WHATSAPP_GREETING` lives in the shell (Dock.jsx) so the dock, the
     overlay and the form all open WhatsApp with the same first line.
   ============================================ */

import { serviceTitles, SOMETHING_ELSE } from './services';

export const serviceOptions = [...serviceTitles, SOMETHING_ELSE];

export const budgetRanges = [
  'Under ₹10 lakh',
  '₹10 – 25 lakh',
  '₹25 – 50 lakh',
  '₹50 lakh – ₹1 crore',
  'Above ₹1 crore',
  'Not sure yet',
];

/** True for one of the seven service titles or "Something else". */
export const isServiceOption = (value) => serviceOptions.includes(value);
