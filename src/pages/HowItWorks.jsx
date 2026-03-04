// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════════
//
// Structure:
//   1. Hero intro — "Travel your way"
//   2. A Day With Lila — sample itinerary convergence moment
//   3. Four Ways In — DIY / Trip Planner / Threshold Trips / Custom
//   4. Upcoming Threshold Trips
//   5. Bottom CTA
//
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader } from '@components';
import TripCard from '@components/TripCard';
import { C } from '@data/brand';
import { allTrips } from '@data/trips';
import { trackEvent } from '@utils/analytics';

// ─── Sample Itinerary ───────────────────────────────────────────────────────
const sampleItinerary = [
  { time: "8:00 AM",  title: "Morning yoga overlooking the canyon",            thread: "practice", color: "#D4A853" },
  { time: "9:30 AM",  title: "Breakfast at a local farm café",                 thread: "terrain",  color: "#7DB8A0" },
  { time: "11:00 AM", title: "Guided hike through the Narrows",               thread: "terrain",  color: "#7DB8A0" },
  { time: "2:00 PM",  title: "Lunch & rest at the canyon lodge",              thread: "terrain",  color: "#7DB8A0" },
  { time: "4:00 PM",  title: "Breathwork session at the river's edge",        thread: "practice", color: "#D4A853" },
  { time: "5:30 PM",  title: "Golden hour walk with a local steward",         thread: "terrain",  color: "#7DB8A0" },
  { time: "7:30 PM",  title: "Farm dinner under open sky in Torrey",          thread: "terrain",  color: "#7DB8A0" },
  { time: "9:30 PM",  title: "Stargazing from Under Canvas",                  thread: "element",  color: "#6BA4B8" },
];

// ─── Four Ways In ───────────────────────────────────────────────────────────
const offerings = [
  {
    icon: "☐\uFE0E",
    label: "DIY",
    color: C.skyBlue,
    title: "Explore the Guide",
    desc: "Browse our curated picks for free — where to stay, what to hike, where to eat, and when the light is best.",
    cta: "Explore Guides Free",
    ctaLink: "/destinations",
    detail: "Free · No account needed",
    offeringType: "diy",
  },
  {
    icon: "◎\uFE0E",
    label: "Plan a Trip",
    color: C.oceanTeal,
    title: "Trip Planner",
    desc: "Turn your favorites into a day-by-day itinerary with booking links, permit timing, and offline access.",
    cta: "Unlock — $39",
    ctaLink: "/plan",
    detail: "One-time purchase · Offline access",
    offeringType: "trip_planner",
  },
  {
    icon: "☾\uFE0E",
    label: "Join a Group",
    color: C.sunSalmon,
    title: "Threshold Trips",
    desc: "Small group journeys timed to equinoxes, solstices, and natural crescendos. Guided, curated, eight travelers maximum.",
    cta: "View Trips",
    ctaLink: "/group-trips",
    detail: "From $895 per person",
    offeringType: "group_trips",
  },
  {
    icon: "△\uFE0E",
    label: "Designed for You",
    color: C.goldenAmber,
    title: "Custom Itinerary",
    desc: "Tell us your dates, group, and vibe. A real person builds a complete itinerary around your trip.",
    cta: "Start — From $199",
    ctaLink: "/contact",
    detail: "Personalized · Human-crafted",
    offeringType: "custom",
  },
];

// (Trip data now imported from @data/trips)


export default function HowItWorksPage() {
  return (
    <>
      <Nav />

      <PageHeader
        eyebrow="Ways to Travel"
        title={<>From inspiration <span style={{ fontStyle: "normal", color: "#5a6a78" }}>to experience.</span></>}
        subtitle="However you like to move through the world, there's a way in. We handle the complexity so you can focus on being there."
        accentColor={C.oceanTeal}
        align="center"
      >
        {/* Three braids with labels */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: 48, marginTop: 36,
        }}>
          {[
            { label: "Sacred Terrain", color: "#7DB8A0" },
            { label: "Ancient Practices", color: "#D4A853" },
            { label: "Elemental Encounters", color: "#6BA4B8" },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 1.5, background: b.color, opacity: 0.7 }} />
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 9, fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: b.color, opacity: 0.8,
              }}>{b.label}</span>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* ══ A DAY WITH LILA ══════════════════════════════════════════════════ */}
      <section style={{ padding: "48px 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{
                fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: C.oceanTeal, display: "block", marginBottom: 12,
              }}>Woven Together</span>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300,
                color: C.darkInk, marginBottom: 16,
              }}>A day with Lila</h2>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18, fontStyle: "normal", color: "#5a6a78",
                maxWidth: 480, margin: "0 auto",
              }}>
                Here's what it looks like when the threads come together. Every day is a composition — not a schedule.
              </p>
            </div>
          </FadeIn>

          {/* Sample itinerary card */}
          <FadeIn delay={0.15}>
            <div style={{
              maxWidth: 680,
              margin: "0 auto",
              background: "white",
              border: `1px solid ${C.stone || '#e0dbd4'}`,
              overflow: "hidden",
            }}>
              {/* Itinerary header */}
              <div style={{
                padding: "28px 40px",
                borderBottom: `1px solid ${C.stone || '#e0dbd4'}`,
                display: "flex", alignItems: "baseline", gap: 12,
              }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 14, fontWeight: 400,
                  color: "#9aa8b2", fontStyle: "normal",
                }}>Sample day</span>
                <span style={{ fontSize: 11, color: "#c0c8cd" }}>·</span>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 14, fontWeight: 400,
                  color: "#9aa8b2", fontStyle: "normal",
                }}>Zion Canyon, Utah</span>
              </div>

              {/* Timeline */}
              <div style={{ padding: "32px 40px" }}>
                {sampleItinerary.map((item, i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "68px 6px 1fr",
                    gap: 18,
                    alignItems: "start",
                    paddingBottom: i < sampleItinerary.length - 1 ? 24 : 0,
                  }}>
                    <span style={{
                      fontFamily: "'Quicksand'",
                      fontSize: 11, fontWeight: 600,
                      color: "#9aa8b2",
                      letterSpacing: "0.06em",
                      paddingTop: 2,
                      textAlign: "right",
                    }}>{item.time}</span>

                    <div style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", paddingTop: 5,
                    }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: item.color, flexShrink: 0,
                      }} />
                      {i < sampleItinerary.length - 1 && (
                        <div style={{
                          width: 1, flex: 1, minHeight: 20,
                          background: `linear-gradient(to bottom, ${item.color}40, ${sampleItinerary[i+1].color}40)`,
                        }} />
                      )}
                    </div>

                    <span style={{
                      fontFamily: "'Quicksand'",
                      fontSize: 14, fontWeight: 400,
                      color: C.darkInk, lineHeight: 1.6,
                    }}>{item.title}</span>
                  </div>
                ))}
              </div>

              {/* Thread legend */}
              <div style={{
                padding: "20px 40px",
                borderTop: `1px solid ${C.stone || '#e0dbd4'}`,
                display: "flex", gap: 24, flexWrap: "wrap",
              }}>
                {[
                  { name: "Sacred Terrain", color: "#7DB8A0" },
                  { name: "Ancient Practices", color: "#D4A853" },
                  { name: "Elemental Encounters", color: "#6BA4B8" },
                ].map(t => (
                  <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} />
                    <span style={{
                      fontFamily: "'Quicksand'",
                      fontSize: 10, fontWeight: 600,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      color: "#9aa8b2",
                    }}>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ FOUR WAYS IN ═════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{
                fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: C.sunSalmon, display: "block", marginBottom: 12,
              }}>Your Path</span>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300,
                color: C.darkInk, marginBottom: 16,
              }}>Travel your way</h2>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18, fontStyle: "normal", color: "#5a6a78",
                maxWidth: 560, margin: "0 auto",
              }}>
                From free guides to fully custom itineraries — pick the level that fits.
              </p>
            </div>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 1,
            background: C.stone,
            border: `1px solid ${C.stone}`,
          }}>
            {offerings.map((o, i) => (
              <FadeIn key={o.label} delay={i * 0.08}>
                <div style={{
                  background: "white",
                  padding: "36px 28px 32px",
                  display: "flex", flexDirection: "column",
                  minHeight: 420,
                }}>
                  <div style={{
                    fontFamily: "serif", fontSize: 28, color: o.color,
                    marginBottom: 24, lineHeight: 1,
                  }}>{o.icon}</div>

                  <span style={{
                    fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.22em", textTransform: "uppercase",
                    color: o.color, display: "block", marginBottom: 12,
                  }}>{o.label}</span>

                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 26, fontWeight: 400, color: C.darkInk,
                    lineHeight: 1.2, marginBottom: 16,
                  }}>{o.title}</h3>

                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 15, fontStyle: "normal",
                    color: "#5a6a78", lineHeight: 1.8,
                    flex: 1,
                  }}>{o.desc}</p>

                  <div style={{ marginTop: 24 }}>
                    <Link
                      to={o.ctaLink}
                      style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        border: `1.5px solid ${o.color}`,
                        fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: o.color, textDecoration: "none",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => trackEvent('offering_cta_clicked', { offering: o.offeringType, destination_url: o.ctaLink })}
                      onMouseEnter={e => {
                        e.target.style.background = o.color;
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = "transparent";
                        e.target.style.color = o.color;
                      }}
                    >{o.cta}</Link>
                  </div>

                  <p style={{
                    fontFamily: "'Quicksand'", fontSize: 11,
                    color: "#8a96a3", marginTop: 12,
                  }}>{o.detail}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ UPCOMING GROUP TRIPS ═════════════════════════════════════════ */}
      <section id="upcoming" style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ marginBottom: 40 }}>
              <span style={{
                fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: C.sunSalmon, display: "block", marginBottom: 12,
              }}>Upcoming Experiences</span>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300,
                color: C.darkInk, marginBottom: 16,
              }}>Tuned to Earth Rhythms</h2>
              <p style={{
                fontFamily: "'Quicksand'", fontSize: 15, color: "#5a6a78",
                lineHeight: 1.8, maxWidth: 580,
              }}>
                Journeys timed to equinoxes, solstices, and seasonal turning points —
                when a place crosses into its most powerful window.
              </p>
            </div>
          </FadeIn>

          <div className="trips-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
          }}>
            {allTrips.slice(0, 3).map((trip, i) => (
              <FadeIn key={trip.slug} delay={i * 0.1}>
                <TripCard trip={trip} />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div style={{ marginTop: 36 }}>
              <Link to="/group-trips" className="underline-link" onClick={() => trackEvent('offering_cta_clicked', { offering: 'view_all_trips' })}>View All Trips</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BOTTOM CTA ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: "0 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn delay={0.2}>
            <div style={{
              padding: "48px 40px",
              background: C.darkInk, textAlign: "center",
            }}>
              <span className="eyebrow" style={{ color: C.skyBlue }}>Not sure where to start?</span>
              <h3 style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, color: "white", marginBottom: 20,
              }}>Pick a destination. The guide is free.</h3>
              <Link to="/destinations" className="underline-link underline-link-light" onClick={() => trackEvent('offering_cta_clicked', { offering: 'explore_destinations' })}>Explore Destinations</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          .trips-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .trips-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        }
      `}</style>
    </>
  );
}
