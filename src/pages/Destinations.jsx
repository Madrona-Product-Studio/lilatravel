// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DESTINATIONS LANDING
// ═══════════════════════════════════════════════════════════════════════════════

import { Nav, Footer, FadeIn, PageHeader } from '@components';
import { C } from '@data/brand';
import { destinations } from '@data/destinations';
import { trackEvent } from '@utils/analytics';

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function DestinationsPage() {
  return (
    <>
      <Nav />
      <PageHeader
        eyebrow="Destinations"
        title="Sacred Terrain"
        subtitle="Each place chosen for its capacity to dissolve the ordinary — timed to its most luminous window."
        accentColor={C.seaGlass}
      />

      <style>{`
        .bento-tile {
          position: relative;
          overflow: hidden;
          display: block;
          cursor: default;
        }
        .bento-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .bento-tile:hover img {
          transform: scale(1.05);
        }
        .bento-tile .bento-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,18,26,0.75) 0%, rgba(10,18,26,0.1) 50%, transparent 100%);
          transition: background 0.4s ease;
        }
        .bento-tile:hover .bento-overlay {
          background: linear-gradient(to top, rgba(10,18,26,0.85) 0%, rgba(10,18,26,0.2) 60%, transparent 100%);
        }
        .bento-tile .bento-desc {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease;
        }
        .bento-tile:hover .bento-desc {
          max-height: 80px;
          opacity: 1;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 400px 280px 280px;
          gap: 4px;
        }
        @media (max-width: 860px) {
          .bento-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 280px 220px 220px;
            gap: 3px;
          }
        }
        @media (max-width: 540px) {
          .bento-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(6, 240px);
            gap: 3px;
          }
        }
      `}</style>

      <section className="page-content" style={{ padding: "48px 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="bento-grid">
            {destinations.map((d, i) => {
              const isHero = i === 0;
              return (
                <FadeIn key={d.slug} delay={i * 0.06}>
                  <div
                    className="bento-tile"
                    style={{ height: '100%' }}
                  >
                    {d.photo ? (
                      <img src={d.photo} alt={d.name} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: d.gradient, filter: "brightness(0.65) saturate(1.3)" }} />
                    )}
                    <div className="bento-overlay" />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: isHero ? "36px 32px" : "24px 24px",
                    }}>
                      {/* Golden Windows + Guide status */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 16, height: 1, background: d.accent, boxShadow: "0 0 4px rgba(0,0,0,0.3)" }} />
                          <span style={{
                            fontFamily: "'Quicksand'", fontSize: 9, fontWeight: 700,
                            letterSpacing: "0.22em", textTransform: "uppercase",
                            color: "rgba(255,255,255,0.92)",
                            textShadow: "0 1px 6px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3)",
                          }}>Golden Windows</span>
                        </div>
                        {d.guideAvailable ? (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7DB8A0" }} />
                            <span style={{
                              fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 600,
                              letterSpacing: "0.06em",
                              color: "rgba(255,255,255,0.9)",
                            }}>Guide Available</span>
                          </div>
                        ) : (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.45)", boxShadow: "0 0 4px rgba(0,0,0,0.3)" }} />
                            <span style={{
                              fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 600,
                              letterSpacing: "0.06em",
                              color: "rgba(255,255,255,0.6)",
                              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                            }}>Guide Coming Soon</span>
                          </div>
                        )}
                      </div>

                      {/* Season pills */}
                      {d.windows && (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
                          {d.windows.map((w, wi) => (
                            <span key={wi} style={{
                              fontFamily: "'Quicksand'", fontSize: 8, fontWeight: 600,
                              letterSpacing: "0.04em",
                              color: "rgba(255,255,255,0.9)",
                              padding: "3px 8px",
                              border: "1px solid rgba(255,255,255,0.2)",
                              backdropFilter: "blur(4px)",
                              background: "rgba(0,0,0,0.15)",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}>
                              {w.season} · {w.months}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Name */}
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: isHero ? "clamp(28px, 4vw, 42px)" : "clamp(22px, 3vw, 30px)",
                        fontWeight: 300, color: "white", lineHeight: 1.1, marginBottom: 4,
                      }}>{d.slug === 'zion-canyon' ? 'Zion & Orbit' : d.name}</h3>

                      {/* Location */}
                      <p style={{
                        fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 600,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "rgba(255,255,255,0.5)", marginBottom: 0,
                      }}>{d.location}</p>

                      {/* Description on hover */}
                      <div className="bento-desc">
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: isHero ? 16 : 14, fontWeight: 300, fontStyle: "normal",
                          color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginTop: 8,
                        }}>{d.description}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
