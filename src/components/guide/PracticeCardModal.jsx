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
@keyframes lilaCardFaceIn {
  from { opacity: 0; transform: scale(1.02); }
  to   { opacity: 1; transform: scale(1); }
}
`;

function FlipArrow({ dark = false }) {
  const stroke = dark ? '#1C1917' : 'white';
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
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
        position: 'relative',
        width: '100%',
        height: '100%',
        background: principle.color,
        color: 'white',
        cursor: 'pointer',
        overflow: 'hidden',
        animation: 'lilaCardFaceIn 0.3s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Subtle radial highlight */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 10%, rgba(255,255,255,0.07) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />

      <CloseButton onClose={onClose} />

      <div style={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 26px 28px',
      }}>
        {/* Top zone */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <PrincipleMark id={principle.id} size={36} />
          </div>
          <div
            className="font-body uppercase"
            style={{
              fontSize: 9,
              letterSpacing: '0.28em',
              color: 'white',
              opacity: 0.85,
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {principle.name}
          </div>
          <div
            className="font-serif"
            style={{
              fontSize: 13,
              fontStyle: 'italic',
              color: 'white',
              opacity: 0.85,
              textAlign: 'center',
              marginTop: 6,
              fontWeight: 300,
            }}
          >
            {principle.arc}
          </div>
          <div
            className="font-body uppercase"
            style={{
              fontSize: 8,
              letterSpacing: '0.3em',
              color: 'white',
              opacity: 0.4,
              textAlign: 'center',
              marginTop: 8,
              fontWeight: 600,
            }}
          >
            {principle.intention}
          </div>
          <div style={{
            height: '0.5px',
            background: 'rgba(255,255,255,0.2)',
            marginTop: 18,
          }} />
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom zone */}
        <div>
          <div
            className="font-body uppercase"
            style={{
              fontSize: 9,
              letterSpacing: '0.22em',
              color: 'white',
              opacity: 0.7,
              fontWeight: 600,
            }}
          >
            {card.tradition}
          </div>
          <h2
            className="font-serif"
            style={{
              fontSize: 42,
              color: 'white',
              fontWeight: 300,
              lineHeight: 1.05,
              margin: '6px 0 8px',
            }}
          >
            {card.name}
          </h2>
          {card.subtitle && (
            <div
              className="font-body"
              style={{
                fontSize: 11,
                fontStyle: 'italic',
                color: 'white',
                opacity: 0.75,
                marginBottom: 14,
              }}
            >
              {card.subtitle}
            </div>
          )}
          <p
            className="font-body"
            style={{
              fontSize: 13,
              color: 'white',
              opacity: 0.92,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {card.teaching}
          </p>
        </div>

        {/* Flip arrow */}
        <div style={{ position: 'absolute', right: 22, bottom: 18, opacity: 0.35 }}>
          <FlipArrow />
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
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#F7F4EE',
        color: '#1C1917',
        cursor: 'pointer',
        overflow: 'auto',
        animation: 'lilaCardFaceIn 0.3s ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <CloseButton onClose={onClose} dark />

      <div style={{ padding: '18px 22px 60px' }}>
        {/* Card name with diamond glyph */}
        <div
          className="font-body uppercase"
          style={{
            fontSize: 10,
            letterSpacing: '0.18em',
            color: principle.color,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 18,
          }}
        >
          <span>◈</span>
          <span>{card.name}</span>
        </div>

        {/* THE PRACTICE label */}
        <div
          className="font-body uppercase"
          style={{
            fontSize: 10,
            letterSpacing: '0.18em',
            color: '#4a3a2a',
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          The Practice
        </div>
        <p
          className="font-body"
          style={{
            fontSize: 14,
            color: '#1C1917',
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {card.practice}
        </p>

        {/* Hairline divider */}
        <div style={{ height: '0.5px', background: '#c8bfb077', margin: '20px 0' }} />

        {/* Quote block */}
        {card.quote && (
          <div>
            {card.quoteOriginal && (
              <div
                className="font-serif"
                style={{
                  fontSize: 11,
                  fontStyle: 'italic',
                  color: '#7a6f5e',
                  marginBottom: 6,
                  fontWeight: 400,
                }}
              >
                {card.quoteOriginal}
              </div>
            )}
            <div
              className="font-serif"
              style={{
                fontSize: 15,
                fontStyle: 'italic',
                color: '#1C1917',
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              “{card.quote}”
            </div>
            {card.quoteAuthor && (
              <div
                className="font-body uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.16em',
                  color: '#7a6f5e',
                  marginTop: 8,
                  fontWeight: 600,
                }}
              >
                — {card.quoteAuthor}
              </div>
            )}
          </div>
        )}

        {/* Hairline divider */}
        <div style={{ height: '0.5px', background: '#c8bfb077', margin: '20px 0' }} />

        {/* ON YOUR TRIP label */}
        <div
          className="font-body uppercase"
          style={{
            fontSize: 10,
            letterSpacing: '0.18em',
            color: '#2D6B6B',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span>◈</span>
          <span>On Your Trip</span>
        </div>
        <p
          className="font-body"
          style={{
            fontSize: 14,
            color: '#1C1917',
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {connection || 'A field for this exact day will appear here once your itinerary is generated.'}
        </p>
      </div>

      {/* Flip arrow — bottom right, dark */}
      <div style={{ position: 'absolute', right: 22, bottom: 18, opacity: 0.35 }}>
        <FlipArrow dark />
      </div>
    </div>
  );
}

export default function PracticeCardModal({ card, connection, onClose }) {
  const [face, setFace] = useState('front');

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

  const handleFlip = () => setFace(f => (f === 'front' ? 'back' : 'front'));
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
            width: 'min(358px, calc(100vw - 32px))',
            height: 'min(580px, calc(100vh - 32px))',
            position: 'relative',
            animation: 'lilaCardLiftForward 0.32s cubic-bezier(0.2, 0.7, 0.2, 1)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.45), 0 12px 30px rgba(0,0,0,0.25)',
          }}
        >
          {face === 'front' ? (
            <FrontFace card={card} principle={principle} onFlip={handleFlip} onClose={onClose} />
          ) : (
            <BackFace card={card} principle={principle} connection={connection} onFlip={handleFlip} onClose={onClose} />
          )}
        </div>
      </div>
    </>
  );
}
