import { G } from '@data/guides/guide-styles';

export default function SubLabel({ children, warm = false, color }) {
  const lineColor = color || (warm ? G.goldenAmber : G.oceanTeal);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '40px 0 12px' }}>
      <span style={{ width: 24, height: 1.5, background: lineColor, display: 'block', flexShrink: 0 }} />
      <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: G.ink }}>
        {children}
      </span>
    </div>
  );
}
