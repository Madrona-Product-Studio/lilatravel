/**
 * DeckMarks.jsx — line art section marks for Movements L1 & L2 decks.
 *
 * Same pattern as PrincipleMarks.jsx: 24×24 viewBox, stroke only,
 * default white, 1.25px stroke width.
 *
 * Usage:
 *   <DeckMark id="arrive" size={22} />
 *   <DeckMark id="body" size={52} color="#2D6B6B" />
 */

// ─── Movements L1 marks (6 section marks) ────────────────────────────────────

function Arrive({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <line x1="12" y1="2" x2="12" y2="16" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="5" y1="9" x2="12" y2="18" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="19" y1="9" x2="12" y2="18" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function Awaken({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.25" />
      <line x1="12" y1="2" x2="12" y2="6" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="2" y1="12" x2="6" y2="12" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="18" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="4.9" y1="4.9" x2="7.8" y2="7.8" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="16.2" y1="16.2" x2="19.1" y2="19.1" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="19.1" y1="4.9" x2="16.2" y2="7.8" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="7.8" y1="16.2" x2="4.9" y2="19.1" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function Open({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <path d="M8 2 Q2 12 8 22" stroke={color} strokeWidth="1.25" strokeLinecap="round" fill="none" />
      <path d="M16 2 Q22 12 16 22" stroke={color} strokeWidth="1.25" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Balance({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <circle cx="8" cy="12" r="5.5" stroke={color} strokeWidth="1.25" />
      <circle cx="16" cy="12" r="5.5" stroke={color} strokeWidth="1.25" />
    </svg>
  );
}

function Ground({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <path d="M12 20 L2 5 L22 5 Z" stroke={color} strokeWidth="1.25" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Rest({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <path d="M15 3 A9 9 0 1 0 15 21 A6.5 6.5 0 1 1 15 3 Z" stroke={color} strokeWidth="1.25" fill="none" />
    </svg>
  );
}

// ─── Movements L2 marks (3 chapter marks) ────────────────────────────────────

function Body({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <circle cx="12" cy="4" r="3.5" stroke={color} strokeWidth="1.25" />
      <line x1="12" y1="7.5" x2="12" y2="20" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function Force({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <line x1="2" y1="12" x2="18" y2="12" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="12" y1="5" x2="20" y2="12" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <line x1="12" y1="19" x2="20" y2="12" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function Understanding({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="7" stroke={color} strokeWidth="1.25" />
      <circle cx="12" cy="12" r="2" fill={color} stroke="none" />
      <line x1="19" y1="12" x2="24" y2="12" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

// ─── Map & export ────────────────────────────────────────────────────────────

const MAP = {
  // L1 sections
  arrive: Arrive,
  awaken: Awaken,
  open: Open,
  balance: Balance,
  ground: Ground,
  rest: Rest,
  // L2 chapters
  body: Body,
  force: Force,
  understanding: Understanding,
};

export const L1_MARK_IDS = ['arrive', 'awaken', 'open', 'balance', 'ground', 'rest'];
export const L2_MARK_IDS = ['body', 'force', 'understanding'];

export default function DeckMark({ id, size = 22, color = 'white' }) {
  const Component = MAP[id];
  if (!Component) return null;
  return <Component size={size} color={color} />;
}
