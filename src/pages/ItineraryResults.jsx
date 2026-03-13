import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { C as BrandC } from '@data/brand';
import { lookupUrl } from '@data/destinations/zion-urls';
import JSON5 from 'json5';
import { trackEvent } from '@utils/analytics';
import { getPracticesForItinerary, TRADITIONS, ENTRIES } from '@services/practicesService';
import { assignCompanions } from '@services/companionAssigner';
import { saveItinerary, saveFeedback } from '@services/feedbackService';

import { clearSession } from '@services/sessionManager';
import SavePill from '@components/SavePill';
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

const PICK_STYLES = {
  mindfulness: { label: 'Mindfulness', color: C.seaGlass },
  stay: { label: 'Where to Stay', color: C.goldenAmber },
  eat:  { label: 'Where to Eat',  color: C.sunSalmon },
  gear: { label: 'Gear',          color: C.oceanTeal },
  wellness: { label: 'Wellness',  color: C.seaGlass },
};

const F = "'Quicksand', sans-serif";
const F_SERIF = "'Cormorant Garamond', 'Georgia', serif";

const TRADITION_GLYPHS = {
  hinduism: 'ॐ',
  buddhism: '☸',
  taoism: '☯',
  shinto: '⛩',
  stoicism: '◎',
  crossCultural: '◈',
};

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

const PracticeIcon = ({ size = 13, color = C.seaGlass }) => (
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
  january:   { sky: 'Deep Winter Sky',  events: [{ icon: '🌑', name: 'New Moon',       date: 'Jan 29', note: 'Darkest skies of the month. Prime stargazing.' }, { icon: '🌕', name: 'Full Moon',       date: 'Jan 13', note: 'Wolf Moon. Canyon walls glow under full light.' }, { icon: '❄️', name: 'Winter Cold',     date: 'Jan',     note: 'Coldest temps. Snow possible on upper trails.' }] },
  february:  { sky: 'Late Winter Sky',  events: [{ icon: '🌑', name: 'New Moon',       date: 'Feb 27', note: 'Best night-sky window. Milky Way returns.' }, { icon: '🌕', name: 'Full Moon',       date: 'Feb 12', note: 'Snow Moon. Cold brilliance over the canyon.' }, { icon: '🌸', name: 'First Blooms',    date: 'Late Feb', note: 'Desert willow and redbud begin to bud.' }] },
  march:     { sky: 'Spring Equinox',   events: [{ icon: '☀️', name: 'Spring Equinox', date: 'Mar 20', note: 'Equal day and night. Canyon light turns golden.' }, { icon: '🌑', name: 'New Moon',       date: 'Mar 29', note: 'Clear skies for deep-sky viewing.' }, { icon: '🌸', name: 'Desert Bloom',   date: 'Mar–Apr', note: 'Wildflowers begin. Color spreads canyon floor.' }] },
  april:     { sky: 'Desert Bloom Sky', events: [{ icon: '🌸', name: 'Peak Bloom',     date: 'Apr',    note: 'Sacred datura, prickly pear, cliffrose in flower.' }, { icon: '🌑', name: 'New Moon',       date: 'Apr 27', note: 'Warm nights. Ideal for camping under stars.' }, { icon: '🌕', name: 'Full Moon',       date: 'Apr 12', note: 'Pink Moon. Soft light over sandstone.' }] },
  may:       { sky: 'Late Spring Sky',  events: [{ icon: '🌑', name: 'New Moon',       date: 'May 26', note: 'Pre-summer clarity. Milky Way rising.' }, { icon: '🌕', name: 'Full Moon',       date: 'May 12', note: 'Flower Moon. Warm evenings canyon-side.' }, { icon: '🌿', name: 'Green Canyon',   date: 'May',    note: 'Virgin River runs lush. Cottonwoods fully leafed.' }] },
  june:      { sky: 'Summer Solstice',  events: [{ icon: '☀️', name: 'Summer Solstice',date: 'Jun 21', note: 'Longest day. Canyon walls catch last light longest.' }, { icon: '🌌', name: 'Milky Way Peak', date: 'Jun–Sep', note: 'Galaxy rises overhead on clear nights.' }, { icon: '🌑', name: 'New Moon',       date: 'Jun 25', note: 'Best stargazing window of summer.' }] },
  july:      { sky: 'Monsoon Sky',      events: [{ icon: '⛈️', name: 'Monsoon Season', date: 'Jul–Aug', note: 'Afternoon storms. Flash flood risk. Dramatic skies.' }, { icon: '🌌', name: 'Milky Way',      date: 'Jul',    note: 'Core overhead mid-summer. Spectacular from the rim.' }, { icon: '🌕', name: 'Full Moon',       date: 'Jul 10', note: 'Buck Moon. Warm light, warm nights.' }] },
  august:    { sky: 'Late Summer Sky',  events: [{ icon: '🌠', name: 'Perseids',        date: 'Aug 11–13', note: 'Peak meteor shower. Up to 100 meteors/hour.' }, { icon: '⛈️', name: 'Monsoon Tail',  date: 'Early Aug', note: 'Storms taper. Stunning post-rain clarity.' }, { icon: '🌑', name: 'New Moon',       date: 'Aug 23', note: 'Moonless nights for star-heavy viewing.' }] },
  september: { sky: 'Early Autumn Sky', events: [{ icon: '☀️', name: 'Autumn Equinox', date: 'Sep 22', note: 'Light shifts. Cottonwoods begin to turn.' }, { icon: '🌑', name: 'New Moon',       date: 'Sep 11', note: 'Best night-sky viewing. Ideal for stargazing.' }, { icon: '🌕', name: 'Full Moon',       date: 'Sep 25', note: 'Bright moonlit canyon walks.' }] },
  october:   { sky: 'Golden Corridor',  events: [{ icon: '🍂', name: 'Peak Color',      date: 'Oct',    note: 'Cottonwoods gold. Best light of the year.' }, { icon: '🌑', name: 'New Moon',       date: 'Oct 21', note: 'Dark skies over golden canyon walls.' }, { icon: '🌕', name: 'Full Moon',       date: 'Oct 6',  note: "Hunter's Moon. Canyon glows at midnight." }] },
  november:  { sky: 'Deep Autumn Sky',  events: [{ icon: '🌕', name: 'Full Moon',       date: 'Nov 5',  note: 'Beaver Moon over bare cottonwoods.' }, { icon: '🌠', name: 'Leonids',         date: 'Nov 17', note: 'Meteor shower. 15–20 per hour at peak.' }, { icon: '🌑', name: 'New Moon',       date: 'Nov 20', note: 'Clear, cold. Best Milky Way of autumn.' }] },
  december:  { sky: 'Winter Solstice',  events: [{ icon: '☀️', name: 'Winter Solstice', date: 'Dec 21', note: 'Shortest day. Most dramatic canyon light.' }, { icon: '🌠', name: 'Geminids',        date: 'Dec 13–14', note: 'Best meteor shower of the year. 120/hour at peak.' }, { icon: '🌑', name: 'New Moon',       date: 'Dec 30', note: 'Year-end dark sky. Snow-dusted walls.' }] },
};

// Moon phase emojis for the pill display
const MOON_EMOJI = {
  'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓',
  'Waxing Gibbous': '🌔', 'Full Moon': '🌕', 'Waning Gibbous': '🌖',
  'Last Quarter': '🌗', 'Waning Crescent': '🌘',
};

function CelestialSnapshot({ snapshot, celestial, weather, month }) {
  // Resolve data
  const avgHigh   = snapshot?.avgHigh ?? (weather?.length > 0 ? Math.round(weather.map(d=>d.high).reduce((a,b)=>a+b,0)/weather.length) : null);
  const avgLow    = snapshot?.avgLow  ?? (weather?.length > 0 ? Math.round(weather.map(d=>d.low).reduce((a,b)=>a+b,0)/weather.length) : null);
  const sunrise   = snapshot?.sunrise ?? celestial?.days?.[0]?.sunrise ?? null;
  const sunset    = snapshot?.sunset  ?? celestial?.days?.[0]?.sunset  ?? null;
  const moonName  = snapshot?.moonPhase ?? celestial?.moonPhase?.name  ?? null;
  const stargazing = snapshot?.stargazing ?? celestial?.moonPhase?.stargazing ?? null;

  const monthKey  = (month || '').toLowerCase();
  const monthData = CELESTIAL_BY_MONTH[monthKey] ?? CELESTIAL_BY_MONTH['september'];
  const { sky, events } = monthData;

  // Don't render if truly nothing
  if (!sky && !snapshot?.seasonalNote) return null;

  return (
    <div style={{
      ...CARD_STYLE,
      overflow: 'hidden',
      marginBottom: 24,
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          fontFamily: F, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: C.muted, marginBottom: 6,
        }}>Celestial Snapshot</div>
        <div style={{
          fontFamily: F_SERIF, fontSize: 22, fontWeight: 300,
          color: C.ink, marginBottom: 5,
        }}>{sky}</div>
        {snapshot?.seasonalNote && (
          <div style={{
            fontFamily: F, fontSize: 13, fontWeight: 400,
            color: C.body, lineHeight: 1.6,
          }}>{snapshot.seasonalNote}</div>
        )}
      </div>

      {/* Events grid — 3 columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        {events.map((ev, i) => (
          <div key={i} style={{
            padding: '14px 18px',
            borderRight: i < events.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{ fontSize: 18, marginBottom: 6 }}>{ev.icon}</div>
            <div style={{
              fontFamily: F, fontSize: 14, fontWeight: 600,
              color: C.ink, marginBottom: 2,
            }}>{ev.name}</div>
            <div style={{
              fontFamily: F, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', color: C.amber, marginBottom: 5,
            }}>{ev.date}</div>
            <div style={{
              fontFamily: F, fontSize: 12, fontWeight: 400,
              color: C.body, lineHeight: 1.5,
            }}>{ev.note}</div>
          </div>
        ))}
      </div>

      {/* Weather row — 4 columns */}
      {(avgHigh !== null || sunrise || moonName) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: `1px solid ${C.border}`,
        }}>
          {avgHigh !== null && (
            <div style={{ padding: '12px 18px', borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 5 }}>Avg High</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.ink }}>
                {avgHigh}°
                {avgLow !== null && <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}> /{avgLow}°</span>}
              </div>
            </div>
          )}
          {sunrise && (
            <div style={{ padding: '12px 18px', borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 5 }}>Sunrise</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{sunrise}</div>
            </div>
          )}
          {sunset && (
            <div style={{ padding: '12px 18px', borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 5 }}>Sunset</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{sunset}</div>
            </div>
          )}
          {moonName && (
            <div style={{ padding: '12px 18px' }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, marginBottom: 5 }}>Moon</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>
                {MOON_EMOJI[moonName] ?? '🌙'} {moonName}
              </div>
              {stargazing && <div style={{ fontFamily: F, fontSize: 11, color: C.muted, marginTop: 2 }}>{stargazing}</div>}
            </div>
          )}
        </div>
      )}

      {/* Pack note */}
      {snapshot?.packingHint && (
        <div style={{ padding: '12px 20px', display: 'flex', gap: 10, alignItems: 'baseline' }}>
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted, flexShrink: 0 }}>Pack</span>
          <span style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.6 }}>{snapshot.packingHint}</span>
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
    formData.practices.slice(0, 4).forEach(id => {
      if (PRACTICE_LABELS[id]) chips.push(PRACTICE_LABELS[id]);
    });
    if (formData.practices.length > 4) chips.push(`+${formData.practices.length - 4} more`);
  }

  if (chips.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', paddingBottom: 20, marginBottom: 20, borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, marginRight: 4 }}>Built for you</span>
      {chips.map((chip, i) => (
        <span key={i} style={{
          fontFamily: F, fontSize: 12, fontWeight: 500, color: C.body,
          background: C.white, border: `1px solid ${C.border}`,
          borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap',
        }}>{chip}</span>
      ))}
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
      <span style={{
        fontFamily: F, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.06em',
        color: cfg.color,
        textTransform: 'capitalize',
      }}>
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
        <div style={{
          fontFamily: F, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: `${C.sage}99`, lineHeight: 1,
          marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: F, fontSize: 13, fontWeight: 700,
          color: accent || C.ink, lineHeight: 1,
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}


/* ── inline pick ───────────────────────────────────────────────────────── */

function MetaChip({ label, color }) {
  return (
    <span style={{
      fontFamily: F, fontSize: 11, fontWeight: 600,
      color: color || C.muted,
      background: color ? `${color}12` : `${C.sage}0c`,
      border: `1px solid ${color ? `${color}25` : `${C.sage}18`}`,
      borderRadius: 3,
      padding: '2px 7px',
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
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
const CURATABLE_KEYWORDS = ['hike', 'trail', 'experience', 'activity', 'restaurant', 'food', 'dining', 'viewpoint', 'stop', 'attraction', 'walk', 'canyon', 'sunrise', 'sunset', 'yoga', 'breathwork', 'meditation', 'spa', 'wellness', 'swim', 'kayak', 'climb', 'explore', 'visit', 'lunch', 'dinner', 'breakfast', 'brunch'];

function isCuratable(activity) {
  const typeStr = (activity.activityType || activity.type || '').toLowerCase();
  if (NON_CURATABLE_TYPES.some(t => typeStr.includes(t))) return false;
  const titleLower = (activity.title || '').toLowerCase();
  // Exclude common logistics patterns by title
  if (/\b(check.?in|check.?out|pack|depart|arrive|drive to|travel to)\b/i.test(activity.title || '')) return false;
  const text = `${typeStr} ${titleLower} ${(activity.category || '').toLowerCase()}`;
  return CURATABLE_KEYWORDS.some(t => text.includes(t));
}

/* ── SwapIcon — inline SVG refresh/swap icon ──────────────────────────── */

const SwapIcon = ({ size = 12, color = C.oceanTeal }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 8a5.5 5.5 0 0 1 9.5-3.5" /><path d="M13.5 8a5.5 5.5 0 0 1-9.5 3.5" />
    <polyline points="12,1 12,5 8,5" /><polyline points="4,15 4,11 8,11" />
  </svg>
);

/* ── ActivityActions — Love This + Show Alternatives ──────────────────── */

function ActivityActions({ id, lovedItems, onLove, onAlternatives }) {
  const loved = !!lovedItems?.[id];

  return (
    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 16, whiteSpace: 'nowrap' }}>
      {/* Love This */}
      <button onClick={e => { e.stopPropagation(); onLove(id); }} style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        padding: '9px 10px',
        borderRadius: 20,
        background: loved ? `${C.goldenAmber}14` : `${C.goldenAmber}08`,
        border: `1px solid ${loved ? C.goldenAmber : `${C.goldenAmber}22`}`,
        cursor: 'pointer', transition: 'all 0.2s',
        WebkitTapHighlightColor: 'transparent',
        fontFamily: F, fontSize: 12, fontWeight: loved ? 700 : 600,
        color: loved ? C.goldenAmber : `${C.goldenAmber}90`,
      }}>
        <FlameIcon size={12} color={loved ? C.goldenAmber : `${C.goldenAmber}80`} active={loved} />
        <span>Love This</span>
      </button>

      {/* Show Alternatives */}
      <button onClick={e => { e.stopPropagation(); onAlternatives(id); }} style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        padding: '9px 10px',
        borderRadius: 20,
        background: `${C.oceanTeal}08`,
        border: `1px solid ${C.oceanTeal}22`,
        cursor: 'pointer', transition: 'all 0.2s',
        WebkitTapHighlightColor: 'transparent',
        fontFamily: F, fontSize: 12, fontWeight: 600,
        color: `${C.oceanTeal}90`,
      }}>
        <SwapIcon size={12} color={`${C.oceanTeal}80`} />
        <span>Show Alternatives</span>
      </button>
    </div>
  );
}

/* ── lovedTint — background tint for loved items ─────────────────────── */

function lovedTint(lovedItems, id) {
  if (lovedItems?.[id]) return 'rgba(200,148,26,0.04)';
  return null;
}


/* ── MindfulnessReactions — Love This only (mindfulness doesn't have alternatives) ── */

function MindfulnessReactions({ id, lovedItems, onLove }) {
  const loved = !!lovedItems?.[id];

  return (
    <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 5, marginTop: 12, paddingBottom: 16 }}>
      <button onClick={e => { e.stopPropagation(); onLove(id); }} style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '9px 14px',
        borderRadius: 20,
        background: loved ? `${C.goldenAmber}14` : `${C.goldenAmber}08`,
        border: `1px solid ${loved ? C.goldenAmber : `${C.goldenAmber}22`}`,
        cursor: 'pointer', transition: 'all 0.2s',
        WebkitTapHighlightColor: 'transparent',
        fontFamily: F, fontSize: 12, fontWeight: loved ? 700 : 600,
        color: loved ? C.goldenAmber : `${C.goldenAmber}90`,
      }}>
        <FlameIcon size={12} color={loved ? C.goldenAmber : `${C.goldenAmber}80`} active={loved} />
        <span>Love This</span>
      </button>
    </div>
  );
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

function CompanionPanelContent({ type, data, id, lovedItems, onLove }) {
  if (!data) return null;
  const isTeaching = type === 'teaching';
  const accent = isTeaching ? C.goldenAmber : C.seaGlass;

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
      {/* Type badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${accent}0e`, border: `1px solid ${accent}18`, marginBottom: 10 }}>
        {isTeaching ? <TeachingIcon size={11} color={accent} /> : <PracticeIcon size={11} color={accent} />}
        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>{isTeaching ? "Today's Teaching" : "Today's Practice"}</span>
      </div>

      {/* Tradition */}
      {data.tradition && (
        <div style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: C.muted, marginBottom: 6 }}>{data.tradition} tradition</div>
      )}

      {/* Title */}
      <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, marginBottom: 4 }}>{data.title}</h1>

      <MindfulnessReactions id={id} lovedItems={lovedItems} onLove={onLove} />

      {/* Summary / essence */}
      <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, marginBottom: 20 }}>{isTeaching ? data.essence : data.description}</p>

      {/* Deeper content */}
      {data.deeper && (
        <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, marginBottom: 20 }}>{data.deeper}</p>
      )}

      {/* Quote */}
      {data.quote && (
        <div style={{ padding: '14px 16px', borderLeft: `3px solid ${accent}30`, background: `${accent}05`, borderRadius: '0 8px 8px 0', marginBottom: 20 }}>
          <p style={{ fontFamily: F, fontSize: 14, fontStyle: 'normal', color: C.body, lineHeight: 1.6, margin: 0 }}>"{data.quote.text}"</p>
          {data.quote.source && <p style={{ fontFamily: F, fontSize: 12, color: C.muted, marginTop: 6, margin: '6px 0 0' }}>— {data.quote.source}</p>}
        </div>
      )}

      {/* Practice-specific: duration, when, howTo */}
      {!isTeaching && (data.duration || data.when || data.howTo) && (
        <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.sage}12`, padding: '13px 15px', marginBottom: 20 }}>
          {data.duration && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: (data.when || data.howTo) ? 10 : 0 }}>
              <ClockIcon size={12} color={C.seaGlass} />
              <div>
                <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, marginBottom: 1 }}>Duration</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink }}>{data.duration}</div>
              </div>
            </div>
          )}
          {data.when && (
            <div style={{ borderTop: data.duration ? `1px solid ${C.sage}08` : 'none', paddingTop: data.duration ? 10 : 0, marginBottom: data.howTo ? 10 : 0 }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, marginBottom: 1 }}>When</div>
              <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.body, lineHeight: 1.45 }}>{data.when}</div>
            </div>
          )}
          {data.howTo && (
            <div style={{ borderTop: (data.duration || data.when) ? `1px solid ${C.sage}08` : 'none', paddingTop: (data.duration || data.when) ? 10 : 0 }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, marginBottom: 3 }}>How To</div>
              <div style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: C.body, lineHeight: 1.6 }}>{data.howTo}</div>
            </div>
          )}
        </div>
      )}

      {/* Sources */}
      {data.sources && data.sources.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, marginBottom: 8 }}>Sources</div>
          {data.sources.map((s, i) => (
            <div key={i} style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.5, marginBottom: 4 }}>
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

function TrailDetailContent({ data, thumbId, lovedItems, onLove, onAlternatives }) {
  const { title, time, summary, details, trailData = {}, url } = data;
  const resolvedUrl = url || trailData.npsUrl || lookupUrl(title);

  // Consistent label style used throughout
  const labelStyle = {
    fontFamily: F, fontSize: 10, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: C.muted,
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>

      {/* Trail badge + time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}08`, border: `1px solid ${C.teal}18` }}>
          <MountainIcon size={12} color={C.teal} />
          <span style={{ ...labelStyle, color: C.teal }}>Trail</span>
        </div>
        {time && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}06`, border: `1px solid ${C.teal}12` }}>
            <ClockIcon size={10} color={C.muted} />
            <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: C.body }}>{time}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.2, marginBottom: 4 }}>
        {resolvedUrl ? (
          <a href={resolvedUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'none', borderBottom: `1px solid ${C.teal}30` }}>
            {title}
          </a>
        ) : title}
      </h1>

      {/* Activity actions */}
      <ActivityActions id={thumbId} lovedItems={lovedItems} onLove={onLove} onAlternatives={onAlternatives} />

      {/* Summary */}
      <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, marginBottom: 16 }}>{summary}</p>

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
              <div style={{ ...labelStyle, marginBottom: 4 }}>Distance</div>
              <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink }}>{trailData.distance}</div>
            </div>
          )}
          {trailData.elevationGain && (
            <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <div style={{ ...labelStyle, marginBottom: 4 }}>Elevation</div>
              <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink }}>{trailData.elevationGain}</div>
            </div>
          )}
          {trailData.trailType && (
            <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
              <div style={{ ...labelStyle, marginBottom: 4 }}>Route Type</div>
              <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink, textTransform: 'capitalize' }}>{trailData.trailType}</div>
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
                <div style={{ ...labelStyle, color: C.amber, marginBottom: 2 }}>Permit Required</div>
                {trailData.permitNote && (
                  <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.5 }}>{trailData.permitNote}</div>
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
              <span style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.5 }}>{trailData.permitNote}</span>
            </div>
          )}

          {/* Trailhead Access */}
          {trailData.trailheadAccess && (
            <div style={{
              padding: '10px 14px',
              borderBottom: (trailData.bestStartTime || trailData.conditions) ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ ...labelStyle, marginBottom: 3 }}>Trailhead Access</div>
              <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.5 }}>{trailData.trailheadAccess}</div>
            </div>
          )}

          {/* Best Start Time */}
          {trailData.bestStartTime && (
            <div style={{
              padding: '10px 14px',
              borderBottom: trailData.conditions ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ ...labelStyle, marginBottom: 3 }}>Best Start Time</div>
              <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.5 }}>{trailData.bestStartTime}</div>
            </div>
          )}

          {/* Conditions */}
          {trailData.conditions && (
            <div style={{ padding: '10px 14px' }}>
              <div style={{ ...labelStyle, marginBottom: 3 }}>Trail Conditions</div>
              <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.5 }}>{trailData.conditions}</div>
            </div>
          )}
        </div>
      )}

      {/* Freeform details */}
      {details && (
        <div style={{
          fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7,
          marginBottom: 16,
        }}>
          {renderInlineBlock(details)}
        </div>
      )}

      {/* NPS disclaimer + CTA */}
      {resolvedUrl && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
            <ExternalLinkIcon size={9} color={C.muted} />
            <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: C.muted, lineHeight: 1.4 }}>
              Trail info sourced from NPS. Verify conditions before your visit.
            </span>
          </div>
          <a href={resolvedUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => trackEvent('external_link_clicked', { name: title, url: resolvedUrl, link_type: 'trail_nps' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: F, fontSize: 12, fontWeight: 600,
              color: C.teal, textDecoration: 'none',
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
          <span style={{
            fontFamily: F, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: C.muted, minWidth: 90, flexShrink: 0,
          }}>
            {label}
          </span>
          <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink }}>
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
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>{typeLabel}</span>
        </div>

        {/* Tradition subtitle */}
        <div style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: C.muted, marginBottom: 6 }}>{tradition?.name || entry.tradition}</div>

        {/* Title */}
        <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, margin: 0 }}>{entry.name}</h1>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 60px' }}>
        {/* Summary */}
        <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, marginBottom: 20 }}>{entry.summary}</p>

        {/* Deeper */}
        {entry.deeper && (
          <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, marginBottom: 20 }}>{entry.deeper}</p>
        )}

        {/* Quote block */}
        {entry.quote?.text && (
          <div style={{
            padding: '16px 18px', marginBottom: 20,
            borderLeft: `3px solid ${accent}30`,
            background: `${accent}05`, borderRadius: '0 8px 8px 0',
          }}>
            <p style={{
              fontFamily: F_SERIF, fontSize: 16, fontStyle: 'italic', fontWeight: 400,
              color: C.body, lineHeight: 1.6, margin: 0,
            }}>"{entry.quote.text}"</p>
            {entry.quote.source && (
              <p style={{ fontFamily: F, fontSize: 12, color: C.muted, margin: '8px 0 0' }}>— {entry.quote.source}</p>
            )}
          </div>
        )}

        {/* Practice-specific fields */}
        {entry.type !== 'teaching' && (entry.duration || entry.when || entry.howTo) && (
          <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.sage}12`, padding: '13px 15px', marginBottom: 20 }}>
            {entry.duration && (
              <div style={{ marginBottom: (entry.when || entry.howTo) ? 10 : 0 }}>
                <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, marginBottom: 1 }}>Duration</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink }}>{entry.duration}</div>
              </div>
            )}
            {entry.when && (
              <div style={{ borderTop: entry.duration ? `1px solid ${C.sage}08` : 'none', paddingTop: entry.duration ? 10 : 0, marginBottom: entry.howTo ? 10 : 0 }}>
                <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, marginBottom: 1 }}>When</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.body, lineHeight: 1.45 }}>{entry.when}</div>
              </div>
            )}
            {entry.howTo && (
              <div style={{ borderTop: (entry.duration || entry.when) ? `1px solid ${C.sage}08` : 'none', paddingTop: (entry.duration || entry.when) ? 10 : 0 }}>
                <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, marginBottom: 3 }}>How To</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: C.body, lineHeight: 1.6 }}>{entry.howTo}</div>
              </div>
            )}
          </div>
        )}

        {/* Attribution */}
        {entry.sources?.[0] && (
          <div style={{ fontFamily: F, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
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

function DetailPanelContent({ item, lovedItems, onLove, onAlternatives }) {
  if (!item) return null;
  const { type, data, thumbId } = item;

  // Logistics form panels
  if (type === 'flights') {
    return <FlightFormPanel data={item.savedData} logistics={item.logistics} onSave={item.onSave} />;
  }
  if (type === 'rental') {
    return <RentalFormPanel data={item.savedData} logistics={item.logistics} onSave={item.onSave} />;
  }
  if (type === 'accommodation') {
    const accom = data;
    const s = PICK_STYLES.stay;
    if (item.alternatives === undefined) {
      console.warn(`[DetailPanel] alternatives is undefined for accommodation: ${accom?.name}`);
    }
    const alts = item.alternatives || [];
    const accomLabel = { fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted };
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        {/* Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${s.color}0e`, border: `1px solid ${s.color}18` }}>
            <CategoryIcon category="stay" color={s.color} size={12} />
            <span style={{ ...accomLabel, color: s.color }}>{s.label}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, border: `1px solid ${s.color}20`, background: `${s.color}04` }}>
            <LilaStar size={9} color={s.color} />
            <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.color }}>Lila Pick</span>
          </div>
        </div>

        {/* Title + location */}
        <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.2, marginBottom: 4 }}>{accom.name}</h1>
        {accom.location && (
          <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: C.muted, marginBottom: 6 }}>{accom.location}</div>
        )}
        {accom.vibe && <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, fontStyle: 'italic', color: C.sage, lineHeight: 1.4, marginBottom: 14 }}>{accom.vibe}</div>}

        {/* Why */}
        <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, marginBottom: 16 }}>{accom.why}</p>

        {/* Stat grid — matches trail panel style */}
        {(accom.stayType || accom.priceRange || accom.distanceFromPark) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 16 }}>
            {accom.stayType && (
              <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <div style={{ ...accomLabel, marginBottom: 4 }}>Type</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink }}>{accom.stayType}</div>
              </div>
            )}
            {accom.priceRange && (
              <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <div style={{ ...accomLabel, marginBottom: 4 }}>Price</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink }}>{accom.priceRange}</div>
              </div>
            )}
            {accom.distanceFromPark && (
              <div style={{ padding: '10px 12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, gridColumn: 'span 2' }}>
                <div style={{ ...accomLabel, marginBottom: 4 }}>Distance from Park</div>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink }}>{accom.distanceFromPark}</div>
              </div>
            )}
          </div>
        )}

        {/* Alternatives */}
        {alts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...accomLabel, marginBottom: 10 }}>Other Options</div>
            {alts.map((alt, i) => (
              <div key={i} style={{ padding: '14px 16px', borderRadius: 8, background: C.white, border: `1px solid ${C.border}`, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                  <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.ink }}>{alt.name}</div>
                  {alt.priceRange && (
                    <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: s.color, letterSpacing: '0.02em', flexShrink: 0 }}>{alt.priceRange}</span>
                  )}
                </div>
                {alt.vibe && <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, fontStyle: 'italic', color: C.sage, marginBottom: 6 }}>{alt.vibe}</div>}
                <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.55 }}>{alt.why}</div>
              </div>
            ))}
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
    return <CompanionPanelContent type={type} data={data} id={thumbId} lovedItems={lovedItems} onLove={onLove} />;
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
        <style>{`
          @keyframes practiceBreathPanel {
            0%   { opacity: 0; transform: translateX(-80%); }
            12%  { opacity: 0.7; transform: translateX(0%); }
            45%  { opacity: 0.6; transform: translateX(5%); }
            60%  { opacity: 0.7; transform: translateX(0%); }
            75%  { opacity: 0; transform: translateX(-80%); }
            100% { opacity: 0; transform: translateX(-80%); }
          }
        `}</style>
        <div aria-hidden style={{
          position: 'absolute', top: 0, bottom: 0,
          left: '-40%', width: '180%',
          background: 'linear-gradient(to right, transparent 0%, #dceee9 25%, #e2eeeb 50%, #dceee9 75%, transparent 100%)',
          animation: 'practiceBreathPanel 16s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto', padding: '20px 24px 60px' }}>
          {/* Lotus + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <IconLotus size={38} color="#4A9B9F" />
            <span style={{
              fontFamily: F, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
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
              <span style={{
                fontFamily: F, fontSize: 10, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
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
                : <PracticeIcon size={10} color={accent} />}
              <span style={{
                fontFamily: F, fontSize: 10, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: accent,
              }}>{typeLabel}</span>
            </div>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300,
            color: '#1a2530', lineHeight: 1.3, marginBottom: 6,
          }}>{data.name}</h1>

          {/* Reactions */}
          <MindfulnessReactions
            id={thumbId}
            lovedItems={lovedItems}
            onLove={onLove}
          />

          {/* Essence */}
          <p style={{
            fontFamily: F, fontSize: 14, fontWeight: 400,
            color: C.body, lineHeight: 1.7, margin: '0 0 16px',
          }}>{data.essence}</p>

          {/* Connection — italic */}
          {data.connection && (
            <p style={{
              fontFamily: F, fontSize: 14, fontWeight: 400,
              fontStyle: 'italic', color: '#3D5A6B', opacity: 0.8,
              lineHeight: 1.6, margin: '0 0 20px',
            }}>{data.connection}</p>
          )}

          {/* Quote */}
          {data.quote?.text && (
            <div style={{
              padding: '14px 18px', marginBottom: 20,
              borderLeft: `3px solid ${accent}40`,
              background: `${accent}08`, borderRadius: '0 8px 8px 0',
            }}>
              <p style={{
                fontFamily: F_SERIF, fontSize: 16, fontStyle: 'italic', fontWeight: 400,
                color: C.body, lineHeight: 1.6, margin: 0,
              }}>"{data.quote.text}"</p>
              {data.quote.source && (
                <p style={{
                  fontFamily: F, fontSize: 11, color: C.muted,
                  margin: '8px 0 0',
                }}>— {data.quote.source}</p>
              )}
            </div>
          )}

          {/* How to practice */}
          {data.howTo && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: F, fontSize: 10, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: `${accent}cc`, marginBottom: 8,
              }}>How to practice</div>
              <p style={{
                fontFamily: F, fontSize: 14, fontWeight: 400,
                color: C.body, lineHeight: 1.7, margin: 0,
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
              <span style={{
                fontFamily: F, fontSize: 12, fontWeight: 600,
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
        lovedItems={lovedItems}
        onLove={onLove}
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
            <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: dot }}>{data.time}</span>
          </div>
        )}

        {/* Title */}
        <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, marginBottom: 4 }}>{data.title}</h1>

        <ActivityActions id={thumbId} lovedItems={lovedItems} onLove={onLove} onAlternatives={onAlternatives} />

        {/* Summary */}
        <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, marginBottom: 20 }}>{data.summary}</p>

        {/* Details */}
        {data.details && (
          <div style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, padding: '6px 0', paddingLeft: 13, borderLeft: `3px solid ${dot}30`, marginBottom: 20 }}>
            {renderInlineBlock(data.details)}
          </div>
        )}

        {/* Learn more link */}
        {data.url && (
          <a href={data.url} target="_blank" rel="noopener noreferrer"
            onClick={() => trackEvent('external_link_clicked', { name: data.title, url: data.url, link_type: 'activity' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: F, fontSize: 13, fontWeight: 600,
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
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: s.color }}>{s.label}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, border: `1px solid ${s.color}20`, background: `${s.color}04` }}>
          <LilaStar size={9} color={s.color} />
          <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.color }}>Lila Pick</span>
        </div>
      </div>

      {/* Pick name */}
      <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, marginBottom: 4 }}>
        <LinkedName name={data.name} url={data.url} linkType="pick" style={{ fontFamily: F, fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }} />
        {(data.url || lookupUrl(data.name)) && <> <ExternalLinkIcon size={12} color={`${C.sage}40`} /></>}
      </h1>

      <ActivityActions id={thumbId} lovedItems={lovedItems} onLove={onLove} onAlternatives={onAlternatives} />

      {/* Vibe line */}
      {data.vibe && (
        <div style={{
          fontFamily: F, fontSize: 13, fontWeight: 500,
          fontStyle: 'italic', color: C.sage, lineHeight: 1.4, marginBottom: 14,
        }}>
          {data.vibe}
        </div>
      )}

      {/* Why */}
      <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.7, marginBottom: 20 }}>{data.why}</p>

      {/* Stat grid */}
      {(() => {
        const gridLabel = { fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, marginBottom: 4 };
        const gridValue = { fontFamily: F, fontSize: 14, fontWeight: 500, color: C.ink };
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
                <div style={gridLabel}>{c.label}</div>
                <div style={gridValue}>{c.value}</div>
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
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontFamily: F, fontSize: 13, fontWeight: 600,
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
      {alternatives.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>Other Options</div>
          {alternatives.map((alt, i) => (
            <div key={i} style={{ padding: '14px 16px', borderRadius: 8, background: C.white, border: `1px solid ${C.border}`, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.ink }}>{alt.name}</div>
                {alt.priceRange && (
                  <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: s.color, letterSpacing: '0.02em', flexShrink: 0 }}>{alt.priceRange}</span>
                )}
              </div>
              {alt.vibe && (
                <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, fontStyle: 'italic', color: C.sage, marginBottom: 6 }}>
                  {alt.vibe}
                </div>
              )}
              <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.55 }}>{alt.why}</div>
              {(alt.duration || alt.whereToGet) && (
                <div style={{ fontFamily: F, fontSize: 12, color: C.muted, marginTop: 6 }}>
                  {[alt.duration, alt.whereToGet].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

/* ── logistics form panels ─────────────────────────────────────────────── */

const logisticsLabelStyle = { fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: 4, display: 'block' };
const logisticsInputStyle = { width: '100%', padding: '9px 12px', fontFamily: F, fontSize: 13, color: C.ink, background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, outline: 'none', boxSizing: 'border-box' };

function FlightFormPanel({ data, logistics, onSave }) {
  const [form, setForm] = useState(data || { airline: '', flightNumber: '', departureAirport: '', arrivalAirport: logistics?.arrivalAirport || '', date: '', departureTime: '' });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  if (data && !form._editing) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`, marginBottom: 10 }}>
          <PlaneIcon size={12} color={C.teal} />
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.teal }}>Flights</span>
        </div>
        <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, marginBottom: 16 }}>Your Flight Details</h1>
        <div style={{ ...CARD_STYLE, padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{data.airline} {data.flightNumber}</div>
          <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.6 }}>
            {data.departureAirport && <>{data.departureAirport} → {data.arrivalAirport}<br /></>}
            {data.date && <>{data.date}{data.departureTime ? ` · ${data.departureTime}` : ''}</>}
          </div>
        </div>
        <button onClick={() => setForm({ ...data, _editing: true })} style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit →</button>
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
        <PlaneIcon size={12} color={C.teal} />
        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.teal }}>Flights</span>
      </div>
      <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, marginBottom: 20 }}>Your Flight Details</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label style={logisticsLabelStyle}>Airline</label><input style={logisticsInputStyle} value={form.airline} onChange={e => set('airline', e.target.value)} placeholder="e.g. United Airlines" /></div>
        <div><label style={logisticsLabelStyle}>Flight Number</label><input style={logisticsInputStyle} value={form.flightNumber} onChange={e => set('flightNumber', e.target.value)} placeholder="e.g. UA 1234" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={logisticsLabelStyle}>Departure Airport</label><input style={logisticsInputStyle} value={form.departureAirport} onChange={e => set('departureAirport', e.target.value)} placeholder="e.g. SFO" /></div>
          <div><label style={logisticsLabelStyle}>Arrival Airport</label><input style={logisticsInputStyle} value={form.arrivalAirport} onChange={e => set('arrivalAirport', e.target.value)} placeholder="e.g. LAS" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={logisticsLabelStyle}>Date</label><input style={logisticsInputStyle} value={form.date} onChange={e => set('date', e.target.value)} placeholder="e.g. Mar 15, 2026" /></div>
          <div><label style={logisticsLabelStyle}>Departure Time</label><input style={logisticsInputStyle} value={form.departureTime} onChange={e => set('departureTime', e.target.value)} placeholder="e.g. 8:30 AM" /></div>
        </div>
        <button onClick={handleSave} style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.white, background: C.teal, border: 'none', borderRadius: 20, padding: '10px 28px', cursor: 'pointer', alignSelf: 'flex-start', marginTop: 4 }}>Save Flight</button>
      </div>
    </div>
  );
}

function RentalFormPanel({ data, logistics, onSave }) {
  const [form, setForm] = useState(data || { company: '', confirmationNumber: '', pickupLocation: logistics?.pickupLocation || '', pickupDate: '', returnDate: '' });
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  if (data && !form._editing) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 20px 60px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 20, background: `${C.teal}0e`, border: `1px solid ${C.teal}18`, marginBottom: 10 }}>
          <CarIcon size={12} color={C.teal} />
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.teal }}>Rental Car</span>
        </div>
        <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, marginBottom: 16 }}>Your Rental Details</h1>
        <div style={{ ...CARD_STYLE, padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{data.company}</div>
          <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.6 }}>
            {data.confirmationNumber && <>Conf: {data.confirmationNumber}<br /></>}
            {data.pickupLocation && <>Pickup: {data.pickupLocation}<br /></>}
            {data.pickupDate && <>{data.pickupDate}{data.returnDate ? ` → ${data.returnDate}` : ''}</>}
          </div>
        </div>
        <button onClick={() => setForm({ ...data, _editing: true })} style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit →</button>
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
        <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.teal }}>Rental Car</span>
      </div>
      <h1 style={{ fontFamily: F_SERIF, fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, marginBottom: 20 }}>Your Rental Details</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label style={logisticsLabelStyle}>Rental Company</label><input style={logisticsInputStyle} value={form.company} onChange={e => set('company', e.target.value)} placeholder="e.g. Enterprise" /></div>
        <div><label style={logisticsLabelStyle}>Confirmation Number</label><input style={logisticsInputStyle} value={form.confirmationNumber} onChange={e => set('confirmationNumber', e.target.value)} placeholder="e.g. ABC123456" /></div>
        <div><label style={logisticsLabelStyle}>Pickup Location</label><input style={logisticsInputStyle} value={form.pickupLocation} onChange={e => set('pickupLocation', e.target.value)} placeholder="e.g. LAS Airport" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={logisticsLabelStyle}>Pickup Date</label><input style={logisticsInputStyle} value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} placeholder="e.g. Mar 15, 2026" /></div>
          <div><label style={logisticsLabelStyle}>Return Date</label><input style={logisticsInputStyle} value={form.returnDate} onChange={e => set('returnDate', e.target.value)} placeholder="e.g. Mar 20, 2026" /></div>
        </div>
        <button onClick={handleSave} style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.white, background: C.teal, border: 'none', borderRadius: 20, padding: '10px 28px', cursor: 'pointer', alignSelf: 'flex-start', marginTop: 4 }}>Save Rental</button>
      </div>
    </div>
  );
}

function DetailPanel({ item, onClose, lovedItems, onLove, onAlternatives }) {
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
        <style>{`
          @keyframes sidePanelSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes sidePanelBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>

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
            <button onClick={onClose} style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${C.white}e0`, border: `1px solid ${C.sage}15`,
              borderRadius: '50%', cursor: 'pointer',
              fontFamily: F, fontSize: 15, color: C.sage, lineHeight: 1,
              WebkitTapHighlightColor: 'transparent',
              boxShadow: `0 2px 8px ${C.ink}08`,
            }} aria-label="Close">✕</button>
          </div>

          <DetailPanelContent item={item} lovedItems={lovedItems} onLove={onLove} onAlternatives={onAlternatives} />
        </div>
      </>
    );
  }

  // Mobile: bottom sheet
  return (
    <>
      <style>{`
        @keyframes bottomSheetSlideIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bottomSheetBackdropIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 249,
        background: 'rgba(0,0,0,0.15)',
        animation: 'bottomSheetBackdropIn 0.25s ease',
      }} />

      {/* Sheet */}
      <div ref={sheetRef} style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '82vh', zIndex: 250,
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
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
            position: 'absolute', top: 8, right: 14,
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${C.white}e0`, border: `1px solid ${C.sage}15`,
            borderRadius: '50%', cursor: 'pointer',
            fontFamily: F, fontSize: 15, color: C.sage, lineHeight: 1,
            WebkitTapHighlightColor: 'transparent',
            boxShadow: `0 2px 8px ${C.ink}08`,
          }} aria-label="Close">✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          <DetailPanelContent item={item} lovedItems={lovedItems} onLove={onLove} onAlternatives={onAlternatives} />
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
};

function getLogistics(destination) {
  const key = (destination || '').toLowerCase().replace(/\s+/g, '-');
  return DESTINATION_LOGISTICS[key] || DESTINATION_LOGISTICS.zion;
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

function LogisticsPanel({ destination, sticky = true, tripLogistics, onOpenPanel, itinerary }) {
  const logistics = getLogistics(destination);
  const savedFlight = tripLogistics?.flights;
  const savedRental = tripLogistics?.rental;
  const dynamicAccom = extractAccommodation(itinerary);
  const accom = dynamicAccom || { name: 'See your itinerary' };
  const accomName = accom.name;

  const openFlights = () => onOpenPanel && onOpenPanel({
    type: 'flights', savedData: savedFlight, logistics,
    onSave: (d) => onOpenPanel({ _updateLogistics: { flights: d } }),
  });
  const openRental = () => onOpenPanel && onOpenPanel({
    type: 'rental', savedData: savedRental, logistics,
    onSave: (d) => onOpenPanel({ _updateLogistics: { rental: d } }),
  });
  const openAccommodation = () => onOpenPanel && onOpenPanel({
    type: 'accommodation', data: accom, alternatives: accom.alternatives || [],
  });

  return (
    <div style={{
      ...CARD_STYLE,
      ...(sticky ? { position: 'sticky', top: 56 } : {}),
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          fontFamily: F, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: C.ink,
        }}>Trip Logistics</div>
      </div>

      {/* Flights */}
      <div style={{ padding: '13px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <PlaneIcon size={12} color={C.muted} />
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>Flights</span>
        </div>
        {savedFlight ? (
          <div onClick={openFlights} style={{ cursor: 'pointer' }}>
            <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{savedFlight.airline} {savedFlight.flightNumber}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: C.muted }}>{savedFlight.departureAirport ? `${savedFlight.departureAirport} → ${savedFlight.arrivalAirport}` : ''}{savedFlight.date ? ` · ${savedFlight.date}` : ''}</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.5, marginBottom: 8 }}>
              {logistics.flights}
            </div>
            <button onClick={openFlights} style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
              + Add your flight →
            </button>
          </>
        )}
      </div>

      {/* Rental Car */}
      <div style={{ padding: '13px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <CarIcon size={12} color={C.muted} />
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>Rental Car</span>
        </div>
        {savedRental ? (
          <div onClick={openRental} style={{ cursor: 'pointer' }}>
            <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{savedRental.company}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: C.muted }}>{savedRental.confirmationNumber ? `Conf: ${savedRental.confirmationNumber}` : ''}{savedRental.pickupDate ? ` · ${savedRental.pickupDate}` : ''}</div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.5, marginBottom: 8 }}>
              {logistics.car}
            </div>
            <button onClick={openRental} style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
              Browse rentals →
            </button>
          </>
        )}
      </div>

      {/* Accommodations */}
      <div style={{ padding: '13px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <CategoryIcon category="stay" color={C.muted} size={12} />
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>Accommodations</span>
        </div>
        <div onClick={openAccommodation} style={{
          background: `${PICK_STYLES.stay.color}06`,
          border: `1px solid ${PICK_STYLES.stay.color}15`,
          borderRadius: 8, padding: '10px 12px', marginBottom: 10, cursor: 'pointer',
          transition: 'background 0.15s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
            <LilaStar size={8} color={PICK_STYLES.stay.color} />
            <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: PICK_STYLES.stay.color }}>Lila Pick</span>
          </div>
          <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{accomName}</div>
          {accom.location && (
            <div style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: C.muted, marginBottom: 3 }}>{accom.location}</div>
          )}
          {accom.vibe && (
            <div style={{ fontFamily: F, fontSize: 11, fontWeight: 500, fontStyle: 'italic', color: C.sage, lineHeight: 1.4 }}>{accom.vibe}</div>
          )}
          {accom.priceRange && (
            <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: PICK_STYLES.stay.color, marginTop: 5 }}>{accom.priceRange}</div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <button onClick={openAccommodation} style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: C.teal, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
            See other options →
          </button>
          <button onClick={openAccommodation} style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
            + Add your reservation
          </button>
        </div>
      </div>
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
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: active ? 600 : 500, color: active ? r.color : C.muted }}>{r.label}</span>
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
        style={{
          width: '100%', marginTop: 8, padding: '7px 0',
          fontFamily: F, fontSize: 13, fontWeight: 400, color: C.body,
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

function DayCard({ day, dayIndex = 0, onOpenPanel, lovedItems, onLove, onAlternatives, feedback, onFeedback, onSwapOpen, swappedActivities }) {
  const color = DAY_COLORS[dayIndex % DAY_COLORS.length];

  return (
    <div style={{
      ...CARD_STYLE,
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{ padding: '14px 18px 10px' }}>
        <div style={{
          fontFamily: F, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: color, marginBottom: 4,
        }}>DAY {dayIndex + 1} &middot; {day.label}</div>
        <div style={{
          fontFamily: F_SERIF, fontSize: 22, fontWeight: 300,
          color: C.ink, lineHeight: 1.15,
        }}>{day.title}</div>
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
            onOpenPanel({
              type: 'mindfulness',
              data: mindfulnessPick,
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
            <style>{`
              @keyframes practiceBreath {
                0%   { opacity: 0; transform: translateX(-80%); }
                12%  { opacity: 0.7; transform: translateX(0%); }
                45%  { opacity: 0.6; transform: translateX(5%); }
                60%  { opacity: 0.7; transform: translateX(0%); }
                75%  { opacity: 0; transform: translateX(-80%); }
                100% { opacity: 0; transform: translateX(-80%); }
              }
            `}</style>
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
                  <div style={{
                    fontFamily: F, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: '#4A9B9F', marginBottom: 4,
                  }}>Mindfulness Practice</div>
                  <div style={{
                    fontFamily: F_SERIF, fontSize: 17, fontWeight: 300,
                    color: '#1a2530', lineHeight: 1.3,
                  }}>{name}</div>
                  {essence && (
                    <div style={{
                      fontFamily: F, fontSize: 13, fontWeight: 400,
                      color: C.body, lineHeight: 1.5, marginTop: 4,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>{essence}</div>
                  )}
                  {glyph && tradition && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                      <span style={{ fontSize: 11, lineHeight: 1 }}>{glyph}</span>
                      <span style={{
                        fontFamily: F, fontSize: 10, fontWeight: 600,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
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
        const tint = lovedTint(lovedItems, thumbId);
        const curatable = isCuratable({ ...b, title: displayTitle });

        const handleShowAlternatives = (id) => {
          if (onSwapOpen) {
            onSwapOpen({ dayIndex, itemIndex: i, thumbId, activityTitle: displayTitle, alternatives: b.alternatives || [] });
          } else {
            onAlternatives(id);
          }
        };

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
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '9px 18px 5px',
              borderTop: `1px solid ${C.border}`,
              cursor: 'pointer',
              background: tint || 'transparent',
              transition: 'background 0.2s',
              WebkitTapHighlightColor: 'transparent',
            }}
            onMouseEnter={e => { if (!tint) e.currentTarget.style.background = 'rgba(28,28,26,0.02)'; }}
            onMouseLeave={e => { if (!tint) e.currentTarget.style.background = 'transparent'; }}
          >
            {/* Time */}
            <span style={{
              fontFamily: F, fontSize: 11, fontWeight: 400,
              color: C.muted, width: 44, flexShrink: 0, paddingTop: 2,
            }}>{b.time || ''}</span>

            {/* Dot */}
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: color, opacity: 0.45,
              flexShrink: 0, marginTop: 6,
            }} />

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: F, fontSize: 14, fontWeight: 500,
                color: C.ink, lineHeight: 1.3, marginBottom: 2,
              }}>{displayTitle}</div>
              {displaySummary && (
                <div style={{
                  fontFamily: F, fontSize: 13, fontWeight: 400,
                  color: C.body, lineHeight: 1.5,
                }}>{displaySummary}</div>
              )}
              {curatable && (
                <div style={{ marginTop: 10 }}>
                  <ActivityActions id={thumbId} lovedItems={lovedItems} onLove={onLove} onAlternatives={handleShowAlternatives} />
                </div>
              )}
            </div>

            {/* Chevron */}
            <Chevron open={false} color={`${C.sage}40`} />
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
      <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.sage}90`, marginBottom: 4 }}>Overall Feeling</div>
      <div style={{ fontFamily: F, fontSize: 14, fontWeight: 400, fontStyle: 'normal', color: `${C.slate}65`, marginBottom: 16 }}>How's this trip shaping up?</div>

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
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: active ? o.color : `${C.slate}90` }}>{o.label}</span>
              <span style={{ fontFamily: F, fontSize: 11, fontWeight: 400, color: active ? `${o.color}90` : `${C.slate}35` }}>{o.sub}</span>
            </button>
          );
        })}
      </div>

      {(pulse === 'close' || pulse === 'rethink') && (
        <div style={{ marginTop: 14 }}>
          <textarea value={overallNote} onChange={e => setOverallNote(e.target.value)}
            onBlur={e => { if (e.target.value.trim()) trackEvent('overall_note_entered', { pulse, note_length: e.target.value.trim().length }); }}
            placeholder={pulse === 'close' ? 'What\'s close but not quite right?' : 'What direction would feel better?'}
            style={{ width: '100%', minHeight: 72, padding: '10px 12px', fontFamily: F, fontSize: 14, fontWeight: 400, color: C.slate, background: C.white, border: `1px solid ${C.sage}15`, borderRadius: 10, resize: 'vertical', lineHeight: 1.55, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      )}
    </div>
  );
}

/* ── refine CTA + premium gate ─────────────────────────────────────────── */

function RefineCTA({ iteration, hasFeedback, onRefine, pulse, onGateShown, onUpgradeClick }) {
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
          <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.seaGlass }}>Trip locked in</span>
        </div>
        <p style={{ fontFamily: F, fontSize: 13, color: `${C.slate}65`, marginTop: 10, lineHeight: 1.5 }}>You can still make changes anytime — just update your day notes above.</p>
      </div>
    );
  }

  if (isPremiumGated) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 20px 0' }}>
        <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: C.muted, lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
          You're in early access — refinements are unlimited for now. Paid plans coming soon.
        </p>
        <div style={{ marginTop: 14 }}>
          <button onClick={onRefine} disabled={!hasFeedback} style={{
            fontFamily: F, fontSize: 14, fontWeight: 600,
            color: hasFeedback ? C.white : `${C.sage}80`,
            background: hasFeedback ? C.oceanTeal : `${C.sage}08`,
            border: hasFeedback ? 'none' : `1px solid ${C.sage}15`,
            borderRadius: 24, padding: '12px 28px',
            cursor: hasFeedback ? 'pointer' : 'default',
            WebkitTapHighlightColor: 'transparent',
            boxShadow: hasFeedback ? `0 2px 12px ${C.oceanTeal}20` : 'none',
            transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 7,
          }}>
            <SparkleIcon size={14} color={hasFeedback ? C.white : `${C.sage}40`} />
            Refine this trip
          </button>
        </div>
      </div>
    );
    /* ── Paywall UI (disabled during beta) ──────────────────────────────
    return (
      <div style={{ background: C.white, borderRadius: 2, border: `1px solid ${C.oceanTeal}20`, boxShadow: `0 2px 16px ${C.oceanTeal}08`, padding: '24px 20px', marginTop: 20, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: `${C.oceanTeal}10`, border: `1px solid ${C.oceanTeal}20`, marginBottom: 14 }}>
          <SparkleIcon size={12} color={C.oceanTeal} />
          <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.oceanTeal }}>Lila Pro</span>
        </div>
        <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: C.slate, marginBottom: 6 }}>Keep refining your perfect trip</h3>
        <p style={{ fontFamily: F, fontSize: 14, color: `${C.slate}99`, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 18px' }}>
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
              <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: `${C.slate}AA` }}>{f.text}</span>
            </div>
          ))}
        </div>
        <button onClick={onUpgradeClick} style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.white, background: C.oceanTeal, border: 'none', borderRadius: 24, padding: '12px 28px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 12px ${C.oceanTeal}25`, transition: 'all 0.2s' }}>
          Upgrade to Lila Pro
        </button>
        <div style={{ fontFamily: F, fontSize: 12, color: `${C.slate}65`, marginTop: 8 }}>Starting at $9/trip</div>
      </div>
    );
    ────────────────────────────────────────────────────────────────────── */
  }

  return (
    <div style={{ textAlign: 'center', padding: '24px 20px 0' }}>
      <button onClick={onRefine} disabled={!hasFeedback} style={{
        fontFamily: F, fontSize: 14, fontWeight: 600,
        color: hasFeedback ? C.white : `${C.sage}80`,
        background: hasFeedback ? C.oceanTeal : `${C.sage}08`,
        border: hasFeedback ? 'none' : `1px solid ${C.sage}15`,
        borderRadius: 24, padding: '12px 28px',
        cursor: hasFeedback ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent',
        boxShadow: hasFeedback ? `0 2px 12px ${C.oceanTeal}20` : 'none',
        transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 7,
      }}>
        <SparkleIcon size={14} color={hasFeedback ? C.white : `${C.sage}40`} />
        Refine this trip
      </button>
      <div style={{ fontFamily: F, fontSize: 12, color: `${C.slate}65`, marginTop: 8 }}>
        {remaining} free refinement{remaining !== 1 ? 's' : ''} remaining
      </div>
      {!hasFeedback && (
        <div style={{ fontFamily: F, fontSize: 12, color: `${C.sage}90`, marginTop: 4, fontStyle: 'normal' }}>
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

function RefiningOverlay({ visible, iteration = 0 }) {
  const [completedIndex, setCompletedIndex] = useState(-1);
  const [breathPhase, setBreathPhase] = useState(0);
  const allDone = completedIndex >= REFINING_STEPS.length - 1;

  // Reset state when overlay becomes visible
  useEffect(() => {
    if (visible) {
      setCompletedIndex(-1);
      setBreathPhase(0);
    }
  }, [visible]);

  // Step timings
  useEffect(() => {
    if (!visible) return;
    const timings = [5000, 18000, 40000, 65000];
    const timeouts = timings.map((delay, i) =>
      setTimeout(() => setCompletedIndex(i), delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, [visible]);

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
      <div style={{
        fontFamily: F_SERIF,
        fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: 300,
        color: C.slate, marginBottom: 6, textAlign: 'center',
      }}>Refining your trip</div>

      {/* Subtitle */}
      <div style={{
        fontFamily: F,
        fontSize: 14, fontWeight: 400,
        color: C.sage, opacity: 0.75,
        marginBottom: 28, textAlign: 'center',
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
              <span style={{
                fontFamily: F, fontSize: 13, fontWeight: isActive ? 600 : 400,
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
      <div style={{
        fontFamily: F,
        fontSize: 11, fontWeight: 500,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: `${C.sage}99`,
        marginTop: 8,
      }}>
        {allDone ? 'Finalizing...' : `${Math.max(0, completedIndex + 1)} of ${REFINING_STEPS.length}`}
      </div>

      {/* Refinement quota callout */}
      <div style={{
        fontFamily: F,
        fontSize: 12, fontWeight: 400,
        color: C.muted,
        marginTop: 20, textAlign: 'center',
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
      <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: C.oceanTeal }}>Revision {iteration}</span>
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
      elements.push(<h1 key={key++} style={{ fontFamily: F, fontSize: 'clamp(26px, 7vw, 34px)', fontWeight: 600, color: C.slate, lineHeight: 1.2, margin: '28px 0 10px' }}>{renderInline(line.slice(2))}</h1>);
    } else if (/^## [^#]/.test(line)) {
      elements.push(<h2 key={key++} style={{ fontFamily: F, fontSize: 'clamp(20px, 5.5vw, 26px)', fontWeight: 600, color: C.slate, margin: '24px 0 8px' }}>{renderInline(line.slice(3))}</h2>);
    } else if (/^### /.test(line)) {
      elements.push(<h3 key={key++} style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: C.sage, margin: '18px 0 6px' }}>{renderInline(line.slice(4))}</h3>);
    } else if (/^\s*[-*] /.test(line)) {
      elements.push(<div key={key++} style={{ display: 'flex', gap: 8, padding: '3px 0' }}><span style={{ color: C.sage, flexShrink: 0 }}>•</span><span style={{ fontFamily: F, fontSize: 14, color: C.slate, lineHeight: 1.65 }}>{renderInline(line.replace(/^\s*[-*] /, ''))}</span></div>);
    } else if (/^\d+\.\s/.test(line)) {
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        elements.push(<div key={key++} style={{ display: 'flex', gap: 8, padding: '3px 0' }}><span style={{ fontFamily: F, fontSize: 13, color: C.sage, fontWeight: 700, flexShrink: 0, minWidth: 18 }}>{numMatch[1]}.</span><span style={{ fontFamily: F, fontSize: 14, color: C.slate, lineHeight: 1.65 }}>{renderInline(numMatch[2])}</span></div>);
      }
    } else if (/^>\s/.test(line)) {
      elements.push(<div key={key++} style={{ borderLeft: `3px solid ${C.oceanTeal}30`, paddingLeft: 14, margin: '12px 0', fontFamily: F, fontSize: 'clamp(15px, 4vw, 18px)', fontStyle: 'normal', color: `${C.slate}AA`, lineHeight: 1.6 }}>{renderInline(line.slice(2))}</div>);
    } else if (line.trim() === '') {
      elements.push(<div key={key++} style={{ height: 6 }} />);
    } else {
      elements.push(<p key={key++} style={{ fontFamily: F, fontSize: 14, color: C.slate, lineHeight: 1.75, margin: '5px 0' }}>{renderInline(line)}</p>);
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
    { icon: FlameIcon, color: C.goldenAmber, label: 'Love This', desc: 'Keep this — it feels right',
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
        <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${C.sage}75`, marginBottom: 22 }}>Lila Trips</div>

        {/* Headline */}
        <h2 style={{ fontFamily: F_SERIF, fontSize: 'clamp(22px, 5.5vw, 28px)', fontWeight: 300, color: C.ink, lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 12 }}>Your itinerary is ready to explore.</h2>

        {/* Body */}
        <p style={{ fontFamily: F, fontSize: 14, fontWeight: 400, color: `${C.slate}D9`, lineHeight: 1.75, marginBottom: 28 }}>We built this around what you shared with us. Read through it, react to what stands out, and we'll keep shaping it until it's yours.</p>

        {/* Divider */}
        <div style={{ height: 1, background: `${C.sage}10`, marginBottom: 24 }} />

        {/* Section header */}
        <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 4 }}>As you read, tell us how it's landing.</div>
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: `${C.slate}99`, lineHeight: 1.6, marginBottom: 16 }}>Each activity has three reactions — use them as you go.</div>

        {/* Reaction rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 0 }}>
          {reactions.map((r, i) => {
            const Ic = r.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 20,
                  background: r.bg, border: `1px solid ${r.border}`,
                  flexShrink: 0,
                }}>
                  <Ic size={13} color={r.color} active />
                  <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: r.color }}>{r.label}</span>
                </div>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: `${C.slate}CC` }}>{r.desc}</span>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `${C.sage}10`, marginTop: 28, marginBottom: 20 }} />

        {/* Freemium note */}
        <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: `${C.slate}AA`, lineHeight: 1.65, textAlign: 'center', marginBottom: 24 }}>
          You're in early access — refinements are unlimited for now. Shape it until it feels right.
        </p>

        {/* CTA */}
        <button onClick={onDismiss} style={{
          width: '100%', padding: '14px 0',
          fontFamily: F, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
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

/* ── SwapModal — pick an alternative activity ──────────────────────────── */

function SwapModal({ isOpen, onClose, activityTitle, alternatives, onConfirm }) {
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
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${C.sage}90` }}>Explore alternatives</span>
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
          <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: 6 }}>Currently planned</div>
          <div style={{ fontFamily: F_SERIF, fontSize: 17, fontWeight: 400, color: C.ink, lineHeight: 1.3 }}>{activityTitle}</div>
        </div>

        {/* Alternatives */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>Alternatives</div>
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
                <div style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 3 }}>{alt.title}</div>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: C.body, lineHeight: 1.5 }}>{alt.summary}</div>
              </div>
            );
          }) : (
            <div style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: C.muted, lineHeight: 1.6, padding: '8px 0' }}>
              No alternatives available — your feedback will be noted in the next refinement.
            </div>
          )}
        </div>

        {/* Optional note */}
        <div style={{ marginBottom: 20 }}>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Looking for something specific? (optional)"
            rows={2}
            style={{
              width: '100%', padding: '10px 12px',
              fontFamily: F, fontSize: 13, fontWeight: 400,
              color: C.ink, background: C.warm,
              border: `1px solid ${C.sage}25`, borderRadius: 8,
              resize: 'vertical', lineHeight: 1.5,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{
            fontFamily: F, fontSize: 13, fontWeight: 600,
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
            style={{
              fontFamily: F, fontSize: 13, fontWeight: 700,
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
    <div style={{
      position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9998,
      fontFamily: F, fontSize: 14, fontWeight: 600,
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
  const [loadingShared, setLoadingShared] = useState(!!shareToken);

  // Seed from router state, then sessionStorage fallback, then own locally
  const [rawItinerary, setRawItinerary] = useState(() => {
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
    if (rawItinerary) sessionStorage.setItem('lila_raw_itinerary', rawItinerary);
  }, [rawItinerary]);
  useEffect(() => {
    if (formData) sessionStorage.setItem('lila_form_data', JSON.stringify(formData));
  }, [formData]);
  useEffect(() => {
    if (metadata) sessionStorage.setItem('lila_metadata', JSON.stringify(metadata));
  }, [metadata]);

  // Hydrate via server-side API when accessed via a share link (/trip/:token)
  // Uses the service role key on the server to bypass RLS policies
  useEffect(() => {
    console.log('[SharedTrip] effect fired', { shareToken, rawItinerary: !!rawItinerary });
    if (!shareToken || rawItinerary) return;
    (async () => {
      try {
        const res = await fetch(`/api/get-shared-trip?token=${encodeURIComponent(shareToken)}`);
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          console.log('[SharedTrip] API returned', res.status, errBody);
          setLoadingShared(false);
          navigate('/plan');
          return;
        }
        const data = await res.json();
        console.log('[SharedTrip] API result', { id: data.id, hasItinerary: !!data.rawItinerary });
        setRawItinerary(data.rawItinerary);
        setItineraryId(data.id);
        setLoadingShared(false);
        if (data.formData) setFormData(data.formData);
      } catch (e) {
        console.log('[SharedTrip] redirecting to /plan — caught exception', e);
        setLoadingShared(false);
        navigate('/plan');
      }
    })();
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

  // Trip logistics form state (session-only)
  const [tripLogistics, setTripLogistics] = useState({
    flights: null,  // { airline, flightNumber, departureAirport, arrivalAirport, date, departureTime }
    rental: null,   // { company, confirmationNumber, pickupLocation, pickupDate, returnDate }
  });
  const [lovedItems, setLovedItems] = useState({});
  const [swapModal, setSwapModal] = useState(null); // { dayIndex, itemIndex, thumbId, activityTitle, alternatives }
  const [swappedActivities, setSwappedActivities] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [pulse, setPulse] = useState(null);
  const [overallNote, setOverallNote] = useState('');
  const [refineError, setRefineError] = useState(null);

  // Save panel state
  const [savePanelOpen, setSavePanelOpen] = useState(false);

  // First draft modal state
  const [showDraftModal, setShowDraftModal] = useState(() => !shareToken);

  // Itinerary ID for save/share
  const [itineraryId, setItineraryId] = useState(() =>
    sessionStorage.getItem('lila_itinerary_id') || null
  );

  // Detail panel state — unified for activities, picks, and companion cards
  const [activePanel, setActivePanel] = useState(null); // { type, data, thumbId }

  // Lock body scroll when panel is open
  useEffect(() => {
    if (activePanel) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activePanel]);

  useEffect(() => {
    // Don't redirect while still loading a shared trip
    if (loadingShared) return;
    if (!rawItinerary) { navigate('/plan'); return; }
    setTimeout(() => setVisible(true), 100);
    // Persist active trip to localStorage for nav backpack icon
    localStorage.setItem('lila_active_trip', JSON.stringify({
      path: shareToken ? `/trip/${shareToken}` : '/itinerary',
      destination: formData?.destination || 'Your Trip',
      generatedAt: Date.now(),
    }));
  }, [rawItinerary, navigate, loadingShared, shareToken, formData]);

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

  // Enrich days with companion data from practices service
  const enrichedDays = useMemo(() => {
    if (!isStructured || !formData) return itinerary?.days || [];
    try {
      const practiceResults = getPracticesForItinerary(formData);
      return assignCompanions(itinerary.days, practiceResults);
    } catch (e) {
      console.error('Companion assignment failed, using plain days:', e.message);
      return itinerary.days;
    }
  }, [isStructured, itinerary, formData]);
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
      saveItinerary({
        formData,
        rawItinerary,
        destination: formData?.destination,
        iteration: 0,
      }).then(id => {
        if (id) {
          sessionStorage.setItem('lila_itinerary_id', id);
          setItineraryId(id);
        }
      });
    }
  }, [isStructured, itinerary, formData]);

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
  });

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

  const handleLove = (id) => {
    setLovedItems(prev => {
      const next = { ...prev };
      if (next[id]) { delete next[id]; } else { next[id] = true; }
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

  const hasFeedback = Object.keys(lovedItems).length > 0 || Object.keys(swappedActivities).length > 0 || Object.values(dayFeedback).some(f => f?.note || f?.reaction) || pulse === 'close' || pulse === 'rethink';

  const handleRefine = async () => {
    const nextIteration = iteration + 1;
    const daysSpotOn = Object.values(dayFeedback).filter(f => f.reaction === 'spot-on').length;
    const daysNeedsWork = Object.values(dayFeedback).filter(f => f.reaction === 'needs-work').length;
    trackEvent('refinement_requested', { iteration: nextIteration, days_spot_on: daysSpotOn, days_needs_work: daysNeedsWork, pulse: pulse || 'none' });
    const t0 = performance.now();
    setRefining(true);
    setRefineError(null);
    try {
      const response = await fetch('/api/refine-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary: rawItinerary,
          lovedItems,
          dayFeedback,
          swappedActivities,
          pulse,
          overallNote,
          formData,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Refinement failed');
      }
      setRawItinerary(result.itinerary);
      setIteration(prev => prev + 1);

      // Save feedback for this refinement
      const itineraryId = sessionStorage.getItem('lila_itinerary_id');
      saveFeedback({
        formData,
        itineraryId,
        lovedItems,
        dayFeedback,
        pulse,
        overallNote,
        iteration,
      });

      // Save the newly refined itinerary
      saveItinerary({
        formData,
        rawItinerary: result.itinerary,
        destination: formData?.destination,
        iteration: nextIteration,
      }).then(id => {
        if (id) {
          sessionStorage.setItem('lila_itinerary_id', id);
          setItineraryId(id);
        }
      });

      setDayFeedback({});
      setLovedItems({});
      setSwappedActivities({});
      setPulse(null);
      setOverallNote('');
      trackEvent('refinement_completed', { iteration: nextIteration, duration_ms: Math.round(performance.now() - t0) });
    } catch (err) {
      console.error('Refinement failed:', err);
      trackEvent('refinement_failed', { iteration: nextIteration, error_type: err.message || 'unknown' });
      setRefineError('Something went wrong refining your trip. Please try again.');
    } finally {
      setRefining(false);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    }
  };

  // Render nothing while loading a shared trip or if no itinerary data yet
  if (loadingShared || !rawItinerary) return null;

  return (
    <div style={{ fontFamily: F, background: C.warm, minHeight: '100vh' }}>
      <RefiningOverlay visible={refining} iteration={iteration} />

      {/* First draft modal */}
      {iteration === 0 && showDraftModal && isStructured && (
        <FirstDraftModal onDismiss={() => setShowDraftModal(false)} />
      )}

      {/* Swap modal */}
      <SwapModal
        isOpen={!!swapModal}
        onClose={() => setSwapModal(null)}
        activityTitle={swapModal?.activityTitle || ''}
        alternatives={swapModal?.alternatives || []}
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
        lovedItems={lovedItems} onLove={handleLove} onAlternatives={handleAlternatives} />

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px',
        background: `${C.warm}f0`,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.sage}06`,
      }}>
        <Link to="/" style={{ fontFamily: F, fontSize: 16, fontWeight: 500, letterSpacing: '0.1em', color: C.slate, textDecoration: 'none' }}>Lila Trips</Link>
        <button onClick={() => { trackEvent('save_trip_clicked', { source: 'header' }); setSavePanelOpen(true); }} style={{
          fontFamily: F, fontSize: 12, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: C.cream, background: C.slate,
          border: 'none', padding: '12px 22px',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}>Save This Trip</button>
      </div>

      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '16px 16px 80px',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Hero — left-aligned */}
        {isStructured && (
          <div style={{ textAlign: 'left', padding: '18px 8px 28px' }}>
            <VersionBadge iteration={iteration} />
            <div style={{
              fontFamily: F, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: C.teal, marginBottom: 8,
            }}>Your Itinerary</div>
            <h1 style={{
              fontFamily: F_SERIF, fontSize: 'clamp(26px, 4.5vw, 36px)', fontWeight: 300,
              color: C.ink, lineHeight: 1.15, marginBottom: 8,
            }}>{itinerary.title}</h1>
            {itinerary.subtitle && (
              <p style={{ fontFamily: F_SERIF, fontSize: 14, color: C.muted, fontStyle: 'italic', fontWeight: 400 }}>{itinerary.subtitle}</p>
            )}
            {itinerary.intro && (
              <p style={{ fontFamily: F, fontSize: 14, color: C.body, lineHeight: 1.75, maxWidth: 600, marginTop: 14, fontWeight: 400 }}>{itinerary.intro}</p>
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
          />
        )}

        {/* Logistics panel — mobile only, shown right after celestial snapshot */}
        {isStructured && isMobile && (
          <div style={{ marginBottom: 16 }}>
            <LogisticsPanel
              destination={formData?.destination}
              sticky={false}
              tripLogistics={tripLogistics}
              itinerary={itinerary}
              onOpenPanel={(panelItem) => {
                if (panelItem._updateLogistics) {
                  setTripLogistics(prev => ({ ...prev, ...panelItem._updateLogistics }));
                  setActivePanel(null);
                  return;
                }
                if (panelItem.onSave) {
                  const origSave = panelItem.onSave;
                  panelItem.onSave = (d) => { origSave(d); };
                }
                setActivePanel(panelItem);
              }}
            />
          </div>
        )}

        {/* Day by Day label */}
        {isStructured && (
          <div style={{
            fontFamily: F, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(28,28,26,0.4)', marginBottom: 14, paddingLeft: 8,
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
                      lovedItems={lovedItems} onLove={handleLove} onAlternatives={handleAlternatives}
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
                    <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sage, marginBottom: 12 }}>Before You Go</div>
                    {itinerary.beforeYouGo.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: i < itinerary.beforeYouGo.length - 1 ? `1px solid ${C.sage}06` : 'none' }}>
                        <span style={{ color: `${C.sage}80`, flexShrink: 0, fontSize: 11, marginTop: 2 }}>{"●\uFE0E"}</span>
                        <span style={{ fontFamily: F, fontSize: 14, color: `${C.slate}85`, lineHeight: 1.65 }}>{renderInline(item)}</span>
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
                    <p style={{ fontFamily: F, fontSize: 15, fontWeight: 400, color: `${C.slate}90`, lineHeight: 1.6, fontStyle: 'normal' }}>{itinerary.closingNote}</p>
                  </div>
                )}

                {/* Refinement error */}
                {refineError && (
                  <div style={{ background: `${C.sunSalmon}10`, border: `1px solid ${C.sunSalmon}25`, borderRadius: 12, padding: '12px 16px', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.sunSalmon, lineHeight: 1.4 }}>{refineError}</span>
                    <button onClick={() => setRefineError(null)} style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: `${C.sunSalmon}80`, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', flexShrink: 0, WebkitTapHighlightColor: 'transparent' }}>Dismiss</button>
                  </div>
                )}

                {/* Refine CTA / Premium Gate */}
                <RefineCTA iteration={iteration} hasFeedback={hasFeedback} onRefine={handleRefine} pulse={pulse}
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
                    itinerary={itinerary}
                    onOpenPanel={(panelItem) => {
                      if (panelItem._updateLogistics) {
                        setTripLogistics(prev => ({ ...prev, ...panelItem._updateLogistics }));
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
          <button onClick={() => { clearSession(); trackEvent('new_trip_clicked', { source: 'start_over' }); navigate('/plan'); }} style={{
            fontFamily: F, fontSize: 12, fontWeight: 500,
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
