/**
 * PracticeCardTeaser.jsx
 * ──────────────────────
 * Horizontal strip that sits at the bottom of each day card in
 * ItineraryResults. Tap to open the full PracticeCardModal.
 *
 * No rounded corners — sharp rectangular aesthetic is a hard brand rule.
 */

import { CARD_PRINCIPLES } from '@data/cardDeck';
import PrincipleMark from './PrincipleMarks';

export default function PracticeCardTeaser({ card, onOpen }) {
  if (!card) return null;
  const principle = CARD_PRINCIPLES[card.principle];
  if (!principle) return null;

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
      aria-label={`Open practice card: ${card.name}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        height: 64,
        padding: '0 18px',
        background: principle.color,
        color: 'white',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Principle mark */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PrincipleMark id={principle.id} size={22} />
      </div>

      {/* Tradition + principle label (stacked) */}
      <div style={{ flexShrink: 0, lineHeight: 1.15, minWidth: 70 }}>
        <div
          className="font-body uppercase"
          style={{
            fontSize: 8,
            letterSpacing: '0.22em',
            color: 'white',
            opacity: 0.7,
            fontWeight: 600,
          }}
        >
          {card.tradition}
        </div>
        <div
          className="font-body uppercase"
          style={{
            fontSize: 8,
            letterSpacing: '0.22em',
            color: 'white',
            opacity: 0.7,
            marginTop: 2,
            fontWeight: 600,
          }}
        >
          {principle.name}
        </div>
      </div>

      {/* Card name + subtitle */}
      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.15 }}>
        <div
          className="font-serif"
          style={{
            fontSize: 17,
            color: 'white',
            fontWeight: 400,
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
              fontSize: 10,
              color: 'white',
              opacity: 0.65,
              fontStyle: 'italic',
              marginTop: 3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {card.subtitle}
          </div>
        )}
      </div>

      {/* Flip arrow — bottom right */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: 14,
          bottom: 8,
          opacity: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8 a5 5 0 1 0 5 -5"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M2.6 4.5 L3 8 L6.4 7.6"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
