import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { C as BrandC } from '@data/brand';
import { lookupUrl as lookupZion } from '@data/destinations/zion-urls';
import { lookupUrl as lookupJoshuaTree } from '@data/destinations/joshua-tree-urls';
import { lookupUrl as lookupBigSur } from '@data/destinations/big-sur-urls';
import { lookupUrl as lookupOlympic } from '@data/destinations/olympic-peninsula-urls';
import { lookupUrl as lookupKauai } from '@data/destinations/kauai-urls';
import { lookupUrl as lookupVancouver } from '@data/destinations/vancouver-island-urls';
const lookupUrl = (name) => lookupZion(name) || lookupJoshuaTree(name) || lookupBigSur(name) || lookupOlympic(name) || lookupKauai(name) || lookupVancouver(name);
import JSON5 from 'json5';
import { trackEvent } from '@utils/analytics';
import { getPracticesForItinerary, TRADITIONS, ENTRIES } from '@services/practicesService';
import { assignCompanions } from '@services/companionAssigner';
import { saveItinerary, saveFeedback, updateItineraryTitle, updateTripLogistics } from '@services/feedbackService';

import { clearSession } from '@services/sessionManager';
import { createShareableUrl } from '@services/shareService';
import { safeJson, fetchWithTimeout } from '@utils/fetchHelpers';
import SavePill from '@components/SavePill';
import ItineraryNav from '@components/ItineraryNav';
// CelestialMonthStrip consolidated into CelestialSnapshot below

/*
 * ItineraryResults — Merged V3
 * ────────────────────────────
 * V2 design: Quicksand-first fonts, SVG category icons, refined spacing
 * V3 features: Per-day feedback, trip pulse, refinement flow, premium gate
 * Original: Routing, JSON5 parsing, metadata fallbacks, markdown fallback
 */

/* ── colors ────────────────────────────────────────────────────────────── */

const C = {
  // V2 design tokens
  warm:   '#F5F0E8',
  white:  '#FFFFFF',
  ink:    '#1C1C1A',
  body:   '#3D3D38',
  muted:  '#8C8C80',
  sage:   '#6B7A72',
  teal:   BrandC.oceanTeal,
  amber:  BrandC.goldenAmber,
  salmon: BrandC.sunSalmon,
  sea:    BrandC.seaGlass,
  sky:    BrandC.skyBlue,
  border: 'rgba(28,28,26,0.10)',
  // Legacy aliases for kept components
  cream:       '#F5F0E8',
  slate:       BrandC.darkInk,
  oceanTeal:   BrandC.oceanTeal,
  goldenAmber: BrandC.goldenAmber,
  sunSalmon:   BrandC.sunSalmon,
  seaGlass:    BrandC.seaGlass,
  skyBlue:     BrandC.skyBlue,
  sageLight:   '#8FA39A',
};

const WARM_DOT = '#D4A95A';

const DAY_COLORS = [
  C.amber, C.teal, C.sky, C.salmon,
  C.sea, '#8B7EC8', C.amber, C.teal,
];

const CARD_STYLE = {
  background: C.white,
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  boxShadow: '0 2px 12px rgba(28,28,26,0.05)',
};

const LOCKED_CARD_STYLE = {
  background: C.white,
  borderRadius: 8,
  border: `2px solid rgba(212,168,83,0.50)`,
  boxShadow: '0 2px 12px rgba(28,28,26,0.05)',
};

const PICK_STYLES = {
  mindfulness: { label: 'Mindfulness', color: C.seaGlass },
  stay: { label: 'Where to Stay', color: C.goldenAmber },
  eat:  { label: 'Where to Eat',  color: C.sunSalmon },
  gear: { label: 'Gear',          color: C.oceanTeal },
  wellness: { label: 'Wellness',  color: C.seaGlass },
};

const TRADITION_GLYPHS = {
  hinduism: 'ॐ',
  buddhism: '☸',
  taoism: '☯',
  shinto: '⛩',
  stoicism: '◎',
  crossCultural: '◈',
};

const PRACTICE_TAG_LABELS = {
  yoga: 'Yoga', breathwork: 'Breathwork', coldPlunge: 'Cold Plunge',
  meditation: 'Meditation', hiking: 'Hiking', stargazing: 'Stargazing',
  stewardship: 'Stewardship', spa: 'Spa & Massage', sauna: 'Sauna',
  biking: 'Biking', nativeCulture: 'Native Culture', wildlife: 'Wildlife',
  hotSprings: 'Hot Springs', paddling: 'Paddling', farmToTable: 'Farm to Table',
  musicAndArts: 'Music & Arts',
};

const PRACTICE_MAP = {
  yoga:         { color: '#4A9B9F', paths: ['M12 20 C12 20 8 16 8 12 C8 8 10 5 12 3 C14 5 16 8 16 12 C16 16 12 20 12 20Z', 'M12 20 C12 20 5 15 4 11 C3 7 6 5 8 6', 'M12 20 C12 20 19 15 20 11 C21 7 18 5 16 6'], fill: 'rgba(74,155,159,0.12)' },
  breathwork:   { color: '#7aaec8', paths: ['M5 7 L19 7 L19 21 L5 21 Z'], fill: null, circles: [{ cx: 12, cy: 7, r: 2, fill: '#7aaec8' }] },
  coldPlunge:   { color: '#8FA39A', paths: ['M2 12 C4 8 6 8 8 12 C10 16 12 16 14 12 C16 8 18 8 22 12', 'M2 16 C4 12 6 12 8 16 C10 20 12 20 14 16'], fill: null },
  meditation:   { color: '#6B7A72', paths: ['M12 3 C17.5 3 21 7 21 12 C21 17 17.5 21 12 21 C6.5 21 3 17 3 12 C3 8.5 5 5.5 8 4'], fill: null },
  hiking:       { color: '#D4A853', paths: ['M3 20 L10 6 L14 13 L17 8 L21 20 Z', 'M3 20 L10 6 L14 13 L17 8 L21 20'], fill: 'rgba(212,168,83,0.1)' },
  stargazing:   { color: '#2d3d4d', paths: ['M18 12 C18 7 13 3 8 5 C12 5 15 8 15 12 C15 16 12 19 8 19 C13 21 18 17 18 12Z', 'M4 5 L4.8 3 L5.6 5', 'M3 9 L3.5 8 L4 9', 'M6 3 L6.4 2 L6.8 3'], fill: 'rgba(45,61,77,0.08)' },
  stewardship:  { color: '#6B7A72', paths: ['M12 3 L12 14', 'M9.5 3 Q12 1.5 14.5 3', 'M8 14 L8 18 Q8 21 12 21 Q16 21 16 18 L16 14 Z', 'M8 14 L16 14'], fill: null },
  spa:          { color: '#8FA39A', paths: ['M5 8 Q9 6 12 8 Q15 10 19 8', 'M5 12 Q9 10 12 12 Q15 14 19 12', 'M5 16 Q9 14 12 16 Q15 18 19 16'], fill: null },
  sauna:        { color: '#E8856A', paths: ['M12 2 C12 2 18 8 18 14 C18 17.3 15.3 20 12 20 C8.7 20 6 17.3 6 14 C6 8 12 2 12 2Z'], fill: 'rgba(232,133,106,0.1)' },
  biking:       { color: '#7aaec8', paths: ['M7 16 a3.5 3.5 0 1 0 0.001 0', 'M17 16 a3.5 3.5 0 1 0 0.001 0', 'M7 16 L10 8 L14 8', 'M14 8 L17 16 L12 16 L10 8'], fill: null },
  nativeCulture:{ color: '#6B7A72', paths: ['M5 6 L19 6', 'M6 10 L18 10', 'M7 6 L7 21', 'M17 6 L17 21', 'M3 5 L21 5'], fill: null },
  wildlife:     { color: '#D4A853', paths: ['M12 15 a4 3.5 0 1 0 0.001 0', 'M7.5 10 a1.8 1.8 0 1 0 0.001 0', 'M10.5 7.5 a1.8 1.8 0 1 0 0.001 0', 'M13.5 7.5 a1.8 1.8 0 1 0 0.001 0', 'M16.5 10 a1.8 1.8 0 1 0 0.001 0'], fill: null },
  hotSprings:   { color: '#4A9B9F', paths: ['M2 12 C4 8 6 8 8 12 C10 16 12 16 14 12 C16 8 18 8 22 12'], fill: null },
  paddling:     { color: '#7aaec8', paths: ['M12 3 L12 21', 'M12 13 C9 15 8 19 12 21 C16 19 15 15 12 13Z', 'M9.5 3 L14.5 3'], fill: null },
  farmToTable:  { color: '#D4A853', paths: ['M9 21 L9 11', 'M7 3 L7 7 Q7 11 9 11 Q11 11 11 7 L11 3', 'M9 3 L9 7', 'M15 3 C17 3 17 5 17 8 L17 21', 'M15 3 L15 8 Q15 11 17 11'], fill: null },
  musicAndArts: { color: '#E8856A', paths: ['M9 18 L9 6 L19 4 L19 16'], fill: null, circles: [{ cx: 6.5, cy: 18, r: 2.5, fill: 'rgba(232,133,106,0.1)' }, { cx: 16.5, cy: 16, r: 2.5, fill: 'rgba(232,133,106,0.1)' }] },
};

function PracticeIcon({ practiceId, size = 15 }) {
  const p = PRACTICE_MAP[practiceId];
  if (!p) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={p.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0 }}>
      {p.fill && p.paths?.[0] && <path d={p.paths[0]} fill={p.fill} stroke="none" />}
      {p.paths?.map((d, i) => <path key={i} d={d} />)}
      {p.circles?.map((c, i) => <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} stroke="none" />)}
    </svg>
  );
}

/* ── SVG icons ─────────────────────────────────────────────────────────── */

const Chevron = ({ open, color = C.sage }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(-90deg)', transition: 'transform 0.35s ease', flexShrink: 0 }}>
    <polyline points="4.5,6 8,9.5 11.5,6" />
  </svg>
);

const ExternalLinkIcon = ({ size = 11, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 9v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4" /><path d="M9 2h5v5" /><path d="M7 9L14 2" />
  </svg>
);

const CategoryIcon = ({ category, color, size = 16 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (category) {
    case 'stay': return (<svg {...props}><path d="M3 21V7l9-4 9 4v14" /><path d="M9 21v-6h6v6" /><path d="M3 10h18" /></svg>);
    case 'eat': return (<svg {...props}><path d="M3 6c0 0 0.5 4 4 4s4-4 4-4" /><line x1="7" y1="10" x2="7" y2="21" /><path d="M17 3v6a3 3 0 0 1-3 3" /><path d="M17 3v18" /><line x1="3" y1="6" x2="11" y2="6" /></svg>);
    case 'gear': return (<svg {...props}><path d="M6 19V9" /><path d="M18 19V9" /><path d="M6 9a6 6 0 0 1 12 0" /><path d="M6 9H4" /><path d="M20 9h-2" /><rect x="8" y="14" width="8" height="5" rx="1" /></svg>);
    case 'wellness': return (<svg {...props}><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><path d="M8 21l4-10 4 10" /><path d="M6 14l6-3 6 3" /></svg>);
    default: return (<svg {...props}><circle cx="12" cy="12" r="3" /></svg>);
  }
};

const LilaStar = ({ size = 10, color = C.goldenAmber }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round">
    <path d="M8 1.5l2 4.5 5 .5-3.5 3.5 1 4.5L8 12l-4.5 2.5 1-4.5L1 6.5l5-.5z" />
  </svg>
);

/* Feedback icons */
const CheckIcon = ({ size = 14, color = C.seaGlass }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,8.5 6.5,12 13,4" />
  </svg>
);

const PencilIcon = ({ size = 14, color = C.goldenAmber }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 1.5l3 3L5 14H2v-3z" /><path d="M9.5 3.5l3 3" />
  </svg>
);

const SparkleIcon = ({ size = 14, color = C.oceanTeal }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 1v3M8 12v3M1 8h3M12 8h3" /><path d="M3.5 3.5l2 2M10.5 10.5l2 2M10.5 3.5l2 2M3.5 10.5l-2-2" />
  </svg>
);

const LockIcon = ({ size = 14, color = C.slate }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V5a3 3 0 0 1 6 0v2" />
  </svg>
);

const PlaneIcon = ({ size = 14, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2L7 9" /><path d="M14 2l-4 12-3-5-5-3z" />
  </svg>
);

const CarIcon = ({ size = 14, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10V7l2-4h6l2 4v3" /><rect x="2" y="10" width="12" height="3" rx="1" /><circle cx="4.5" cy="13" r="1" /><circle cx="11.5" cy="13" r="1" />
  </svg>
);

const RefreshIcon = ({ size = 14, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 8a5.5 5.5 0 0 1 9.5-3.5" /><path d="M13.5 8a5.5 5.5 0 0 1-9.5 3.5" />
    <polyline points="12,1 12,5 8,5" /><polyline points="4,15 4,11 8,11" />
  </svg>
);

/* Companion icons */
const TeachingIcon = ({ size = 13, color = C.goldenAmber }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const PracticeIconSimple = ({ size = 13, color = C.seaGlass }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><path d="M8 21l4-10 4 10" /><path d="M6 14l6-3 6 3" />
  </svg>
);

const IconLotus = ({ size = 24, color = '#4A9B9F' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20 C12 20 8 16 8 12 C8 8 10 5 12 3 C14 5 16 8 16 12 C16 16 12 20 12 20Z" fill={`${color}15`} />
    <path d="M12 20 C12 20 5 15 4 11 C3 7 6 5 8 6" />
    <path d="M12 20 C12 20 19 15 20 11 C21 7 18 5 16 6" />
    <line x1="12" y1="20" x2="12" y2="8" strokeWidth="1" opacity="0.4" />
  </svg>
);

const ArrowRightIcon = ({ size = 10, color = `${C.sage}80` }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10" /><polyline points="9,4 13,8 9,12" />
  </svg>
);

const ClockIcon = ({ size = 9, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6.5" /><path d="M8 4.5V8l2.5 1.5" />
  </svg>
);

const BackIcon = ({ size = 14, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 8H3" /><polyline points="7,4 3,8 7,12" />
  </svg>
);

const MountainIcon = ({ size = 14, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 19L14.5 7L21 19H3L8.5 10L12 16" />
  </svg>
);

const RouteIcon = ({ size = 14, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />
  </svg>
);

const PermitIcon = ({ size = 14, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1" fill={color} />
  </svg>
);

const TrailheadIcon = ({ size = 14, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const CloseIcon = ({ size = 14, color = C.sage }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l8 8" /><path d="M12 4l-8 8" />
  </svg>
);

const FlameIcon = ({ size = 14, color = C.goldenAmber, active = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C12 2 7 7 7 13a5 5 0 0 0 10 0c0-3-2-5-2-5s0 3-3 3c0-2 0-6 0-9z" fill={active ? `${color}15` : 'none'} />
    <path d="M12 17a1.5 1.5 0 0 1-1.5-1.5C10.5 14.5 12 13 12 13s1.5 1.5 1.5 2.5A1.5 1.5 0 0 1 12 17z" fill={active ? `${color}30` : 'none'} />
  </svg>
);

const UnlockIcon = ({ size = 14, color = C.slate }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V5a3 3 0 0 1 6 0" />
  </svg>
);

const ThumbUp = ({ size = 14, color = C.seaGlass, active = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 11v9a1 1 0 0 0 1 1h9.5a1.5 1.5 0 0 0 1.48-1.26l1.2-7A1.5 1.5 0 0 0 17.7 10H14V6a2 2 0 0 0-2-2 1 1 0 0 0-1 1v.5L8.5 11H6z" fill={active ? `${color}18` : 'none'} />
    <path d="M6 11H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2" />
  </svg>
);

const ThumbDown = ({ size = 14, color = C.sunSalmon, active = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13V4a1 1 0 0 0-1-1H7.5a1.5 1.5 0 0 0-1.48 1.26l-1.2 7A1.5 1.5 0 0 0 6.3 14H10v4a2 2 0 0 0 2 2 1 1 0 0 0 1-1v-.5l2.5-4.5H18z" fill={active ? `${color}18` : 'none'} />
    <path d="M18 13h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2" />
  </svg>
);


/* ── linked name (with lookupUrl fallback) ─────────────────────────────── */

function LinkedName({ name, url, style = {}, linkType = 'activity' }) {
  const resolvedUrl = url || lookupUrl(name);
  if (resolvedUrl) {
    return (
      <a href={resolvedUrl} target="_blank" rel="noopener noreferrer"
        onClick={() => trackEvent('external_link_clicked', { name, url: resolvedUrl, link_type: linkType })}
        style={{
          ...style, textDecoration: 'none', borderBottom: `1px solid ${C.oceanTeal}25`,
          color: 'inherit', transition: 'border-color 0.2s',
        }}>
        {name}
      </a>
    );
  }
  return <span style={style}>{name}</span>;
}

/* ── celestial snapshot ─────────────────────────────────────────────────── */

// Per-month celestial event data (mirrors CelestialMonthStrip)
const CELESTIAL_BY_MONTH = {
  january:   { sky: 'Deep Winter Sky',  events: [{ icon: '\u{1F311}', name: 'New Moon',       date: 'Jan 29', note: 'Darkest skies of the month. Prime stargazing.' }, { icon: '\u{1F315}', name: 'Full Moon',       date: 'Jan 13', note: 'Wolf Moon. Landscape glows under full light.' }, { icon: '\u2744\uFE0F', name: 'Winter Cold',     date: 'Jan',     note: 'Coldest temps. Bundle up for trails.' }, { icon: '\u{1F30C}', name: 'Winter Stars', date: 'Jan', note: 'Orion, Sirius, and the winter hexagon dominate the sky.' }] },
  february:  { sky: 'Late Winter Sky',  events: [{ icon: '\u{1F311}', name: 'New Moon',       date: 'Feb 27', note: 'Best night-sky window. Milky Way returns.' }, { icon: '\u{1F315}', name: 'Full Moon',       date: 'Feb 12', note: 'Snow Moon. Cold brilliance overhead.' }, { icon: '\u{1F338}', name: 'First Blooms',    date: 'Late Feb', note: 'Early wildflowers begin to emerge.' }, { icon: '\u{1F30C}', name: 'Milky Way Returns', date: 'Late Feb', note: 'Galactic core begins rising before dawn.' }] },
  march:     { sky: 'Spring Equinox',   events: [{ icon: '\u2600\uFE0F', name: 'Spring Equinox', date: 'Mar 20', note: 'Equal day and night. Golden light returns.' }, { icon: '\u{1F311}', name: 'New Moon',       date: 'Mar 29', note: 'Clear skies for deep-sky viewing.' }, { icon: '\u{1F338}', name: 'Spring Bloom',   date: 'Mar\u2013Apr', note: 'Wildflowers begin. Color spreads across the landscape.' }, { icon: '\u{1F30C}', name: 'Spring Skies', date: 'Mar', note: 'Galaxy clusters and nebulae visible on clear nights.' }] },
  april:     { sky: 'Spring Bloom Sky', events: [{ icon: '\u{1F338}', name: 'Peak Bloom',     date: 'Apr',    note: 'Wildflowers and native plants in full display.' }, { icon: '\u{1F311}', name: 'New Moon',       date: 'Apr 27', note: 'Warm nights. Ideal for camping under stars.' }, { icon: '\u{1F315}', name: 'Full Moon',       date: 'Apr 12', note: 'Pink Moon. Soft light across the landscape.' }, { icon: '\u{1F30C}', name: 'Milky Way Rising', date: 'Apr', note: 'Galactic core rises earlier each night. Best after midnight.' }] },
  may:       { sky: 'Late Spring Sky',  events: [{ icon: '\u{1F311}', name: 'New Moon',       date: 'May 26', note: 'Pre-summer clarity. Milky Way rising.' }, { icon: '\u{1F315}', name: 'Full Moon',       date: 'May 12', note: 'Flower Moon. Warm evenings outdoors.' }, { icon: '\u{1F33F}', name: 'Green Season',   date: 'May',    note: 'Lush vegetation. Peak greenery across the region.' }, { icon: '\u{1F30C}', name: 'Milky Way Season', date: 'May', note: 'Galaxy visible by late evening. Warm-weather stargazing begins.' }] },
  june:      { sky: 'Summer Solstice',  events: [{ icon: '\u2600\uFE0F', name: 'Summer Solstice',date: 'Jun 21', note: 'Longest day. Extended golden hour light.' }, { icon: '\u{1F30C}', name: 'Milky Way Peak', date: 'Jun\u2013Sep', note: 'Galaxy rises overhead on clear nights.' }, { icon: '\u{1F311}', name: 'New Moon',       date: 'Jun 25', note: 'Best stargazing window of summer.' }] },
  july:      { sky: 'High Summer Sky',  events: [{ icon: '\u2600\uFE0F', name: 'Peak Summer',   date: 'Jul',    note: 'Long warm days. Best conditions for evening outings.' }, { icon: '\u{1F30C}', name: 'Milky Way',      date: 'Jul',    note: 'Core overhead mid-summer. Spectacular night skies.' }, { icon: '\u{1F315}', name: 'Full Moon',       date: 'Jul 10', note: 'Buck Moon. Warm light, warm nights.' }] },
  august:    { sky: 'Late Summer Sky',  events: [{ icon: '\u{1F320}', name: 'Perseids',        date: 'Aug 11\u201313', note: 'Peak meteor shower. Up to 100 meteors/hour.' }, { icon: '\u2600\uFE0F', name: 'Late Summer',  date: 'Early Aug', note: 'Summer winds down. Stunning clarity in the skies.' }, { icon: '\u{1F311}', name: 'New Moon',       date: 'Aug 23', note: 'Moonless nights for star-heavy viewing.' }] },
  september: { sky: 'Early Autumn Sky', events: [{ icon: '\u2600\uFE0F', name: 'Autumn Equinox', date: 'Sep 22', note: 'Light shifts. Foliage begins to turn.' }, { icon: '\u{1F311}', name: 'New Moon',       date: 'Sep 11', note: 'Best night-sky viewing. Ideal for stargazing.' }, { icon: '\u{1F315}', name: 'Full Moon',       date: 'Sep 25', note: 'Bright moonlit evening walks.' }, { icon: '\u{1F30C}', name: 'Milky Way Finale', date: 'Sep', note: 'Last good month for Milky Way core. Catch it before it sets.' }] },
  october:   { sky: 'Golden Autumn',    events: [{ icon: '\u{1F342}', name: 'Peak Color',      date: 'Oct',    note: 'Autumn foliage at its best. Golden light of the year.' }, { icon: '\u{1F311}', name: 'New Moon',       date: 'Oct 21', note: 'Dark skies over golden landscapes.' }, { icon: '\u{1F315}', name: 'Full Moon',       date: 'Oct 6',  note: "Hunter's Moon. Landscape glows at midnight." }, { icon: '\u{1F320}', name: 'Orionids', date: 'Oct 21\u201322', note: 'Meteor shower. 15\u201320 per hour at peak. Debris from Halley\'s Comet.' }] },
  november:  { sky: 'Deep Autumn Sky',  events: [{ icon: '\u{1F315}', name: 'Full Moon',       date: 'Nov 5',  note: 'Beaver Moon over bare branches.' }, { icon: '\u{1F320}', name: 'Leonids',         date: 'Nov 17', note: 'Meteor shower. 15\u201320 per hour at peak.' }, { icon: '\u{1F311}', name: 'New Moon',       date: 'Nov 20', note: 'Clear, cold. Best Milky Way of autumn.' }] },
  december:  { sky: 'Winter Solstice',  events: [{ icon: '\u2600\uFE0F', name: 'Winter Solstice', date: 'Dec 21', note: 'Shortest day. Most dramatic light of the year.' }, { icon: '\u{1F320}', name: 'Geminids',        date: 'Dec 13\u201314', note: 'Best meteor shower of the year. 120/hour at peak.' }, { icon: '\u{1F311}', name: 'New Moon',       date: 'Dec 30', note: 'Year-end dark sky. Crisp winter air.' }] },
};

const OCEAN_BY_MONTH = {
  january: {
    swell: { name: 'Peak NW Swell', range: '6–12 ft', intensity: 5, note: 'Largest swells of the year. Powerful and consistent. Experienced surfers only.' },
    tides: { name: 'King Tides', high: '5.9 ft', low: '−0.9 ft', note: 'Extreme tidal swings. Minus tides in the afternoon expose hidden tide pools and sea caves.' },
  },
  february: {
    swell: { name: 'Strong NW Swell', range: '5–10 ft', intensity: 4, note: 'Still powerful NW energy. Occasional windows of clean surf between systems.' },
    tides: { name: 'Spring Tides', high: '5.7 ft', low: '−0.6 ft', note: 'Large range continues. Minus tides shift toward morning — good for early tide pool walks.' },
  },
  march: {
    swell: { name: 'NW Swell Fading', range: '4–8 ft', intensity: 3, note: 'Winter swell season winding down. More consistent windows of cleaner conditions.' },
    tides: { name: 'Morning Minus Tides', high: '5.4 ft', low: '−0.4 ft', note: 'Best morning tide pool access of the year. Lows fall early — arrive at dawn.' },
  },
  april: {
    swell: { name: 'Mixed Swell', range: '3–6 ft', intensity: 3, note: 'Transition month. NW and S swells mix. Calmer mornings, wind picks up by afternoon.' },
    tides: { name: 'Minus Tides at Dawn', high: '5.2 ft', low: '−0.3 ft', note: 'Excellent early morning low tide access. Hidden pools and rocky reefs exposed at sunrise.' },
  },
  may: {
    swell: { name: 'Spring Calm', range: '2–5 ft', intensity: 2, note: 'Ocean settles. Light S swells. Good for kayaking, paddling, and beginner surfing.' },
    tides: { name: 'Minus Tides at Dawn', high: '5.0 ft', low: '−0.2 ft', note: 'Low tides fall at first light. Calm seas make coastal exploration easy.' },
  },
  june: {
    swell: { name: 'Summer Calm', range: '1–3 ft', intensity: 1, note: 'Gentlest ocean of the year. Ideal for beginners, snorkeling, and flat-water paddling.' },
    tides: { name: 'Moderate Range', high: '4.5 ft', low: '0.1 ft', note: 'Predictable rhythm. Morning lows make for easy tide pool access before crowds arrive.' },
  },
  july: {
    swell: { name: 'Summer Calm', range: '1–3 ft', intensity: 1, note: 'Consistent light S swell. Warm water. Best month for calm ocean activities.' },
    tides: { name: 'Moderate Range', high: '4.6 ft', low: '0.2 ft', note: 'Stable, predictable tides. High tide in the morning, low in the afternoon.' },
  },
  august: {
    swell: { name: 'S Swell Season', range: '2–5 ft', intensity: 2, note: 'Southern hemisphere storms send occasional long-period swells. Fun for all levels.' },
    tides: { name: 'Moderate Range', high: '4.8 ft', low: '0.0 ft', note: 'Range building through the month. Afternoon lows best for beach exploration.' },
  },
  september: {
    swell: { name: 'Swell Building', range: '3–6 ft', intensity: 3, note: 'NW swell season begins. First powerful sets of autumn. Mornings tend to be cleanest.' },
    tides: { name: 'Tides Building', high: '5.1 ft', low: '−0.3 ft', note: 'Range increasing. Minus tides return to late afternoon. Coastal access improves.' },
  },
  october: {
    swell: { name: 'NW Swell Arrives', range: '4–8 ft', intensity: 3, note: 'Autumn swells arrive with force. Consistent NW energy. Best for intermediate to advanced surfers.' },
    tides: { name: 'Tides Strengthening', high: '5.4 ft', low: '−0.6 ft', note: 'Strong tidal swings return. Low tides at dusk begin to expose rocky reefs and tide pools.' },
  },
  november: {
    swell: { name: 'NW Swell Season', range: '4–8 ft', intensity: 3, note: 'Powerful NW sets. First serious swell month. Experienced surfers. Cleanest in the morning.' },
    tides: { name: 'King Tides', high: '5.8 ft', low: '−0.8 ft', note: 'Largest swings of the year begin. Minus tides at dusk expose hidden tide pools and sea caves.' },
  },
  december: {
    swell: { name: 'Peak NW Swell', range: '6–12 ft', intensity: 5, note: 'Biggest swells of the year. Powerful and unpredictable. Experienced surfers only.' },
    tides: { name: 'King Tides', high: '6.0 ft', low: '−1.0 ft', note: 'Extreme tidal range. Dramatic high tides flood beaches. Extraordinary minus tides at low.' },
  },
};

function SwellIntensityBar({ intensity }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          height: 7, flex: 1, borderRadius: 1,
          background: i <= intensity
            ? `rgba(122,174,200,${0.4 + (i / intensity) * 0.5})`
            : 'rgba(122,174,200,0.12)',
        }} />
      ))}
    </div>
  );
}

// Moon phase emojis for the pill display
const MOON_EMOJI = {
  'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓',
  'Waxing Gibbous': '🌔', 'Full Moon': '🌕', 'Waning Gibbous': '🌖',
  'Last Quarter': '🌗', 'Waning Crescent': '🌘',
};

function CelestialSnapshot({ snapshot, celestial, weather, month, destination }) {
  const [skySeasonOpen, setSkySeasonOpen] = useState(true);

  // Resolve data
  const avgHigh   = snapshot?.avgHigh ?? (weather?.length > 0 ? Math.round(weather.map(d=>d.high).reduce((a,b)=>a+b,0)/weather.length) : null);
  const avgLow    = snapshot?.avgLow  ?? (weather?.length > 0 ? Math.round(weather.map(d=>d.low).reduce((a,b)=>a+b,0)/weather.length) : null);
  const sunrise   = snapshot?.sunrise ?? celestial?.days?.[0]?.sunrise ?? null;
  const sunset    = snapshot?.sunset  ?? celestial?.days?.[0]?.sunset  ?? null;
  const stargazing = snapshot?.stargazing ?? celestial?.moonPhase?.stargazing ?? null;

  const monthKey  = (month || '').toLowerCase();
  const monthData = CELESTIAL_BY_MONTH[monthKey] ?? CELESTIAL_BY_MONTH['september'];

  const COASTAL_DESTINATIONS = ['big-sur', 'kauai', 'olympic-peninsula', 'vancouver-island'];
  const isCoastal = COASTAL_DESTINATIONS.includes((destination || '').toLowerCase());
  const oceanData = isCoastal ? (OCEAN_BY_MONTH[monthKey] ?? OCEAN_BY_MONTH['september']) : null;
  const { sky, events } = monthData;

  // Split events into categories
  const moonEvents = events.filter(ev =>
    ev.name.toLowerCase().includes('moon') ||
    ev.name.toLowerCase().includes('lunar')
  );
  const starEvents = events.filter(ev =>
    !ev.name.toLowerCase().includes('moon') &&
    !ev.name.toLowerCase().includes('lunar') &&
    (ev.icon === '🌠' || ev.icon === '🌌' || ev.icon === '⭐' ||
     ev.name.toLowerCase().includes('milky') ||
     ev.name.toLowerCase().includes('meteor') ||
     ev.name.toLowerCase().includes('perseids') ||
     ev.name.toLowerCase().includes('leonids') ||
     ev.name.toLowerCase().includes('geminids') ||
     ev.name.toLowerCase().includes('orionid'))
  );
  const seasonEvents = events.filter(ev =>
    !moonEvents.includes(ev) && !starEvents.includes(ev)
  );

  // Daylight duration
  const daylightHours = (() => {
    if (!sunrise || !sunset) return null;
    try {
      const parseTime = (t) => {
        const [time, period] = t.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'pm' && h !== 12) h += 12;
        if (period === 'am' && h === 12) h = 0;
        return h * 60 + m;
      };
      const mins = parseTime(sunset) - parseTime(sunrise);
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}m`;
    } catch { return null; }
  })();

  const eyebrowCls = 'font-body text-[9px] font-bold tracking-[0.22em] uppercase mb-2';
const eyebrow = { color: `${C.sage}88` };

  // Don't render if truly nothing
  if (!sky && !snapshot?.seasonalNote) return null;

  return (
    <div style={{
      ...CARD_STYLE,
      overflow: 'hidden',
      marginBottom: 24,
    }}>
      {/* 1. Sky name */}
      <div style={{ padding: '18px 20px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div className="font-body text-[9px] font-bold tracking-[0.24em] uppercase" style={{ color: `${C.sage}88` }}>
            Sky & Season · {MONTH_LABELS[monthKey] || monthKey}
          </div>
          <button
            onClick={() => setSkySeasonOpen(o => !o)}
            aria-label={skySeasonOpen ? 'Collapse Sky & Season' : 'Expand Sky & Season'}
            style={{ background: 'none', border: 'none', padding: 4, margin: -4, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
              stroke={C.sage} strokeWidth="1.5" strokeLinecap="round"
              style={{ transform: skySeasonOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.35s ease' }}>
              <polyline points="4.5,6 8,9.5 11.5,6" />
            </svg>
          </button>
        </div>
        <div className="font-serif text-[24px] font-light leading-[1.1]" style={{ color: C.ink }}>{sky}</div>
      </div>

      {/* 2. Temperature + Sunlight — side by side */}
      {(avgHigh !== null || sunrise) && (
        <div style={{ padding: '14px 20px 13px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: avgHigh !== null && sunrise ? '1fr 1px 1fr' : '1fr', gap: '0 16px', alignItems: 'start' }}>
            {avgHigh !== null && (
              <div>
                <div className={eyebrowCls} style={eyebrow}>Temperature</div>
                <div style={{ height: 3, borderRadius: 2, background: 'linear-gradient(to right, #7aaec8, #D4A853, #E8856A)', marginBottom: 6 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div className="font-serif text-[20px] font-light leading-none" style={{ color: '#7aaec8' }}>{avgLow}°</div>
                    <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>low</div>
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(26,37,48,0.3)' }}>avg</div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-serif text-[20px] font-light leading-none" style={{ color: '#E8856A' }}>{avgHigh}°</div>
                    <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>high</div>
                  </div>
                </div>
              </div>
            )}
            {avgHigh !== null && sunrise && (
              <div style={{ width: 1, background: C.border, marginTop: 18, alignSelf: 'stretch' }} />
            )}
            {sunrise && (
              <div>
                <div className={eyebrowCls} style={eyebrow}>Sunlight</div>
                <svg width="100%" height="32" viewBox="0 0 140 32" fill="none" style={{ display: 'block', marginBottom: 4 }}>
                  <path d="M10 28 Q70 3 130 28" stroke="rgba(212,168,83,0.12)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <path d="M10 28 Q70 3 130 28" stroke="rgba(212,168,83,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <circle cx="10" cy="28" r="2.5" fill="rgba(212,168,83,0.85)"/>
                  <circle cx="130" cy="28" r="2.5" fill="rgba(212,168,83,0.35)"/>
                  <circle cx="70" cy="3" r="1.8" fill="rgba(212,168,83,0.25)"/>
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.ink, lineHeight: 1 }}>{sunrise}</div>
                    <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>sunrise</div>
                  </div>
                  {sunrise && sunset && daylightHours && (
                    <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(26,37,48,0.32)' }}>
                      {daylightHours}
                    </div>
                  )}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(26,37,48,0.5)', lineHeight: 1 }}>{sunset}</div>
                    <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>sunset</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3–5: collapsible detail sections */}
      {skySeasonOpen && (moonEvents.length > 0 || starEvents.length > 0) && (
        <div style={{ padding: '14px 20px 13px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: moonEvents.length > 0 && starEvents.length > 0 ? '1fr 1px 1fr' : '1fr', gap: '0 16px', alignItems: 'start' }}>
            {moonEvents.length > 0 && (
              <div>
                <div className={eyebrowCls} style={eyebrow}>Moon</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {moonEvents.map((ev, i) => {
                    const isFull = ev.name.toLowerCase().includes('full');
                    const iconFill = isFull ? 'rgba(212,168,83,0.35)' : 'rgba(26,37,48,0.12)';
                    const iconStroke = isFull ? 'rgba(212,168,83,0.5)' : 'rgba(26,37,48,0.2)';
                    return (
                      <div key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" fill={iconFill} stroke={iconStroke} strokeWidth="1.2"/>
                          </svg>
                          <span className="font-serif text-[15px] font-normal" style={{ color: C.ink }}>{ev.name}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: C.amber }}>{ev.date}</span>
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.55, paddingLeft: 22 }}>{ev.note}</div>
                      </div>
                    );
                  })}
                  {stargazing && <div style={{ fontSize: 11, color: C.muted, paddingLeft: 22, marginTop: 4 }}>{stargazing}</div>}
                </div>
              </div>
            )}
            {moonEvents.length > 0 && starEvents.length > 0 && (
              <div style={{ width: 1, background: C.border, marginTop: 18, alignSelf: 'stretch' }} />
            )}
            {starEvents.length > 0 && (
              <div>
                <div className={eyebrowCls} style={eyebrow}>Stars</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {starEvents.map((ev, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span className="font-serif text-[15px] font-normal" style={{ color: C.ink }}>{ev.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: C.amber }}>{ev.date}</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.55 }}>{ev.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Ocean (coastal destinations only) */}
      {skySeasonOpen && isCoastal && oceanData && (
        <div style={{ padding: '14px 20px 13px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 16px', alignItems: 'start' }}>

            {/* Swell */}
            <div>
              <div className="font-body text-[9px] font-bold tracking-[0.22em] uppercase mb-[10px]" style={{ color: `${C.sage}88` }}>Swell</div>
              <div className="font-serif text-[15px] font-normal mb-1.5" style={{ color: C.ink }}>{oceanData.swell.name}</div>
              <SwellIntensityBar intensity={oceanData.swell.intensity} />
              <div className="font-body text-[9px] mb-1.5" style={{ color: C.muted }}>{oceanData.swell.range} typical</div>
              <div style={{ height: 1, background: 'rgba(28,28,26,0.05)', marginBottom: 6 }} />
              <div className="font-body text-[11px] leading-[1.6]" style={{ color: C.muted }}>{oceanData.swell.note}</div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, background: C.border, marginTop: 18, alignSelf: 'stretch' }} />

            {/* Tides */}
            <div>
              <div className="font-body text-[9px] font-bold tracking-[0.22em] uppercase mb-[10px]" style={{ color: `${C.sage}88` }}>Tides</div>
              <div className="font-serif text-[15px] font-normal mb-1.5" style={{ color: C.ink }}>{oceanData.tides.name}</div>
              <div style={{ position: 'relative', height: 7, borderRadius: 4, background: 'rgba(122,174,200,0.12)', marginBottom: 4 }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, height: 7, borderRadius: 4,
                  width: `${Math.min(95, Math.max(30, (parseFloat(oceanData.tides.high) / 7) * 100))}%`,
                  background: 'linear-gradient(to right, rgba(122,174,200,0.25), rgba(122,174,200,0.65))',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div className="font-body text-[9px]" style={{ color: 'rgba(122,174,200,0.55)' }}>{oceanData.tides.low}</div>
                <div className="font-body text-[9px] font-semibold" style={{ color: '#7aaec8' }}>{oceanData.tides.high}</div>
              </div>
              <div style={{ height: 1, background: 'rgba(28,28,26,0.05)', marginBottom: 6 }} />
              <div className="font-body text-[11px] leading-[1.6]" style={{ color: C.muted }}>{oceanData.tides.note}</div>
            </div>

          </div>
        </div>
      )}

      {/* 5. Season */}
      {skySeasonOpen && seasonEvents.length > 0 && (
        <div style={{ padding: '14px 20px 12px', borderBottom: `1px solid ${C.border}` }}>
          <div className={eyebrowCls} style={eyebrow}>Season</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {seasonEvents.map((ev, i) => (
              <div key={i}>
                {i > 0 && <div style={{ height: 1, background: 'rgba(28,28,26,0.05)', marginBottom: 8 }} />}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="font-serif text-[15px] font-normal min-w-[110px]" style={{ color: C.ink }}>{ev.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: C.amber, minWidth: 36 }}>{ev.date}</span>
                  <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{ev.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Pack */}
      {skySeasonOpen && snapshot?.packingHint && (
        <div style={{ padding: '11px 20px', display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span className="font-body text-[9px] font-bold tracking-[0.18em] uppercase shrink-0" style={{ color: C.muted }}>Pack</span>
          <span className="font-body text-[12px] leading-[1.6]" style={{ color: 'rgba(26,37,48,0.55)' }}>{snapshot.packingHint}</span>
        </div>
      )}
    </div>
  );
}


/* ── Trip Profile Summary ─ shows user's selections so they feel heard ── */

const INTENTION_LABELS = { reconnect: 'Reconnect', tune_in: 'Tune In', slow_down: 'Slow Down', light_up: 'Light Up' };
const PRACTICE_LABELS = { yoga: 'Yoga', breathwork: 'Breathwork', coldPlunge: 'Cold Plunge', meditation: 'Meditation', hiking: 'Hiking', stargazing: 'Stargazing', localFarms: 'Local Farms', soundBath: 'Sound Bath', sauna: 'Sauna', service: 'Service', plantMedicine: 'Plant Medicine', massage: 'Massage' };
const BUDGET_LABELS = { mindful: 'Mindful', balanced: 'Balanced', premium: 'Premium', noLimits: 'No Limits' };
const MONTH_LABELS = { january: 'January', february: 'February', march: 'March', april: 'April', may: 'May', june: 'June', july: 'July', august: 'August', september: 'September', october: 'October', november: 'November', december: 'December' };

function TripProfileSummary({ formData }) {
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const chips = [];

  if (formData.month) chips.push(MONTH_LABELS[formData.month] || formData.month);
  if (formData.duration) chips.push(`${formData.duration} days`);
  if (formData.budget) chips.push(BUDGET_LABELS[formData.budget] || formData.budget);
  if (formData.intentions?.length > 0) {
    formData.intentions.forEach(id => {
      if (INTENTION_LABELS[id]) chips.push(INTENTION_LABELS[id]);
    });
  }
  const pacing = formData.pacing ?? 50;
  chips.push(pacing < 25 ? 'Spacious pace' : pacing < 50 ? 'Unhurried pace' : pacing < 75 ? 'Balanced pace' : 'Full pace');
  if (formData.practices?.length > 0) {
    formData.practices.forEach(id => {
      if (PRACTICE_LABELS[id]) chips.push(PRACTICE_LABELS[id]);
    });
  }

  if (chips.length === 0) return null;

  const VISIBLE_COUNT = 3;
  const visibleChips = tagsExpanded ? chips : chips.slice(0, VISIBLE_COUNT);
  const hiddenCount = chips.length - VISIBLE_COUNT;

  const pillStyle = {
    color: C.body, background: C.white, border: `1px solid ${C.border}`,
    borderRadius: 20, padding: '4px 12px',
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', paddingBottom: 20, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mr-1" style={{ color: C.muted }}>Built for you</span>
      {visibleChips.map((chip, i) => (
        <span key={i} className="font-body text-[12px] font-medium whitespace-nowrap" style={pillStyle}>{chip}</span>
      ))}
      {!tagsExpanded && hiddenCount > 0 && (
        <span
          onClick={() => setTagsExpanded(true)}
          className="font-body text-[12px] font-medium whitespace-nowrap"
          style={{ ...pillStyle, cursor: 'pointer', borderStyle: 'dashed', color: C.muted }}
        >
          + {hiddenCount} more
        </span>
      )}
      {tagsExpanded && chips.length > VISIBLE_COUNT && (
        <span
          onClick={() => setTagsExpanded(false)}
          className="font-body text-[12px] font-medium whitespace-nowrap"
          style={{ ...pillStyle, cursor: 'pointer', borderStyle: 'dashed', color: C.muted }}
        >
          Show less
        </span>
      )}
    </div>
  );
}



/* ── trail components ─────────────────────────────────────────────────── */

const DIFFICULTY_CONFIG = {
  easy:      { label: 'Easy',      color: C.seaGlass,    segments: 1 },
  moderate:  { label: 'Moderate',  color: C.goldenAmber, segments: 2 },
  strenuous: { label: 'Strenuous', color: C.sunSalmon,   segments: 3 },
};

function DifficultyBar({ difficulty = 'moderate' }) {
  const key = difficulty.toLowerCase();
  const cfg = DIFFICULTY_CONFIG[key] || DIFFICULTY_CONFIG.moderate;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            width: 18, height: 5,
            borderRadius: 2,
            background: i <= cfg.segments ? cfg.color : `${C.sage}15`,
            transition: 'background 0.2s',
          }} />
        ))}
      </div>
      <span className="font-body text-[11px] font-bold tracking-[0.06em] capitalize" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

function TrailStatChip({ icon, label, value, accent }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '5px 10px',
      background: accent ? `${accent}0a` : `${C.sage}06`,
      border: `1px solid ${accent ? `${accent}18` : `${C.sage}12`}`,
      borderRadius: 2,
      flexShrink: 0,
    }}>
      {icon}
      <div>
        <div className="font-body text-[10px] font-bold tracking-[0.1em] uppercase leading-none mb-0.5" style={{ color: `${C.sage}99` }}>
          {label}
        </div>
        <div className="font-body text-[13px] font-bold leading-none" style={{ color: accent || C.ink }}>
          {value}
        </div>
      </div>
    </div>
  );
}


/* ── inline pick ───────────────────────────────────────────────────────── */

function MetaChip({ label, color }) {
  return (
    <span className="font-body text-[11px] font-semibold tracking-[0.04em] whitespace-nowrap" style={{
      color: color || C.muted,
      background: color ? `${color}12` : `${C.sage}0c`,
      border: `1px solid ${color ? `${color}25` : `${C.sage}18`}`,
      borderRadius: 3,
      padding: '2px 7px',
    }}>
      {label}
    </span>
  );
}

function MetaStrip({ category, pick, color }) {
  const chips = [];

  if (category === 'stay') {
    if (pick.priceRange)       chips.push({ label: pick.priceRange, accent: true });
    if (pick.stayType)         chips.push({ label: pick.stayType });
    if (pick.distanceFromPark) chips.push({ label: pick.distanceFromPark });
  } else if (category === 'eat') {
    if (pick.cuisine)    chips.push({ label: pick.cuisine, accent: true });
    if (pick.priceRange) chips.push({ label: pick.priceRange });
    if (pick.bestFor)    chips.push({ label: `Best for: ${pick.bestFor}` });
  } else if (category === 'wellness') {
    if (pick.duration)      chips.push({ label: pick.duration, accent: true });
    if (pick.difficulty)    chips.push({ label: pick.difficulty });
    if (pick.bestTimeOfDay) chips.push({ label: pick.bestTimeOfDay });
  } else if (category === 'gear') {
    if (pick.priceRange)  chips.push({ label: pick.priceRange, accent: true });
    if (pick.whereToGet)  chips.push({ label: pick.whereToGet });
  }

  if (!chips.length) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
      {chips.map((c, i) => (
        <MetaChip key={i} label={c.label} color={c.accent ? color : null} />
      ))}
    </div>
  );
}


/* ── isCuratable — determines which activities get action buttons ────── */

const NON_CURATABLE_TYPES = ['logistics', 'transit', 'accommodation', 'checkin', 'checkout', 'travel'];

function isCuratable(activity) {
  const typeStr = (activity.activityType || activity.type || '').toLowerCase();
  if (NON_CURATABLE_TYPES.some(t => typeStr.includes(t))) return false;
  // Exclude common logistics patterns by title
  if (/\b(check.?in|check.?out|pack|depart|arrive|drive to|travel to|open time|free time|settle in)\b/i.test(activity.title || '')) return false;
  return true;
}

/* ── SwapIcon — inline SVG refresh/swap icon ──────────────────────────── */

const SwapIcon = ({ size = 12, color = C.oceanTeal }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 8a5.5 5.5 0 0 1 9.5-3.5" /><path d="M13.5 8a5.5 5.5 0 0 1-9.5 3.5" />
    <polyline points="12,1 12,5 8,5" /><polyline points="4,15 4,11 8,11" />
  </svg>
);

/* ── ActivityActions — Lock This In + Show Alternatives ───────────────── */

function ActivityActions({ id, lockedItems, onLock, onAlternatives }) {
  const lockEntry = lockedItems?.[id];
  const isLocked = !!lockEntry;

  return (
    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 6, marginBottom: 12 }}>
      {isLocked ? (
        lockEntry.source === 'user' && (
          <button onClick={e => { e.stopPropagation(); onLock(id); }} className="font-body text-[11px] font-medium flex items-center gap-1 bg-transparent border-none cursor-pointer p-0" style={{
            color: C.muted, WebkitTapHighlightColor: 'transparent',
          }}>
            <UnlockIcon size={11} color={C.muted} />
            <span>Unlock</span>
          </button>
        )
      ) : (
        <>
          <button onClick={e => { e.stopPropagation(); onLock(id); }} className="font-body text-[11px] font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer p-0" style={{
            color: C.goldenAmber, WebkitTapHighlightColor: 'transparent',
          }}>
            <LockIcon size={11} color={C.goldenAmber} />
            <span>Lock this in</span>
          </button>
          <span className="font-body text-[11px] mx-2" style={{ color: C.muted }}>|</span>
          <button onClick={e => { e.stopPropagation(); onAlternatives(id); }} className="font-body text-[11px] font-semibold flex items-center gap-1 bg-transparent border-none cursor-pointer p-0" style={{
            color: C.sage, WebkitTapHighlightColor: 'transparent',
          }}>
            <SwapIcon size={11} color={C.sage} />
            <span>Show alternatives</span>
          </button>
        </>
      )}
    </div>
  );
}

/* ── lockedTint — background tint for locked items ───────────────────── */

function lockedTint(lockedItems, id) {
  if (lockedItems?.[id]) return 'rgba(200,148,26,0.04)';
  return null;
}


/* ── useIsDesktop hook ─────────────────────────────────────────────────── */

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

/* ── useIsMobile hook ──────────────────────────────────────────────────── */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

/* ── companion panel content (shared between SidePanel & BottomSheet) ── */

function CompanionPanelContent({ type, data, id }) {
  if (!data) return null;
  const isTeaching = type === 'teaching';
  const accent = isTeaching ? C.goldenAmber : C.seaGlass;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
      {/* Type badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${accent}0e`, border: `1px solid ${accent}18`, marginBottom: 10 }}>
        {isTeaching ? <TeachingIcon size={11} color={accent} /> : <PracticeIconSimple size={11} color={accent} />}
        <span className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: accent }}>{isTeaching ? "Today's Teaching" : "Today's Practice"}</span>
      </div>

      {/* Tradition */}
      {data.tradition && (
        <div className="font-body text-[11px] font-medium mb-1.5" style={{ color: C.muted }}>{data.tradition} tradition</div>
      )}

      {/* Title */}
      <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-1" style={{ color: C.ink }}>{data.title}</h1>

      {/* Summary / essence */}
      <p className="font-body text-[14px] leading-[1.7] mb-5" style={{ color: C.body }}>{isTeaching ? data.essence : data.description}</p>

      {/* Deeper content */}
      {data.deeper && (
        <p className="font-body text-[14px] leading-[1.7] mb-5" style={{ color: C.body }}>{data.deeper}</p>
      )}

      {/* Quote */}
      {data.quote?.text && (
        <div style={{
          borderLeft: `3px solid ${BrandC.goldenAmber}60`,
          paddingLeft: 16,
          marginTop: 20,
          marginBottom: 24,
          padding: '14px 0 14px 16px',
        }}>
          <p className="font-body text-[16px] font-medium leading-[1.65] tracking-[-0.01em] m-0" style={{
            fontStyle: 'normal', color: `${C.ink}CC`,
          }}>{data.quote.text}</p>
          <p className="font-body text-[12px] font-semibold tracking-[0.02em] mt-2" style={{
            color: `${C.ink}66`,
          }}>— {data.quote.author || data.quote.source}{data.quote.role ? `, ${data.quote.role}` : ''}</p>
        </div>
      )}

      {/* Practice-specific: duration, when, howTo */}
      {!isTeaching && (data.duration || data.when || data.howTo) && (
        <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.sage}12`, padding: '13px 15px', marginBottom: 20 }}>
          {data.duration && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: (data.when || data.howTo) ? 10 : 0 }}>
              <ClockIcon size={12} color={C.seaGlass} />
              <div>
                <div className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase mb-px" style={{ color: C.muted }}>Duration</div>
                <div className="font-body text-[14px] font-medium" style={{ color: C.ink }}>{data.duration}</div>
              </div>
            </div>
          )}
          {data.when && (
            <div style={{ borderTop: data.duration ? `1px solid ${C.sage}08` : 'none', paddingTop: data.duration ? 10 : 0, marginBottom: data.howTo ? 10 : 0 }}>
              <div className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase mb-px" style={{ color: C.muted }}>When</div>
              <div className="font-body text-[14px] font-medium leading-[1.45]" style={{ color: C.body }}>{data.when}</div>
            </div>
          )}
          {data.howTo && (
            <div style={{ borderTop: (data.duration || data.when) ? `1px solid ${C.sage}08` : 'none', paddingTop: (data.duration || data.when) ? 10 : 0 }}>
              <div className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase mb-[3px]" style={{ color: C.muted }}>How To</div>
              <div className="font-body text-[14px] font-normal leading-[1.6]" style={{ color: C.body }}>{data.howTo}</div>
            </div>
          )}
        </div>
      )}

      {/* Sources */}
      {data.sources && data.sources.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase mb-2" style={{ color: C.muted }}>Sources</div>
          {data.sources.map((s, i) => (
            <div key={i} className="font-body text-[13px] leading-[1.5] mb-1" style={{ color: C.body }}>
              {s.author && <span style={{ fontWeight: 600 }}>{s.author}</span>}
              {s.author && s.text && ', '}
              {s.text && <em>{s.text}</em>}
              {s.section && ` (${s.section})`}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

/* ── trail detail content ──────────────────────────────────────────────── */

function TrailDetailContent({ data, thumbId, lockedItems, onLock, onAlternatives }) {
  const { title, time, summary, details, trailData = {}, url } = data;
  const resolvedUrl = url || trailData.npsUrl || lookupUrl(title);

  // Consistent label style used throughout
  const labelCls = 'font-body text-[10px] font-semibold tracking-[0.1em] uppercase';
const labelStyle = { color: C.muted };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>

      {/* Trail badge + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}08`, border: `1px solid ${C.teal}18` }}>
          <MountainIcon size={12} color={C.teal} />
          <span className={labelCls} style={{ color: C.teal }}>Trail</span>
        </div>
        {time && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}06`, border: `1px solid ${C.teal}12` }}>
            <ClockIcon size={10} color={C.muted} />
            <span className="font-body text-[11px] font-medium" style={{ color: C.body }}>{time}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.2] mb-1" style={{ color: C.ink }}>
        {resolvedUrl ? (
          <a href={resolvedUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${C.teal}30` }}>
            {title}
          </a>
        ) : title}
      </h1>

      {/* Activity actions */}
      <ActivityActions id={thumbId} lockedItems={lockedItems} onLock={onLock} onAlternatives={onAlternatives} />

      {/* Summary */}
      <p className="font-body text-[14px] leading-[1.7] mb-4" style={{ color: C.body }}>{summary}</p>

      {/* STAT GRID */}
      {(trailData.distance || trailData.elevationGain || trailData.trailType || trailData.difficulty) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
          marginBottom: 16,
        }}>
          {trailData.distance && (
            <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <div className={labelCls + ' mb-1'} style={labelStyle}>Distance</div>
              <div className="font-body text-[14px] font-medium" style={{ color: C.ink }}>{trailData.distance}</div>
            </div>
          )}
          {trailData.elevationGain && (
            <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <div className={labelCls + ' mb-1'} style={labelStyle}>Elevation</div>
              <div className="font-body text-[14px] font-medium" style={{ color: C.ink }}>{trailData.elevationGain}</div>
            </div>
          )}
          {trailData.trailType && (
            <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <div className={labelCls + ' mb-1'} style={labelStyle}>Route Type</div>
              <div className="font-body text-[14px] font-medium capitalize" style={{ color: C.ink }}>{trailData.trailType}</div>
            </div>
          )}
          {trailData.difficulty && (
            <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <div style={{ ...labelStyle, marginBottom: 6 }}>Difficulty</div>
              <DifficultyBar difficulty={trailData.difficulty} />
            </div>
          )}
        </div>
      )}

      {/* TRAIL INFO — permit, trailhead, best time, conditions in a unified card */}
      {(trailData.permitRequired !== undefined || trailData.trailheadAccess || trailData.bestStartTime || trailData.conditions) && (
        <div style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
          overflow: 'hidden', marginBottom: 16,
        }}>
          {/* Permit */}
          {trailData.permitRequired && (
            <div style={{
              padding: '10px 14px',
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'flex-start', gap: 8,
            }}>
              <PermitIcon size={13} color={C.amber} />
              <div>
                <div className={labelCls + ' mb-0.5'} style={{ color: C.amber }}>Permit Required</div>
                {trailData.permitNote && (
                  <div className="font-body text-[13px] leading-[1.5]" style={{ color: C.body }}>{trailData.permitNote}</div>
                )}
              </div>
            </div>
          )}

          {/* No-permit note */}
          {trailData.permitRequired === false && trailData.permitNote && (
            <div style={{
              padding: '10px 14px',
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CheckIcon size={12} color={C.sea} />
              <span className="font-body text-[13px] leading-[1.5]" style={{ color: C.body }}>{trailData.permitNote}</span>
            </div>
          )}

          {/* Trailhead Access */}
          {trailData.trailheadAccess && (
            <div style={{
              padding: '10px 14px',
              borderBottom: (trailData.bestStartTime || trailData.conditions) ? `1px solid ${C.border}` : 'none',
            }}>
              <div className={labelCls + ' mb-[3px]'} style={labelStyle}>Trailhead Access</div>
              <div className="font-body text-[13px] leading-[1.5]" style={{ color: C.body }}>{trailData.trailheadAccess}</div>
            </div>
          )}

          {/* Best Start Time */}
          {trailData.bestStartTime && (
            <div style={{
              padding: '10px 14px',
              borderBottom: trailData.conditions ? `1px solid ${C.border}` : 'none',
            }}>
              <div className={labelCls + ' mb-[3px]'} style={labelStyle}>Best Start Time</div>
              <div className="font-body text-[13px] leading-[1.5]" style={{ color: C.body }}>{trailData.bestStartTime}</div>
            </div>
          )}

          {/* Conditions */}
          {trailData.conditions && (
            <div style={{ padding: '10px 14px' }}>
              <div className={labelCls + ' mb-[3px]'} style={labelStyle}>Trail Conditions</div>
              <div className="font-body text-[13px] leading-[1.5]" style={{ color: C.body }}>{trailData.conditions}</div>
            </div>
          )}
        </div>
      )}

      {/* Freeform details */}
      {details && (
        <div className="font-body text-[14px] leading-[1.7] mb-4" style={{ color: C.body }}>
          {renderInlineBlock(details)}
        </div>
      )}

      {/* NPS disclaimer + CTA */}
      {resolvedUrl && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
            <ExternalLinkIcon size={9} color={C.muted} />
            <span className="font-body text-[11px] font-medium leading-[1.4]" style={{ color: C.muted }}>
              Trail info sourced from NPS. Verify conditions before your visit.
            </span>
          </div>
          <a href={resolvedUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => trackEvent('external_link_clicked', { name: title, url: resolvedUrl, link_type: 'trail_nps' })}
            className="font-body text-[12px] font-semibold no-underline inline-flex items-center gap-1.5" style={{
              color: C.teal,
              padding: '7px 14px',
              border: `1px solid ${C.teal}25`,
              background: `${C.teal}06`,
              borderRadius: 20,
            }}>
            View NPS Trail Guide
            <ExternalLinkIcon size={10} color={C.teal} />
          </a>
        </div>
      )}

    </div>
  );
}

/* ── DetailPanel (unified side panel / bottom sheet) ───────────────────── */

function DetailBlock({ category, pick, color }) {
  const rows = [];

  if (category === 'stay') {
    if (pick.stayType)         rows.push(['Type',      pick.stayType]);
    if (pick.priceRange)       rows.push(['Price',     pick.priceRange]);
    if (pick.distanceFromPark) rows.push(['Distance',  pick.distanceFromPark]);
  } else if (category === 'eat') {
    if (pick.cuisine)    rows.push(['Cuisine',  pick.cuisine]);
    if (pick.priceRange) rows.push(['Price',    pick.priceRange]);
    if (pick.bestFor)    rows.push(['Best for', pick.bestFor]);
  } else if (category === 'wellness') {
    if (pick.duration)      rows.push(['Duration',  pick.duration]);
    if (pick.difficulty)    rows.push(['Level',     pick.difficulty]);
    if (pick.bestTimeOfDay) rows.push(['Best time', pick.bestTimeOfDay]);
  } else if (category === 'gear') {
    if (pick.priceRange)  rows.push(['Price range',  pick.priceRange]);
    if (pick.whereToGet)  rows.push(['Where to get', pick.whereToGet]);
  }

  if (!rows.length) return null;

  return (
    <div style={{
      border: `1px solid ${color}18`,
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 20,
      background: `${color}04`,
    }}>
      {rows.map(([label, value], i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'baseline',
          padding: '10px 14px', gap: 12,
          borderBottom: i < rows.length - 1 ? `1px solid ${color}10` : 'none',
        }}>
          <span className="font-body text-[11px] font-bold tracking-[0.1em] uppercase min-w-[90px] shrink-0" style={{ color: C.muted }}>
            {label}
          </span>
          <span className="font-body text-[14px] font-medium" style={{ color: C.ink }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── wisdom detail content — for the detail sheet ─────────────────────── */

function WisdomDetailContent({ entry }) {
  if (!entry) return null;
  const tradition = TRADITIONS[entry.tradition];
  const accent = tradition?.color || C.sage;
  const glyph = TRADITION_GLYPHS[entry.tradition] || '◈';
  const typeLabel = entry.type === 'ceremony' ? 'Ceremony'
    : entry.type === 'practice' ? 'Practice'
    : 'Teaching';

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      {/* Tinted header with watermark glyph */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        padding: '18px 20px 16px',
        background: `linear-gradient(180deg, ${accent}12, ${accent}06)`,
      }}>
        {/* Watermark glyph */}
        <span style={{
          position: 'absolute', top: -10, right: -5,
          fontSize: 100, lineHeight: 1, opacity: 0.06,
          pointerEvents: 'none', userSelect: 'none',
        }}>{glyph}</span>

        {/* Type pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 11px', borderRadius: 20,
          background: `${accent}14`, border: `1px solid ${accent}25`,
          marginBottom: 12,
        }}>
          <span className="font-body text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: accent }}>{typeLabel}</span>
        </div>

        {/* Tradition subtitle */}
        <div className="font-body text-[11px] font-medium mb-1.5" style={{ color: C.muted }}>{tradition?.name || entry.tradition}</div>

        {/* Title */}
        <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] m-0" style={{ color: C.ink }}>{entry.name}</h1>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 60px' }}>
        {/* Summary */}
        <p className="font-body text-[14px] leading-[1.7] mb-5" style={{ color: C.body }}>{entry.summary}</p>

        {/* Deeper */}
        {entry.deeper && (
          <p className="font-body text-[14px] leading-[1.7] mb-5" style={{ color: C.body }}>{entry.deeper}</p>
        )}

        {/* Quote block */}
        {entry.quote?.text && (
          <div style={{
            borderLeft: `2px solid ${BrandC.goldenAmber}4D`,
            paddingLeft: 14,
            marginTop: 18,
            marginBottom: 20,
          }}>
            <p className="font-serif text-[15px] font-light italic leading-[1.6] m-0" style={{
              color: `${C.ink}A6`,
            }}>{entry.quote.text}</p>
            <p className="font-body text-[11px] font-medium mt-1.5" style={{
              color: `${C.ink}73`,
            }}>— {entry.quote.author || entry.quote.source}{entry.quote.role ? `, ${entry.quote.role}` : ''}</p>
          </div>
        )}

        {/* Practice-specific fields */}
        {entry.type !== 'teaching' && (entry.duration || entry.when || entry.howTo) && (
          <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.sage}12`, padding: '13px 15px', marginBottom: 20 }}>
            {entry.duration && (
              <div style={{ marginBottom: (entry.when || entry.howTo) ? 10 : 0 }}>
                <div className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase mb-px" style={{ color: C.muted }}>Duration</div>
                <div className="font-body text-[14px] font-medium" style={{ color: C.ink }}>{entry.duration}</div>
              </div>
            )}
            {entry.when && (
              <div style={{ borderTop: entry.duration ? `1px solid ${C.sage}08` : 'none', paddingTop: entry.duration ? 10 : 0, marginBottom: entry.howTo ? 10 : 0 }}>
                <div className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase mb-px" style={{ color: C.muted }}>When</div>
                <div className="font-body text-[14px] font-medium leading-[1.45]" style={{ color: C.body }}>{entry.when}</div>
              </div>
            )}
            {entry.howTo && (
              <div style={{ borderTop: (entry.duration || entry.when) ? `1px solid ${C.sage}08` : 'none', paddingTop: (entry.duration || entry.when) ? 10 : 0 }}>
                <div className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase mb-[3px]" style={{ color: C.muted }}>How To</div>
                <div className="font-body text-[14px] font-normal leading-[1.6]" style={{ color: C.body }}>{entry.howTo}</div>
              </div>
            )}
          </div>
        )}

        {/* Attribution */}
        {entry.sources?.[0] && (
          <div className="font-body text-[12px] leading-[1.5]" style={{ color: C.muted }}>
            — {entry.sources[0].author && <span style={{ fontWeight: 600 }}>{entry.sources[0].author}</span>}
            {entry.sources[0].author && entry.sources[0].text && ', '}
            {entry.sources[0].text && <em>{entry.sources[0].text}</em>}
            {entry.sources[0].section && ` (${entry.sources[0].section})`}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailPanelContent({ item, lockedItems, onLock, onAlternatives, alternativesLoading }) {
  if (!item) return null;
  const { type, data, thumbId } = item;

  // Logistics form panels
  if (type === 'flights') {
    return <FlightFormPanel data={item.savedData} logistics={item.logistics} onSave={item.onSave} bookingIndex={item.bookingIndex} highlightFields={item.highlightFields} />;
  }
  if (type === 'rental') {
    return <RentalFormPanel data={item.savedData} logistics={item.logistics} onSave={item.onSave} bookingIndex={item.bookingIndex} highlightFields={item.highlightFields} />;
  }
  // Editable accommodation form (user booking) — must come before read-only Lila Pick
  if (type === 'accommodation' && item.onSave) {
    return <AccommodationFormPanel data={item.savedData} onSave={item.onSave} bookingIndex={item.bookingIndex} highlightFields={item.highlightFields} />;
  }
  if (type === 'reservation') {
    return <ReservationFormPanel data={item.savedData} onSave={item.onSave} bookingIndex={item.bookingIndex} />;
  }
  if (type === 'accommodation') {
    const accom = data;
    const s = PICK_STYLES.stay;
    if (item.alternatives === undefined) {
      console.warn(`[DetailPanel] alternatives is undefined for accommodation: ${accom?.name}`);
    }
    const alts = item.alternatives || [];
    const accomLabelCls = 'font-body text-[10px] font-semibold tracking-[0.1em] uppercase';
const accomLabel = { color: C.muted };
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        {/* Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${s.color}0e`, border: `1px solid ${s.color}18` }}>
            <CategoryIcon category="stay" color={s.color} size={12} />
            <span className={accomLabelCls} style={{ color: s.color }}>{s.label}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, border: `1px solid ${s.color}20`, background: `${s.color}04` }}>
            <LilaStar size={9} color={s.color} />
            <span className="font-body text-[9px] font-bold tracking-[0.08em] uppercase" style={{ color: s.color }}>Lila Pick</span>
          </div>
        </div>

        {/* Title + location */}
        <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.2] mb-1" style={{ color: C.ink }}>{accom.name}</h1>
        {accom.location && (
          <div className="font-body text-[12px] font-medium mb-1.5" style={{ color: C.muted }}>{accom.location}</div>
        )}
        {accom.vibe && <div className="font-body text-[13px] font-medium italic leading-[1.4] mb-3.5" style={{ color: C.sage }}>{accom.vibe}</div>}

        {/* Why */}
        <p className="font-body text-[14px] leading-[1.7] mb-4" style={{ color: C.body }}>{accom.why}</p>

        {/* Stat grid — matches trail panel style */}
        {(accom.stayType || accom.priceRange || accom.distanceFromPark) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
            {accom.stayType && (
              <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <div className={accomLabelCls + ' mb-1'} style={accomLabel}>Type</div>
                <div className="font-body text-[14px] font-medium" style={{ color: C.ink }}>{accom.stayType}</div>
              </div>
            )}
            {accom.priceRange && (
              <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <div className={accomLabelCls + ' mb-1'} style={accomLabel}>Price</div>
                <div className="font-body text-[14px] font-medium" style={{ color: C.ink }}>{accom.priceRange}</div>
              </div>
            )}
            {accom.distanceFromPark && (
              <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, gridColumn: 'span 2' }}>
                <div className={accomLabelCls + ' mb-1'} style={accomLabel}>Distance from Park</div>
                <div className="font-body text-[14px] font-medium" style={{ color: C.ink }}>{accom.distanceFromPark}</div>
              </div>
            )}
          </div>
        )}

        {/* Alternatives */}
        {alts.length > 0 ? (
          <div style={{ marginBottom: 20 }}>
            <div className={accomLabelCls + ' mb-2.5'} style={accomLabel}>Other Options</div>
            {alts.map((alt, i) => (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 8, background: C.white, border: `1px solid ${C.border}`, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                  <div className="font-body text-[14px] font-semibold" style={{ color: C.ink }}>{alt.name}</div>
                  {alt.priceRange && (
                    <span className="font-body text-[11px] font-semibold tracking-[0.02em] shrink-0" style={{ color: s.color }}>{alt.priceRange}</span>
                  )}
                </div>
                {alt.vibe && <div className="font-body text-[12px] font-medium italic mb-1.5" style={{ color: C.sage }}>{alt.vibe}</div>}
                <div className="font-body text-[13px] leading-[1.55]" style={{ color: C.body }}>{alt.why}</div>
              </div>
            ))}
          </div>
        ) : alternativesLoading && (
          <div style={{ marginBottom: 20 }}>
            <div className={accomLabelCls + ' mb-2.5'} style={accomLabel}>Other Options</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <div style={{
                width: 14, height: 14, border: `2px solid ${C.sage}30`, borderTopColor: C.sage,
                borderRadius: '50%', animation: 'lila-spin 0.8s linear infinite',
              }} />
              <span className="font-body text-[13px] font-normal" style={{ color: C.muted }}>Loading alternatives...</span>
              </div>
          </div>
        )}
      </div>
    );
  }

  // Wisdom entry (from WisdomBanner)
  if (type === 'wisdom') {
    return <WisdomDetailContent entry={data} />;
  }

  // Companion content (teaching / practice)
  if (type === 'teaching' || type === 'practice') {
    return <CompanionPanelContent type={type} data={data} id={thumbId} />;
  }

  // Mindfulness pick content (from Claude's response)
  if (type === 'mindfulness') {
    const tradition = TRADITIONS[data.tradition];
    const accent = tradition?.color || C.sage;
    const glyph = TRADITION_GLYPHS[data.tradition] || '◈';
    const typeLabel = data.type === 'practice' ? 'Practice' : 'Teaching';

    return (
      <div style={{
        position: 'relative', overflow: 'hidden',
        minHeight: '100%',
        background: 'linear-gradient(150deg, #f5f1ea 0%, #ede9e0 100%)',
      }}>
        <div aria-hidden style={{
          position: 'absolute', top: 0, bottom: 0,
          left: '-40%', width: '180%',
          background: 'linear-gradient(to right, transparent 0%, #dceee9 25%, #e2eeeb 50%, #dceee9 75%, transparent 100%)',
          animation: 'practiceBreath 16s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto', padding: '20px 24px 60px' }}>
          {/* Lotus + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <IconLotus size={38} color="#4A9B9F" />
            <span className="font-body text-[10px] font-bold tracking-[0.22em] uppercase" style={{
              color: '#4A9B9F',
            }}>Mindfulness Practice</span>
          </div>

          {/* Tradition badge + type pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 20,
              background: `${accent}10`, border: `1px solid ${accent}20`,
            }}>
              <span style={{ fontSize: 12, lineHeight: 1 }}>{glyph}</span>
              <span className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase" style={{
                color: accent,
              }}>{tradition?.name || data.tradition}</span>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 9px', borderRadius: 20,
              background: `${accent}08`, border: `1px solid ${accent}15`,
            }}>
              {data.type === 'teaching'
                ? <TeachingIcon size={10} color={accent} />
                : <PracticeIconSimple size={10} color={accent} />}
              <span className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase" style={{
                color: accent,
              }}>{typeLabel}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.3] mb-1.5" style={{
            color: '#1a2530',
          }}>{data.name}</h1>

          {/* Essence */}
          <p className="font-body text-[14px] font-normal leading-[1.7] mb-4" style={{
            color: C.body,
          }}>{data.essence}</p>

          {/* Connection — italic */}
          {data.connection && (
            <p className="font-body text-[14px] font-normal italic leading-[1.6] mb-5" style={{
              color: '#3D5A6B', opacity: 0.8,
            }}>{data.connection}</p>
          )}

          {/* Quote */}
          {data.quote?.text && (
            <div style={{
              borderLeft: `2px solid ${BrandC.goldenAmber}4D`,
              paddingLeft: 14,
              marginTop: 18,
              marginBottom: 20,
            }}>
              <p className="font-serif text-[15px] font-light italic leading-[1.6] m-0" style={{
                color: `${C.ink}A6`,
              }}>{data.quote.text}</p>
              <p className="font-body text-[11px] font-medium mt-1.5" style={{
                color: `${C.ink}73`,
              }}>— {data.quote.author || data.quote.source}{data.quote.role ? `, ${data.quote.role}` : ''}</p>
            </div>
          )}

          {/* How to practice */}
          {data.howTo && (
            <div style={{ marginBottom: 20 }}>
              <div className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase mb-2" style={{
                color: `${accent}cc`,
              }}>How to practice</div>
              <p className="font-body text-[14px] font-normal leading-[1.7] m-0" style={{
                color: C.body,
              }}>{data.howTo}</p>
            </div>
          )}

          {/* Duration */}
          {data.duration && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 20,
              background: `${accent}0a`, border: `1px solid ${accent}18`,
            }}>
              <ClockIcon size={10} color={accent} />
              <span className="font-body text-[12px] font-semibold" style={{
                color: accent,
              }}>{data.duration}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Trail content
  if (type === 'trail') {
    return (
      <TrailDetailContent
        data={data}
        thumbId={thumbId}
        lockedItems={lockedItems}
        onLock={onLock}
        onAlternatives={onAlternatives}
      />
    );
  }

  // Activity content
  if (type === 'activity') {
    const dot = WARM_DOT;
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        {/* Time badge */}
        {data.time && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${dot}0e`, border: `1px solid ${dot}18`, marginBottom: 10 }}>
            <ClockIcon size={10} color={dot} />
            <span className="font-body text-[11px] font-semibold tracking-[0.08em]" style={{ color: dot }}>{data.time}</span>
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-1" style={{ color: C.ink }}>{data.title}</h1>

        <ActivityActions id={thumbId} lockedItems={lockedItems} onLock={onLock} onAlternatives={onAlternatives} />

        {/* Summary */}
        <p className="font-body text-[14px] leading-[1.7] mb-5" style={{ color: C.body }}>{data.summary}</p>

        {/* Details */}
        {data.details && (
          <div className="font-body text-[14px] leading-[1.7] mb-5" style={{ color: C.body, padding: '6px 0', paddingLeft: 13, borderLeft: `3px solid ${dot}30` }}>
            {renderInlineBlock(data.details)}
          </div>
        )}

        {/* Learn more link */}
        {data.url && (
          <a href={data.url} target="_blank" rel="noopener noreferrer"
            onClick={() => trackEvent('external_link_clicked', { name: data.title, url: data.url, link_type: 'activity' })}
            className="font-body text-[13px] font-semibold"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              color: C.oceanTeal, textDecoration: 'none',
              padding: '8px 16px',
              background: `${C.oceanTeal}08`, borderRadius: 20,
              border: `1px solid ${C.oceanTeal}15`,
              marginBottom: 20,
            }}>
            Learn more <ExternalLinkIcon size={10} color={C.oceanTeal} />
          </a>
        )}

      </div>
    );
  }

  // Pick content (stay / eat / gear / wellness)
  const s = PICK_STYLES[type] || PICK_STYLES.stay;
  const alternatives = data.alternatives || [];

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
      {/* Category badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${s.color}0e`, border: `1px solid ${s.color}18` }}>
          <CategoryIcon category={type} color={s.color} size={12} />
          <span className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: s.color }}>{s.label}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, border: `1px solid ${s.color}20`, background: `${s.color}04` }}>
          <LilaStar size={9} color={s.color} />
          <span className="font-body text-[9px] font-bold tracking-[0.08em] uppercase" style={{ color: s.color }}>Lila Pick</span>
        </div>
      </div>

      {/* Pick name */}
      <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-1" style={{ color: C.ink }}>
        <LinkedName name={data.name} url={data.url} linkType="pick" className="font-body" style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }} />
        {(data.url || lookupUrl(data.name)) && <> <ExternalLinkIcon size={12} color={`${C.sage}40`} /></>}
      </h1>

      <ActivityActions id={thumbId} lockedItems={lockedItems} onLock={onLock} onAlternatives={onAlternatives} />

      {/* Vibe line */}
      {data.vibe && (
        <div className="font-body text-[13px] font-medium italic leading-[1.4] mb-3.5" style={{ color: C.sage }}>
          {data.vibe}
        </div>
      )}

      {/* Why */}
      <p className="font-body text-[14px] leading-[1.7] mb-5" style={{ color: C.body }}>{data.why}</p>

      {/* Stat grid */}
      {(() => {
        const gridLabelCls = 'font-body text-[10px] font-semibold tracking-[0.1em] uppercase mb-1';
        const gridLabel = { color: C.muted };
        const gridValueCls = 'font-body text-[14px] font-medium';
        const gridValue = { color: C.ink };
        const tile = { padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 };
        let cells = [];
        if (type === 'stay') {
          if (data.stayType) cells.push({ label: 'Type', value: data.stayType });
          if (data.priceRange) cells.push({ label: 'Price', value: data.priceRange });
          if (data.distanceFromPark) cells.push({ label: 'Distance from Park', value: data.distanceFromPark, span: true });
        } else if (type === 'eat') {
          if (data.cuisine) cells.push({ label: 'Cuisine', value: data.cuisine });
          if (data.priceRange) cells.push({ label: 'Price', value: data.priceRange });
          if (data.bestFor) cells.push({ label: 'Best For', value: data.bestFor, span: true });
        } else if (type === 'gear') {
          if (data.priceRange) cells.push({ label: 'Price Range', value: data.priceRange });
          if (data.whereToGet) cells.push({ label: 'Where to Get', value: data.whereToGet });
        } else if (type === 'wellness') {
          if (data.duration) cells.push({ label: 'Duration', value: data.duration });
          if (data.difficulty) cells.push({ label: 'Level', value: data.difficulty });
          if (data.bestTimeOfDay) cells.push({ label: 'Best Time', value: data.bestTimeOfDay, span: true });
        }
        if (!cells.length) return null;
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
            {cells.map((c, i) => (
              <div key={i} style={{ ...tile, ...(c.span ? { gridColumn: 'span 2' } : {}) }}>
                <div className={gridLabelCls} style={gridLabel}>{c.label}</div>
                <div className={gridValueCls} style={gridValue}>{c.value}</div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* CTA for stay / eat */}
      {(data.url || lookupUrl(data.name)) && (type === 'stay' || type === 'eat') && (
        <a
          href={data.url || lookupUrl(data.name)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('external_link_clicked', { name: data.name, link_type: type })}
          className="font-body text-[13px] font-semibold"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            color: s.color, textDecoration: 'none',
            padding: '8px 16px',
            border: `1.5px solid ${s.color}35`,
            background: `${s.color}08`,
            borderRadius: 20,
            letterSpacing: '0.05em',
            marginBottom: 24,
          }}
        >
          {type === 'stay' ? 'View Hotel' : 'View Restaurant'}
          <ExternalLinkIcon size={11} color={s.color} />
        </a>
      )}

      {/* Alternatives listed flat */}
      {alternatives.length > 0 ? (
        <div style={{ marginBottom: 20 }}>
          <div className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase mb-2.5" style={{ color: C.muted }}>Other Options</div>
          {alternatives.map((alt, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 8, background: C.white, border: `1px solid ${C.border}`, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                <div className="font-body text-[14px] font-semibold" style={{ color: C.ink }}>{alt.name}</div>
                {alt.priceRange && (
                  <span className="font-body text-[11px] font-semibold tracking-[0.02em] shrink-0" style={{ color: s.color }}>{alt.priceRange}</span>
                )}
              </div>
              {alt.vibe && (
                <div className="font-body text-[12px] font-medium italic mb-1.5" style={{ color: C.sage }}>
                  {alt.vibe}
                </div>
              )}
              <div className="font-body text-[13px] leading-[1.55]" style={{ color: C.body }}>{alt.why}</div>
              {(alt.duration || alt.whereToGet) && (
                <div className="font-body text-[12px] mt-1.5" style={{ color: C.muted }}>
                  {[alt.duration, alt.whereToGet].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : alternativesLoading && (
        <div style={{ marginBottom: 20 }}>
          <div className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase mb-2.5" style={{ color: C.muted }}>Other Options</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
            <div style={{
              width: 14, height: 14, border: `2px solid ${C.sage}30`, borderTopColor: C.sage,
              borderRadius: '50%', animation: 'lila-spin 0.8s linear infinite',
            }} />
            <span className="font-body text-[13px] font-normal" style={{ color: C.muted }}>Loading alternatives...</span>
          </div>
        </div>
      )}

    </div>
  );
}

/* ── logistics form panels ─────────────────────────────────────────────── */

const logisticsLabelCls = 'font-body text-[10px] font-semibold tracking-[0.12em] uppercase mb-1 block';
const logisticsLabelStyle = { color: C.muted };
const logisticsInputCls = 'w-full font-body text-[16px] md:text-[13px] outline-none box-border';
const logisticsInputStyle = { padding: '9px 12px', color: C.ink, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 };

function FlightFormPanel({ data, logistics, onSave, bookingIndex, highlightFields: initialHighlights }) {
  const [form, setForm] = useState(data || { airline: '', flightNumber: '', departureAirport: '', arrivalAirport: logistics?.arrivalAirport || '', date: '', departureTime: '', arrivalTime: '', confirmationNumber: '' });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const [highlights, setHighlights] = useState(initialHighlights || []);
  const [uploadError, setUploadError] = useState(null);
  const highlight = (field) => highlights?.includes(field) ? { borderColor: `${C.amber}80` } : {};

  const handleExtracted = (booking) => {
    setUploadError(null);
    if (booking.type === 'flight') {
      setForm(prev => ({ ...prev, airline: booking.airline || prev.airline, flightNumber: booking.flightNumber || prev.flightNumber, departureAirport: booking.departureAirport || prev.departureAirport, arrivalAirport: booking.arrivalAirport || prev.arrivalAirport, date: booking.date || prev.date, departureTime: booking.departureTime || prev.departureTime, arrivalTime: booking.arrivalTime || prev.arrivalTime, confirmationNumber: booking.confirmationNumber || prev.confirmationNumber }));
      setHighlights(booking._uncertain || []);
    } else {
      setUploadError(`Detected a ${booking.type} — open that section to save it.`);
    }
  };

  if (data && !form._editing && bookingIndex !== undefined) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`, marginBottom: 10 }}>
          <PlaneIcon size={12} color={C.teal} />
          <span className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: C.teal }}>Flights</span>
        </div>
        <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-4" style={{ color: C.ink }}>Your Flight Details</h1>
        <div style={{ ...CARD_STYLE, padding: '16px 18px', marginBottom: 16 }}>
          <div className="font-body text-[14px] font-semibold mb-1.5" style={{ color: C.ink }}>{data.airline} {data.flightNumber}</div>
          <div className="font-body text-[13px] leading-[1.6]" style={{ color: C.body }}>
            {data.departureAirport && <>{data.departureAirport} → {data.arrivalAirport}<br /></>}
            {data.date && <>{data.date}{data.departureTime ? ` · Departs ${data.departureTime}` : ''}{data.arrivalTime ? ` · Arrives ${data.arrivalTime}` : ''}<br /></>}
            {data.confirmationNumber && <>Conf: {data.confirmationNumber}</>}
          </div>
        </div>
        <button onClick={() => setForm({ ...data, _editing: true })} className="font-body text-[13px] font-semibold bg-transparent border-none cursor-pointer p-0" style={{ color: C.teal }}>Edit →</button>
      </div>
    );
  }

  const handleSave = () => {
    const { _editing, ...clean } = form;
    onSave(clean);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 30px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`, marginBottom: 10 }}>
        <PlaneIcon size={12} color={C.teal} />
        <span className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: C.teal }}>Flights</span>
      </div>
      <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-5" style={{ color: C.ink }}>Your Flight Details</h1>
      <BookingUploadTrigger onExtracted={handleExtracted} onError={setUploadError} />
      {uploadError && <div className="font-body text-[12px] mt-2" style={{ color: C.salmon }}>{uploadError}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span className="font-body text-[11px] whitespace-nowrap" style={{ color: C.muted }}>or enter manually</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Airline</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('airline') }} value={form.airline} onChange={e => set('airline', e.target.value)} placeholder="e.g. United Airlines" /></div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Flight Number</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('flightNumber') }} value={form.flightNumber} onChange={e => set('flightNumber', e.target.value)} placeholder="e.g. UA 1234" /></div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Confirmation Number</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('confirmationNumber') }} value={form.confirmationNumber} onChange={e => set('confirmationNumber', e.target.value)} placeholder="e.g. ABC123" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Departure Airport</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('departureAirport') }} value={form.departureAirport} onChange={e => set('departureAirport', e.target.value)} placeholder="e.g. SFO" /></div>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Arrival Airport</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('arrivalAirport') }} value={form.arrivalAirport} onChange={e => set('arrivalAirport', e.target.value)} placeholder="e.g. LAS" /></div>
        </div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Date</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('date') }} value={form.date} onChange={e => set('date', e.target.value)} placeholder="e.g. Mar 15, 2026" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Departure Time</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('departureTime') }} value={form.departureTime} onChange={e => set('departureTime', e.target.value)} placeholder="e.g. 8:30 AM" /></div>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Arrival Time</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('arrivalTime') }} value={form.arrivalTime} onChange={e => set('arrivalTime', e.target.value)} placeholder="e.g. 10:15 AM" /></div>
        </div>
        <button onClick={handleSave} className="font-body text-[14px] font-semibold border-none cursor-pointer self-start mt-1" style={{ color: C.white, background: C.teal, borderRadius: 20, padding: '10px 28px' }}>Save Flight</button>
      </div>
    </div>
  );
}

function RentalFormPanel({ data, logistics, onSave, bookingIndex, highlightFields: initialHighlights }) {
  const [form, setForm] = useState(data || { company: '', confirmationNumber: '', pickupLocation: logistics?.pickupLocation || '', pickupDate: '', returnDate: '' });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const [highlights, setHighlights] = useState(initialHighlights || []);
  const [uploadError, setUploadError] = useState(null);
  const highlight = (field) => highlights?.includes(field) ? { borderColor: `${C.amber}80` } : {};

  const handleExtracted = (booking) => {
    setUploadError(null);
    if (booking.type === 'rental') {
      setForm(prev => ({ ...prev, company: booking.company || prev.company, confirmationNumber: booking.confirmationNumber || prev.confirmationNumber, pickupLocation: booking.pickupLocation || prev.pickupLocation, pickupDate: booking.pickupDate || prev.pickupDate, returnDate: booking.returnDate || prev.returnDate }));
      setHighlights(booking._uncertain || []);
    } else {
      setUploadError(`Detected a ${booking.type} — open that section to save it.`);
    }
  };

  if (data && !form._editing && bookingIndex !== undefined) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`, marginBottom: 10 }}>
          <CarIcon size={12} color={C.teal} />
          <span className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: C.teal }}>Rental Car</span>
        </div>
        <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-4" style={{ color: C.ink }}>Your Rental Details</h1>
        <div style={{ ...CARD_STYLE, padding: '16px 18px', marginBottom: 16 }}>
          <div className="font-body text-[14px] font-semibold mb-1.5" style={{ color: C.ink }}>{data.company}</div>
          <div className="font-body text-[13px] leading-[1.6]" style={{ color: C.body }}>
            {data.confirmationNumber && <>Conf: {data.confirmationNumber}<br /></>}
            {data.pickupLocation && <>Pickup: {data.pickupLocation}<br /></>}
            {data.pickupDate && <>{data.pickupDate}{data.returnDate ? ` → ${data.returnDate}` : ''}</>}
          </div>
        </div>
        <button onClick={() => setForm({ ...data, _editing: true })} className="font-body text-[13px] font-semibold bg-transparent border-none cursor-pointer p-0" style={{ color: C.teal }}>Edit →</button>
      </div>
    );
  }

  const handleSave = () => {
    const { _editing, ...clean } = form;
    onSave(clean);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`, marginBottom: 10 }}>
        <CarIcon size={12} color={C.teal} />
        <span className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: C.teal }}>Rental Car</span>
      </div>
      <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-5" style={{ color: C.ink }}>Your Rental Details</h1>
      <BookingUploadTrigger onExtracted={handleExtracted} onError={setUploadError} />
      {uploadError && <div className="font-body text-[12px] mt-2" style={{ color: C.salmon }}>{uploadError}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span className="font-body text-[11px] whitespace-nowrap" style={{ color: C.muted }}>or enter manually</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Rental Company</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('company') }} value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Enterprise" /></div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Confirmation Number</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('confirmationNumber') }} value={form.confirmationNumber} onChange={e => set('confirmationNumber', e.target.value)} placeholder="e.g. ABC123456" /></div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Pickup Location</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('pickupLocation') }} value={form.pickupLocation} onChange={e => set('pickupLocation', e.target.value)} placeholder="e.g. LAS Airport" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Pickup Date</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('pickupDate') }} value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} placeholder="e.g. Mar 15, 2026" /></div>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Return Date</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('returnDate') }} value={form.returnDate} onChange={e => set('returnDate', e.target.value)} placeholder="e.g. Mar 20, 2026" /></div>
        </div>
        <button onClick={handleSave} className="font-body text-[14px] font-semibold border-none cursor-pointer self-start mt-1" style={{ color: C.white, background: C.teal, borderRadius: 20, padding: '10px 28px' }}>Save Rental</button>
      </div>
    </div>
  );
}

function BookingUploadTrigger({ onExtracted, onError }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(0);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (file.size > 5 * 1024 * 1024) {
      onError?.('Image must be under 5 MB.');
      return;
    }

    setUploading(true);
    try {
      // Convert any image format (including HEIC) to JPEG via canvas
      const base64 = await new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d').drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.92).split(',')[1]);
          URL.revokeObjectURL(url);
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image')); };
        img.src = url;
      });

      const { signal, clear } = fetchWithTimeout(30000);
      const res = await fetch('/api/extract-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image: base64, mimeType: 'image/jpeg' }),
        signal,
      });
      clear();
      const { ok, data, error } = await safeJson(res);
      if (!ok || !data.success) {
        onError?.(error || data?.error || 'Could not extract booking data.');
        return;
      }
      trackEvent('booking_extracted', { type: data.booking.type, uncertain_count: data.booking._uncertain?.length || 0 });
      onExtracted(data.booking);
    } catch (err) {
      onError?.(err.name === 'AbortError' ? 'Extraction timed out — try a smaller image.' : 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
      setInputKey(k => k + 1);
    }
  };

  return (
    <div>
      <input key={inputKey} ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full font-body text-[12px] font-medium flex items-center justify-center gap-2 bg-transparent"
        style={{
          padding: '14px 12px',
          cursor: uploading ? 'default' : 'pointer',
          border: `1.5px dashed ${C.sage}40`, borderRadius: 8,
          color: C.sage,
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {uploading ? (
          <>
            <span style={{
              width: 14, height: 14, border: `2px solid ${C.sage}30`, borderTopColor: C.sage,
              borderRadius: '50%', animation: 'lila-spin 0.8s linear infinite', display: 'inline-block',
            }} />
            Extracting...
          </>
        ) : (
          <>📷 Upload confirmation screenshot</>
        )}
      </button>
    </div>
  );
}

function BookingCard({ booking, badge, onClick, onRemove }) {
  const hasUncertain = booking._uncertain?.length > 0;

  let title = '';
  let subtitle = '';
  if (booking.type === 'flight') {
    title = [booking.airline, booking.flightNumber].filter(Boolean).join(' ') || 'Flight';
    subtitle = [
      booking.departureAirport && booking.arrivalAirport ? `${booking.departureAirport} → ${booking.arrivalAirport}` : '',
      booking.date || '',
    ].filter(Boolean).join(' · ');
  } else if (booking.type === 'rental') {
    title = booking.company || 'Rental Car';
    subtitle = [
      booking.confirmationNumber ? `Conf: ${booking.confirmationNumber}` : '',
      booking.pickupDate || '',
    ].filter(Boolean).join(' · ');
  } else if (booking.type === 'accommodation') {
    title = booking.name || 'Accommodation';
    subtitle = [
      booking.checkIn && booking.checkOut ? `${booking.checkIn} → ${booking.checkOut}` : '',
      booking.confirmationNumber ? `Conf: ${booking.confirmationNumber}` : '',
    ].filter(Boolean).join(' · ');
  } else if (booking.type === 'reservation') {
    title = booking.name || 'Booking';
    subtitle = [
      booking.type !== 'reservation' ? booking.type : '',
      booking.date || '',
      booking.time || '',
    ].filter(Boolean).join(' · ');
  }

  return (
    <div
      onClick={onClick}
      style={{
        padding: '9px 12px', cursor: 'pointer',
        position: 'relative',
        border: `1px solid ${hasUncertain ? `${C.amber}50` : C.border}`,
        borderRadius: 8, background: C.white,
      }}
    >
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="font-body text-[11px] absolute top-1.5 right-2 bg-transparent border-none cursor-pointer"
          style={{
            color: `${C.muted}80`, padding: '2px 4px',
            WebkitTapHighlightColor: 'transparent',
          }}
          aria-label="Remove"
        >✕</button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <span className="font-body text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
        {badge && (
          <span className="font-body text-[9px] font-bold tracking-[0.06em] uppercase" style={{
            color: C.teal, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`,
            padding: '2px 7px', borderRadius: 10,
          }}>{badge}</span>
        )}
      </div>
      {subtitle && <div className="font-body text-[11px] leading-[1.4]" style={{ color: C.muted }}>{subtitle}</div>}
      {hasUncertain && (
        <div className="font-body text-[10px] font-medium mt-1" style={{ color: C.amber }}>
          ⚠ Review: {booking._uncertain.join(', ')}
        </div>
      )}
    </div>
  );
}

function AccommodationFormPanel({ data, onSave, bookingIndex, highlightFields: initialHighlights }) {
  const [form, setForm] = useState(data || { name: '', confirmationNumber: '', checkIn: '', checkOut: '', address: '', phone: '' });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const [highlights, setHighlights] = useState(initialHighlights || []);
  const [uploadError, setUploadError] = useState(null);
  const highlight = (field) => highlights?.includes(field) ? { borderColor: `${C.amber}80` } : {};

  const handleExtracted = (booking) => {
    setUploadError(null);
    if (booking.type === 'accommodation') {
      setForm(prev => ({ ...prev, name: booking.name || prev.name, confirmationNumber: booking.confirmationNumber || prev.confirmationNumber, checkIn: booking.checkIn || prev.checkIn, checkOut: booking.checkOut || prev.checkOut, address: booking.address || prev.address, phone: booking.phone || prev.phone }));
      setHighlights(booking._uncertain || []);
    } else {
      setUploadError(`Detected a ${booking.type} — open that section to save it.`);
    }
  };

  if (data && !form._editing && bookingIndex !== undefined) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`, marginBottom: 10 }}>
          <CategoryIcon category="stay" color={C.teal} size={12} />
          <span className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: C.teal }}>Accommodation</span>
        </div>
        <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-4" style={{ color: C.ink }}>Your Reservation</h1>
        <div style={{ ...CARD_STYLE, padding: '16px 18px', marginBottom: 16 }}>
          <div className="font-body text-[14px] font-semibold mb-1.5" style={{ color: C.ink }}>{data.name}</div>
          <div className="font-body text-[13px] leading-[1.6]" style={{ color: C.body }}>
            {data.confirmationNumber && <>Conf: {data.confirmationNumber}<br /></>}
            {data.checkIn && data.checkOut && <>{data.checkIn} → {data.checkOut}<br /></>}
            {data.address && <>{data.address}<br /></>}
            {data.phone && <>{data.phone}</>}
          </div>
        </div>
        <button onClick={() => setForm({ ...data, _editing: true })} className="font-body text-[13px] font-semibold bg-transparent border-none cursor-pointer p-0" style={{ color: C.teal }}>Edit →</button>
      </div>
    );
  }

  const handleSave = () => {
    const { _editing, ...clean } = form;
    onSave(clean);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`, marginBottom: 10 }}>
        <CategoryIcon category="stay" color={C.teal} size={12} />
        <span className="font-body text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: C.teal }}>Accommodation</span>
      </div>
      <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-5" style={{ color: C.ink }}>Your Reservation</h1>
      <BookingUploadTrigger onExtracted={handleExtracted} onError={setUploadError} />
      {uploadError && <div className="font-body text-[12px] mt-2" style={{ color: C.salmon }}>{uploadError}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span className="font-body text-[11px] whitespace-nowrap" style={{ color: C.muted }}>or enter manually</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Property Name</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('name') }} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Desert Rose Inn" /></div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Confirmation Number</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('confirmationNumber') }} value={form.confirmationNumber} onChange={e => set('confirmationNumber', e.target.value)} placeholder="e.g. HTL-789012" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Check-In</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('checkIn') }} value={form.checkIn} onChange={e => set('checkIn', e.target.value)} placeholder="e.g. Mar 15, 2026" /></div>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Check-Out</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('checkOut') }} value={form.checkOut} onChange={e => set('checkOut', e.target.value)} placeholder="e.g. Mar 20, 2026" /></div>
        </div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Address (optional)</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('address') }} value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. 123 Canyon Rd, Springdale UT" /></div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Phone (optional)</label><input className={logisticsInputCls} style={{ ...logisticsInputStyle, ...highlight('phone') }} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="e.g. (435) 555-0123" /></div>
        <button onClick={handleSave} className="font-body text-[14px] font-semibold border-none cursor-pointer self-start mt-1" style={{ color: C.white, background: C.teal, borderRadius: 20, padding: '10px 28px' }}>Save Reservation</button>
      </div>
    </div>
  );
}

function ReservationFormPanel({ data, onSave, bookingIndex }) {
  const [form, setForm] = useState(data || { name: '', type: '', date: '', time: '', confirmationNumber: '', notes: '' });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  if (data && !form._editing && bookingIndex !== undefined) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-4" style={{ color: C.ink }}>{data.name || 'Your Booking'}</h1>
        <div style={{ ...CARD_STYLE, padding: '16px 18px', marginBottom: 16 }}>
          <div className="font-body text-[14px] font-semibold mb-1.5" style={{ color: C.ink }}>{data.name}</div>
          <div className="font-body text-[13px] leading-[1.6]" style={{ color: C.body }}>
            {data.type && <>{data.type}<br /></>}
            {data.date && <>{data.date}{data.time ? ` · ${data.time}` : ''}<br /></>}
            {data.confirmationNumber && <>Conf: {data.confirmationNumber}</>}
          </div>
          {data.notes && <div className="font-body text-[12px] italic mt-2" style={{ color: C.muted }}>{data.notes}</div>}
        </div>
        <button onClick={() => setForm({ ...data, _editing: true })} className="font-body text-[13px] font-semibold bg-transparent border-none cursor-pointer p-0" style={{ color: C.teal }}>Edit →</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
      <h1 className="font-serif text-[clamp(20px,5vw,24px)] font-light leading-[1.25] mb-5" style={{ color: C.ink }}>Add a Booking</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>What is it?</label><input className={logisticsInputCls} style={logisticsInputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Dinner at Spotted Dog, Morning Yoga" /></div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Type</label><input className={logisticsInputCls} style={logisticsInputStyle} value={form.type} onChange={e => set('type', e.target.value)} placeholder="e.g. Dinner, Yoga Class, Guided Tour, Spa" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Date</label><input className={logisticsInputCls} style={logisticsInputStyle} value={form.date} onChange={e => set('date', e.target.value)} placeholder="e.g. Oct 14" /></div>
          <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Time</label><input className={logisticsInputCls} style={logisticsInputStyle} value={form.time} onChange={e => set('time', e.target.value)} placeholder="e.g. 7:00 PM" /></div>
        </div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Confirmation Number</label><input className={logisticsInputCls} style={logisticsInputStyle} value={form.confirmationNumber} onChange={e => set('confirmationNumber', e.target.value)} placeholder="Optional" /></div>
        <div><label className={logisticsLabelCls} style={logisticsLabelStyle}>Notes</label><input className={logisticsInputCls} style={logisticsInputStyle} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Ask for window table" /></div>
        <button onClick={() => { const { _editing, ...clean } = form; onSave(clean); }} className="font-body text-[14px] font-semibold border-none cursor-pointer self-start mt-1" style={{ color: C.white, background: C.teal, borderRadius: 20, padding: '10px 28px' }}>Save Booking</button>
      </div>
    </div>
  );
}

function DetailPanel({ item, onClose, lockedItems, onLock, onAlternatives, alternativesLoading }) {
  const isDesktop = useIsDesktop();
  const sheetRef = useRef(null);
  const dragStartY = useRef(null);
  const dragCurrentY = useRef(0);

  if (!item) return null;

  const isMindfulness = item.type === 'mindfulness';
  const panelBg = isMindfulness ? 'linear-gradient(150deg, #f5f1ea 0%, #ede9e0 100%)' : C.warm;

  const onTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    dragCurrentY.current = dy;
    if (dy > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${dy}px)`;
    }
  };

  const onTouchEnd = () => {
    if (dragCurrentY.current > 80) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = 'translateY(0)';
    }
    dragStartY.current = null;
    dragCurrentY.current = 0;
  };

  if (isDesktop) {
    return (
      <>
        {/* Backdrop */}
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 249,
          background: 'rgba(0,0,0,0.15)',
          animation: 'sidePanelBackdropIn 0.25s ease',
        }} />

        {/* Panel */}
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 440, zIndex: 250,
          background: panelBg, overflowY: 'auto',
          animation: 'sidePanelSlideIn 0.3s ease',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
        }}>
          {/* Close button — sticky bar so it never gets covered by content */}
          <div style={{
            position: 'sticky', top: 0, zIndex: 10,
            display: 'flex', justifyContent: 'flex-end',
            padding: '12px 14px 0 0',
          }}>
            <button onClick={onClose} className="font-body text-[15px] leading-none flex items-center justify-center w-8 h-8 cursor-pointer" style={{
              background: `${C.white}e0`, border: `1px solid ${C.sage}15`,
              borderRadius: '50%', color: C.sage,
              WebkitTapHighlightColor: 'transparent',
              boxShadow: `0 2px 8px ${C.ink}08`,
            }} aria-label="Close">✕</button>
          </div>

          <DetailPanelContent item={item} lockedItems={lockedItems} onLock={onLock} onAlternatives={onAlternatives} alternativesLoading={alternativesLoading} />
        </div>
      </>
    );
  }

  // Mobile: bottom sheet
  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 249,
        background: 'rgba(0,0,0,0.15)',
        animation: 'bottomSheetBackdropIn 0.25s ease',
      }} />

      {/* Sheet */}
      <div ref={sheetRef} style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '92vh', zIndex: 250,
        background: panelBg,
        borderRadius: '16px 16px 0 0',
        animation: 'bottomSheetSlideIn 0.3s ease',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Drag handle + close */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ padding: '10px 14px 6px', flexShrink: 0, position: 'relative', zIndex: 10 }}
        >
          {/* Pill handle */}
          <div style={{
            width: 36, height: 4, borderRadius: 2,
            background: `${C.sage}30`, margin: '0 auto 8px',
          }} />

          {/* Close button */}
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="font-body text-[15px] leading-none absolute top-2 right-3.5 flex items-center justify-center w-9 h-9 cursor-pointer" style={{
            background: `${C.white}e0`, border: `1px solid ${C.sage}15`,
            borderRadius: '50%', color: C.sage,
            WebkitTapHighlightColor: 'transparent',
            boxShadow: `0 2px 8px ${C.ink}08`,
          }} aria-label="Close">✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          <DetailPanelContent item={item} lockedItems={lockedItems} onLock={onLock} onAlternatives={onAlternatives} alternativesLoading={alternativesLoading} />
        </div>
      </div>
    </>
  );
}

/* ── destination logistics ──────────────────────────────────────────────── */

const DESTINATION_LOGISTICS = {
  zion: {
    flights: 'Fly into Las Vegas (LAS) \u2014 2.5 hrs to Springdale.',
    arrivalAirport: 'LAS',
    car: 'A car is essential. Pick up at LAS airport.',
    pickupLocation: 'LAS Airport',
  },
  'joshua-tree': {
    flights: 'Fly into Palm Springs (PSP) \u2014 45 min to Joshua Tree.',
    arrivalAirport: 'PSP',
    car: 'A car is essential. The park is 60+ miles end to end.',
    pickupLocation: 'PSP Airport',
  },
  'big-sur': {
    flights: 'Fly into San Jose (SJC) or Monterey (MRY) \u2014 1\u20132 hrs to Big Sur.',
    arrivalAirport: 'SJC',
    car: 'A car is essential. Highway 1 is the only route through.',
    pickupLocation: 'SJC Airport',
  },
  'olympic-peninsula': {
    flights: 'Fly into Seattle (SEA) \u2014 2.5 hrs to the peninsula.',
    arrivalAirport: 'SEA',
    car: 'A car is essential. The peninsula is vast with limited transit.',
    pickupLocation: 'SEA Airport',
  },
  kauai: {
    flights: 'Fly into Lihue (LIH) \u2014 the island\'s only commercial airport.',
    arrivalAirport: 'LIH',
    car: 'A rental car is highly recommended for exploring the island.',
    pickupLocation: 'LIH Airport',
  },
  'vancouver-island': {
    flights: 'Fly into Victoria (YYJ) or Nanaimo (YCD), or ferry from Vancouver.',
    arrivalAirport: 'YYJ',
    car: 'A car is essential for exploring beyond Victoria.',
    pickupLocation: 'YYJ Airport',
  },
};

function getLogistics(destination) {
  const key = (destination || '').toLowerCase().replace(/\s+/g, '-');
  return DESTINATION_LOGISTICS[key] || null;
}

/**
 * Extract accommodation from Claude's generated itinerary.
 * Priority: days[0].picks where category === "stay" \u2192 scan all days' picks \u2192 timeline "check in" \u2192 null
 */
function extractAccommodation(itinerary) {
  if (!itinerary?.days?.length) return null;

  // 1. Check picks on day 1 for a "stay" category
  const day1 = itinerary.days[0];
  if (day1.picks?.length) {
    const stayPick = day1.picks.find(p => p.category === 'stay');
    if (stayPick?.pick?.name) {
      return {
        ...stayPick.pick,
        vibe: stayPick.pick.description || stayPick.pick.vibe || null,
        alternatives: stayPick.alternatives || [],
      };
    }
  }

  // 2. Scan all days' picks for a "stay" category (in case it's not on day 1)
  for (const day of itinerary.days) {
    if (day.picks?.length) {
      const stayPick = day.picks.find(p => p.category === 'stay');
      if (stayPick?.pick?.name) {
        return {
          ...stayPick.pick,
          vibe: stayPick.pick.description || stayPick.pick.vibe || null,
          alternatives: stayPick.alternatives || [],
        };
      }
    }
  }

  // 3. Fallback: scan day 1 timeline for "check in" / "check-in"
  if (day1.timeline?.length) {
    for (const item of day1.timeline) {
      const title = (item.title || item.activity || '').toLowerCase();
      if (title.includes('check in') || title.includes('check-in')) {
        return {
          name: item.title || item.activity,
          vibe: item.details || item.description || null,
        };
      }
    }
  }

  return null;
}

function LogisticsPanel({ destination, sticky = true, tripLogistics, onOpenPanel, itinerary, onRefine }) {
  const [logisticsExpanded, setLogisticsExpanded] = useState(false);
  const logistics = getLogistics(destination);
  const flights = tripLogistics?.flights || [];
  const rentals = tripLogistics?.rentals || [];
  const userAccoms = tripLogistics?.accommodations || [];
  const dynamicAccom = extractAccommodation(itinerary);
  const accom = dynamicAccom || { name: 'See your itinerary' };
  const accomName = accom.name;

  const reservations = tripLogistics?.reservations || [];

  const hasAnyBookings = flights.length > 0 || rentals.length > 0 || userAccoms.length > 0 || reservations.length > 0;

  // Flight badge logic
  const getFlightBadge = (index) => {
    if (flights.length === 2) return index === 0 ? 'Outbound' : 'Return';
    if (flights.length > 2) return `Flight ${index + 1}`;
    return null;
  };

  // Open form panels for editing/adding
  const openFlightForm = (index) => onOpenPanel && onOpenPanel({
    type: 'flights', savedData: index !== undefined ? flights[index] : null, logistics,
    bookingIndex: index,
    onSave: (d) => onOpenPanel({
      _updateLogistics: (prev) => {
        const arr = [...(prev.flights || [])];
        if (index !== undefined) arr[index] = d;
        else arr.push(d);
        return { ...prev, flights: arr };
      },
    }),
  });
  const openRentalForm = (index) => onOpenPanel && onOpenPanel({
    type: 'rental', savedData: index !== undefined ? rentals[index] : null, logistics,
    bookingIndex: index,
    onSave: (d) => onOpenPanel({
      _updateLogistics: (prev) => {
        const arr = [...(prev.rentals || [])];
        if (index !== undefined) arr[index] = d;
        else arr.push(d);
        return { ...prev, rentals: arr };
      },
    }),
  });
  const openAccomForm = (index) => onOpenPanel && onOpenPanel({
    type: 'accommodation',
    savedData: index !== undefined ? userAccoms[index] : null,
    bookingIndex: index,
    onSave: (d) => onOpenPanel({
      _updateLogistics: (prev) => {
        const arr = [...(prev.accommodations || [])];
        if (index !== undefined) arr[index] = d;
        else arr.push(d);
        return { ...prev, accommodations: arr };
      },
    }),
  });
  const openLilaAccom = () => onOpenPanel && onOpenPanel({
    type: 'accommodation', data: accom, alternatives: accom.alternatives || [],
  });
  const openReservationForm = (index) => onOpenPanel && onOpenPanel({
    type: 'reservation',
    savedData: index !== undefined ? reservations[index] : null,
    bookingIndex: index,
    onSave: (d) => onOpenPanel({
      _updateLogistics: (prev) => {
        const arr = [...(prev.reservations || [])];
        if (index !== undefined) arr[index] = d;
        else arr.push(d);
        return { ...prev, reservations: arr };
      },
    }),
  });

  const removeFlight = (index) => onOpenPanel({ _updateLogistics: (prev) => ({ ...prev, flights: prev.flights.filter((_, i) => i !== index) }) });
  const removeRental = (index) => onOpenPanel({ _updateLogistics: (prev) => ({ ...prev, rentals: prev.rentals.filter((_, i) => i !== index) }) });
  const removeAccom = (index) => onOpenPanel({ _updateLogistics: (prev) => ({ ...prev, accommodations: prev.accommodations.filter((_, i) => i !== index) }) });
  const removeReservation = (index) => onOpenPanel({ _updateLogistics: (prev) => ({ ...prev, reservations: prev.reservations.filter((_, i) => i !== index) }) });

  const sectionHeader = (icon, label, onAdd) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}
        <span className="font-serif text-[14px] font-normal" style={{ color: C.ink }}>{label}</span>
      </div>
      {onAdd && (
        <button onClick={onAdd} className="font-body text-[11px] font-semibold bg-transparent border-none cursor-pointer" style={{
          color: C.teal, padding: '2px 4px',
          WebkitTapHighlightColor: 'transparent',
        }}>+ Add</button>
      )}
    </div>
  );

  return (
    <div style={{
      ...CARD_STYLE,
      ...(sticky ? { position: 'sticky', top: 56 } : {}),
    }}>
      {/* Header */}
      <div
        onClick={() => setLogisticsExpanded(prev => !prev)}
        style={{ padding: '14px 16px 12px', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <div className="font-body text-[9px] font-bold tracking-[0.18em] uppercase mb-0.5" style={{ color: C.muted }}>Your Trip</div>
          <div className="font-serif text-[18px] font-light" style={{ color: C.ink }}>Logistics</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke={C.sage} strokeWidth="1.5" strokeLinecap="round"
          style={{ transform: logisticsExpanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.35s ease', marginTop: 8 }}>
          <polyline points="4.5,6 8,9.5 11.5,6" />
        </svg>
      </div>

      {logisticsExpanded && (<>
      {/* Flights */}
      <div style={{ padding: '13px 16px', borderBottom: `1px solid ${C.border}` }}>
        {sectionHeader(<PlaneIcon size={12} color={C.muted} />, 'Flights', () => openFlightForm())}
        {flights.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {flights.map((f, i) => (
              <BookingCard key={i} booking={{ ...f, type: 'flight' }} badge={getFlightBadge(i)} onClick={() => openFlightForm(i)} onRemove={() => removeFlight(i)} />
            ))}
          </div>
        ) : (
          <div className="font-body text-[12px] italic leading-[1.5]" style={{ color: `${C.muted}99` }}>
            Add your flight for timing-aware scheduling
          </div>
        )}
      </div>

      {/* Accommodations */}
      <div style={{ padding: '13px 16px', borderBottom: `1px solid ${C.border}` }}>
        {sectionHeader(<CategoryIcon category="stay" color={C.muted} size={12} />, 'Accommodations', () => openAccomForm())}

        {/* User booking cards */}
        {userAccoms.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
            {userAccoms.map((a, i) => (
              <BookingCard key={i} booking={{ ...a, type: 'accommodation' }} onClick={() => openAccomForm(i)} onRemove={() => removeAccom(i)} />
            ))}
          </div>
        )}

        {/* Lila Pick card — hidden when user has their own accommodation */}
        {userAccoms.length === 0 && (
          <div onClick={openLilaAccom} style={{
            borderLeft: `3px solid ${PICK_STYLES.stay.color}`,
            padding: '9px 12px', marginBottom: 6, cursor: 'pointer',
            borderRadius: '0 6px 6px 0', background: `${PICK_STYLES.stay.color}06`,
            transition: 'background 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <LilaStar size={8} color={PICK_STYLES.stay.color} />
              <span className="font-body text-[9px] font-bold tracking-[0.08em] uppercase" style={{ color: PICK_STYLES.stay.color }}>Lila Pick</span>
            </div>
            <div className="font-body text-[13px] font-semibold mb-0.5" style={{ color: C.ink }}>{accomName}</div>
            {accom.location && <div className="font-body text-[11px] font-medium mb-0.5" style={{ color: C.muted }}>{accom.location}</div>}
            {accom.vibe && <div className="font-body text-[11px] font-medium italic leading-[1.4]" style={{ color: C.sage }}>{accom.vibe}</div>}
            {accom.priceRange && <div className="font-body text-[10px] font-semibold mt-1" style={{ color: PICK_STYLES.stay.color }}>{accom.priceRange}</div>}
          </div>
        )}
      </div>

      {/* Rental Cars */}
      <div style={{ padding: '13px 16px', borderBottom: `1px solid ${C.border}` }}>
        {sectionHeader(<CarIcon size={12} color={C.muted} />, 'Rental Car', () => openRentalForm())}
        {rentals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {rentals.map((r, i) => (
              <BookingCard key={i} booking={{ ...r, type: 'rental' }} onClick={() => openRentalForm(i)} onRemove={() => removeRental(i)} />
            ))}
          </div>
        ) : (
          <div className="font-body text-[12px] italic leading-[1.5]" style={{ color: `${C.muted}99` }}>
            Add your rental confirmation to keep it handy
          </div>
        )}
      </div>

      {/* Other Bookings */}
      <div style={{ padding: '13px 16px' }}>
        {sectionHeader(
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
          'Other Bookings',
          () => openReservationForm()
        )}
        {reservations.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {reservations.map((r, i) => (
              <BookingCard key={i} booking={{ ...r, type: 'reservation' }} onClick={() => openReservationForm(i)} onRemove={() => removeReservation(i)} />
            ))}
          </div>
        ) : (
          <div className="font-body text-[12px] italic leading-[1.5]" style={{ color: `${C.muted}99` }}>
            Dinner reservations, spa bookings, tours...
          </div>
        )}
      </div>

      </>)}

      {/* Refine strip — shown when any bookings exist */}
      {hasAnyBookings && onRefine && (
        <div style={{
          padding: '10px 16px',
          background: `${C.amber}07`,
          borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <button
            onClick={onRefine}
            className="font-body text-[12px] font-semibold bg-transparent cursor-pointer"
            style={{
              color: C.amber, border: `1px solid ${C.amber}40`,
              borderRadius: 16, padding: '7px 16px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Adjust itinerary to my bookings
          </button>
        </div>
      )}
    </div>
  );
}

/* ── day feedback strip ────────────────────────────────────────────────── */

function DayFeedbackStrip({ dayIndex, feedback, onFeedback }) {
  const reaction = feedback?.reaction || null;
  const noteText = feedback?.note || '';
  const [text, setText] = useState(noteText);
  const [noteFocused, setNoteFocused] = useState(false);

  useEffect(() => { setText(feedback?.note || ''); }, [feedback?.note]);

  const setReaction = (key) => {
    const next = reaction === key ? null : key;
    trackEvent('day_reaction', { day_index: dayIndex, reaction: next || 'cleared' });
    onFeedback(dayIndex, { ...feedback, reaction: next });
  };

  const commitNote = () => {
    const trimmed = text.trim();
    if (trimmed !== noteText) {
      onFeedback(dayIndex, { ...feedback, note: trimmed || undefined });
      if (trimmed) trackEvent('day_note_saved', { day_index: dayIndex, note_length: trimmed.length });
    }
    setNoteFocused(false);
  };

  return (
    <div style={{ padding: '10px 18px 14px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { key: 'spot-on', label: 'Spot On', color: C.sea, icon: <CheckIcon size={11} color={reaction === 'spot-on' ? C.sea : C.muted} /> },
          { key: 'needs-work', label: 'Needs Work', color: C.amber, icon: <PencilIcon size={11} color={reaction === 'needs-work' ? C.amber : C.muted} /> },
        ].map(r => {
          const active = reaction === r.key;
          return (
            <button key={r.key} onClick={() => setReaction(r.key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 12px', borderRadius: 20,
              background: active ? `${r.color}10` : 'none',
              border: `1px solid ${active ? `${r.color}30` : C.border}`,
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              transition: 'all 0.2s',
            }}>
              {r.icon}
              <span className="font-body text-[11px]" style={{ fontWeight: active ? 600 : 500, color: active ? r.color : C.muted }}>{r.label}</span>
            </button>
          );
        })}
      </div>
      <textarea value={text}
        onChange={e => { setText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
        onFocus={() => setNoteFocused(true)}
        onBlur={commitNote}
        placeholder="Add a note for this day..."
        rows={1}
        className="font-body text-[13px] font-normal"
        style={{
          width: '100%', marginTop: 8, padding: '7px 0',
          color: C.body,
          background: 'transparent', border: 'none',
          borderBottom: `1px solid ${noteFocused ? `${C.sage}30` : C.border}`,
          resize: 'none', overflow: 'hidden', lineHeight: 1.5,
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
      />
    </div>
  );
}

/* ── day card (V2 flat) ────────────────────────────────────────────────── */

function DayCard({ day, dayIndex = 0, onOpenPanel, lockedItems, onLock, onAlternatives, feedback, onFeedback, onSwapOpen, swappedActivities }) {
  const color = DAY_COLORS[dayIndex % DAY_COLORS.length];

  return (
    <div style={{
      ...CARD_STYLE,
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 10px' }}>
        <div className="font-body text-[11px] font-semibold tracking-[0.12em] uppercase mb-1" style={{ color: color }}>DAY {dayIndex + 1} &middot; {day.label}</div>
        <div className="font-serif text-[22px] font-light leading-[1.15]" style={{ color: C.ink }}>{day.title}</div>
      </div>

      {/* Mindfulness Practice callout — opens detail panel on click */}
      {(() => {
        const mindfulnessPick = day.picks?.find(p => p.category === 'mindfulness')?.pick;
        const hasCompanion = day.companion && (day.companion.teaching || day.companion.practice);

        if (!mindfulnessPick && !hasCompanion) return null;

        const wrapperStyle = {
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(150deg, #f5f1ea 0%, #ede9e0 100%)',
          borderTop: '1.5px solid rgba(74,155,159,0.35)',
          borderBottom: '1.5px solid rgba(74,155,159,0.35)',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        };

        const handleClick = () => {
          if (mindfulnessPick) {
            trackEvent('mindfulness_opened', { name: mindfulnessPick.name, day_index: dayIndex });
            // Merge companion quote into mindfulness data if available
            // (Claude's picks don't include quotes; the companion entry from practicesService does)
            const companionEntry = day.companion?.teaching || day.companion?.practice;
            const enrichedData = companionEntry?.quote && !mindfulnessPick.quote
              ? { ...mindfulnessPick, quote: companionEntry.quote }
              : mindfulnessPick;
            onOpenPanel({
              type: 'mindfulness',
              data: enrichedData,
              thumbId: `day_${dayIndex}_mindfulness`,
            });
          } else if (hasCompanion) {
            const entry = day.companion.teaching || day.companion.practice;
            const entryType = day.companion.teaching ? 'teaching' : 'practice';
            trackEvent('companion_opened', { type: entryType, title: entry.title, day_index: dayIndex });
            onOpenPanel({ type: entryType, data: entry, thumbId: `day_${dayIndex}_${entryType}` });
          }
        };

        // Preview content for compact callout
        const name = mindfulnessPick?.name || (day.companion?.teaching?.title || day.companion?.practice?.title);
        const essence = mindfulnessPick?.essence;
        const tradition = mindfulnessPick ? TRADITIONS[mindfulnessPick.tradition] : null;
        const glyph = mindfulnessPick ? (TRADITION_GLYPHS[mindfulnessPick.tradition] || '◈') : null;

        return (
          <div style={wrapperStyle} onClick={handleClick}>
            <div aria-hidden style={{
              position: 'absolute', top: 0, bottom: 0,
              left: '-40%', width: '180%',
              background: 'linear-gradient(to right, transparent 0%, #dceee9 25%, #e2eeeb 50%, #dceee9 75%, transparent 100%)',
              animation: 'practiceBreath 16s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <IconLotus size={32} color="#4A9B9F" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase mb-1" style={{ color: '#4A9B9F' }}>Mindfulness Practice</div>
                  <div className="font-serif text-[17px] font-light leading-[1.3]" style={{ color: '#1a2530' }}>{name}</div>
                  {essence && (
                    <div className="font-body text-[13px] font-normal leading-[1.5] mt-1 overflow-hidden text-ellipsis" style={{
                      color: C.body,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>{essence}</div>
                  )}
                  {glyph && tradition && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                      <span style={{ fontSize: 11, lineHeight: 1 }}>{glyph}</span>
                      <span className="font-body text-[10px] font-semibold tracking-[0.08em] uppercase" style={{
                        color: `${tradition.color || C.sage}99`,
                      }}>{tradition.name}</span>
                    </div>
                  )}
                </div>
                <span style={{ color: '#4A9B9F', opacity: 0.5, fontSize: 16, flexShrink: 0 }}>›</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Activity rows */}
      {day.timeline && day.timeline.map((b, i) => {
        const thumbId = `day_${dayIndex}_timeline_${i}`;
        const swap = swappedActivities?.[thumbId];
        const displayTitle = swap ? swap.to : b.title;
        const displaySummary = swap ? swap.toSummary : b.summary;
        const isTrail = !!(b.trailData) || b.activityType === 'trail';
        const tint = lockedTint(lockedItems, thumbId);
        const isItemLocked = !!lockedItems?.[thumbId];
        const curatable = isCuratable({ ...b, title: displayTitle });

        const handleShowAlternatives = (id) => {
          if (onSwapOpen) {
            onSwapOpen({ dayIndex, itemIndex: i, thumbId, activityTitle: displayTitle, alternatives: b.alternatives || [] });
          } else {
            onAlternatives(id);
          }
        };

        const lockEntry = lockedItems?.[thumbId];
        const lockLabel = lockEntry?.bookingType === 'flight' ? 'Flight' : lockEntry?.bookingType === 'accommodation' ? 'Hotel' : lockEntry?.bookingType === 'rental' ? 'Rental' : 'Locked';

        return (
          <div
            key={i}
            onClick={() => {
              trackEvent('panel_opened', { type: isTrail ? 'trail' : 'activity', title: displayTitle });
              onOpenPanel({
                type: isTrail ? 'trail' : 'activity',
                data: { ...b, title: displayTitle, summary: displaySummary, trailData: b.trailData || {} },
                thumbId,
              });
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: '44px 1fr auto',
              gap: '0 10px',
              padding: isItemLocked ? '12px 14px' : '12px 16px',
              borderTop: isItemLocked ? 'none' : `1px solid ${C.border}`,
              border: isItemLocked ? `2px solid rgba(212,168,83,0.50)` : undefined,
              borderRadius: isItemLocked ? 8 : 0,
              margin: isItemLocked ? '4px 8px' : 0,
              cursor: 'pointer',
              background: tint || 'transparent',
              transition: 'background 0.2s',
              alignItems: 'start',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={e => { if (!tint) e.currentTarget.style.background = 'rgba(28,28,26,0.015)'; }}
            onMouseLeave={e => { if (!tint) e.currentTarget.style.background = 'transparent'; }}
          >
            {/* Time */}
            <div className="font-body text-[11px] font-normal leading-[1.3] text-right pt-0.5" style={{ color: C.muted }}>{b.time || ''}</div>

            {/* Content */}
            <div style={{ minWidth: 0 }}>
              {/* Icon stack + title */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 3 }}>
                {/* Practice icons — absolutely positioned so multiple icons don't push title down */}
                {(() => {
                  const tags = b.practiceTag
                    ? (Array.isArray(b.practiceTag) ? b.practiceTag : [b.practiceTag])
                    : [];
                  if (tags.length > 0) {
                    return (
                      <div style={{ position: 'relative', width: 15, flexShrink: 0, marginTop: 3 }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {tags.map((tag, ti) => <PracticeIcon key={ti} practiceId={tag} size={15} />)}
                        </div>
                      </div>
                    );
                  }
                  // Fallback dot when no practiceTag
                  return (
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: color, opacity: 0.4,
                      flexShrink: 0, marginTop: 6,
                    }} />
                  );
                })()}

                {/* Title */}
                <div className="font-serif text-[17px] font-normal leading-[1.25]" style={{ color: C.ink }}>
                  {displayTitle}
                  {isItemLocked && (
                    <span className="font-body text-[9px] font-bold tracking-[0.07em] uppercase inline-flex items-center gap-[3px] ml-1.5" style={{ color: C.goldenAmber }}>{lockLabel}</span>
                  )}
                </div>
              </div>

              {/* Meta — practice tag labels, duration, difficulty */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                flexWrap: 'wrap', marginBottom: 4, paddingLeft: 22,
              }}>
                {(() => {
                  const tags = b.practiceTag
                    ? (Array.isArray(b.practiceTag) ? b.practiceTag : [b.practiceTag])
                    : [];
                  const items = [];
                  tags.forEach((tag, ti) => {
                    const p = PRACTICE_MAP[tag];
                    if (!p) return;
                    if (ti > 0) items.push(<div key={`dot-${ti}`} style={{ width: 2, height: 2, borderRadius: '50%', background: '#ccc', flexShrink: 0 }} />);
                    items.push(
                      <span key={tag} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', color: p.color }}>
                        {PRACTICE_TAG_LABELS[tag] || tag}
                      </span>
                    );
                  });
                  if (b.duration) {
                    if (items.length > 0) items.push(<div key="dur-dot" style={{ width: 2, height: 2, borderRadius: '50%', background: '#ccc', flexShrink: 0 }} />);
                    items.push(<span key="dur" style={{ fontSize: 11, color: C.muted }}>{b.duration}</span>);
                  }
                  if (b.trailData?.difficulty) {
                    items.push(<div key="diff-dot" style={{ width: 2, height: 2, borderRadius: '50%', background: '#ccc', flexShrink: 0 }} />);
                    const diffColor = b.trailData.difficulty === 'strenuous' ? C.sunSalmon : b.trailData.difficulty === 'moderate' ? C.goldenAmber : C.seaGlass;
                    items.push(<span key="diff" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: diffColor, textTransform: 'capitalize' }}>{b.trailData.difficulty}</span>);
                  }
                  return items;
                })()}
              </div>

              {/* Summary — always visible */}
              {displaySummary && (
                <div className="font-body text-[12px] font-normal leading-[1.65] pl-[22px]" style={{ color: C.muted }}>{displaySummary}</div>
              )}
            </div>

            {/* Actions — Lock + Swap, right column, top aligned */}
            {curatable && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', paddingTop: 2 }}>
                <button
                  onClick={e => { e.stopPropagation(); onLock(thumbId); }}
                  title="Lock this in"
                  className="font-body"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: lockedItems?.[thumbId] ? `${C.goldenAmber}18` : `${C.goldenAmber}08`,
                    border: `1px solid ${lockedItems?.[thumbId] ? `${C.goldenAmber}60` : `${C.goldenAmber}30`}`,
                    borderRadius: 6, padding: '5px 8px',
                    color: '#B8922A', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#B8922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="7" width="10" height="7" rx="1.5"/>
                    <path d="M5 7V5a3 3 0 0 1 6 0v2"/>
                  </svg>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {lockedItems?.[thumbId] ? 'Locked' : 'Lock'}
                  </span>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleShowAlternatives(thumbId); }}
                  title="See alternatives"
                  className="font-body"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'transparent',
                    border: `1px solid rgba(28,28,26,0.1)`,
                    borderRadius: 6, padding: '5px 8px',
                    color: C.muted, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 8a5.5 5.5 0 0 1 9.5-3.5"/>
                    <path d="M13.5 8a5.5 5.5 0 0 1-9.5 3.5"/>
                    <polyline points="12,1 12,5 8,5"/>
                    <polyline points="4,15 4,11 8,11"/>
                  </svg>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Swap</span>
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Day feedback */}
      <DayFeedbackStrip dayIndex={dayIndex} feedback={feedback} onFeedback={onFeedback} />
    </div>
  );
}

/* ── trip pulse ─────────────────────────────────────────────────────────── */

function TripPulse({ overallNote, setOverallNote, pulse, setPulse, onPulseSelect, iteration }) {
  const options = [
    { key: 'love', label: 'Love it', sub: 'Lock it in', color: C.seaGlass, icon: <CheckIcon size={15} color={C.seaGlass} /> },
    { key: 'close', label: 'Almost there', sub: 'A few tweaks', color: C.goldenAmber, icon: <PencilIcon size={15} color={C.goldenAmber} /> },
    { key: 'rethink', label: 'Rethink it', sub: 'Different direction', color: C.sunSalmon, icon: <RefreshIcon size={15} color={C.sunSalmon} /> },
  ];

  return (
    <div style={{ background: C.white, borderRadius: 2, border: `1.5px solid ${C.sage}14`, boxShadow: `0 4px 20px ${C.amber}0a`, padding: '22px 20px', marginTop: 20 }}>
      <div className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: `${C.sage}90` }}>Overall Feeling</div>
      <div className="font-body text-[14px] font-normal mb-4" style={{ fontStyle: 'normal', color: `${C.slate}65` }}>How's this trip shaping up?</div>

      <div style={{ display: 'flex', gap: 8 }}>
        {options.map(o => {
          const active = pulse === o.key;
          return (
            <button key={o.key} onClick={() => { const val = active ? null : o.key; setPulse(val); if (val) { onPulseSelect?.(val); if (val === 'love') trackEvent('trip_locked_in', { iteration }); } }} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '12px 8px', borderRadius: 12,
              background: active ? `${o.color}10` : `${C.sage}04`,
              border: `1.5px solid ${active ? `${o.color}35` : `${C.sage}0c`}`,
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent', transition: 'all 0.25s',
            }}>
              {o.icon}
              <span className="font-body text-[13px] font-semibold" style={{ color: active ? o.color : `${C.slate}90` }}>{o.label}</span>
              <span className="font-body text-[11px] font-normal" style={{ color: active ? `${o.color}90` : `${C.slate}35` }}>{o.sub}</span>
            </button>
          );
        })}
      </div>

      {(pulse === 'close' || pulse === 'rethink') && (
        <div style={{ marginTop: 14 }}>
          <textarea value={overallNote} onChange={e => setOverallNote(e.target.value)}
            onBlur={e => { if (e.target.value.trim()) trackEvent('overall_note_entered', { pulse, note_length: e.target.value.trim().length }); }}
            placeholder={pulse === 'close' ? 'What\'s close but not quite right?' : 'What direction would feel better?'}
            className="font-body text-[14px] font-normal leading-[1.55]" style={{ width: '100%', minHeight: 72, padding: '10px 12px', color: C.slate, background: C.white, border: `1px solid ${C.sage}15`, borderRadius: 10, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      )}
    </div>
  );
}

/* ── refine CTA + premium gate ─────────────────────────────────────────── */

function RefineConfirmModal({ onConfirm, onCancel, feedbackCount }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onCancel}>
      <div style={{
        maxWidth: 380, width: '100%',
        background: '#F5F0E8', borderRadius: 2,
        padding: '32px 28px 28px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
      }} onClick={e => e.stopPropagation()}>
        <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase mb-3.5" style={{ color: '#8C8C80' }}>Refine</div>
        <h3 className="font-body text-[18px] font-semibold leading-[1.3] mb-2" style={{ color: '#1C1C1A' }}>Ready to refine your itinerary?</h3>
        <p className="font-body text-[13px] font-normal leading-[1.6] mb-6" style={{ color: '#3D3D38' }}>
          {feedbackCount > 0
            ? `We'll apply your ${feedbackCount} ${feedbackCount === 1 ? 'input' : 'inputs'} and generate an updated version.`
            : "We'll generate an updated version based on your feedback."}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} className="font-body text-[12px] font-semibold" style={{
            flex: 1, padding: '11px 0',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#1C1C1A', background: 'transparent',
            border: '1px solid #e8e2d9', borderRadius: 0,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>Cancel</button>
          <button onClick={onConfirm} className="font-body text-[12px] font-semibold" style={{
            flex: 1, padding: '11px 0',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#faf8f4', background: '#1a2530',
            border: '1px solid #1a2530', borderRadius: 0,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>Refine</button>
        </div>
      </div>
    </div>
  );
}

function RefineCTA({ iteration, hasFeedback, onRefine, pulse, onGateShown, onUpgradeClick, feedbackCount = 0, isRefining }) {
  const maxFree = 10;
  const remaining = maxFree - iteration;
  const isPremiumGated = iteration >= maxFree;
  const featuresRef = useRef(null);
  const featuresTracked = useRef(false);
  const gateShownRef = useRef(false);

  useEffect(() => {
    if (isPremiumGated && !gateShownRef.current) {
      gateShownRef.current = true;
      onGateShown?.();
    }
  }, [isPremiumGated, onGateShown]);

  // Track when features list scrolls into view
  useEffect(() => {
    if (!isPremiumGated || !featuresRef.current || featuresTracked.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !featuresTracked.current) {
        featuresTracked.current = true;
        trackEvent('premium_features_viewed', { scroll_to_features: true });
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(featuresRef.current);
    return () => obs.disconnect();
  }, [isPremiumGated]);

  // Track dismissal — user navigates away while gate was visible
  useEffect(() => {
    if (!isPremiumGated) return;
    return () => { trackEvent('premium_upgrade_dismissed', { iteration }); };
  }, [isPremiumGated, iteration]);

  if (pulse === 'love') {
    return (
      <div style={{ textAlign: 'center', padding: '28px 20px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 24, background: `${C.seaGlass}10`, border: `1px solid ${C.seaGlass}25` }}>
          <CheckIcon size={14} color={C.seaGlass} />
          <span className="font-body text-[14px] font-semibold" style={{ color: C.seaGlass }}>Trip locked in</span>
        </div>
        <p className="font-body text-[13px] leading-[1.5] mt-2.5" style={{ color: `${C.slate}65` }}>You can still make changes anytime — just update your day notes above.</p>
      </div>
    );
  }

  if (isPremiumGated) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 20px 0' }}>
        <p className="font-body text-[13px] font-normal leading-[1.6]" style={{ color: C.muted, maxWidth: 360, margin: '0 auto' }}>
          You're in early access — refinements are unlimited for now. Paid plans coming soon.
        </p>
        <div style={{ marginTop: 14 }}>
          <button onClick={onRefine} disabled={!hasFeedback || isRefining} className="font-body text-[14px] font-semibold" style={{
            color: hasFeedback && !isRefining ? C.white : `${C.sage}80`,
            background: hasFeedback && !isRefining ? C.oceanTeal : `${C.sage}08`,
            border: hasFeedback && !isRefining ? 'none' : `1px solid ${C.sage}15`,
            borderRadius: 24, padding: '12px 28px',
            cursor: hasFeedback && !isRefining ? 'pointer' : 'default',
            WebkitTapHighlightColor: 'transparent',
            boxShadow: hasFeedback && !isRefining ? `0 2px 12px ${C.oceanTeal}20` : 'none',
            transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 7,
            opacity: isRefining ? 0.5 : 1,
          }}>
            <SparkleIcon size={14} color={hasFeedback && !isRefining ? C.white : `${C.sage}40`} />
            {isRefining ? 'Refining...' : (feedbackCount > 0 ? `Refine this trip · ${feedbackCount}` : 'Refine this trip')}
          </button>
          {feedbackCount > 0 && !isRefining && (
            <p className="font-body text-[11px] tracking-[0.04em] mt-1.5 text-center" style={{ color: '#aaa' }}>
              {feedbackCount} {feedbackCount === 1 ? 'input' : 'inputs'} ready to apply
            </p>
          )}
        </div>
      </div>
    );
    /* ── Paywall UI (disabled during beta) ──────────────────────────────
    return (
      <div style={{ background: C.white, borderRadius: 2, border: `1px solid ${C.oceanTeal}20`, boxShadow: `0 2px 16px ${C.oceanTeal}08`, padding: '24px 20px', marginTop: 20, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: `${C.oceanTeal}10`, border: `1px solid ${C.oceanTeal}20`, marginBottom: 14 }}>
          <SparkleIcon size={12} color={C.oceanTeal} />
          <span className="font-body text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: C.oceanTeal }}>Lila Pro</span>
        </div>
        <h3 className="font-body text-[18px] font-semibold mb-1.5" style={{ color: C.slate }}>Keep refining your perfect trip</h3>
        <p className="font-body text-[14px] leading-[1.6]" style={{ color: `${C.slate}99`, maxWidth: 380, margin: '0 auto 18px' }}>
          You've used your {maxFree} free refinements. Upgrade to continue iterating and unlock the full trip planning toolkit.
        </p>
        <div ref={featuresRef} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '0 auto 20px', textAlign: 'left' }}>
          {[
            { icon: <RefreshIcon size={13} color={C.oceanTeal} />, text: 'Unlimited refinements' },
            { icon: <PlaneIcon size={13} color={C.oceanTeal} />, text: 'Add flights & arrival times' },
            { icon: <CarIcon size={13} color={C.oceanTeal} />, text: 'Rental car & route planning' },
            { icon: <LockIcon size={13} color={C.oceanTeal} />, text: 'Save & share your trip' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${C.oceanTeal}08`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
              <span className="font-body text-[14px] font-medium" style={{ color: `${C.slate}AA` }}>{f.text}</span>
            </div>
          ))}
        </div>
        <button onClick={onUpgradeClick} className="font-body text-[14px] font-semibold" style={{ color: C.white, background: C.oceanTeal, border: 'none', borderRadius: 24, padding: '12px 28px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 12px ${C.oceanTeal}25`, transition: 'all 0.2s' }}>
          Upgrade to Lila Pro
        </button>
        <div className="font-body text-[12px] mt-2" style={{ color: `${C.slate}65` }}>Starting at $9/trip</div>
      </div>
    );
    ────────────────────────────────────────────────────────────────────── */
  }

  return (
    <div style={{ textAlign: 'center', padding: '24px 20px 0' }}>
      <button onClick={onRefine} disabled={!hasFeedback || isRefining} className="font-body text-[14px] font-semibold" style={{
        color: hasFeedback && !isRefining ? C.white : `${C.sage}80`,
        background: hasFeedback && !isRefining ? C.oceanTeal : `${C.sage}08`,
        border: hasFeedback && !isRefining ? 'none' : `1px solid ${C.sage}15`,
        borderRadius: 24, padding: '12px 28px',
        cursor: hasFeedback && !isRefining ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: hasFeedback && !isRefining ? `0 2px 12px ${C.oceanTeal}20` : 'none',
        transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 7,
        opacity: isRefining ? 0.5 : 1,
      }}>
        <SparkleIcon size={14} color={hasFeedback && !isRefining ? C.white : `${C.sage}40`} />
        {isRefining ? 'Refining...' : (feedbackCount > 0 ? `Refine this trip · ${feedbackCount}` : 'Refine this trip')}
      </button>
      <div className="font-body text-[12px] mt-2" style={{ color: `${C.slate}65` }}>
        {remaining} free refinement{remaining !== 1 ? 's' : ''} remaining
      </div>
      {feedbackCount > 0 && !isRefining ? (
        <p className="font-body text-[11px] tracking-[0.04em] mt-1 text-center" style={{ color: '#aaa' }}>
          {feedbackCount} {feedbackCount === 1 ? 'input' : 'inputs'} ready to apply
        </p>
      ) : !hasFeedback && (
        <div className="font-body text-[12px] mt-1" style={{ color: `${C.sage}90`, fontStyle: 'normal' }}>
          Add day feedback or rate the overall trip to enable refinement
        </div>
      )}
    </div>
  );
}

/* ── refining overlay ──────────────────────────────────────────────────── */

const REFINING_STEPS = [
  'Reviewing your feedback',
  'Reshaping the itinerary',
  'Polishing the details',
  'Finalizing your revision',
];

function RefiningOverlay({ visible, iteration = 0, days = 4, apiDone, onDismiss, error, onRetry }) {
  const [completedIndex, setCompletedIndex] = useState(-1);
  const [breathPhase, setBreathPhase] = useState(0);
  const allDone = completedIndex >= REFINING_STEPS.length - 1;
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  // Reset state when overlay becomes visible
  useEffect(() => {
    if (visible) {
      setCompletedIndex(-1);
      setBreathPhase(0);
    }
  }, [visible]);

  // Step timings — advance through steps but HOLD before the final step until API responds
  useEffect(() => {
    if (!visible) return;
    const lastIdx = REFINING_STEPS.length - 1;
    // Time budget for the non-final steps (spread across steps 0 to lastIdx-1)
    const total = 18000 + days * 6000;
    const stepsBeforeFinal = lastIdx; // e.g. 3 steps before "Finalizing"
    const weights = Array.from({ length: stepsBeforeFinal }, (_, i) => Math.pow(i + 1, 1.4));
    const sumW = weights.reduce((a, b) => a + b, 0);
    let cumulative = 0;
    const timings = weights.map(w => {
      cumulative += w;
      return Math.round(total * (cumulative / sumW));
    });
    // Only advance through steps 0..lastIdx-1 on timers (never the final step)
    const timeouts = timings.map((delay, i) =>
      setTimeout(() => setCompletedIndex(i), delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [visible, days]);

  // When API responds (apiDone), advance to final step then dismiss
  useEffect(() => {
    if (!apiDone || !visible) return;
    // Jump to final step
    setCompletedIndex(REFINING_STEPS.length - 1);
    const t = setTimeout(() => onDismissRef.current?.(), 2500);
    return () => clearTimeout(t);
  }, [apiDone, visible]);

  // Breathing animation
  useEffect(() => {
    if (!visible) return;
    let frame;
    const start = Date.now();
    const cycle = 4000;
    function tick() {
      const t = ((Date.now() - start) % cycle) / cycle;
      setBreathPhase(Math.sin(t * Math.PI));
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  if (!visible) return null;

  const ringScale = 0.9 + breathPhase * 0.1;
  const maxFree = 10;
  const remaining = maxFree - iteration;

  // Error state — shown inside the overlay so it's unmissable
  if (error) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(180deg, ${C.cream} 0%, ${C.white} 40%, ${C.cream} 100%)`,
        padding: '40px 28px',
      }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${C.sunSalmon}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.sunSalmon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="font-serif text-[clamp(20px,5vw,26px)] font-light mb-2 text-center" style={{ color: C.slate }}>
          Refinement didn't go through
        </div>
        <div className="font-body text-[14px] font-normal leading-[1.5] text-center mb-7" style={{ color: `${C.slate}90`, maxWidth: 320 }}>
          {error}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onRetry} className="font-body text-[14px] font-semibold" style={{ color: C.white, background: C.oceanTeal, border: 'none', borderRadius: 24, padding: '10px 24px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            Try again
          </button>
          <button onClick={() => onDismissRef.current?.()} className="font-body text-[14px] font-medium" style={{ color: `${C.slate}80`, background: 'none', border: `1px solid ${C.slate}20`, borderRadius: 24, padding: '10px 24px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(180deg, ${C.cream} 0%, ${C.white} 40%, ${C.cream} 100%)`,
      padding: '40px 28px',
    }}>
      {/* Breathing Ensō ring */}
      <div style={{
        position: 'relative', width: 80, height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <div style={{
          position: 'absolute', inset: -12,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.oceanTeal}${Math.round((0.06 + breathPhase * 0.1) * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          transform: `scale(${ringScale})`,
        }} />
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: `scale(${ringScale})` }}>
          <circle cx="40" cy="40" r="32" fill="none" stroke={`${C.sage}20`} strokeWidth="1.5" />
          <circle cx="40" cy="40" r="32" fill="none"
            stroke={C.oceanTeal} strokeWidth="2" strokeLinecap="round"
            strokeDasharray={`${Math.PI * 64}`}
            strokeDashoffset={`${Math.PI * 64 * (1 - (0.7 + breathPhase * 0.28))}`}
            opacity={0.5 + breathPhase * 0.5}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        </svg>
      </div>

      {/* Headline */}
      <div className="font-serif text-[clamp(22px,5.5vw,28px)] font-light mb-1.5 text-center" style={{
        color: C.slate,
      }}>Refining your trip</div>

      {/* Subtitle */}
      <div className="font-body text-[14px] font-normal mb-7 text-center" style={{
        color: C.sage, opacity: 0.75,
      }}>Incorporating your feedback into a new draft.</div>

      {/* Step indicators — dots + labels */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 10, width: '100%', maxWidth: 260, marginBottom: 20,
      }}>
        {REFINING_STEPS.map((step, i) => {
          const isComplete = i <= completedIndex;
          const isActive = i === completedIndex + 1 && !allDone;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: isComplete ? 0.4 : isActive ? 1 : 0.25,
              transition: 'opacity 0.7s ease',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: isComplete ? C.oceanTeal : isActive ? C.oceanTeal : `${C.sage}30`,
                transition: 'background 0.5s',
              }} />
              <span className="font-body text-[13px]" style={{
                fontWeight: isActive ? 600 : 400,
                color: isActive ? C.slate : C.sage,
                transition: 'all 0.5s',
              }}>{step}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%', maxWidth: 200,
        height: 2, borderRadius: 1,
        background: `${C.sage}12`,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 1,
          background: C.oceanTeal,
          width: `${Math.min(100, ((completedIndex + 1) / REFINING_STEPS.length) * 100)}%`,
          transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>

      {/* Step counter */}
      <div className="font-body text-[11px] font-medium tracking-[0.12em] uppercase mt-2" style={{
        color: `${C.sage}99`,
      }}>
        {allDone ? 'Finalizing...' : `${Math.max(0, completedIndex + 1)} of ${REFINING_STEPS.length}`}
      </div>

      {/* Refinement quota callout */}
      <div className="font-body text-[12px] font-normal mt-5 text-center" style={{
        color: C.muted,
      }}>
        {remaining > 0
          ? `You have ${remaining} free refinement${remaining !== 1 ? 's' : ''} remaining after this`
          : 'This is your last free refinement'}
      </div>
    </div>
  );
}

/* ── version badge ─────────────────────────────────────────────────────── */

function VersionBadge({ iteration }) {
  if (iteration === 0) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 8, background: `${C.oceanTeal}08`, border: `1px solid ${C.oceanTeal}15`, marginBottom: 8 }}>
      <SparkleIcon size={10} color={C.oceanTeal} />
      <span className="font-body text-[11px] font-semibold tracking-[0.06em]" style={{ color: C.oceanTeal }}>Revision {iteration}</span>
    </div>
  );
}

/* ── markdown rendering ────────────────────────────────────────────────── */

function renderInlineBlock(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.trim() === '') return <div key={i} style={{ height: 3 }} />;
    return <p key={i} style={{ margin: '3px 0' }}>{renderInline(line)}</p>;
  });
}

function renderInline(text) {
  if (!text || typeof text !== 'string') return text;
  const parts = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    let earliest = null, type = null;
    if (boldMatch && (!earliest || boldMatch.index < earliest.index)) { earliest = boldMatch; type = 'bold'; }
    if (italicMatch && (!earliest || italicMatch.index < earliest.index)) { earliest = italicMatch; type = 'italic'; }
    if (!earliest) { parts.push(remaining); break; }
    if (earliest.index > 0) parts.push(remaining.slice(0, earliest.index));
    if (type === 'bold') parts.push(<strong key={key++} style={{ fontWeight: 700, color: C.slate }}>{earliest[1]}</strong>);
    else parts.push(<em key={key++} style={{ fontStyle: 'normal', color: `${C.slate}AA` }}>{earliest[1]}</em>);
    remaining = remaining.slice(earliest.index + earliest[0].length);
  }
  return parts.length > 0 ? parts : text;
}

function MarkdownContent({ content }) {
  if (!content || typeof content !== 'string') return null;
  const lines = content.split('\n');
  const elements = [];
  let key = 0;
  for (const line of lines) {
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={key++} style={{ border: 'none', borderTop: `1px solid ${C.sage}15`, margin: '28px 0' }} />);
    } else if (/^# [^#]/.test(line)) {
      elements.push(<h1 key={key++} className="font-body text-[clamp(26px,7vw,34px)] font-semibold leading-[1.2]" style={{ color: C.slate, margin: '28px 0 10px' }}>{renderInline(line.slice(2))}</h1>);
    } else if (/^## [^#]/.test(line)) {
      elements.push(<h2 key={key++} className="font-body text-[clamp(20px,5.5vw,26px)] font-semibold" style={{ color: C.slate, margin: '24px 0 8px' }}>{renderInline(line.slice(3))}</h2>);
    } else if (/^### /.test(line)) {
      elements.push(<h3 key={key++} className="font-body text-[14px] font-bold" style={{ color: C.sage, margin: '18px 0 6px' }}>{renderInline(line.slice(4))}</h3>);
    } else if (/^\s*[-*] /.test(line)) {
      elements.push(<div key={key++} style={{ display: 'flex', gap: 8, padding: '3px 0' }}><span style={{ color: C.sage, flexShrink: 0 }}>•</span><span className="font-body text-[14px] leading-[1.65]" style={{ color: C.slate }}>{renderInline(line.replace(/^\s*[-*] /, ''))}</span></div>);
    } else if (/^\d+\.\s/.test(line)) {
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        elements.push(<div key={key++} style={{ display: 'flex', gap: 8, padding: '3px 0' }}><span className="font-body text-[13px] font-bold shrink-0 min-w-[18px]" style={{ color: C.sage }}>{numMatch[1]}.</span><span className="font-body text-[14px] leading-[1.65]" style={{ color: C.slate }}>{renderInline(numMatch[2])}</span></div>);
      }
    } else if (/^>\s/.test(line)) {
      elements.push(<div key={key++} className="font-body text-[clamp(15px,4vw,18px)] leading-[1.6]" style={{ borderLeft: `3px solid ${C.oceanTeal}30`, paddingLeft: 14, margin: '12px 0', fontStyle: 'normal', color: `${C.slate}AA` }}>{renderInline(line.slice(2))}</div>);
    } else if (line.trim() === '') {
      elements.push(<div key={key++} style={{ height: 6 }} />);
    } else {
      elements.push(<p key={key++} className="font-body text-[14px] leading-[1.75]" style={{ color: C.slate, margin: '5px 0' }}>{renderInline(line)}</p>);
    }
  }
  return <>{elements}</>;
}

/* ── session key for iteration persistence ─────────────────────────────── */

function tripSessionKey(rawItinerary, formData) {
  // Build a short stable string from the trip title + dates/month
  let seed = '';
  try {
    let cleaned = rawItinerary || '';
    cleaned = cleaned.replace(/```(?:json)?\s*/gi, '');
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
    const parsed = JSON5.parse(cleaned);
    seed += parsed.title || '';
  } catch { /* use whatever seed we have */ }
  if (formData?.dates?.start) seed += `|${formData.dates.start}`;
  if (formData?.dates?.end) seed += `|${formData.dates.end}`;
  if (formData?.month) seed += `|${formData.month}`;
  if (formData?.destination) seed += `|${formData.destination}`;
  // Simple djb2 hash → compact numeric key
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) + hash + seed.charCodeAt(i)) >>> 0;
  }
  return `lila_iter_${hash}`;
}

/* ── FirstDraftModal — shown once on iteration 0 ──────────────────────── */

function FirstDraftModal({ onDismiss }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 120); return () => clearTimeout(t); }, []);

  const reactions = [
    { icon: LockIcon, color: C.goldenAmber, label: 'Lock this in', desc: 'Confirm this — keep it in',
      bg: `${C.goldenAmber}18`, border: `${C.goldenAmber}40` },
    { icon: SwapIcon, color: C.oceanTeal, label: 'Show Alternatives', desc: 'See other options and swap',
      bg: `${C.oceanTeal}15`, border: `${C.oceanTeal}38` },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        position: 'relative',
        maxWidth: 480, margin: '0 auto',
        background: C.cream, borderRadius: 2,
        padding: '40px 32px 32px',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        {/* Close button */}
        <button onClick={onDismiss} style={{
          position: 'absolute', top: 16, right: 16,
          width: 28, height: 28, borderRadius: '50%',
          background: 'none', border: `1px solid ${C.sage}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${C.sage}06`; e.currentTarget.style.borderColor = `${C.sage}30`; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = `${C.sage}18`; }}
        >
          <CloseIcon size={11} color={C.sage} />
        </button>

        {/* Wordmark */}
        <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: `${C.sage}75` }}>Lila Trips</div>

        {/* Headline */}
        <h2 className="font-serif text-[clamp(22px,5.5vw,28px)] font-light leading-[1.25] tracking-[-0.02em] mb-3" style={{ color: C.ink }}>Your itinerary is ready to explore.</h2>

        {/* Body */}
        <p className="font-body text-[14px] font-normal leading-[1.75] mb-7" style={{ color: `${C.slate}D9` }}>We built this around what you shared with us. Read through it, react to what stands out, and we'll keep shaping it until it's yours.</p>

        {/* Divider */}
        <div style={{ height: 1, background: `${C.sage}10`, marginBottom: 24 }} />

        {/* Section header */}
        <div className="font-body text-[15px] font-bold mb-1" style={{ color: C.ink }}>As you read, tell us how it's landing.</div>
        <div className="font-body text-[13px] font-normal leading-[1.6] mb-4" style={{ color: `${C.slate}99` }}>Each activity has three reactions — use them as you go.</div>

        {/* Reaction rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 0 }}>
          {reactions.map((r, i) => {
            const Ic = r.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 2,
                  background: r.bg, border: `1px solid ${r.border}`,
                  flexShrink: 0,
                }}>
                  <Ic size={13} color={r.color} active />
                  <span className="font-body text-[11px] font-semibold" style={{ color: r.color }}>{r.label}</span>
                </div>
                <span className="font-body text-[13px] font-medium" style={{ color: `${C.slate}CC` }}>{r.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `${C.sage}10`, marginTop: 28, marginBottom: 20 }} />

        {/* Logistics note */}
        <p className="font-body text-[12px] font-normal leading-[1.6] text-center" style={{ color: `${C.darkInk}8C`, maxWidth: 320, margin: '0 auto 24px' }}>
          Add flights, hotel confirmations, or restaurant reservations in the logistics panel — we'll build around them.
        </p>

        {/* CTA */}
        <button onClick={onDismiss} className="font-body text-[13px] font-bold" style={{
          width: '100%', padding: '14px 0',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: C.cream, background: C.slate,
          border: 'none', borderRadius: 2,
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >Start exploring →</button>
      </div>
    </div>
  );
}

/* ── RefinementModal — shown after each refinement completes ──────────── */

function RefinementModal({ onDismiss, iteration, changes = [] }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 120); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        position: 'relative',
        maxWidth: 480, margin: '0 auto',
        background: C.cream, borderRadius: 2,
        padding: '40px 32px 32px',
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        {/* Close button */}
        <button onClick={onDismiss} style={{
          position: 'absolute', top: 16, right: 16,
          width: 28, height: 28, borderRadius: '50%',
          background: 'none', border: `1px solid ${C.sage}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${C.sage}06`; e.currentTarget.style.borderColor = `${C.sage}30`; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = `${C.sage}18`; }}
        >
          <CloseIcon size={11} color={C.sage} />
        </button>

        {/* Top label */}
        <div className="font-body text-[9px] font-bold tracking-[0.2em] uppercase mb-5" style={{ color: `${C.sage}75` }}>Refinement {iteration}</div>

        {/* Headline */}
        <h2 className="font-serif text-[clamp(22px,5.5vw,28px)] font-light leading-[1.25] tracking-[-0.02em] mb-3" style={{ color: C.ink }}>Your itinerary has been updated.</h2>

        {/* Divider */}
        <div style={{ height: 1, background: `${C.sage}10`, marginBottom: 24 }} />

        {/* Changes section header */}
        <div className="font-body text-[10px] font-bold tracking-[0.15em] uppercase mb-3.5" style={{ color: `${C.sage}75` }}>What we adjusted</div>

        {/* Changes list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {changes.length > 0 ? changes.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <span className="font-body text-[13px] shrink-0" style={{ color: `${C.goldenAmber}99` }}>{'\u25C8'}</span>
              <span className="font-body text-[13px] font-normal leading-[1.6]" style={{ color: `${C.darkInk}B3` }}>{c}</span>
            </div>
          )) : (
            <div className="font-body text-[13px] font-normal leading-[1.6]" style={{ color: `${C.darkInk}B3` }}>
              We've reshaped your itinerary based on your feedback.
            </div>
          )}
        </div>

        {/* CTA */}
        <button onClick={onDismiss} className="font-body text-[13px] font-bold" style={{
          width: '100%', padding: '14px 0',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: C.cream, background: C.slate,
          border: 'none', borderRadius: 2,
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >See what's new &rarr;</button>
      </div>
    </div>
  );
}

/* ── SwapModal — pick an alternative activity ──────────────────────────── */

function SwapModal({ isOpen, onClose, activityTitle, alternatives, onConfirm, alternativesLoading, onLoadMore, loadingMore }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setNote('');
      const t = setTimeout(() => setShow(true), 30);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(t);
    } else {
      setShow(false);
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasAlts = alternatives && alternatives.length > 0;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      opacity: show ? 1 : 0,
      transition: 'opacity 0.25s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 420,
        background: C.white, borderRadius: 10,
        padding: '28px 24px 24px',
        maxHeight: '85vh', overflowY: 'auto',
        transform: show ? 'translateY(0)' : 'translateY(12px)',
        transition: 'transform 0.25s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span className="font-body text-[13px] font-bold tracking-[0.12em] uppercase" style={{ color: `${C.sage}90` }}>Explore alternatives</span>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'none', border: `1px solid ${C.sage}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          }}>
            <CloseIcon size={11} color={C.sage} />
          </button>
        </div>

        {/* Currently planned */}
        <div style={{ marginBottom: 20 }}>
          <div className="font-body text-[10px] font-semibold tracking-[0.12em] uppercase mb-1.5" style={{ color: C.muted }}>Currently planned</div>
          <div className="font-serif text-[17px] font-normal leading-[1.3]" style={{ color: C.ink }}>{activityTitle}</div>
        </div>

        {/* Alternatives */}
        <div style={{ marginBottom: 18 }}>
          <div className="font-body text-[10px] font-semibold tracking-[0.12em] uppercase mb-2.5" style={{ color: C.muted }}>Alternatives</div>
          {hasAlts ? alternatives.map((alt, i) => {
            const isSelected = selected === i;
            return (
              <div key={i} onClick={() => setSelected(i)} style={{
                padding: '12px 14px',
                borderRadius: 8,
                border: `1.5px solid ${isSelected ? C.goldenAmber : C.border}`,
                background: isSelected ? `${C.goldenAmber}08` : 'transparent',
                marginBottom: 8,
                cursor: 'pointer',
                transition: 'all 0.15s',
                WebkitTapHighlightColor: 'transparent',
              }}>
                <div className="font-body text-[14px] font-semibold mb-[3px]" style={{ color: C.ink }}>{alt.title}</div>
                <div className="font-body text-[13px] font-normal leading-[1.5]" style={{ color: C.body }}>{alt.summary}</div>
              </div>
            );
          }) : alternativesLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0' }}>
              <div style={{
                width: 16, height: 16, border: `2px solid ${C.sage}30`, borderTopColor: C.sage,
                borderRadius: '50%', animation: 'lila-spin 0.8s linear infinite',
              }} />
              <span className="font-body text-[13px] font-normal" style={{ color: C.muted }}>Loading alternatives...</span>
              </div>
          ) : (
            <div className="font-body text-[13px] font-normal leading-[1.6] py-2" style={{ color: C.muted }}>
              No alternatives available — your feedback will be noted in the next refinement.
            </div>
          )}
        </div>

        {/* Load more alternatives */}
        {hasAlts && !alternativesLoading && (
          <button
            disabled={loadingMore}
            onClick={() => onLoadMore?.()}
            className="font-body text-[12px] font-semibold"
            style={{
              background: 'none', border: `1px solid ${C.sage}25`, borderRadius: 8,
              padding: '8px 14px', cursor: loadingMore ? 'default' : 'pointer',
              color: C.sage,
              display: 'flex', alignItems: 'center', gap: 6,
              marginBottom: 8, opacity: loadingMore ? 0.6 : 1,
              transition: 'opacity 0.2s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {loadingMore ? (
              <>
                <div style={{
                  width: 12, height: 12, border: `1.5px solid ${C.sage}30`, borderTopColor: C.sage,
                  borderRadius: '50%', animation: 'lila-spin 0.8s linear infinite',
                }} />
                Loading more...
              </>
            ) : (
              <>
                <SwapIcon size={11} color={C.sage} />
                Load more alternatives
              </>
            )}
          </button>
        )}

        {/* Optional note */}
        <div style={{ marginBottom: 20 }}>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Looking for something specific? (optional)"
            rows={2}
            className="font-body text-[13px] font-normal"
            style={{
              width: '100%', padding: '10px 12px',
              color: C.ink, background: C.warm,
              border: `1px solid ${C.sage}25`, borderRadius: 8,
              resize: 'vertical', lineHeight: 1.5,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="font-body text-[13px] font-semibold" style={{
            color: C.muted, background: 'none',
            border: 'none', cursor: 'pointer', padding: '10px 16px',
            WebkitTapHighlightColor: 'transparent',
          }}>Cancel</button>
          <button
            disabled={!hasAlts || selected === null}
            onClick={() => {
              if (selected !== null && alternatives[selected]) {
                onConfirm(alternatives[selected], note);
              }
            }}
            className="font-body text-[13px] font-bold"
            style={{
              color: (hasAlts && selected !== null) ? '#9a7530' : C.muted,
              background: (hasAlts && selected !== null) ? `${C.goldenAmber}12` : `${C.sage}08`,
              border: `1.5px solid ${(hasAlts && selected !== null) ? C.goldenAmber : `${C.sage}20`}`,
              borderRadius: 8, padding: '10px 20px',
              cursor: (hasAlts && selected !== null) ? 'pointer' : 'default',
              opacity: (hasAlts && selected !== null) ? 1 : 0.5,
              transition: 'all 0.2s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >Use this instead</button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast — brief auto-dismiss message ────────────────────────────────── */

function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;
    const tIn = setTimeout(() => setVisible(true), 30);
    const tOut = setTimeout(() => setVisible(false), 2200);
    const tDone = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(tIn); clearTimeout(tOut); clearTimeout(tDone); };
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="font-body text-[14px] font-semibold" style={{
      position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9998,
      color: C.ink, background: C.white,
      padding: '10px 22px', borderRadius: 10,
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.25s ease',
      pointerEvents: 'none',
    }}>{message}</div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* ── MAIN PAGE ─────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════ */

export default function ItineraryResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token: shareToken } = useParams(); // present when loaded via /trip/:token
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);
  const [refining, setRefining] = useState(false);
  const [refineApiDone, setRefineApiDone] = useState(false);
  const [loadingShared, setLoadingShared] = useState(!!shareToken);
  const [shareError, setShareError] = useState(null);

  // Seed from router state, then sessionStorage fallback, then own locally
  // When loading via share link, ignore stale sessionStorage — always fetch fresh
  const [rawItinerary, setRawItinerary] = useState(() => {
    if (shareToken) return null; // force fetch from API
    if (location.state?.itinerary) return location.state.itinerary;
    try { return sessionStorage.getItem('lila_raw_itinerary') || null; } catch { return null; }
  });
  const [metadata] = useState(() => {
    if (location.state?.metadata) return location.state.metadata;
    try { const m = sessionStorage.getItem('lila_metadata'); return m ? JSON.parse(m) : null; } catch { return null; }
  });
  const [formData, setFormData] = useState(() => {
    if (location.state?.formData) return location.state.formData;
    try { const f = sessionStorage.getItem('lila_form_data'); return f ? JSON.parse(f) : null; } catch { return null; }
  });

  // Persist itinerary data to sessionStorage so backpack nav link works
  useEffect(() => {
    try { if (rawItinerary) sessionStorage.setItem('lila_raw_itinerary', rawItinerary); } catch { /* quota */ }
  }, [rawItinerary]);
  useEffect(() => {
    try { if (formData) sessionStorage.setItem('lila_form_data', JSON.stringify(formData)); } catch { /* quota */ }
  }, [formData]);
  useEffect(() => {
    try { if (metadata) sessionStorage.setItem('lila_metadata', JSON.stringify(metadata)); } catch { /* quota */ }
  }, [metadata]);

  // Trip logistics form state — declared early because fetchSharedTrip and persistence effects need it
  const [tripLogistics, setTripLogistics] = useState({
    flights: [],
    rentals: [],
    accommodations: [],
    reservations: [],
  });

  // Hydrate via server-side API when accessed via a share link (/trip/:token)
  // Uses the service role key on the server to bypass RLS policies
  const fetchSharedTrip = async (token) => {
    setShareError(null);
    setLoadingShared(true);
    const { signal, clear } = fetchWithTimeout(30000);
    try {
      const res = await fetch(`/api/get-shared-trip?token=${encodeURIComponent(token)}`, { signal });
      clear();
      const { ok, data, error } = await safeJson(res);
      if (!ok) {
        console.error('[SharedTrip] API error', error);
        setShareError(`Could not load trip — ${error}`);
        setLoadingShared(false);
        return;
      }
      if (!data.rawItinerary) {
        console.error('[SharedTrip] API returned empty itinerary', data);
        setShareError('This trip has no itinerary data');
        setLoadingShared(false);
        return;
      }
      console.log('[SharedTrip] loaded', { id: data.id });
      setRawItinerary(data.rawItinerary);
      setItineraryId(data.id);
      setLoadingShared(false);
      if (data.formData) setFormData(data.formData);
      if (data.tripLogistics) setTripLogistics(data.tripLogistics);
    } catch (e) {
      clear();
      console.error('[SharedTrip] fetch exception', e);
      setShareError(e.name === 'AbortError' ? 'Loading timed out — please refresh' : 'Network error — check your connection');
      setLoadingShared(false);
    }
  };

  useEffect(() => {
    if (!shareToken || rawItinerary) return;
    fetchSharedTrip(shareToken);
  }, [shareToken]);

  // Iteration counter — persisted in sessionStorage keyed to this trip
  const sessionKey = useMemo(
    () => tripSessionKey(location.state?.itinerary || rawItinerary, location.state?.formData || formData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []  // stable across the lifetime of this page; only computed once
  );
  const [iteration, setIteration] = useState(() => {
    try { return Number(sessionStorage.getItem(sessionKey)) || 0; } catch { return 0; }
  });
  useEffect(() => {
    try { sessionStorage.setItem(sessionKey, String(iteration)); } catch { /* storage full / unavailable */ }
  }, [sessionKey, iteration]);

  const dayRefs = useRef([]);

  // Feedback state
  const [dayFeedback, setDayFeedback] = useState({});
  const [lockedItems, setLockedItems] = useState({});
  // key: thumbId (e.g. "day_0_timeline_2")
  // value: { source: 'user' | 'booking', bookingType?: 'flight' | 'rental' | 'accommodation' }
  const [swapModal, setSwapModal] = useState(null); // { dayIndex, itemIndex, thumbId, activityTitle, alternatives }
  const [swappedActivities, setSwappedActivities] = useState({});
  // Two-pass alternatives loading state
  const [alternativesLoaded, setAlternativesLoaded] = useState(false);
  const [alternativesLoading, setAlternativesLoading] = useState(false);
  const [loadingMoreAlts, setLoadingMoreAlts] = useState(null); // thumbId being loaded
  const [toastMessage, setToastMessage] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [overallNote, setOverallNote] = useState('');
  const [refineError, setRefineError] = useState(null);
  const [refineConfirmOpen, setRefineConfirmOpen] = useState(false);
  const [logisticsBaseline, setLogisticsBaseline] = useState(0); // booking count at last refinement

  // Save panel state
  const [savePanelOpen, setSavePanelOpen] = useState(false);

  // Trip title — shared editable state (sync effect is after itinerary useMemo below)
  const [tripTitle, setTripTitle] = useState('');
  const [editingHeroTitle, setEditingHeroTitle] = useState(false);
  const [draftHeroTitle, setDraftHeroTitle] = useState('');
  const heroTitleRef = useRef(null);

  // First draft modal state
  const [showDraftModal, setShowDraftModal] = useState(() => !shareToken);

  // Refinement modal state
  const [showRefinementModal, setShowRefinementModal] = useState(false);
  const [refinementChanges, setRefinementChanges] = useState([]);

  // Itinerary ID for save/share
  const [itineraryId, setItineraryId] = useState(() =>
    sessionStorage.getItem('lila_itinerary_id') || null
  );

  // Persist tripLogistics to DB when user adds/edits bookings
  const logisticsDebounce = useRef(null);
  useEffect(() => {
    const hasData = tripLogistics.flights.length || tripLogistics.rentals.length || tripLogistics.accommodations.length || tripLogistics.reservations.length;
    if (!hasData || !itineraryId) return;
    clearTimeout(logisticsDebounce.current);
    logisticsDebounce.current = setTimeout(() => updateTripLogistics(itineraryId, tripLogistics), 1500);
  }, [tripLogistics, itineraryId]);

  // Detail panel state — unified for activities, picks, and companion cards
  const [activePanel, setActivePanel] = useState(null); // { type, data, thumbId }

  // Lock body scroll when panel is open
  useEffect(() => {
    if (activePanel) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activePanel]);

  useEffect(() => {
    // Don't redirect while still loading a shared trip, or if there's a share error (show error UI instead)
    if (loadingShared) return;
    if (shareError) return;
    if (!rawItinerary) { navigate('/plan'); return; }
    setTimeout(() => setVisible(true), 100);
    // Append trip to lila_trips array (multi-trip support)
    const tripId = crypto.randomUUID();
    const path = shareToken ? `/trip/${shareToken}` : '/itinerary';
    const newTrip = {
      id: tripId,
      path,
      destination: formData?.destination || 'Your Trip',
      title: null,
      generatedAt: Date.now(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('lila_trips') || '[]');
      // Deduplicate by path (for shared links reloaded)
      const filtered = existing.filter(t => t.path !== path);
      const updated = [newTrip, ...filtered].slice(0, 10);
      localStorage.setItem('lila_trips', JSON.stringify(updated));
      sessionStorage.setItem('lila_trip_id', tripId);
      window.dispatchEvent(new Event('lila_trips_changed'));
    } catch {}
  }, [rawItinerary, navigate, loadingShared, shareToken, formData, shareError]);

  // Parse itinerary — re-parses only when rawItinerary changes (i.e. after refinement)
  const itinerary = useMemo(() => {
    if (!rawItinerary) return null;
    try {
      let cleaned = rawItinerary;
      // Strip markdown code fences (```json, ```)
      cleaned = cleaned.replace(/```(?:json)?\s*/gi, '');
      // Extract JSON object
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
      // Remove trailing commas before } or ]
      cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
      return JSON5.parse(cleaned);
    } catch (e) {
      console.error('JSON parse failed, using markdown fallback:', e.message);
      return null;
    }
  }, [rawItinerary]);

  const isStructured = itinerary && itinerary.days;

  // Sync tripTitle from parsed itinerary
  useEffect(() => {
    if (itinerary?.title && !tripTitle) setTripTitle(itinerary.title);
  }, [itinerary?.title]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist title rename to Supabase + localStorage
  const persistTitle = (newTitle) => {
    if (itineraryId) updateItineraryTitle(itineraryId, newTitle);
    const tripId = sessionStorage.getItem('lila_trip_id');
    if (tripId) {
      try {
        const trips = JSON.parse(localStorage.getItem('lila_trips') || '[]');
        const idx = trips.findIndex(t => t.id === tripId);
        if (idx !== -1) {
          trips[idx].title = newTitle;
          localStorage.setItem('lila_trips', JSON.stringify(trips));
          window.dispatchEvent(new Event('lila_trips_changed'));
        }
      } catch {}
    }
  };

  const handleHeroTitleClick = () => {
    setDraftHeroTitle(tripTitle);
    setEditingHeroTitle(true);
    setTimeout(() => heroTitleRef.current?.select(), 0);
  };

  const commitHeroTitle = () => {
    const trimmed = draftHeroTitle.trim();
    if (trimmed && trimmed !== tripTitle) {
      setTripTitle(trimmed);
      persistTitle(trimmed);
    }
    setEditingHeroTitle(false);
  };

  const handleHeroTitleKeyDown = (e) => {
    if (e.key === 'Enter') commitHeroTitle();
    if (e.key === 'Escape') setEditingHeroTitle(false);
  };

  // Enrich days with companion data from practices service
  const baseDays = useMemo(() => {
    if (!isStructured || !formData) return itinerary?.days || [];
    try {
      const practiceResults = getPracticesForItinerary(formData);
      return assignCompanions(itinerary.days, practiceResults);
    } catch (e) {
      console.error('Companion assignment failed, using plain days:', e.message);
      return itinerary.days;
    }
  }, [isStructured, itinerary, formData]);
  const [enrichedDays, setEnrichedDays] = useState(baseDays);
  // Keep enrichedDays in sync with baseDays when itinerary changes (refinement)
  useEffect(() => {
    setEnrichedDays(baseDays);
    setAlternativesLoaded(false);
    setAlternativesLoading(false);
    setSwapModal(null);
  }, [baseDays]);

  // Auto-lock timeline items that correspond to bookings
  useEffect(() => {
    if (!enrichedDays?.length) return;
    setLockedItems(prev => {
      const next = { ...prev };
      // Remove stale booking locks
      for (const [key, val] of Object.entries(next)) {
        if (val.source === 'booking') delete next[key];
      }
      const flights = tripLogistics?.flights || [];
      const rentals = tripLogistics?.rentals || [];
      const accoms = tripLogistics?.accommodations || [];

      // Collect airport codes and hotel names from bookings for fuzzy matching
      const airportCodes = new Set();
      for (const f of flights) {
        if (f.departureAirport) airportCodes.add(f.departureAirport.toLowerCase());
        if (f.arrivalAirport) airportCodes.add(f.arrivalAirport.toLowerCase());
      }
      const hotelNames = accoms.map(a => (a.name || '').toLowerCase()).filter(Boolean);

      enrichedDays.forEach((day, dayIdx) => {
        if (!day.timeline) return;
        day.timeline.forEach((item, itemIdx) => {
          const title = (item.title || '').toLowerCase();
          const desc = (item.description || item.summary || '').toLowerCase();
          const text = `${title} ${desc}`;
          const thumbId = `day_${dayIdx}_timeline_${itemIdx}`;

          // Flight-related: keyword match or airport code in title
          if (flights.length > 0) {
            const flightKeywords = ['flight', 'fly', 'airport', 'depart', 'arrive', 'land at', 'take off', 'board'];
            const hasKeyword = flightKeywords.some(k => title.includes(k));
            const hasAirportCode = [...airportCodes].some(code => title.includes(code));
            if (hasKeyword || hasAirportCode) {
              next[thumbId] = { source: 'booking', bookingType: 'flight' };
            }
          }

          // Drive/transit tied to logistics: airport-to-destination drives
          if ((flights.length > 0 || accoms.length > 0) && title.includes('drive') && [...airportCodes].some(code => title.includes(code))) {
            next[thumbId] = { source: 'booking', bookingType: 'flight' };
          }

          // Accommodation: check-in/out or hotel name match
          if (accoms.length > 0) {
            const accomKeywords = ['check in', 'check-in', 'check out', 'check-out', 'settle in'];
            const hasKeyword = accomKeywords.some(k => title.includes(k));
            const hasHotelName = hotelNames.some(name => name.length > 3 && title.includes(name));
            if (hasKeyword || hasHotelName) {
              next[thumbId] = { source: 'booking', bookingType: 'accommodation' };
            }
          }

          // Rental car
          if (rentals.length > 0) {
            const rentalKeywords = ['rental', 'pick up', 'pick-up', 'return car', 'car return'];
            if (rentalKeywords.some(k => text.includes(k))) {
              next[thumbId] = { source: 'booking', bookingType: 'rental' };
            }
          }
        });
      });
      return next;
    });
  }, [tripLogistics, enrichedDays]);

  const beforeYouGoRef = useRef(null);
  const scrollSentinels = useRef({});
  const pageLoadTime = useRef(performance.now());

  // Fire once on initial load when a structured itinerary renders successfully
  const hasTrackedGeneration = useRef(false);
  useEffect(() => {
    if (isStructured && !hasTrackedGeneration.current) {
      hasTrackedGeneration.current = true;
      trackEvent('itinerary_generation_completed', {
        destination: formData?.destination || undefined,
        duration_ms: Math.round(performance.now() - pageLoadTime.current),
        day_count: itinerary.days.length,
      });
      // Don't re-save when loading via share link — the itinerary already exists in the DB
      if (!shareToken) {
        saveItinerary({
          formData,
          rawItinerary,
          destination: formData?.destination,
          iteration: 0,
          tripLogistics,
        }).then(id => {
          if (id) {
            try { sessionStorage.setItem('lila_itinerary_id', id); } catch { /* quota */ }
            setItineraryId(id);
          }
        });
      }

      // Patch trip title in lila_trips array
      const tripId = sessionStorage.getItem('lila_trip_id');
      if (tripId && itinerary.title) {
        try {
          const trips = JSON.parse(localStorage.getItem('lila_trips') || '[]');
          const idx = trips.findIndex(t => t.id === tripId);
          if (idx !== -1) {
            trips[idx].title = itinerary.title;
            localStorage.setItem('lila_trips', JSON.stringify(trips));
            window.dispatchEvent(new Event('lila_trips_changed'));
          }
        } catch {}
      }
    }
  }, [isStructured, itinerary, formData]);

  // Pass 2: Fetch alternatives in the background after itinerary renders
  const hasRequestedAlts = useRef(false);
  const altsAbortRef = useRef(null);
  useEffect(() => {
    // Need the API-slug destination (e.g. 'big-sur', not 'bigSur')
    const destSlug = metadata?.destination || formData?.destination;
    console.log('[Alternatives] Guard check:', { isStructured, hasRaw: !!rawItinerary, destSlug, alternativesLoaded, alternativesLoading, hasRequested: hasRequestedAlts.current });
    if (!isStructured || !rawItinerary || !destSlug || alternativesLoaded || alternativesLoading || hasRequestedAlts.current) return;
    console.log('[Alternatives] Fetching for destination:', destSlug);
    hasRequestedAlts.current = true;
    setAlternativesLoading(true);

    // Abort any stale in-flight request (e.g. from pre-refinement itinerary)
    if (altsAbortRef.current) altsAbortRef.current.abort();
    const controller = new AbortController();
    altsAbortRef.current = controller;

    fetch('/api/generate-alternatives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: destSlug,
        preferences: formData,
        itinerary: rawItinerary,
      }),
      signal: controller.signal,
    })
      .then(res => safeJson(res))
      .then(({ ok, data: result }) => {
        if (!ok || !result?.success || !result.alternatives?.days) {
          console.warn('[Alternatives] No valid response:', result.error || 'unknown');
          setAlternativesLoading(false);
          return;
        }
        // Merge alternatives into enrichedDays
        setEnrichedDays(prev => {
          const updated = prev.map((day, di) => {
            const altDay = result.alternatives.days[di];
            if (!altDay) return day;

            const newDay = { ...day };

            // Merge timeline alternatives
            if (altDay.timelineAlts?.length && newDay.timeline) {
              newDay.timeline = [...newDay.timeline];
              for (const ta of altDay.timelineAlts) {
                if (ta.itemIndex < newDay.timeline.length && ta.alternatives?.length) {
                  newDay.timeline[ta.itemIndex] = {
                    ...newDay.timeline[ta.itemIndex],
                    alternatives: ta.alternatives,
                  };
                }
              }
            }

            // Merge pick alternatives
            if (altDay.pickAlts?.length && newDay.picks) {
              newDay.picks = [...newDay.picks];
              for (const pa of altDay.pickAlts) {
                if (pa.pickIndex < newDay.picks.length && pa.alternatives?.length) {
                  const oldPick = newDay.picks[pa.pickIndex];
                  newDay.picks[pa.pickIndex] = {
                    ...oldPick,
                    alternatives: pa.alternatives,
                    pick: oldPick.pick ? { ...oldPick.pick, alternatives: pa.alternatives } : oldPick.pick,
                  };
                }
              }
            }

            return newDay;
          });
          return updated;
        });
        setAlternativesLoaded(true);
        setAlternativesLoading(false);
        console.log('[Alternatives] Merged successfully', result.metadata?.timing);
      })
      .catch(err => {
        if (err.name === 'AbortError') return; // expected on refinement
        console.error('[Alternatives] Fetch failed:', err);
        setAlternativesLoading(false);
      });

    return () => controller.abort();
  }, [isStructured, rawItinerary, formData]);

  // Reset alternatives ref when itinerary changes (refinement)
  useEffect(() => {
    hasRequestedAlts.current = false;
  }, [rawItinerary]);

  // Keep swapModal alternatives in sync when enrichedDays updates (e.g. pass-2 fetch completes)
  useEffect(() => {
    if (!swapModal) return;
    const match = swapModal.thumbId.match(/^day_(\d+)_(timeline|pick)_(\d+)$/);
    if (!match) return;
    const [, dayIdx, type, itemIdx] = match;
    const day = enrichedDays[Number(dayIdx)];
    if (!day) return;
    let freshAlts = [];
    if (type === 'timeline' && day.timeline?.[Number(itemIdx)]) {
      freshAlts = day.timeline[Number(itemIdx)].alternatives || [];
    } else if (type === 'pick' && day.picks?.[Number(itemIdx)]) {
      const pick = day.picks[Number(itemIdx)];
      freshAlts = pick?.pick?.alternatives || pick?.alternatives || [];
    }
    // Only update if alternatives actually changed
    if (freshAlts.length !== (swapModal.alternatives || []).length) {
      setSwapModal(prev => prev ? { ...prev, alternatives: freshAlts } : null);
    }
  }, [enrichedDays, swapModal?.thumbId]);

  // Eagerly generate share token so saved trips are loadable from dropdown
  useEffect(() => {
    if (!itineraryId || shareToken) return; // already has a share path
    const tripId = sessionStorage.getItem('lila_trip_id');
    if (!tripId) return;
    createShareableUrl({
      itineraryId,
      rawItinerary,
      formData,
      destination: formData?.destination,
    }).then(url => {
      try {
        const token = url.split('/trip/')[1];
        if (!token) return;
        const trips = JSON.parse(localStorage.getItem('lila_trips') || '[]');
        const idx = trips.findIndex(t => t.id === tripId);
        if (idx !== -1) {
          trips[idx].path = `/trip/${token}`;
          localStorage.setItem('lila_trips', JSON.stringify(trips));
          window.dispatchEvent(new Event('lila_trips_changed'));
        }
      } catch {}
    });
  }, [itineraryId]);

  // time_on_itinerary — fire on page unload
  useEffect(() => {
    const t0 = performance.now();
    const handleUnload = () => {
      trackEvent('time_on_itinerary', { duration_seconds: Math.round((performance.now() - t0) / 1000) });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // scroll_depth — fire at 25/50/75/100% milestones
  useEffect(() => {
    const fired = new Set();
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = (scrollTop / docHeight) * 100;
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          trackEvent('scroll_depth', { depth: milestone });
        }
      }
    };
    let ticking = false;
    const throttled = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { handleScroll(); ticking = false; }); } };
    window.addEventListener('scroll', throttled, { passive: true });
    return () => window.removeEventListener('scroll', throttled);
  }, []);

  // before_you_go_reached — IntersectionObserver
  useEffect(() => {
    const el = beforeYouGoRef.current;
    if (!el) return;
    let tracked = false;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !tracked) {
        tracked = true;
        trackEvent('before_you_go_reached', {});
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [isStructured]);

  const scrollToDay = (index) => {
    if (dayRefs.current[index]) {
      dayRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDayFeedback = (dayIndex, feedback) => {
    if (feedback) {
      trackEvent('day_feedback_given', {
        day_index: dayIndex,
        reaction: feedback.reaction || null,
        has_note: Boolean(feedback.note),
        note_length: feedback.note ? feedback.note.length : 0,
      });
    }
    setDayFeedback(prev => {
      const next = { ...prev };
      const isEmpty = feedback === null || (!feedback.reaction && !feedback.note);
      if (isEmpty) { delete next[dayIndex]; } else { next[dayIndex] = feedback; }
      return next;
    });
  };

  const handleLock = (id) => {
    setLockedItems(prev => {
      const next = { ...prev };
      if (next[id]) {
        if (next[id].source === 'user') delete next[id];
      } else {
        next[id] = { source: 'user' };
      }
      trackEvent(next[id] ? 'item_locked' : 'item_unlocked', { thumbId: id });
      return next;
    });
  };

  const handleAlternatives = (id) => {
    // Find the activity data from enrichedDays to get alternatives
    for (let di = 0; di < enrichedDays.length; di++) {
      const day = enrichedDays[di];
      if (!day?.timeline) continue;
      for (let ti = 0; ti < day.timeline.length; ti++) {
        const thumbId = `day_${di}_timeline_${ti}`;
        if (thumbId === id) {
          setSwapModal({
            dayIndex: di, itemIndex: ti, thumbId,
            activityTitle: day.timeline[ti].title,
            alternatives: day.timeline[ti].alternatives || [],
          });
          return;
        }
      }
      // Check picks too
      if (day.picks) {
        for (let pi = 0; pi < day.picks.length; pi++) {
          const thumbId = `day_${di}_pick_${pi}`;
          if (thumbId === id) {
            const pick = day.picks[pi];
            setSwapModal({
              dayIndex: di, itemIndex: pi, thumbId,
              activityTitle: pick?.pick?.name || pick?.category || 'this pick',
              alternatives: pick?.pick?.alternatives || [],
            });
            return;
          }
        }
      }
    }
  };

  const handleLoadMore = async (thumbId) => {
    setLoadingMoreAlts(thumbId);
    const destSlug = metadata?.destination || formData?.destination;
    const { signal, clear } = fetchWithTimeout(310000);
    try {
      const res = await fetch('/api/generate-alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: destSlug,
          preferences: formData,
          itinerary: rawItinerary,
          loadMore: thumbId,
        }),
        signal,
      });
      clear();
      const { ok, data: result } = await safeJson(res);
      if (!ok || !result.success || !result.alternatives?.days) return;

      const match = thumbId.match(/^day_(\d+)_(timeline|pick)_(\d+)$/);
      if (!match) return;
      const [, dayIdx, type, itemIdx] = match;
      const di = Number(dayIdx);
      const ii = Number(itemIdx);

      const altDay = result.alternatives.days[di];
      if (!altDay) return;

      let newAlts = [];
      if (type === 'timeline' && altDay.timelineAlts) {
        const entry = altDay.timelineAlts.find(ta => ta.itemIndex === ii);
        newAlts = entry?.alternatives || [];
      } else if (type === 'pick' && altDay.pickAlts) {
        const entry = altDay.pickAlts.find(pa => pa.pickIndex === ii);
        newAlts = entry?.alternatives || [];
      }

      // Merge into enrichedDays
      setEnrichedDays(prev => {
        const updated = [...prev];
        const day = { ...updated[di] };
        if (type === 'timeline' && day.timeline) {
          day.timeline = [...day.timeline];
          const item = { ...day.timeline[ii] };
          const existing = item.alternatives || [];
          const existingTitles = new Set(existing.map(a => a.title));
          const fresh = newAlts.filter(a => !existingTitles.has(a.title));
          item.alternatives = [...existing, ...fresh];
          day.timeline[ii] = item;
        } else if (type === 'pick' && day.picks) {
          day.picks = [...day.picks];
          const pick = { ...day.picks[ii] };
          const existing = pick?.pick?.alternatives || pick.alternatives || [];
          const existingNames = new Set(existing.map(a => a.name || a.title));
          const fresh = newAlts.filter(a => !existingNames.has(a.name || a.title));
          const merged = [...existing, ...fresh];
          pick.alternatives = merged;
          if (pick.pick) pick.pick = { ...pick.pick, alternatives: merged };
          day.picks[ii] = pick;
        }
        updated[di] = day;
        return updated;
      });

      // Update swapModal alternatives directly
      if (type === 'timeline') {
        setSwapModal(prev => prev && prev.thumbId === thumbId
          ? { ...prev, alternatives: [...(prev.alternatives || []), ...newAlts.filter(a => !(prev.alternatives || []).some(e => e.title === a.title))] }
          : prev);
      } else {
        setSwapModal(prev => prev && prev.thumbId === thumbId
          ? { ...prev, alternatives: [...(prev.alternatives || []), ...newAlts.filter(a => !(prev.alternatives || []).some(e => (e.name || e.title) === (a.name || a.title)))] }
          : prev);
      }
    } catch (err) {
      clear();
      console.error('[Load more alternatives] failed:', err);
    } finally {
      setLoadingMoreAlts(null);
    }
  };

  const hasFeedback = Object.keys(lockedItems).length > 0 || Object.keys(swappedActivities).length > 0 || Object.values(dayFeedback).some(f => f?.note || f?.reaction) || pulse === 'close' || pulse === 'rethink';

  // Count NEW feedback inputs since last refinement
  const totalBookings = (tripLogistics?.flights?.length || 0) + (tripLogistics?.rentals?.length || 0) + (tripLogistics?.accommodations?.length || 0);
  const feedbackCount = useMemo(() => {
    let count = 0;
    count += Object.keys(swappedActivities).length;
    count += Object.values(dayFeedback).filter(f => f?.note || f?.reaction).length;
    if (overallNote?.trim()) count += 1;
    if (pulse === 'close' || pulse === 'rethink') count += 1;
    // Count only bookings added since last refinement
    const newBookings = totalBookings - logisticsBaseline;
    if (newBookings > 0) count += newBookings;
    return count;
  }, [swappedActivities, dayFeedback, overallNote, pulse, totalBookings, logisticsBaseline]);

  const requestRefine = () => setRefineConfirmOpen(true);
  const confirmRefine = () => { setRefineConfirmOpen(false); handleRefine(); };
  const cancelRefine = () => setRefineConfirmOpen(false);

  const handleRefine = async () => {
    const nextIteration = iteration + 1;
    const daysSpotOn = Object.values(dayFeedback).filter(f => f.reaction === 'spot-on').length;
    const daysNeedsWork = Object.values(dayFeedback).filter(f => f.reaction === 'needs-work').length;
    trackEvent('refinement_requested', { iteration: nextIteration, days_spot_on: daysSpotOn, days_needs_work: daysNeedsWork, pulse: pulse || 'none' });
    const t0 = performance.now();
    setRefining(true);
    setRefineApiDone(false);
    setRefineError(null);
    const { signal, clear } = fetchWithTimeout(310000);
    try {
      const response = await fetch('/api/refine-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary: rawItinerary,
          lockedItems,
          dayFeedback,
          swappedActivities,
          pulse,
          overallNote,
          formData,
          tripLogistics,
        }),
        signal,
      });
      clear();
      // Server sends NDJSON (keepalive newlines + final JSON line)
      const text = await response.text();
      const lines = text.split('\n').filter(l => l.trim());
      const lastLine = lines[lines.length - 1] || '{}';
      let result;
      try {
        result = JSON.parse(lastLine);
      } catch {
        throw new Error('Failed to parse refinement response');
      }
      if (!result.success) {
        throw new Error(result?.error || 'Refinement failed');
      }
      setRawItinerary(result.itinerary);
      setRefinementChanges(Array.isArray(result.changes) ? result.changes : []);
      setIteration(prev => prev + 1);

      // Save feedback for this refinement
      const itineraryId = sessionStorage.getItem('lila_itinerary_id');
      saveFeedback({
        formData,
        itineraryId,
        lockedItems,
        dayFeedback,
        pulse,
        overallNote,
        iteration,
      });

      // Save the newly refined itinerary (migrates share token from old row atomically)
      const previousItineraryId = sessionStorage.getItem('lila_itinerary_id');
      saveItinerary({
        formData,
        rawItinerary: result.itinerary,
        destination: formData?.destination,
        iteration: nextIteration,
        previousItineraryId,
        tripLogistics,
      }).then(id => {
        if (id) {
          try { sessionStorage.setItem('lila_itinerary_id', id); } catch { /* quota */ }
          setItineraryId(id);
        }
      });

      setDayFeedback({});
      setSwappedActivities({});
      // Clear user locks (booking locks re-derive from tripLogistics via auto-lock effect)
      setLockedItems(prev => {
        const kept = {};
        for (const [k, v] of Object.entries(prev)) {
          if (v.source === 'booking') kept[k] = v;
        }
        return kept;
      });
      setPulse(null);
      setOverallNote('');
      setLogisticsBaseline(totalBookings);
      trackEvent('refinement_completed', { iteration: nextIteration, duration_ms: Math.round(performance.now() - t0) });
      // Signal overlay that API is done — overlay will call onDismiss after phase wind-down
      setRefineApiDone(true);
    } catch (err) {
      clear();
      console.error('Refinement failed:', err);
      const isTimeout = err.name === 'AbortError';
      trackEvent('refinement_failed', { iteration: nextIteration, error_type: isTimeout ? 'timeout' : (err.message || 'unknown') });
      setRefineError(isTimeout ? 'The refinement timed out. This can happen with complex logistics — try again and it usually works on the second attempt.' : 'Something went wrong refining your trip. Please try again.');
      // Keep overlay visible — error state is shown inside the overlay
      setRefineApiDone(false);
    }
  };

  // Render loading / error screen while fetching a shared trip via /trip/:token
  if (loadingShared || shareError) return (
    <div className="font-body min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center" style={{
      background: C.warm,
      color: C.sage,
    }}>
      <div className="font-serif text-[clamp(22px,5.5vw,28px)] font-light" style={{ color: C.slate }}>{shareError ? 'Couldn\u2019t load this trip' : 'Loading your trip'}</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>
        {shareError || 'Fetching itinerary\u2026'}
      </div>
      {shareError && (
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={() => fetchSharedTrip(shareToken)}
            className="font-body text-[12px] font-bold tracking-[0.1em] uppercase border-none cursor-pointer"
            style={{
              padding: '12px 24px',
              background: C.slate, color: C.warm,
              borderRadius: 2,
            }}
          >Try again</button>
          <button
            onClick={() => navigate('/plan')}
            className="font-body text-[12px] font-bold tracking-[0.1em] uppercase bg-transparent cursor-pointer"
            style={{
              padding: '12px 24px',
              color: C.sage,
              border: `1px solid ${C.sage}40`, borderRadius: 2,
            }}
          >Plan a new trip</button>
        </div>
      )}
    </div>
  );

  if (!rawItinerary) return null;

  return (
    <div className="font-body min-h-screen" style={{ background: C.warm }}>
      <style>{`
        @keyframes lila-spin { to { transform: rotate(360deg); } }
        @keyframes practiceBreath {
          0%   { opacity: 0; transform: translateX(-80%); }
          12%  { opacity: 0.7; transform: translateX(0%); }
          45%  { opacity: 0.6; transform: translateX(5%); }
          60%  { opacity: 0.7; transform: translateX(0%); }
          75%  { opacity: 0; transform: translateX(-80%); }
          100% { opacity: 0; transform: translateX(-80%); }
        }
        @keyframes sidePanelSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes sidePanelBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bottomSheetSlideIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bottomSheetBackdropIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <RefiningOverlay
        visible={refining || !!refineError}
        iteration={iteration}
        days={itinerary?.days?.length || 4}
        apiDone={refineApiDone}
        error={refineError}
        onRetry={() => {
          setRefineError(null);
          setRefining(false);
          setRefineApiDone(false);
          setTimeout(() => handleRefine(), 100);
        }}
        onDismiss={() => {
          setRefining(false);
          setRefineApiDone(false);
          setRefineError(null);
          setShowRefinementModal(true);
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        }}
      />

      {/* Refinement summary modal — shown after overlay dismisses */}
      {showRefinementModal && isStructured && (
        <RefinementModal
          iteration={iteration}
          changes={refinementChanges}
          onDismiss={() => setShowRefinementModal(false)}
        />
      )}

      {/* First draft modal */}
      {iteration === 0 && showDraftModal && isStructured && (
        <FirstDraftModal onDismiss={() => setShowDraftModal(false)} />
      )}

      {/* Refine confirmation */}
      {refineConfirmOpen && (
        <RefineConfirmModal onConfirm={confirmRefine} onCancel={cancelRefine} feedbackCount={feedbackCount} />
      )}

      {/* Swap modal */}
      <SwapModal
        isOpen={!!swapModal}
        onClose={() => setSwapModal(null)}
        activityTitle={swapModal?.activityTitle || ''}
        alternatives={swapModal?.alternatives || []}
        alternativesLoading={alternativesLoading}
        onLoadMore={() => handleLoadMore(swapModal?.thumbId)}
        loadingMore={loadingMoreAlts === swapModal?.thumbId}
        onConfirm={(chosen, note) => {
          const { thumbId, activityTitle } = swapModal;
          setSwappedActivities(prev => ({
            ...prev,
            [thumbId]: { from: activityTitle, to: chosen.title, toSummary: chosen.summary, note },
          }));
          setSwapModal(null);
          setToastMessage('Activity swapped');
        }}
      />

      {/* Toast */}
      <Toast message={toastMessage} onDone={() => setToastMessage(null)} />

      {/* Detail panel */}
      <DetailPanel item={activePanel} onClose={() => setActivePanel(null)}
        lockedItems={lockedItems} onLock={handleLock} onAlternatives={handleAlternatives}
        alternativesLoading={alternativesLoading} />

      {/* Header */}
      <ItineraryNav
        itinerary={itinerary}
        iteration={iteration}
        itineraryId={itineraryId}
        rawItinerary={rawItinerary}
        formData={formData}
        onShare={() => setSavePanelOpen(true)}
        tripTitle={tripTitle}
        onTitleChange={(t) => { setTripTitle(t); persistTitle(t); }}
        feedbackCount={feedbackCount}
        onRefine={requestRefine}
        isRefining={refining}
      />
      <div style={{ height: 56 }} /> {/* spacer for fixed nav */}

      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '16px 16px 80px',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Hero — left-aligned */}
        {isStructured && (
          <div style={{ textAlign: 'left', padding: '18px 8px 28px' }}>
            <VersionBadge iteration={iteration} />
            <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase mb-2" style={{
              color: C.teal,
            }}>Your Itinerary</div>
            {editingHeroTitle ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  ref={heroTitleRef}
                  value={draftHeroTitle}
                  onChange={e => setDraftHeroTitle(e.target.value)}
                  onBlur={commitHeroTitle}
                  onKeyDown={handleHeroTitleKeyDown}
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(26px, 4.5vw, 36px)', fontWeight: 300,
                    color: C.ink, lineHeight: 1.15,
                    background: 'transparent', border: 'none',
                    borderBottom: `1px solid ${BrandC.goldenAmber}`,
                    borderRadius: 0, outline: 'none',
                    flex: 1, minWidth: 0, padding: 0,
                    letterSpacing: 'inherit',
                  }}
                />
                <button
                  onMouseDown={e => { e.preventDefault(); commitHeroTitle(); }}
                  aria-label="Save title"
                  style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  <CheckIcon size={16} color={C.seaGlass} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <h1
                  onClick={handleHeroTitleClick}
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(26px, 4.5vw, 36px)', fontWeight: 300,
                    color: C.ink, lineHeight: 1.15,
                    cursor: 'text', borderBottom: '1px dashed transparent',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderBottomColor = 'rgba(26,37,48,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.borderBottomColor = 'transparent'}
                >{tripTitle || itinerary.title}</h1>
                <button
                  onClick={handleHeroTitleClick}
                  aria-label="Edit title"
                  style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.4, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
                >
                  <PencilIcon size={14} color={C.ink} />
                </button>
              </div>
            )}
            {itinerary.subtitle && (
              <p className="font-serif text-[14px] italic font-normal" style={{ color: C.muted }}>{itinerary.subtitle}</p>
            )}
            {itinerary.intro && (
              <p className="font-body text-[14px] font-normal leading-[1.75] max-w-[600px] mt-3.5" style={{ color: C.body }}>{itinerary.intro}</p>
            )}
          </div>
        )}

        {/* Trip Profile Summary */}
        {isStructured && formData && <TripProfileSummary formData={formData} />}

        {/* Celestial Snapshot — unified block */}
        {isStructured && (
          <CelestialSnapshot
            snapshot={itinerary.snapshot}
            celestial={metadata?.celestial}
            weather={metadata?.weather}
            month={formData?.month}
            destination={metadata?.destination || formData?.destination}
          />
        )}

        {/* Threshold Moments — day spine with tags + ◈ moment */}
        {isStructured && itinerary.days?.length > 0 && (() => {
          const TRAVEL_KEYWORDS = [
            { match: /arriv/i, label: 'Arrival' },
            { match: /depart|check.out|fly.out|head.home/i, label: 'Departure' },
            { match: /drive|driving|road/i, label: 'Drive day' },
            { match: /flight|fly\b/i, label: 'Flight' },
            { match: /transfer|transit/i, label: 'Transit' },
          ];
          const getTravelTags = (title = '', snapshot = '') => {
            const text = `${title} ${snapshot}`;
            return TRAVEL_KEYWORDS.filter(k => k.match.test(text)).map(k => k.label);
          };
          const days = itinerary.days;
          return (
            <div style={{ ...CARD_STYLE, overflow: 'hidden', marginBottom: 12 }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, color: C.muted, padding: '18px 20px 0', marginBottom: '16px' }}>
                Your trip · At a glance
              </p>
              {/* ◈ section marker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 20px 0' }}>
                <span style={{ color: C.goldenAmber, fontSize: '16px' }}>◈</span>
                <div style={{ flex: 1, height: '0.5px', background: C.border }} />
              </div>
              <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                {days.map((day, i) => {
                  const practiceTags = [...new Set(
                    day.timeline.flatMap(t =>
                      t.practiceTag == null ? []
                      : Array.isArray(t.practiceTag) ? t.practiceTag
                      : [t.practiceTag]
                    )
                  )].slice(0, 3);
                  const travelTags = getTravelTags(day.title, day.snapshot);
                  const allTags = [...new Set([...travelTags, ...practiceTags])].slice(0, 3);
                  const isLast = i === days.length - 1;
                  return (
                    <div key={day.label} style={{ display: 'flex', gap: '14px', alignItems: 'stretch', paddingBottom: isLast ? 0 : '24px' }}>
                      {/* Timeline spine */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.goldenAmber, marginTop: '4px' }} />
                        {!isLast && (
                          <div style={{ width: '1px', flex: 1, background: C.border, marginTop: '5px' }} />
                        )}
                      </div>
                      {/* Day content */}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, fontWeight: 500, marginBottom: '3px' }}>
                          {day.label}
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: 500, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                          {day.title}
                        </p>
                        {allTags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: day.thresholdMoment ? '12px' : 0 }}>
                            {allTags.map(tag => (
                              <span key={tag} style={{
                                fontSize: '11px',
                                padding: '3px 9px',
                                border: `0.5px solid ${C.border}`,
                                borderRadius: '999px',
                                color: C.muted,
                                whiteSpace: 'nowrap'
                              }}>
                                {PRACTICE_TAG_LABELS[tag] || tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {day.thresholdMoment && (
                          <div style={{ borderLeft: `1.5px solid ${C.goldenAmber}`, paddingLeft: '10px' }}>
                            <p style={{ fontSize: '11px', letterSpacing: '0.07em', textTransform: 'uppercase', color: C.goldenAmber, fontWeight: 500, marginBottom: '4px' }}>
                              ◈ {day.thresholdMoment.title}
                            </p>
                            <p style={{ fontSize: '13px', color: C.muted, lineHeight: 1.5 }}>
                              {day.thresholdMoment.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Logistics panel — mobile only, shown right after celestial snapshot */}
        {isStructured && isMobile && (
          <div style={{ marginBottom: 16 }}>
            <LogisticsPanel
              destination={formData?.destination}
              sticky={false}
              tripLogistics={tripLogistics}
              itinerary={{ ...itinerary, days: enrichedDays }}
              onOpenPanel={(panelItem) => {
                if (panelItem._updateLogistics) {
                  setTripLogistics(prev => {
                    const update = typeof panelItem._updateLogistics === 'function'
                      ? panelItem._updateLogistics(prev)
                      : { ...prev, ...panelItem._updateLogistics };
                    return update;
                  });
                  setActivePanel(null);
                  return;
                }
                if (panelItem.onSave) {
                  const origSave = panelItem.onSave;
                  panelItem.onSave = (d) => { origSave(d); };
                }
                setActivePanel(panelItem);
              }}
              onRefine={requestRefine}
            />
          </div>
        )}

        {/* Day by Day label */}
        {isStructured && (
          <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5 pl-2" style={{
            color: 'rgba(28,28,26,0.4)',
          }}>Day by Day</div>
        )}

        {/* Day Cards + Logistics — two-col grid / Markdown Fallback */}
        {isStructured ? (
          <>
            <div style={{
              display: isMobile ? 'block' : 'grid',
              gridTemplateColumns: '1fr 240px',
              gap: 20,
            }}>
              {/* Left: Day cards */}
              <div>
                {enrichedDays.map((day, i) => (
                  <div key={i} ref={el => dayRefs.current[i] = el} style={{ scrollMarginTop: 60 }}>
                    <DayCard day={day} dayIndex={i}
                      feedback={dayFeedback[i]} onFeedback={handleDayFeedback}
                      lockedItems={lockedItems} onLock={handleLock} onAlternatives={handleAlternatives}
                      swappedActivities={swappedActivities}
                      onSwapOpen={(data) => setSwapModal(data)}
                      onOpenPanel={(panelItem) => {
                        setActivePanel(panelItem);
                      }} />
                  </div>
                ))}

                {/* Before You Go */}
                {itinerary.beforeYouGo && (
                  <div ref={beforeYouGoRef} style={{ background: `linear-gradient(180deg, ${C.white}, ${C.cream}30)`, borderRadius: 2, border: `1px solid ${C.sage}18`, padding: '18px 20px', marginTop: 6, boxShadow: `0 1px 8px ${C.sage}08` }}>
                    <div className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: C.sage }}>Before You Go</div>
                    {itinerary.beforeYouGo.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: i < itinerary.beforeYouGo.length - 1 ? `1px solid ${C.sage}06` : 'none' }}>
                        <span style={{ color: `${C.sage}80`, flexShrink: 0, fontSize: 11, marginTop: 2 }}>{"●\uFE0E"}</span>
                        <span className="font-body text-[14px] leading-[1.65]" style={{ color: `${C.slate}85` }}>{renderInline(item)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trip Pulse */}
                <TripPulse pulse={pulse} setPulse={setPulse} overallNote={overallNote} setOverallNote={setOverallNote}
                  iteration={iteration} onPulseSelect={(val) => trackEvent('trip_pulse_selected', { pulse: val })} />

                {/* Closing Note */}
                {itinerary.closingNote && (
                  <div style={{ textAlign: 'center', padding: '28px 20px 0' }}>
                    <p className="font-body text-[15px] font-normal leading-[1.6]" style={{ color: `${C.slate}90`, fontStyle: 'normal' }}>{itinerary.closingNote}</p>
                  </div>
                )}

                {/* Refinement errors now shown inside RefiningOverlay */}

                {/* Refine CTA / Premium Gate */}
                <RefineCTA iteration={iteration} hasFeedback={hasFeedback} onRefine={requestRefine} pulse={pulse}
                  feedbackCount={feedbackCount} isRefining={refining}
                  onGateShown={() => trackEvent('premium_gate_shown', { iteration })}
                  onUpgradeClick={() => trackEvent('premium_upgrade_clicked', { iteration })} />
              </div>

              {/* Right: Logistics panel (desktop only — mobile renders above day cards) */}
              {!isMobile && (
                <div>
                  <LogisticsPanel
                    destination={formData?.destination}
                    sticky={true}
                    tripLogistics={tripLogistics}
                    itinerary={{ ...itinerary, days: enrichedDays }}
                    onOpenPanel={(panelItem) => {
                      if (panelItem._updateLogistics) {
                        setTripLogistics(prev => {
                          const update = typeof panelItem._updateLogistics === 'function'
                            ? panelItem._updateLogistics(prev)
                            : { ...prev, ...panelItem._updateLogistics };
                          return update;
                        });
                        setActivePanel(null);
                        return;
                      }
                      if (panelItem.onSave) {
                        const origSave = panelItem.onSave;
                        panelItem.onSave = (d) => {
                          origSave(d);
                        };
                      }
                      setActivePanel(panelItem);
                    }}
                    onRefine={requestRefine}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ background: C.white, borderRadius: 2, padding: '24px 22px', border: `1px solid ${C.sage}12`, boxShadow: `0 2px 10px ${C.amber}05` }}>
            <MarkdownContent content={rawItinerary} />
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 16 }}>
          <button onClick={() => { clearSession(); trackEvent('new_trip_clicked', { source: 'start_over' }); navigate('/plan'); }} className="font-body text-[12px] font-medium" style={{
            color: `${C.sage}90`, background: 'none',
            border: 'none', cursor: 'pointer', padding: '8px 16px',
            WebkitTapHighlightColor: 'transparent',
          }}>Start over with a new trip</button>
        </div>
      </div>

      {/* Save / Share panel */}
      {isStructured && (
        <SavePill
          isOpen={savePanelOpen}
          onClose={() => setSavePanelOpen(false)}
          itineraryId={itineraryId}
          rawItinerary={rawItinerary}
          formData={formData}
          itineraryTitle={itinerary?.title}
        />
      )}
    </div>
  );
}
