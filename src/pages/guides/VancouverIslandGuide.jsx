// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: VANCOUVER ISLAND GUIDE (dedicated)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Full editorial guide for Vancouver Island — Tofino, Ucluelet, Clayoquot Sound,
// Pacific Rim, Strathcona, and the Victoria regional corridor.
// Uses shared Nav/Footer/FadeIn from the Lila Trips component library,
// with guide-specific components defined locally.
//
// Route: /destinations/vancouver-island
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, Breadcrumb, WhisperBar } from '@components';
import TripCard from '@components/TripCard';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { getTripsByDestination } from '@data/trips';
import { trackEvent } from '@utils/analytics';
import { getCelestialSnapshot } from '@services/celestialService';


// ─── Guide-Specific Components ───────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Quicksand', sans-serif",
      fontSize: 12, fontWeight: 700,
      letterSpacing: "0.28em", textTransform: "uppercase",
      color: C.oceanTeal, marginBottom: 12,
      textAlign: "center",
    }}>{children}</div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 400,
      color: C.darkInk, margin: "0 0 6px", lineHeight: 1.2,
      textAlign: "center",
    }}>{children}</h2>
  );
}

function SectionSub({ children, isMobile }) {
  return (
    <p style={{
      fontFamily: "'Quicksand', sans-serif",
      fontSize: isMobile ? 15 : "clamp(14px, 1.8vw, 15px)", fontWeight: 400,
      color: "#4A5650", margin: "0 auto 28px", lineHeight: 1.7,
      textAlign: isMobile ? "left" : "center", maxWidth: isMobile ? "100%" : 520,
    }}>{children}</p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.stone, margin: 0 }} />;
}

function SectionIcon({ type }) {
  const size = 28;
  const icons = {
    // Rotated diamond — Move / Trails
    move: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="14" y="2" width="15" height="15" rx="2" transform="rotate(45 14 2)"
          stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    // Circle — Breathe / Wellness
    breathe: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10"
          stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    // Star/sparkle — Awaken / Light & Sky
    awaken: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M14 3 L16 11 L24 14 L16 17 L14 25 L12 17 L4 14 L12 11 Z"
          stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    // Two overlapping circles — Connect
    connect: (
      <svg width={size} height={size} viewBox="0 0 32 28" fill="none">
        <circle cx="12" cy="14" r="9" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="14" r="9" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    // House/shelter — Stay
    stay: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M4 14 L14 5 L24 14" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 13 L7 23 L21 23 L21 13" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    // Calendar/window — When to go
    windows: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="2" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <line x1="14" y1="4" x2="14" y2="24" stroke={C.oceanTeal} strokeWidth="1.5" />
        <line x1="4" y1="14" x2="24" y2="14" stroke={C.oceanTeal} strokeWidth="1.5" />
      </svg>
    ),
    // Threshold — crescent
    threshold: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
          stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    // Compass — plan
    plan: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <path d="M11 17 L13 13 L17 11 L15 15 Z" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    // People — group
    group: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="10" cy="10" r="3.5" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="10" r="3.5" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <path d="M4 22 C4 17 7 15 10 15 C11.5 15 12.5 15.5 14 16.5 C15.5 15.5 16.5 15 18 15 C21 15 24 17 24 22" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    // Heart — give back / stewardship
    giveback: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M14 24 C14 24 4 17 4 11 C4 7.7 6.7 5 10 5 C11.8 5 13.3 5.9 14 7.2 C14.7 5.9 16.2 5 18 5 C21.3 5 24 7.7 24 11 C24 17 14 24 14 24 Z"
          stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
      </svg>
    ),
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
      {icons[type]}
    </div>
  );
}

function ListItem({ name, detail, note, tags, featured, url, isMobile, onOpenSheet, location }) {
  const nameEl = onOpenSheet ? (
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.darkInk }}>{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600,
      color: C.darkInk, textDecoration: "none",
      borderBottom: `1px solid ${C.stone}`, transition: "border-color 0.2s, color 0.2s",
    }} onMouseEnter={e => { e.target.style.borderColor = C.oceanTeal; e.target.style.color = C.slate || "#3D5A6B"; }}
       onMouseLeave={e => { e.target.style.borderColor = C.stone; e.target.style.color = C.darkInk; }}>
      {name}
      <span style={{ fontSize: 12, marginLeft: 4, color: "#7A857E" }}>{"↗"}</span>
    </a>
  ) : (
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.darkInk }}>{name}</span>
  );

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet({ type: 'list', name, detail, note, tags, featured, url, location }) : undefined}
      style={{
        display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: 14, padding: "16px 0", borderBottom: `1px solid ${C.stone}`,
        ...(onOpenSheet ? { cursor: 'pointer', transition: 'background 0.15s' } : {}),
      }}
      onMouseEnter={onOpenSheet ? e => { e.currentTarget.style.background = `${C.stone}30`; } : undefined}
      onMouseLeave={onOpenSheet ? e => { e.currentTarget.style.background = 'transparent'; } : undefined}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
          {nameEl}
          {featured && (
            <span style={{
              padding: "2px 10px", border: `1px solid ${C.oceanTeal}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.oceanTeal,
            }}>{"Lila Pick"}</span>
          )}
        </div>
        <div style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: isMobile ? 14 : "clamp(13px, 1.5vw, 14px)", fontWeight: 400,
          color: "#4A5650", lineHeight: 1.65,
        }}>{detail}</div>
        {note && (
          <div style={{
            fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600,
            color: C.oceanTeal, marginTop: 4,
          }}>{note}</div>
        )}
        {tags && tags.length > 0 && (
          <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
            {tags.map((t, i) => (
              <span key={i} style={{
                padding: "2px 8px", background: C.stone + "60",
                fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600,
                color: "#7A857E",
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StayItem({ name, location, tier, detail, tags, url, featured, isMobile, onOpenSheet }) {
  const styles = {
    elemental: { color: C.seaGlass, label: "Elemental", bg: `${C.seaGlass}15` },
    rooted: { color: C.oceanTeal, label: "Rooted", bg: `${C.oceanTeal}12` },
    premium: { color: C.goldenAmber, label: "Premium", bg: `${C.goldenAmber}15` },
  };
  const s = styles[tier];
  const nameEl = onOpenSheet ? (
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.darkInk }}>{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600,
      color: C.darkInk, textDecoration: "none",
      borderBottom: `1px solid ${C.stone}`, transition: "border-color 0.2s",
    }} onMouseEnter={e => e.target.style.borderColor = C.oceanTeal}
       onMouseLeave={e => e.target.style.borderColor = C.stone}>
      {name}
      <span style={{ fontSize: 12, marginLeft: 4, color: "#7A857E" }}>{"↗"}</span>
    </a>
  ) : (
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.darkInk }}>{name}</span>
  );

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet({ type: 'stay', name, location, tier, detail, tags, featured, url }) : undefined}
      style={{
        display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: 14, padding: "18px 0", borderBottom: `1px solid ${C.stone}`,
        ...(onOpenSheet ? { cursor: 'pointer', transition: 'background 0.15s' } : {}),
      }}
      onMouseEnter={onOpenSheet ? e => { e.currentTarget.style.background = `${C.stone}30`; } : undefined}
      onMouseLeave={onOpenSheet ? e => { e.currentTarget.style.background = 'transparent'; } : undefined}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{
            padding: "2px 10px", background: s.bg,
            fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase", color: s.color,
          }}>{s.label}</span>
          <span style={{
            fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 500, color: "#7A857E",
          }}>{location}</span>
          {featured && (
            <span style={{
              padding: "2px 10px", border: `1px solid ${C.oceanTeal}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.oceanTeal,
            }}>{"Lila Pick"}</span>
          )}
        </div>
        <div style={{ marginBottom: 3 }}>{nameEl}</div>
        <div style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: isMobile ? 14 : "clamp(13px, 1.5vw, 14px)", fontWeight: 400,
          color: "#4A5650", lineHeight: 1.65,
        }}>{detail}</div>
        {tags && (
          <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
            {tags.map((t, i) => (
              <span key={i} style={{
                padding: "2px 8px", background: C.stone + "60",
                fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600,
                color: "#7A857E",
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpandableList({ children, initialCount = 5, label = "more" }) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(children) ? children : [children];
  const visible = expanded ? items : items.slice(0, initialCount);
  const hasMore = items.length > initialCount;

  return (
    <div>
      {visible}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            margin: "20px 0 0", padding: "8px 0", paddingBottom: 4,
            background: "none", border: "none",
            borderBottom: `1px solid ${C.darkInk}`,
            cursor: "pointer",
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: C.darkInk, transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.55"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {expanded ? "Show less" : `Show ${items.length - initialCount} more ${label}`}
          <span style={{
            display: "inline-block",
            transition: "transform 0.25s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            fontSize: 11,
          }}>{"▼"}</span>
        </button>
      )}
    </div>
  );
}

function GuideDetailSheet({ item, onClose, isMobile }) {
  const sheetRef = useRef(null);
  const dragStartY = useRef(null);
  const dragCurrentY = useRef(0);

  if (!item) return null;

  const onTouchStart = (e) => { dragStartY.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    dragCurrentY.current = dy;
    if (dy > 0 && sheetRef.current) sheetRef.current.style.transform = `translateY(${dy}px)`;
  };
  const onTouchEnd = () => {
    if (dragCurrentY.current > 80) { onClose(); }
    else if (sheetRef.current) { sheetRef.current.style.transform = 'translateY(0)'; }
    dragStartY.current = null;
    dragCurrentY.current = 0;
  };

  const tierStyles = {
    elemental: { color: C.seaGlass, label: "Elemental", bg: `${C.seaGlass}15` },
    rooted: { color: C.oceanTeal, label: "Rooted", bg: `${C.oceanTeal}12` },
    premium: { color: C.goldenAmber, label: "Premium", bg: `${C.goldenAmber}15` },
  };

  const content = (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '26px 20px 60px' }}>
      {/* Badge row */}
      {item.type === 'stay' && item.tier && tierStyles[item.tier] && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{
            padding: '2px 10px', background: tierStyles[item.tier].bg,
            fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: tierStyles[item.tier].color,
          }}>{tierStyles[item.tier].label}</span>
          {item.location && (
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 500, color: '#7A857E' }}>{item.location}</span>
          )}
        </div>
      )}
      {item.type === 'list' && item.section && (
        <span style={{
          display: 'inline-block', padding: '2px 10px', background: `${C.oceanTeal}15`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.oceanTeal, marginBottom: 10,
        }}>{item.section}</span>
      )}

      {/* Name */}
      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 400,
        color: C.darkInk, margin: '0 0 10px', lineHeight: 1.2,
      }}>{item.name}</h3>

      {/* Lila Pick */}
      {item.featured && (
        <span style={{
          display: 'inline-block', padding: '2px 10px', border: `1px solid ${C.oceanTeal}40`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.oceanTeal, marginBottom: 14,
        }}>Lila Pick</span>
      )}

      {/* Detail */}
      {item.detail && (
        <p style={{
          fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400,
          color: '#4A5650', lineHeight: 1.7, margin: '0 0 14px',
        }}>{item.detail}</p>
      )}

      {/* Note */}
      {item.note && (
        <div style={{
          fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 600,
          color: C.oceanTeal, marginBottom: 14,
        }}>{item.note}</div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {item.tags.map((t, i) => (
            <span key={i} style={{
              padding: '3px 10px', background: C.stone + '60',
              fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: '#7A857E',
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* Visit Website link */}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '10px 20px', border: `1.5px solid ${C.oceanTeal}`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: C.oceanTeal, textDecoration: 'none', transition: 'all 0.25s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = C.oceanTeal; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.oceanTeal; }}
        >Visit Website <span style={{ fontSize: 13 }}>↗</span></a>
      )}
    </div>
  );

  if (!isMobile) {
    return (
      <>
        <style>{`
          @keyframes guideSheetSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes guideSheetBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, zIndex: 249,
          background: 'rgba(0,0,0,0.3)',
          animation: 'guideSheetBackdropIn 0.25s ease',
        }} />
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 440, zIndex: 250,
          background: C.cream, overflowY: 'auto',
          animation: 'guideSheetSlideIn 0.3s ease',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            position: 'sticky', top: 0, zIndex: 10,
            display: 'flex', justifyContent: 'flex-end',
            padding: '12px 14px 0 0',
          }}>
            <button onClick={onClose} style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${C.warmWhite}e0`, border: `1px solid ${C.stone}15`,
              borderRadius: '50%', cursor: 'pointer',
              fontFamily: "'Quicksand', sans-serif", fontSize: 15, color: '#7A857E', lineHeight: 1,
              WebkitTapHighlightColor: 'transparent',
              boxShadow: `0 2px 8px ${C.darkInk}08`,
            }} aria-label="Close">✕</button>
          </div>
          {content}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes guideSheetSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes guideSheetBackdropIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 249,
        background: 'rgba(0,0,0,0.3)',
        animation: 'guideSheetBackdropIn 0.25s ease',
      }} />
      <div ref={sheetRef} style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '82vh', zIndex: 250,
        background: C.cream,
        borderRadius: '16px 16px 0 0',
        animation: 'guideSheetSlideUp 0.3s ease',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ padding: '10px 14px 6px', flexShrink: 0, position: 'relative', zIndex: 10 }}
        >
          <div style={{
            width: 36, height: 4, borderRadius: 2,
            background: `#7A857E30`, margin: '0 auto 8px',
          }} />
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
            position: 'absolute', top: 8, right: 14,
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${C.warmWhite}e0`, border: `1px solid #7A857E15`,
            borderRadius: '50%', cursor: 'pointer',
            fontFamily: "'Quicksand', sans-serif", fontSize: 15, color: '#7A857E', lineHeight: 1,
            WebkitTapHighlightColor: 'transparent',
            boxShadow: `0 2px 8px ${C.darkInk}08`,
          }} aria-label="Close">✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          {content}
        </div>
      </div>
    </>
  );
}



// ─── Guide Section Navigation (sticky anchor bar) ───────────────────────────

const GUIDE_SECTIONS = [
  { id: "sense-of-place", label: "Sense of Place" },
  { id: "when-to-go",     label: "When to Go" },
  { id: "where-to-stay",  label: "Stay" },
  { id: "trails",         label: "Trails" },
  { id: "wellness",       label: "Wellness" },
  { id: "light-sky",      label: "Light & Sky" },
  { id: "food-culture",   label: "Food & Culture" },
  { id: "group-trips",    label: "Group Trips" },
];

function GuideNav({ isMobile }) {
  const [activeId, setActiveId] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navRef = useRef(null);
  const sentinelRef = useRef(null);
  const activeItemRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Observe which section is in view
  useEffect(() => {
    const ids = GUIDE_SECTIONS.map(s => s.id);
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-130px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Sentinel observer for sticky state
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Auto-scroll the active nav item into view on mobile
  useEffect(() => {
    if (isMobile && activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = activeItemRef.current;
      const offset = item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [activeId, isMobile]);

  // Track whether the scroll container can scroll further right
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isMobile) { setCanScrollRight(false); return; }

    const check = () => {
      const gap = container.scrollWidth - container.scrollLeft - container.clientWidth;
      setCanScrollRight(gap > 4);
    };
    check();
    container.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      container.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [isMobile]);

  const handleClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const guideNavHeight = navRef.current?.offsetHeight || 52;
    const mainNavHeight = isMobile ? 58 : 64;
    const y = el.getBoundingClientRect().top + window.scrollY - guideNavHeight - mainNavHeight - 16;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [isMobile]);

  const MAIN_NAV_HEIGHT = isMobile ? 58 : 64;

  return (
    <>
      {/* Invisible sentinel — when it scrolls out of view, nav becomes sticky */}
      <div ref={sentinelRef} style={{ height: 1, width: "100%", pointerEvents: "none" }} />

      <nav
        ref={navRef}
        style={{
          position: (isSticky && !isMobile) ? "fixed" : "relative",
          top: (isSticky && !isMobile) ? MAIN_NAV_HEIGHT : "auto",
          left: 0,
          right: 0,
          zIndex: 90,
          background: (isSticky && !isMobile) ? "rgba(250, 247, 243, 0.97)" : C.cream,
          backdropFilter: (isSticky && !isMobile) ? "blur(12px)" : "none",
          WebkitBackdropFilter: (isSticky && !isMobile) ? "blur(12px)" : "none",
          borderBottom: `1px solid ${(isSticky && !isMobile) ? C.stone : "transparent"}`,
          transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
          boxShadow: (isSticky && !isMobile) ? "0 1px 8px rgba(0,0,0,0.04)" : "none",
        }}
      >
        <div style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 52px",
          display: "flex",
          alignItems: "center",
        }}>
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <div
              ref={scrollContainerRef}
              className="guide-nav-scroll"
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 4 : 0,
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
            {/* Hide scrollbar via style tag */}
            <style>{`
              .guide-nav-scroll::-webkit-scrollbar { display: none; }
            `}</style>

            {GUIDE_SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              return (
                <button
                  key={section.id}
                  ref={isActive ? activeItemRef : null}
                  onClick={() => handleClick(section.id)}
                  className="guide-nav-scroll"
                  style={{
                    padding: isMobile ? "16px 14px" : "20px 18px",
                    background: "none",
                    border: "none",
                    borderBottom: `2px solid ${isActive ? C.oceanTeal : "transparent"}`,
                    cursor: "pointer",
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: isActive ? C.oceanTeal : "#7A857E",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "color 0.25s ease, border-color 0.25s ease",
                    position: "relative",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = C.darkInk;
                      e.currentTarget.style.borderBottomColor = C.stone;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#7A857E";
                      e.currentTarget.style.borderBottomColor = "transparent";
                    }
                  }}
                >
                  {section.label}
                  <span style={{
                    display: "inline-block", marginLeft: 4,
                    fontSize: 9, opacity: isActive ? 1 : 0.5,
                    transition: "opacity 0.25s",
                  }}>{"↓"}</span>
                </button>
              );
            })}
            </div>

            {/* Mobile scroll indicator — gradient fade + chevron */}
            {isMobile && canScrollRight && (
              <div style={{
                position: "absolute", top: 0, right: 0, bottom: 0,
                width: 40,
                background: `linear-gradient(to right, transparent, ${isSticky ? "rgba(250,247,243,0.97)" : C.cream})`,
                display: "flex", alignItems: "center", justifyContent: "flex-end",
                paddingRight: 4,
                pointerEvents: "none",
                transition: "opacity 0.3s",
              }}>
                <span style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 14, fontWeight: 600,
                  color: "#7A857E",
                }}>{"›"}</span>
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* Spacer when sticky so content doesn't jump */}
      {isSticky && <div style={{ height: (navRef.current?.offsetHeight || 52) + 16 }} />}
    </>
  );
}


// ─── Celestial Drawer ────────────────────────────────────────────────────────

function CelestialDrawer({ isMobile }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    getCelestialSnapshot("vancouver")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Measure content for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [data, open, isMobile]);

  // Inject pulse animation
  useEffect(() => {
    if (document.getElementById("celestial-pulse-style")) return;
    const style = document.createElement("style");
    style.id = "celestial-pulse-style";
    style.textContent = `
      @keyframes celestialPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  const NAV_HEIGHT = isMobile ? 58 : 64;

  if (loading || !data) return (
    <div style={{ position: "relative", background: C.warmWhite, borderBottom: `1px solid ${C.stone}` }}>
      <div style={{ height: NAV_HEIGHT + 14 }} />
      <div style={{ height: 44 }} />
    </div>
  );

  const { weather, sun, moon, sky, nextEvent } = data;
  const LABEL_STYLE = {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 9, fontWeight: 700,
    letterSpacing: "0.2em", textTransform: "uppercase",
    color: "#b8b0a8", marginBottom: 6,
  };
  const VAL_STYLE = {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 14, fontWeight: 600,
    color: C.darkInk, lineHeight: 1.3,
  };
  const SUB_STYLE = {
    fontFamily: "'Quicksand', sans-serif",
    fontSize: 12, fontWeight: 400,
    color: "#8a9098", marginTop: 4,
  };

  // Build teaser chips for collapsed bar
  const teasers = [];
  if (weather) teasers.push(`${weather.temp}° ${weather.condition}`);
  if (moon) teasers.push(moon.name);
  if (sky) teasers.push(`Sky: ${sky.label}`);
  if (sun) teasers.push(`☀ ${sun.rise} – ${sun.set}`);

  return (
    <div style={{
      position: "relative",
      zIndex: open ? 95 : "auto",
      background: C.warmWhite,
      borderBottom: `1px solid ${C.stone}`,
    }}>
      {/* Spacer to clear fixed nav */}
      <div style={{ height: NAV_HEIGHT + 14 }} />
      {/* Trigger bar */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", border: "none", cursor: "pointer",
          background: "transparent",
          padding: isMobile ? "14px 20px" : "14px 52px",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8,
          transition: "background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${C.stone}40`}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <span style={{
          width: 5, height: 5, borderRadius: "50%",
          background: C.oceanTeal,
          animation: "celestialPulse 2s ease-in-out infinite",
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "#7A857E", flexShrink: 0,
        }}>
          Vancouver Island Right Now
        </span>
        {!isMobile && teasers.length > 0 && (
          <span style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 11, fontWeight: 500,
            color: "#b8b0a8", letterSpacing: "0.04em",
          }}>
            — {teasers.join("  ·  ")}
          </span>
        )}
        {isMobile && weather && (
          <span style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 11, fontWeight: 500,
            color: "#b8b0a8", letterSpacing: "0.04em",
          }}>
            · {weather.temp}° · {moon?.name}
          </span>
        )}
        <span style={{
          fontSize: 14,
          color: "#b8b0a8",
          transition: "color 0.3s ease, transform 0.35s ease",
          marginLeft: 6, flexShrink: 0,
          display: "inline-block",
          lineHeight: 1,
        }}>{open ? "✕" : "▾"}</span>
      </button>

      {/* Expandable content */}
      <div style={{
        position: "relative", zIndex: 95,
        maxHeight: open ? contentHeight : 0,
        overflow: "hidden",
        transition: "max-height 0.5s ease",
        background: C.warmWhite,
      }}>
        <div ref={contentRef} style={{
          padding: isMobile ? "16px 20px 24px" : "20px 52px 32px",
          maxWidth: 920, margin: "0 auto",
        }}>
          {/* Data grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: isMobile ? "20px 24px" : "24px 40px",
            paddingBottom: 0,
          }}>
            {weather && (
              <div>
                <div style={LABEL_STYLE}>Conditions</div>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28, fontWeight: 300,
                  color: C.darkInk, lineHeight: 1,
                }}>{weather.temp}°</span>
                <div style={SUB_STYLE}>H {weather.high}° / L {weather.low}° · {weather.condition}</div>
              </div>
            )}
            {sun && (
              <div>
                <div style={LABEL_STYLE}>Daylight</div>
                <div style={{ ...VAL_STYLE, color: C.oceanTeal }}>{sun.daylight}</div>
                <div style={SUB_STYLE}>{sun.rise} – {sun.set}</div>
              </div>
            )}
            {moon && (
              <div>
                <div style={LABEL_STYLE}>Moon</div>
                <div style={VAL_STYLE}>{moon.name}</div>
                <div style={SUB_STYLE}>{moon.phase}% illuminated</div>
              </div>
            )}
            {sky && (
              <div>
                <div style={LABEL_STYLE}>Tonight's Sky</div>
                <div style={{ ...VAL_STYLE, color: C.oceanTeal }}>{sky.label}</div>
                <div style={SUB_STYLE}>
                  Bortle {sky.bortle}
                  {sky.milkyWayVisible && sky.milkyWayWindow && <> · MW {sky.milkyWayWindow}</>}
                </div>
              </div>
            )}
            {nextEvent && (
              <div>
                <div style={LABEL_STYLE}>Next Celestial Event</div>
                <div style={VAL_STYLE}>{nextEvent.name}</div>
                <div style={SUB_STYLE}>{nextEvent.date} · {nextEvent.daysAway}d away</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Main Page ───────────────────────────────────────────────────────────────

export default function VancouverIslandGuide() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [activeSheet, setActiveSheet] = useState(null);
  useEffect(() => {
    if (activeSheet) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeSheet]);

  const openSheet = (section) => (item) => {
    setActiveSheet({ ...item, section });
  };

  return (
    <>
      <Nav />

      {/* ══ CELESTIAL DRAWER ═══════════════════════════════════════════════ */}
      <CelestialDrawer isMobile={isMobile} />

      {/* ══ TITLE MASTHEAD ═══════════════════════════════════════════════════ */}
      <section style={{ background: C.cream }}>
        <div style={{ padding: isMobile ? "28px 20px 24px" : "44px 52px 40px", maxWidth: 920, margin: "0 auto" }}>
          <FadeIn from="bottom" delay={0.1}>

            <Breadcrumb items={[
              { label: "Home", to: "/" },
              { label: "Destinations", to: "/destinations" },
              { label: "Vancouver Island" },
            ]} />

            {/* Two column layout */}
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 28 : 52, alignItems: "start",
              marginTop: 28,
            }}>

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow" style={{ color: C.oceanTeal, marginBottom: 14, display: "block" }}>Destination Guide</span>

                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 300,
                  color: C.darkInk, lineHeight: 1.0,
                  margin: "0 0 22px", letterSpacing: "-0.02em",
                }}>
                  Vancouver Island
                </h1>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: "0 0 14px",
                }}>
                  Tofino sits at the end of Highway 4, where the road runs out of places to go. What surrounds it is enormous: Clayoquot Sound, a UNESCO Biosphere Reserve; the old-growth forests of Meares Island; Pacific Rim National Park's Long Beach; and an open Pacific horizon with nothing between you and Japan.
                </p>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: 0,
                }}>
                  Where the forest meets the sea — we built this guide to help you find it.
                </p>
              </div>

              {/* ── Right: This Guide Covers ── */}
              <div style={isMobile ? {
                borderTop: `1px solid ${C.stone}`,
                paddingTop: 28,
              } : {
                borderLeft: `1px solid ${C.stone}`,
                paddingLeft: 28,
              }}>
                <div style={{
                  fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "#7A857E", marginBottom: 18,
                }}>This guide covers</div>

                {/* Parks & Reserves */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: C.seaGlass, marginBottom: 10,
                  }}>Parks & Reserves</div>
                  {[
                    { label: "Pacific Rim National Park Reserve", url: "https://parks.canada.ca/pn-np/bc/pacificrim" },
                    { label: "Strathcona Provincial Park", url: "https://bcparks.ca/strathcona-park/" },
                    { label: "Clayoquot Sound UNESCO Biosphere", url: "https://www.clayoquotbiosphere.org/" },
                  ].map((park, i) => (
                    <a key={i} href={park.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "center", gap: 10, marginBottom: 7,
                      textDecoration: "none",
                    }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: C.seaGlass, opacity: 0.5,
                      }} />
                      <span style={{
                        fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600,
                        letterSpacing: "0.02em", color: C.darkInk,
                      }}>{park.label}</span>
                    </a>
                  ))}
                </div>

                {/* Gateway Towns */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: C.oceanTeal, marginBottom: 10,
                  }}>Gateway Towns</div>
                  {["Tofino", "Ucluelet", "Victoria (corridor)"].map((town, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10, marginBottom: 7,
                    }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: C.oceanTeal, opacity: 0.5,
                      }} />
                      <span style={{
                        fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600,
                        letterSpacing: "0.02em", color: C.darkInk,
                      }}>{town}</span>
                    </div>
                  ))}
                </div>

                {/* Updated */}
                <div style={{
                  fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.06em", color: "#7A857E", marginTop: 14,
                  paddingTop: 12, borderTop: `1px solid ${C.stone}`,
                }}>
                  Updated 2026
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ GUIDE SECTION NAV ═══════════════════════════════════════════════ */}
      <GuideNav isMobile={isMobile} />

      {/* ══ IMAGE STRIP ════════════════════════════════════════════════════ */}
      <section style={{ position: "relative" }}>
        <div style={{
          display: "flex", gap: 2,
          overflowX: "auto", scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}>
          {[
            { src: P.vancouver,            alt: "Vancouver Island coastline",            caption: "Where the forest meets the sea",          width: 420 },
            { src: P.vancouverInlet,        alt: "Clayoquot Sound inlet",                caption: "Clayoquot Sound — island-studded waters",  width: 280 },
            { src: P.vancouverRainforest,   alt: "Old-growth rainforest boardwalk",       caption: "Ancient cedar — 1,000 years of standing", width: 420 },
            { src: P.vancouverBeach,        alt: "Pacific Rim beach at dusk",             caption: "Long Beach at low tide",                  width: 360 },
          ].map((img, i) => (
            <div key={i} style={{
              flex: "0 0 auto", width: isMobile ? "85vw" : img.width,
              scrollSnapAlign: "start", position: "relative", overflow: "hidden",
            }}>
              <img src={img.src} alt={img.alt} style={{
                width: "100%", height: 320, objectFit: "cover", display: "block",
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "32px 16px 14px",
                background: "linear-gradient(to top, rgba(10,18,26,0.7), transparent)",
              }}>
                <span style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.8)",
                }}>{img.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ GUIDE CONTENT ═══════════════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? "32px 20px 60px" : "48px 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SENSE OF PLACE                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="sense-of-place" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionLabel>Sense of Place</SectionLabel>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 16px",
              }}>
                {"The town is small — fewer than 2,000 residents — and for most of its history was accessible only by boat or float plane. The character here is shaped by weather. Tofino is a surf town that gets 3,000mm of rain a year. The storm season — November through March — draws a different kind of traveler than summer: people who want to watch the Pacific throw itself against the coast, who want to feel the wind on the beach at Chesterman, who want to sit in a cedar sauna while rain hammers the roof."}
              </p>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 16px",
              }}>
                {"The land around Tofino has been home to the Nuu-chah-nulth peoples for over 10,000 years. Five Nations hold traditional territories in the region: Ahousaht, Hesquiaht, Tla-o-qui-aht, Toquaht, and Ucluelet (Yuułuʔiłʔatḥ). The village of Opitsaht on Meares Island, directly across from Tofino, is estimated to be over 5,000 years old and continues as an active community. The forests, waters, and shorelines here are still in relationship with the people who have always called them home."}
              </p>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 28px",
              }}>
                {"Ucluelet sits 40 minutes south — quieter, more weathered, equally compelling. Victoria, at the island's southern tip, is a world apart: architectural, ceremonial, the counterpoint when you want stone buildings and afternoon tea after a week of surf and cedar. Together they make a complete journey."}
              </p>
            </FadeIn>

            {/* ── Quick Stats Bar ── */}
            <FadeIn delay={0.12}>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: isMobile ? 12 : 16, padding: isMobile ? 16 : 20,
                background: C.cream, border: `1px solid ${C.stone}`, marginTop: 24,
              }}>
                {[
                  { l: "Recommended", v: "5-7 days" },
                  { l: "Nearest Airport", v: "Victoria (YYJ) / Tofino (YAZ)" },
                  { l: "From Vancouver", v: "Ferry + 4.5hr drive" },
                  { l: "Best Times", v: "Jun-Sep, Nov-Feb" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 3 }}>{s.l}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* WHEN TO GO                                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="when-to-go" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="windows" />
              <SectionLabel>Magic Windows</SectionLabel>
              <SectionTitle>When to go</SectionTitle>
              <SectionSub isMobile={isMobile}>Both seasons are true. Both are worth knowing.</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Summer Season" featured
                  detail="Peak surf season, warmest temperatures (15-22°C). Long Beach busiest. Book accommodation 6+ months ahead. Best for kayaking, bear watching, and hiking without rain gear."
                  tags={["Jun-Sep", "Peak Season", "Book Early"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Fall Transition"
                  detail="Storm season begins, crowds thin, gray whales migrating south offshore, old-growth in its most atmospheric state. Excellent for photography."
                  tags={["Sep-Oct", "Migration", "Photography"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Winter Storm Watching" featured
                  detail="The Pacific storms that roll in from November onward generate swells that can top 10 meters. Many lodges host dedicated storm watching packages. Cold (5-10°C) and wet — but the experience is singular."
                  tags={["Nov-Feb", "Storm Season", "Lodge Packages"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Spring Whale Migration" featured
                  detail="Gray whale northward migration peaks in March-April. You can watch from shore. Rain eases toward May. Wildflowers in Strathcona. West Coast Trail opens in May."
                  tags={["Mar-May", "Gray Whales", "Wildflowers"]} />
              </div>
            </FadeIn>

            {/* ── Threshold Moments ── */}
            <FadeIn delay={0.12}>
              <div style={{ marginTop: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>Threshold Moments</div>
                {[
                  { event: "Gray whale northward migration", timing: "March-April", detail: "Offshore from Long Beach and the headlands" },
                  { event: "Peak surf season", timing: "September-November", detail: "Biggest consistent swells of the year" },
                  { event: "Winter storm watching", timing: "November-January", detail: "Peak dramatic Pacific storms" },
                  { event: "Tla-o-qui-aht Canoe Journey", timing: "Summer (varies)", detail: "Check tourismtofino.com for dates" },
                ].map((cal, i) => (
                  <div key={i} style={{ padding: "14px 0", borderBottom: `1px solid ${C.stone}` }}>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk, marginBottom: 3 }}>{cal.event}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 4 }}>{cal.timing}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: "#7A857E" }}>{cal.detail}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STAY                                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="where-to-stay" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="stay" />
              <SectionLabel>Unique Stays</SectionLabel>
              <SectionTitle>Where to sleep</SectionTitle>
              <SectionSub isMobile={isMobile}>From sleeping on First Nations territory to watching storms from your room at the edge of the Pacific.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div style={{
                padding: "14px 16px", background: C.cream,
                border: `1px solid ${C.stone}`, marginBottom: 20,
                display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 16, flexWrap: "wrap",
              }}>
                {[
                  { label: "Elemental", desc: "In the landscape", color: C.seaGlass },
                  { label: "Rooted", desc: "Boutique, local", color: C.oceanTeal },
                  { label: "Premium", desc: "Elevated experience", color: C.goldenAmber },
                ].map((t, i) => (
                  <div key={i} style={{ flex: isMobile ? "0 0 auto" : "1 1 140px" }}>
                    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: t.color }}>{t.label}</span>
                    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", marginLeft: 6 }}>{t.desc}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <div>
              <ExpandableList initialCount={5} label="places to stay">
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Pluvio Restaurant + Rooms" location="Ucluelet" featured
                  url="https://www.pluviorestaurant.com/"
                  detail="Six rooms above the best restaurant in Ucluelet. Small, thoughtfully furnished, quiet. Book room + dinner as a package."
                  tags={["6 Rooms", "Restaurant", "Intimate", "James Beard"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Green Point Campground" location="Pacific Rim National Park" featured
                  url="https://parks.canada.ca/pn-np/bc/pacificrim/activ/camping"
                  detail="The only campground inside the Long Beach unit — clifftop sites above the Pacific, ocean sound throughout the night. Reservation system opens in February; it fills in hours. Worth planning months ahead."
                  tags={["Camping", "Clifftop", "Pacific Views", "Reserve Early"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name="Wickaninnish Inn" location="Chesterman Beach, Tofino" featured
                  url="https://www.wickinn.com/"
                  detail="The defining luxury property on the outer coast of British Columbia. Every room faces the Pacific with floor-to-ceiling windows designed for storm watching. Ancient Cedars Spa. The Pointe Restaurant. Reserve 6-12 months ahead."
                  tags={["Storm Watching", "Spa", "Pointe Restaurant", "World-Class"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Wya Point Resort" location="Ucluelet — Tribal Land" featured
                  url="https://www.wyapoint.com/"
                  detail="Owned and operated by the Yuułuʔiłʔatḥ First Nation. Oceanfront yurts, tent camping, and rustic lodging on 600 acres of old-growth forest on an exclusive beach. Sleeping on land cared for by the Nation that has held it for 10,000 years."
                  tags={["First Nations", "Yurts", "Old-Growth", "Oceanfront"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Clayoquot Wilderness Resort" location="Bedwell River — Remote"
                  url="https://www.clayoquot.com/"
                  detail="Remote fly-in/boat-in safari tents on the shores of Bedwell River in Clayoquot Sound. Extreme privacy, extreme nature, guided programming with Tla-o-qui-aht guides. No road access."
                  tags={["Safari Tents", "Fly-In", "All-Inclusive", "Wilderness"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Pacific Sands Beach Resort" location="Cox Bay, Tofino"
                  url="https://www.pacificsands.com/"
                  detail="On Cox Bay, directly on a consistent surf break. Self-catering suites and cabins with fireplaces. Boards available, wetsuit rinse stations. The location is hard to beat."
                  tags={["Surf Access", "Cabins", "Fireplaces", "Cox Bay"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Long Beach Lodge Resort" location="Cox Bay, Tofino"
                  url="https://www.longbeachlodgeresort.com/"
                  detail="Dedicated surf camp operation and a well-regarded dining room (the Pointe Restaurant). The great room has a fireplace the size of a car and views of the Pacific that command attention."
                  tags={["Surf Camp", "Restaurant", "Great Room", "Beach"]} />
              </ExpandableList>
            </div>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TRAILS                                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="trails" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="move" />
              <SectionLabel>Sacred Terrain</SectionLabel>
              <SectionTitle>{"Trails, beaches & old-growth"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From boardwalks through ancient cedar to the defining coastal wilderness walk of North America."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="trails & adventures">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Long Beach" featured
                  url="https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ6"
                  detail="A 16-kilometer stretch of wild Pacific coastline — the longest beach in Canada accessible by road. Walk it at low tide for the widest expanse; walk it in a storm for the full experience."
                  tags={["Up to 16 km", "Easy", "Year-Round", "Storm Watching"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Rainforest Trail" featured
                  url="https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ6"
                  detail="Two short loop trails through western red cedar and Sitka spruce old-growth forest. Cedar root systems covering the boardwalk, nurse logs supporting entire ecosystems, filtered light through the canopy."
                  tags={["1 km loops", "Easy", "Old-Growth", "Boardwalk"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Wild Pacific Trail" featured
                  url="https://www.wildpacifictrail.com/"
                  detail="A 10-kilometer trail hugging the rocky headland of the Ucluth Peninsula — managed in part by the Yuułuʔiłʔatḥ First Nation. The Lighthouse Loop circles Amphitrite Point with open ocean views; the Ancient Cedars section moves into old-growth."
                  tags={["2.6-10 km", "Easy-Moderate", "Lighthouse", "Whale Watching"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Meares Island Big Tree Trail" featured
                  url="https://www.tourismtofino.com/activity/meares-island"
                  detail="Water-taxi crossing from Tofino to one of the largest remaining intact temperate rainforest stands in Canada. Ancient red cedar and Sitka spruce, some over 1,000 years old. The island is a Tla-o-qui-aht Tribal Park — entering active Indigenous stewardship territory."
                  note="Water taxi from Tofino's government dock"
                  tags={["4 km loop", "Easy-Moderate", "Tribal Park", "Ancient Trees"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Schooner Cove Trail"
                  url="https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ6"
                  detail="A 2-kilometer trail descending through old-growth spruce and cedar to a secluded cove on Long Beach's north end. Often empty even when Long Beach is busy. Tide pools at low tide."
                  tags={["2 km RT", "Easy-Moderate", "Secluded", "Tide Pools"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Paradise Meadows & Battleship Lake"
                  url="https://bcparks.ca/strathcona-park/"
                  detail="The most accessible introduction to Strathcona's alpine interior. Subalpine meadows, Battleship Lake, Lady Falls. Wildflowers from July through August are exceptional — a completely different landscape from the rainforest coast."
                  tags={["6 km loop", "Easy-Moderate", "Alpine", "Jul-Sep"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Elk River Trail"
                  url="https://bcparks.ca/strathcona-park/"
                  detail="A 10.6-kilometer round-trip hike along the Elk River through old-growth forest to a glacially-fed waterfall. The forest is dense and enormous, the river audible throughout. Turquoise pool at the end."
                  tags={["10.6 km RT", "Moderate-Strenuous", "Waterfall", "Jun-Oct"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="West Coast Trail" featured
                  url="https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ1"
                  detail="The most demanding and celebrated multi-day trail on Vancouver Island — 75 km through traditional territories of the Huu-ay-aht, Ditidaht, and Pacheedaht First Nations. Sea caves, suspension bridges, ladders, and the most remote coastline in Canada. The defining coastal wilderness walk in North America."
                  note="Permit required ($255 CAD) — open May-September"
                  tags={["75 km", "6-8 Days", "Strenuous", "Permit Required"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Juan de Fuca Marine Trail"
                  url="https://bcparks.ca/juan-de-fuca-park/"
                  detail="Day hike sections — particularly Mystic Beach (2.6 km from China Beach) and Botanical Beach near Port Renfrew — remain accessible as spectacular day hikes. Botanical Beach hosts some of the most dramatic tide pools on the island."
                  note="Check bcparks.ca for current trail conditions"
                  tags={["Day Hikes", "Tide Pools", "Coastal", "Year-Round"]} />
              </ExpandableList>
            </FadeIn>

            {/* ── Scenic Drives ── */}
            <FadeIn delay={0.12}>
              <div style={{ marginTop: 36 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>Scenic Drives</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Scenic Drives')} name="Highway 4 — The Mountain Crossing" featured
                  detail="Old-growth corridors, Cathedral Grove (a roadside stand of Douglas fir up to 800 years old), and Kennedy Lake before the coast opens below. Budget 2.5 hours without stops; plan 4 with Cathedral Grove and a lunch stop in Port Alberni."
                  tags={["Parksville to Tofino", "Old-Growth", "Cathedral Grove"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Scenic Drives')} name="Pacific Marine Circle Route"
                  detail="A 280-kilometer loop connecting Victoria, Sooke, Port Renfrew, Lake Cowichan, and back. Includes the Juan de Fuca Trail corridor and old-growth sections inland. A strong 2-day alternative to the more crowded Tofino route."
                  tags={["280 km Loop", "2 Days", "Victoria Start"]} />
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* WELLNESS                                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="wellness" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="breathe" />
              <SectionLabel>Living Practice</SectionLabel>
              <SectionTitle>{"Soaking, surf & forest bathing"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"The Pacific is cold. The rain is constant. The forest is ancient. The elemental encounter here is immersion — in water, in cedar, in weather."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="wellness experiences">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Hot Springs Cove — Maquinna Marine Provincial Park" featured
                  url="https://bcparks.ca/maquinna-park/"
                  detail="The most spectacular soaking experience on the BC coast. Only accessible by boat (1.5-2 hours through Clayoquot Sound) or seaplane. Natural geothermal pools cascade down basalt shelves into the Pacific. Temperature gradient from scalding to bracingly cold at the tidal fringe."
                  note="Book through Ahous Adventures (Ahousaht Nation-owned)"
                  tags={["Boat Access", "Geothermal", "Old-Growth Trail", "Day Trip"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Ancient Cedars Spa (Wickaninnish Inn)" featured
                  url="https://www.wickinn.com/ancient-cedars-spa/"
                  detail="One of the finest spa experiences on the island — designed entirely around the Pacific Rim environment. Cedar steam, seaweed body wraps, and therapies incorporating local botanicals. Set in old-growth forest with ocean views from treatment rooms."
                  tags={["Spa", "Cedar Steam", "Ocean Views", "Premium"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Surfing at Tofino"
                  url="https://www.pacificsurfschool.com/"
                  detail="Surfing at Tofino is one of the more accessible paths into elemental presence available in Canada. The water is cold, the waves are real. Multiple surf schools operate on Cox Bay and Chesterman Beach. Lessons are 2-3 hours."
                  tags={["Surf Lessons", "Cox Bay", "Chesterman", "Year-Round"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Kayaking Clayoquot Sound" featured
                  url="https://www.remotepassages.com/"
                  detail="Paddling the labyrinth of islands and inlets in Clayoquot Sound — 350,000 hectares. Routes past Nuu-chah-nulth village sites, through old-growth shorelines, and into complete wilderness within 20 minutes of Tofino."
                  tags={["Sea Kayak", "Guided", "Multi-Day Available", "Wilderness"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Cathedral Grove Forest Bathing"
                  url="https://bcparks.ca/macmillan-park/"
                  detail="A roadside old-growth forest on Highway 4. Douglas firs up to 800 years old and 9 meters in circumference. Free, accessible, and extraordinary. Arrive early morning before the tour buses."
                  tags={["Free", "Old-Growth", "Highway 4", "Morning"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Meares Island Cultural Walk"
                  url="https://www.tourismtofino.com/activity/meares-island"
                  detail="Guided walks with Tla-o-qui-aht guides — forest walks that incorporate traditional plant knowledge, cultural history, and the concept of the island as a living Tribal Park. One of the more genuinely immersive cultural-ecological experiences available."
                  tags={["Indigenous Guided", "Cultural", "Forest Walk", "Tribal Park"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Tofino Yoga Studio"
                  detail="The primary public yoga studio in Tofino. Drop-in classes, surf-adjacent scheduling. Community-oriented. Check tourismtofino.com for current listings."
                  tags={["Yoga", "Drop-In", "Community"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Cold Water Immersion"
                  detail="The Pacific at Chesterman Beach or Long Beach runs 10-14°C year-round. Any accessible beach works for a deliberate cold water entry as a practice rather than an accident."
                  tags={["Free", "Self-Guided", "Pacific Ocean", "10-14°C"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* LIGHT & SKY — DISCOVER                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="light-sky" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Discover</SectionLabel>
              <SectionTitle>{"Wildlife, storms & the living coast"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"Whales offshore. Bears on the shoreline. Storms that shake the windows. The coast at its most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="experiences">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Whale Watching with Ahous Adventures" featured
                  url="https://www.ahousadventures.com/"
                  detail="The Ahousaht Nation-owned tour operator. Gray whales (March-October), humpbacks (summer-fall), occasional orcas. Guides carry Ahousaht cultural knowledge — place names, ecological relationships, history. Visitors are guests in Ahousaht haḥuułii."
                  note="The recommended operator — every tour is an act of reciprocity"
                  tags={["Whale Watching", "Ahousaht Nation", "Mar-Oct", "Cultural"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Bear Watching" featured
                  url="https://www.ahousadventures.com/"
                  detail="Black bears foraging along the rocky intertidal shores of Clayoquot Sound. Best viewed by zodiac with an experienced guide. Spring through fall is the active season."
                  tags={["Bear Watching", "Zodiac", "Spring-Fall", "Ahousaht Guides"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Storm Watching" featured
                  detail="November through January for peak dramatic Pacific storms. The best vantage points are Chesterman Beach, the Wild Pacific Trail in Ucluelet, and from the windows of the Wickaninnish Inn. Many lodges host dedicated storm watching packages."
                  tags={["Nov-Jan", "Chesterman Beach", "Lodge Packages", "Dramatic"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Tofino Botanical Gardens"
                  url="https://www.tofinobotanicalgardens.com/"
                  detail="A 12-acre coastal garden at the edge of Tofino, adjacent to a working estuary. Native plant collections, Pacific Rim ecology exhibits, and seasonal events including the Tofino Food and Wine Festival in October."
                  tags={["Gardens", "Ecology", "12 Acres", "Year-Round"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Raincoast Education Society"
                  url="https://www.raincoast.org/"
                  detail="Tofino-based environmental education nonprofit running guided intertidal ecology walks, marine ecosystem programming, and naturalist-led experiences. One of the better ways to understand what you're looking at on the coast."
                  tags={["Ecology Walks", "Marine Programs", "Educational", "Seasonal"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Victoria: Butchart Gardens" featured
                  url="https://www.butchartgardens.com/"
                  detail="One of the most celebrated gardens in the world — 55 acres carved from a former limestone quarry starting in 1912. Five distinct gardens, over a million bedding plants in 900 varieties. The family still owns and operates it. National Historic Site of Canada."
                  note="Arrive at opening or late afternoon to avoid peak crowds"
                  tags={["Victoria Corridor", "National Historic Site", "Year-Round", "Photography"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Victoria: Inner Harbour & Beacon Hill Park"
                  url="https://www.tourismvictoria.com/"
                  detail="Parliament Buildings, float planes arriving from Vancouver, whale watching boats at dawn. Beacon Hill Park is 200 acres of old Garry oak meadow — one of the few places where the rare Garry oak ecosystem survives."
                  tags={["Victoria Corridor", "Free", "Historic", "Garry Oak"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* FOOD & CULTURE                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="food-culture" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Connect</SectionLabel>
              <SectionTitle>{"Food, culture & stewardship"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From Nuu-chah-nulth galleries to James Beard-nominated kitchens. The people and places that turn a visit into a relationship."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={6} label="places & experiences">
                {/* ── Indigenous Culture ── */}
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="House of Himwitsa" featured
                  url="https://www.houseofhimwitsa.com/"
                  detail="A Nuu-chah-nulth-owned gallery and cultural space specializing in West Coast Indigenous art. Wood carving, print, jewelry, and weaving. Open since 1991 — one of the most respected Indigenous art spaces on the island. A meaningful place to purchase art that directly supports artists and community."
                  tags={["Indigenous Art", "Gallery", "Since 1991", "Tofino"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Roy Henry Vickers Gallery" featured
                  url="https://www.royhenryvickers.com/"
                  detail="The gallery of celebrated Tsimshian-Stó:lō artist Roy Henry Vickers, one of the most recognized Indigenous artists in Canada. The building itself was designed by Vickers and is architecturally grounded in Northwest Coast tradition."
                  tags={["Indigenous Art", "Architecture", "Prints", "Tofino"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Tla-o-qui-aht Tribal Parks" featured
                  url="https://www.tourismtofino.com/activity/indigenous-experiences"
                  detail="Meares Island and surrounding territories were declared a Tribal Park in 1984 — one of the first acts of Indigenous land protection in Canada, in response to planned clear-cutting. An active, living declaration of stewardship. Support Indigenous-guided tours when possible."
                  tags={["Indigenous Stewardship", "Since 1984", "Tribal Park", "Living Practice"]} />

                {/* ── Dining: Tofino ── */}
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Wolf in the Fog" featured
                  url="https://www.wolfinthefog.com/"
                  detail="The anchor restaurant of Tofino's dining scene. Farm and ocean-driven menu focused on Vancouver Island producers and the Pacific immediately outside. The chowder is the standard. Reserve weeks ahead in summer."
                  tags={["Dinner", "Ocean-to-Table", "Reservations", "Tofino"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Shelter Restaurant"
                  url="https://www.shelterrestaurant.com/"
                  detail="Consistent, warm, locally sourced. Fresh Pacific halibut, Clayoquot Sound oysters, and regional wine. Slightly more relaxed than Wolf in the Fog — the right call after a long day on the water."
                  tags={["Dinner", "Seafood", "Relaxed", "Tofino"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="1909 Kitchen"
                  url="https://www.tofinoresortandmarina.com/dine/"
                  detail="Japanese-influenced local seafood at Tofino Resort + Marina. Crisp execution. Worth it for the dock views alone at sunset."
                  tags={["Dinner", "Japanese-Influenced", "Dock Views", "Tofino"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Common Loaf Bake Shop"
                  url="https://www.commonloaf.com/"
                  detail="Tofino's original bakery — sourdough, pastries, strong coffee. Community institution since the 1970s. Morning staple."
                  tags={["Breakfast", "Bakery", "Since 1970s", "$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="SoBo"
                  url="https://www.sobo.ca/"
                  detail="Originally a food truck, now a proper restaurant. Known for fish tacos, local shellfish, and whole-ingredient cooking. A Tofino original."
                  tags={["Fish Tacos", "Casual", "Tofino Original", "$$"]} />

                {/* ── Dining: Ucluelet ── */}
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Pluvio Restaurant + Rooms" featured
                  url="https://www.pluviorestaurant.com/"
                  detail="The best restaurant in Ucluelet, and one of the best on the island. An intimate 8-table dining room serving fixed-format Pacific Northwest cuisine: local seafood, foraged ingredients, housemade everything. James Beard-nominated. Reserve immediately."
                  tags={["Fixed Menu", "8 Tables", "James Beard", "Ucluelet"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Heartwood Kitchen"
                  url="https://www.heartwoodkitchen.ca/"
                  detail="The daily staple for Ucluelet visitors. Casual, locally sourced, full breakfast and lunch. Busy in summer — arrive early."
                  tags={["Breakfast", "Lunch", "Casual", "Ucluelet"]} />

                {/* ── Victoria Corridor Dining ── */}
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Fairmont Empress — Afternoon Tea" featured
                  url="https://www.fairmont.com/empress-victoria/"
                  detail="The Empress has been serving afternoon tea since 1908. Lobby Lounge overlooking the water, live piano, bone china. 21 loose-leaf teas, fresh scones with house-made jam, honey from the hotel's rooftop apiary. Genuinely well-executed and one of those experiences that earns its cliche."
                  note="~$109 CAD/person — reserve well in advance, midweek quieter"
                  tags={["Victoria Corridor", "Afternoon Tea", "Since 1908", "Premium"]} />

                {/* ── Stewardship ── */}
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Clayoquot Biosphere Trust"
                  url="https://www.clayoquotbiosphere.org/"
                  detail="The science and stewardship body for Clayoquot Sound's UNESCO Biosphere Reserve. Accepts donations supporting conservation research, Indigenous stewardship partnerships, and youth environmental education."
                  tags={["Conservation", "Donations", "UNESCO", "Stewardship"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Pacific Rim Volunteer Programs"
                  detail="Parks Canada runs seasonal volunteer programs in Pacific Rim including beach cleanups along Long Beach and Florencia Bay, invasive species removal, and trail maintenance. Contact the park at 250-726-3500."
                  tags={["Volunteer", "Beach Cleanup", "Seasonal", "Parks Canada"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Surfrider Foundation — Tofino Chapter"
                  detail="Ocean health advocacy and beach cleanup events. Long Beach accumulates significant debris from the open Pacific. Participation is open, informal, and genuinely impactful."
                  tags={["Volunteer", "Beach Cleanup", "Year-Round", "Open"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="U'mista Cultural Centre" featured
                  url="https://www.umista.ca/"
                  detail="The major institutional repository of Kwakwaka'wakw culture on Vancouver Island — located in Alert Bay. Home to the renowned potlatch collection: ceremonial objects returned after confiscation during Canada's decades-long ban on the potlatch (1885-1951). If you travel north, this is essential."
                  note="Alert Bay, North Island — accessible by ferry from Port McNeill"
                  tags={["Indigenous Heritage", "Museum", "North Island", "Essential"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* GROUP TRIPS                                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="group-trips" style={{ padding: "48px 0" }}>
            <FadeIn>
              <SectionIcon type="group" />
              <SectionLabel>Group Trips</SectionLabel>
              <SectionTitle>Tuned to Coastal Rhythms</SectionTitle>
              <SectionSub isMobile={isMobile}>Small group trips timed to natural crescendos. Expert guides, meaningful connection, transformative terrain. Eight travelers maximum.</SectionSub>
            </FadeIn>

            {(() => {
              const viTrips = getTripsByDestination("Vancouver Island");
              return viTrips.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : (viTrips.length > 1 ? "repeat(2, 1fr)" : "1fr"),
                  gap: 24,
                  maxWidth: viTrips.length === 1 ? 400 : "100%",
                }}>
                  {viTrips.map((trip, i) => (
                    <FadeIn key={trip.slug} delay={0.08 + i * 0.06}>
                      <TripCard trip={trip} />
                    </FadeIn>
                  ))}
                </div>
              ) : null;
            })()}

            <FadeIn delay={0.2}>
              <div style={{
                padding: "20px 24px",
                border: `1px solid ${C.stone}`,
                textAlign: "center",
                marginTop: 16,
              }}>
                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 14, fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.6, margin: "0 0 16px",
                }}>See all upcoming group trips across every destination.</p>
                <Link to="/group-trips" style={{
                  padding: "10px 24px",
                  background: "transparent",
                  border: `1.5px solid ${C.oceanTeal}`,
                  color: C.oceanTeal,
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "all 0.25s",
                  display: "inline-block",
                }}
                onClick={() => trackEvent('guide_cta_clicked', { action: 'view_group_trips', destination: 'vancouver-island' })}
                onMouseEnter={e => { e.currentTarget.style.background = C.oceanTeal; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.oceanTeal; }}
                >View All Group Trips</Link>
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CTA                                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="cta" style={{ padding: "56px 0 72px", textAlign: "center" }}>
            <FadeIn>
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: C.oceanTeal, display: "block", marginBottom: 16,
              }}>Begin</span>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300,
                color: C.darkInk, margin: "0 0 10px", lineHeight: 1.2,
              }}>Your island journey starts here</h3>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                color: "#4A5650", maxWidth: 460,
                margin: "0 auto 36px", lineHeight: 1.65,
              }}>
                Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you.
              </p>

              <Link to="/plan" style={{
                padding: "14px 36px", border: "none",
                background: C.darkInk, color: "#fff",
                textAlign: "center", display: "inline-block",
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                cursor: "pointer", transition: "opacity 0.2s",
                textDecoration: "none",
              }}
              onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'vancouver-island' })}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >{"Plan a Trip"}</Link>
            </FadeIn>
          </section>

          {/* ── Also Explore ────────────────────────────────────────────── */}
          <Divider />
          <FadeIn>
            <div style={{ padding: "44px 0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <span className="eyebrow" style={{ color: "#7A857E" }}>Also Explore</span>
                <span style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.1em", color: "#7A857E",
                }}>Guides available for each destination</span>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
                {[
                  { name: "Zion Canyon", slug: "zion-canyon", accent: C.sunSalmon },
                  { name: "Joshua Tree", slug: "joshua-tree", accent: C.goldenAmber },
                  { name: "Olympic Peninsula", slug: "olympic-peninsula", accent: C.skyBlue },
                  { name: "Big Sur", slug: "big-sur", accent: C.seaGlass },
                  { name: "Kauai", slug: "kauai", accent: C.oceanTeal },
                ].map(other => (
                  <Link key={other.slug} to={`/destinations/${other.slug}`} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 20px", border: `1px solid ${C.stone}`,
                    transition: "all 0.25s", background: C.warmWhite, textDecoration: "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = other.accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.stone; }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: other.accent, opacity: 0.6 }} />
                    <span style={{
                      fontFamily: "'Quicksand'", fontSize: 13, fontWeight: 600,
                      letterSpacing: "0.1em", textTransform: "uppercase", color: C.darkInk,
                    }}>{other.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
      <WhisperBar destination="vancouver" label="Vancouver Island" />
      <Footer />
    </>
  );
}
