/**
 * Meditations.jsx — Lila Meditations Card Deck Explorer
 * ═════════════════════════════════════════════════════
 *
 * A full-screen swipeable deck of 30 practice cards organized
 * into 5 principle chapters. Cover → Orientation → 5 × (Chapter + 6 cards).
 * Total: 37 screens.
 *
 * Route: /ethos/meditations
 *
 * Card content is sourced from src/data/cardDeck.js.
 * SVG principle marks from src/components/guide/PrincipleMarks.jsx.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CARDS, CARD_PRINCIPLES } from '@data/cardDeck';
import { C, FONTS } from '@data/brand';
import PrincipleMark from '@components/guide/PrincipleMarks';

const SERIF = FONTS.serif;
const SANS = FONTS.body;

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — build principle chapters from CARD_PRINCIPLES + CARDS
// ═══════════════════════════════════════════════════════════════════════════════

const PRINCIPLE_ORDER = ['presence', 'oneness', 'flow', 'compassion', 'reverence'];

const PRINCIPLE_DESCS = {
  presence: "The full weight of now. Not weighed down by what brought you here or pulled toward what comes next. Presence is what remains when the noise stops \u2014 and wilderness is one of the few places left that conspires to produce it.",
  oneness: "The boundaries between self and world soften. The canyon doesn't stand apart from you \u2014 you're made of the same ancient material. This is the oldest truth these traditions share: separation is the illusion.",
  flow: "When effort dissolves and everything moves. Flow is what happens when you stop managing and start surrendering \u2014 to terrain, to rhythm, to whatever the day wants to become.",
  compassion: "The heart opened toward what is alive around you. Not sentiment \u2014 orientation. Compassion is what flows through the opening that presence creates. The self that dissolves in oneness loves. Not as achievement but as consequence.",
  reverence: "The instinct to bow before something ancient. The quiet recognition that you are small \u2014 and that your smallness is not a diminishment but a liberation. Reverence is what happens when awe meets humility.",
};

const CHAPTERS = PRINCIPLE_ORDER.map(id => ({
  ...CARD_PRINCIPLES[id],
  desc: PRINCIPLE_DESCS[id],
  cards: CARDS.filter(c => c.principle === id),
}));

const TRADITIONS_LIST = [
  { symbol: '\u0950', name: 'Hinduism & Yoga', desc: 'Union, devotion, cosmic order' },
  { symbol: '\u273F', name: 'Buddhism', desc: 'Impermanence, compassion, awakening' },
  { symbol: '\u262F', name: 'Taoism', desc: 'Flow, harmony, the way of nature' },
  { symbol: '\u26E9', name: 'Shinto', desc: 'Reverence, purity, the sacred in all things' },
  { symbol: '\u25B3', name: 'Stoicism', desc: 'Virtue, reason, living according to nature' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCREENS — build flat array: cover, orientation, then per-chapter
// ═══════════════════════════════════════════════════════════════════════════════

function buildScreens() {
  const screens = [{ type: 'cover' }, { type: 'orientation' }];
  CHAPTERS.forEach((ch, pi) => {
    screens.push({ type: 'chapter', principle: ch, principleIndex: pi });
    ch.cards.forEach((card, ci) => {
      screens.push({ type: 'card', card, principle: ch, cardIndex: ci, principleIndex: pi });
    });
  });
  return screens;
}

const SCREENS = buildScreens();

// ═══════════════════════════════════════════════════════════════════════════════
// COVER SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function CoverScreen() {
  const sky = ['#5a7898', '#8a7880', '#d09070', '#e8a060'];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Sunset sky */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(185deg, ${sky[0]} 0%, ${sky[1]} 30%, ${sky[2]} 60%, ${sky[3]} 100%)`,
      }} />

      {/* Sun glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '55%',
        transform: 'translate(-50%, -50%)',
        width: 220, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,144,80,0.6) 0%, rgba(255,100,48,0.2) 45%, transparent 70%)',
        filter: 'blur(32px)', pointerEvents: 'none',
      }} />

      {/* Mountain silhouettes */}
      <svg style={{ position: 'absolute', bottom: 0, width: '100%', height: '38%' }}
        viewBox="0 0 390 200" preserveAspectRatio="none">
        <path d="M0,200 L0,118 L43,70 L88,104 L132,46 L176,86 L221,20 L265,66 L309,36 L354,73 L390,52 L390,200 Z"
          fill="rgba(12,22,36,0.90)" />
        <path d="M0,200 L0,145 L38,110 L78,130 L128,90 L172,118 L218,76 L265,106 L310,73 L355,98 L390,83 L390,200 Z"
          fill="rgba(12,22,36,0.52)" />
      </svg>

      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10,18,28,0.05) 0%, rgba(10,18,28,0.45) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '36px 28px', gap: 16, zIndex: 2,
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {PRINCIPLE_ORDER.map(id => (
            <PrincipleMark key={id} id={id} size={22} />
          ))}
        </div>
        <div style={{ width: 28, height: '0.5px', background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(42px,10vw,58px)', fontFamily: SANS,
            color: C.warmWhite, fontWeight: 700, lineHeight: 1.0,
            letterSpacing: '-0.01em', textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>lila</div>
          <div style={{
            fontSize: 'clamp(42px,10vw,58px)', fontFamily: SANS,
            color: C.warmWhite, fontWeight: 700, lineHeight: 1.0,
            letterSpacing: '-0.01em', textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>meditations</div>
        </div>
        <div style={{ width: 28, height: '0.5px', background: 'rgba(255,255,255,0.35)' }} />
        <div style={{
          fontSize: 12, fontFamily: SANS,
          color: 'rgba(255,255,255,0.75)', fontWeight: 400,
          letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.9,
        }}>
          30 practices &middot; ancient wisdom for wild places
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORIENTATION SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function OrientationScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0d1520',
      display: 'flex', flexDirection: 'column',
      padding: '28px 26px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', bottom: '-10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '120%', height: '40%',
        background: 'radial-gradient(ellipse, rgba(180,100,60,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Traditions */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.5)', fontFamily: SANS,
          textTransform: 'uppercase', marginBottom: 10,
        }}>
          Five Traditions
        </div>
        {TRADITIONS_LIST.map((t, i) => (
          <div key={t.name} style={{
            display: 'flex', alignItems: 'center', gap: 14, flex: 1,
            padding: '5px 0',
            borderBottom: i < 4 ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            <div style={{ width: 28, textAlign: 'center', flexShrink: 0, fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>
              {t.symbol}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontFamily: SANS, color: C.warmWhite, fontWeight: 600, letterSpacing: '0.02em', marginBottom: 2 }}>
                {t.name}
              </div>
              <div style={{ fontSize: 11, fontFamily: SANS, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em' }}>
                {t.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hairline */}
      <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.08)', margin: '16px 0', flexShrink: 0 }} />

      {/* Principles */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{
          fontSize: 10, letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.5)', fontFamily: SANS,
          textTransform: 'uppercase', marginBottom: 10,
        }}>
          Five Principles
        </div>
        {CHAPTERS.map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 14, flex: 1,
            padding: '5px 0',
            borderBottom: i < 4 ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            <div style={{ flexShrink: 0 }}>
              <PrincipleMark id={p.id} size={18} color={p.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontFamily: SANS, color: p.color, fontWeight: 600, letterSpacing: '0.02em' }}>
                {p.name}
              </div>
            </div>
            <div style={{ fontSize: 12, fontFamily: SANS, color: p.color, opacity: 0.75 }}>
              {p.arc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function ChapterScreen({ principle, principleIndex }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: principle.color,
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '44px 28px 36px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Title block — mark, name, arc centered; desc left-aligned */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <PrincipleMark id={principle.id} size={52} />
        </div>
        <div style={{
          fontSize: 46, fontFamily: SANS,
          color: 'white', fontWeight: 700,
          lineHeight: 1.0, marginBottom: 8,
          textAlign: 'center',
        }}>
          {principle.name}
        </div>
        <div style={{
          fontSize: 18, fontFamily: SANS,
          color: 'white', opacity: 0.7,
          fontWeight: 400, marginBottom: 20,
          letterSpacing: '0.02em',
          textAlign: 'center',
        }}>
          {principle.arc}
        </div>
        <div style={{ width: 28, height: '0.5px', background: 'rgba(255,255,255,0.25)', marginBottom: 20, margin: '0 auto 20px' }} />
        <div style={{
          fontSize: 13, fontFamily: SANS,
          color: 'white', opacity: 0.75,
          lineHeight: 1.8, fontWeight: 400,
        }}>
          {principle.desc}
        </div>
      </div>

      {/* Card list */}
      <div style={{ width: '100%' }}>
        {principle.cards.map((card, i) => (
          <div key={card.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '9px 0',
            borderBottom: i < 5 ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            <div style={{ fontSize: 11, color: 'white', opacity: 0.55, fontFamily: SANS, minWidth: 16 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontFamily: SANS, color: 'white', opacity: 0.9, fontWeight: 400 }}>
                {card.name}
              </div>
            </div>
            <div style={{ fontSize: 11, fontFamily: SANS, color: 'white', opacity: 0.6, flexShrink: 0 }}>
              {card.tradition}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICE CARD SCREEN (two-faced: front + back)
// ═══════════════════════════════════════════════════════════════════════════════

function PracticeCardScreen({ card, principle, cardIndex }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Front */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        style={{
          position: 'absolute', inset: 0,
          background: principle.color,
          display: 'flex', flexDirection: 'column',
          cursor: flipped ? 'default' : 'pointer',
          overflow: 'hidden',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
          opacity: flipped ? 0 : 1,
          transform: flipped ? 'scale(0.97)' : 'scale(1)',
          pointerEvents: flipped ? 'none' : 'all',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.07) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* Principle zone */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '20px 26px 14px',
          gap: 6, flexShrink: 0,
        }}>
          <PrincipleMark id={principle.id} size={32} />
          <div style={{
            fontSize: 8, letterSpacing: '0.28em', color: 'white',
            fontFamily: SANS, textTransform: 'uppercase', fontWeight: 700, opacity: 0.85,
          }}>
            {principle.name}
          </div>
          <div style={{ width: '100%', height: '0.5px', background: 'rgba(255,255,255,0.16)', marginTop: 2 }} />
        </div>

        <div style={{ flex: 1 }} />

        {/* Card content */}
        <div style={{ padding: '0 24px 0', flexShrink: 0 }}>
          <div style={{
            fontSize: 10, letterSpacing: '0.18em', color: 'white',
            fontFamily: SANS, textTransform: 'uppercase', opacity: 0.7, marginBottom: 5,
          }}>
            {card.tradition}
          </div>
          <div style={{
            fontSize: 34, fontFamily: SANS, color: 'white',
            fontWeight: 700, lineHeight: 1.05, marginBottom: 5,
          }}>
            {card.name}
          </div>
          <div style={{
            fontSize: 14, fontFamily: SANS, color: 'white',
            opacity: 0.8, fontStyle: 'italic', lineHeight: 1.5, marginBottom: 18,
          }}>
            {card.subtitle}
          </div>
          <div style={{
            fontSize: 14, fontFamily: SANS, color: 'white',
            opacity: 0.88, lineHeight: 1.78,
          }}>
            {card.teaching}
          </div>
        </div>

        {/* Bottom: flip arrow + explore label */}
        <div style={{
          padding: '12px 22px 20px',
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          gap: 6, flexShrink: 0,
        }}>
          <div style={{
            fontSize: 8, letterSpacing: '0.15em', color: 'white',
            fontFamily: SANS, textTransform: 'uppercase', opacity: 0.4,
          }}>
            explore
          </div>
          <div style={{ opacity: 0.6 }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M 3 10 A 7 7 0 1 1 10 17" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M 7 17 L 10 17 L 10 14" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Back */}
      <div
        onClick={() => flipped && setFlipped(false)}
        style={{
          position: 'absolute', inset: 0,
          background: '#F7F4EE',
          display: 'flex', flexDirection: 'column',
          cursor: 'pointer', overflow: 'hidden',
          transition: 'opacity 0.28s ease, transform 0.28s ease',
          opacity: flipped ? 1 : 0,
          transform: flipped ? 'scale(1)' : 'scale(1.02)',
          pointerEvents: flipped ? 'all' : 'none',
        }}
      >
        <div style={{ flex: 1, padding: '18px 22px 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Card name */}
          <div style={{
            fontSize: 10, letterSpacing: '0.14em', color: principle.color,
            fontFamily: SANS, textTransform: 'uppercase', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 5, marginBottom: 12,
          }}>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1" width="8" height="8" stroke={principle.color} strokeWidth="1.5" transform="rotate(45 5 5)" />
            </svg>
            {card.name}
          </div>

          {/* THE PRACTICE */}
          <div style={{
            fontSize: 9, letterSpacing: '0.12em', color: '#4a3a2a',
            fontFamily: SANS, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6,
          }}>
            The Practice
          </div>
          <div style={{
            fontSize: 14, fontFamily: SANS, color: '#1C1917',
            lineHeight: 1.75, marginBottom: 14,
          }}>
            {card.practice}
          </div>

          {/* Quote */}
          {card.quote && (
            <>
              <div style={{ height: '0.5px', background: '#c8bfb077', marginBottom: 12 }} />
              <div style={{ marginBottom: 12 }}>
                {card.quoteOriginal && (
                  <div style={{
                    fontSize: 11, fontFamily: SANS, color: '#8C7B6B',
                    letterSpacing: '0.04em', marginBottom: 6,
                  }}>
                    {card.quoteOriginal}
                  </div>
                )}
                <div style={{
                  fontSize: 15, fontFamily: SANS, color: '#1C1917',
                  fontWeight: 500, lineHeight: 1.65, marginBottom: 6,
                }}>
                  &ldquo;{card.quote}&rdquo;
                </div>
                <div style={{
                  fontSize: 9, letterSpacing: '0.14em', color: '#8C7B6B',
                  fontFamily: SANS, textTransform: 'uppercase',
                }}>
                  &mdash; {card.quoteAuthor}
                </div>
              </div>
            </>
          )}

          {/* On Your Trip — static connection */}
          {card.connection && (
            <>
              <div style={{ height: '0.5px', background: '#c8bfb077', marginBottom: 12 }} />
              <div style={{
                fontSize: 9, letterSpacing: '0.12em', color: '#2D6B6B',
                fontFamily: SANS, textTransform: 'uppercase', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6,
              }}>
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <rect x="1" y="1" width="8" height="8" stroke="#2D6B6B" strokeWidth="1.5" transform="rotate(45 5 5)" />
                </svg>
                On Your Trip
              </div>
              <div style={{
                fontSize: 14, fontFamily: SANS, color: '#1C1917',
                lineHeight: 1.75, marginBottom: 10,
              }}>
                {card.connection}
              </div>
            </>
          )}
        </div>

        {/* Flip arrow */}
        <div style={{ padding: '8px 22px 18px', display: 'flex', justifyContent: 'flex-end', flexShrink: 0, opacity: 0.25 }}>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
            <path d="M 17 10 A 7 7 0 1 1 10 3" stroke="#8C7B6B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 13 3 L 10 3 L 10 6" stroke="#8C7B6B" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Meditations() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const containerRef = useRef(null);

  const screen = SCREENS[currentIndex];
  const total = SCREENS.length;

  const navigate = useCallback((dir) => {
    if (animating) return;
    const next = currentIndex + dir;
    if (next < 0 || next >= total) return;
    setSlideDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex(next);
      setAnimating(false);
      setSlideDir(0);
    }, 260);
  }, [animating, currentIndex, total]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > dy && Math.abs(dx) > 44) {
      navigate(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  }

  return (
    <>
      <Helmet>
        <title>Lila Meditations — Ancient Wisdom for Wild Places</title>
        <meta name="description" content="30 practice cards drawn from five ancient wisdom traditions. For travelers who want to go deeper." />
        <link rel="canonical" href="https://lilatrips.com/ethos/meditations" />
      </Helmet>

      {/* Desktop-only arrow visibility */}
      <style>{`
        .deck-arrow { display: none !important; }
        @media (min-width: 768px) { .deck-arrow { display: flex !important; } }
      `}</style>

      <div
        ref={containerRef}
        style={{
          minHeight: '100vh',
          background: '#E8E0D5',
          display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: SANS, userSelect: 'none',
          outline: 'none', position: 'relative',
        }}
      >
        {/* Logo — home link, matches Nav wordmark on other pages */}
        <Link
          to="/"
          style={{
            position: 'absolute', top: 18, left: 20, zIndex: 20,
            textDecoration: 'none',
            fontSize: 20, fontFamily: SANS, fontWeight: 300,
            color: C.darkInk, opacity: 0.55,
            letterSpacing: '-0.01em',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.55'; }}
        >
          Lila Trips
        </Link>

        {/* Card + overlay arrows */}
        <div style={{ position: 'relative' }}>

          {/* Left arrow — desktop only, overlaps card edge */}
          <button
            className="deck-arrow"
            onClick={() => navigate(-1)}
            aria-label="Previous"
            style={{
              position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
              border: 'none', borderRadius: 4, cursor: 'pointer',
              padding: '10px 8px',
              opacity: currentIndex === 0 ? 0 : 1,
              pointerEvents: currentIndex === 0 ? 'none' : 'auto',
              transition: 'opacity 0.2s', zIndex: 20,
              color: 'rgba(255,255,255,0.8)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
              <path d="M 10 1 L 1 11 L 10 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Card viewport */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              width: 'min(400px, calc(100vw - 28px))',
              height: 'calc(100vh - 80px)',
              position: 'relative', overflow: 'hidden',
              borderRadius: 14,
              boxShadow: '0 8px 32px rgba(44,36,32,0.18), 0 2px 8px rgba(44,36,32,0.1)',
              transform: animating
                ? slideDir > 0 ? 'translateX(-16px) scale(0.97)' : 'translateX(16px) scale(0.97)'
                : 'translateX(0) scale(1)',
              opacity: animating ? 0.15 : 1,
              transition: 'transform 0.26s ease, opacity 0.26s ease',
            }}
          >
            {screen.type === 'cover' && <CoverScreen />}
            {screen.type === 'orientation' && <OrientationScreen />}
            {screen.type === 'chapter' && (
              <ChapterScreen
                key={`chapter-${screen.principleIndex}`}
                principle={screen.principle}
                principleIndex={screen.principleIndex}
              />
            )}
            {screen.type === 'card' && (
              <PracticeCardScreen
                key={`${screen.principleIndex}-${screen.cardIndex}`}
                card={screen.card}
                principle={screen.principle}
                cardIndex={screen.cardIndex}
              />
            )}
          </div>

          {/* Right arrow — desktop only, overlaps card edge */}
          <button
            className="deck-arrow"
            onClick={() => navigate(1)}
            aria-label="Next"
            style={{
              position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
              border: 'none', borderRadius: 4, cursor: 'pointer',
              padding: '10px 8px',
              opacity: currentIndex === total - 1 ? 0 : 1,
              pointerEvents: currentIndex === total - 1 ? 'none' : 'auto',
              transition: 'opacity 0.2s', zIndex: 20,
              color: 'rgba(255,255,255,0.8)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
              <path d="M 1 1 L 11 11 L 1 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

        </div>
      </div>
    </>
  );
}
