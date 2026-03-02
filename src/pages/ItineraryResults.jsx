import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { C as BrandC } from '@data/brand';
import { lookupUrl } from '@data/destinations/zion-urls';
import JSON5 from 'json5';

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
  sage:        '#6B8078',
  sageLight:   '#8FA39A',
  skyBlue:     BrandC.skyBlue,
  oceanTeal:   BrandC.oceanTeal,
  sunSalmon:   BrandC.sunSalmon,
  goldenAmber: BrandC.goldenAmber,
  seaGlass:    BrandC.seaGlass,
  white:       '#FFFFFF',
};

const TIME_COLORS = {
  morning:   '#D4A95A',
  midday:    BrandC.skyBlue,
  afternoon: BrandC.sunSalmon,
  evening:   '#8B7EC8',
  night:     '#6B7B8D',
};

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

function LinkedName({ name, url, style = {} }) {
  const resolvedUrl = url || lookupUrl(name);
  if (resolvedUrl) {
    return (
      <a href={resolvedUrl} target="_blank" rel="noopener noreferrer" style={{
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

function SnapCell({ label, value, sub, color = C.sage }) {
  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color, marginBottom: 5, opacity: 0.85 }}>{label}</div>
      <div style={{ fontFamily: F, fontSize: 17, fontWeight: 600, color: C.slate, lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: `${C.slate}45`, marginTop: 3 }}>{sub}</div>}
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

  const moonEmojis = {
    'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓',
    'Waxing Gibbous': '🌔', 'Full Moon': '🌕', 'Waning Gibbous': '🌖',
    'Last Quarter': '🌗', 'Waning Crescent': '🌘',
  };
  const moonEmoji = moonEmojis[moonName] || '🌙';

  const hasData = avgHigh !== null || sunrise || moonName;
  if (!hasData && !snapshot?.seasonalNote) return null;

  const divider = { borderBottom: `1px solid ${C.sage}08` };

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.sage}0c`, boxShadow: `0 1px 8px ${C.sage}06`, padding: '20px 22px 16px', marginBottom: 20 }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.sage}90`, marginBottom: 4 }}>Conditions & Context</div>

      {snapshot?.seasonalNote && (
        <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: `${C.slate}65`, lineHeight: 1.6, paddingBottom: 12, ...divider }}>{snapshot.seasonalNote}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {avgHigh !== null && (
          <div style={{ borderRight: `1px solid ${C.sage}08`, paddingRight: 14, ...divider }}>
            <SnapCell label="Avg Temp" value={`${avgHigh}° / ${avgLow}°`} sub="high / low" color={C.skyBlue} />
          </div>
        )}
        {moonName && (
          <div style={{ paddingLeft: 14, ...divider }}>
            <SnapCell label="Moon" value={`${moonEmoji} ${moonName}`} sub={stargazing ? `${stargazing} stargazing` : null} color={C.goldenAmber} />
          </div>
        )}
        {sunrise && (
          <div style={{ borderRight: `1px solid ${C.sage}08`, paddingRight: 14, ...divider }}>
            <SnapCell label="Sunrise" value={sunrise} sub="golden hour ~30 min prior" color={C.sunSalmon} />
          </div>
        )}
        {sunset && (
          <div style={{ paddingLeft: 14, ...divider }}>
            <SnapCell label="Sunset" value={sunset} sub="golden hour ~1 hr prior" color="#8B7EC8" />
          </div>
        )}
        {snapshot?.packingHint && (
          <div style={{ gridColumn: '1 / -1', padding: '12px 0 4px' }}>
            <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.seaGlass, marginBottom: 5, opacity: 0.85 }}>Pack</div>
            <div style={{ fontFamily: F, fontSize: 13, fontWeight: 500, color: `${C.slate}65`, lineHeight: 1.5 }}>{snapshot.packingHint}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── trip overview ─────────────────────────────────────────────────────── */

function TripOverview({ days, onDayClick, dayFeedback = {} }) {
  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.sage}0c`, boxShadow: `0 1px 8px ${C.sage}06`, padding: '20px 20px', marginBottom: 20 }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.sage}90`, marginBottom: 2, paddingLeft: 1 }}>Trip at a Glance</div>
      <div style={{ fontFamily: F, fontSize: 14, fontWeight: 400, fontStyle: 'italic', color: `${C.slate}50`, marginBottom: 18, paddingLeft: 1 }}>Your day-by-day overview</div>

      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 1.5, background: `linear-gradient(180deg, ${C.sage}10, ${C.sage}05)`, borderRadius: 1 }} />

        {days.map((day, i) => {
          const color = DAY_COLORS[i % DAY_COLORS.length];
          const fb = dayFeedback[i];
          return (
            <button key={i} onClick={() => onDayClick(i)} style={{
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
                  {fb && fb.status === 'approved' && <CheckIcon size={11} color={C.seaGlass} />}
                  {fb && fb.status === 'adjust' && <PencilIcon size={11} color={C.goldenAmber} />}
                </div>
                <div style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: C.slate, lineHeight: 1.3 }}>{day.title}</div>
                {day.snapshot && (
                  <div style={{ fontFamily: F, fontSize: 12, color: `${C.slate}50`, lineHeight: 1.45, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{day.snapshot}</div>
                )}
              </div>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={`${C.sage}25`} strokeWidth="1.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="6,3 11,8 6,13" /></svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── timeline block ────────────────────────────────────────────────────── */

function TimelineBlock({ time, title, summary, details, timeOfDay = 'morning', url, isLast = false }) {
  const [open, setOpen] = useState(false);
  const dot = TIME_COLORS[timeOfDay] || TIME_COLORS.morning;
  const resolvedUrl = url || lookupUrl(title);

  return (
    <div style={{ display: 'flex', gap: 14, minHeight: 44 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 18, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot, border: `2px solid ${C.white}`, boxShadow: `0 0 0 1.5px ${dot}30`, flexShrink: 0, marginTop: 5 }} />
        {!isLast && <div style={{ width: 1, flex: 1, minHeight: 20, background: `linear-gradient(180deg, ${dot}25, ${C.sage}08)` }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 14 }}>
        <button onClick={() => details && setOpen(!open)} style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%',
          background: 'none', border: 'none', cursor: details ? 'pointer' : 'default',
          textAlign: 'left', padding: 0, gap: 8, WebkitTapHighlightColor: 'transparent',
        }}>
          <div>
            {time && <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: dot, marginBottom: 3 }}>{time}</div>}
            <div style={{ fontFamily: F, fontSize: 17, fontWeight: 600, color: C.slate, lineHeight: 1.3 }}>{title}</div>
            <div style={{ fontFamily: F, fontSize: 13, color: `${C.slate}65`, lineHeight: 1.55, marginTop: 3 }}>{summary}</div>
          </div>
          {details && <Chevron open={open} color={`${C.sage}35`} />}
        </button>
        {details && (
          <Collapsible open={open}>
            <div style={{ fontFamily: F, fontSize: 13, color: `${C.slate}85`, lineHeight: 1.7, padding: '6px 0' }}>
              {renderInlineBlock(details)}
              {resolvedUrl && (
                <a href={resolvedUrl} target="_blank" rel="noopener noreferrer" style={{
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
      </div>
    </div>
  );
}

/* ── inline pick ───────────────────────────────────────────────────────── */

function InlinePick({ category, pick, alternatives = [], isLast = false }) {
  const [showAlts, setShowAlts] = useState(false);
  const styles = {
    stay: { label: 'Where to Stay', color: C.goldenAmber },
    eat:  { label: 'Where to Eat', color: C.sunSalmon },
    gear: { label: 'Gear', color: C.oceanTeal },
    wellness: { label: 'Wellness', color: C.seaGlass },
  };
  const s = styles[category] || styles.stay;

  return (
    <div style={{ display: 'flex', gap: 14, minHeight: 44 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 18, flexShrink: 0 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: `${s.color}20`, border: `2px solid ${s.color}50`, flexShrink: 0, marginTop: 4 }} />
        {!isLast && <div style={{ width: 1, flex: 1, minHeight: 20, background: `linear-gradient(180deg, ${s.color}20, ${C.sage}06)` }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 14 }}>
        <div style={{ background: C.white, border: `1px solid ${s.color}20`, borderRadius: 12, overflow: 'hidden', boxShadow: `0 1px 6px ${s.color}08` }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: `${s.color}06`, borderBottom: `1px solid ${s.color}10` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <CategoryIcon category={category} color={s.color} size={14} />
              <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: s.color }}>{s.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 6, border: `1px solid ${s.color}20` }}>
              <LilaStar size={9} color={s.color} />
              <span style={{ fontFamily: F, fontSize: 8, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.color }}>Lila Pick</span>
            </div>
          </div>
          {/* Content */}
          <div style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <LinkedName name={pick.name} url={pick.url} style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: C.slate }} />
              {(pick.url || lookupUrl(pick.name)) && <ExternalLinkIcon size={10} color={`${C.sage}40`} />}
            </div>
            <div style={{ fontFamily: F, fontSize: 13, color: `${C.slate}65`, lineHeight: 1.6 }}>{pick.why}</div>
          </div>
          {/* Alternatives */}
          {alternatives.length > 0 && (
            <>
              <button onClick={() => setShowAlts(!showAlts)} style={{
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
                        <LinkedName name={alt.name} url={alt.url} style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: C.slate }} />
                        {(alt.url || lookupUrl(alt.name)) && <ExternalLinkIcon size={9} color={`${C.sage}35`} />}
                      </div>
                      <div style={{ fontFamily: F, fontSize: 12, color: `${C.slate}55`, lineHeight: 1.55 }}>{alt.why}</div>
                    </div>
                  ))}
                </div>
              </Collapsible>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── day feedback ──────────────────────────────────────────────────────── */

function DayFeedback({ dayIndex, feedback, onFeedback }) {
  const [noteText, setNoteText] = useState(feedback?.note || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const status = feedback?.status || null;

  const handleApprove = () => {
    onFeedback(dayIndex, { status: 'approved', note: '' });
    setIsExpanded(false);
    setNoteText('');
  };

  const handleAdjust = () => {
    if (isExpanded && noteText.trim()) {
      onFeedback(dayIndex, { status: 'adjust', note: noteText.trim() });
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  };

  const handleClear = () => {
    onFeedback(dayIndex, null);
    setIsExpanded(false);
    setNoteText('');
  };

  // Compact confirmed state
  if (status && !isExpanded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', marginTop: 8, borderTop: `1px solid ${C.sage}08` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {status === 'approved' && <CheckIcon size={12} color={C.seaGlass} />}
          {status === 'adjust' && <PencilIcon size={12} color={C.goldenAmber} />}
          <span style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: status === 'approved' ? C.seaGlass : C.goldenAmber }}>
            {status === 'approved' ? 'On track' : 'Adjustments noted'}
          </span>
        </div>
        <button onClick={handleClear} style={{ fontFamily: F, fontSize: 10, fontWeight: 500, color: `${C.sage}60`, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', WebkitTapHighlightColor: 'transparent' }}>Change</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 12, padding: '14px 0 4px', borderTop: `1px solid ${C.sage}08` }}>
      <div style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${C.sage}70`, marginBottom: 10 }}>
        How does this day feel?
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleApprove} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '10px 12px', borderRadius: 10,
          background: status === 'approved' ? `${C.seaGlass}12` : C.white,
          border: `1px solid ${status === 'approved' ? `${C.seaGlass}35` : `${C.sage}12`}`,
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent', transition: 'all 0.2s',
        }}>
          <CheckIcon size={13} color={status === 'approved' ? C.seaGlass : `${C.sage}50`} />
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: status === 'approved' ? C.seaGlass : `${C.slate}60` }}>On track</span>
        </button>

        <button onClick={handleAdjust} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '10px 12px', borderRadius: 10,
          background: isExpanded || status === 'adjust' ? `${C.goldenAmber}10` : C.white,
          border: `1px solid ${isExpanded || status === 'adjust' ? `${C.goldenAmber}30` : `${C.sage}12`}`,
          cursor: 'pointer', WebkitTapHighlightColor: 'transparent', transition: 'all 0.2s',
        }}>
          <PencilIcon size={13} color={isExpanded || status === 'adjust' ? C.goldenAmber : `${C.sage}50`} />
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 600, color: isExpanded || status === 'adjust' ? C.goldenAmber : `${C.slate}60` }}>I'd adjust</span>
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginTop: 10 }}>
          <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
            placeholder="What would you change? E.g. 'less hiking, more time in town' or 'swap the restaurant for something vegetarian-friendly'"
            style={{ width: '100%', minHeight: 72, padding: '10px 12px', fontFamily: F, fontSize: 13, fontWeight: 400, color: C.slate, background: C.white, border: `1px solid ${C.goldenAmber}25`, borderRadius: 10, resize: 'vertical', lineHeight: 1.55, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = `${C.goldenAmber}50`}
            onBlur={e => e.target.style.borderColor = `${C.goldenAmber}25`}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button onClick={() => { setIsExpanded(false); setNoteText(''); }} style={{ fontFamily: F, fontSize: 11, fontWeight: 500, color: `${C.sage}70`, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px' }}>Cancel</button>
            <button onClick={handleAdjust} disabled={!noteText.trim()} style={{
              fontFamily: F, fontSize: 11, fontWeight: 600,
              color: noteText.trim() ? C.white : `${C.sage}40`,
              background: noteText.trim() ? C.goldenAmber : `${C.sage}10`,
              border: 'none', borderRadius: 8, padding: '6px 14px',
              cursor: noteText.trim() ? 'pointer' : 'default', transition: 'all 0.2s',
            }}>Save note</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── day card ──────────────────────────────────────────────────────────── */

function DayCard({ day, dayIndex = 0, feedback, onFeedback }) {
  const [open, setOpen] = useState(true);
  const color = DAY_COLORS[dayIndex % DAY_COLORS.length];

  return (
    <div style={{
      marginBottom: 14, borderRadius: 16, background: C.white,
      border: `1px solid ${open ? `${color}18` : `${C.sage}0c`}`,
      boxShadow: open ? `0 2px 12px ${color}06` : `0 1px 8px ${C.sage}04`,
      overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px', background: open ? `${color}03` : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        transition: 'background 0.3s', WebkitTapHighlightColor: 'transparent', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: open ? `${color}10` : `${C.sage}06`,
          border: `1.5px solid ${open ? `${color}25` : `${C.sage}12`}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.3s',
        }}>
          <span style={{ fontFamily: F, fontSize: 12, fontWeight: 700, color: open ? color : `${C.sage}70`, transition: 'color 0.3s' }}>{dayIndex + 1}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: F, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: open ? color : C.sage, transition: 'color 0.3s' }}>{day.label}</span>
            {feedback?.status === 'approved' && <CheckIcon size={11} color={C.seaGlass} />}
            {feedback?.status === 'adjust' && <PencilIcon size={11} color={C.goldenAmber} />}
          </div>
          <div style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: C.slate, lineHeight: 1.25, marginTop: 2 }}>{day.title}</div>
          {!open && day.snapshot && (
            <div style={{ fontFamily: F, fontSize: 12, color: `${C.slate}50`, marginTop: 6, lineHeight: 1.55 }}>{day.snapshot}</div>
          )}
        </div>
        <Chevron open={open} />
      </button>
      <Collapsible open={open}>
        <div style={{ padding: '2px 20px 22px' }}>
          {day.intro && <p style={{ fontFamily: F, fontSize: 13, color: `${C.slate}70`, lineHeight: 1.7, margin: '0 0 18px', fontStyle: 'italic' }}>{day.intro}</p>}
          {day.timeline && day.timeline.map((b, i) => (
            <TimelineBlock key={i} time={b.time} title={b.title} summary={b.summary}
              details={b.details} timeOfDay={b.timeOfDay} url={b.url}
              isLast={i === day.timeline.length - 1 && (!day.picks || day.picks.length === 0)} />
          ))}
          {day.picks && day.picks.map((p, i) => (
            <InlinePick key={i} category={p.category} pick={p.pick}
              alternatives={p.alternatives || []} isLast={i === day.picks.length - 1} />
          ))}
          <DayFeedback dayIndex={dayIndex} feedback={feedback} onFeedback={onFeedback} />
        </div>
      </Collapsible>
    </div>
  );
}

/* ── trip pulse ─────────────────────────────────────────────────────────── */

function TripPulse({ overallNote, setOverallNote, pulse, setPulse }) {
  const options = [
    { key: 'love', label: 'Love it', sub: 'Lock it in', color: C.seaGlass, icon: <CheckIcon size={15} color={C.seaGlass} /> },
    { key: 'close', label: 'Almost there', sub: 'A few tweaks', color: C.goldenAmber, icon: <PencilIcon size={15} color={C.goldenAmber} /> },
    { key: 'rethink', label: 'Rethink it', sub: 'Different direction', color: C.sunSalmon, icon: <RefreshIcon size={15} color={C.sunSalmon} /> },
  ];

  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.sage}0c`, boxShadow: `0 1px 8px ${C.sage}06`, padding: '22px 20px', marginTop: 20 }}>
      <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: `${C.sage}90`, marginBottom: 4 }}>Overall Feeling</div>
      <div style={{ fontFamily: F, fontSize: 14, fontWeight: 400, fontStyle: 'italic', color: `${C.slate}50`, marginBottom: 16 }}>How's this trip shaping up?</div>

      <div style={{ display: 'flex', gap: 8 }}>
        {options.map(o => {
          const active = pulse === o.key;
          return (
            <button key={o.key} onClick={() => setPulse(active ? null : o.key)} style={{
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
            placeholder={pulse === 'close' ? 'What\'s close but not quite right?' : 'What direction would feel better?'}
            style={{ width: '100%', minHeight: 72, padding: '10px 12px', fontFamily: F, fontSize: 13, fontWeight: 400, color: C.slate, background: C.white, border: `1px solid ${C.sage}15`, borderRadius: 10, resize: 'vertical', lineHeight: 1.55, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      )}
    </div>
  );
}

/* ── refine CTA + premium gate ─────────────────────────────────────────── */

function RefineCTA({ iteration, hasFeedback, onRefine, pulse }) {
  const maxFree = 2;
  const remaining = maxFree - iteration;
  const isPremiumGated = iteration >= maxFree;

  if (pulse === 'love') {
    return (
      <div style={{ textAlign: 'center', padding: '28px 20px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 24, background: `${C.seaGlass}10`, border: `1px solid ${C.seaGlass}25` }}>
          <CheckIcon size={14} color={C.seaGlass} />
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.seaGlass }}>Trip locked in</span>
        </div>
        <p style={{ fontFamily: F, fontSize: 12, color: `${C.slate}45`, marginTop: 10, lineHeight: 1.5 }}>You can still make changes anytime — just update your day notes above.</p>
      </div>
    );
  }

  if (isPremiumGated) {
    return (
      <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.oceanTeal}20`, boxShadow: `0 2px 16px ${C.oceanTeal}08`, padding: '24px 20px', marginTop: 20, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: `${C.oceanTeal}10`, border: `1px solid ${C.oceanTeal}20`, marginBottom: 14 }}>
          <SparkleIcon size={12} color={C.oceanTeal} />
          <span style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.oceanTeal }}>Lila Pro</span>
        </div>
        <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 600, color: C.slate, marginBottom: 6 }}>Keep refining your perfect trip</h3>
        <p style={{ fontFamily: F, fontSize: 13, color: `${C.slate}55`, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 18px' }}>
          You've used your {maxFree} free refinements. Upgrade to continue iterating and unlock the full trip planning toolkit.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '0 auto 20px', textAlign: 'left' }}>
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
        <button style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: C.white, background: C.oceanTeal, border: 'none', borderRadius: 24, padding: '12px 28px', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 12px ${C.oceanTeal}25`, transition: 'all 0.2s' }}>
          Upgrade to Lila Pro
        </button>
        <div style={{ fontFamily: F, fontSize: 11, color: `${C.slate}35`, marginTop: 8 }}>Starting at $9/trip</div>
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
      <div style={{ fontFamily: F, fontSize: 11, color: `${C.slate}35`, marginTop: 8 }}>
        {remaining} free refinement{remaining !== 1 ? 's' : ''} remaining
      </div>
      {!hasFeedback && (
        <div style={{ fontFamily: F, fontSize: 11, color: `${C.sage}60`, marginTop: 4, fontStyle: 'italic' }}>
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
      <p style={{ fontFamily: F, fontSize: 12, fontWeight: 400, color: `${C.slate}40`, marginTop: 4 }}>Incorporating your feedback</p>
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
    else parts.push(<em key={key++} style={{ fontStyle: 'italic', color: `${C.slate}80` }}>{earliest[1]}</em>);
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
      elements.push(<div key={key++} style={{ borderLeft: `3px solid ${C.oceanTeal}30`, paddingLeft: 14, margin: '12px 0', fontFamily: F, fontSize: 'clamp(15px, 4vw, 18px)', fontStyle: 'italic', color: `${C.slate}80`, lineHeight: 1.6 }}>{renderInline(line.slice(2))}</div>);
    } else if (line.trim() === '') {
      elements.push(<div key={key++} style={{ height: 6 }} />);
    } else {
      elements.push(<p key={key++} style={{ fontFamily: F, fontSize: 13, color: C.slate, lineHeight: 1.75, margin: '5px 0' }}>{renderInline(line)}</p>);
    }
  }
  return <>{elements}</>;
}

/* ═══════════════════════════════════════════════════════════════════════ */
/* ── MAIN PAGE ─────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════════ */

export default function ItineraryResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [refining, setRefining] = useState(false);
  const { itinerary: rawItinerary, metadata, formData } = location.state || {};
  const dayRefs = useRef([]);

  // Feedback state
  const [dayFeedback, setDayFeedback] = useState({});
  const [pulse, setPulse] = useState(null);
  const [overallNote, setOverallNote] = useState('');

  useEffect(() => {
    if (!rawItinerary) { navigate('/plan'); return; }
    setTimeout(() => setVisible(true), 100);
  }, [rawItinerary, navigate]);

  if (!rawItinerary) return null;

  // Parse itinerary
  let itinerary = null;
  try {
    let cleaned = rawItinerary;
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
    itinerary = JSON5.parse(cleaned);
  } catch (e) {
    console.error('JSON parse failed, using markdown fallback:', e.message);
    itinerary = null;
  }

  const isStructured = itinerary && itinerary.days;

  const scrollToDay = (index) => {
    if (dayRefs.current[index]) {
      dayRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDayFeedback = (dayIndex, feedback) => {
    setDayFeedback(prev => {
      const next = { ...prev };
      if (feedback === null) { delete next[dayIndex]; } else { next[dayIndex] = feedback; }
      return next;
    });
  };

  const hasFeedback = Object.keys(dayFeedback).length > 0 || pulse === 'close' || pulse === 'rethink';

  const handleRefine = () => {
    // TODO: Connect to refinement API
    // Should send: original itinerary, dayFeedback, pulse, overallNote, formData
    // and receive a new itinerary to replace rawItinerary
    setRefining(true);
    setTimeout(() => {
      setRefining(false);
      setIteration(prev => prev + 1);
      setDayFeedback({});
      setPulse(null);
      setOverallNote('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2200);
  };

  return (
    <div style={{ fontFamily: F, background: C.cream, minHeight: '100vh' }}>
      <RefiningOverlay visible={refining} />

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
        <button onClick={() => navigate('/plan')} style={{
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
            {itinerary.subtitle && <p style={{ fontFamily: F, fontSize: 13, color: `${C.slate}55`, fontStyle: 'italic', fontWeight: 400 }}>{itinerary.subtitle}</p>}
            {itinerary.intro && <p style={{ fontFamily: F, fontSize: 13, color: `${C.slate}70`, lineHeight: 1.75, maxWidth: 460, margin: '14px auto 0', fontWeight: 400 }}>{itinerary.intro}</p>}
          </div>
        )}

        {/* Snapshot */}
        {isStructured && (
          <DestinationSnapshot snapshot={itinerary.snapshot} celestial={metadata?.celestial} weather={metadata?.weather} />
        )}

        {/* Trip Overview */}
        {isStructured && itinerary.days.length > 1 && (
          <TripOverview days={itinerary.days} onDayClick={scrollToDay} dayFeedback={dayFeedback} />
        )}

        {/* Day Cards / Markdown Fallback */}
        {isStructured ? (
          <>
            {itinerary.days.map((day, i) => (
              <div key={i} ref={el => dayRefs.current[i] = el} style={{ scrollMarginTop: 60 }}>
                <DayCard day={day} dayIndex={i} feedback={dayFeedback[i]} onFeedback={handleDayFeedback} />
              </div>
            ))}

            {/* Before You Go */}
            {itinerary.beforeYouGo && (
              <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.sage}0c`, padding: '18px 20px', marginTop: 6, boxShadow: `0 1px 8px ${C.sage}04` }}>
                <div style={{ fontFamily: F, fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sage, marginBottom: 12 }}>Before You Go</div>
                {itinerary.beforeYouGo.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: i < itinerary.beforeYouGo.length - 1 ? `1px solid ${C.sage}06` : 'none' }}>
                    <span style={{ color: `${C.sage}50`, flexShrink: 0, fontSize: 10, marginTop: 2 }}>●</span>
                    <span style={{ fontFamily: F, fontSize: 13, color: `${C.slate}85`, lineHeight: 1.65 }}>{renderInline(item)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trip Pulse */}
            <TripPulse pulse={pulse} setPulse={setPulse} overallNote={overallNote} setOverallNote={setOverallNote} />

            {/* Closing Note */}
            {itinerary.closingNote && (
              <div style={{ textAlign: 'center', padding: '28px 20px 0' }}>
                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 400, color: `${C.slate}60`, lineHeight: 1.6, fontStyle: 'italic' }}>{itinerary.closingNote}</p>
              </div>
            )}

            {/* Refine CTA / Premium Gate */}
            <RefineCTA iteration={iteration} hasFeedback={hasFeedback} onRefine={handleRefine} pulse={pulse} />
          </>
        ) : (
          <div style={{ background: C.white, borderRadius: 16, padding: '24px 22px', border: `1px solid ${C.sage}0c`, boxShadow: `0 1px 8px ${C.sage}04` }}>
            <MarkdownContent content={rawItinerary} />
          </div>
        )}

        {/* Bottom nav */}
        <div style={{ textAlign: 'center', marginTop: 24, paddingBottom: 16 }}>
          <button onClick={() => navigate('/plan')} style={{
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
