// ═══════════════════════════════════════════════════════════════════════════════
// FADE IN — scroll-triggered reveal animation
// ═══════════════════════════════════════════════════════════════════════════════

import { useInView } from '@utils/hooks';

export default function FadeIn({ children, delay = 0, from = "bottom", style = {}, className = "" }) {
  const [ref, inView] = useInView(0.08);
  const translate =
    from === "bottom" ? "translateY(32px)" :
    from === "left"   ? "translateX(-32px)" :
    from === "right"  ? "translateX(32px)" :
    "none";

  return (
    <div ref={ref} className={className} style={{
      /* dynamic — opacity/transform driven by intersection observer */
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : translate,
      transition: `opacity 0.8s ${delay}s ease, transform 0.8s ${delay}s ease`,
      ...style,
    }}>
      {children}
    </div>
  );
}
