import { G } from '@data/guides/guide-styles';

export default function SectionTransition({ num, title }) {
  return (
    <div style={{ paddingTop: 68, paddingBottom: 4 }}>
      <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.ink40, marginBottom: 12 }}>
        {num}
      </div>
      <h2 style={{
        fontFamily: "'Quicksand', sans-serif", fontSize: 'clamp(36px, 5.5vw, 54px)',
        fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.01em',
        color: G.darkInk, margin: 0, whiteSpace: 'pre-line',
      }}>
        {title}
      </h2>
    </div>
  );
}
