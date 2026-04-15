import { G } from '@data/guides/guide-styles';

export default function LilaPick() {
  return (
    <span style={{
      fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: G.goldenAmber, border: `0.5px solid ${G.amberBorder}`,
      padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      Lila Pick
    </span>
  );
}
