// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: OFFERINGS
// ═══════════════════════════════════════════════════════════════════════════════

import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader } from '@components';
import { C } from '@data/brand';

// ─── The Braid: Three Threads ────────────────────────────────────────────────
const threads = [
  {
    eyebrow: "The Where",
    name: "Sacred Terrain",
    color: C.goldenAmber,
    description: "Iconic landscapes chosen for their capacity to dissolve the ordinary. Ancient canyons, high desert silence, wild Pacific coastlines. The land itself is the first teacher.",
    ingredients: ["Canyon trails at dawn", "High desert plateaus", "Old-growth forest", "Wild coastlines", "Alpine meadows", "River corridors"],
    // Replace with P.xxx when photos are ready
    photo: null,
    gradient: "linear-gradient(165deg, #a0522d 0%, #6b3520 40%, #c0714a 100%)",
  },
  {
    eyebrow: "The Within",
    name: "The Practice",
    color: C.seaGlass,
    description: "Ancient wellness traditions woven into every day. Not bolted on as amenities — built in as the reason you came. The inner journey that makes the outer one matter.",
    ingredients: ["Sunrise yoga", "Canyon meditation", "Breathwork sessions", "Cold plunges", "Stargazing ceremonies", "Mindful movement"],
    photo: null,
    gradient: "linear-gradient(165deg, #4a7a6a 0%, #2d5a4a 40%, #7fb5a0 100%)",
  },
  {
    eyebrow: "The Around",
    name: "The Ritual",
    color: C.sunSalmon,
    description: "Every detail is intentional. Farm dinners under open sky. Lodging that puts you inside the landscape. Conservation work that gives back. Community that goes deeper than small talk.",
    ingredients: ["Farm-to-table dinners", "Unique accommodations", "Guided naturalist hikes", "Conservation service", "Local artisan visits", "Community gatherings"],
    photo: null,
    gradient: "linear-gradient(165deg, #c4593c 0%, #8b3a2a 40%, #d4855a 100%)",
  },
];

// ─── Sample Itinerary (convergence moment) ───────────────────────────────────
const sampleItinerary = [
  { time: "6:00 AM",  title: "Sunrise yoga above the canyon floor",          thread: "practice", color: C.seaGlass },
  { time: "8:30 AM",  title: "Breakfast at a local farm café",               thread: "ritual",   color: C.sunSalmon },
  { time: "10:00 AM", title: "Guided hike through the Narrows",              thread: "terrain",  color: C.goldenAmber },
  { time: "1:00 PM",  title: "Lunch & rest at the canyon lodge",             thread: "ritual",   color: C.sunSalmon },
  { time: "3:30 PM",  title: "Breathwork session at the river's edge",       thread: "practice", color: C.seaGlass },
  { time: "5:00 PM",  title: "Conservation walk with a local steward",       thread: "ritual",   color: C.sunSalmon },
  { time: "7:00 PM",  title: "Farm dinner under open sky in Torrey",         thread: "ritual",   color: C.sunSalmon },
  { time: "9:00 PM",  title: "Stargazing from Under Canvas",                 thread: "practice", color: C.seaGlass },
];

// ─── Upcoming Threshold Trips ────────────────────────────────────────────────
const upcomingTrips = [
  {
    slug: "zion-autumn-equinox-2026",
    destination: "Zion Canyon",
    location: "Utah",
    threshold: "Autumn Equinox",
    window: "September 20–26, 2026",
    tagline: "The canyon exhales. Light softens, cottonwoods ignite, and the crowds dissolve.",
    gradient: "linear-gradient(165deg, #c4593c, #8b3a2a, #d4855a)",
    accent: C.sunSalmon,
    spots: 8,
  },
  {
    slug: "big-sur-harvest-moon-2026",
    destination: "Big Sur",
    location: "California",
    threshold: "Harvest Moon",
    window: "October 5–11, 2026",
    tagline: "The fog lifts, the kelp forests glow, and the Pacific turns to gold under a full moon.",
    gradient: "linear-gradient(165deg, #4A9B9F, #2d6b6e, #7BB8D4)",
    accent: C.oceanTeal,
    spots: 8,
  },
  {
    slug: "joshua-tree-spring-equinox-2027",
    destination: "Joshua Tree",
    location: "California",
    threshold: "Spring Equinox",
    window: "March 18–23, 2027",
    tagline: "Equal light, equal dark. The desert blooms at the exact moment the world rebalances.",
    gradient: "linear-gradient(165deg, #c17f43, #8b4513, #d4855a)",
    accent: C.goldenAmber,
    spots: 8,
  },
];

// ─── Four Ways / Offerings Data ──────────────────────────────────────────────
const offerings = [
  {
    icon: "☐",
    label: "DIY",
    color: C.skyBlue,
    title: "Explore the Guide",
    desc: "Browse our curated picks for free — where to stay, what to hike, where to eat, and when the light is best.",
    cta: "Explore Guides Free",
    ctaLink: "/destinations",
    detail: "Free · No account needed",
  },
  {
    icon: "◎",
    label: "Plan a Trip",
    color: C.oceanTeal,
    title: "Trip Planner",
    desc: "Turn your favorites into a day-by-day itinerary with booking links, permit timing, and offline access.",
    cta: "Unlock — $39",
    ctaLink: "/plan",
    detail: "One-time purchase · Offline access",
  },
  {
    icon: "☾",
    label: "Join a Group",
    color: C.sunSalmon,
    title: "Threshold Trips",
    desc: "Small group journeys timed to equinoxes, solstices, and natural crescendos. Guided, curated, eight travelers maximum.",
    cta: "View Trips",
    ctaLink: "#upcoming",
    detail: "From $895 per person",
  },
  {
    icon: "△",
    label: "Designed for You",
    color: C.goldenAmber,
    title: "Custom Itinerary",
    desc: "Tell us your dates, group, and vibe. A real person builds a complete itinerary around your trip.",
    cta: "Start — From $199",
    ctaLink: "/contact",
    detail: "Personalized · Human-crafted",
  },
];

export default function OfferingsPage() {
  return (
    <>
      <Nav />
      <PageHeader
        eyebrow="Our Approach"
        title="More Than a Trip"
        subtitle="Three braids woven into every Lila journey — sacred places, ancient wisdom, and raw elemental experience."
        accentColor={C.goldenAmber}
      >
        {/* Three braid labels */}
        <div style={{
          display: "flex", gap: 48, marginTop: 36,
        }}>
          {[
            { icon: "△", label: "Sacred Terrain", color: "#7DB8A0", desc: "The landscape is the teacher" },
            { icon: "◎", label: "Ancient Practices", color: "#D4A853", desc: "Wisdom traditions woven in" },
            { icon: "✦", label: "Elemental Encounters", color: "#6BA4B8", desc: "The raw materials of being alive" },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, color: b.color, opacity: 0.7 }}>{b.icon}</span>
              <div>
                <span style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.16em", textTransform: "uppercase",
                  color: b.color, display: "block",
                }}>{b.label}</span>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 14, fontStyle: "italic",
                  color: "#8a9baa",
                }}>{b.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </PageHeader>

      {/* ══ THREE THREADS — Detail Cards ══════════════════════════════════════ */}
      <section style={{ padding: "48px 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Three thread cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}>
            {threads.map((thread, i) => (
              <FadeIn key={thread.name} delay={i * 0.1}>
                <div style={{
                  background: "white",
                  overflow: "hidden",
                  transition: "transform 0.4s ease, box-shadow 0.4s ease",
                  display: "flex", flexDirection: "column",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                >
                  {/* Image / gradient placeholder */}
                  <div style={{
                    height: 240,
                    background: thread.photo
                      ? `url(${thread.photo}) center/cover`
                      : thread.gradient,
                    position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                      background: "linear-gradient(to top, white 0%, transparent 100%)",
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{ padding: "16px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <span style={{
                      fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      color: thread.color, display: "block", marginBottom: 10,
                    }}>{thread.eyebrow}</span>

                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 28, fontWeight: 400, color: C.darkInk,
                      lineHeight: 1.2, marginBottom: 14,
                    }}>{thread.name}</h3>

                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 15, fontStyle: "italic",
                      color: "#5a6a78", lineHeight: 1.8,
                      marginBottom: 24, flex: 1,
                    }}>{thread.description}</p>

                    {/* Ingredient tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {thread.ingredients.map(ing => (
                        <span key={ing} style={{
                          fontFamily: "'Quicksand'",
                          fontSize: 10, fontWeight: 600,
                          letterSpacing: "0.04em",
                          color: thread.color,
                          background: `${thread.color}12`,
                          padding: "5px 12px",
                        }}>
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CONVERGENCE — A Day With Lila
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              {/* Visual convergence — three colored lines */}
              <div style={{
                display: "flex", justifyContent: "center", alignItems: "center",
                gap: 16, marginBottom: 28,
              }}>
                <div style={{ width: 48, height: 1, background: C.goldenAmber }} />
                <div style={{ width: 48, height: 1, background: C.seaGlass }} />
                <div style={{ width: 48, height: 1, background: C.sunSalmon }} />
              </div>
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
                fontSize: 18, fontStyle: "italic", color: "#5a6a78",
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
                  color: "#9aa8b2", fontStyle: "italic",
                }}>Sample day</span>
                <span style={{ fontSize: 11, color: "#c0c8cd" }}>·</span>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 14, fontWeight: 400,
                  color: "#9aa8b2", fontStyle: "italic",
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
                    {/* Time */}
                    <span style={{
                      fontFamily: "'Quicksand'",
                      fontSize: 11, fontWeight: 600,
                      color: "#9aa8b2",
                      letterSpacing: "0.06em",
                      paddingTop: 2,
                      textAlign: "right",
                    }}>{item.time}</span>

                    {/* Dot + connector */}
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

                    {/* Description */}
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
                  { name: "Sacred Terrain", color: C.goldenAmber },
                  { name: "The Practice", color: C.seaGlass },
                  { name: "The Ritual", color: C.sunSalmon },
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

      {/* ══════════════════════════════════════════════════════════════════════
          ACT 2 — TRAVEL YOUR WAY
      ══════════════════════════════════════════════════════════════════════ */}
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
                fontSize: 18, fontStyle: "italic", color: "#5a6a78",
                maxWidth: 560, margin: "0 auto",
              }}>
                However you like to move through the world, there's a way in.
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
                  {/* Icon */}
                  <div style={{
                    fontFamily: "serif", fontSize: 28, color: o.color,
                    marginBottom: 24, lineHeight: 1,
                  }}>{o.icon}</div>

                  {/* Label */}
                  <span style={{
                    fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.22em", textTransform: "uppercase",
                    color: o.color, display: "block", marginBottom: 12,
                  }}>{o.label}</span>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 26, fontWeight: 400, color: C.darkInk,
                    lineHeight: 1.2, marginBottom: 16,
                  }}>{o.title}</h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 15, fontStyle: "italic",
                    color: "#5a6a78", lineHeight: 1.8,
                    flex: 1,
                  }}>{o.desc}</p>

                  {/* CTA Button */}
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

                  {/* Detail line */}
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

      {/* ══════════════════════════════════════════════════════════════════════
          UPCOMING THRESHOLD TRIPS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="upcoming" style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{
                fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: C.sunSalmon, display: "block", marginBottom: 12,
              }}>Upcoming Experiences</span>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300,
                color: C.darkInk, marginBottom: 16,
              }}>Threshold Trips</h2>
              <p style={{
                fontFamily: "'Quicksand'", fontSize: 15, color: "#5a6a78",
                lineHeight: 1.8, maxWidth: 580, margin: "0 auto",
              }}>
                Journeys timed to equinoxes, solstices, and seasonal turning points —
                when a place crosses into its most powerful window.
              </p>
            </div>
          </FadeIn>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 28,
          }}>
            {upcomingTrips.map((trip, i) => (
              <FadeIn key={trip.slug} delay={i * 0.1}>
                <Link
                  to={`/trips/${trip.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div style={{
                    background: "white",
                    overflow: "hidden",
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  >
                    {/* Photo placeholder with gradient */}
                    <div style={{
                      height: 200,
                      background: trip.gradient,
                      display: "flex",
                      alignItems: "flex-end",
                      padding: 20,
                      position: "relative",
                    }}>
                      <div style={{
                        position: "absolute", top: 16, right: 16,
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(8px)",
                        padding: "6px 14px",
                        fontSize: 9, fontFamily: "'Quicksand'", fontWeight: 700,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: C.darkInk,
                      }}>
                        Coming Soon
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 600,
                          letterSpacing: "0.15em", textTransform: "uppercase",
                          color: "rgba(255,255,255,0.7)", marginBottom: 4,
                        }}>{trip.location}</p>
                        <h3 style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 28, fontWeight: 300, color: "white",
                          lineHeight: 1.2,
                        }}>{trip.destination}</h3>
                      </div>
                    </div>

                    <div style={{ padding: "24px 24px 28px" }}>
                      <span style={{
                        fontFamily: "'Quicksand'", fontSize: 9, fontWeight: 700,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        color: trip.accent,
                        display: "inline-block",
                        padding: "4px 10px",
                        border: `1px solid ${trip.accent}`,
                        marginBottom: 12,
                      }}>{trip.threshold}</span>

                      <p style={{
                        fontFamily: "'Quicksand'", fontSize: 12, fontWeight: 600,
                        color: "#5a6a78", letterSpacing: "0.04em",
                        marginBottom: 10,
                      }}>{trip.window}</p>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 16, fontStyle: "italic",
                        color: "#5a6a78", lineHeight: 1.7,
                        marginBottom: 16,
                      }}>{trip.tagline}</p>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                        <span style={{
                          fontFamily: "'Quicksand'", fontSize: 11,
                          color: "#8a96a3", letterSpacing: "0.04em",
                        }}>{trip.spots} spots</span>
                        <span style={{
                          fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700,
                          letterSpacing: "0.18em", textTransform: "uppercase",
                          color: trip.accent,
                        }}>Learn More →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
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
              <Link to="/destinations" className="underline-link underline-link-light">Explore Destinations</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
