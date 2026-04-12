/**
 * PrincipleMarks.jsx — five SVG glyphs for the card deck principles.
 *
 * Each mark defaults to white strokes (for use on principle color
 * backgrounds). Pass a `color` prop to override — e.g. on the
 * orientation screen where marks use their principle accent color.
 *
 * Usage:
 *   <PrincipleMark id="presence" size={22} />
 *   <PrincipleMark id="presence" size={18} color="#B8824A" />
 */

function Presence({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.25" />
      <circle cx="12" cy="12" r="1.6" fill={color} />
    </svg>
  );
}

function Oneness({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="12" r="6.25" stroke={color} strokeWidth="1.25" />
      <circle cx="15" cy="12" r="6.25" stroke={color} strokeWidth="1.25" />
    </svg>
  );
}

function Flow({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 8 Q7.5 5 12 8 T21 8" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M3 12 Q7.5 9 12 12 T21 12" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
      <path d="M3 16 Q7.5 13 12 16 T21 16" stroke={color} strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function Compassion({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 13 C9 9 9 6 12 4 C15 6 15 9 12 13 Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12 13 C7 12 5.5 9.5 5 6.5 C8 7 10.5 9 12 13 Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12 13 C17 12 18.5 9.5 19 6.5 C16 7 13.5 9 12 13 Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12 13 V21" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function Reverence({ size = 22, color = 'white' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 18 L9 8 L13.5 14 L17 9 L21 18 Z" stroke={color} strokeWidth="1.25" strokeLinejoin="round" />
      <path d="M2 20.5 H22" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

const MAP = {
  presence: Presence,
  oneness: Oneness,
  flow: Flow,
  compassion: Compassion,
  reverence: Reverence,
};

export default function PrincipleMark({ id, size = 22, color = 'white' }) {
  const Component = MAP[id];
  if (!Component) return null;
  return <Component size={size} color={color} />;
}
