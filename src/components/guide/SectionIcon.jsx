const SIZE = 28;

const iconPaths = {
  move: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <rect x="14" y="2" width="15" height="15" rx="2" transform="rotate(45 14 2)"
        stroke={c} strokeWidth="1.5" fill="none" />
    </svg>
  ),
  breathe: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke={c} strokeWidth="1.5" fill="none" />
    </svg>
  ),
  awaken: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <path d="M14 3 L16 11 L24 14 L16 17 L14 25 L12 17 L4 14 L12 11 Z"
        stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  connect: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 32 28" fill="none">
      <circle cx="12" cy="14" r="9" stroke={c} strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="14" r="9" stroke={c} strokeWidth="1.5" fill="none" />
    </svg>
  ),
  stay: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <path d="M4 14 L14 5 L24 14" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13 L7 23 L21 23 L21 13" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  windows: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <rect x="4" y="4" width="20" height="20" rx="2" stroke={c} strokeWidth="1.5" fill="none" />
      <line x1="14" y1="4" x2="14" y2="24" stroke={c} strokeWidth="1.5" />
      <line x1="4" y1="14" x2="24" y2="14" stroke={c} strokeWidth="1.5" />
    </svg>
  ),
  threshold: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
        stroke={c} strokeWidth="1.5" fill="none" />
    </svg>
  ),
  plan: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke={c} strokeWidth="1.5" fill="none" />
      <path d="M11 17 L13 13 L17 11 L15 15 Z" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  group: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke={c} strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="10" r="3.5" stroke={c} strokeWidth="1.5" fill="none" />
      <path d="M4 22 C4 17 7 15 10 15 C11.5 15 12.5 15.5 14 16.5 C15.5 15.5 16.5 15 18 15 C21 15 24 17 24 22" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
  giveback: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <path d="M14 24 C14 24 4 17 4 11 C4 7.7 6.7 5 10 5 C11.8 5 13.3 5.9 14 7.2 C14.7 5.9 16.2 5 18 5 C21.3 5 24 7.7 24 11 C24 17 14 24 14 24 Z"
        stroke={c} strokeWidth="1.5" fill="none" />
    </svg>
  ),
  discover: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke={c} strokeWidth="1.5" fill="none" />
      <path d="M10 14 L14 6 L18 14 L14 22 Z" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  ),
  darksky: (c) => (
    <svg width={SIZE} height={SIZE} viewBox="0 0 28 28" fill="none">
      <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
        stroke={c} strokeWidth="1.5" fill="none" />
      <circle cx="22" cy="6" r="1" fill={c} opacity="0.6" />
      <circle cx="8" cy="5" r="0.8" fill={c} opacity="0.5" />
      <circle cx="24" cy="12" r="0.6" fill={c} opacity="0.4" />
    </svg>
  ),
};

export default function SectionIcon({ type, color }) {
  const render = iconPaths[type];
  if (!render) return null;
  return (
    <div className="flex justify-center mb-3">
      {render(color)}
    </div>
  );
}
