// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: OUR ETHOS — "What Makes a Lila Trip"
// ═══════════════════════════════════════════════════════════════════════════════
//
// Structure:
//   1. Hero — "What makes a Lila trip."
//   2. Sacred Terrain — landscape as teacher (narrative + tags)
//   3. Ancient Practices — steeped in living tradition (narrative + tags + traditions → principles)
//   4. Elemental Encounters — where the senses take over (narrative + individually colored tags)
//   5. Convergence — the threads woven together
//
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, PageHeader } from '@components';
import { C } from '@data/brand';
import { ritualsPillars, traditions, ritualsIntro } from '@data/rituals';

// ─── Section Data ───────────────────────────────────────────────────────────

const approachBraids = [
  {
    id: "sacred-terrain",
    icon: "△",
    label: "Sacred Terrain",
    color: "#7DB8A0",
    headline: "The landscape is the teacher.",
    body: "We don't choose destinations for their Instagram potential. We choose them for their capacity to dissolve the ordinary — places where canyon walls hold millions of years of silence, where ancient forests hum with something older than language, where the horizon line rearranges something inside you.",
    tags: ["Iconic Destinations", "Threshold Timing", "Canyon & Desert", "Old-Growth Forest", "Wild Coastline"],
    tagLabel: "Where we go",
    cta: { text: "Explore Destinations", link: "/destinations" },
  },
  {
    id: "ancient-practices",
    icon: "◎",
    label: "Ancient Practices",
    color: "#D4A853",
    headline: "Steeped in living tradition.",
    body: "Across centuries and continents, wisdom traditions have arrived at remarkably similar truths about how to live well. We draw from principles shared across Buddhist, Hindu, Taoist, and Stoic philosophy — oneness, flow, presence, reverence — and weave them into every journey.",
    tags: ["Yoga", "Breathwork", "Meditation", "Cold Immersion", "Mindful Movement", "Journaling"],
    tagLabel: "What we practice",
    cta: null,
  },
  {
    id: "elemental-encounters",
    icon: "✦",
    label: "Elemental Encounters",
    color: "#6BA4B8",
    headline: "Where the senses take over.",
    body: "Before there were words for it, there was this — sunlight, cold water, stone, sky. These elemental forces are the oldest teachers on earth. We design journeys that put you directly in conversation with them.",
    tags: [
      { text: "Sunlight", color: "#D4A853" },
      { text: "Cold Water", color: "#6BA4B8" },
      { text: "Starry Skies", color: "#7DB8A0" },
      { text: "Ancient Stone", color: "#E8956A" },
      { text: "Silence", color: "#A89080" },
      { text: "Firelight", color: "#D4A853" },
    ],
    tagLabel: "What you'll feel",
    cta: null,
  },
];

const approachPrinciples = [
  {
    word: "Oneness", icon: "◯", color: "#6BA4B8",
    desc: "The boundaries between self and world soften. You stop observing the landscape and become part of it.",
  },
  {
    word: "Flow", icon: "≈", color: "#7DB8A0",
    desc: "When effort dissolves and everything moves. The trail carries you. The river thinks for you. Time reshapes itself.",
  },
  {
    word: "Presence", icon: "◉", color: "#D4A853",
    desc: "The full weight of now. Not weighed down by what brought you here or pulled toward what comes next.",
  },
  {
    word: "Reverence", icon: "✧", color: "#E8956A",
    desc: "The instinct to bow before something ancient. A canyon. A night sky. The quiet recognition that you are small.",
  },
];


export default function EthosPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 860);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <Nav />

      {/* ══ HERO ═══════════════════════════════════════════════════════════════ */}
      <PageHeader
        eyebrow="Our Ethos"
        title="What makes a Lila trip."
        subtitle="Every Lila journey is woven from three braids — iconic landscapes that dissolve the ordinary, ancient practices that quiet the noise, and raw elemental encounters that wake you up. Here's how they come together."
        accentColor={C.goldenAmber}
      >
        {/* Quick-nav braid markers */}
        <div style={{
          display: "flex", gap: isMobile ? 24 : 40,
          flexDirection: isMobile ? "column" : "row",
          marginTop: 32, paddingTop: 32,
          borderTop: `1px solid ${C.stone}`,
        }}>
          {approachBraids.map((b) => (
            <a
              key={b.id}
              href={`#${b.id}`}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                textDecoration: "none", transition: "opacity 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <span style={{ fontSize: 20, color: b.color, lineHeight: 1 }}>{b.icon}</span>
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: C.darkInk,
              }}>{b.label}</span>
            </a>
          ))}
        </div>
      </PageHeader>


      {/* ══ BRAID SECTIONS ═════════════════════════════════════════════════════ */}
      {approachBraids.map((b, bi) => {
        const isDark = bi % 2 === 0;
        return (
          <section
            key={b.id}
            id={b.id}
            style={{
              padding: "80px 52px",
              background: isDark
                ? `linear-gradient(165deg, ${C.darkInk}, #1a3040)`
                : C.cream,
            }}
          >
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              <FadeIn>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: isMobile ? 40 : 72,
                  alignItems: "start",
                }}>
                  {/* Left: narrative */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <span style={{ fontSize: 24, color: b.color, opacity: 0.7, lineHeight: 1 }}>{b.icon}</span>
                      <span style={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        color: b.color,
                      }}>{b.label}</span>
                    </div>

                    <h2 style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: "clamp(24px, 3.5vw, 36px)",
                      fontWeight: 300,
                      color: isDark ? "white" : C.darkInk,
                      lineHeight: 1.25,
                      marginBottom: 24,
                      marginTop: 0,
                    }}>
                      {b.headline}
                    </h2>

                    <p style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: "clamp(13px, 1.4vw, 15px)",
                      fontWeight: 400,
                      color: isDark ? "rgba(255,255,255,0.55)" : "#5a6a78",
                      lineHeight: 2.0,
                      letterSpacing: "0.02em",
                      marginBottom: b.cta ? 32 : 0,
                    }}>
                      {b.body}
                    </p>

                    {b.cta && (
                      <Link to={b.cta.link} style={{
                        display: "inline-flex", alignItems: "center", gap: 10,
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: b.color, textDecoration: "none",
                        paddingBottom: 4, borderBottom: `1px solid ${b.color}`,
                        transition: "gap 0.3s, opacity 0.3s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.gap = "14px"; e.currentTarget.style.opacity = "0.7"; }}
                      onMouseLeave={e => { e.currentTarget.style.gap = "10px"; e.currentTarget.style.opacity = "1"; }}
                      >
                        {b.cta.text} <span>→</span>
                      </Link>
                    )}
                  </div>

                  {/* Right: tag chips */}
                  <div style={{ paddingTop: isMobile ? 0 : 48 }}>
                    <span style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: isDark ? "rgba(255,255,255,0.25)" : "#9aabba",
                      display: "block", marginBottom: 20,
                    }}>
                      {b.tagLabel}
                    </span>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {b.tags.map((tag, j) => {
                        const isObj = typeof tag === "object";
                        const text = isObj ? tag.text : tag;
                        const tagColor = isObj ? tag.color : b.color;
                        return (
                          <span
                            key={j}
                            style={{
                              fontFamily: "'Quicksand', sans-serif",
                              fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                              color: isDark ? `${tagColor}cc` : tagColor,
                              padding: "10px 20px",
                              border: `1px solid ${isDark ? `${tagColor}25` : `${tagColor}30`}`,
                              background: isDark ? `${tagColor}08` : `${tagColor}08`,
                              transition: "all 0.25s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = isDark ? `${tagColor}18` : `${tagColor}15`;
                              e.currentTarget.style.borderColor = isDark ? `${tagColor}40` : `${tagColor}50`;
                              e.currentTarget.style.color = tagColor;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isDark ? `${tagColor}08` : `${tagColor}08`;
                              e.currentTarget.style.borderColor = isDark ? `${tagColor}25` : `${tagColor}30`;
                              e.currentTarget.style.color = isDark ? `${tagColor}cc` : tagColor;
                            }}
                          >
                            {text}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* ─── Ancient Practices: Traditions → Principles ────────────── */}
              {bi === 1 && (
                <FadeIn delay={0.15}>
                  <div style={{
                    marginTop: 48,
                    paddingTop: 40,
                    borderTop: `1px solid ${C.stone}`,
                  }}>
                    <span style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "#9aabba", display: "block", marginBottom: 8,
                    }}>Five Traditions, Four Principles</span>
                    <p style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 14, fontWeight: 400,
                      color: "#5a6a78", lineHeight: 1.8,
                      marginBottom: 20, marginTop: 0,
                    }}>
                      From five ancient frameworks, we've distilled the principles that guide every Lila journey.
                    </p>

                    {/* Traditions row */}
                    <div style={{
                      display: "flex", gap: isMobile ? 16 : 28, flexWrap: "wrap",
                      marginBottom: 40,
                    }}>
                      {traditions.map((t) => (
                        <div key={t.name} style={{
                          display: "flex", alignItems: "center", gap: 8,
                        }}>
                          <span style={{
                            fontSize: 18, color: t.color, opacity: 0.5,
                            lineHeight: 1, fontFamily: "serif",
                          }}>{t.symbol}</span>
                          <span style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: 10, fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: "#5a6a78",
                          }}>{t.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Principles row */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
                      gap: isMobile ? 24 : 0,
                    }}>
                      {approachPrinciples.map((p, pi) => (
                        <div key={p.word} style={{
                          padding: isMobile ? "0" : "0 24px",
                          borderLeft: (!isMobile && pi > 0) ? `1px solid ${C.stone}` : "none",
                        }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            marginBottom: 12,
                          }}>
                            <span style={{
                              fontSize: 16, color: p.color, opacity: 0.7,
                            }}>{p.icon}</span>
                            <span style={{
                              fontFamily: "'Quicksand', sans-serif",
                              fontSize: 11, fontWeight: 700,
                              letterSpacing: "0.12em", textTransform: "uppercase",
                              color: p.color,
                            }}>{p.word}</span>
                          </div>
                          <p style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: 13, fontWeight: 400,
                            color: "#6a7a8a", lineHeight: 1.8,
                            margin: 0,
                          }}>{p.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 32 }}>
                      <Link to="/ethos/philosophy" style={{
                        display: "inline-flex", alignItems: "center", gap: 10,
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "#D4A853", textDecoration: "none",
                        paddingBottom: 4, borderBottom: "1px solid #D4A853",
                        transition: "gap 0.3s, opacity 0.3s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.gap = "14px"; e.currentTarget.style.opacity = "0.7"; }}
                      onMouseLeave={e => { e.currentTarget.style.gap = "10px"; e.currentTarget.style.opacity = "1"; }}
                      >
                        Explore the philosophy <span>→</span>
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          </section>
        );
      })}


      {/* ══ CONVERGENCE ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 52px", background: C.cream }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            {/* Visual convergence — three colored lines */}
            <div style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              gap: 16, marginBottom: 28,
            }}>
              <div style={{ width: 48, height: 1, background: "#7DB8A0" }} />
              <div style={{ width: 48, height: 1, background: "#D4A853" }} />
              <div style={{ width: 48, height: 1, background: "#6BA4B8" }} />
            </div>

            <span className="eyebrow" style={{ color: C.skyBlue, marginBottom: 24, display: "block" }}>
              The Convergence
            </span>
            <p style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              color: "#4a6070", lineHeight: 1.9, marginBottom: 20,
            }}>
              When landscape, practice, and element converge — something shifts. You stop performing the trip and start living it. The planning dissolves. The experience takes over. That's the threshold we're always reaching for.
            </p>
            <p style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 14, fontWeight: 400,
              color: "#7a8a9a", lineHeight: 1.9, marginBottom: 40,
            }}>
              We handle the logistics so you can cross it.
            </p>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/how-it-works" className="underline-link">See How It Works</Link>
              <Link to="/destinations" className="underline-link">Explore Destinations</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
