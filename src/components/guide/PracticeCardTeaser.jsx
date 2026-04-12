/**
 * PracticeCardTeaser.jsx
 * ──────────────────────
 * Wallet-style stacked card widget. A main card face with two faded
 * color strips peeking beneath it, creating a physical card deck
 * illusion. Sits between the day header and the timeline in each day
 * card. Tap to open the full PracticeCardModal.
 *
 * The borderRadius on this component is an approved exception for the
 * card deck physical metaphor — not applied elsewhere in the codebase.
 */

import { useState } from 'react';
import PrincipleMark from './PrincipleMarks';

export default function PracticeCardTeaser({ card, principle, onOpen }) {
  const [pressed, setPressed] = useState(false);

  if (!card || !principle) return null;

  const handleClick = () => {
    if (typeof onOpen === 'function') onOpen(card);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      aria-label={`Open practice card: ${card.name}`}
      style={{
        position: 'relative',
        cursor: 'pointer',
        paddingBottom: 8,
        margin: '0 12px',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none',
      }}
    >
      {/* Third card strip (furthest back) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 6,
          right: 6,
          height: 12,
          background: `${principle.color}44`,
          borderRadius: '0 0 10px 10px',
        }}
      />

      {/* Second card strip */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 4,
          left: 3,
          right: 3,
          height: 12,
          background: `${principle.color}77`,
          borderRadius: '0 0 8px 8px',
        }}
      />

      {/* Main card face */}
      <div
        style={{
          position: 'relative',
          background: principle.color,
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          transform: pressed ? 'translateY(1px)' : 'translateY(0)',
          transition: 'transform 0.15s ease',
        }}
      >
        {/* Subtle radial highlight */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 15% 50%, rgba(255,255,255,0.09) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content row */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px 16px',
          }}
        >
          {/* Left — principle mark */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PrincipleMark id={principle.id} size={28} />
          </div>

          {/* Middle — label + name + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="font-body uppercase"
              style={{
                fontSize: 8,
                letterSpacing: '0.22em',
                color: 'white',
                opacity: 0.55,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Today's Lila Meditation
            </div>
            <div
              className="font-serif"
              style={{
                fontSize: 18,
                color: 'white',
                fontWeight: 400,
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {card.name}
            </div>
            {card.subtitle && (
              <div
                className="font-body"
                style={{
                  fontSize: 12,
                  color: 'white',
                  opacity: 0.6,
                  fontWeight: 400,
                  marginTop: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {card.subtitle}
              </div>
            )}
          </div>

          {/* Right — expand icon */}
          <div
            aria-hidden
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : 0.45,
              transition: 'opacity 0.15s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M 12 3 L 17 3 L 17 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 17 3 L 11 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 8 17 L 3 17 L 3 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 3 17 L 9 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
