import { G, FONTS } from '@data/guides/guide-styles';
import { curationRubrics } from '@data/curation-rubrics';

export default function HowWeChoose({ section }) {
  const rubric = curationRubrics[section];
  if (!rubric) return null;

  return (
    <div style={{
      marginBottom: 32,
      padding: '20px 24px',
      background: G.panel,
      border: `0.5px solid ${G.border}`,
    }}>
      <div style={{
        fontFamily: FONTS.body,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: G.ink40,
        marginBottom: 14,
      }}>
        {rubric.heading}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rubric.criteria.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 0 }}>
            <span style={{
              fontFamily: FONTS.body,
              fontSize: 12,
              fontWeight: 600,
              color: G.inkDetail,
              minWidth: 0,
              flexShrink: 0,
            }}>
              {c.name}
            </span>
            <span style={{
              fontFamily: FONTS.body,
              fontSize: 12,
              fontWeight: 400,
              color: G.ink40,
              marginLeft: 4,
              flexShrink: 0,
            }}>—</span>
            <span style={{
              fontFamily: FONTS.body,
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 1.55,
              color: G.ink40,
              marginLeft: 4,
            }}>
              {c.body}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
