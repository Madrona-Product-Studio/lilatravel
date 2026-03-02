import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';
import { traditions } from '@data/rituals';

// ─── Data ────────────────────────────────────────────────────────────────────
const principles = [
  {
    word: "Oneness",
    icon: "◯",
    color: "#6BA4B8",
    quote: "You are not a drop in the ocean. You are the entire ocean in a drop.",
    author: "Rumi",
    desc: "The boundaries between self and world soften. You stop observing the landscape and become part of it. The canyon doesn't stand apart from you — you're made of the same ancient material. The river isn't scenery; it's circulation. This is the oldest truth these traditions share: separation is the illusion.",
    inPractice: "On a Lila trip, oneness emerges naturally — through sunrise yoga on slickrock where the stone becomes your mat, through silent hikes where the trail thinks for you, through cold water immersion where the river erases the boundary between inner and outer.",
    traditions: [
      {
        symbol: "ॐ", concept: "Brahman-Ātman", source: "Hindu / Yoga",
        metaphor: "The drop is the ocean.",
        quote: "As the same fire assumes different shapes when it consumes objects differing in shape, so does the one Self take the shape of every creature in whom he is present.",
        quoteSource: "Katha Upanishad",
      },
      {
        symbol: "✿", concept: "Pratītyasamutpāda", source: "Buddhism",
        metaphor: "Everything co-creates everything else.",
        quote: "In this handful of soil, I see the presence of the entire cosmos. A cloud floats in this sheet of paper.",
        quoteSource: "Thich Nhat Hanh",
      },
      {
        symbol: "☯", concept: "The Tao", source: "Taoism",
        metaphor: "Two sides of one breath.",
        quote: "The Tao that can be told is not the eternal Tao. The name that can be named is not the eternal name. The nameless is the beginning of heaven and earth.",
        quoteSource: "Lao Tzu, Tao Te Ching",
      },
      {
        symbol: "⛩", concept: "Musubi", source: "Shinto",
        metaphor: "The divine is woven through all of nature.",
        quote: "Every mountain, every river, every plant, every tree — all have their own kami. The world is not matter animated by spirit. It is spirit made visible.",
        quoteSource: "Shinto teaching",
      },
      {
        symbol: "△", concept: "Sympatheia & Logos", source: "Stoicism",
        metaphor: "Every thread is the whole tapestry.",
        quote: "Constantly regard the universe as one living being, having one substance and one soul; and observe how all things have reference to one perception.",
        quoteSource: "Marcus Aurelius, Meditations",
      },
    ],
  },
  {
    word: "Flow",
    icon: "≈",
    color: "#7DB8A0",
    quote: "Life is a series of natural and spontaneous changes. Don't resist them; that only creates sorrow.",
    author: "Lao Tzu",
    desc: "When effort dissolves and everything moves. The trail carries you. The river thinks for you. Time reshapes itself around the experience rather than the clock. Flow is what happens when you stop managing and start surrendering — to terrain, to rhythm, to whatever the day wants to become.",
    inPractice: "We design Lila itineraries to invite flow — mornings that unfold without alarms, trails chosen for their rhythm rather than their difficulty, evenings that gather momentum toward stillness rather than entertainment. The logistics disappear so the current can carry you.",
    traditions: [
      {
        symbol: "ॐ", concept: "Sahaja", source: "Hindu / Yoga",
        metaphor: "The effortless state.",
        quote: "When the restlessness of the mind, intellect and self is stilled through the practice of yoga, the yogi finds fulfillment — resting in the self, content within the self.",
        quoteSource: "Bhagavad Gita, 6.20",
      },
      {
        symbol: "✿", concept: "Anicca", source: "Buddhism",
        metaphor: "All things are in constant motion.",
        quote: "No one can step twice into the same river, for other waters are ever flowing on. Everything flows and nothing abides.",
        quoteSource: "Buddhist teaching, after Heraclitus",
      },
      {
        symbol: "☯", concept: "Wu Wei", source: "Taoism",
        metaphor: "Action without forcing.",
        quote: "The sage acts without effort, teaches without words. Things arise and she lets them come; things disappear and she lets them go.",
        quoteSource: "Lao Tzu, Tao Te Ching",
      },
      {
        symbol: "⛩", concept: "Kannagara", source: "Shinto",
        metaphor: "Living in the flow of kami.",
        quote: "To be in kannagara is to live in spontaneous accord with the movement of the divine — the seasons, the tides, the breath of the world.",
        quoteSource: "Shinto teaching",
      },
      {
        symbol: "△", concept: "Kata Phusin", source: "Stoicism",
        metaphor: "According to nature.",
        quote: "Living according to nature means living according to your own nature and the nature of the universe — never at war with the way things move.",
        quoteSource: "Chrysippus, paraphrased",
      },
    ],
  },
  {
    word: "Presence",
    icon: "◉",
    color: "#D4A853",
    quote: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
    author: "Thich Nhat Hanh",
    desc: "The full weight of now. Not weighed down by what brought you here or pulled toward what comes next. Presence is the rarest commodity in modern life — and the one that every sacred landscape, ancient practice, and elemental encounter conspires to produce. It's not something you achieve. It's what's left when the noise stops.",
    inPractice: "Every element of a Lila trip is designed to anchor you here — guided meditation in settings that make stillness effortless, breathwork that returns you to your body, journaling prompts that capture what's alive in the moment. No itinerary anxiety. No decision fatigue. Just the day, happening.",
    traditions: [
      {
        symbol: "ॐ", concept: "Dhāranā", source: "Hindu / Yoga",
        metaphor: "Steady, unwavering focus.",
        quote: "Yoga is the stilling of the changing states of the mind. When that is accomplished, the seer abides in its own true nature.",
        quoteSource: "Patanjali, Yoga Sutras, 1.2-3",
      },
      {
        symbol: "✿", concept: "Sati", source: "Buddhism",
        metaphor: "Bare attention to what is.",
        quote: "When walking, just walk. When sitting, just sit. Above all, don't wobble.",
        quoteSource: "Zen saying",
      },
      {
        symbol: "☯", concept: "Zuo Wang", source: "Taoism",
        metaphor: "Sitting and forgetting.",
        quote: "I let go of my body and give up my knowledge. By freeing myself from the body and mind, I become one with the infinite.",
        quoteSource: "Zhuangzi",
      },
      {
        symbol: "⛩", concept: "Ima", source: "Shinto",
        metaphor: "The living now.",
        quote: "The morning shrine visit is not a prayer for the future. It is gratitude for this breath, this light, this single unrepeatable morning.",
        quoteSource: "Shinto teaching",
      },
      {
        symbol: "△", concept: "Prosoche", source: "Stoicism",
        metaphor: "Continuous self-attention.",
        quote: "When you arise in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love.",
        quoteSource: "Marcus Aurelius, Meditations",
      },
    ],
  },
  {
    word: "Reverence",
    icon: "✧",
    color: "#E8956A",
    quote: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
    author: "Marcus Aurelius",
    desc: "The instinct to bow before something ancient. A canyon. A night sky. The quiet recognition that you are small — and that your smallness is not a diminishment but a liberation. Reverence is what happens when awe meets humility. It's the feeling that precedes every transformation.",
    inPractice: "We time Lila trips to moments of natural crescendo — solstice light on canyon walls, the Milky Way at its most visible, wildflower blooms at their peak. These aren't coincidences. They're invitations to feel something larger than yourself. We put you in the room. The landscape does the rest.",
    traditions: [
      {
        symbol: "ॐ", concept: "Bhakti", source: "Hindu / Yoga",
        metaphor: "Devotion that dissolves the self.",
        quote: "Whatever you do, whatever you eat, whatever you offer in sacrifice, whatever you give away, whatever austerity you practice — do that as an offering to me.",
        quoteSource: "Bhagavad Gita, 9.27",
      },
      {
        symbol: "✿", concept: "Appamāda", source: "Buddhism",
        metaphor: "Profound care for all things.",
        quote: "Just as a mother would protect her only child with her life, cultivate a boundless heart toward all beings.",
        quoteSource: "Metta Sutta",
      },
      {
        symbol: "☯", concept: "Jìng", source: "Taoism",
        metaphor: "Stillness as reverence.",
        quote: "To the mind that is still, the whole universe surrenders.",
        quoteSource: "Lao Tzu",
      },
      {
        symbol: "⛩", concept: "Mono no Aware", source: "Shinto",
        metaphor: "The bittersweet beauty of passing.",
        quote: "The cherry blossoms are beautiful precisely because they fall. If they lasted forever, would we even stop to look?",
        quoteSource: "Japanese saying",
      },
      {
        symbol: "△", concept: "Thaumazein", source: "Stoicism",
        metaphor: "Wonder as the beginning of wisdom.",
        quote: "Loss is nothing else but change, and change is nature's delight. Look at the stars lighting up the firmament and wonder.",
        quoteSource: "Marcus Aurelius, Meditations",
      },
    ],
  },
];


// ─── Component ───────────────────────────────────────────────────────────────
export default function PhilosophyPage() {
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

      <style>{`
        .tradition-card {
          padding: 28px 32px;
          background: white;
          border: 1px solid ${C.stone};
          transition: all 0.3s ease;
        }
        .tradition-card:hover {
          background: #f5f3f0;
          border-color: #c5c0b8;
        }

        .principle-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          padding: 12px 20px;
          border: 1px solid ${C.stone};
          transition: all 0.3s ease;
        }
        .principle-nav-link:hover {
          background: rgba(0,0,0,0.02);
        }

        @media (max-width: 860px) {
          .principle-nav { flex-direction: column !important; }
          .principle-hero-grid { grid-template-columns: 1fr !important; }
          .tradition-grid { grid-template-columns: 1fr !important; }
          .section-pad { padding-left: 28px !important; padding-right: 28px !important; }
        }
      `}</style>


      {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: "140px 52px 64px",
        background: C.warmWhite,
      }}>
        <div className="section-pad" style={{ maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: C.goldenAmber }} />
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 10, fontWeight: 700,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: C.goldenAmber,
              }}>Philosophy</span>
            </div>

            <h1 style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 300,
              color: C.darkInk,
              lineHeight: 1.15,
              marginBottom: 20, marginTop: 0,
            }}>
              Five traditions.<br />Four principles.
            </h1>

            <p style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "clamp(14px, 1.6vw, 16px)",
              fontWeight: 400,
              color: "#5a6a78",
              lineHeight: 1.9,
              maxWidth: 600,
              marginBottom: 0,
            }}>
              Across centuries and continents, five wisdom traditions arrived independently at remarkably similar truths about how to live well. We've distilled their shared insights into four principles that guide every Lila journey.
            </p>
          </FadeIn>

          {/* Traditions row */}
          <FadeIn delay={0.05}>
            <div style={{
              display: "flex", gap: 28, flexWrap: "wrap",
              marginTop: 40,
              paddingTop: 36,
              borderTop: `1px solid ${C.stone}`,
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
          </FadeIn>

          {/* Principle nav */}
          <FadeIn delay={0.1}>
            <div className="principle-nav" style={{
            display: "flex", gap: 12,
            marginTop: 32,
            paddingTop: 32,
            borderTop: `1px solid ${C.stone}`,
            flexWrap: "wrap",
          }}>
            {principles.map((p) => (
              <a
                key={p.word}
                href={`#${p.word.toLowerCase()}`}
                className="principle-nav-link"
              >
                <span style={{ fontSize: 16, color: p.color, opacity: 0.7 }}>{p.icon}</span>
                <span style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  color: C.darkInk,
                }}>{p.word}</span>
              </a>
            ))}
            </div>
          </FadeIn>
        </div>
      </section>


      {/* ═══ PRINCIPLE SECTIONS ══════════════════════════════════════════════ */}
      {principles.map((p, pi) => {
        const isDark = pi % 2 === 0;
        return (
          <section
            key={p.word}
            id={p.word.toLowerCase()}
            style={{
              padding: "80px 52px",
              background: isDark
                ? `linear-gradient(165deg, ${C.darkInk}, #1a3040)`
                : C.cream,
            }}
          >
            <div className="section-pad" style={{ maxWidth: 960, margin: "0 auto" }}>

              {/* ── Principle hero ────────────────────────────────────────── */}
              <FadeIn>
                <div className="principle-hero-grid" style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 64,
                alignItems: "start",
                marginBottom: 56,
              }}>
                {/* Left: icon, name, quote */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                    <span style={{ fontSize: 28, color: p.color, opacity: 0.6 }}>{p.icon}</span>
                    <span style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: p.color,
                    }}>{p.word}</span>
                  </div>

                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(22px, 3vw, 32px)",
                    fontWeight: 300, fontStyle: "italic",
                    color: isDark ? p.color : p.color,
                    lineHeight: 1.5,
                    marginBottom: 10, marginTop: 0,
                  }}>
                    "{p.quote}"
                  </p>
                  <span style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 10, fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: isDark ? "rgba(255,255,255,0.35)" : "#9aabba",
                  }}>— {p.author}</span>
                </div>

                {/* Right: description + in practice */}
                <div style={{ paddingTop: 8 }}>
                  <p style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "clamp(13px, 1.4vw, 15px)",
                    fontWeight: 400,
                    color: isDark ? "rgba(255,255,255,0.55)" : "#5a6a78",
                    lineHeight: 2.0,
                    letterSpacing: "0.02em",
                    marginTop: 0, marginBottom: 28,
                  }}>
                    {p.desc}
                  </p>

                  <div style={{
                    paddingTop: 24,
                    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : C.stone}`,
                  }}>
                    <span style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: isDark ? "rgba(255,255,255,0.25)" : "#9aabba",
                      display: "block", marginBottom: 12,
                    }}>On a Lila trip</span>
                    <p style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 13, fontWeight: 400,
                      color: isDark ? "rgba(255,255,255,0.45)" : "#6a7a8a",
                      lineHeight: 1.85,
                      margin: 0,
                    }}>
                      {p.inPractice}
                    </p>
                  </div>
                </div>
              </div>
              </FadeIn>

              {/* ── Across traditions ─────────────────────────────────────── */}
              <FadeIn delay={0.1}>
                <span style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: isDark ? "rgba(255,255,255,0.25)" : "#9aabba",
                  display: "block", marginBottom: 24,
                }}>
                  {p.word} across five traditions
                </span>

                <div className="tradition-grid" style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: isDark ? 1 : 12,
                  ...(isDark ? { background: "rgba(255,255,255,0.06)" } : {}),
                }}>
                  {p.traditions.map((t, ti) => (
                    <div
                      key={ti}
                      style={{
                        padding: isMobile ? "24px 20px" : "28px 32px",
                        background: isDark ? C.darkInk : "white",
                        border: isDark ? "none" : `1px solid ${C.stone}`,
                        transition: "background 0.3s ease",
                        ...(ti === p.traditions.length - 1 && p.traditions.length % 2 !== 0 && !isMobile
                          ? { gridColumn: "1 / -1" }
                          : {}),
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? "#162838" : "#f5f3f0"}
                      onMouseLeave={e => e.currentTarget.style.background = isDark ? C.darkInk : "white"}
                    >
                      {/* Header: symbol + concept + source */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <span style={{
                          fontSize: 20, color: p.color, opacity: 0.5,
                          fontFamily: "serif", lineHeight: 1,
                        }}>{t.symbol}</span>
                        <div>
                          <span style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.1em", textTransform: "uppercase",
                            color: isDark ? "rgba(255,255,255,0.8)" : C.darkInk,
                            display: "block",
                          }}>{t.concept}</span>
                          <span style={{
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: 10, fontWeight: 400,
                            color: isDark ? "rgba(255,255,255,0.3)" : "#9aabba",
                          }}>{t.source} · {t.metaphor}</span>
                        </div>
                      </div>

                      {/* Quote */}
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "clamp(14px, 1.4vw, 16.5px)",
                        fontWeight: 300, fontStyle: "italic",
                        color: isDark ? "rgba(255,255,255,0.45)" : "#5a6a78",
                        lineHeight: 1.75,
                        marginBottom: 8, marginTop: 0,
                        paddingLeft: 30,
                      }}>
                        "{t.quote}"
                      </p>
                      <span style={{
                        fontFamily: "'Quicksand', sans-serif",
                        fontSize: 9, fontWeight: 600,
                        letterSpacing: "0.06em",
                        color: isDark ? "rgba(255,255,255,0.2)" : "#b0b8c0",
                        paddingLeft: 30,
                      }}>— {t.quoteSource}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* ── Next principle link ───────────────────────────────────── */}
              {pi < principles.length - 1 && (
                <div style={{ marginTop: 48, textAlign: "center" }}>
                  <a
                    href={`#${principles[pi + 1].word.toLowerCase()}`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 10,
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.16em", textTransform: "uppercase",
                      color: isDark ? "rgba(255,255,255,0.4)" : "#9aabba",
                      textDecoration: "none",
                      transition: "color 0.3s, gap 0.3s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = principles[pi + 1].color;
                      e.currentTarget.style.gap = "14px";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = isDark ? "rgba(255,255,255,0.4)" : "#9aabba";
                      e.currentTarget.style.gap = "10px";
                    }}
                  >
                    Next: {principles[pi + 1].word}
                    <span style={{ fontSize: 14 }}>↓</span>
                  </a>
                </div>
              )}
            </div>
          </section>
        );
      })}


      {/* ═══ CLOSING ═════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 52px", background: C.cream }}>
        <div className="section-pad" style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <FadeIn>
            <div style={{
              display: "flex", justifyContent: "center", gap: 16, marginBottom: 28,
            }}>
              {principles.map((p) => (
                <span key={p.word} style={{
                  fontSize: 20, color: p.color, opacity: 0.4,
                }}>{p.icon}</span>
              ))}
            </div>

            <p style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              color: "#4a6070", lineHeight: 1.9, marginBottom: 20,
            }}>
              These aren't rules. They're currents. On a Lila trip, you don't study them — you feel them. The landscape, the practice, the elements conspire to carry you there. All you have to do is show up.
            </p>

            <p style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: 14, fontWeight: 400,
              color: "#7a8a9a", lineHeight: 1.9, marginBottom: 40,
            }}>
              Plan less. Experience more.
            </p>

            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/ethos" className="underline-link">Back to Our Ethos</Link>
              <Link to="/destinations" className="underline-link">Explore Destinations</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
