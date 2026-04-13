/**
 * PracticeCardModal.jsx
 * ─────────────────────
 * Two-faced practice card modal. Front face shows the principle, name, and
 * teaching on a saturated principle background. Back face shows the practice,
 * the quote, and the per-trip "On Your Trip" connection on a warm cream.
 *
 * Tap the card to flip. Tap the backdrop or × button to close.
 *
 * No rounded corners — sharp rectangular aesthetic is a hard brand rule.
 */

import { useEffect, useState } from 'react';
import { CARD_PRINCIPLES } from '@data/cardDeck';
import PrincipleMark from './PrincipleMarks';

const KEYFRAMES = `
@keyframes lilaCardLiftForward {
  from { opacity: 0; transform: scale(0.92) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes lilaCardBackdropIn {
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

function FlipArrow({ dark = false }) {
  const stroke = dark ? '#1C1917' : 'white';
  return (
    <svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8 a5 5 0 1 0 5 -5" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M2.6 4.5 L3 8 L6.4 7.6" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function CloseButton({ onClose, dark = false }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClose(); }}
      aria-label="Close card"
      style={{
        position: 'absolute',
        top: 14,
        right: 14,
        width: 28,
        height: 28,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: dark ? '#1C1917' : 'white',
        opacity: dark ? 0.55 : 0.7,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function FrontFace({ card, principle, onFlip, onClose }) {
  return (
    <div
      onClick={onFlip}
      style={{
        position: 'absolute', inset: 0,
        background: principle.color,
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

      <CloseButton onClose={onClose} />

      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top zone — principle label */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 6,
          padding: '38px 24px 0', flexShrink: 0,
        }}>
          <PrincipleMark id={principle.id} size={24} />
          <div className="font-body uppercase" style={{
            fontSize: 8, fontWeight: 400,
            color: 'white', opacity: 0.55,
            letterSpacing: '0.32em',
          }}>
            {principle.name}
          </div>
        </div>

        <div style={{ height: 32, flexShrink: 0 }} />

        {/* Practice block */}
        <div style={{ padding: '0 28px', flexShrink: 0 }}>
          <div className="font-body" style={{
            fontSize: 32, fontWeight: 700,
            color: '#FDF9F4', lineHeight: 1.0,
            letterSpacing: '0.01em', marginBottom: 24,
          }}>
            {card.practiceTitle || card.name}
          </div>
          <div className="font-body" style={{
            fontSize: 16, fontWeight: 400,
            color: 'white', opacity: 0.85, lineHeight: 1.75,
            maxWidth: '86%',
          }}>
            {card.frontParagraph || card.teaching}
          </div>
          {card.reflection && (
            <div className="font-body" style={{
              fontSize: 16, fontWeight: 400,
              color: 'white', opacity: 0.85, lineHeight: 1.75,
              maxWidth: '86%', marginTop: 28,
            }}>
              {card.reflection}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* Flip arrow */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 28px 28px' }}>
          <div style={{ opacity: 0.6 }}>
            <FlipArrow />
          </div>
        </div>
      </div>
    </div>
  );
}

function BackFace({ card, principle, connection, onFlip, onClose }) {
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
        justifyContent: 'center',
        padding: '0',
      }}
    >
      <CloseButton onClose={onClose} dark />

      {/* Title bar */}
      <div style={{
        padding: '20px 22px 14px',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 6, flexShrink: 0,
      }}>
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
          <rect x="1" y="1" width="8" height="8" stroke={principle.color} strokeWidth="1.5" transform="rotate(45 5 5)" />
        </svg>
        <div className="font-body uppercase" style={{
          fontSize: 13, fontWeight: 700,
          color: principle.color, letterSpacing: '0.14em',
        }}>
          {card.name}
        </div>
      </div>
      <div style={{ height: '0.5px', background: 'rgba(44,36,32,0.05)', margin: '0 22px', flexShrink: 0 }} />

      {/* Content group */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>

        {/* Opening — two sentences */}
        <div style={{ padding: '14px 22px 0' }}>
          {(() => {
            const text = card.backOpening || card.teaching;
            const split = text.indexOf('. ');
            if (split > 0) {
              return (<>
                <div className="font-body" style={{ fontSize: 14, fontWeight: 400, color: '#1C1917', lineHeight: 1.75, marginBottom: 10 }}>
                  {text.substring(0, split + 1)}
                </div>
                <div className="font-body" style={{ fontSize: 14, fontWeight: 400, color: '#1C1917', lineHeight: 1.75 }}>
                  {text.substring(split + 2)}
                </div>
              </>);
            }
            return <div className="font-body" style={{ fontSize: 14, fontWeight: 400, color: '#1C1917', lineHeight: 1.75 }}>{text}</div>;
          })()}
        </div>

        {/* List — only if card has items */}
        {card.backList && card.backList.length > 0 && (
          <div style={{ padding: '20px 22px 12px' }}>
            <div className="font-body" style={{ fontSize: 13, fontWeight: 400, color: 'rgba(44,36,32,0.52)', lineHeight: 1.65 }}>
              {card.backList.map((item, i) => <div key={i}>{item}</div>)}
            </div>
          </div>
        )}

        {/* Quote */}
        {card.quote && (
          <div style={{
            margin: '0 22px', padding: '18px 0 14px',
            borderTop: '0.5px solid rgba(44,36,32,0.04)',
            borderBottom: '0.5px solid rgba(44,36,32,0.04)',
          }}>
            <div className="font-body" style={{
              fontSize: 14, fontWeight: 400,
              color: '#1C1917', fontStyle: 'italic', lineHeight: 1.7, marginBottom: 6,
            }}>
              "{card.quote}"
            </div>
            <div className="font-body uppercase" style={{
              fontSize: 10, fontWeight: 400,
              color: '#8C7B6B', letterSpacing: '0.04em',
            }}>
              {card.quoteAuthor}
            </div>
          </div>
        )}

        {/* On Your Trip */}
        {connection && (
          <div style={{ padding: '14px 22px 0' }}>
            <div className="font-body uppercase" style={{
              fontSize: 11, fontWeight: 700,
              color: '#2D6B6B', letterSpacing: '0.14em',
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <rect x="1" y="1" width="8" height="8" stroke="#2D6B6B" strokeWidth="1.5" transform="rotate(45 5 5)" />
              </svg>
              On Your Trip
            </div>
            <div className="font-body" style={{
              fontSize: 14, fontWeight: 400,
              color: '#1C1917', lineHeight: 1.8,
            }}>
              {connection}
            </div>
          </div>
        )}
      </div>

      {/* Flip arrow */}
      <div style={{
        position: 'absolute', right: 22, bottom: 18,
        display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      }}>
        <span className="font-body uppercase" style={{
          fontSize: 8, color: '#8C7B6B', opacity: 0.5, letterSpacing: '0.12em',
        }}>back</span>
        <div style={{ opacity: 0.5 }}>
          <FlipArrow dark />
        </div>
      </div>
    </div>
  );
}

export default function PracticeCardModal({ card, connection, onClose }) {
  const [flipped, setFlipped] = useState(false);
  const [flipAnimating, setFlipAnimating] = useState(false);

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!card) return null;
  const principle = CARD_PRINCIPLES[card.principle];
  if (!principle) return null;

  const handleFlip = () => {
    if (flipAnimating) return;
    setFlipAnimating(true);
    setFlipped(f => !f);
    setTimeout(() => setFlipAnimating(false), 520);
  };
  const stop = (e) => e.stopPropagation();

  return (
    <>
      <style>{KEYFRAMES}</style>
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
          padding: 16,
          animation: 'lilaCardBackdropIn 0.25s ease',
        }}
      >
        <div
          onClick={stop}
          style={{
            width: 'min(400px, calc(100vw - 28px))',
            height: 'min(720px, calc(100vh - 120px))',
            position: 'relative',
            perspective: 1200,
            animation: 'lilaCardLiftForward 0.32s cubic-bezier(0.2, 0.7, 0.2, 1)',
          }}
        >
          <div style={{
            width: '100%', height: '100%', position: 'relative',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            animation: flipAnimating
              ? `${flipped ? 'flipCard' : 'flipCardBack'} 0.5s ease-in-out forwards`
              : 'none',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 12px 30px rgba(0,0,0,0.25)',
          }}>
            <FrontFace card={card} principle={principle} onFlip={handleFlip} onClose={onClose} />
            <BackFace card={card} principle={principle} connection={connection} onFlip={handleFlip} onClose={onClose} />
          </div>
        </div>
      </div>
    </>
  );
}
