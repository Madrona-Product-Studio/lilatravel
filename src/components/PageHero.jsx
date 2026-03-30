// ═══════════════════════════════════════════════════════════════════════════════
// PAGE HERO — reusable hero banner for subpages
// ═══════════════════════════════════════════════════════════════════════════════

import { C } from '@data/brand';
import FadeIn from './FadeIn';

export default function PageHero({ eyebrow, title, subtitle, photo, gradient, accentColor = C.skyBlue, height = "60vh" }) {
  return (
    <section className="page-hero relative overflow-hidden flex items-end" style={{ minHeight: height }}>
      {photo ? (
        <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
      ) : gradient ? (
        <div className="absolute inset-0" style={{ background: gradient }} />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(165deg, ${C.slate}, ${C.darkInk})` }} />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,18,26,0.75) 0%, rgba(10,18,26,0.2) 50%, rgba(10,18,26,0.1) 100%)" }} />

      <div className="relative z-[2] px-[52px] py-16 max-w-[900px] w-full">
        <FadeIn from="bottom" delay={0.1}>
          {eyebrow && <span className="eyebrow" style={{ color: accentColor }}>{eyebrow}</span>}
          <h1 className="font-body text-[clamp(32px,6vw,64px)] font-light text-white leading-[1.1]"
            style={{ marginBottom: subtitle ? 16 : 0 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="font-serif text-[clamp(17px,2.5vw,24px)] font-light text-white/60 leading-[1.6] max-w-[600px]">
              {subtitle}
            </p>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
