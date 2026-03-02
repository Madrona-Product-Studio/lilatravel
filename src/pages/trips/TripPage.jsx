// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: TRIP DETAIL (placeholder template for upcoming Threshold Trips)
// ═══════════════════════════════════════════════════════════════════════════════

import { useParams, Link } from 'react-router-dom';
import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';
import { trackEvent } from '@utils/analytics';

// ─── Trip Data ───────────────────────────────────────────────────────────────
const trips = {
  "zion-autumn-equinox-2026": {
    destination: "Zion Canyon",
    location: "Utah",
    threshold: "Autumn Equinox",
    window: "September 20–26, 2026",
    season: "Autumn Equinox",
    tagline: "The canyon exhales. Light softens, cottonwoods ignite, and the crowds dissolve.",
    description: "Seven days anchored to the autumn equinox — when daylight and darkness balance, Zion's canyon walls glow amber, and the cottonwood groves ignite. This is the threshold between summer's intensity and winter's stillness. Guided hikes, canyon yoga at dawn, evening breathwork under thousand-star skies.",
    gradient: "linear-gradient(165deg, #c4593c, #8b3a2a, #d4855a)",
    accent: C.sunSalmon,
    spots: 8,
    price: "From $895 per person",
    highlights: [
      "6 nights curated accommodation in Springdale",
      "Equinox ceremony at canyon sunrise",
      "Daily guided hikes — Angels Landing, The Narrows, Hidden Canyon",
      "Morning yoga and breathwork sessions",
      "Sunset viewpoint experiences timed to the shifting light",
      "All permits and logistics handled",
      "Small group — 8 travelers maximum",
    ],
  },
  "big-sur-harvest-moon-2026": {
    destination: "Big Sur",
    location: "California",
    threshold: "Harvest Moon",
    window: "October 5–11, 2026",
    season: "Harvest Moon",
    tagline: "The fog lifts, the kelp forests glow, and the Pacific turns to gold under a full moon.",
    description: "Six days centered on the harvest moon — when Big Sur's fog finally lifts and the coast enters its warmest, most luminous window. Moonrise over the Pacific, coastal trail hikes through golden grass, cliffside meditation, and evenings watching the sun dissolve into the ocean while the full moon rises behind you.",
    gradient: "linear-gradient(165deg, #4A9B9F, #2d6b6e, #7BB8D4)",
    accent: C.oceanTeal,
    spots: 8,
    price: "From $995 per person",
    highlights: [
      "6 nights along the Big Sur coast",
      "Harvest moon ceremony on the cliffs",
      "Guided coastal and redwood trail hikes",
      "Cliffside morning yoga and meditation",
      "Tide pool and marine ecology walks",
      "Farm-to-table dining experiences",
      "Small group — 8 travelers maximum",
    ],
  },
  "joshua-tree-spring-equinox-2027": {
    destination: "Joshua Tree",
    location: "California",
    threshold: "Spring Equinox",
    window: "March 18–23, 2027",
    season: "Spring Equinox",
    tagline: "Equal light, equal dark. The desert blooms at the exact moment the world rebalances.",
    description: "Five days anchored to the spring equinox — when the Mojave comes alive after winter rains, wildflowers carpet the desert floor, and the night sky is the darkest you've ever seen. The equinox marks the return of light, and the desert responds in kind. Dawn yoga among the boulders, desert ecology walks, stargazing sessions, and silence so deep it becomes its own kind of music.",
    gradient: "linear-gradient(165deg, #c17f43, #8b4513, #d4855a)",
    accent: C.goldenAmber,
    spots: 8,
    price: "From $795 per person",
    highlights: [
      "5 nights near Joshua Tree National Park",
      "Spring equinox sunrise ceremony in the boulders",
      "Daily guided desert hikes and boulder walks",
      "Dawn yoga and desert breathwork",
      "Night sky stargazing with astronomy guide",
      "Desert ecology and wildflower walks",
      "Small group — 8 travelers maximum",
    ],
  },
};

export default function TripPage() {
  const { slug } = useParams();
  const trip = trips[slug];

  if (!trip) {
    return (
      <>
        <Nav />
        <div style={{
          padding: "160px 52px 120px", background: C.cream,
          textAlign: "center", minHeight: "60vh",
        }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36, fontWeight: 300, color: C.darkInk, marginBottom: 20,
          }}>Trip not found</h1>
          <Link to="/offerings" className="underline-link">Back to Offerings</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />

      {/* ── Hero ── */}
      <section style={{
        height: "60vh", minHeight: 420,
        background: trip.gradient,
        display: "flex", alignItems: "flex-end",
        padding: "0 52px 60px",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.15)",
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
          {/* Threshold badge */}
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            padding: "8px 18px",
            marginBottom: 20,
          }}>
            <span style={{
              fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: C.darkInk,
            }}>Coming Soon · {trip.threshold}</span>
          </div>
          <p style={{
            fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)", marginBottom: 8,
          }}>{trip.location}</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 300,
            color: "white", lineHeight: 1.1, marginBottom: 16,
          }}>{trip.destination}</h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, fontStyle: "italic",
            color: "rgba(255,255,255,0.8)", lineHeight: 1.5,
          }}>{trip.tagline}</p>
        </div>
      </section>

      {/* ── Details ── */}
      <section style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>

          {/* Threshold + Date + Price bar */}
          <FadeIn>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "24px 0 40px",
              borderBottom: `1px solid ${C.stone}`,
              marginBottom: 48,
              flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <span style={{
                  fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: trip.accent, display: "block", marginBottom: 6,
                }}>Threshold · {trip.threshold}</span>
                <span style={{
                  fontFamily: "'Quicksand'", fontSize: 18, fontWeight: 400,
                  color: C.darkInk,
                }}>{trip.window}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: trip.accent, display: "block", marginBottom: 6,
                }}>Price</span>
                <span style={{
                  fontFamily: "'Quicksand'", fontSize: 18, fontWeight: 400,
                  color: C.darkInk,
                }}>{trip.price}</span>
              </div>
            </div>
          </FadeIn>

          {/* Description */}
          <FadeIn delay={0.1}>
            <p style={{
              fontFamily: "'Quicksand'", fontSize: 16, color: "#5a6a78",
              lineHeight: 2, marginBottom: 56,
            }}>{trip.description}</p>
          </FadeIn>

          {/* Highlights */}
          <FadeIn delay={0.15}>
            <div style={{ marginBottom: 56 }}>
              <span style={{
                fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: trip.accent, display: "block", marginBottom: 20,
              }}>What's Included</span>
              <div style={{ display: "grid", gap: 16 }}>
                {trip.highlights.map((h, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "baseline", gap: 14,
                    padding: "12px 0",
                    borderBottom: i < trip.highlights.length - 1 ? `1px solid ${C.stone}` : "none",
                  }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 18, fontWeight: 300, color: trip.accent,
                      flexShrink: 0,
                    }}>·</span>
                    <span style={{
                      fontFamily: "'Quicksand'", fontSize: 15, color: "#5a6a78",
                      lineHeight: 1.7,
                    }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Waitlist CTA */}
          <FadeIn delay={0.2}>
            <div style={{
              padding: "48px 40px",
              background: C.darkInk, textAlign: "center",
            }}>
              <span style={{
                fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: trip.accent, display: "block", marginBottom: 12,
              }}>Coming Soon · {trip.threshold}</span>
              <h3 style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 300,
                color: "white", marginBottom: 8,
              }}>{trip.spots} spots · {trip.window}</h3>
              <p style={{
                fontFamily: "'Quicksand'", fontSize: 14, color: "rgba(255,255,255,0.5)",
                marginBottom: 24,
              }}>Booking opens soon. Check back or explore our guides in the meantime.</p>
              <Link to="/destinations" className="underline-link underline-link-light" onClick={() => trackEvent('trip_cta_clicked', { action: 'explore_destinations', trip_slug: slug })}>Explore Destinations</Link>
            </div>
          </FadeIn>

          {/* Back link */}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link to="/offerings" className="underline-link" onClick={() => trackEvent('trip_cta_clicked', { action: 'back_to_offerings', trip_slug: slug })}>← Back to Offerings</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
