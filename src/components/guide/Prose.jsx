import { G } from '@data/guides/guide-styles';

export default function Prose({ children, style = {} }) {
  return (
    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 400, lineHeight: 1.8, color: G.inkBody, margin: '0 0 18px', ...style }}>
      {children}
    </p>
  );
}
