/**
 * TeachingsDeck.jsx — Lila Teachings Level 2
 * ═══════════════════════════════════════════
 *
 * 30 concept cards across 6 wisdom traditions.
 * Matches Meditations deck style: warm background, two-faced flip cards,
 * tradition colors as front face backgrounds, cream back face.
 *
 * Route: /ethos/teachings
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { C, FONTS } from '@data/brand';
import { TRADITIONS, CARDS, buildScreens, getCardsByTradition } from '@data/teachingsDeck';

const SANS = FONTS.body;
const SCREENS = buildScreens();

// ═══════════════════════════════════════════════════════════════════════════════
// WELCOME SCREEN (matches Meditations WelcomeScreen layout exactly)
// ═══════════════════════════════════════════════════════════════════════════════

function WelcomeScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#F7F4EE',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 36px 48px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
      border: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      {/* Subtle warm glow */}
      <div style={{
        position: 'absolute', bottom: '-5%', left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', height: '35%',
        background: 'radial-gradient(ellipse, rgba(180,100,60,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        fontSize: 'clamp(46px, 10vw, 58px)', fontFamily: SANS,
        color: '#1C1917', fontWeight: 700, lineHeight: 1.0,
        letterSpacing: '-0.01em', marginBottom: 10,
        position: 'relative',
      }}>
        Begin
      </div>

      <div style={{
        fontSize: 15, fontFamily: SANS, fontWeight: 500,
        color: 'rgba(28,25,23,0.58)', lineHeight: 1.75,
        marginBottom: 22,
        position: 'relative',
      }}>
        30 teachings from the ancient traditions.
      </div>

      <div style={{ position: 'relative', marginBottom: 8 }}>
        <div style={{
          fontSize: 17, fontFamily: SANS, fontWeight: 600,
          color: 'rgba(28,25,23,0.82)', lineHeight: 1.55,
          marginBottom: 14,
        }}>
          Not doctrine — orientation.
        </div>
        <div style={{
          fontSize: 15, fontFamily: SANS, fontWeight: 400,
          color: 'rgba(28,25,23,0.55)', lineHeight: 2.0,
        }}>
          to find your footing,<br />
          to hear what has always been true,<br />
          to carry wisdom into wild places.
        </div>
      </div>

      <div style={{
        fontSize: 14, fontFamily: SANS,
        color: 'rgba(28,25,23,0.4)', lineHeight: 1.9,
        position: 'relative',
      }}>
        Return to the ones that stay with you.
      </div>

      <div style={{
        position: 'absolute', bottom: 36, left: 36,
        fontSize: 12, fontFamily: SANS,
        color: 'rgba(28,25,23,0.25)',
        letterSpacing: '0.04em',
      }}>
        Some teachings invite you deeper.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COVER SCREEN (matches Meditations cover — sky gradient + symbols)
// ═══════════════════════════════════════════════════════════════════════════════

function CoverScreen() {
  const sky = ['#5a6878', '#7a7080', '#b08868', '#c89060'];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 14 }}>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(185deg, ${sky[0]} 0%, ${sky[1]} 30%, ${sky[2]} 60%, ${sky[3]} 100%)`,
      }} />

      {/* Sun glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '55%',
        transform: 'translate(-50%, -50%)',
        width: 220, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,144,96,0.5) 0%, rgba(200,120,60,0.15) 45%, transparent 70%)',
        filter: 'blur(32px)', pointerEvents: 'none',
      }} />

      {/* Silhouettes */}
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
        padding: '0 28px 15%', gap: 16, zIndex: 2,
      }}>
        {/* Tradition symbols row */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {TRADITIONS.map(t => (
            <span key={t.id} style={{ fontSize: 18, color: 'white', opacity: 0.85, lineHeight: 1 }}>
              {t.symbol}
            </span>
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
          }}>teachings</div>
        </div>
        <div style={{ width: 28, height: '0.5px', background: 'rgba(255,255,255,0.35)' }} />
        <div style={{
          fontSize: 12, fontFamily: SANS,
          color: 'rgba(255,255,255,0.75)', fontWeight: 400,
          letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.9,
        }}>
          30 concepts &middot; ancient wisdom for wild places
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER SCREEN (matches Meditations chapter — tradition color bg)
// ═══════════════════════════════════════════════════════════════════════════════

function ChapterScreen({ tradition, traditionIndex }) {
  const cards = getCardsByTradition(tradition.id);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: tradition.color,
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-between',
      padding: '44px 28px 36px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.07) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Title block */}
      <div style={{ width: '100%' }}>
        {/* Symbol */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 48, color: 'white', lineHeight: 1 }}>{tradition.symbol}</span>
        </div>

        {/* Name */}
        <div style={{
          fontSize: 46, fontFamily: SANS,
          color: 'white', fontWeight: 700,
          lineHeight: 1.0, marginBottom: 8,
          textAlign: 'center',
        }}>
          {tradition.name}
        </div>

        {/* Origin */}
        <div style={{
          fontSize: 14, fontFamily: SANS,
          color: 'white', opacity: 0.6,
          fontWeight: 400, marginBottom: 20,
          letterSpacing: '0.02em',
          textAlign: 'center',
        }}>
          {tradition.origin}
        </div>

        <div style={{ width: 28, height: '0.5px', background: 'rgba(255,255,255,0.25)', margin: '0 auto 20px' }} />

        {/* Description */}
        <div style={{
          fontSize: 14, fontFamily: SANS,
          color: 'white', opacity: 0.75,
          lineHeight: 1.8, fontWeight: 400,
        }}>
          {tradition.description}
        </div>
      </div>

      {/* Card list */}
      <div style={{ width: '100%' }}>
        {cards.map((card, i) => (
          <div key={card.id} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '9px 0',
            borderBottom: i < cards.length - 1 ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            <div style={{ fontSize: 11, color: 'white', opacity: 0.55, fontFamily: SANS, minWidth: 20 }}>
              {i + 1}.
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontFamily: SANS, color: 'white', opacity: 0.9, fontWeight: 400 }}>
                {card.name}
              </div>
            </div>
            <div style={{ fontSize: 11, fontFamily: SANS, color: 'white', opacity: 0.45, flexShrink: 0 }}>
              {card.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD SCREEN (two-faced flip card — matches Meditations practice cards)
// ═══════════════════════════════════════════════════════════════════════════════

function CardScreen({ card, tradition }) {
  const [flipped, setFlipped] = useState(false);
  const [flipAnimating, setFlipAnimating] = useState(false);

  const handleFlip = () => {
    if (flipAnimating) return;
    setFlipAnimating(true);
    setFlipped(f => !f);
    setTimeout(() => setFlipAnimating(false), 520);
  };

  return (
    <div style={{ width: '100%', height: '100%', perspective: 1200 }}>
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        animation: flipAnimating
          ? `${flipped ? 'flipCard' : 'flipCardBack'} 0.5s ease-in-out forwards`
          : 'none',
      }}>

      {/* ── Front Face ── */}
      <div
        onClick={handleFlip}
        style={{
          position: 'absolute', inset: 0,
          background: tradition.color,
          display: 'flex', flexDirection: 'column',
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: 14,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.09) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* Top zone — symbol + tradition name */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 6,
          padding: '38px 24px 0', flexShrink: 0,
        }}>
          <span style={{ fontSize: 24, color: 'white', opacity: 0.85, lineHeight: 1 }}>
            {tradition.symbol}
          </span>
          <div style={{
            fontSize: 8, fontFamily: SANS, fontWeight: 400,
            color: 'white', opacity: 0.55,
            letterSpacing: '0.32em', textTransform: 'uppercase',
          }}>
            {tradition.name}
          </div>
        </div>

        <div style={{ height: 32, flexShrink: 0 }} />

        {/* Content block */}
        <div style={{ padding: '0 28px', flexShrink: 0 }}>
          {/* Tag */}
          <div style={{
            fontSize: 9, fontFamily: SANS, fontWeight: 600,
            color: 'white', opacity: 0.4,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            {card.tag}
          </div>

          {/* Name */}
          <div style={{
            fontSize: 32, fontFamily: SANS, fontWeight: 700,
            color: '#FDF9F4', lineHeight: 1.0,
            letterSpacing: '0.01em', marginBottom: 6,
          }}>
            {card.name}
          </div>

          {/* Pronunciation */}
          <div style={{
            fontSize: 14, fontFamily: SANS, fontWeight: 300,
            color: 'white', opacity: 0.5,
            fontStyle: 'italic', marginBottom: 24,
          }}>
            {card.pronunciation}
          </div>

          {/* Teaching preview */}
          <div style={{
            fontSize: 16, fontFamily: SANS, fontWeight: 400,
            color: 'white', opacity: 0.85, lineHeight: 1.75,
            maxWidth: '86%',
          }}>
            {card.teaching}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Flip arrow */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 28px 28px' }}>
          <div style={{ opacity: 0.6 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M 20 12 A 8 8 0 1 1 12 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 15 4 L 12 4 L 12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Back Face ── */}
      <div
        onClick={handleFlip}
        style={{
          position: 'absolute', inset: 0,
          background: '#F7F4EE',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'pointer', overflow: 'hidden',
          borderRadius: 14,
          border: '0.5px solid rgba(0,0,0,0.08)',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          padding: '0',
        }}
      >
        {/* Title bar */}
        <div style={{
          padding: '20px 22px 14px',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 6, flexShrink: 0,
        }}>
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <rect x="1" y="1" width="8" height="8" stroke={tradition.color} strokeWidth="1.5" transform="rotate(45 5 5)" />
          </svg>
          <div style={{
            fontSize: 13, fontFamily: SANS, fontWeight: 700,
            color: tradition.color, letterSpacing: '0.14em', textTransform: 'uppercase',
          }}>
            {card.name}
          </div>
        </div>
        <div style={{ height: '0.5px', background: 'rgba(44,36,32,0.05)', margin: '0 22px', flexShrink: 0 }} />

        {/* Content group */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>

          {/* Origin */}
          <div style={{ padding: '14px 22px 0' }}>
            <div style={{ fontSize: 11, fontFamily: SANS, fontWeight: 600, color: 'rgba(44,36,32,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
              Origin
            </div>
            <div style={{ fontSize: 14, fontFamily: SANS, fontWeight: 400, color: '#1C1917', lineHeight: 1.75 }}>
              {card.origin}
            </div>
          </div>

          {/* On Your Journey */}
          <div style={{ padding: '18px 22px 0' }}>
            <div style={{
              fontSize: 11, fontFamily: SANS, fontWeight: 700,
              color: tradition.color, letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="1" width="8" height="8" stroke={tradition.color} strokeWidth="1.5" transform="rotate(45 5 5)" />
              </svg>
              On Your Journey
            </div>
            <div style={{
              fontSize: 14, fontFamily: SANS, fontWeight: 400,
              color: '#1C1917', lineHeight: 1.8,
            }}>
              {card.journey}
            </div>
          </div>

          {/* Quote */}
          {card.quote && (
            <div style={{
              margin: '18px 22px 0', padding: '18px 0 14px',
              borderTop: '0.5px solid rgba(44,36,32,0.04)',
              borderBottom: '0.5px solid rgba(44,36,32,0.04)',
            }}>
              <div style={{
                fontSize: 14, fontFamily: SANS, fontWeight: 400,
                color: '#1C1917', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 6,
              }}>
                &ldquo;{card.quote}&rdquo;
              </div>
              <div style={{
                fontSize: 10, fontFamily: SANS, fontWeight: 400,
                color: '#8C7B6B', letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                {card.quoteAuthor}
              </div>
            </div>
          )}
        </div>

        {/* Flip arrow */}
        <div style={{
          position: 'absolute', right: 22, bottom: 18,
          display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
        }}>
          <div style={{ fontSize: 8, fontFamily: SANS, color: '#8C7B6B', opacity: 0.5, letterSpacing: '0.12em', textTransform: 'uppercase' }}>back</div>
          <div style={{ opacity: 0.5 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M 20 12 A 8 8 0 1 1 12 4" stroke="#8C7B6B" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 15 4 L 12 4 L 12 7" stroke="#8C7B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

function renderScreen(scr) {
  if (!scr) return null;
  if (scr.type === 'cover') return <CoverScreen />;
  if (scr.type === 'welcome') return <WelcomeScreen />;
  if (scr.type === 'chapter') return <ChapterScreen key={`ch-${scr.traditionIndex}`} tradition={scr.tradition} traditionIndex={scr.traditionIndex} />;
  if (scr.type === 'card') return <CardScreen key={`${scr.traditionIndex}-${scr.cardIndex}`} card={scr.card} tradition={scr.tradition} />;
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT (matches Meditations page — warm background, same nav)
// ═══════════════════════════════════════════════════════════════════════════════

export default function TeachingsDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [baseIndex, setBaseIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animScreen, setAnimScreen] = useState(null);
  const [animType, setAnimType] = useState(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const total = SCREENS.length;

  const navigate = useCallback((dir) => {
    if (animating) return;
    const next = currentIndex + dir;
    if (next < 0 || next >= total) return;
    setAnimating(true);

    if (dir > 0) {
      setBaseIndex(next);
      setAnimScreen(SCREENS[currentIndex]);
      setAnimType('exit');
      setCurrentIndex(next);
      setTimeout(() => {
        setAnimScreen(null);
        setAnimType(null);
        setAnimating(false);
      }, 280);
    } else {
      setAnimScreen(SCREENS[next]);
      setAnimType('enter');
      setTimeout(() => {
        setBaseIndex(next);
        setCurrentIndex(next);
        setAnimScreen(null);
        setAnimType(null);
        setAnimating(false);
      }, 300);
    }
  }, [animating, currentIndex, total]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      document.body.style.touchAction = prevTouch;
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Keyboard
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Touch swipe
  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function handleTouchMove(e) { e.preventDefault(); }
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
        <title>Lila Teachings — Ancient Wisdom for Wild Places</title>
        <meta name="description" content="30 concepts across five wisdom traditions — from ancient India to Stoic Rome." />
        <link rel="canonical" href="https://lilatrips.com/ethos/teachings" />
      </Helmet>

      <style>{`
        .teachings-arrow { display: none !important; }
        @media (min-width: 768px) { .teachings-arrow { display: flex !important; } }
        @keyframes dealOff {
          0%   { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(-115%) rotate(-3deg); }
        }
        @keyframes stackOn {
          0%   { transform: translateX(-115%) rotate(-3deg); }
          100% { transform: translateX(0) rotate(0deg); }
        }
        @keyframes flipCard {
          0%   { transform: rotateY(0deg)   scale(1)    translateY(0); }
          50%  { transform: rotateY(90deg)  scale(1.02) translateY(-4px); }
          100% { transform: rotateY(180deg) scale(1)    translateY(0); }
        }
        @keyframes flipCardBack {
          0%   { transform: rotateY(180deg) scale(1)    translateY(0); }
          50%  { transform: rotateY(90deg)  scale(1.02) translateY(-4px); }
          100% { transform: rotateY(0deg)   scale(1)    translateY(0); }
        }
      `}</style>

      <div
        style={{
          height: '100dvh',
          background: '#E8E0D5',
          display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: SANS, userSelect: 'none',
          outline: 'none', position: 'relative',
          overflow: 'hidden', touchAction: 'none',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>

          {/* Left arrow */}
          <button
            className="teachings-arrow"
            onClick={() => navigate(-1)}
            aria-label="Previous"
            style={{
              background: 'none',
              border: 'none', cursor: 'pointer',
              padding: '12px 10px', marginRight: 20,
              opacity: currentIndex === 0 ? 0.15 : 0.5,
              pointerEvents: currentIndex === 0 ? 'none' : 'auto',
              transition: 'opacity 0.2s',
              color: '#6B5A50',
              alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { if (currentIndex > 0) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = currentIndex === 0 ? '0.15' : '0.5'; }}
          >
            <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
              <path d="M 10 1 L 1 11 L 10 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Card viewport */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: 'min(400px, calc(100vw - 28px))',
              height: 'min(720px, calc(100dvh - 48px))',
              position: 'relative', overflow: 'hidden',
              borderRadius: 14,
              background: 'transparent',
            }}
          >
            {/* Base layer */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              {renderScreen(SCREENS[baseIndex])}
            </div>

            {/* Animation layer */}
            {animScreen && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2,
                animation: animType === 'exit'
                  ? 'dealOff 0.28s cubic-bezier(0.4, 0, 0.8, 0.6) forwards'
                  : 'stackOn 0.30s cubic-bezier(0.2, 0, 0.1, 1) forwards',
              }}>
                {renderScreen(animScreen)}
              </div>
            )}
          </div>

          {/* Right arrow */}
          <button
            className="teachings-arrow"
            onClick={() => navigate(1)}
            aria-label="Next"
            style={{
              background: 'none',
              border: 'none', cursor: 'pointer',
              padding: '12px 10px', marginLeft: 20,
              opacity: currentIndex === total - 1 ? 0.15 : 0.5,
              pointerEvents: currentIndex === total - 1 ? 'none' : 'auto',
              transition: 'opacity 0.2s',
              color: '#6B5A50',
              alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { if (currentIndex < total - 1) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = currentIndex === total - 1 ? '0.15' : '0.5'; }}
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
