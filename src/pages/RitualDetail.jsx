// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: INDIVIDUAL RITUAL DETAIL — Deep Philosophical Breakdown
// ═══════════════════════════════════════════════════════════════════════════════

import { useParams, Link, Navigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, Breadcrumb } from '@components';
import { C } from '@data/brand';
import { ritualsPillars, traditions } from '@data/rituals';

export default function RitualDetail() {
  const { slug } = useParams();
  const pillar = ritualsPillars.find(p => p.slug === slug);

  if (!pillar) return <Navigate to="/404" replace />;

  return (
    <>
      <Nav />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "50vh", overflow: "hidden",
        display: "flex", alignItems: "flex-end", background: C.darkInk,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 30% 70%, ${pillar.color}25 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, ${pillar.color}15 0%, transparent 50%), linear-gradient(165deg, ${C.darkInk}, #1a3040)`,
        }} />
        <div style={{
          position: "relative", zIndex: 2,
          padding: "64px 52px", maxWidth: 900, width: "100%",
        }}>
          <FadeIn from="bottom" delay={0.1}>
            <span style={{ fontSize: 48, color: pillar.color, display: "block", marginBottom: 20, opacity: 0.6 }}>{pillar.icon}</span>
            <span className="eyebrow" style={{ color: pillar.color }}>{pillar.word}</span>
            <h1 style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 300,
              color: "white", lineHeight: 1.2, marginBottom: 16,
            }}>
              {pillar.desc.split(".")[0]}.
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <section className="page-content" style={{ padding: "64px 52px", background: C.cream }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Breadcrumb items={[
            { label: "Home", to: "/" },
            { label: "Rituals", to: "/rituals" },
            { label: pillar.word },
          ]} />

          <div style={{ marginTop: 48 }}>
            {/* Long description */}
            <FadeIn>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 300, fontStyle: "normal",
                color: "#4a6070", lineHeight: 1.8, marginBottom: 48,
              }}>{pillar.longDesc}</p>
            </FadeIn>

            {/* ── Across Traditions ─────────────────────────────────────── */}
            <FadeIn delay={0.1}>
              <span className="eyebrow" style={{ color: pillar.color, marginBottom: 24, display: "block" }}>
                Across Traditions
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {pillar.traditions.map((t, j) => {
                  const tradMeta = traditions.find(tr => tr.name === t.name);
                  return (
                    <FadeIn key={j} delay={0.1 + j * 0.08}>
                      <div style={{
                        padding: "28px 32px",
                        background: C.warmWhite,
                        borderLeft: `3px solid ${tradMeta?.color || pillar.color}`,
                        position: "relative",
                      }}>
                        {/* Tradition header */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
                        }}>
                          <span style={{ fontSize: 20, color: tradMeta?.color, opacity: 0.6 }}>
                            {tradMeta?.symbol}
                          </span>
                          <span style={{
                            fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 700,
                            letterSpacing: "0.15em", textTransform: "uppercase",
                            color: tradMeta?.color || C.darkInk,
                          }}>{t.name}</span>
                        </div>

                        {/* Concept name + script */}
                        <div style={{ marginBottom: 12 }}>
                          <span style={{
                            fontFamily: "'Quicksand'", fontSize: 18, fontWeight: 600,
                            color: C.darkInk, letterSpacing: "0.02em",
                          }}>{t.concept}</span>
                          {t.script && (
                            <span style={{
                              fontFamily: "serif", fontSize: 16, fontWeight: 300,
                              color: "#9aabba", marginLeft: 12, opacity: 0.7,
                            }}>{t.script}</span>
                          )}
                        </div>

                        {/* Essence */}
                        <p style={{
                          fontFamily: "'Quicksand'", fontSize: 14, fontWeight: 400,
                          color: "#5a6a78", lineHeight: 1.8, marginBottom: 10,
                        }}>{t.essence}</p>

                        {/* Metaphor */}
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 15, fontWeight: 300, fontStyle: "normal",
                          color: "#9aabba", marginBottom: 0,
                        }}>"{t.metaphor}"</p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </FadeIn>

            {/* ── How We Apply It ──────────────────────────────────────── */}
            <FadeIn delay={0.3}>
              <div style={{
                marginTop: 64, padding: "40px 36px",
                background: `linear-gradient(135deg, ${pillar.color}08, ${pillar.color}04)`,
                borderTop: `2px solid ${pillar.color}30`,
              }}>
                <span className="eyebrow" style={{ color: pillar.color, marginBottom: 16, display: "block" }}>
                  How We Apply This to Travel
                </span>
                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 15, fontWeight: 400,
                  color: "#4a6070", lineHeight: 2.0, marginBottom: 24,
                }}>{pillar.application}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {pillar.details.map((detail, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 20px", background: C.warmWhite,
                      borderLeft: `2px solid ${pillar.color}40`,
                    }}>
                      <span style={{
                        fontFamily: "'Quicksand'", fontSize: 14, fontWeight: 500,
                        color: C.darkInk, letterSpacing: "0.02em",
                      }}>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* ── Other Principles ─────────────────────────────────────── */}
            <FadeIn delay={0.35}>
              <div style={{ marginTop: 80 }}>
                <span className="eyebrow" style={{ color: "#9aabba" }}>Other Principles</span>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
                  {ritualsPillars.filter(p => p.slug !== pillar.slug).map(other => (
                    <Link key={other.slug} to={`/rituals/${other.slug}`} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 20px", border: `1px solid ${C.stone}`,
                      transition: "all 0.25s", background: C.warmWhite, textDecoration: "none",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = other.color}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.stone}
                    >
                      <span style={{ fontSize: 16, color: other.color }}>{other.icon}</span>
                      <span style={{
                        fontFamily: "'Quicksand'", fontSize: 13, fontWeight: 600,
                        letterSpacing: "0.1em", textTransform: "uppercase", color: C.darkInk,
                      }}>{other.word}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
