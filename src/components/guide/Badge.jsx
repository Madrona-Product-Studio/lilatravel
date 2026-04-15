import { G } from '@data/guides/guide-styles';

export default function Badge({ label }) {
  if (!label) return null;
  return (
    <span style={{
      fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: G.oceanTeal, border: `0.5px solid ${G.tealBorder}`,
      padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {label}
    </span>
  );
}
