// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: HOMEPAGE
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn } from '@components';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { destinations } from '@data/destinations';
import { heroCallouts, magicMoments } from '@data/journey';
import { useDayCycle, interpolatePhase, useHorizontalSwipe } from '@utils/hooks';


// ─── Shooting Stars ────────────────────────────────────────────────────────
function ShootingStars({ opacity }) {
  const [stars, setStars] = useState([]);
  const idRef = useRef(0);
  const timerRef = useRef(null);
  const featureRef = useRef(null);
  const isNight = opacity > 0.01;

  const spawnStar = useCallback((feature = false) => {
    const id = idRef.current++;

    if (feature) {
      // Classic long-arc shooting star — sweeps across a huge portion of the sky
      const goRight = Math.random() > 0.5;
      const baseAngle = (-15 + Math.random() * 30) * (Math.PI / 180); // very shallow
      const angle = (goRight ? 0 : Math.PI) + baseAngle;
      const speed = 600 + Math.random() * 300; // much farther
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed + Math.abs(speed * 0.08);
      const duration = 1.4 + Math.random() * 0.6; // longer, more dramatic
      const trailAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;

      setStars(prev => [...prev, {
        id,
        top: 8 + Math.random() * 25,
        left: goRight ? (Math.random() * 30 + 5) : (Math.random() * 30 + 55),
        dx, dy, duration,
        size: 2.5,
        peak: 1,
        trailAngle,
        trailLength: 70,
        intensity: 1,
        isFeature: true,
      }]);

      setTimeout(() => {
        setStars(prev => prev.filter(s => s.id !== id));
      }, duration * 1000 + 300);
      return;
    }

    // Regular star
    const baseAngle = (-40 + Math.random() * 80) * (Math.PI / 180);
    const direction = Math.random() > 0.5 ? 0 : Math.PI;
    const angle = direction + baseAngle;
    const speed = 260 + Math.random() * 200;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed + Math.abs(speed * 0.15);
    const duration = 0.35 + Math.random() * 0.8;
    const intensity = 0.4 + Math.random() * 0.6;
    const size = intensity > 0.8 ? 2.5 : intensity > 0.55 ? 2 : 1.5;
    const peak = intensity > 0.8 ? 1 : intensity > 0.55 ? 0.9 : 0.75;
    const trailAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 180;
    const trailLength = intensity > 0.8 ? 35 : intensity > 0.55 ? 25 : 16;

    setStars(prev => [...prev, {
      id, top: Math.random() * 40 + 5, left: Math.random() * 85 + 7,
      dx, dy, duration, size, peak, trailAngle, trailLength, intensity,
      isFeature: false,
    }]);

    setTimeout(() => {
      setStars(prev => prev.filter(s => s.id !== id));
    }, duration * 1000 + 200);
  }, []);

  useEffect(() => {
    if (!isNight) {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      if (featureRef.current) { clearTimeout(featureRef.current); featureRef.current = null; }
      return;
    }

    // Regular stars
    const scheduleNext = () => {
      timerRef.current = setTimeout(() => {
        spawnStar();
        scheduleNext();
      }, 400 + Math.random() * 2800);
    };

    // Feature star — once or twice per night cycle
    const scheduleFeature = () => {
      featureRef.current = setTimeout(() => {
        spawnStar(true);
        scheduleFeature();
      }, 8000 + Math.random() * 12000); // every 8-20s
    };

    spawnStar();
    scheduleNext();
    scheduleFeature();

    return () => {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
      if (featureRef.current) { clearTimeout(featureRef.current); featureRef.current = null; }
    };
  }, [isNight, spawnStar]);

  if (stars.length === 0 && !isNight) return null;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: Math.min(opacity * 4, 1), pointerEvents: "none", zIndex: 1 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute",
          top: `${s.top}%`,
          left: `${s.left}%`,
          animation: `shoot-move-${s.id} ${s.duration}s ease-out forwards`,
        }}>
          <style>{`
            @keyframes shoot-move-${s.id} {
              0% { transform: translate(0,0); opacity: 0; }
              5% { opacity: ${s.peak * 0.5}; }
              15% { opacity: ${s.peak}; }
              50% { opacity: ${s.peak * 0.6}; }
              85% { opacity: ${s.peak * 0.15}; }
              100% { transform: translate(${s.dx}px, ${s.dy}px); opacity: 0; }
            }
          `}</style>
          {/* Head */}
          <div style={{
            width: s.isFeature ? 3 : s.size,
            height: s.isFeature ? 3 : s.size,
            borderRadius: "50%",
            background: "white",
            boxShadow: s.isFeature
              ? "0 0 8px 3px rgba(255,255,255,0.7)"
              : s.intensity > 0.8
              ? "0 0 4px 1px rgba(255,255,255,0.5)"
              : "0 0 2px rgba(255,255,255,0.3)",
          }} />
          {/* Trail */}
          <div style={{
            position: "absolute",
            top: (s.isFeature ? 3 : s.size) / 2,
            left: (s.isFeature ? 3 : s.size) / 2,
            width: s.trailLength,
            height: s.isFeature ? 1.5 : 1,
            background: s.isFeature
              ? "linear-gradient(to left, rgba(255,255,255,0.7), rgba(255,255,255,0.2) 60%, transparent)"
              : "linear-gradient(to left, rgba(255,255,255,0.5), transparent)",
            transformOrigin: "0 0",
            transform: `rotate(${s.trailAngle}deg)`,
          }} />
        </div>
      ))}
    </div>
  );
}


// ─── Destination Carousel ───────────────────────────────────────────────────
function DestCarousel() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const go = (idx) => {
    if (fading || idx === active) return;
    setFading(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setActive(idx); setFading(false); }, 350);
  };

  const prev = () => go((active - 1 + destinations.length) % destinations.length);
  const next = () => go((active + 1) % destinations.length);
  const swipeRef = useHorizontalSwipe(next, prev);
  const d = destinations[active];

  return (
    <div ref={swipeRef}>
      <div className="carousel-grid" style={{
        display: "grid", gridTemplateColumns: "55% 45%",
        minHeight: 560, overflow: "hidden",
        opacity: fading ? 0 : 1, transition: "opacity 0.35s ease",
      }}>
        {/* Photo */}
        <Link to={`/destinations/${d.slug}`} style={{ position: "relative", overflow: "hidden", minHeight: 320, display: "block" }}>
          {d.photo ? (
            <img src={d.photo} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", minHeight: 200, background: d.gradient }} />
          )}
          <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8, zIndex: 2 }}>
            {destinations.map((_, i) => (
              <button key={i} onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(i); }} style={{
                width: i === active ? 24 : 8, height: 8, borderRadius: 4,
                background: i === active ? "white" : "rgba(255,255,255,0.4)",
                border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0,
              }} />
            ))}
          </div>
        </Link>

        {/* Info panel */}
        <div className="dest-card-content" style={{
          background: C.warmWhite, padding: "64px 56px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          borderTop: `1px solid ${C.stone}`, borderRight: `1px solid ${C.stone}`, borderBottom: `1px solid ${C.stone}`,
        }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 1, background: d.accent }} />
                <span style={{ fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: d.accent }}>
                  Golden Windows
                </span>
              </div>
              {d.guideAvailable ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.seaGlass || "#7DB8A0" }} />
                  <span style={{
                    fontFamily: "'Quicksand'", fontSize: 13, fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: C.seaGlass || "#7DB8A0",
                  }}>
                    Guide Available
                  </span>
                </div>
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.stone || "#B0BEC5" }} />
                  <span style={{
                    fontFamily: "'Quicksand'", fontSize: 13, fontWeight: 600,
                    letterSpacing: "0.06em",
                    color: C.stone || "#B0BEC5",
                  }}>
                    Guide Coming Soon
                  </span>
                </div>
              )}
            </div>
            {d.windows && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {d.windows.map((w, wi) => (
                  <span key={wi} style={{
                    fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 500,
                    letterSpacing: "0.06em",
                    color: "#7a90a0",
                    padding: "4px 10px",
                    border: `1px solid ${C.stone}`,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}>
                    {w.season} · {w.months}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 300,
            color: C.darkInk, lineHeight: 1.0, marginBottom: 8, letterSpacing: "-0.01em",
          }}>
            {d.name}
          </h3>
          <p style={{
            fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.18em", textTransform: "uppercase", color: "#9aabba", marginBottom: 24,
          }}>
            {d.location}
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 300, fontStyle: "italic",
            color: "#5a7080", lineHeight: 1.75, marginBottom: 36,
          }}>
            {d.description}
          </p>

          <Link to={`/destinations/${d.slug}`} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: C.darkInk, paddingBottom: 4, borderBottom: `1px solid ${C.darkInk}`,
            width: "fit-content", transition: "gap 0.25s, color 0.25s", textDecoration: "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.gap = "16px"; e.currentTarget.style.color = d.accent; e.currentTarget.style.borderColor = d.accent; }}
          onMouseLeave={e => { e.currentTarget.style.gap = "10px"; e.currentTarget.style.color = C.darkInk; e.currentTarget.style.borderColor = C.darkInk; }}
          >
            Explore Free <span>→</span>
          </Link>
        </div>
      </div>

      {/* Pills + arrows */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24 }}>
        <div className="dest-pills" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {destinations.map((dest, i) => (
            <button key={i} onClick={() => go(i)} style={{
              fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 14px",
              background: i === active ? C.darkInk : "transparent",
              color: i === active ? "white" : "#9aabba",
              border: `1px solid ${i === active ? C.darkInk : C.stone}`,
              cursor: "pointer", transition: "all 0.25s", borderRadius: 1,
            }}
            onMouseEnter={e => { if (i !== active) { e.currentTarget.style.borderColor = "#9aabba"; e.currentTarget.style.color = C.darkInk; }}}
            onMouseLeave={e => { if (i !== active) { e.currentTarget.style.borderColor = C.stone; e.currentTarget.style.color = "#9aabba"; }}}
            >
              {dest.name}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {[{ fn: prev, label: "←" }, { fn: next, label: "→" }].map(({ fn, label }) => (
            <button key={label} onClick={fn} style={{
              width: 40, height: 40, background: "transparent",
              border: `1px solid ${C.stone}`, cursor: "pointer", fontSize: 15, color: C.slate,
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.darkInk; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = C.darkInk; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.slate; e.currentTarget.style.borderColor = C.stone; }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── Approach Section (homepage version) — Three Braids ─────────────────────
const approachBraids = [
  {
    label: "Sacred Terrain",
    icon: "△",
    color: "#7DB8A0",
    headline: "The landscape is the teacher.",
    tags: ["Iconic Destinations", "Threshold Timing", "Canyon & Desert", "Old-Growth Forest", "Wild Coastline"],
  },
  {
    label: "Ancient Practices",
    icon: "◎",
    color: "#D4A853",
    headline: "Steeped in living tradition.",
    tags: ["Yoga", "Breathwork", "Meditation", "Cold Immersion", "Mindful Movement", "Journaling"],
  },
  {
    label: "Elemental Encounters",
    icon: "✦",
    color: "#6BA4B8",
    headline: "Where the senses take over.",
    tags: ["Sunlight", "Cold Water", "Starry Skies", "Ancient Stone", "Silence", "Firelight"],
  },
];

function ApproachSectionHome() {
  return (
    <section style={{ padding: "72px 0 64px", background: C.darkInk }}>
      <div className="section-padded" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 52px" }}>
        <FadeIn>
          <div style={{ marginBottom: 40 }}>
            <span className="eyebrow" style={{ color: C.skyBlue }}>Ethos</span>
            <h2 style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 300,
              color: "white", lineHeight: 1.25, margin: 0,
            }}>
              What makes a Lila trip.
            </h2>
          </div>
        </FadeIn>

        <div className="approach-braids-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 0,
        }}>
          {approachBraids.map((b, i) => (
            <FadeIn key={b.label} delay={i * 0.07}>
              <div style={{
                padding: "32px 28px 36px",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                {/* Icon + Label */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 18, color: b.color, lineHeight: 1 }}>{b.icon}</span>
                  <span style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: b.color,
                  }}>{b.label}</span>
                </div>

                {/* Headline */}
                <h3 style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(15px, 1.6vw, 18px)", fontWeight: 400,
                  color: "rgba(255,255,255,0.65)", lineHeight: 1.5,
                  marginBottom: 24, marginTop: 0, letterSpacing: "0.01em",
                }}>{b.headline}</h3>

                {/* Tag chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {b.tags.map((tag, j) => (
                    <span key={j} style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                      color: `${b.color}cc`,
                      padding: "8px 16px",
                      border: `1px solid ${b.color}25`,
                      background: `${b.color}08`,
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${b.color}18`;
                      e.currentTarget.style.borderColor = `${b.color}40`;
                      e.currentTarget.style.color = b.color;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = `${b.color}08`;
                      e.currentTarget.style.borderColor = `${b.color}25`;
                      e.currentTarget.style.color = `${b.color}cc`;
                    }}
                    >{tag}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.25}>
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 32, marginTop: 4,
          }}>
            <Link to="/ethos" className="underline-link underline-link-light">Explore Our Ethos</Link>
          </div>
        </FadeIn>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .approach-braids-grid {
            grid-template-columns: 1fr !important;
          }
          .approach-braids-grid > div > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .approach-braids-grid > div:last-child > div {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  );
}


// ─── Homepage ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const dayProgress = useDayCycle(28);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const heroOpacity  = Math.max(0, 1 - scrollY / 680);
  const heroParallax = scrollY * 0.25;
  const phase = interpolatePhase(dayProgress);

  return (
    <>
      <Nav transparent />

      {/* ══ 1. HERO — Animated Day Cycle ═════════════════════════════════ */}
      <style>{`
        .hero-moment {
          position: absolute;
          font-family: 'Quicksand', sans-serif;
          font-weight: 300;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.01em;
          text-align: center;
          margin: 0;
          white-space: nowrap;
          font-size: 36px;
          line-height: 1.2;
        }
        .hero-moment-wrap {
          position: relative;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
        }
        .hero-subtitle {
          font-family: 'Quicksand', sans-serif;
          font-weight: 300;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.02em;
          text-align: center;
          font-size: 20px;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .hero-moment {
            font-size: 20px;
            white-space: normal;
            width: 85vw;
            line-height: 1.35;
          }
          .hero-moment-wrap {
            height: 70px;
            margin-bottom: 20px;
          }
          .hero-subtitle {
            font-size: 11.5px;
            white-space: nowrap;
            padding: 0 24px;
          }
        }
      `}</style>
      <section style={{ position: "relative", height: "100vh", minHeight: 640, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          transform: `translateY(${heroParallax}px)`,
          background: `linear-gradient(185deg, ${phase.sky[0]} 0%, ${phase.sky[1]} 30%, ${phase.sky[2]} 60%, ${phase.sky[3]} 100%)`,
        }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: phase.stars }}>
            {Array.from({ length: 150 }, (_, i) => (
              <circle key={i}
                cx={`${(i * 53.7 + 11) % 100}%`} cy={`${(i * 29.3 + 5) % 65}%`}
                r={i % 9 === 0 ? 1.8 : i % 4 === 0 ? 1.1 : 0.55}
                fill="white" opacity={0.25 + (i % 6) * 0.1}
              />
            ))}
          </svg>
          <ShootingStars opacity={phase.stars} />
          <div style={{
            position: "absolute", left: "50%", top: `${phase.glowY * 100}%`,
            transform: "translate(-50%, -50%)", width: 400, height: 400, borderRadius: "50%",
            background: `radial-gradient(circle, ${phase.glowColor}${Math.round(phase.glowOpacity * 255).toString(16).padStart(2,"0")} 0%, transparent 70%)`,
            filter: "blur(40px)", pointerEvents: "none",
            opacity: Math.max(0, 1 - phase.stars * 2),
          }} />
          <svg className="hero-mountains" style={{ position: "absolute", bottom: 0, width: "100%", height: "35%" }} viewBox="0 0 1440 360" preserveAspectRatio="none">
            <path d="M0,360 L0,210 L160,95 L320,170 L480,65 L640,145 L800,30 L960,115 L1120,55 L1280,130 L1440,85 L1440,360 Z" fill="rgba(12,28,42,0.92)" />
            <path d="M0,360 L0,255 L110,182 L230,220 L380,148 L520,198 L670,125 L820,178 L960,108 L1100,160 L1240,118 L1360,162 L1440,135 L1440,360 Z" fill="rgba(12,28,42,0.5)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,35,52,0.15) 0%, rgba(15,35,52,0.4) 100%)" }} />
        </div>

        <div className="hero-content" style={{
          position: "relative", zIndex: 2, height: "100%",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 24px", opacity: heroOpacity,
        }}>
          <FadeIn from="none" delay={0.15}>
            <span className="eyebrow" style={{ color: C.skyBlue }}>Wellness Travel for Adventure Seekers</span>
          </FadeIn>
          <FadeIn from="bottom" delay={0.25}>
            <div className="hero-moment-wrap">
              {magicMoments.map((m, i) => {
                const opacity = (() => {
                  let dist = Math.abs(dayProgress - m.center);
                  if (dist > 0.5) dist = 1 - dist;
                  if (dist < 0.06) return 1;
                  if (dist > 0.16) return 0;
                  return Math.pow(1 - (dist - 0.06) / 0.10, 1.5);
                })();
                if (opacity <= 0) return null;
                return (
                  <h1 key={i} className="hero-moment" style={{ opacity }}>
                    {m.text}
                  </h1>
                );
              })}
            </div>
          </FadeIn>
          <FadeIn from="bottom" delay={0.45}>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/plan" style={{
                fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "white", paddingBottom: 3, borderBottom: "1px solid rgba(255,255,255,0.5)",
                display: "inline-block", transition: "opacity 0.2s", textDecoration: "none",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.65"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Plan a Trip</Link>
              <Link to="/destinations" style={{
                fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "white", paddingBottom: 3, borderBottom: "1px solid rgba(255,255,255,0.5)",
                display: "inline-block", transition: "opacity 0.2s", textDecoration: "none",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.65"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Explore Destinations</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 2. WHY WE EXIST ══════════════════════════════════════════════ */}
      <section style={{ padding: "0", background: C.warmWhite }}>
        <div className="story-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 680 }}>
          <div className="story-panel" style={{ padding: "100px 72px", display: "flex", flexDirection: "column", justifyContent: "flex-start", maxWidth: 600 }}>
            <FadeIn from="left">
              <span className="eyebrow" style={{ color: C.skyBlue }}>We Are Travelers</span>
              <h2 style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(15px, 2vw, 22px)", fontWeight: 600, color: C.darkInk,
                lineHeight: 1.6, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 48,
              }}>
                Travel is about finding<br />the moments of magic that<br />light up our souls.
              </h2>
              <div style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(13px, 1.4vw, 15px)", fontWeight: 400,
                color: "#5a6a78", lineHeight: 2.1, letterSpacing: "0.03em",
              }}>
                <p style={{ marginBottom: 28 }}>Moments when we find our truest and lightest selves.<br />Not weighed down by the past or an imagined future.<br />Connected to the entire universe through right now.</p>
                <p style={{ marginBottom: 32 }}>We're reminded of a truth we know, but often forget.<br />That life is not about conquering the mystery.<br />It's about learning to dance with it.</p>
                <p style={{ marginBottom: 6 }}>
                  <span style={{ fontStyle: "italic", color: C.skyBlue }}>Līlā</span>
                  {" "}<span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px, 2vw, 24px)", fontWeight: 300, fontStyle: "italic", color: "rgba(90,106,120,0.55)" }}>लीला</span>
                  {" "}<span style={{ color: "rgba(90,106,120,0.5)", fontSize: "clamp(12px, 1.4vw, 14px)" }}>/lee·lah/</span>
                </p>
                <p style={{ marginBottom: 0, color: "#5a6a78" }}>
                  A Hindu concept meaning <span style={{ color: C.skyBlue }}>"divine or cosmic play"</span>.<br />It suggests life is like a dance — joyous and light.<br />Learning to live this way is our living practice.
                </p>
              </div>
            </FadeIn>
          </div>
          <div className="story-panel-dark" style={{
            background: C.darkInk, padding: "100px 72px",
            display: "flex", flexDirection: "column", justifyContent: "flex-start", minHeight: 680,
          }}>
            <FadeIn from="right" delay={0.15}>
              <span className="eyebrow" style={{ color: C.skyBlue }}>Introducing Lila Trips</span>
              <h2 style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(15px, 2vw, 22px)", fontWeight: 600, color: "white",
                lineHeight: 1.6, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 48,
              }}>
                We help put people,<br />place and practice<br />together.
              </h2>
              <div style={{
                fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(13px, 1.4vw, 15px)",
                fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 2.1, letterSpacing: "0.03em",
              }}>
                {[
                  { text: "Sacred Terrain — iconic landscapes that dissolve the ordinary.", icon: "△", color: "#7DB8A0" },
                  { text: "Ancient Practices — wisdom traditions woven into every journey.", icon: "◎", color: "#D4A853" },
                  { text: "Elemental Encounters — sunlight, cold water, starry skies, ancient stone.", icon: "✦", color: "#6BA4B8" },
                ].map((callout, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    marginBottom: i < 2 ? 20 : 0, paddingLeft: 16,
                  }}>
                    <span style={{ color: callout.color, fontSize: 14, lineHeight: 1, marginTop: 3, flexShrink: 0 }}>{callout.icon}</span>
                    <p style={{
                      color: "rgba(255,255,255,0.7)", fontStyle: "italic", margin: 0,
                    }}>{callout.text}</p>
                  </div>
                ))}
                <p style={{ marginTop: 36, marginBottom: 0, color: "rgba(255,255,255,0.7)" }}>
                  Our tools and experts help you put it together.<br />Custom itineraries that match your intention.<br />We get rid of everything not worth your time.
                </p>
                <p style={{ marginTop: 28, marginBottom: 0, color: "rgba(255,255,255,0.7)" }}>
                  Not really travel agents.<br />More like a local friend giving you the shortlist.<br />You can just focus on dancing with the mystery.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ 3. DESTINATIONS — BENTO MOSAIC ═══════════════════════════════ */}
      <style>{`
        .bento-tile {
          position: relative;
          overflow: hidden;
          display: block;
          text-decoration: none;
          cursor: pointer;
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
      <section style={{ padding: "0", background: C.cream }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn>
            <div className="bento-grid">
              {[...destinations].sort((a, b) => {
                const aHero = a.name === "Zion Canyon" || a.name === "Joshua Tree" ? 0 : 1;
                const bHero = b.name === "Zion Canyon" || b.name === "Joshua Tree" ? 0 : 1;
                return aHero - bHero;
              }).map((d, i) => {
                const isHero = i < 2; // first two after sort are the hero tiles
                return (
                  <Link
                    key={d.slug}
                    to={`/destinations/${d.slug}`}
                    className="bento-tile"
                    style={{
                      gridColumn: isHero ? "span 1" : "span 1",
                      gridRow: isHero ? "span 1" : "span 1",
                    }}
                  >
                    {d.photo ? (
                      <img src={d.photo} alt={d.name} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: d.gradient }} />
                    )}
                    <div className="bento-overlay" />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: isHero ? "36px 32px" : "24px 24px",
                    }}>
                      <div style={{ marginBottom: 10 }}>
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
                              }}>
                                Guide Available
                              </span>
                            </div>
                          ) : (
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.45)", boxShadow: "0 0 4px rgba(0,0,0,0.3)" }} />
                              <span style={{
                                fontFamily: "'Quicksand'", fontSize: 11, fontWeight: 600,
                                letterSpacing: "0.06em",
                                color: "rgba(255,255,255,0.6)",
                                textShadow: "0 1px 6px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3)",
                              }}>
                                Guide Coming Soon
                              </span>
                            </div>
                          )}
                        </div>
                        {d.windows && (
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {d.windows.map((w, wi) => (
                              <span key={wi} style={{
                                fontFamily: "'Quicksand'", fontSize: 8, fontWeight: 600,
                                letterSpacing: "0.04em",
                                color: "rgba(255,255,255,0.9)",
                                padding: "3px 8px",
                                background: "rgba(0,0,0,0.4)",
                                backdropFilter: "blur(4px)",
                                lineHeight: 1,
                                whiteSpace: "nowrap",
                              }}>
                                {w.season} · {w.months}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: isHero ? "clamp(28px, 4vw, 42px)" : "clamp(22px, 3vw, 30px)",
                        fontWeight: 300, color: "white", lineHeight: 1.1, marginBottom: 4,
                      }}>{d.name}</h3>
                      <p style={{
                        fontFamily: "'Quicksand'", fontSize: 10, fontWeight: 600,
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "rgba(255,255,255,0.5)", marginBottom: 8,
                      }}>{d.location}</p>
                      <div className="bento-desc">
                        <p style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: isHero ? 16 : 14, fontWeight: 300, fontStyle: "italic",
                          color: "rgba(255,255,255,0.7)", lineHeight: 1.6,
                        }}>{d.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 4. OUR APPROACH — THREE BRAIDS ══════════════════════════════ */}
      <ApproachSectionHome />

      {/* ══ 5. TRAVEL YOUR WAY ═════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: C.cream }}>
        <div className="section-padded" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 52px" }}>
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
            {[
              {
                icon: "☐", label: "DIY", color: C.skyBlue,
                title: "Explore the Guide",
                desc: "Browse our curated picks for free — where to stay, what to hike, where to eat, and when the light is best.",
                cta: "Explore Free", ctaLink: "/destinations",
                detail: "Free · No account needed",
              },
              {
                icon: "◎", label: "Plan a Trip", color: C.oceanTeal,
                title: "Trip Planner",
                desc: "Turn your favorites into a day-by-day itinerary with booking links, permit timing, and offline access.",
                cta: "Unlock — $39", ctaLink: "/plan",
                detail: "One-time purchase · Offline access",
              },
              {
                icon: "☾", label: "Join a Group", color: C.sunSalmon,
                title: "Threshold Trips",
                desc: "Small group journeys timed to equinoxes, solstices, and natural crescendos. Guided, curated, eight travelers maximum.",
                cta: "View Trips", ctaLink: "/group-trips",
                detail: "From $895 per person",
              },
              {
                icon: "△", label: "Designed for You", color: C.goldenAmber,
                title: "Custom Itinerary",
                desc: "Tell us your dates, group, and vibe. A real person builds a complete itinerary around your trip.",
                cta: "Start — From $199", ctaLink: "/contact",
                detail: "Personalized · Human-crafted",
              },
            ].map((o, i) => (
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
                    fontSize: 15, fontStyle: "italic",
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

          <FadeIn delay={0.4}>
            <div style={{ marginTop: 48, textAlign: "center" }}>
              <Link to="/ways-to-travel" className="underline-link">Learn More</Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 6. CTA ═══════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: 600 }}>
        <img src={P.lilaPainting} alt="" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center center",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,18,26,0.25)" }} />
        <div style={{
          position: "relative", zIndex: 1, padding: "100px 52px",
          display: "flex", alignItems: "center", justifyContent: "center", minHeight: 600,
        }}>
          <FadeIn>
            <div className="cta-inner" style={{
              background: "rgba(10,18,26,0.78)", backdropFilter: "blur(20px)",
              padding: "64px 72px", textAlign: "center", maxWidth: 560,
            }}>
              <span className="eyebrow" style={{ color: C.skyBlue }}>Begin</span>
              <h2 style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 300, color: "white", lineHeight: 1.2, marginBottom: 16,
              }}>
                Come dance with<br /><span style={{ color: C.skyBlue }}>the mystery</span>.
              </h2>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(13px, 1.6vw, 16px)", fontWeight: 400,
                color: "rgba(255,255,255,0.5)", maxWidth: 340, margin: "0 auto 40px", lineHeight: 1.9,
              }}>We'll show you the way.</p>
              <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
                <Link to="/destinations" className="underline-link underline-link-light">Explore Destinations</Link>
                <Link to="/ways-to-travel" className="underline-link underline-link-light">Plan a Custom Trip</Link>
                <Link to="/contact" className="underline-link underline-link-light">Contact Our Experts</Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
