// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT: PageHeader — Unified interior page header
// ═══════════════════════════════════════════════════════════════════════════════
//
// Props:
//   eyebrow      — small uppercase label
//   title        — main heading (can include JSX)
//   subtitle     — descriptive line beneath the title
//   accentColor  — colored accent for the eyebrow line (dynamic)
//   align        — "left" (default) or "center"
//   children     — optional content rendered below the subtitle (e.g. braids)
//
// ═══════════════════════════════════════════════════════════════════════════════

import FadeIn from './FadeIn';
import { C } from '@data/brand';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  accentColor = C.oceanTeal,
  align = "left",
  tag,
  children,
}) {
  const isCenter = align === "center";

  return (
    <section
      className={`bg-cream ${children ? "px-[52px] pt-[120px] pb-12" : "px-[52px] pt-[120px] pb-0"}`}
    >
      <div className={`max-w-[1100px] mx-auto ${isCenter ? "text-center" : "text-left"}`}>
        <FadeIn from="bottom" delay={0.05}>
          {/* Accent line + eyebrow */}
          <div className={`flex items-center gap-3 mb-4 ${isCenter ? "justify-center" : "justify-start"}`}>
            <div
              className="w-8 h-[1.5px] opacity-70"
              style={{ background: accentColor }}
            />
            <span
              className="font-body text-[11px] font-bold tracking-[0.22em] uppercase"
              style={{ color: accentColor }}
            >
              {eyebrow}
            </span>
            {tag && (
              <span className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7a8a9a] border-[1.5px] border-[#b0b8c0] px-2.5 py-1">
                {tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className={`font-serif text-[clamp(32px,5vw,52px)] font-light text-dark-ink leading-[1.2] tracking-[-0.01em] ${
              isCenter ? "max-w-[680px] mx-auto mb-3" : "max-w-[600px] mb-3"
            }`}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            className={`font-body text-[clamp(14px,1.5vw,16px)] font-normal text-[#7a8a9a] leading-[1.8] max-w-[520px] tracking-[0.01em] ${
              isCenter ? "mx-auto" : "m-0"
            }`}
          >
            {subtitle}
          </p>

          {/* Optional extra content (e.g. three braids) */}
          {children}
        </FadeIn>
      </div>
    </section>
  );
}
