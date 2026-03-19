// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: KAUAI GUIDE (dedicated)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Full editorial guide for Kauaʻi — The Garden Isle. Uses shared Nav/Footer/FadeIn
// from the Lila Trips component library, with guide-specific components
// defined locally (ListItem, StayItem, ExpandableList).
//
// Route: /destinations/kauai
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, Breadcrumb, WhisperBar } from '@components';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { getCelestialSnapshot } from '@services/celestialService';
import { Helmet } from 'react-helmet-async';


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
    move: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="14" y="2" width="15" height="15" rx="2" transform="rotate(45 14 2)"
          stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    breathe: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10"
          stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    awaken: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M14 3 L16 11 L24 14 L16 17 L14 25 L12 17 L4 14 L12 11 Z"
          stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    connect: (
      <svg width={size} height={size} viewBox="0 0 32 28" fill="none">
        <circle cx="12" cy="14" r="9" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="14" r="9" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    stay: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M4 14 L14 5 L24 14" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 13 L7 23 L21 23 L21 13" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    windows: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="2" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <line x1="14" y1="4" x2="14" y2="24" stroke={C.oceanTeal} strokeWidth="1.5" />
        <line x1="4" y1="14" x2="24" y2="14" stroke={C.oceanTeal} strokeWidth="1.5" />
      </svg>
    ),
    threshold: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
          stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    plan: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <path d="M11 17 L13 13 L17 11 L15 15 Z" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    group: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="10" cy="10" r="3.5" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="10" r="3.5" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <path d="M4 22 C4 17 7 15 10 15 C11.5 15 12.5 15.5 14 16.5 C15.5 15.5 16.5 15 18 15 C21 15 24 17 24 22" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    giveback: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M14 24 C14 24 4 17 4 11 C4 7.7 6.7 5 10 5 C11.8 5 13.3 5.9 14 7.2 C14.7 5.9 16.2 5 18 5 C21.3 5 24 7.7 24 11 C24 17 14 24 14 24 Z"
          stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    discover: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" />
        <path d="M10 14 L14 6 L18 14 L14 22 Z" stroke={C.oceanTeal} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
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
          fontSize: isMobile ? 14 : "clamp(14px, 1.5vw, 14px)", fontWeight: 400,
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
          fontSize: isMobile ? 14 : "clamp(14px, 1.5vw, 14px)", fontWeight: 400,
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

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 400,
        color: C.darkInk, margin: '0 0 10px', lineHeight: 1.2,
      }}>{item.name}</h3>

      {item.featured && (
        <span style={{
          display: 'inline-block', padding: '2px 10px', border: `1px solid ${C.oceanTeal}40`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.oceanTeal, marginBottom: 14,
        }}>Lila Pick</span>
      )}

      {item.detail && (
        <p style={{
          fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400,
          color: '#4A5650', lineHeight: 1.7, margin: '0 0 14px',
        }}>{item.detail}</p>
      )}

      {item.note && (
        <div style={{
          fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 600,
          color: C.oceanTeal, marginBottom: 14,
        }}>{item.note}</div>
      )}

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
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 249, background: 'rgba(0,0,0,0.3)', animation: 'guideSheetBackdropIn 0.25s ease' }} />
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 440, zIndex: 250, background: C.cream, overflowY: 'auto', animation: 'guideSheetSlideIn 0.3s ease', boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', justifyContent: 'flex-end', padding: '12px 14px 0 0' }}>
            <button onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${C.warmWhite}e0`, border: `1px solid ${C.stone}15`, borderRadius: '50%', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", fontSize: 15, color: '#7A857E', lineHeight: 1, WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 8px ${C.darkInk}08` }} aria-label="Close">✕</button>
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
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 249, background: 'rgba(0,0,0,0.3)', animation: 'guideSheetBackdropIn 0.25s ease' }} />
      <div ref={sheetRef} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '82vh', zIndex: 250, background: C.cream, borderRadius: '16px 16px 0 0', animation: 'guideSheetSlideUp 0.3s ease', boxShadow: '0 -4px 24px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ padding: '10px 14px 6px', flexShrink: 0, position: 'relative', zIndex: 10 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: `#7A857E30`, margin: '0 auto 8px' }} />
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ position: 'absolute', top: 8, right: 14, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${C.warmWhite}e0`, border: `1px solid #7A857E15`, borderRadius: '50%', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", fontSize: 15, color: '#7A857E', lineHeight: 1, WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 8px ${C.darkInk}08` }} aria-label="Close">✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          {content}
        </div>
      </div>
    </>
  );
}


// ─── Park Card Accordion ────────────────────────────────────────────────────

function DesignationIcon({ designation, size = 14, color = "#2D5F2B" }) {
  if (designation === "us-national-park") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 22h3l5-11 5 11h3L12 2z" fill={color} opacity="0.85" />
      <circle cx="12" cy="16" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
  if (designation === "canadian-national-park") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 8v8l9 6 9-6V8L12 2z" stroke={color} strokeWidth="1.5" fill={`${color}15`} />
      <path d="M9 11l3-3 3 3M12 8v8" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return null;
}

const PARKS = [
  {
    id: "napali", name: "Nā Pali Coast State Wilderness Park", designation: "state-wilderness", established: 1983,
    acreage: "6,175 ac", elevation: null, attribute: "Kalalau Trail",
    soul: "Eleven miles of fluted sea cliffs rising 4,000 feet from the Pacific — accessible only by trail, boat, or helicopter. The Kalalau Trail traverses all of it, ending at a beach that feels like the edge of the world.",
    facts: [
      "Kalalau Trail: 11 miles one-way, permit required for overnight",
      "Sea cliffs reach 4,000 ft — among the tallest in the world",
      "Accessible only by trail, boat, or helicopter — no road access",
    ],
    infoUrl: "https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/",
    driveFrom: null, accent: C.oceanTeal, isAnchor: false,
  },
  {
    id: "waimea", name: "Waimea Canyon State Park", designation: "state-park", established: 1952,
    acreage: "1,866 ac", elevation: null, attribute: "3,600 ft deep",
    soul: "The Grand Canyon of the Pacific — 14 miles long, a mile wide, and 3,600 feet deep. Red rock, green forest, silver river. Mark Twain's name for it understates nothing.",
    facts: [
      "14 miles long, 1 mile wide, 3,600 feet deep",
      "Formed by the collapse of the island's volcanic caldera and millions of years of erosion",
      "Waimea means 'reddish water' — the river runs red with iron-rich soil",
    ],
    infoUrl: "https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/",
    driveFrom: "~40 min from Poipū", accent: C.sunSalmon, isAnchor: false,
  },
  {
    id: "kokee", name: "Kōkeʻe State Park", designation: "state-park", established: 1952,
    acreage: "4,345 ac", elevation: null, attribute: "Kalalau Lookout access",
    soul: "The high-altitude counterpart to the coast — 4,000 feet above sea level, cool and forested, with the Kalalau Lookout offering the most accessible view of the Nā Pali Coast. Where the island reveals its interior.",
    facts: [
      "Kalalau Lookout: the most photographed view on Kauaʻi",
      "45 miles of hiking trails through native forest",
      "Home to rare native birds including the ʻapapane and ʻamakihi",
    ],
    infoUrl: "https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/",
    driveFrom: "~50 min from Poipū", accent: C.seaGlass, isAnchor: false,
  },
];

function ParkCard({ park, isExpanded, onToggle, isMobile }) {
  const DESIGNATION_LABELS = {
    "us-national-park": "National Park",
    "canadian-national-park": "National Park Reserve",
    "state-park": "State Park",
    "provincial-park": "Provincial Park",
    "national-forest": "National Forest",
    "state-wilderness": "State Wilderness Preserve",
  };
  const chips = [park.acreage, park.elevation, park.attribute].filter(Boolean);
  return (
    <div style={{
      borderLeft: `4px solid ${park.accent}`,
      border: `1px solid ${isExpanded ? park.accent + "40" : C.stone}`,
      borderLeftWidth: 4, borderLeftColor: park.accent,
      background: isExpanded ? `${park.accent}06` : C.cream,
      transition: "border-color 0.2s, background 0.2s",
      marginBottom: 6,
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", padding: isMobile ? "14px 14px" : "16px 20px",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 12,
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase", color: park.accent,
            }}>
              {DESIGNATION_LABELS[park.designation] || park.designation}{park.established ? ` · Est. ${park.established}` : ""}
            </div>
            {!park.isAnchor && park.driveFrom && (
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#7A857E" }}>
                {park.driveFrom}
              </div>
            )}
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400,
            color: C.darkInk, lineHeight: 1.15, marginBottom: chips.length ? 8 : 0,
          }}>{park.name}</div>
          {chips.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {chips.map((chip, i) => (
                <span key={i} style={{
                  padding: "2px 10px", background: `${park.accent}10`,
                  fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600,
                  color: "#4A5650", whiteSpace: "nowrap",
                }}>{chip}</span>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <DesignationIcon designation={park.designation} size={16} color={park.accent} />
          <span style={{
            display: "inline-block", fontSize: 14, color: "#7A857E", lineHeight: 1,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}>▾</span>
        </div>
      </button>
      <div style={{
        maxHeight: isExpanded ? 400 : 0, overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{ padding: isMobile ? "0 14px 16px" : "0 20px 18px" }}>
          <div style={{
            fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400,
            color: "#4A5650", lineHeight: 1.7, fontStyle: "italic",
            marginBottom: 12, paddingTop: 2,
          }}>
            {"◈ "}{park.soul}
          </div>
          {park.facts.map((fact, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "flex-start" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: park.accent, opacity: 0.6, marginTop: 7, flexShrink: 0 }} />
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: "#4A5650", lineHeight: 1.65 }}>{fact}</span>
            </div>
          ))}
          {park.infoUrl && (
            <a href={park.infoUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-block", marginTop: 10,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: park.accent, textDecoration: "none",
            }}>
              {park.designation === "canadian-national-park" ? "Parks Canada" : park.designation === "us-national-park" ? "NPS Page" : "Park Info"} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Guide Section Navigation (sticky anchor bar) ───────────────────────────

const GUIDE_SECTIONS = [
  { id: "sense-of-place", label: "Sense of Place" },
  { id: "when-to-go",     label: "Magic Windows" },
  { id: "tread-lightly",  label: "Tread Lightly" },
  { id: "where-to-stay",  label: "Sleep" },
  { id: "trails",         label: "Move" },
  { id: "wellness",       label: "Breathe" },
  { id: "light-sky",      label: "Night Sky" },
  { id: "food-culture",   label: "Food & Culture" },
  { id: "give-back",      label: "Give Back" },
];

function GuideNav({ isMobile }) {
  const [activeId, setActiveId] = useState(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isMobile) return;
    const ids = GUIDE_SECTIONS.map(s => s.id);
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-130px 0px -60% 0px", threshold: 0 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [isMobile]);

  const handleClick = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const mainNavHeight = isMobile ? 58 : 64;
    const guideNavHeight = isMobile ? 0 : 52;
    const y = el.getBoundingClientRect().top + window.scrollY - guideNavHeight - mainNavHeight - 32;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [isMobile]);

  if (isMobile) {
    return (
      <div style={{
        margin: "0 20px 24px",
        border: `1px solid ${C.stone}`,
        padding: "16px 18px",
        background: C.cream,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 14,
        }}>
          <span style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "#7A857E",
          }}>In this guide</span>
          <span style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 10, fontWeight: 500,
            color: "#b8b0a8", letterSpacing: "0.06em",
          }}>{GUIDE_SECTIONS.length} sections</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 16px" }}>
          {GUIDE_SECTIONS.map((section, i) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 0",
                background: "none", border: "none", cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 9, fontWeight: 700,
                letterSpacing: "0.1em", color: "#b8b0a8",
                minWidth: 16,
              }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 11, fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#4A5650",
              }}>{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav style={{
      position: "sticky", top: 72, zIndex: 90,
      background: "rgba(250, 247, 243, 0.97)",
      borderTop: `1px solid ${C.stone}`,
      borderBottom: `1px solid ${C.stone}`,
    }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "4px 40px 0", display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
          <div ref={scrollContainerRef} className="guide-nav-scroll" style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`.guide-nav-scroll::-webkit-scrollbar { display: none; }`}</style>
          {GUIDE_SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button key={section.id} onClick={() => handleClick(section.id)} className="guide-nav-scroll" style={{
                padding: "0 14px", height: 44, background: "none", border: "none",
                borderBottom: `2px solid ${isActive ? C.oceanTeal : "transparent"}`,
                cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: 11,
                fontWeight: isActive ? 700 : 600, letterSpacing: "0.14em", textTransform: "uppercase",
                color: isActive ? C.oceanTeal : "#7A857E", whiteSpace: "nowrap", flexShrink: 0,
                transition: "color 0.25s ease, border-color 0.25s ease", position: "relative",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = C.darkInk; e.currentTarget.style.borderBottomColor = C.stone; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#7A857E"; e.currentTarget.style.borderBottomColor = "transparent"; } }}
              >
                {section.label}
              </button>
            );
          })}
          </div>
        </div>
      </div>
    </nav>
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
    getCelestialSnapshot("kauai")
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.scrollHeight);
  }, [data, open, isMobile]);

  useEffect(() => {
    if (document.getElementById("celestial-pulse-style")) return;
    const style = document.createElement("style");
    style.id = "celestial-pulse-style";
    style.textContent = `@keyframes celestialPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`;
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
  const LABEL_STYLE = { fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b8b0a8", marginBottom: 6 };
  const VAL_STYLE = { fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk, lineHeight: 1.3 };
  const SUB_STYLE = { fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: "#8a9098", marginTop: 4 };

  const teasers = [];
  if (weather) teasers.push(`${weather.temp}° ${weather.condition}`);
  if (moon) teasers.push(moon.name);
  if (sky) teasers.push(`Sky: ${sky.label}`);
  if (sun) teasers.push(`☀ ${sun.rise} – ${sun.set}`);

  return (
    <div style={{ position: "relative", zIndex: open ? 95 : "auto", background: C.warmWhite, borderBottom: `1px solid ${C.stone}` }}>
      <div style={{ height: NAV_HEIGHT + 14 }} />
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", border: "none", cursor: "pointer", background: "transparent",
        padding: isMobile ? "14px 20px" : "14px 52px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = `${C.stone}40`}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.oceanTeal, animation: "celestialPulse 2s ease-in-out infinite", flexShrink: 0 }} />
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", flexShrink: 0 }}>
          {"Kauaʻi Right Now"}
        </span>
        {!isMobile && teasers.length > 0 && (
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 500, color: "#b8b0a8", letterSpacing: "0.04em" }}>
            — {teasers.join("  ·  ")}
          </span>
        )}
        {isMobile && weather && (
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 500, color: "#b8b0a8", letterSpacing: "0.04em" }}>
            · {weather.temp}° · {moon?.name}
          </span>
        )}
        <span style={{ fontSize: 14, color: "#b8b0a8", transition: "color 0.3s ease, transform 0.35s ease", marginLeft: 6, flexShrink: 0, display: "inline-block", lineHeight: 1 }}>{open ? "✕" : "▾"}</span>
      </button>

      <div style={{ position: "relative", zIndex: 95, maxHeight: open ? contentHeight : 0, overflow: "hidden", transition: "max-height 0.5s ease", background: C.warmWhite }}>
        <div ref={contentRef} style={{ padding: isMobile ? "16px 20px 24px" : "20px 52px 32px", maxWidth: 920, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? "20px 24px" : "24px 40px", paddingBottom: 0 }}>
            {weather && (
              <div>
                <div style={LABEL_STYLE}>Conditions</div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: C.darkInk, lineHeight: 1 }}>{weather.temp}°</span>
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

export default function KauaiGuide() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [expandedPark, setExpandedPark] = useState(null);
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
      <Helmet>
        <title>Kauaʻi Guide — Na Pali, Sacred Land & Intentional Travel in Hawaii | Lila Trips</title>
        <meta name="description" content="Kauaʻi is not just a destination — it's a responsibility. Curated trails, sacred valleys, and a guide built around reciprocity with Hawaiian land and culture." />
        <link rel="canonical" href="https://lilatrips.com/destinations/kauai" />
        <meta property="og:title" content="Kauaʻi Guide — Na Pali, Sacred Land & Intentional Travel in Hawaii | Lila Trips" />
        <meta property="og:description" content="Kauaʻi is not just a destination — it's a responsibility. Curated trails, sacred valleys, and a guide built around reciprocity with Hawaiian land and culture." />
        <meta property="og:url" content="https://lilatrips.com/destinations/kauai" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Kauaʻi — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kauaʻi Guide — Na Pali, Sacred Land & Intentional Travel in Hawaii | Lila Trips" />
        <meta name="twitter:description" content="Kauaʻi is not just a destination — it's a responsibility. Curated trails, sacred valleys, and a guide built around reciprocity with Hawaiian land and culture." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
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
              { label: "Kauaʻi" },
            ]} />

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
                  {"Kauaʻi — The Garden Isle"}
                </h1>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: "0 0 14px",
                }}>
                  {"Kauaʻi is the oldest of the main Hawaiian Islands — five million years old, worn into shapes the other islands haven't had time to become yet. The Nā Pali Coast is an argument for the word sublime. The Waimea Canyon earned the name \"Grand Canyon of the Pacific\" without apology."}
                </p>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: 0,
                }}>
                  {"The island is small enough that you can understand its geography from a single lookout but rich enough that a week barely touches the surface. We built this guide to help you find it."}
                </p>
              </div>

              {/* ── Right: This Guide Covers ── */}
              <div style={isMobile ? { borderTop: `1px solid ${C.stone}`, paddingTop: 28 } : { borderLeft: `1px solid ${C.stone}`, paddingLeft: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A857E", marginBottom: 18 }}>This guide covers</div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 10 }}>Island Areas</div>
                  {["North Shore (Hanalei)", "South Shore (Poipū)", "West Side (Waimea)", "East Side (Kapaʻa / Līhuʻe)"].map((area, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.oceanTeal, opacity: 0.5 }} />
                      <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", color: C.darkInk }}>{area}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: "#7A857E", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.stone}` }}>
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
            { src: P.kauaiNapaliCoast,   alt: "Nā Pali Coast trail",         caption: "Nā Pali Coast — the trail begins",     width: 420 },
            { src: P.kauaiGardens,        alt: "Kauaʻi gardens at golden hour", caption: "Garden light at golden hour",          width: 280 },
            { src: P.kauaiKalalauValley,  alt: "Kalalau Valley overlook",     caption: "Kalalau Valley — from the rim",         width: 420 },
            { src: P.kauaiWaimeaCanyon,   alt: "Waimea Canyon waterfall",     caption: "Waimea Canyon — the Pacific's Grand Canyon", width: 360 },
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
          <section id="sense-of-place" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionLabel>Sense of Place</SectionLabel>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 16px",
              }}>
                {"Kauaʻi is the oldest of the main Hawaiian Islands — five million years old, worn into shapes the other islands haven't had time to become yet. The Nā Pali Coast in the northwest is an argument for the word sublime: fluted sea cliffs rising 4,000 feet directly from the Pacific, draped in waterfalls, inaccessible by road. The Waimea Canyon cuts 14 miles through the island's interior — red rock, green forest, silver river."}
              </p>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 16px",
              }}>
                {"The island is wetter than the other islands — Mount Waiʻaleʻale, near the center, receives an average of 450 inches of rain a year, making it one of the wettest places on Earth. That rain feeds waterfalls visible from the road, keeps the vegetation impossibly green, and defines the character of the land."}
              </p>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 28px",
              }}>
                {"The Hawaiian people have called Kauaʻi home for over 1,500 years. Place names carry history: Hanalei means \"crescent bay\"; Waimea means \"reddish water\"; Poipū is a place of crashing waves. The island avoided many of the worst impacts of tourism development through a building-height ordinance — no structure taller than a palm tree — and through active Native Hawaiian advocacy. That restraint shapes what Kauaʻi still is."}
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: isMobile ? 12 : 16, padding: isMobile ? 16 : 20,
                background: C.cream, border: `1px solid ${C.stone}`, marginBottom: 20,
              }}>
                {[
                  { l: "Recommended", v: "5–7 days" },
                  { l: "Nearest Airport", v: "Lihue (LIH)" },
                  { l: "Direct Flights", v: "West Coast" },
                  { l: "Best Times", v: "Apr–Oct" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 3 }}>{s.l}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* ── Park Cards ── */}
            <FadeIn delay={0.08}>
              <div style={{ marginBottom: 4 }}>
                {PARKS.map(park => (
                  <ParkCard
                    key={park.id}
                    park={park}
                    isExpanded={expandedPark === park.id}
                    onToggle={() => setExpandedPark(expandedPark === park.id ? null : park.id)}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* WHEN TO GO                                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="when-to-go" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="windows" />
              <SectionLabel>Magic Windows</SectionLabel>
              <SectionTitle>When to go</SectionTitle>
              <SectionSub isMobile={isMobile}>{"Kauaʻi rewards every season differently. These are the moments when the island is most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Humpback Whale Season" featured
                  detail={"Humpbacks arrive in December and peak January through March. Best viewed from the cliffs above Poipū or Kīlauea Lighthouse headland. Whale spouts visible by moonlight from the south shore overlooks."}
                  tags={["Dec – Apr", "Wildlife", "Magic Window"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Kalalau Trail in Spring" featured
                  detail={"April through May: optimal conditions before summer crowds and heat. Nā Pali sea conditions improving for boat tours. Waimea Canyon wildflowers."}
                  tags={["Apr – May", "Hiking", "Fewer Crowds"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Summer — North Shore Calm"
                  detail={"Hanalei Bay calms down for swimming, kayaking, and SUP. The bay is one of the finest flat-water environments in the Pacific. Milky Way visible from dark beaches."}
                  tags={["Jun – Sep", "Swimming", "Stargazing"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Makahiki Season"
                  detail={"The traditional Hawaiian winter — November through January — a time of rest, ceremony, and renewal in the Hawaiian calendar. A meaningful cultural context for a visit."}
                  tags={["Nov – Jan", "Hawaiian Culture", "Ceremony"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Fall Shoulder Season"
                  detail={"October and November: least crowded season. Weather unpredictable but some of the best trade wind conditions. Prices lower."}
                  tags={["Oct – Nov", "Value", "Trade Winds"]} />
              </div>
            </FadeIn>

          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TREAD LIGHTLY                                                 */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="tread-lightly" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Tread Lightly</SectionLabel>
              <SectionTitle>Traveling responsibly.</SectionTitle>
              <SectionSub isMobile={isMobile}>Hawaiʻi receives more visitors per resident than almost anywhere on earth. Travel with that in mind.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 8 }}>
                <ListItem isMobile={isMobile} name="You are a guest on sacred land."
                  detail="Hawaiʻi receives more visitors per resident than almost anywhere on earth. Kauaʻi in particular holds heiau — ancient sacred sites — that are not on any tourist map and should not be. The Nā Pali Coast has trails that exceed the skill of most visitors; rescues are common and costly. We do not put certain places on our itineraries. The most powerful act of reverence is sometimes choosing not to go."
                  tags={["Indigenous sacred sites", "Visitor pressure", "Selective access"]} />
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* STAY                                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="where-to-stay" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="stay" />
              <SectionLabel>Sleep</SectionLabel>
              <SectionTitle>Where to sleep</SectionTitle>
              <SectionSub isMobile={isMobile}>{"How you inhabit a place matters. From beach camping under the Nā Pali cliffs to the island's grandest resort."}</SectionSub>
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
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Hanalei Colony Resort" location="North Shore" featured
                  url="https://www.hcr.com/"
                  detail={"The only true beachfront property in Hanalei. No TVs, no phones in rooms — simple condos facing the beach. The best base for Kalalau Trail day hikers."}
                  tags={["Beachfront", "No TVs", "Kalalau Base"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name={"Hāʻena Beach Park Camping"} location="North Shore" featured
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/"
                  detail={"The closest camping to the Kalalau trailhead — five campsites on the beach at Hāʻena, a short walk from Keʻe Beach and the Limahuli Garden. One of the most atmospheric camping locations in the state."}
                  tags={["Beach Camping", "Kalalau Access", "Reservations Required"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name={"Grand Hyatt Kauaʻi Resort & Spa"} location="Poipū" featured
                  url="https://www.hyatt.com/grand-hyatt/en-US/kauai"
                  detail={"The grandest property on the island — lagoon pools, full Anara Spa with Hawaiian healing traditions, beachfront access to Shipwreck Beach, lush grounds. The south shore's most complete luxury experience."}
                  tags={["Lagoon Pools", "Anara Spa", "Beachfront", "Luxury"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name={"Kōkeʻe State Park Cabins"} location="West Side"
                  url="https://www.kokee.net/"
                  detail={"Rustic cabins in the highlands above Waimea Canyon at 3,600 feet. Cool temperatures, canyon and swamp trail access, birdsong from species found nowhere else on Earth. Extremely affordable."}
                  tags={["Highland Cabins", "Canyon Access", "Affordable"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Polihale State Park Camping" location="West Side"
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/polihale-state-park/"
                  detail={"Remote camping on the westernmost beach on Kauaʻi — 17 miles of empty beach backed by the Nā Pali cliffs. Rough dirt road access. The darkness is exceptional. The sunsets are the best on the island."}
                  tags={["Remote", "Dark Sky", "Sunsets", "4WD"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name={"Kauaʻi Inn"} location={"Līhuʻe"}
                  url="https://www.kauai-inn.com/"
                  detail={"The most practical affordable hotel on the island — well-located near the airport, clean and simple, operated with care. A good first and last night option."}
                  tags={["Airport Proximity", "Affordable", "Practical"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name={"Nā Pali Coast Cottages"} location="North Shore"
                  detail={"Small independent cottage rentals on the north shore. Look for locally owned, long-established properties. The north shore cottage experience is a Kauaʻi original."}
                  tags={["Cottage", "Local", "North Shore"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name={"Timbers Kauaʻi"} location={"Hōkūala, Līhuʻe"}
                  url="https://www.timberskauai.com/"
                  detail={"A newer luxury property on the eastern coast, set on a former plantation estate. Organic farm on-site, direct ocean access, considered design. Less crowded than Poipū; a quieter base."}
                  tags={["Plantation Estate", "Farm-to-Table", "Ocean Access"]} />
              </ExpandableList>
            </div>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TRAILS                                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="trails" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="move" />
              <SectionLabel>Move</SectionLabel>
              <SectionTitle>{"Trails, coast & canyon"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From the Nā Pali Coast's fluted sea cliffs to the red rock of Waimea Canyon. Every trail here earns its reputation."}</SectionSub>
            </FadeIn>

            {/* ── Nā Pali Coast ── */}
            <FadeIn delay={0.06}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>{"Nā Pali Coast"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name={"Kalalau Trail to Hanakāpīʻai Beach"} featured
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/"
                  detail={"The most iconic trail in Hawaiʻi. First two miles — to Hanakāpīʻai Beach — open to day hikers without camping permit. Cliffs, jungle, switchbacks above the Pacific. The beach is dangerous for swimming — come to see it, not to enter it. Advance reservation required through gohaena.com."}
                  note="4 mi RT · 800 ft gain · Moderate · 2.5–3 hrs"
                  tags={["Coastal Cliffs", "Jungle", "Photography", "Reservation Required"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name={"Kalalau Trail — Full (Permitted Overnight)"}
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/napali-coast-state-wilderness-park/"
                  detail={"The complete 11-mile route traverses five valleys and ends at Kalalau Beach, one of the most remote beaches accessible on foot in the United States. Camping permits required, available 90 days in advance — they sell out in minutes for peak dates."}
                  note="22 mi RT · Strenuous · 2–4 days"
                  tags={["Backpacking", "Wilderness", "Permit Required", "Apr–Sep"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name={"Awaʻawapuhi Trail"} featured
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/"
                  detail={"The finest ridge trail on the island — through native forest to a knife-edge viewpoint 2,500 feet above the ocean on the Nā Pali Coast. The final viewpoint looks directly down into the fluted valleys. Exceptional."}
                  note="6.4 mi RT · 1,500 ft gain · Strenuous · 3–4 hrs"
                  tags={["Ridge Walk", "Nā Pali Views", "Native Forest"]} />
              </div>
            </FadeIn>

            {/* ── Waimea Canyon & Kōkeʻe ── */}
            <FadeIn delay={0.1}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>{"Waimea Canyon & Kōkeʻe"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Waimea Canyon Trail"
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/"
                  detail={"The primary canyon trail runs along the rim with a detour to the top of Waipoʻo Falls — an 800-foot cascade. The views of the red-rock canyon layers are remarkable from close range."}
                  note="3.6 mi RT · Moderate · 2–3 hrs"
                  tags={["Canyon", "Waterfall", "Geology", "Photography"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name={"Pihea Trail (Kōkeʻe to Alakaʻi Swamp)"} featured
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/"
                  detail={"From Puʻu o Kila Lookout into the Alakaʻi Swamp — the world's highest tropical swamp (4,000 feet), home to rare native birds found nowhere else on Earth (ʻapapane, ʻiʻiwi, pueo). The trailhead overlooks the Kalalau Valley."}
                  note="7.6 mi RT · Moderate · 3–4 hrs · Often muddy"
                  tags={["Native Birds", "Swamp Ecology", "Endemic Species", "Solitude"]} />
              </div>
            </FadeIn>

            {/* ── North Shore ── */}
            <FadeIn delay={0.14}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>North Shore</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name={"Hāʻena State Park — Keʻe Beach & Reef Walk"}
                  url="https://www.gohaena.com/"
                  detail={"The beach at the end of the highway — where the road literally stops. A calm reef lagoon in summer creates protected snorkeling with excellent visibility. In winter, the water is rough. Reservations required through gohaena.com. Arrive early."}
                  tags={["Snorkeling", "Beach", "Reef", "Reservation Required"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Sleeping Giant (Nounou Mountain)"
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/nounou-mountain-east-side/"
                  detail={"A local's hike above Kapaʻa. Panoramic views of the East Shore, Mount Waiʻaleʻale, and the Pacific. Less crowded than north shore trails, more revealing as a view of the island's interior."}
                  note="3.4 mi RT · 1,000 ft gain · Moderate · 2–2.5 hrs"
                  tags={["Panoramic Views", "Local Favorite", "Interior Landscape"]} />
              </div>
            </FadeIn>

            {/* ── Scenic Drives ── */}
            <FadeIn delay={0.18}>
              <div style={{ marginTop: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>Scenic Drives</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Waimea Canyon Drive (Highway 550)"
                  url="https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/"
                  detail={"20-mile scenic road from Waimea town to the end of Kōkeʻe State Park. Five overlooks with increasingly dramatic canyon and coast views. The final two — Kalalau Lookout and Puʻu o Kila — look directly into the Kalalau Valley. Drive it top to bottom, stopping at every lookout."}
                  tags={["20 Miles", "5 Overlooks", "Canyon + Coast"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="North Shore Road (Highway 56 / 560)"
                  detail={"From Līhuʻe to Hāʻena: 40 miles of the island's most dramatic coastal beauty. The road narrows past Hanalei, crosses one-lane bridges over rivers and taro fields, passes ancient ahupuaʻa boundaries, and ends at Keʻe Beach. The taro fields of the Hanalei National Wildlife Refuge are extraordinary."}
                  tags={["40 Miles", "One-Lane Bridges", "Taro Fields"]} />
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* WELLNESS                                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="wellness" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="breathe" />
              <SectionLabel>Breathe</SectionLabel>
              <SectionTitle>{"Yoga, water & contemplation"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"The island's pace makes practice feel less like effort and more like returning to something you already knew."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="wellness experiences">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Black Coral Yoga" featured
                  url="https://www.blackcoralyoga.com/"
                  detail={"The anchor yoga studio on Kauaʻi's North Shore — on the second floor of the historic Hanalei Center with a wraparound lānai facing mountain and waterfall views. Lineage rooted in Patanjali's Yoga Sūtras and Ashtanga Vinyāsa. Classes range from infrared-heated Vinyāsa and Hot 90 to Hatha, Yin, Restorative, breathwork, and sound. Pre-registration required; early morning classes fill fast."}
                  note="Hanalei — reserve early"
                  tags={["Yoga", "Sound", "Infrared", "Lineage-Based"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name={"Anara Spa at Grand Hyatt Kauaʻi"} featured
                  url="https://www.hyatt.com/grand-hyatt/en-US/kauai"
                  detail={"The island's most developed spa facility. Traditional Hawaiian healing practices — lomilomi massage, pōhaku hot stone treatment — alongside standard spa programming. Day access to outdoor facilities available for non-guests. Grand in scale; grounded in Hawaiian tradition."}
                  note="Poipū — day access available"
                  tags={["Lomilomi", "Hot Stone", "Pools", "Garden"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name={"Kauaʻi Yoga"}
                  url="https://www.kauaiyoga.com/"
                  detail={"A long-running island-wide yoga community. Drop-in classes offered across Poipū, Kapaʻa, and Princeville."}
                  tags={["Drop-In", "Multiple Locations", "Community"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name={"Stand-Up Paddleboarding — Hanalei Bay"}
                  detail={"Hanalei Bay in summer is one of the finest flat-water SUP environments in the Pacific: a protected crescent bay with mountain backdrop, calm water, and turtles visible below the board on clear days. Multiple rental and lesson operators on the beach. An elemental morning."}
                  tags={["Summer", "Flat Water", "Turtles", "Rentals"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Kayaking the Wailua River" featured
                  detail={"The only navigable river in Hawaiʻi. A guided kayak tour up the river through thick jungle to Uluwehi (Secret) Falls — a 100-foot waterfall into a plunge pool. One of the most consistently rewarding half-days on the island."}
                  note="Operators: Kayak Kauai, Wailua Kayak Adventures"
                  tags={["River Kayak", "Waterfall", "Half Day", "Guided"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name={"Limahuli Garden & Preserve"} featured
                  url="https://ntbg.org/gardens/limahuli/"
                  detail={"A National Tropical Botanical Garden property tucked into a valley on the north shore, built on the footprint of ancient Hawaiian agricultural terraces. Ancient loʻi (taro paddies), native plant collections, and one of the most biodiverse valleys in Hawaiʻi. Self-guided tours available; guided tours recommended for cultural depth."}
                  tags={["Botanical Garden", "Hawaiian Terraces", "Contemplative"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* LIGHT & SKY                                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
        </div>
      </section>

      {/* Night Sky section with full-width dark background */}
      <section id="light-sky" style={{ scrollMarginTop: 126, padding: isMobile ? "52px 20px" : "64px 52px", background: C.darkInk }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeIn>
            <SectionIcon type="awaken" />
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 12, textAlign: "center" }}>Night Sky</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 400, color: "#fff", margin: "0 0 6px", lineHeight: 1.2, textAlign: "center" }}>{"Light & sky"}</h2>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: isMobile ? 15 : "clamp(14px, 1.8vw, 15px)", fontWeight: 400, color: "rgba(255,255,255,0.7)", margin: "0 auto 28px", lineHeight: 1.7, textAlign: isMobile ? "left" : "center", maxWidth: isMobile ? "100%" : 520 }}>
              {"No IDA designation, but the island's building-height law and low development density create genuinely dark conditions on the south and west shores. The Milky Way core is visible from the coast on moonless nights between April and October."}
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>Best Viewing Locations</div>
              {[
                { name: "Poipū Beach / Shipwreck Beach (South Shore)", note: "Open horizon to the south and west, minimal coastal light. Best for Milky Way core viewing." },
                { name: "Polihale State Park (West Shore)", note: "The most remote and darkest beach accessible by road on Kauaʻi. Open horizon, no development for miles. Bortle 3." },
                { name: "Kīlauea Lighthouse headland (North Shore)", note: "Faces open ocean north; best for star trails and Milky Way arcing overhead." },
              ].map((area, i) => (
                <div key={i} style={{ padding: "14px 0", borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{area.name}</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{area.note}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>Calendar Anchors</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                {[
                  { event: "Milky Way Core", timing: "Apr – Oct", detail: "Best from June–August when the core is highest" },
                  { event: "Perseid Meteor Shower", timing: "Mid-August", detail: "Peak around the 12th — best from dark beaches" },
                  { event: "Whale Spouts by Moonlight", timing: "Dec – Apr", detail: "Rare pairing: whale spouts visible from south shore overlooks" },
                  { event: "Humpback Peak", timing: "Jan – Mar", detail: "Best from Kīlauea Lighthouse or Poipū clifftops" },
                ].map((cal, i) => (
                  <div key={i} style={{ padding: "14px 16px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{cal.event}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 4 }}>{cal.timing}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>{cal.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div style={{ padding: "16px 18px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 10 }}>Marine Layer Note</div>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                {"Cloud cover can roll in quickly at night from the north and east. South and west shore locations (Poipū, Polihale) tend to be clearest. Check Clear Outside before committing to a late drive to Polihale."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Continue guide content */}
      <section style={{ padding: isMobile ? "0 20px 60px" : "0 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* FOOD & CULTURE                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="food-culture" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Food & Culture</SectionLabel>
              <SectionTitle>{"Food, culture & stewardship"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From sacred practice to farm culture to the island's best kitchens. The connections here go deeper than a meal."}</SectionSub>
            </FadeIn>

            {/* ── Sacred Practice & Farm Culture ── */}
            <FadeIn delay={0.06}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>{"Sacred Practice & Farm Culture"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name={"Kauaʻi's Hindu Monastery — Kauai Aadheenam"} featured
                  url="https://www.himalayanacademy.com/"
                  detail={"A 382-acre monastery and temple complex on the Wailua River — one of the most unexpected and quietly profound places in all of Hawaiʻi. The Kadavul Temple houses 108 golden statues of Nataraja and a 700-pound naturally formed crystal Śivaliṅgam. The under-construction Iraivan Temple is the first all-stone Hindu temple in the Western Hemisphere. Visitors welcome daily 9 AM–noon; 9 AM puja open to all. Dress modestly."}
                  note="Kapaʻa — reservation required for temple"
                  tags={["Sacred Practice", "Meditation", "Pilgrimage", "Free"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Lydgate Farms — Chocolate Farm Tour" featured
                  url="https://www.lydgatefarms.com/"
                  detail={"A fifth-generation Kauaʻi family farming since 1865. Three-hour guided tour through botanical gardens and award-winning cacao fields — recognized three times by Cocoa of Excellence in Paris. The full arc from tree to bar: tropical fruit tasting, vanilla, honey, and craft chocolate. The concept of mālama ʻāina — caring for the land — is embedded in how they operate."}
                  note="Kapaʻa East Side — 3 hrs, reservation required"
                  tags={["Farm Tour", "Chocolate", "Mālama ʻĀina", "Kids 7+"]} />
              </div>
            </FadeIn>

            {/* ── Where to Eat ── */}
            <FadeIn delay={0.1}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>{"North Shore (Hanalei)"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Bar Acuda" featured
                  url="https://www.baracuda.com/"
                  detail={"The North Shore's finest dinner — tapas format built on local fish, charcuterie, and island produce with a European sensibility. Small room, focused menu, excellent wine list. Reserve ahead."}
                  tags={["Tapas", "Local Fish", "Wine", "Reserve"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Dolphin Restaurant"
                  url="https://www.hanaleidolphin.com/"
                  detail={"Hanalei's anchor fish restaurant. Fresh off the boat. Simple, honest, good. The setting on the Hanalei River is part of the experience."}
                  tags={["Seafood", "River Setting", "Institution"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name={"Hanalei Taro & Juice Co."}
                  url="https://www.hanaleitaroandjuice.com/"
                  detail={"A north shore institution — taro smoothies, local plate lunch, shave ice done properly. Order the taro hummus. A meal for under $20 that connects you to the land immediately."}
                  tags={["Taro", "Plate Lunch", "Under $20"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Wishing Well Shave Ice"
                  url="https://www.wishingwellshaveice.com/"
                  detail={"The best shave ice on the island. Organic, local fruit flavors, natural syrups."}
                  tags={["Shave Ice", "Organic", "Local Fruit"]} />
              </div>
            </FadeIn>

            <FadeIn delay={0.14}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>{"South Shore (Poipū / Koloa)"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="The Beach House Restaurant" featured
                  url="https://www.the-beach-house.com/"
                  detail={"Oceanfront dining above Lāwaʻi Beach — local seafood, sunset views. Arrive for the sunset."}
                  tags={["Oceanfront", "Sunset", "Seafood", "Upscale"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name={"Kukuiʻula Village Farmers Market"}
                  detail={"Every Wednesday afternoon. The best local produce, prepared food, and artisan goods on the south shore. Buy fruit, try the poke, talk to the farmers."}
                  tags={["Wednesdays", "Farmers Market", "Poke"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name={"Merriman's Fish House"}
                  url="https://www.merrimanshawaii.com/poipu/"
                  detail={"Farm-to-table Hawaiian regional cuisine from one of the state's most respected restaurant groups. Local fish, Kauaʻi-grown vegetables, excellent execution."}
                  tags={["Farm-to-Table", "Hawaiian Regional", "$$"]} />
              </div>
            </FadeIn>

            <FadeIn delay={0.18}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>{"West Side (Waimea / Hanapepe)"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Waimea Brewing Company"
                  url="https://www.waimea-plantation.com/dining/"
                  detail={"The only brewpub in the Waimea area — useful stop after a canyon day. Local craft beer, solid food, casual atmosphere."}
                  tags={["Brewpub", "Post-Canyon", "Casual"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name={"Hanappe'e Café"}
                  url="https://www.hanapepe.org/"
                  detail={"In the small art town of Hanapepe. Creative farm-to-table menu in a space that feels genuinely local. BYOB, cash only. Worth planning around."}
                  tags={["Farm-to-Table", "Art Town", "BYOB", "Cash Only"]} />
              </div>
            </FadeIn>

            <FadeIn delay={0.22}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>Provisions</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Healthy Hut"
                  url="https://www.healthyhutkauai.com/"
                  detail={"The north shore's best grocery stop for quality local and organic food, smoothies, and deli items. Stock up here before heading to Keʻe Beach."}
                  tags={["Hanalei", "Organic", "Smoothies", "Pre-Hike"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Koloa Rum Company"
                  url="https://www.koloarum.com/"
                  detail={"Distillery and tasting room in Koloa. Rum made from Kauaʻi-grown sugarcane. Tours and tastings available."}
                  tags={["Distillery", "Rum", "Tastings", "South Shore"]} />
              </div>
            </FadeIn>

            {/* ── Discover ── */}
            <FadeIn delay={0.26}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>{"Land, Water & Discovery"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name={"Nā Pali Coast — Boat Tour"} featured
                  detail={"The coast is only accessible by land for the first two miles of the Kalalau Trail; everything beyond is best seen from the water. Rigid-inflatable raft tours navigate into sea caves, under waterfalls, and along the base of the pali. Captain Andy's and Blue Dolphin Charters have the longest track records."}
                  note="May–September · Book weeks ahead for summer"
                  tags={["Sea Caves", "Waterfalls", "6 Hours", "May–Sep"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name={"Helicopter Flight — Waimea Canyon & Interior"}
                  detail={"Kauaʻi's interior — the Mt. Waiʻaleʻale crater and the rivers that flow from it — is almost completely inaccessible on foot. A helicopter flight is the only way to see the inner waterfalls. Blue Hawaiian and Jack Harter fly doors-off tours. Expensive and genuinely unlike anything else."}
                  tags={["Helicopter", "Doors-Off", "Inner Waterfalls"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name={"Snorkeling — Tunnels Reef (Hāʻena)"}
                  url="https://www.gohaena.com/"
                  detail={"One of the finest snorkel sites in Hawaiʻi — a large lava reef system with Hawaiian green sea turtles (honu), reef fish, and in summer, manta rays at dusk. Best in summer when the north shore is calm."}
                  tags={["Snorkeling", "Sea Turtles", "Summer", "Reservation Required"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name={"Kīlauea Lighthouse & Wildlife Refuge"}
                  url="https://www.fws.gov/refuge/kilauea-point/"
                  detail={"A century-old lighthouse on a headland above the Pacific. The refuge supports nesting colonies of red-footed boobies, frigatebirds, Laysan albatross, and wedge-tailed shearwaters. Humpbacks visible offshore in winter."}
                  tags={["Lighthouse", "Seabirds", "Whale Watching", "North Shore"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name={"Hanapepe — Art Town"}
                  url="https://www.hanapepe.org/"
                  detail={"A small former plantation town that has become a genuine artist community. Friday Art Night opens galleries along the main street. The Hanapepe Swinging Bridge spans the river behind town."}
                  tags={["Art Galleries", "Friday Night", "Swinging Bridge"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="McBryde Garden (NTBG)"
                  url="https://ntbg.org/gardens/mcbryde/"
                  detail={"The south shore companion to Limahuli — a major botanical collection with the largest assembly of native Hawaiian plants in the world, plus tropical collections from across the Pacific. Guided tours strongly recommended."}
                  tags={["Botanical Garden", "Native Plants", "Guided Tours"]} />
              </div>
            </FadeIn>

            {/* ── Give Back & Cultural Stewardship ── */}
            <FadeIn delay={0.3}>
              <div style={{ marginTop: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.oceanTeal, marginBottom: 16 }}>{"Hawaiian Cultural Stewardship"}</div>
                <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.5vw, 14px)", fontWeight: 400, color: "#4A5650", lineHeight: 1.7, margin: "0 0 16px" }}>
                  {"Kauaʻi's culture and landscape are sustained by the work of organizations rooted in the concept of mālama — to care for. The most meaningful travel here engages with that care directly."}
                </p>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Stewardship')} name="Waipa Foundation" featured
                  url="https://www.waipafoundation.org/"
                  detail={"A Native Hawaiian community center on the north shore, working to restore the cultural and ecological relationship between people and ʻāina (land). Thursday morning Poi Day: community workday in the loʻi followed by traditional food preparation. One of the most authentic cultural engagement opportunities in Hawaiʻi."}
                  tags={["Loʻi Kalo", "Poi Day", "Community", "Hanalei"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Stewardship')} name={"Surfrider Foundation Kauaʻi"}
                  url="https://www.surfrider.org/chapters/kauai"
                  detail={"Weekly beach cleanups and net patrols across the island. Wednesday cleanups at 3:30 PM (rotating locations). Saturday cleanups at Lydgate Beach Park 8:30–10:30 AM. Show up, sign in, work alongside whoever's there. No advance registration required."}
                  tags={["Beach Cleanup", "Weekly", "No Registration"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Stewardship')} name={"Limahuli Garden — Volunteer Program"}
                  url="https://ntbg.org/gardens/limahuli/"
                  detail={"Limahuli welcomes volunteers for invasive species removal, native plant propagation, and habitat restoration. The work is ecological and cultural simultaneously."}
                  tags={["Volunteer", "Native Plants", "Invasive Species"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Stewardship')} name={"Malama Kauaʻi"}
                  url="https://www.malamakauai.org/"
                  detail={"A broad volunteer network addressing local food production, invasive species, and access to fresh food on the island. Opportunities include harvesting, trail clearing, and food forest work."}
                  tags={["Volunteer", "Food Systems", "Trail Clearing"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Stewardship')} name={"Malama i nā Honu — Sea Turtle Protection"}
                  detail={"Hawaiian green sea turtles (honu) rest on Poipū Beach nightly. Volunteers protect turtles and educate visitors during hauling events. For shorter stays: stay 15 feet back, no flash photography, no disturbance."}
                  tags={["Sea Turtles", "Poipū Beach", "Protection"]} />
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* GIVE BACK                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="give-back" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="threshold" />
              <SectionLabel>Give Back</SectionLabel>
              <SectionTitle>Leave it better than you found it.</SectionTitle>
              <SectionSub isMobile={isMobile}>The island gives more than it asks. Honor that.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p style={{ fontFamily: "'Quicksand'", fontSize: 14, color: "#4A5650", lineHeight: 1.7 }}>
                Local organizations, Indigenous-led businesses, and trail stewardship opportunities for Kauaʻi — coming soon.
              </p>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CTA                                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="cta" style={{ scrollMarginTop: 126, padding: "56px 0 72px", textAlign: "center" }}>
            <FadeIn>
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.oceanTeal, display: "block", marginBottom: 16 }}>Begin</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300, color: C.darkInk, margin: "0 0 10px", lineHeight: 1.2 }}>{"Your island trip starts here"}</h3>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400, color: "#4A5650", maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.65 }}>
                {"Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you."}
              </p>
              <Link to="/plan" style={{
                padding: "14px 36px", border: "none",
                background: C.darkInk, color: "#fff",
                textAlign: "center", display: "inline-block",
                fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                cursor: "pointer", transition: "opacity 0.2s", textDecoration: "none",
              }}
              onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'kauai' })}
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
                <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#7A857E" }}>Guides available for each destination</span>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
                {[
                  { name: "Zion Canyon", slug: "zion-canyon", accent: C.sunSalmon },
                  { name: "Joshua Tree", slug: "joshua-tree", accent: C.goldenAmber },
                  { name: "Olympic Peninsula", slug: "olympic-peninsula", accent: C.skyBlue },
                  { name: "Big Sur", slug: "big-sur", accent: C.seaGlass },
                  { name: "Vancouver Island", slug: "vancouver-island", accent: C.oceanTeal },
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
                    <span style={{ fontFamily: "'Quicksand'", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.darkInk }}>{other.name}</span>
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
      <WhisperBar destination="kauai" label="Kauaʻi" />
      <Footer />
    </>
  );
}
