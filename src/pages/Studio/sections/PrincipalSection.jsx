/* ============================================
   Studio / 04 — Principal architect (#principal)
   --------------------------------------------
   Who leads the work, from the client's document only (PDF §3, through
   `studioContent.principal` and `studio.principal`): the name, the role,
   the biography, a statement set apart, five credentials, the experience
   in the PDF's order and the education. The Home page's "About the
   principal" link lands here (`/about#principal`).

   The statement is the biography's last paragraph — the document's own
   description of him, in the third person — so it is set apart in
   display-sm WITHOUT quotation marks and is not repeated in the prose. No
   sentence is attributed to him, and nothing the client has not supplied
   appears: no portrait, registration number, founding year, years of
   experience, team size or client list. The Zenith row has no period
   (owner decision D-23).

   The portrait slot (owner decision D-11): no photograph of the principal
   was supplied, so the 4:5 slot holds a typographic plate — a forest
   panel with the ivory "IA" mark at 72 px and "Principal Architect" at its
   foot. When `studio.principal.portrait` holds a manifest key, the same
   slot renders that photograph instead, with no change to the layout.
   Never a stock photograph of a person.

   - Phones: eyebrow, the slot (full width — narrower only on a short
     screen, so that arriving at #principal the name is still above the
     dock), then the name, role, prose, statement and the three lists in
     one column. The experience table reflows to stacked rows.
   - Tablet: the slot in columns 1–3 beside the text in 4–8.
   - Desktop: the slot in columns 1–5, sticky 120 px from the top (and
     never taller than the room above the dock); everything else in
     7–12. From 1280 the experience is a three-column table.

   Motion: the slot opens with a shutter; the name rises line by line;
   the rest rises.
   ============================================ */

import React from 'react';
import { studio } from '../../../data/siteConfig';
import { principal } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import FactList from '../../../components/ui/FactList/FactList';
import Frame from '../../../components/ui/Frame/Frame';
import Picture from '../../../components/ui/Picture/Picture';
import Logo from '../../../components/ui/Logo/Logo';
import { nameParts } from '../../Home/sections/PrincipalSection';
import { useMotionScope } from '../../../motion';
import styles from './PrincipalSection.module.css';

export const PRINCIPAL_ID = 'principal';
export const PRINCIPAL_TITLE_ID = 'studio-principal-title';

// Full width on phones, columns 1–3 of 8 from 768, 1–5 of 12 from 1024
// (615 px at the 1680 cap).
const PORTRAIT_SIZES = '(min-width: 1920px) 615px, (min-width: 1024px) 36vw, (min-width: 768px) 32vw, 90vw';

/** The biography as prose, and its last paragraph as the statement set apart. */
export const biography = (bio = principal.bio) => ({
  prose: bio.slice(0, -1),
  statement: bio.length ? bio[bio.length - 1] : '',
});

/**
 * The five credentials as FactList pairs, words unchanged: each line is
 * split at its first comma ("Registered Architect, Council of Architecture,
 * India." → label "Registered Architect", value "Council of Architecture,
 * India"); the closing full stop is dropped, as for every label.
 */
export const credentialFacts = (lines = principal.credentials) =>
  lines.map((line, i) => {
    const clean = line.trim().replace(/\.$/, '');
    const at = clean.indexOf(', ');
    return at > 0
      ? { key: `credential-${i}`, label: clean.slice(0, at), value: clean.slice(at + 2) }
      : { key: `credential-${i}`, label: '', value: clean };
  });

/** The education as display lines: the degree, then the college and its place. */
export const educationLines = (education = principal.education) =>
  [education.degree, [education.institution, education.place].filter(Boolean).join(', ')].filter(Boolean);

/** The typographic stand-in for the portrait (D-11): decorative, so hidden from assistive technology. */
const Plate = () => (
  <div className={styles.plate} data-tone="dark" aria-hidden="true">
    <Logo variant="mark" height={72} alt="" className={styles.mark} />
    <span className={`ia-t-label ${styles.plateLabel}`}>{studio.principal.title}</span>
  </div>
);

const PrincipalSection = () => {
  const scope = useMotionScope();
  const { lead, accent } = nameParts(studio.principal.name);
  const { prose, statement } = biography();
  const portrait = studio.principal.portrait;

  return (
    <Section
      ref={scope}
      tone="light"
      id={PRINCIPAL_ID}
      className={styles.principal}
      aria-labelledby={PRINCIPAL_TITLE_ID}
    >
      <Container>
        <Grid className={styles.grid}>
          <Col span="full" md={{ start: 4, span: 5 }} lg={{ start: 7, span: 6 }} className={styles.eyebrowCol}>
            <Eyebrow index={4} className={styles.eyebrow}>
              Principal architect
            </Eyebrow>
          </Col>

          <Col span="full" md={{ start: 1, span: 3 }} lg={{ start: 1, span: 5 }} className={styles.slotCol}>
            <div className={styles.slotHold}>
              <Frame ratio="4/5" reveal className={styles.slot}>
                {portrait ? (
                  <Picture image={portrait} sizes={PORTRAIT_SIZES} alt={studio.principal.name} />
                ) : (
                  <Plate />
                )}
              </Frame>
            </div>
          </Col>

          <Col span="full" md={{ start: 4, span: 5 }} lg={{ start: 7, span: 6 }} className={styles.textCol}>
            <Heading as="h2" size="lg" lines id={PRINCIPAL_TITLE_ID} className={styles.name}>
              {lead && (
                <>
                  {lead}{' '}
                </>
              )}
              <em>{accent}</em>
            </Heading>
            <p className={`ia-t-label ${styles.role}`} data-m="rise">
              {studio.principal.role}
            </p>

            <div className={styles.prose}>
              {prose.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className={`ia-t-body ${styles.paragraph}`} data-m="rise">
                  {paragraph}
                </p>
              ))}
            </div>

            {statement && (
              <p className={`ia-t-display-sm ${styles.statement}`} data-m="rise">
                {statement}
              </p>
            )}

            <div className={styles.block} data-m="rise">
              <h3 className={`ia-t-label ${styles.blockTitle}`}>
                Credentials
              </h3>
              <FactList items={credentialFacts()} className={styles.facts} />
            </div>

            <div className={styles.block} data-m="rise">
              <h3 id="studio-experience" className={`ia-t-label ${styles.blockTitle}`}>
                Experience
              </h3>
              <table className={styles.table} role="table" aria-labelledby="studio-experience">
                <thead className={styles.thead}>
                  <tr className={styles.headRow} role="row">
                    <th scope="col" role="columnheader" className="ia-t-label">
                      Organisation
                    </th>
                    <th scope="col" role="columnheader" className="ia-t-label">
                      Role
                    </th>
                    <th scope="col" role="columnheader" className="ia-t-label">
                      Period
                    </th>
                  </tr>
                </thead>
                <tbody className={styles.tbody}>
                  {principal.experience.map((row) => (
                    <tr key={`${row.organisation}-${row.designation}`} className={styles.row} role="row">
                      <td role="cell" className={`ia-t-body ${styles.org}`}>
                        {row.organisation}
                      </td>
                      <td role="cell" className={`ia-t-small ${styles.designation}`}>
                        {row.designation}
                      </td>
                      <td role="cell" className={`ia-t-small ${styles.period}`}>
                        {row.period}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.block} data-m="rise">
              <h3 className={`ia-t-label ${styles.blockTitle}`}>Education</h3>
              <p className={styles.education}>
                {educationLines().map((line, i) => (
                  <span key={line} className={i === 0 ? `ia-t-body ${styles.degree}` : `ia-t-body ${styles.college}`}>
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default PrincipalSection;
