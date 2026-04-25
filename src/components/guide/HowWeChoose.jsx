import { G, FONTS } from '@data/guides/guide-styles';
import { curationRubrics } from '@data/curation-rubrics';

export default function HowWeChoose({ section }) {
  const rubric = curationRubrics[section];
  if (!rubric) return null;

  return (
    <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: `0.5px solid ${G.border}` }}>
      <h2 style={{
        fontFamily: FONTS.serif,
        fontSize: 17,
        fontWeight: 300,
        fontStyle: 'italic',
        color: G.ink,
        margin: '0 0 14px',
        letterSpacing: '0.01em',
      }}>
        {rubric.heading}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rubric.criteria.map((c, i) => (
          <p key={i} style={{
            fontFamily: FONTS.body,
            fontSize: 13,
            fontWeight: 400,
            lineHeight: 1.65,
            color: G.inkBody,
            margin: 0,
          }}>
            <span style={{
              fontFamily: FONTS.serif,
              fontWeight: 500,
              fontStyle: 'italic',
              color: G.ink,
            }}>
              {c.name}.
            </span>
            {' '}{c.body}
          </p>
        ))}
      </div>
    </div>
  );
}
