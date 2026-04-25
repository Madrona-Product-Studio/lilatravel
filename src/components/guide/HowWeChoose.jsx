import { G, FONTS } from '@data/guides/guide-styles';
import { curationRubrics } from '@data/curation-rubrics';

export default function HowWeChoose({ section }) {
  const rubric = curationRubrics[section];
  if (!rubric) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: FONTS.serif,
        fontSize: 15,
        fontWeight: 300,
        fontStyle: 'italic',
        color: G.ink40,
        marginBottom: 12,
      }}>
        {rubric.heading}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 6,
        paddingLeft: 1,
      }}>
        {rubric.criteria.map((c, i) => (
          <p key={i} style={{
            fontFamily: FONTS.body,
            fontSize: 11.5,
            fontWeight: 400,
            lineHeight: 1.6,
            color: G.ink25,
            margin: 0,
          }}>
            <span style={{
              fontWeight: 500,
              color: G.ink40,
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
