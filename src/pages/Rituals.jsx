// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: RITUALS LANDING — "The Threads Between"
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';
import { ritualsPillars, traditions, ritualsIntro } from '@data/rituals';

export default function RitualsPage() {
  return (
    <>
      <Nav />
      {/* ── Hero with background image ─────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "55vh", overflow: "hidden",
        display: "flex", alignItems: "flex-end", background: C.darkInk,
      }}>
        <img
          src="/images/rituals-hero.jpg"
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 70%",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(15,30,42,0.3) 0%, rgba(15,30,42,0.65) 70%, rgba(15,30,42,0.85) 100%)",
        }} />
        <div style={{
          position: "relative", zIndex: 2,
          padding: "64px 52px", maxWidth: 900, width: "100%",
        }}>
          <FadeIn from="bottom" delay={0.1}>
            <span className="eyebrow" style={{ color: "#6BA4B8" }}>Rituals</span>
            <h1 style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 300,
              color: "white", lineHeight: 1.2, marginBottom: 12,
            }}>
              {ritualsIntro.headline}
            </h1>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 300, fontStyle: "normal",
              color: "rgba(255,255,255,0.7)", lineHeight: 1.6, maxWidth: 560,
            }}>
              {ritualsIntro.subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Philosophical Introduction ──────────────────────────────────── */}
      <section style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <FadeIn>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 300, fontStyle: "normal",
              color: "#4a6070", lineHeight: 1.9, marginBottom: 0,
            }}>
              {ritualsIntro.body}
            </p>
          </FadeIn>

          {/* Tradition markers */}
          <FadeIn delay={0.15}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "28px 0",
              marginTop: 48, paddingTop: 48,
              borderTop: `1px solid ${C.stone}`,
            }}>
              {traditions.map((t, i) => (
                <div key={t.name} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  gridColumn: i < 3
                    ? `${i * 2 + 1} / span 2`
                    : i === 3 ? "2 / span 2" : "4 / span 2",
                }}>
                  <span style={{
                    fontSize: 28, color: t.color, opacity: 0.7,
                    lineHeight: 1, fontFamily: "serif",
                  }}>{t.symbol}</span>
                  <div>
                    <span style={{
                      fontFamily: "'Quicksand'", fontSize: 13, fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: C.darkInk, display: "block",
                    }}>{t.name}</span>
                    <span style={{
                      fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 400,
                      color: "#9aabba",
                    }}>{t.origin} · {t.age}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── The Four Principles ─────────────────────────────────────────── */}
      <section className="page-content" style={{ padding: "40px 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {ritualsPillars.map((pillar, i) => (
            <FadeIn key={pillar.slug} delay={i * 0.1}>
              <Link to={`/rituals/${pillar.slug}`} style={{ display: "block", textDecoration: "none" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "120px 1fr", gap: 40,
                  padding: "48px 0",
                  borderBottom: i < ritualsPillars.length - 1 ? `1px solid ${C.stone}` : "none",
                  cursor: "pointer", transition: "padding-left 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = "12px"}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                >
                  {/* Icon column */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 36, color: pillar.color, opacity: 0.7 }}>{pillar.icon}</span>
                    <span style={{
                      fontFamily: "'Quicksand'", fontSize: 13, fontWeight: 700,
                      letterSpacing: "0.2em", textTransform: "uppercase", color: pillar.color,
                    }}>{pillar.word}</span>
                  </div>

                  {/* Content column */}
                  <div>
                    <p style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 16, fontWeight: 400, color: "#5a6a78", lineHeight: 2.0, marginBottom: 20,
                    }}>{pillar.desc}</p>

                    {/* Tradition concepts preview */}
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                      {pillar.traditions.map((t, j) => (
                        <span key={j} style={{
                          fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 500,
                          letterSpacing: "0.04em", color: "#7a8a9a",
                          padding: "6px 14px", border: `1px solid ${C.stone}`,
                          display: "flex", alignItems: "center", gap: 6,
                        }}>
                          <span style={{ fontSize: 14, opacity: 0.5 }}>
                            {traditions.find(tr => tr.name === t.name)?.symbol}
                          </span>
                          {t.concept}
                        </span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 17, fontWeight: 300, fontStyle: "normal",
                      color: "#7a8a9a", lineHeight: 1.6, marginBottom: 20,
                    }}>
                      "{pillar.quote}"
                      <br />
                      <span style={{
                        fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 600,
                        fontStyle: "normal", letterSpacing: "0.08em",
                        color: pillar.color, opacity: 0.7,
                      }}>— {pillar.quoteAuthor}</span>
                    </p>

                    <div>
                      <span style={{
                        fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 700,
                        letterSpacing: "0.18em", textTransform: "uppercase", color: pillar.color,
                      }}>Explore This Principle →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Convergence Statement ──────────────────────────────────────── */}
      <section style={{
        padding: "80px 52px",
        background: `linear-gradient(165deg, ${C.darkInk}, #1a3040)`,
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <span className="eyebrow" style={{ color: "#6BA4B8", marginBottom: 24, display: "block" }}>
              The Convergence
            </span>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 300, fontStyle: "normal",
              color: "rgba(255,255,255,0.75)", lineHeight: 1.9, marginBottom: 40,
            }}>
              {ritualsIntro.convergence}
            </p>
            <p style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 15, fontWeight: 400,
              color: "rgba(255,255,255,0.55)", lineHeight: 1.9,
            }}>
              {ritualsIntro.closing}
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
