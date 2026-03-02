// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: DESTINATION GUIDE (generic scaffold)
// ═══════════════════════════════════════════════════════════════════════════════
//
// This is the default guide page for destinations that don't have a
// dedicated guide component (like ZionGuide.jsx). It shows the destination
// overview plus a "coming soon" or placeholder guide structure.
//
// When you build out a full guide for a destination, create a dedicated
// file (e.g. pages/guides/BigSurGuide.jsx) and wire it up in App.jsx.
//

import { useParams, Link, Navigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHero, Breadcrumb } from '@components';
import { C } from '@data/brand';
import { destinations } from '@data/destinations';
import { trackEvent } from '@utils/analytics';

export default function DestinationGuide() {
  const { slug } = useParams();
  const dest = destinations.find(d => d.slug === slug);

  if (!dest) return <Navigate to="/404" replace />;

  return (
    <>
      <Nav />
      <PageHero
        eyebrow={dest.location}
        title={dest.name}
        subtitle={dest.description}
        photo={dest.photo}
        gradient={dest.gradient}
        accentColor={dest.accent}
      />

      <section className="page-content" style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Breadcrumb items={[
            { label: "Home", to: "/" },
            { label: "Destinations", to: "/destinations" },
            { label: dest.name },
          ]} />

          <div style={{ marginTop: 48 }}>
            <FadeIn>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
                padding: "10px 20px",
                background: `${dest.accent}15`,
                border: `1px solid ${dest.accent}30`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: dest.accent }} />
                <span style={{
                  fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase", color: dest.accent,
                }}>
                  Best Window: {dest.threshold}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h2 style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 300,
                color: C.darkInk, lineHeight: 1.3, marginBottom: 24,
              }}>
                {dest.guideAvailable ? "Your Complete Guide" : "Guide Coming Soon"}
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 16, fontWeight: 400, color: "#5a6a78",
                lineHeight: 2.0, marginBottom: 32,
              }}>
                {dest.guideAvailable
                  ? `Everything you need to experience ${dest.name} at its most magical. Curated accommodations, inspired itineraries, wellness rituals, and insider knowledge — all timed to the perfect threshold window.`
                  : `We're crafting something special for ${dest.name}. This guide is being built with the same care and depth as all Lila Trips experiences — vetted accommodations, curated itineraries, and wellness practices woven into extraordinary terrain.`
                }
              </p>
            </FadeIn>

            {/* Guide sections or coming soon */}
            {dest.guideAvailable ? (
              <FadeIn delay={0.3}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 32 }}>
                  {["Itinerary", "Accommodations", "Rituals & Wellness", "Practical Details"].map((section, i) => (
                    <div key={section} style={{
                      padding: "32px 28px", background: C.warmWhite,
                      border: `1px solid ${C.stone}`, transition: "border-color 0.3s", cursor: "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = dest.accent}
                    onMouseLeave={e => e.currentTarget.style.borderColor = C.stone}
                    >
                      <span style={{
                        fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        color: dest.accent, display: "block", marginBottom: 12,
                      }}>{`0${i + 1}`}</span>
                      <h4 style={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: 18, fontWeight: 500, color: C.darkInk, marginBottom: 8,
                      }}>{section}</h4>
                      <p style={{
                        fontFamily: "'Quicksand'", fontSize: 13, color: "#7a90a0", lineHeight: 1.7,
                      }}>Content for this section will be expanded as the guide is built out.</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ) : (
              <FadeIn delay={0.3}>
                <div style={{
                  padding: "48px 40px", background: C.warmWhite,
                  border: `1px solid ${C.stone}`, textAlign: "center",
                }}>
                  <span style={{ fontSize: 32, display: "block", marginBottom: 16, opacity: 0.4 }}>✦</span>
                  <h3 style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 18, fontWeight: 500, color: C.darkInk, marginBottom: 12,
                  }}>Notify Me When Ready</h3>
                  <p style={{
                    fontFamily: "'Quicksand'", fontSize: 14, color: "#7a90a0",
                    lineHeight: 1.7, maxWidth: 400, margin: "0 auto 24px",
                  }}>
                    Be the first to know when the {dest.name} guide launches — including early access to threshold timing and curated experiences.
                  </p>
                  <div style={{
                    display: "inline-block", padding: "12px 32px",
                    background: C.darkInk, color: "white",
                    fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    cursor: "pointer", transition: "opacity 0.2s",
                  }}
                  onClick={() => trackEvent('guide_notify_clicked', { destination: dest.slug })}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >Get Notified</div>
                </div>
              </FadeIn>
            )}

            {/* Other destinations */}
            <FadeIn delay={0.4}>
              <div style={{ marginTop: 80 }}>
                <span className="eyebrow" style={{ color: "#9aabba" }}>Also Explore</span>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
                  {destinations.filter(d => d.slug !== dest.slug).slice(0, 3).map(other => (
                    <Link key={other.slug} to={`/destinations/${other.slug}`} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 20px", border: `1px solid ${C.stone}`,
                      transition: "all 0.25s", background: C.warmWhite, textDecoration: "none",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = other.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.stone; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: other.accent, opacity: 0.6 }} />
                      <span style={{
                        fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 600,
                        letterSpacing: "0.1em", textTransform: "uppercase", color: C.darkInk,
                      }}>{other.name}</span>
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
