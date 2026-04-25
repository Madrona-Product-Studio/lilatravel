import { G, TIER_COLORS } from '@data/guides/guide-styles';

export default function Badge({ label, tier }) {
  const tierColor = tier && TIER_COLORS[tier];
  const color = tierColor ? tierColor.color : G.oceanTeal;
  const border = tierColor ? tierColor.border : G.tealBorder;

  if (!label) return null;
  return (
    <span style={{
      fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color, border: `0.5px solid ${border}`,
      padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {label}
    </span>
  );
}
