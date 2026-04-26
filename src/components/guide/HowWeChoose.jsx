import { G, FONTS } from '@data/guides/guide-styles';
import { curationRubrics } from '@data/curation-rubrics';

export default function HowWeChoose({ section }) {
  const rubric = curationRubrics[section];
  if (!rubric) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: FONTS.body,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: G.oceanTeal,
        marginBottom: 14,
      }}>
        {rubric.heading}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 8,
      }}>
        {rubric.criteria.map((c, i) => (
          <p key={i} style={{
            fontFamily: FONTS.body,
            fontSize: 13,
            fontWeight: 400,
            lineHeight: 1.65,
            color: G.inkDetail,
            margin: 0,
          }}>
            <span style={{ fontWeight: 600 }}>
              {c.name}.
            </span>
            {' '}{c.body}
          </p>
        ))}
      </div>
    </div>
  );
}
