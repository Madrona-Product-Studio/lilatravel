/**
 * MovementCardSession.jsx
 * ───────────────────────
 * Full-screen sequential card deck session for Lila Movements.
 * Renders a group's cards in order with prev/next navigation.
 *
 * Styled to match the Lila Meditations deck — same backdrop, same
 * card geometry, same flip animation, Lila fonts and warm palette.
 *
 * New vs. Meditations:
 * - Sequential prev/next arrows on backdrop (not deal-off animation)
 * - Card counter + group label on backdrop
 * - Front face has image slot
 * - Back face has tabbed content
 * - Card-change transition (exit scale → enter scale)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { C, FONTS } from '@data/brand';
import MovementTabs from './MovementTabs';

const SERIF = FONTS.serif;
const SANS = FONTS.body;

// ─── Keyframes ───────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes mvCardEnter {
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes mvBackdropIn {
  from { opacity: 0; }
  to   { opacity: 1; }
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
`;

// ─── Flip Arrow SVG ──────────────────────────────────────────────────────────

function FlipArrow({ dark = false }) {
  const stroke = dark ? '#1C1917' : 'white';
  return (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8 a5 5 0 1 0 5 -5" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M2.6 4.5 L3 8 L6.4 7.6" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// ─── Front Face ──────────────────────────────────────────────────────────────

function FrontFace({ card, group, onFlip }) {
  return (
    <div
      onClick={onFlip}
      style={{
        position: 'absolute', inset: 0,
        background: group.accent,
        color: 'white',
        cursor: 'pointer',
        overflow: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Subtle radial highlight */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.09) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(20px, 4vw, 28px)',
        paddingTop: 'clamp(24px, 4vw, 28px)',
        paddingBottom: 'clamp(20px, 3vw, 24px)',
      }}>
        {/* Term */}
        <div style={{
          fontSize: 'clamp(22px, 5vw, 26px)',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 400,
          color: 'white',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          {card.term}
        </div>

        {/* Sanskrit / subtitle (optional) */}
        {card.sanskrit && (
          <div style={{
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.5)',
            marginTop: -4,
            marginBottom: 16,
          }}>
            {card.sanskrit}
          </div>
        )}

        {!card.sanskrit && <div style={{ height: 16 }} />}

        {/* Image (optional) */}
        {card.image && (
          <div style={{
            width: '100%',
            height: 280,
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 18,
            flexShrink: 0,
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid rgba(255,255,255,0.10)`,
          }}>
            <img
              src={`/images/anatomy/${card.image}`}
              alt={card.term}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
          </div>
        )}

        {/* Brief */}
        <div style={{
          fontSize: 15,
          fontFamily: SANS,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.7,
          flex: 1,
          overflow: 'auto',
        }}>
          {card.brief}
        </div>

        {/* Flip cue */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 6,
          paddingTop: 12,
        }}>
          <span style={{
            fontSize: 11,
            fontFamily: SANS,
            fontWeight: 400,
            color: 'white',
            opacity: 0.5,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>flip</span>
          <div style={{
            width: 22, height: 22,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.6,
          }}>
            <FlipArrow />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Back Face ───────────────────────────────────────────────────────────────

function BackFace({ card, group, onFlip }) {
  return (
    <div
      onClick={onFlip}
      style={{
        position: 'absolute', inset: 0,
        background: '#F7F4EE',
        color: '#1C1917',
        cursor: 'pointer',
        overflow: 'hidden',
        border: '0.5px solid rgba(0,0,0,0.08)',
        transform: 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        display: 'flex', flexDirection: 'column',
      }}
    >
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(16px, 3.5vw, 28px)',
        paddingTop: 'clamp(24px, 4vw, 32px)',
        overflow: 'auto',
      }}>
        {/* Deep Dive label */}
        <div style={{
          fontSize: 13,
          fontFamily: SANS,
          fontWeight: 600,
          color: group.accent,
          letterSpacing: '0.01em',
          marginBottom: 6,
        }}>
          Deep Dive
        </div>

        {/* Term */}
        <div style={{
          fontSize: 22,
          fontFamily: SERIF,
          fontWeight: 400,
          color: '#1C1917',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          marginBottom: 16,
        }}>
          {card.term}
        </div>

        {/* Mnemonic */}
        {card.mnemonic && (
          <div style={{
            fontSize: 14,
            fontFamily: SANS,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(44,36,32,0.6)',
            lineHeight: 1.7,
            borderLeft: `2px solid ${group.accent}99`,
            paddingLeft: 14,
            marginBottom: 20,
          }}>
            {card.mnemonic}
          </div>
        )}

        {/* Tabs */}
        <div style={{ flex: 1 }}>
          <MovementTabs tabs={card.tabs} accent={group.accent} />
        </div>
      </div>

      {/* Flip back cue */}
      <div style={{
        position: 'absolute', right: 22, bottom: 18,
        display: 'flex', alignItems: 'center', gap: 6,
        cursor: 'pointer',
      }}>
        <span style={{
          fontSize: 8,
          fontFamily: SANS,
          color: '#8C7B6B',
          opacity: 0.5,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>back</span>
        <div style={{ opacity: 0.5 }}>
          <FlipArrow dark />
        </div>
      </div>
    </div>
  );
}

// ─── Card Session (Main Export) ──────────────────────────────────────────────

export default function MovementCardSession({ group, onClose }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flipAnimating, setFlipAnimating] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const cards = group.cards;
  const total = cards.length;
  const card = cards[index];

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Entry animation trigger
  useEffect(() => {
    setEntered(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
  }, [index]);

  // Keyboard
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handleFlip = useCallback(() => {
    if (flipAnimating) return;
    setFlipAnimating(true);
    setFlipped(f => !f);
    setTimeout(() => setFlipAnimating(false), 520);
  }, [flipAnimating]);

  const goTo = useCallback((newIndex) => {
    if (exiting || newIndex < 0 || newIndex >= total) return;
    setExiting(true);
    setTimeout(() => {
      setFlipped(false);
      setFlipAnimating(false);
      setIndex(newIndex);
      setExiting(false);
    }, 280);
  }, [exiting, total]);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Touch swipe
  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > dy && Math.abs(dx) > 44) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  }

  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Arrow gutter positioning
  const arrowInset = 'max(8px, calc((100vw - min(400px, 100vw - 28px)) / 2 - 52px))';

  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28,25,23,0.7)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'mvBackdropIn 0.25s ease',
        }}
      >
        {/* Close button — on backdrop */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="Close card session"
          style={{
            position: 'absolute',
            top: 14, right: 14,
            width: 36, height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 3 L13 13 M13 3 L3 13" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          </svg>
        </button>

        {/* Counter — on backdrop */}
        <div style={{
          position: 'absolute',
          top: 18, left: 18,
          fontSize: 12,
          fontFamily: SANS,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.04em',
          zIndex: 10,
        }}>
          {index + 1} / {total}
        </div>

        {/* Group label — on backdrop */}
        <div style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 11,
          fontFamily: SANS,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}>
          {group.label}
        </div>

        {/* Card container — stop clicks from closing */}
        <div
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            width: 'min(400px, calc(100vw - 28px))',
            height: 'min(720px, calc(100vh - 120px))',
            position: 'relative',
            perspective: 1200,
            transition: exiting ? 'transform 0.28s ease, opacity 0.28s ease' : 'none',
            transform: exiting
              ? 'scale(0.96) translateY(4px)'
              : entered
                ? 'scale(1) translateY(0)'
                : 'scale(0.92) translateY(12px)',
            opacity: exiting ? 0 : entered ? 1 : 0,
            ...(!exiting && entered ? {} : { transition: 'transform 0.32s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 0.32s cubic-bezier(0.2, 0.7, 0.2, 1)' }),
          }}
        >
          {/* 3D flip container */}
          <div style={{
            width: '100%', height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            animation: flipAnimating
              ? `${flipped ? 'flipCard' : 'flipCardBack'} 0.5s ease-in-out forwards`
              : 'none',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 12px 30px rgba(0,0,0,0.25)',
          }}>
            <FrontFace card={card} group={group} onFlip={handleFlip} />
            <BackFace card={card} group={group} onFlip={handleFlip} />
          </div>
        </div>

        {/* Prev arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          onPointerDown={() => setPrevPressed(true)}
          onPointerUp={() => setPrevPressed(false)}
          onPointerLeave={() => setPrevPressed(false)}
          aria-label="Previous card"
          tabIndex={0}
          style={{
            position: 'absolute',
            top: '50%',
            left: arrowInset,
            transform: `translateY(-50%) ${prevPressed ? 'translateY(1px)' : ''}`,
            width: 40, height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            cursor: isFirst ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isFirst ? 0 : 0.5,
            pointerEvents: isFirst ? 'none' : 'auto',
            transition: 'transform 0.15s ease, opacity 0.2s ease',
            zIndex: 10,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3 L5 8 L10 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isLast) { onClose(); }
            else { goNext(); }
          }}
          onPointerDown={() => setNextPressed(true)}
          onPointerUp={() => setNextPressed(false)}
          onPointerLeave={() => setNextPressed(false)}
          aria-label={isLast ? 'Close session' : 'Next card'}
          tabIndex={0}
          style={{
            position: 'absolute',
            top: '50%',
            right: arrowInset,
            transform: `translateY(-50%) ${nextPressed ? 'translateY(1px)' : ''}`,
            width: 40, height: 40,
            borderRadius: '50%',
            background: isLast ? `${group.accent}99` : 'rgba(255,255,255,0.06)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5,
            transition: 'transform 0.15s ease, opacity 0.2s ease',
            zIndex: 10,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {isLast ? (
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>&#10043;</span>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3 L11 8 L6 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
