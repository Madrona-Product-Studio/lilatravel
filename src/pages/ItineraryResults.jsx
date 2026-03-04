import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { C as BrandC } from '@data/brand';
import { lookupUrl } from '@data/destinations/zion-urls';
import JSON5 from 'json5';
import { trackEvent } from '@utils/analytics';
import { getPracticesForItinerary, TRADITIONS } from '@services/practicesService';
import { assignCompanions } from '@services/companionAssigner';
import CelestialMonthStrip from '@components/CelestialMonthStrip';

/*
 * ItineraryResults — Merged V3
 * ────────────────────────────
 * V2 design: Quicksand-first fonts, SVG category icons, refined spacing
 * V3 features: Per-day feedback, trip pulse, refinement flow, premium gate
 * Original: Routing, JSON5 parsing, metadata fallbacks, markdown fallback
 */

/* ── colors ────────────────────────────────────────────────────────────── */

const C = {
  cream:       BrandC.cream,
  slate:       BrandC.darkInk,
  ink:         '#1E2825',     // V2: true ink for titles — high contrast
  body:        '#4A5650',     // V2: warm dark for summaries
  muted:       '#7A857E',     // V2: labels, secondary text
  sage:        '#5A7068',     // V2: slightly warmer sage
  sageLight:   '#8FA39A',
  skyBlue:     BrandC.skyBlue,
  oceanTeal:   BrandC.oceanTeal,
  sunSalmon:   BrandC.sunSalmon,
  goldenAmber: BrandC.goldenAmber,
  seaGlass:    BrandC.seaGlass,
  amber:       '#B8863A',     // V2: rich amber accent
  warm:        '#D4A95A',     // V2: golden warm (timeline dots)
  white:       '#FFFFFF',
};

// V2: consistent warm dots — time-of-day color system to be revisited in brand guide
const WARM_DOT = '#D4A95A';

const DAY_COLORS = [
  C.goldenAmber, C.oceanTeal, C.skyBlue, C.sunSalmon,
  C.seaGlass, '#8B7EC8', C.goldenAmber, C.oceanTeal,
];

const F = "'Quicksand', sans-serif";

/* ── SVG icons ─────────────────────────────────────────────────────────── */

const Chevron = ({ open, color = C.sage }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.35s ease', flexShrink: 0 }}>
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

const ArrowRightIcon = ({ size = 10, color = `${C.sage}50` }) => (
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

/* ── smooth collapsible ─────────────────────────────────────────────────── */

function Collapsible({ open, children }) {
  const ref = useRef(null);
  const [h, setH] = useState(0);
  useEffect(() => { if (ref.current) setH(ref.current.scrollHeight); }, [open, children]);
  return (
    <div style={{ maxHeight: open ? h + 40 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease' }}>
      <div ref={ref} style={{ paddingTop: 12 }}>{children}</div>
    </div>
  );
}

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

/* ── snapshot ───────────────────────────────────────────────────────────── */

function MiniMoon({ phaseName, size = 22 }) {
  const ILLUMINATION = {
    'New Moon': 0, 'Waxing Crescent': 25, 'First Quarter': 50,
    'Waxing Gibbous': 75, 'Full Moon': 100, 'Waning Gibbous': 75,
    'Last Quarter': 50, 'Waning Crescent': 25,
  };
  const illum = (ILLUMINATION[phaseName] ?? 50) / 100;
  return (
    <svg width={size} height={size} viewBox="0 0 22 22">
      <circle cx="11" cy="11" r="9.5" fill="#e8e0d0" />
      {illum < 1 && (
        <ellipse
          cx={11 + (1 - illum) * 9.5}
          cy="11"
          rx={Math.max(0.5, (1 - illum) * 9.5)}
          ry="9.5"
          fill="#1a2a3a"
          opacity="0.65"
        />
      )}
    </svg>
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
    <div style={{ textAlign: 'center', padding: '0 8px 16px' }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sage, marginBottom: 10 }}>Built for You</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
        {chips.map((chip, i) => (
          <span key={i} style={{
            fontFamily: F, fontSize: 11, fontWeight: 500, color: `${C.slate}75`,
            background: `${C.sage}0c`, border: `1px solid ${C.sage}12`,
            borderRadius: 20, padding: '4px 12px', whiteSpace: 'nowrap',
          }}>{chip}</span>
        ))}
      </div>
    </div>
  );
}

function DestinationSnapshot({ snapshot, celestial, weather }) {
  // Resolve values — prefer AI snapshot fields, fall back to API data
  let avgHigh = snapshot?.avgHigh ?? null;
  let avgLow = snapshot?.avgLow ?? null;
  let sunrise = snapshot?.sunrise ?? null;
  let sunset = snapshot?.sunset ?? null;
  let moonName = snapshot?.moonPhase ?? null;
  let stargazing = snapshot?.stargazing ?? null;

  // API fallbacks
  if (avgHigh === null && weather && weather.length > 0) {
    const highs = weather.map(d => d.high);
    const lows = weather.map(d => d.low);
    avgHigh = Math.round(highs.reduce((a, b) => a + b, 0) / highs.length);
    avgLow = Math.round(lows.reduce((a, b) => a + b, 0) / lows.length);
  }
  if (!sunrise && celestial?.days?.[0]) {
    sunrise = celestial.days[0].sunrise;
    sunset = celestial.days[0].sunset;
  }
  if (!moonName && celestial?.moonPhase) {
    moonName = celestial.moonPhase.name;
    stargazing = celestial.moonPhase.stargazing;
  }

  const hasData = avgHigh !== null || sunrise || moonName;
  if (!hasData && !snapshot?.seasonalNote) return null;

  // Build adaptive cells array
  const cells = [];
  if (avgHigh !== null) cells.push({ key: 'temp', label: 'AVG TEMP', render: () => (
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 300, color: C.slate }}>{avgHigh}°</span>
      {avgLow !== null && <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 300, color: `${C.slate}65`, marginLeft: 2 }}>/{avgLow}°</span>}
    </div>
  )});
  if (moonName) cells.push({ key: 'moon', label: moonName.split(' ')[0].toUpperCase(), render: () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <MiniMoon phaseName={moonName} />
    </div>
  )});
  if (sunrise) cells.push({ key: 'sunrise', label: 'SUNRISE', render: () => (
    <div style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: C.slate, textAlign: 'center' }}>{sunrise}</div>
  )});
  if (sunset) cells.push({ key: 'sunset', label: 'SUNSET', render: () => (
    <div style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: C.slate, textAlign: 'center' }}>{sunset}</div>
  )});

  const SERIF = "'Cormorant Garamond', serif";
  const cellLabel = { fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.sage}90`, marginTop: 6, textAlign: 'center' };

  return (
    <div style={{ background: C.white, borderRadius: 2, border: `1px solid ${C.sage}12`, marginBottom: 20 }}>
      {/* Header */}
      <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${C.sage}08` }}>
        <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 300, color: C.slate, lineHeight: 1.3 }}>Trip Conditions</div>
        {snapshot?.seasonalNote && (
          <div style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: `${C.slate}70`, lineHeight: 1.6, marginTop: 4 }}>{snapshot.seasonalNote}</div>
        )}
      </div>

      {/* Data grid */}
      {cells.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}>
          {cells.map((cell, i) => (
            <div key={cell.key} style={{
              padding: '16px 12px 14px',
              borderRight: i < cells.length - 1 ? `1px solid ${C.sage}08` : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              {cell.render()}
              <div style={cellLabel}>{cell.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Packing hint */}
      {snapshot?.packingHint && (
        <div style={{ padding: '14px 22px', borderTop: `1px solid ${C.sage}08` }}>
          <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.sage}90`, marginBottom: 6 }}>PACK</div>
          <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: `${C.slate}70`, lineHeight: 1.5 }}>{snapshot.packingHint}</div>
        </div>
      )}
    </div>
  );
}

/* ── trip overview ─────────────────────────────────────────────────────── */

function TripOverview({ days, onDayClick, dayFeedback = {} }) {
  return (
    <div style={{ background: C.white, borderRadius: 2, border: `1px solid ${C.sage}12`, boxShadow: `0 2px 12px ${C.amber}06`, padding: '20px 20px', marginBottom: 20 }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.sage}90`, marginBottom: 2, paddingLeft: 1 }}>Trip at a Glance</div>
      <div style={{ fontFamily: F, fontSize: 14, fontWeight: 400, fontStyle: 'normal', color: `${C.slate}65`, marginBottom: 18, paddingLeft: 1 }}>Your day-by-day overview</div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 1.5, background: `linear-gradient(180deg, ${C.sage}10, ${C.sage}05)`, borderRadius: 1 }} />

        {days.map((day, i) => {
          const color = DAY_COLORS[i % DAY_COLORS.length];
          const fb = dayFeedback[i];
          return (
            <button key={i} onClick={() => { trackEvent('trip_overview_day_clicked', { day_index: i }); onDayClick(i); }} style={{
              display: 'flex', alignItems: 'center', gap: 14, width: '100%',
              padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left', WebkitTapHighlightColor: 'transparent', position: 'relative',
            }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${color}10`, border: `1.5px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: 2 }}>{day.label}</span>
                  {fb && fb.note && <PencilIcon size={11} color={C.sage} />}
                </div>
                <div style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: C.slate, lineHeight: 1.3 }}>{day.title}</div>
                {day.snapshot && (
                  <div style={{ fontFamily: F, fontSize: 12, color: `${C.slate}80`, lineHeight: 1.45, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{day.snapshot}</div>
                )}
              </div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={`${C.sage}50`} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="6,3 11,8 6,13" /></svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── timeline block ────────────────────────────────────────────────────── */

function TimelineBlock({ time, title, summary, details, timeOfDay = 'morning', url, isLast = false, dayIndex = 0, itemIndex = 0, activityFeedback, onActivityFeedback }) {
  const [open, setOpen] = useState(false);
  const dot = WARM_DOT;
  const resolvedUrl = url || lookupUrl(title);

  const handleToggle = () => {
    if (!details) return;
    if (!open) trackEvent('timeline_detail_expanded', { day_index: dayIndex, activity_title: title });
    setOpen(!open);
  };

  return (
    <div style={{ display: 'flex', gap: 14, minHeight: 44 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%', background: dot,
          boxShadow: `0 0 0 3px ${dot}15, 0 0 12px ${dot}15`,
          flexShrink: 0, marginTop: 5,
        }} />
        {!isLast && <div style={{ width: 1.5, flex: 1, minHeight: 20, background: `linear-gradient(180deg, ${dot}30, ${C.sage}06)` }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
        <button onClick={handleToggle} style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%',
          background: 'none', border: 'none', cursor: details ? 'pointer' : 'default',
          textAlign: 'left', padding: 0, gap: 8, WebkitTapHighlightColor: 'transparent',
        }}>
          <div>
            {time && <div style={{ fontFamily: F, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', color: dot, marginBottom: 3 }}>{time}</div>}
            <div style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{title}</div>
            <div style={{ fontFamily: F, fontSize: 13, color: C.body, lineHeight: 1.6, marginTop: 4 }}>{summary}</div>
          </div>
          {details && <Chevron open={open} color={`${C.sage}50`} />}
        </button>
        {details && (
          <Collapsible open={open}>
            <div style={{ fontFamily: F, fontSize: 13, color: `${C.ink}a8`, lineHeight: 1.7, padding: '6px 0', paddingLeft: 13, borderLeft: `2px solid ${dot}22` }}>
              {renderInlineBlock(details)}
              {resolvedUrl && (
                <a href={resolvedUrl} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackEvent('external_link_clicked', { name: title, url: resolvedUrl, link_type: 'activity' })}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontFamily: F, fontSize: 12, fontWeight: 600,
                    color: C.oceanTeal, textDecoration: 'none',
                    marginTop: 8, padding: '6px 12px',
                    background: `${C.oceanTeal}08`, borderRadius: 8,
                    border: `1px solid ${C.oceanTeal}15`,
                  }}>
                  Learn more <ExternalLinkIcon size={10} color={C.oceanTeal} />
                </a>
              )}
            </div>
          </Collapsible>
        )}
        {onActivityFeedback && (
          <ActivityThumbs id={`day_${dayIndex}_timeline_${itemIndex}`} feedback={activityFeedback} onFeedback={onActivityFeedback} />
        )}
      </div>
    </div>
  );
}

/* ── inline pick ───────────────────────────────────────────────────────── */

function InlinePick({ category, pick, alternatives = [], isLast = false, dayIndex = 0, pickIndex = 0, activityFeedback, onActivityFeedback }) {
  const [showAlts, setShowAlts] = useState(false);
  const styles = {
    stay: { label: 'Where to Stay', color: C.goldenAmber },
    eat:  { label: 'Where to Eat', color: C.sunSalmon },
    gear: { label: 'Gear', color: C.oceanTeal },
    wellness: { label: 'Wellness', color: C.seaGlass },
  };
  const s = styles[category] || styles.stay;

  return (
    <div style={{ marginBottom: isLast ? 0 : 10 }}>
      <div style={{ background: C.white, border: `1.5px solid ${s.color}20`, borderRadius: 2, overflow: 'hidden', boxShadow: `0 2px 10px ${s.color}08` }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: `${s.color}05`, borderBottom: `1px solid ${s.color}10` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <CategoryIcon category={category} color={s.color} size={14} />
              <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: s.color }}>{s.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 5, border: `1px solid ${s.color}20`, background: `${s.color}04` }}>
              <LilaStar size={9} color={s.color} />
              <span style={{ fontFamily: F, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.color }}>Lila Pick</span>
            </div>
          </div>
          {/* Content */}
          <div style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <LinkedName name={pick.name} url={pick.url} linkType="pick" style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: C.ink }} />
              {(pick.url || lookupUrl(pick.name)) && <ExternalLinkIcon size={10} color={`${C.sage}40`} />}
            </div>
            <div style={{ fontFamily: F, fontSize: 12.5, color: C.body, lineHeight: 1.6 }}>{pick.why}</div>
          </div>
          {/* Alternatives */}
          {alternatives.length > 0 && (
            <>
              <button onClick={() => { if (!showAlts) trackEvent('lila_pick_alternatives_viewed', { day_index: dayIndex, category, pick_name: pick.name }); setShowAlts(!showAlts); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px 14px', background: `${s.color}04`, border: 'none',
                borderTop: `1px solid ${s.color}0c`, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              }}>
                <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: s.color }}>
                  {showAlts ? 'Hide options' : `${alternatives.length} other option${alternatives.length > 1 ? 's' : ''}`}
                </span>
                <Chevron open={showAlts} color={s.color} />
              </button>
              <Collapsible open={showAlts}>
                <div style={{ padding: '0 14px 10px' }}>
                  {alternatives.map((alt, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: i < alternatives.length - 1 ? `1px solid ${C.sage}06` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                        <LinkedName name={alt.name} url={alt.url} linkType="alternative" style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.slate }} />
                        {(alt.url || lookupUrl(alt.name)) && <ExternalLinkIcon size={9} color={`${C.sage}35`} />}
                      </div>
                      <div style={{ fontFamily: F, fontSize: 12, color: `${C.slate}70`, lineHeight: 1.55 }}>{alt.why}</div>
                    </div>
                  ))}
                </div>
              </Collapsible>
            </>
          )}
          {onActivityFeedback && (
            <div style={{ padding: '6px 14px 10px' }}>
              <ActivityThumbs id={`day_${dayIndex}_pick_${pickIndex}`} feedback={activityFeedback} onFeedback={onActivityFeedback} />
            </div>
          )}
        </div>
    </div>
  );
}

/* ── ActivityThumbs — inline reaction buttons for timeline blocks and pick cards ── */

function ActivityThumbs({ id, feedback, onFeedback }) {
  const current = feedback?.[id] || null;
  const currentReaction = typeof current === 'string' ? current : current?.reaction || null;
  const currentNote = typeof current === 'object' ? current?.note || '' : '';
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(currentNote);

  const toggle = (reaction) => {
    if (currentReaction === reaction) {
      onFeedback(id, null);
      if (reaction === 'down') { setNoteOpen(false); setNoteText(''); }
    } else {
      if (reaction === 'down') {
        onFeedback(id, { reaction: 'down', note: noteText });
      } else {
        onFeedback(id, reaction);
        setNoteOpen(false);
        setNoteText('');
      }
    }
  };

  const saveNote = (text) => {
    setNoteText(text);
    onFeedback(id, { reaction: 'down', note: text });
  };

  const reactions = [
    { key: 'fire', icon: FlameIcon, color: C.goldenAmber, label: 'Must do',
      restBg: `${C.goldenAmber}08`, restBorder: `${C.goldenAmber}22`, restIcon: `${C.goldenAmber}70`,
      activeBg: `${C.goldenAmber}18`, activeBorder: `${C.goldenAmber}45` },
    { key: 'up', icon: ThumbUp, color: C.seaGlass, label: 'Love it',
      restBg: `${C.seaGlass}08`, restBorder: `${C.seaGlass}25`, restIcon: `${C.seaGlass}80`,
      activeBg: `${C.seaGlass}18`, activeBorder: `${C.seaGlass}45` },
    { key: 'down', icon: ThumbDown, color: C.sunSalmon, label: 'Not for me',
      restBg: `${C.sunSalmon}08`, restBorder: `${C.sunSalmon}25`, restIcon: `${C.sunSalmon}80`,
      activeBg: `${C.sunSalmon}18`, activeBorder: `${C.sunSalmon}45` },
  ];

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {reactions.map(r => {
          const active = currentReaction === r.key;
          const Ic = r.icon;
          return (
            <button key={r.key} onClick={() => toggle(r.key)} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: active ? '5px 10px' : '5px 8px',
              borderRadius: 8,
              background: active ? r.activeBg : r.restBg,
              border: `1px solid ${active ? r.activeBorder : r.restBorder}`,
              cursor: 'pointer', transition: 'all 0.2s',
              WebkitTapHighlightColor: 'transparent',
            }}>
              <Ic size={14} color={active ? r.color : r.restIcon} active={active} />
              {active && <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: r.color }}>{r.label}</span>}
            </button>
          );
        })}
      </div>
      {/* Down note */}
      {currentReaction === 'down' && (
        <div style={{ marginTop: 6 }}>
          {!noteOpen && !currentNote && (
            <button onClick={() => setNoteOpen(true)} style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: `${C.sunSalmon}90`, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', WebkitTapHighlightColor: 'transparent' }}>+ add note</button>
          )}
          {!noteOpen && currentNote && (
            <button onClick={() => setNoteOpen(true)} style={{ fontFamily: F, fontSize: 11, fontWeight: 500, fontStyle: 'normal', color: `${C.slate}60`, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', textAlign: 'left', WebkitTapHighlightColor: 'transparent', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
              "{currentNote.length > 60 ? currentNote.slice(0, 60) + '…' : currentNote}" <span style={{ fontStyle: 'normal', color: `${C.sunSalmon}80` }}>edit</span>
            </button>
          )}
          {noteOpen && (
            <div style={{ marginTop: 4 }}>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="What doesn't feel right?"
                rows={2}
                style={{ width: '100%', padding: '8px 10px', fontFamily: F, fontSize: 12, fontWeight: 400, color: C.slate, background: C.white, border: `1px solid ${C.sunSalmon}25`, borderRadius: 8, resize: 'vertical', lineHeight: 1.5, outline: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
                <button onClick={() => setNoteOpen(false)} style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: `${C.sage}70`, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>Cancel</button>
                <button onClick={() => { saveNote(noteText); setNoteOpen(false); }} style={{ fontFamily: F, fontSize: 10, fontWeight: 600, color: C.white, background: C.sunSalmon, border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>Save</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── DayNote — conditional per-day note ───────────────────────────────── */

function DayNote({ dayIndex, feedback, onFeedback, hasActivitySignals }) {
  const noteText = feedback?.note || '';
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(noteText);

  // Collapsed link mode when activity signals exist
  if (hasActivitySignals && !editing && !noteText) {
    return (
      <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${C.sage}0c` }}>
        <button onClick={() => setEditing(true)} style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: `${C.sage}60`, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', WebkitTapHighlightColor: 'transparent' }}>+ Add a note about this day</button>
      </div>
    );
  }

  // Show saved note in compact form
  if (hasActivitySignals && !editing && noteText) {
    return (
      <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${C.sage}0c` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontFamily: F, fontSize: 12, fontStyle: 'normal', color: `${C.slate}60`, lineHeight: 1.5 }}>"{noteText}"</div>
          <button onClick={() => { setText(noteText); setEditing(true); }} style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: `${C.sage}60`, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', flexShrink: 0 }}>Edit</button>
        </div>
      </div>
    );
  }

  // Full textarea mode
  return (
    <div style={{ marginTop: 14, padding: '14px 0 4px', borderTop: `1.5px solid ${C.sage}14` }}>
      <div style={{ fontFamily: F, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted, marginBottom: 10 }}>
        How does this day feel?
      </div>
      <textarea value={editing ? text : noteText} onChange={e => setText(e.target.value)}
        placeholder="Any thoughts on this day? E.g. 'less hiking, more time in town'"
        style={{ width: '100%', minHeight: 64, padding: '10px 12px', fontFamily: F, fontSize: 13, fontWeight: 400, color: C.slate, background: C.white, border: `1px solid ${C.sage}18`, borderRadius: 10, resize: 'vertical', lineHeight: 1.55, outline: 'none', boxSizing: 'border-box' }}
        onFocus={(e) => { e.target.style.borderColor = `${C.sage}40`; if (!editing) { setText(noteText); setEditing(true); } }}
        onBlur={e => e.target.style.borderColor = `${C.sage}18`}
      />
      {(editing || text !== noteText) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
          <button onClick={() => { setEditing(false); setText(noteText); }} style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: `${C.sage}70`, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>Cancel</button>
          <button onClick={() => { onFeedback(dayIndex, { note: text.trim() }); setEditing(false); }} style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: C.white, background: C.sage, border: 'none', borderRadius: 8, padding: '5px 14px', cursor: 'pointer', transition: 'all 0.2s' }}>Save</button>
        </div>
      )}
    </div>
  );
}

/* ── companion card (teaching + practice recommendations) ──────────────── */

function CompanionCard({ companion, onOpenDetail }) {
  if (!companion) return null;
  const { teaching, practice } = companion;
  if (!teaching && !practice) return null;

  return (
    <div style={{
      padding: '16px 16px',
      background: `linear-gradient(145deg, ${C.cream}, ${C.white})`,
      border: `1px solid ${C.sage}15`,
      borderRadius: 2,
      borderLeft: `4px solid ${C.seaGlass}50`,
      marginBottom: 12,
      boxShadow: `0 2px 12px ${C.amber}06, inset 0 1px 0 ${C.white}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle inner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 120, height: 120,
        background: `radial-gradient(circle at top right, ${C.amber}06, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Teaching */}
      {teaching && (
        <button onClick={() => onOpenDetail('teaching', teaching)} style={{
          display: 'flex', alignItems: 'flex-start', gap: 11, width: '100%', textAlign: 'left',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: practice ? '0 0 14px' : 0,
          borderBottom: practice ? `1px solid ${C.sage}0e` : 'none',
          WebkitTapHighlightColor: 'transparent', position: 'relative',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.goldenAmber}14, ${C.goldenAmber}08)`,
            border: `1px solid ${C.goldenAmber}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1,
            boxShadow: `0 1px 4px ${C.goldenAmber}0c`,
          }}>
            <TeachingIcon size={14} color={C.goldenAmber} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.goldenAmber, marginBottom: 4 }}>Today's Teaching</div>
            <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: 4 }}>{teaching.title}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: C.body, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{teaching.essence}</div>
          </div>
          <ArrowRightIcon size={10} color={`${C.sage}50`} />
        </button>
      )}

      {/* Practice */}
      {practice && (
        <button onClick={() => onOpenDetail('practice', practice)} style={{
          display: 'flex', alignItems: 'flex-start', gap: 11, width: '100%', textAlign: 'left',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: teaching ? '14px 0 0' : 0,
          WebkitTapHighlightColor: 'transparent', position: 'relative',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.seaGlass}14, ${C.seaGlass}08)`,
            border: `1px solid ${C.seaGlass}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1,
            boxShadow: `0 1px 4px ${C.seaGlass}0c`,
          }}>
            <PracticeIcon size={14} color={C.seaGlass} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.seaGlass }}>Today's Practice</span>
              {practice.duration && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ClockIcon size={8} color={C.muted} />
                  <span style={{ fontFamily: F, fontSize: 9, fontWeight: 500, color: C.muted }}>{practice.duration}</span>
                </span>
              )}
            </div>
            <div style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: 4 }}>{practice.title}</div>
            <div style={{ fontFamily: F, fontSize: 12, color: C.body, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{practice.description}</div>
          </div>
          <ArrowRightIcon size={10} color={`${C.sage}50`} />
        </button>
      )}
    </div>
  );
}

/* ── companion detail (slide-over) ────────────────────────────────────── */

function CompanionDetail({ type, data, onClose }) {
  if (!data) return null;
  const isTeaching = type === 'teaching';
  const accent = isTeaching ? C.goldenAmber : C.seaGlass;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: C.cream, overflowY: 'auto', animation: 'companionSlideIn 0.3s ease' }}>
      <style>{`@keyframes companionSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1, display: 'flex', alignItems: 'center', padding: '13px 18px', background: `${C.cream}f0`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.sage}06` }}>
        <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: F, fontSize: 12, fontWeight: 500, color: C.sage, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <BackIcon size={14} color={C.sage} /> Back to itinerary
        </button>
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '26px 20px 60px' }}>
        {/* Type badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 7, background: `${accent}0e`, border: `1px solid ${accent}18`, marginBottom: 14 }}>
          {isTeaching ? <TeachingIcon size={11} color={accent} /> : <PracticeIcon size={11} color={accent} />}
          <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent }}>{isTeaching ? "Today's Teaching" : "Today's Practice"}</span>
        </div>

        {/* Tradition */}
        {data.tradition && (
          <div style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: `${C.sage}70`, marginBottom: 6 }}>{data.tradition} tradition</div>
        )}

        {/* Title */}
        <h1 style={{ fontFamily: F, fontSize: 'clamp(21px, 6vw, 27px)', fontWeight: 600, color: C.slate, lineHeight: 1.25, marginBottom: 12 }}>{data.title}</h1>

        {/* Summary / essence */}
        <p style={{ fontFamily: F, fontSize: 14.5, color: `${C.slate}6a`, lineHeight: 1.7, marginBottom: 20 }}>{isTeaching ? data.essence : data.description}</p>

        {/* Deeper content */}
        {data.deeper && (
          <p style={{ fontFamily: F, fontSize: 14, color: `${C.slate}70`, lineHeight: 1.7, marginBottom: 20 }}>{data.deeper}</p>
        )}

        {/* Quote */}
        {data.quote && (
          <div style={{ padding: '14px 16px', borderLeft: `3px solid ${accent}30`, background: `${accent}05`, borderRadius: '0 8px 8px 0', marginBottom: 20 }}>
            <p style={{ fontFamily: F, fontSize: 14, fontStyle: 'normal', color: `${C.slate}70`, lineHeight: 1.6, margin: 0 }}>"{data.quote.text}"</p>
            {data.quote.source && <p style={{ fontFamily: F, fontSize: 11, color: `${C.sage}60`, marginTop: 6, margin: '6px 0 0' }}>— {data.quote.source}</p>}
          </div>
        )}

        {/* Practice-specific: duration, when, howTo */}
        {!isTeaching && (data.duration || data.when || data.howTo) && (
          <div style={{ background: C.white, borderRadius: 2, border: `1px solid ${C.sage}12`, padding: '13px 15px', marginBottom: 20 }}>
            {data.duration && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: (data.when || data.howTo) ? 10 : 0 }}>
                <ClockIcon size={12} color={C.seaGlass} />
                <div>
                  <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: `${C.sage}60`, marginBottom: 1 }}>Duration</div>
                  <div style={{ fontFamily: F, fontSize: 13.5, fontWeight: 500, color: C.slate }}>{data.duration}</div>
                </div>
              </div>
            )}
            {data.when && (
              <div style={{ borderTop: data.duration ? `1px solid ${C.sage}08` : 'none', paddingTop: data.duration ? 10 : 0, marginBottom: data.howTo ? 10 : 0 }}>
                <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: `${C.sage}60`, marginBottom: 1 }}>When</div>
                <div style={{ fontFamily: F, fontSize: 13.5, fontWeight: 500, color: `${C.slate}70`, lineHeight: 1.45 }}>{data.when}</div>
              </div>
            )}
            {data.howTo && (
              <div style={{ borderTop: (data.duration || data.when) ? `1px solid ${C.sage}08` : 'none', paddingTop: (data.duration || data.when) ? 10 : 0 }}>
                <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: `${C.sage}60`, marginBottom: 3 }}>How To</div>
                <div style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: `${C.slate}70`, lineHeight: 1.6 }}>{data.howTo}</div>
              </div>
            )}
          </div>
        )}

        {/* Sources */}
        {data.sources && data.sources.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${C.sage}55`, marginBottom: 8 }}>Sources</div>
            {data.sources.map((s, i) => (
              <div key={i} style={{ fontFamily: F, fontSize: 12, color: `${C.slate}70`, lineHeight: 1.5, marginBottom: 4 }}>
                {s.author && <span style={{ fontWeight: 600 }}>{s.author}</span>}
                {s.author && s.text && ', '}
                {s.text && <em>{s.text}</em>}
                {s.section && ` (${s.section})`}
              </div>
            ))}
          </div>
        )}

        {/* Placeholder for future full content */}
        <div style={{ padding: '16px 14px', background: `${C.sage}05`, borderRadius: 2, border: `1px dashed ${C.sage}10`, textAlign: 'center' }}>
          <div style={{ fontFamily: F, fontSize: 12, fontWeight: 500, color: `${C.sage}50`, lineHeight: 1.5 }}>Full guided {isTeaching ? 'teaching' : 'practice'} experience coming soon.</div>
          <div style={{ fontFamily: F, fontSize: 11, color: `${C.sage}3a`, marginTop: 3 }}>Audio, video, and deeper content from the Lila library.</div>
        </div>
      </div>
    </div>
  );
}

/* ── day card ──────────────────────────────────────────────────────────── */

function DayCard({ day, dayIndex = 0, feedback, onFeedback, onOpenCompanionDetail, activityFeedback, onActivityFeedback }) {
  const [open, setOpen] = useState(true);
  const color = DAY_COLORS[dayIndex % DAY_COLORS.length];
  const hasCompanion = day.companion && (day.companion.teaching || day.companion.practice);
  const hasPicks = day.picks && day.picks.length > 0;
  const hasRecommendations = hasCompanion || hasPicks;

  return (
    <div style={{
      marginBottom: 16, borderRadius: 2, background: C.white,
      border: `1px solid ${open ? `${color}18` : `${C.sage}10`}`,
      boxShadow: open ? `0 4px 24px ${C.amber}0a, 0 1px 3px ${C.ink}05` : `0 1px 6px ${C.sage}06`,
      overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s',
      backgroundImage: open ? `linear-gradient(180deg, ${C.cream}40 0%, ${C.white} 60%)` : 'none',
    }}>
      <button onClick={() => { const next = !open; trackEvent('day_card_toggled', { day_index: dayIndex, action: next ? 'expanded' : 'collapsed' }); setOpen(next); }} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 22px 18px', background: open ? `linear-gradient(160deg, ${color}08, ${C.amber}04, transparent)` : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        borderBottom: open ? `1px solid ${color}15` : 'none',
        transition: 'background 0.3s', WebkitTapHighlightColor: 'transparent', gap: 14,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle radial glow behind day number */}
        {open && <div style={{
          position: 'absolute', top: -20, left: -10, width: 100, height: 100,
          background: `radial-gradient(circle, ${C.warm}0c 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />}
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: open ? `linear-gradient(135deg, ${color}14, ${C.warm}0a)` : `${C.sage}06`,
          border: `1.5px solid ${open ? `${color}25` : `${C.sage}12`}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.3s',
          boxShadow: open ? `0 2px 8px ${color}10` : 'none',
          position: 'relative',
        }}>
          <span style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: open ? color : `${C.sage}60`, transition: 'color 0.3s' }}>{dayIndex + 1}</span>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: open ? color : C.sage, transition: 'color 0.3s', marginBottom: 4 }}>{day.label}</span>
            {feedback?.note && <PencilIcon size={11} color={C.sage} />}
          </div>
          <div style={{ fontFamily: F, fontSize: 19, fontWeight: 700, color: C.ink, lineHeight: 1.25 }}>{day.title}</div>
          {!open && day.snapshot && (
            <div style={{ fontFamily: F, fontSize: 12, color: C.muted, marginTop: 6, lineHeight: 1.55 }}>{day.snapshot}</div>
          )}
        </div>
        <Chevron open={open} color={open ? `${color}60` : `${C.sage}40`} />
      </button>
      <Collapsible open={open}>
        <div style={{ padding: '0 22px 24px' }}>
          {/* Day intro — Quicksand, breathing room */}
          {day.intro && (
            <div style={{ padding: '20px 0 18px', marginBottom: 4, borderBottom: `1px solid ${C.sage}0a` }}>
              <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: C.body, lineHeight: 1.75, margin: 0 }}>{day.intro}</p>
            </div>
          )}

          {/* ZONE 1: The Flow — timeline activities */}
          <div style={{ paddingTop: day.intro ? 16 : 0 }}>
            {day.timeline && day.timeline.map((b, i) => (
              <TimelineBlock key={i} time={b.time} title={b.title} summary={b.summary}
                details={b.details} timeOfDay={b.timeOfDay} url={b.url} dayIndex={dayIndex}
                itemIndex={i} isLast={i === day.timeline.length - 1}
                activityFeedback={activityFeedback} onActivityFeedback={onActivityFeedback} />
            ))}
          </div>

          {/* ZONE 2: Recommendations — companion + picks */}
          {hasRecommendations && (
            <>
              {/* Zone transition divider */}
              <div style={{ marginTop: 22, position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '0 4px' }}>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${C.warm}30, ${C.warm}18)` }} />
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: `${C.warm}35`, boxShadow: `0 0 6px ${C.warm}20` }} />
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${C.warm}18, ${C.warm}30, transparent)` }} />
              </div>

              <div style={{
                marginTop: 16, paddingTop: 16,
                marginLeft: -22, marginRight: -22, paddingLeft: 22, paddingRight: 22, paddingBottom: 4,
                background: `linear-gradient(180deg, ${C.amber}04, ${C.cream}20, transparent)`,
              }}>
                <div style={{ fontFamily: F, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sage, marginBottom: 14 }}>Recommendations</div>

                {hasCompanion && (
                  <CompanionCard companion={day.companion} onOpenDetail={onOpenCompanionDetail} />
                )}

                {day.picks && day.picks.map((p, i) => (
                  <InlinePick key={i} category={p.category} pick={p.pick} dayIndex={dayIndex}
                    pickIndex={i} alternatives={p.alternatives || []} isLast={i === day.picks.length - 1}
                    activityFeedback={activityFeedback} onActivityFeedback={onActivityFeedback} />
                ))}
              </div>
            </>
          )}

          {/* ZONE 3: Day note */}
          <DayNote dayIndex={dayIndex} feedback={feedback} onFeedback={onFeedback}
            hasActivitySignals={activityFeedback && Object.keys(activityFeedback).some(k => k.startsWith(`day_${dayIndex}_`))} />
        </div>
      </Collapsible>
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
    <div style={{ background: C.white, borderRadius: 2, border: `1px solid ${C.sage}12`, boxShadow: `0 2px 12px ${C.amber}06`, padding: '22px 20px', marginTop: 20 }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.sage}90`, marginBottom: 4 }}>Overall Feeling</div>
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
              <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: active ? o.color : `${C.slate}60` }}>{o.label}</span>
              <span style={{ fontFamily: F, fontSize: 10, fontWeight: 400, color: active ? `${o.color}90` : `${C.slate}35` }}>{o.sub}</span>
            </button>
          );
        })}
      </div>

      {(pulse === 'close' || pulse === 'rethink') && (
        <div style={{ marginTop: 14 }}>
          <textarea value={overallNote} onChange={e => setOverallNote(e.target.value)}
            onBlur={e => { if (e.target.value.trim()) trackEvent('overall_note_entered', { pulse, note_length: e.target.value.trim().length }); }}
            placeholder={pulse === 'close' ? 'What\'s close but not quite right?' : 'What direction would feel better?'}
            style={{ width: '100%', minHeight: 72, padding: '10px 12px', fontFamily: F, fontSize: 13, fontWeight: 400, color: C.slate, background: C.white, border: `1px solid ${C.sage}15`, borderRadius: 10, resize: 'vertical', lineHeight: 1.55, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      )}
    </div>
  );
}

/* ── refine CTA + premium gate ─────────────────────────────────────────── */

function RefineCTA({ iteration, hasFeedback, onRefine, pulse, onGateShown, onUpgradeClick }) {
  const maxFree = 2;
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
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.seaGlass }}>Trip locked in</span>
        </div>
        <p style={{ fontFamily: F, fontSize: 12, color: `${C.slate}65`, marginTop: 10, lineHeight: 1.5 }}>You can still make changes anytime — just update your day notes above.</p>
      </div>
    );
  }

  if (isPremiumGated) {
    return (
      <div style={{ background: C.white, borderRadius: 2, border: `1px solid ${C.oceanTeal}20`, boxShadow: `0 2px 16px ${C.oceanTeal}08`, padding: '24px 20px', marginTop: 20, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: `${C.oceanTeal}10`, border: `1px solid ${C.oceanTeal}20`, marginBottom: 14 }}>
          <SparkleIcon size={12} color={C.oceanTeal} />
          <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.oceanTeal }}>Lila Pro</span>
        </div>
        <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: C.slate, marginBottom: 6 }}>Keep refining your perfect trip</h3>
        <p style={{ fontFamily: F, fontSize: 13, color: `${C.slate}70`, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 18px' }}>
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
              <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: `${C.slate}80` }}>{f.text}</span>
            </div>
          ))}
        </div>
        {/* TODO: Connect to payment/upgrade flow */}
        <button onClick={onUpgradeClick} style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.white, background: C.oceanTeal, border: 'none', borderRadius: 24, padding: '12px 28px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 12px ${C.oceanTeal}25`, transition: 'all 0.2s' }}>
          Upgrade to Lila Pro
        </button>
        <div style={{ fontFamily: F, fontSize: 11, color: `${C.slate}65`, marginTop: 8 }}>Starting at $9/trip</div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '24px 20px 0' }}>
      <button onClick={onRefine} disabled={!hasFeedback} style={{
        fontFamily: F, fontSize: 13, fontWeight: 600,
        color: hasFeedback ? C.white : `${C.sage}50`,
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
      <div style={{ fontFamily: F, fontSize: 11, color: `${C.slate}65`, marginTop: 8 }}>
        {remaining} free refinement{remaining !== 1 ? 's' : ''} remaining
      </div>
      {!hasFeedback && (
        <div style={{ fontFamily: F, fontSize: 11, color: `${C.sage}60`, marginTop: 4, fontStyle: 'normal' }}>
          Add day feedback or rate the overall trip to enable refinement
        </div>
      )}
    </div>
  );
}

/* ── refining overlay ──────────────────────────────────────────────────── */

function RefiningOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: `${C.cream}f5`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${C.sage}15`, borderTopColor: C.oceanTeal, animation: 'lilaSpin 0.9s linear infinite' }} />
      <style>{`@keyframes lilaSpin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontFamily: F, fontSize: 14, fontWeight: 500, color: `${C.slate}70`, marginTop: 20 }}>Refining your trip...</p>
      <p style={{ fontFamily: F, fontSize: 12, fontWeight: 400, color: `${C.slate}65`, marginTop: 4 }}>Incorporating your feedback</p>
    </div>
  );
}

/* ── version badge ─────────────────────────────────────────────────────── */

function VersionBadge({ iteration }) {
  if (iteration === 0) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 8, background: `${C.oceanTeal}08`, border: `1px solid ${C.oceanTeal}15`, marginBottom: 8 }}>
      <SparkleIcon size={10} color={C.oceanTeal} />
      <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: C.oceanTeal }}>Revision {iteration}</span>
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
    else parts.push(<em key={key++} style={{ fontStyle: 'normal', color: `${C.slate}80` }}>{earliest[1]}</em>);
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
      elements.push(<div key={key++} style={{ display: 'flex', gap: 8, padding: '3px 0' }}><span style={{ color: C.sage, flexShrink: 0 }}>•</span><span style={{ fontFamily: F, fontSize: 13, color: C.slate, lineHeight: 1.65 }}>{renderInline(line.replace(/^\s*[-*] /, ''))}</span></div>);
    } else if (/^\d+\.\s/.test(line)) {
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        elements.push(<div key={key++} style={{ display: 'flex', gap: 8, padding: '3px 0' }}><span style={{ fontFamily: F, fontSize: 12, color: C.sage, fontWeight: 700, flexShrink: 0, minWidth: 18 }}>{numMatch[1]}.</span><span style={{ fontFamily: F, fontSize: 13, color: C.slate, lineHeight: 1.65 }}>{renderInline(numMatch[2])}</span></div>);
      }
    } else if (/^>\s/.test(line)) {
      elements.push(<div key={key++} style={{ borderLeft: `3px solid ${C.oceanTeal}30`, paddingLeft: 14, margin: '12px 0', fontFamily: F, fontSize: 'clamp(15px, 4vw, 18px)', fontStyle: 'normal', color: `${C.slate}80`, lineHeight: 1.6 }}>{renderInline(line.slice(2))}</div>);
    } else if (line.trim() === '') {
      elements.push(<div key={key++} style={{ height: 6 }} />);
    } else {
      elements.push(<p key={key++} style={{ fontFamily: F, fontSize: 13, color: C.slate, lineHeight: 1.75, margin: '5px 0' }}>{renderInline(line)}</p>);
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
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
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

function FirstDraftModal({ onClose }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 120); return () => clearTimeout(t); }, []);

  const instructions = [
    { icon: FlameIcon, color: C.goldenAmber, text: 'Flame an activity you absolutely must do' },
    { icon: ThumbUp, color: C.seaGlass, text: 'Thumb up activities you\'re excited about' },
    { icon: ThumbDown, color: C.sunSalmon, text: 'Thumb down what doesn\'t feel right — add a note if you want' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: `${C.ink}60`,
      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 400,
        background: C.cream, borderRadius: 2,
        padding: '36px 32px 32px',
        boxShadow: `0 20px 60px ${C.ink}30, 0 4px 16px ${C.ink}15`,
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12,
          width: 30, height: 30, borderRadius: '50%',
          background: `${C.sage}08`, border: `1px solid ${C.sage}14`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          transition: 'background 0.2s',
        }}>
          <CloseIcon size={12} color={C.sage} />
        </button>

        {/* Wordmark */}
        <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sage, marginBottom: 14 }}>Lila Trips</div>

        {/* Headline */}
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: C.slate, lineHeight: 1.25, marginBottom: 16, whiteSpace: 'pre-line' }}>{"Your first draft\nis ready."}</h2>

        {/* Subhead */}
        <p style={{ fontFamily: F, fontSize: 13, fontWeight: 400, color: `${C.slate}70`, lineHeight: 1.65, marginBottom: 22 }}>React as you read — thumbs up what excites you, flag what doesn't fit. When you're done, we'll reshape the whole trip around your signals.</p>

        {/* Instruction rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {instructions.map((item, i) => {
            const Ic = item.icon;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${item.color}12`, border: `1px solid ${item.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Ic size={16} color={item.color} active />
                </div>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: `${C.slate}80`, lineHeight: 1.45 }}>{item.text}</span>
              </div>
            );
          })}
          {/* Fourth note — no icon box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: `${C.sage}40` }} />
            </div>
            <span style={{ fontFamily: F, fontSize: 12.5, fontWeight: 400, fontStyle: 'normal', color: `${C.slate}55`, lineHeight: 1.45 }}>When you're done, scroll to the bottom and refine your trip.</span>
          </div>
        </div>

        {/* Free refinements callout */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 2,
          background: `${C.goldenAmber}08`, border: `1px solid ${C.goldenAmber}18`,
          marginBottom: 22,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: `${C.goldenAmber}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <LockIcon size={13} color={C.goldenAmber} />
          </div>
          <div>
            <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: C.slate }}>2 free refinements included</div>
            <div style={{ fontFamily: F, fontSize: 11, fontWeight: 400, color: `${C.slate}60`, marginTop: 1 }}>After that, upgrade to Lila Pro to keep going.</div>
          </div>
        </div>

        {/* CTA */}
        <button onClick={onClose} style={{
          width: '100%', padding: '14px 24px',
          fontFamily: F, fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
          color: C.white, background: C.slate,
          border: 'none', borderRadius: 2,
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
          transition: 'opacity 0.2s',
        }}>Start exploring →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* ── MAIN PAGE ─────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════ */

export default function ItineraryResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [refining, setRefining] = useState(false);

  // Seed from router state once, then own locally so refinement can update in-place
  const [rawItinerary, setRawItinerary] = useState(() => location.state?.itinerary || null);
  const [metadata] = useState(() => location.state?.metadata || null);
  const [formData] = useState(() => location.state?.formData || null);

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
  const [activityFeedback, setActivityFeedback] = useState({});
  const [pulse, setPulse] = useState(null);
  const [overallNote, setOverallNote] = useState('');
  const [refineError, setRefineError] = useState(null);

  // First draft modal state
  const [hasSeenDraftModal, setHasSeenDraftModal] = useState(false);

  // Companion detail overlay state
  const [companionDetail, setCompanionDetail] = useState(null); // { type, data }

  useEffect(() => {
    if (!rawItinerary) { navigate('/plan'); return; }
    setTimeout(() => setVisible(true), 100);
  }, [rawItinerary, navigate]);

  if (!rawItinerary) return null;

  // Parse itinerary — re-parses only when rawItinerary changes (i.e. after refinement)
  const itinerary = useMemo(() => {
    if (!rawItinerary) return null;
    try {
      let cleaned = rawItinerary;
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
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
        has_note: Boolean(feedback.note),
        note_length: feedback.note ? feedback.note.length : 0,
      });
    }
    setDayFeedback(prev => {
      const next = { ...prev };
      if (feedback === null || (feedback.note !== undefined && !feedback.note)) { delete next[dayIndex]; } else { next[dayIndex] = feedback; }
      return next;
    });
  };

  const handleActivityFeedback = (id, value) => {
    setActivityFeedback(prev => {
      if (value === null) { const next = { ...prev }; delete next[id]; return next; }
      return { ...prev, [id]: value };
    });
  };

  const hasFeedback = Object.keys(activityFeedback).length > 0 || Object.values(dayFeedback).some(f => f?.note) || pulse === 'close' || pulse === 'rethink';

  const handleRefine = async () => {
    const nextIteration = iteration + 1;
    const daysApproved = Object.values(dayFeedback).filter(f => f.status === 'approved').length;
    const daysAdjusted = Object.values(dayFeedback).filter(f => f.status === 'adjust').length;
    trackEvent('refinement_requested', { iteration: nextIteration, days_approved: daysApproved, days_adjusted: daysAdjusted, pulse: pulse || 'none' });
    const t0 = performance.now();
    setRefining(true);
    setRefineError(null);
    try {
      const response = await fetch('/api/refine-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itinerary: rawItinerary,
          activityFeedback,
          dayFeedback,
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
      setDayFeedback({});
      setActivityFeedback({});
      setPulse(null);
      setOverallNote('');
      trackEvent('refinement_completed', { iteration: nextIteration, duration_ms: Math.round(performance.now() - t0) });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Refinement failed:', err);
      trackEvent('refinement_failed', { iteration: nextIteration, error_type: err.message || 'unknown' });
      setRefineError('Something went wrong refining your trip. Please try again.');
    } finally {
      setRefining(false);
    }
  };

  return (
    <div style={{ fontFamily: F, background: C.cream, minHeight: '100vh' }}>
      <RefiningOverlay visible={refining} />

      {/* First draft modal */}
      {iteration === 0 && !hasSeenDraftModal && isStructured && (
        <FirstDraftModal onClose={() => setHasSeenDraftModal(true)} />
      )}

      {/* Companion detail slide-over */}
      {companionDetail && (
        <CompanionDetail type={companionDetail.type} data={companionDetail.data} onClose={() => setCompanionDetail(null)} />
      )}

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px',
        background: `${C.cream}f0`,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.sage}06`,
      }}>
        <Link to="/" style={{ fontFamily: F, fontSize: 16, fontWeight: 500, letterSpacing: '0.1em', color: C.slate, textDecoration: 'none' }}>Lila Trips</Link>
        <button onClick={() => { trackEvent('new_trip_clicked', { source: 'header' }); navigate('/plan'); }} style={{
          fontFamily: F, fontSize: 10, fontWeight: 600,
          color: C.sage, background: `${C.white}70`,
          border: `1px solid ${C.sage}15`, borderRadius: 20,
          padding: '6px 14px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
        }}>New Trip</button>
      </div>

      <div style={{
        maxWidth: 580, margin: '0 auto', padding: '16px 16px 80px',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.7s cubic-bezier(0.4,0,0.2,1)',
      }}>

        {/* Hero */}
        {isStructured && (
          <div style={{ textAlign: 'center', padding: '18px 8px 28px' }}>
            <VersionBadge iteration={iteration} />
            <h1 style={{ fontFamily: F, fontSize: 'clamp(24px, 6.5vw, 32px)', fontWeight: 600, color: C.slate, lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.01em' }}>{itinerary.title}</h1>
            {itinerary.subtitle && <p style={{ fontFamily: F, fontSize: 13, color: `${C.slate}70`, fontStyle: 'normal', fontWeight: 400 }}>{itinerary.subtitle}</p>}
            {itinerary.intro && <p style={{ fontFamily: F, fontSize: 13, color: `${C.slate}70`, lineHeight: 1.75, maxWidth: 460, margin: '14px auto 0', fontWeight: 400 }}>{itinerary.intro}</p>}
          </div>
        )}

        {/* Trip Profile Summary */}
        {isStructured && formData && <TripProfileSummary formData={formData} />}

        {/* Snapshot */}
        {isStructured && (
          <DestinationSnapshot snapshot={itinerary.snapshot} celestial={metadata?.celestial} weather={metadata?.weather} />
        )}

        {/* Trip Overview */}
        {isStructured && enrichedDays.length > 1 && (
          <TripOverview days={enrichedDays} onDayClick={scrollToDay} dayFeedback={dayFeedback} />
        )}

        {/* Celestial Month Strip */}
        {isStructured && formData?.month && (
          <CelestialMonthStrip month={formData.month} destinationKey={formData?.destination} />
        )}

        {/* Day Cards / Markdown Fallback */}
        {isStructured ? (
          <>
            {enrichedDays.map((day, i) => (
              <div key={i} ref={el => dayRefs.current[i] = el} style={{ scrollMarginTop: 60 }}>
                <DayCard day={day} dayIndex={i} feedback={dayFeedback[i]} onFeedback={handleDayFeedback}
                  activityFeedback={activityFeedback} onActivityFeedback={handleActivityFeedback}
                  onOpenCompanionDetail={(type, data) => {
                    trackEvent('companion_detail_opened', { type, title: data?.title, day_index: i });
                    setCompanionDetail({ type, data });
                  }} />
              </div>
            ))}

            {/* Before You Go */}
            {itinerary.beforeYouGo && (
              <div ref={beforeYouGoRef} style={{ background: C.white, borderRadius: 2, border: `1px solid ${C.sage}12`, padding: '18px 20px', marginTop: 6, boxShadow: `0 2px 10px ${C.amber}05` }}>
                <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sage, marginBottom: 12 }}>Before You Go</div>
                {itinerary.beforeYouGo.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: i < itinerary.beforeYouGo.length - 1 ? `1px solid ${C.sage}06` : 'none' }}>
                    <span style={{ color: `${C.sage}50`, flexShrink: 0, fontSize: 10, marginTop: 2 }}>{"●\uFE0E"}</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: `${C.slate}85`, lineHeight: 1.65 }}>{renderInline(item)}</span>
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
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 400, color: `${C.slate}60`, lineHeight: 1.6, fontStyle: 'normal' }}>{itinerary.closingNote}</p>
              </div>
            )}

            {/* Refinement error */}
            {refineError && (
              <div style={{ background: `${C.sunSalmon}10`, border: `1px solid ${C.sunSalmon}25`, borderRadius: 12, padding: '12px 16px', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <span style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: C.sunSalmon, lineHeight: 1.4 }}>{refineError}</span>
                <button onClick={() => setRefineError(null)} style={{ fontFamily: F, fontSize: 11, fontWeight: 600, color: `${C.sunSalmon}80`, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', flexShrink: 0, WebkitTapHighlightColor: 'transparent' }}>Dismiss</button>
              </div>
            )}

            {/* Refine CTA / Premium Gate */}
            <RefineCTA iteration={iteration} hasFeedback={hasFeedback} onRefine={handleRefine} pulse={pulse}
              onGateShown={() => trackEvent('premium_gate_shown', { iteration })}
              onUpgradeClick={() => trackEvent('premium_upgrade_clicked', { iteration })} />
          </>
        ) : (
          <div style={{ background: C.white, borderRadius: 2, padding: '24px 22px', border: `1px solid ${C.sage}12`, boxShadow: `0 2px 10px ${C.amber}05` }}>
            <MarkdownContent content={rawItinerary} />
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 16 }}>
          <button onClick={() => { trackEvent('new_trip_clicked', { source: 'start_over' }); navigate('/plan'); }} style={{
            fontFamily: F, fontSize: 11, fontWeight: 500,
            color: `${C.sage}60`, background: 'none',
            border: 'none', cursor: 'pointer', padding: '8px 16px',
            WebkitTapHighlightColor: 'transparent',
          }}>Start over with a new trip</button>
        </div>
      </div>
    </div>
  );
}
