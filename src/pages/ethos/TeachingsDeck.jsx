/**
 * TeachingsDeck.jsx — Lila Teachings Level 2
 * ═══════════════════════════════════════════
 *
 * 30 concept cards across 6 wisdom traditions.
 * Single-face scrollable cards (no flip).
 * Dark background throughout — more austere than the meditations deck.
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
// COVER SCREEN
// ═══════════════════════════════════════════════════════════════════════════════

function CoverScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0D0D0B',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 32px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
    }}>
      {/* Subtle warm glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '35%',
        transform: 'translate(-50%, -50%)',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,149,106,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* Title block */}
      <div style={{ textAlign: 'center', position: 'relative', marginBottom: 32 }}>
        <div style={{
          width: 28, height: '0.5px',
          background: 'rgba(255,255,255,0.2)',
          margin: '0 auto 16px',
        }} />
        <div style={{
          fontSize: 'clamp(32px, 8vw, 42px)', fontFamily: SANS,
          color: 'rgba(255,255,255,0.9)', fontWeight: 700,
          lineHeight: 1.1, letterSpacing: '-0.01em',
        }}>
          Traditions
        </div>
        <div style={{
          fontSize: 'clamp(32px, 8vw, 42px)', fontFamily: SANS,
          color: 'rgba(255,255,255,0.9)', fontWeight: 700,
          lineHeight: 1.1, letterSpacing: '-0.01em',
          marginBottom: 12,
        }}>
          & Teachings
        </div>
        <div style={{
          width: 28, height: '0.5px',
          background: 'rgba(255,255,255,0.2)',
          margin: '0 auto 14px',
        }} />
        <div style={{
          fontSize: 13, fontFamily: SANS,
          color: 'rgba(255,255,255,0.45)', fontWeight: 400,
          letterSpacing: '0.06em',
        }}>
          30 concepts across five wisdom traditions
        </div>
      </div>

      {/* Tradition TOC */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        width: '100%', maxWidth: 280,
        position: 'relative',
      }}>
        {TRADITIONS.map(t => {
          const count = getCardsByTradition(t.id).length;
          return (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: t.color, flexShrink: 0,
              }} />
              <div style={{
                fontSize: 14, fontFamily: SANS,
                color: 'rgba(255,255,255,0.6)', fontWeight: 400,
                flex: 1,
              }}>
                {t.name}
              </div>
              <div style={{
                fontSize: 12, fontFamily: SANS,
                color: 'rgba(255,255,255,0.25)', fontWeight: 400,
              }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAPTER SCREEN (tradition intro)
// ═══════════════════════════════════════════════════════════════════════════════

function ChapterScreen({ tradition }) {
  const cards = getCardsByTradition(tradition.id);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0D0D0B',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 32px',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
    }}>
      {/* Subtle glow in tradition color */}
      <div style={{
        position: 'absolute', left: '50%', top: '20%',
        transform: 'translate(-50%, -50%)',
        width: 200, height: 200, borderRadius: '50%',
        background: `radial-gradient(circle, ${tradition.color}10 0%, transparent 70%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative' }}>
        {/* Chapter label */}
        <div style={{
          fontSize: 9, fontFamily: SANS,
          fontWeight: 600, color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          {tradition.chapterNumber}
        </div>

        {/* Symbol */}
        <div style={{
          fontSize: 48, lineHeight: 1,
          color: tradition.color,
          marginBottom: 16,
        }}>
          {tradition.symbol}
        </div>

        {/* Name */}
        <div style={{
          fontSize: 'clamp(28px, 7vw, 36px)', fontFamily: SANS,
          color: 'rgba(255,255,255,0.9)', fontWeight: 700,
          lineHeight: 1.1, letterSpacing: '-0.01em',
          marginBottom: 8,
        }}>
          {tradition.name}
        </div>

        {/* Origin */}
        <div style={{
          fontSize: 12, fontFamily: SANS,
          color: 'rgba(255,255,255,0.3)', fontWeight: 400,
          letterSpacing: '0.04em', marginBottom: 20,
        }}>
          {tradition.origin}
        </div>

        {/* Divider */}
        <div style={{
          width: 28, height: '0.5px',
          background: 'rgba(255,255,255,0.15)',
          margin: '0 auto 20px',
        }} />

        {/* Description */}
        <div style={{
          fontSize: 15, fontFamily: SANS,
          color: 'rgba(255,255,255,0.5)', fontWeight: 400,
          lineHeight: 1.75, textAlign: 'left',
          marginBottom: 28,
        }}>
          {tradition.description}
        </div>
      </div>

      {/* Concept list */}
      <div style={{ position: 'relative' }}>
        {cards.map((card, i) => (
          <div key={card.id} style={{
            display: 'flex', alignItems: 'baseline',
            padding: '9px 0',
            borderTop: i === 0 ? 'none' : '0.5px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              fontSize: 12, fontFamily: SANS,
              fontWeight: 400, color: 'rgba(255,255,255,0.2)',
              width: 28, flexShrink: 0,
            }}>
              {i + 1}.
            </div>
            <div style={{
              fontSize: 15, fontFamily: SANS,
              fontWeight: 500, color: 'rgba(255,255,255,0.65)',
              flex: 1, lineHeight: 1.3,
            }}>
              {card.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD SCREEN (single-face, scrollable)
// ═══════════════════════════════════════════════════════════════════════════════

function CardScreen({ card, tradition, cardIndex, cardTotal }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#0D0D0B',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      borderRadius: 14,
    }}>
      {/* Progress bar at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2, background: 'rgba(255,255,255,0.04)',
      }}>
        <div style={{
          height: '100%',
          width: `${((cardIndex + 1) / cardTotal) * 100}%`,
          background: tradition.color,
          opacity: 0.5,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1, overflow: 'auto',
        padding: 'clamp(28px, 5vw, 36px) clamp(24px, 4vw, 32px)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          {/* Tag */}
          <div style={{
            fontSize: 9, fontFamily: SANS,
            fontWeight: 600, color: tradition.color,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            {card.tag}
          </div>

          {/* Name */}
          <div style={{
            fontSize: 'clamp(26px, 6vw, 34px)', fontFamily: SANS,
            color: 'rgba(255,255,255,0.9)', fontWeight: 700,
            lineHeight: 1.1, letterSpacing: '-0.01em',
            marginBottom: 6,
          }}>
            {card.name}
          </div>

          {/* Pronunciation */}
          <div style={{
            fontSize: 14, fontFamily: SANS,
            color: 'rgba(255,255,255,0.3)', fontWeight: 300,
            fontStyle: 'italic',
          }}>
            {card.pronunciation}
          </div>
        </div>

        {/* Origin */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 11, fontFamily: SANS,
            fontWeight: 600, color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Origin
          </div>
          <div style={{
            fontSize: 15, fontFamily: SANS,
            color: 'rgba(255,255,255,0.6)', fontWeight: 400,
            lineHeight: 1.75,
          }}>
            {card.origin}
          </div>
        </div>

        {/* The Teaching */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 11, fontFamily: SANS,
            fontWeight: 600, color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            The Teaching
          </div>
          <div style={{
            fontSize: 15, fontFamily: SANS,
            color: 'rgba(255,255,255,0.6)', fontWeight: 400,
            lineHeight: 1.75,
          }}>
            {card.teaching}
          </div>
        </div>

        {/* On Your Journey */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 11, fontFamily: SANS,
            fontWeight: 600, color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            On Your Journey
          </div>
          <div style={{
            fontSize: 15, fontFamily: SANS,
            color: 'rgba(255,255,255,0.6)', fontWeight: 400,
            lineHeight: 1.75,
          }}>
            {card.journey}
          </div>
        </div>

        {/* Quote */}
        <div style={{
          borderLeft: `2px solid ${tradition.color}60`,
          paddingLeft: 16,
          marginTop: 8,
        }}>
          <div style={{
            fontSize: 15, fontFamily: SANS,
            color: 'rgba(255,255,255,0.5)', fontWeight: 400,
            fontStyle: 'italic', lineHeight: 1.7,
            marginBottom: 6,
          }}>
            &ldquo;{card.quote}&rdquo;
          </div>
          <div style={{
            fontSize: 11, fontFamily: SANS,
            color: 'rgba(255,255,255,0.25)', fontWeight: 400,
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {card.quoteAuthor}
          </div>
        </div>
      </div>

      {/* Bottom bar — chapter context */}
      <div style={{
        padding: '12px 24px 16px',
        display: 'flex', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 11, fontFamily: SANS,
          color: 'rgba(255,255,255,0.2)', fontWeight: 400,
          letterSpacing: '0.04em',
        }}>
          {cardIndex + 1} of {cardTotal} · {tradition.name}
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
  if (scr.type === 'chapter') return <ChapterScreen key={`ch-${scr.traditionIndex}`} tradition={scr.tradition} />;
  if (scr.type === 'card') return <CardScreen key={`${scr.traditionIndex}-${scr.cardIndex}`} card={scr.card} tradition={scr.tradition} cardIndex={scr.cardIndex} cardTotal={scr.cardTotal} />;
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
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
        <title>Lila Teachings — Traditions & Teachings</title>
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
      `}</style>

      <div
        style={{
          height: '100dvh',
          background: '#0D0D0B',
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
              opacity: currentIndex === 0 ? 0.1 : 0.35,
              pointerEvents: currentIndex === 0 ? 'none' : 'auto',
              transition: 'opacity 0.2s',
              color: 'rgba(255,255,255,0.5)',
              alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { if (currentIndex > 0) e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = currentIndex === 0 ? '0.1' : '0.35'; }}
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
              background: '#0D0D0B',
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
              opacity: currentIndex === total - 1 ? 0.1 : 0.35,
              pointerEvents: currentIndex === total - 1 ? 'none' : 'auto',
              transition: 'opacity 0.2s',
              color: 'rgba(255,255,255,0.5)',
              alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { if (currentIndex < total - 1) e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = currentIndex === total - 1 ? '0.1' : '0.35'; }}
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
