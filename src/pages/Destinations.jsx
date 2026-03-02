// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DESTINATIONS LANDING
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader } from '@components';
import { C } from '@data/brand';
import { destinations } from '@data/destinations';

// ─── Immersive Cell (styled to match homepage carousel) ──────────────────
function DestCell({ dest, textAlign = "left" }) {
  const [hovered, setHovered] = useState(false);
  const isRight = textAlign === "right";

  return (
    <Link
      to={`/destinations/${dest.slug}`}
      style={{ display: "block", textDecoration: "none", height: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        height: "100%",
      }}>
        {/* Photo with slow zoom */}
        <div style={{
          position: "absolute",
          inset: -10,
          transition: "transform 5s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}>
          {dest.photo ? (
            <img src={dest.photo} alt={dest.name} style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
            }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: dest.gradient }} />
          )}
        </div>

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: isRight
            ? "linear-gradient(to left, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.06) 65%)"
            : "linear-gradient(to right, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.06) 65%)",
          transition: "opacity 0.5s",
          opacity: hovered ? 1 : 0.72,
        }} />

        {/* Content overlay */}
        <div style={{
          position: "absolute", bottom: 0,
          ...(isRight ? { right: 0 } : { left: 0 }),
          padding: "32px 34px",
          maxWidth: 440,
          textAlign,
        }}>
          {/* Golden Windows — accent line + label + bordered season pills */}
          {dest.windows && dest.windows.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginBottom: 10,
                flexDirection: isRight ? "row-reverse" : "row",
              }}>
                <div style={{
                  width: 20, height: 1,
                  background: dest.accent || "rgba(255,255,255,0.5)",
                  boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                }} />
                <span style={{
                  fontFamily: "'Quicksand'", fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.92)",
                  textShadow: "0 1px 6px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3)",
                }}>
                  Golden Windows
                </span>
              </div>

              <div style={{
                display: "flex", gap: 6, flexWrap: "wrap",
                justifyContent: isRight ? "flex-end" : "flex-start",
              }}>
                {dest.windows.map((w, wi) => (
                  <span key={wi} style={{
                    fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 500,
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.85)",
                    padding: "4px 10px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    backdropFilter: "blur(8px)",
                    background: "rgba(0,0,0,0.15)",
                  }}>
                    {w.season} · {w.months}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Destination name */}
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px, 3.5vw, 42px)",
            fontWeight: 300, color: "white", lineHeight: 1.05,
            marginBottom: 6, letterSpacing: "-0.01em",
          }}>
            {dest.name}
          </h3>

          {/* Location */}
          <p style={{
            fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 600,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)", marginBottom: 10,
          }}>
            {dest.location}
          </p>

          {/* Guide status — green dot if available, muted if coming soon */}
          {dest.guideAvailable ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: 8,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: C.seaGlass || "#7DB8A0",
                boxShadow: `0 0 6px ${C.seaGlass || "#7DB8A0"}`,
              }} />
              <span style={{
                fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.06em",
                color: C.seaGlass || "#7DB8A0",
              }}>
                Guide Available
              </span>
            </div>
          ) : (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: 8,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "rgba(255,255,255,0.45)",
                boxShadow: "0 0 4px rgba(0,0,0,0.3)",
              }} />
              <span style={{
                fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 600,
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.6)",
                textShadow: "0 1px 6px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3)",
              }}>
                Guide Coming Soon
              </span>
            </div>
          )}

          {/* Description on hover */}
          <div style={{
            overflow: "hidden",
            maxHeight: hovered ? 80 : 0,
            opacity: hovered ? 1 : 0,
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15, fontStyle: "italic",
              color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginTop: 8,
            }}>
              {dest.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Grid: 2×3, contained, seamless ─────────────────────────────────────────
export default function DestinationsPage() {
  const d = destinations;
  const rows = [];
  for (let i = 0; i < d.length; i += 2) {
    if (d[i + 1]) rows.push([d[i], d[i + 1]]);
    else rows.push([d[i]]);
  }

  return (
    <>
      <Nav />
      <PageHeader
        eyebrow="Destinations"
        title="Sacred Terrain"
        subtitle="Each place chosen for its capacity to dissolve the ordinary — timed to its most luminous window."
        accentColor={C.seaGlass}
      />

      <section className="page-content" style={{ padding: "48px 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridAutoRows: 340,
            gap: 0,
            overflow: "hidden",
          }}>
            {rows.map((row, ri) =>
              row.map((dest, ci) => (
                <FadeIn key={dest.slug} delay={(ri * 2 + ci) * 0.06}>
                  <div style={{ height: 340 }}>
                    <DestCell
                      dest={dest}
                      textAlign={ci === 0 ? "left" : "right"}
                    />
                  </div>
                </FadeIn>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
