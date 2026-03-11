// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT: PageHeader — Unified interior page header
// ═══════════════════════════════════════════════════════════════════════════════
//
// Props:
//   eyebrow      — small uppercase label
//   title        — main heading (can include JSX)
//   subtitle     — descriptive line beneath the title
//   accentColor  — colored accent for the eyebrow line
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
    <section style={{
      padding: children ? "120px 52px 48px" : "120px 52px 0",
      background: C.cream,
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        textAlign: isCenter ? "center" : "left",
      }}>
        <FadeIn from="bottom" delay={0.05}>
          {/* Accent line + eyebrow */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
            justifyContent: isCenter ? "center" : "flex-start",
          }}>
            <div style={{
              width: 32,
              height: 1.5,
              background: accentColor,
              opacity: 0.7,
            }} />
            <span style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: accentColor,
            }}>
              {eyebrow}
            </span>
            {tag && (
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7a8a9a",
                border: "1.5px solid #b0b8c0",
                padding: "4px 10px",
              }}>{tag}</span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 300,
            color: C.darkInk,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            maxWidth: isCenter ? 680 : 600,
            margin: isCenter ? "0 auto 12px" : "0 0 12px 0",
          }}>
            {title}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: "clamp(14px, 1.5vw, 16px)",
            fontWeight: 400,
            color: "#7a8a9a",
            lineHeight: 1.8,
            maxWidth: isCenter ? 520 : 520,
            margin: isCenter ? "0 auto" : 0,
            letterSpacing: "0.01em",
          }}>
            {subtitle}
          </p>

          {/* Optional extra content (e.g. three braids) */}
          {children}
        </FadeIn>
      </div>
    </section>
  );
}
