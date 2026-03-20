// =================================================================================
// PAGE: BIG SUR GUIDE (dedicated)
// =================================================================================
//
// Full editorial guide for Big Sur & the Central Coast. Uses shared Nav/Footer/FadeIn
// from the Lila Trips component library, with guide-specific components
// defined locally (ListItem, StayItem, ExpandableList).
//
// Route: /destinations/big-sur
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, Breadcrumb, WhisperBar } from '@components';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { getCelestialSnapshot } from '@services/celestialService';
import { Helmet } from 'react-helmet-async';


// --- Guide-Specific Components ------------------------------------------------

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Quicksand', sans-serif",
      fontSize: 12, fontWeight: 700,
      letterSpacing: "0.28em", textTransform: "uppercase",
      color: C.seaGlass, marginBottom: 12,
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
          stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
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
          stroke={C.seaGlass} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
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
        <path d="M4 14 L14 5 L24 14" stroke={C.seaGlass} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 13 L7 23 L21 23 L21 13" stroke={C.seaGlass} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    windows: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="2" stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
        <line x1="14" y1="4" x2="14" y2="24" stroke={C.seaGlass} strokeWidth="1.5" />
        <line x1="4" y1="14" x2="24" y2="14" stroke={C.seaGlass} strokeWidth="1.5" />
      </svg>
    ),
    threshold: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
          stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    plan: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
        <path d="M11 17 L13 13 L17 11 L15 15 Z" stroke={C.seaGlass} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    group: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="10" cy="10" r="3.5" stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="10" r="3.5" stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
        <path d="M4 22 C4 17 7 15 10 15 C11.5 15 12.5 15.5 14 16.5 C15.5 15.5 16.5 15 18 15 C21 15 24 17 24 22" stroke={C.seaGlass} strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
        <circle cx="14" cy="14" r="11" stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
        <path d="M10 14 L14 6 L18 14 L14 22 Z" stroke={C.seaGlass} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
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
    }} onMouseEnter={e => { e.target.style.borderColor = C.seaGlass; e.target.style.color = C.slate || "#3D5A6B"; }}
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
              padding: "2px 10px", border: `1px solid ${C.seaGlass}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.seaGlass,
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
            color: C.seaGlass, marginTop: 4,
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
    rooted: { color: C.seaGlass, label: "Rooted", bg: `${C.seaGlass}12` },
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
    }} onMouseEnter={e => e.target.style.borderColor = C.seaGlass}
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
              padding: "2px 10px", border: `1px solid ${C.seaGlass}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.seaGlass,
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
    rooted: { color: C.seaGlass, label: "Rooted", bg: `${C.seaGlass}12` },
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
          display: 'inline-block', padding: '2px 10px', background: `${C.seaGlass}15`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.seaGlass, marginBottom: 10,
        }}>{item.section}</span>
      )}

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 400,
        color: C.darkInk, margin: '0 0 10px', lineHeight: 1.2,
      }}>{item.name}</h3>

      {item.featured && (
        <span style={{
          display: 'inline-block', padding: '2px 10px', border: `1px solid ${C.seaGlass}40`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.seaGlass, marginBottom: 14,
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
          color: C.seaGlass, marginBottom: 14,
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
          padding: '10px 20px', border: `1.5px solid ${C.seaGlass}`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: C.seaGlass, textDecoration: 'none', transition: 'all 0.25s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = C.seaGlass; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.seaGlass; }}
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
    id: "los-padres", name: "Los Padres National Forest", designation: "national-forest", established: 1906,
    acreage: "1.75M ac", elevation: "sea level–5,862 ft", attribute: "Multi-jurisdiction corridor",
    soul: "The wild backbone of Big Sur — nearly two million acres of chaparral, oak woodland, and coastal mountains stretching from Carmel to Ventura. Most of Big Sur's backcountry trails, hot springs, and wilderness areas fall within Los Padres.",
    facts: [
      "Contains the Ventana Wilderness and Silver Peak Wilderness",
      "Sykes Hot Springs and Tassajara Hot Springs lie within its boundaries",
      "Managed by the USDA Forest Service, distinct from state park lands",
    ],
    infoUrl: "https://www.fs.usda.gov/lpnf",
    driveFrom: null, accent: C.seaGlass, isAnchor: false,
  },
  {
    id: "julia-pfeiffer", name: "Julia Pfeiffer Burns State Park", designation: "state-park", established: 1962,
    acreage: "3,762 ac", elevation: null, attribute: "McWay Falls",
    soul: "Home to McWay Falls — an 80-foot waterfall that drops directly onto a pristine cove beach. One of the most photographed spots on the California coast, and one of only two tidefall waterfalls in the state.",
    facts: [
      "McWay Falls drops 80 ft directly onto the beach",
      "Named for Julia Pfeiffer Burns, a Big Sur pioneer",
      "Underwater area designated as a marine protected area",
    ],
    infoUrl: "https://www.parks.ca.gov/?page_id=578",
    driveFrom: "~20 min from Big Sur Station", accent: "#B07D4B", isAnchor: false,
  },
  {
    id: "pfeiffer-big-sur", name: "Pfeiffer Big Sur State Park", designation: "state-park", established: 1933,
    acreage: "1,006 ac", elevation: null, attribute: "Redwood groves",
    soul: "The heart of Big Sur's valley — old-growth redwoods along the Big Sur River, with some of the most accessible trails in the region. The park that makes Big Sur feel habitable.",
    facts: [
      "Contains old-growth coast redwood groves along the Big Sur River",
      "Pfeiffer Falls trail is the most accessible waterfall hike in Big Sur",
      "Big Sur Lodge sits within the park boundaries",
    ],
    infoUrl: "https://www.parks.ca.gov/?page_id=570",
    driveFrom: "~5 min from Big Sur Station", accent: "#6B8F71", isAnchor: false,
  },
  {
    id: "andrew-molera", name: "Andrew Molera State Park", designation: "state-park", established: 1972,
    acreage: "4,766 ac", elevation: null, attribute: "Largest Big Sur state park",
    soul: "The largest state park in Big Sur — where the Big Sur River meets the ocean. Open meadows, beach access, and the best birding on the coast. Less crowded than Pfeiffer, more expansive.",
    facts: [
      "Largest state park on the Big Sur coast",
      "Where the Big Sur River meets the Pacific",
      "Home to the Ventana Wildlife Society's condor observation point",
    ],
    infoUrl: "https://www.parks.ca.gov/?page_id=582",
    driveFrom: "~15 min north of Big Sur Station", accent: "#5A7E8C", isAnchor: false,
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


// --- Guide Section Navigation (sticky anchor bar) ----------------------------

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
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "4px 40px 0", display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
          <div ref={scrollContainerRef} className="guide-nav-scroll" style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`.guide-nav-scroll::-webkit-scrollbar { display: none; }`}</style>
          {GUIDE_SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button key={section.id} onClick={() => handleClick(section.id)} className="guide-nav-scroll" style={{
                padding: "0 14px", height: 44, background: "none", border: "none",
                borderBottom: `2px solid ${isActive ? C.seaGlass : "transparent"}`,
                cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: 11,
                fontWeight: isActive ? 700 : 600, letterSpacing: "0.14em", textTransform: "uppercase",
                color: isActive ? C.seaGlass : "#7A857E", whiteSpace: "nowrap", flexShrink: 0,
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


// --- Celestial Drawer ---------------------------------------------------------

function CelestialDrawer({ isMobile }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    getCelestialSnapshot("big-sur")
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
    <div style={{ position: "relative", background: C.stone, borderBottom: `1px solid ${C.stone}` }}>
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
    <div style={{ position: "relative", zIndex: open ? 95 : "auto", background: C.stone, borderBottom: `1px solid ${C.stone}` }}>
      <div style={{ height: NAV_HEIGHT + 14 }} />
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", border: "none", cursor: "pointer", background: "transparent",
        padding: isMobile ? "14px 20px" : "14px 52px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = `rgba(0,0,0,0.045)`}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.seaGlass, animation: "celestialPulse 2s ease-in-out infinite", flexShrink: 0 }} />
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#5c6358", flexShrink: 0 }}>
          {"Big Sur Right Now"}
        </span>
        {!isMobile && teasers.length > 0 && (
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600, color: "#6b6359", letterSpacing: "0.04em" }}>
            — {teasers.map((t, i) => (
              <span key={i}>
                {i > 0 && <span style={{ margin: "0 10px", opacity: 0.55, fontWeight: 300 }}>|</span>}
                {t}
              </span>
            ))}
          </span>
        )}
        {isMobile && weather && (
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600, color: "#6b6359", letterSpacing: "0.04em" }}>
            · {weather.temp}° · {moon?.name}
          </span>
        )}
        <span style={{ fontSize: 14, color: "#6b6359", transition: "color 0.3s ease, transform 0.35s ease", marginLeft: 6, flexShrink: 0, display: "inline-block", lineHeight: 1 }}>{open ? "✕" : "▾"}</span>
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
                <div style={{ ...VAL_STYLE, color: C.seaGlass }}>{sun.daylight}</div>
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
                <div style={{ ...VAL_STYLE, color: C.seaGlass }}>{sky.label}</div>
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


// --- Main Page ----------------------------------------------------------------

export default function BigSurGuide() {
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
        <title>Big Sur Guide — Coastal Wilderness, Hot Springs & Slow Travel | Lila Trips</title>
        <meta name="description" content="Big Sur is slipping into the sea. A guide for travelers who want to experience it deeply and tread lightly while it's still here." />
        <link rel="canonical" href="https://lilatrips.com/destinations/big-sur" />
        <meta property="og:title" content="Big Sur Guide — Coastal Wilderness, Hot Springs & Slow Travel | Lila Trips" />
        <meta property="og:description" content="Big Sur is slipping into the sea. A guide for travelers who want to experience it deeply and tread lightly while it's still here." />
        <meta property="og:url" content="https://lilatrips.com/destinations/big-sur" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Big Sur — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Big Sur Guide — Coastal Wilderness, Hot Springs & Slow Travel | Lila Trips" />
        <meta name="twitter:description" content="Big Sur is slipping into the sea. A guide for travelers who want to experience it deeply and tread lightly while it's still here." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav />

      {/* == CELESTIAL DRAWER ================================================ */}
      <CelestialDrawer isMobile={isMobile} />

      {/* == TITLE MASTHEAD ================================================== */}
      <section style={{ background: C.cream }}>
        <div style={{ padding: isMobile ? "28px 20px 24px" : "44px 52px 40px", maxWidth: 920, margin: "0 auto" }}>
          <FadeIn from="bottom" delay={0.1}>

            <Breadcrumb items={[
              { label: "Home", to: "/" },
              { label: "Destinations", to: "/destinations" },
              { label: "Big Sur" },
            ]} />

            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 28 : 52, alignItems: "start",
              marginTop: 28,
            }}>

              {/* -- Left: Title + description -- */}
              <div>
                <span className="eyebrow" style={{ color: C.seaGlass, marginBottom: 14, display: "block" }}>Destination Guide</span>

                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 300,
                  color: C.darkInk, lineHeight: 1.0,
                  margin: "0 0 22px", letterSpacing: "-0.02em",
                }}>
                  {"Big Sur & the Central Coast"}
                </h1>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: "0 0 14px",
                }}>
                  {"Big Sur is not a town. It's a condition. Ninety miles of Highway 1 between Carmel and San Simeon where the Santa Lucia Mountains drop directly into the Pacific — no coastal plain, no buffer, just rock and ocean and redwood and fog. The place has gravity."}
                </p>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: 0,
                }}>
                  {"The orbit pulls north to Carmel-by-the-Sea and Monterey, south toward San Simeon and Cambria. We built this guide to help you find the coast, the redwoods, and the edge of the continent."}
                </p>
              </div>

              {/* -- Right: This Guide Covers -- */}
              <div style={isMobile ? { borderTop: `1px solid ${C.stone}`, paddingTop: 28 } : { borderLeft: `1px solid ${C.stone}`, paddingLeft: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A857E", marginBottom: 18 }}>This guide covers</div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 10 }}>Gateway & Corridor</div>
                  {["Carmel-by-the-Sea", "Monterey & Pacific Grove", "Big Sur Corridor (Highway 1)", "Cambria & San Simeon"].map((area, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.seaGlass, opacity: 0.5 }} />
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

      {/* == GUIDE SECTION NAV =============================================== */}
      <GuideNav isMobile={isMobile} />

      {/* == IMAGE STRIP ===================================================== */}
      <section style={{ position: "relative" }}>
        <div style={{
          display: "flex", gap: 2,
          overflowX: "auto", scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}>
          {[
            { src: P.bigSur,          alt: "Big Sur coastline at sunset",         caption: "Highway 1 — where the mountains meet the sea", width: 420 },
            { src: P.bigSurSurfer,     alt: "Surfer at sunset in Big Sur",         caption: "Golden hour on the Central Coast",              width: 280 },
            { src: P.bigSurHiddenCove, alt: "Hidden cove along the Big Sur coast", caption: "Hidden cove — only accessible on foot",         width: 420 },
            { src: P.bigSurShoreline,  alt: "Rocky shoreline with crashing wave",  caption: "The shoreline at Garrapata",                    width: 360 },
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

      {/* == GUIDE CONTENT =================================================== */}
      <section style={{ padding: isMobile ? "32px 20px 60px" : "48px 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>


          {/* ================================================================ */}
          {/* SENSE OF PLACE                                                    */}
          {/* ================================================================ */}
          <section id="sense-of-place" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionLabel>Sense of Place</SectionLabel>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 16px",
              }}>
                {"Big Sur is not a town. It's a condition. Ninety miles of Highway 1 between Carmel and San Simeon where the Santa Lucia Mountains drop directly into the Pacific — no coastal plain, no buffer, just rock and ocean and redwood and fog. The landscape here does something to people. It has always drawn artists, seekers, and writers who needed the edge of the continent to think clearly: Henry Miller, Robinson Jeffers, Jack Kerouac, the founders of Esalen. The place has gravity."}
              </p>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 16px",
              }}>
                {"The orbit pulls in two directions. North, Carmel-by-the-Sea is a fairytale village — cottage gardens, galleries, one of the most beautiful white-sand beaches in California. Further north, Monterey is the working counterpoint: the Aquarium, Cannery Row, a serious food scene, the Monterey Bay National Marine Sanctuary extending 276 miles along the coast. These towns are not afterthoughts to Big Sur — they are the base camp."}
              </p>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 28px",
              }}>
                {"What Big Sur asks of you is presence. The road is too narrow and winding for distraction. The vistas demand pause. The fog that rolls in most mornings burns off by noon, and when it does, the light on the water is unrepeatable."}
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
                  { l: "Recommended", v: "3–5 days" },
                  { l: "Nearest Airport", v: "Monterey (MRY) or SFO" },
                  { l: "From SFO", v: "~3 hours" },
                  { l: "Best Times", v: "Apr–Oct" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 3 }}>{s.l}</div>
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

          {/* ================================================================ */}
          {/* WHEN TO GO                                                        */}
          {/* ================================================================ */}
          <section id="when-to-go" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="windows" />
              <SectionLabel>Magic Windows</SectionLabel>
              <SectionTitle>When to go</SectionTitle>
              <SectionSub isMobile={isMobile}>{"Big Sur rewards every season differently. These are the moments when the coast is most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Spring Wildflowers & Waterfalls" featured
                  detail={"March through May: the coast at its most lush and green. Wildflowers through April. Waterfalls at maximum flow after winter rains. McWay Falls and Pfeiffer Falls at their most dramatic. Fog common in the mornings but burns off by noon. Best overall window."}
                  tags={["Mar – May", "Wildflowers", "Waterfalls"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Gray Whale Migration" featured
                  detail={"Gray whales migrate south December through February, north March through April. Peak shore-watching January through March. Point Lobos and the McWay Falls overlook are premier viewing spots. Humpbacks visible March through December."}
                  tags={["Dec – Apr", "Wildlife", "Magic Window"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Fall Shoulder Season"
                  detail={"September through November: fog clears earlier, crowds thin, excellent light. Whale migration begins in late October. The most reliable clear nights for stargazing. The best balance of access and solitude."}
                  tags={["Sep – Nov", "Clear Skies", "Fewer Crowds"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Monarch Butterfly Migration"
                  detail={"Tens of thousands of monarchs overwinter in the Pacific Grove eucalyptus grove near Monterey. Late October through February. The trees draped in living orange. A short walk through the grove is genuinely moving."}
                  tags={["Oct – Feb", "Wildlife", "Pacific Grove"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Summer — Marine Layer Season"
                  detail={"Peak tourist season. Highway 1 can back up. Morning fog is thick and persistent — often doesn't burn off until early afternoon. Redwood canyon hikes are comfortable when the coast is socked in. Milky Way core visible on clear nights."}
                  tags={["Jun – Aug", "Peak Season", "Fog"]} />
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
              <SectionSub isMobile={isMobile}>The coast operates on its own terms. Arrive accordingly.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 8 }}>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Highway 1 · Erosion & Access</div>
                  <ListItem isMobile={isMobile} name="The road exists on borrowed time. Drive like it."
                    detail="The dramatic cliffs of Big Sur aren't a stable place to build a highly trafficked highway — collapses, mudslides, and fires are a recurring reality. The pullouts are engineered for momentary stops, not extended gatherings. Parking on the shoulder damages drainage infrastructure that keeps the road viable. When a section closes, it closes for everyone — including the 1,500 people who live here."
                    tags={["Road etiquette", "No shoulder parking", "Respect closures"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Bixby Bridge · Overtourism</div>
                  <ListItem isMobile={isMobile} name="The most photographed spot is also the most pressured."
                    detail="Bixby Creek Bridge has become a tourist magnet — traffic jams, illegal parking, visitors clambering down unstable cliffs for the shot. We route toward the interior trails and quieter coves instead. The encounter feels earned rather than extracted. Several of the most-photographed spots along this coast are on private land or actively eroding. Closed means closed."
                    tags={["Off the main road", "Interior trails", "Slow travel"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Pfeiffer Beach · Dispersed Camping</div>
                  <ListItem isMobile={isMobile} name="Illegal camping caused one of the costliest wildfires in US history."
                    detail="The Soberanes Fire of 2016 started from an illegal campfire. Big Sur's coastal scrub and redwood understory ignite fast in dry conditions. Dispersed camping outside designated sites is not just illegal here — it's genuinely dangerous for the ecosystem and for the permanent community that depends on Highway 1 remaining open. Book a site or a stay."
                    tags={["Designated camping only", "Fire risk", "Protect the corridor"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Resident Community · 1,500 People</div>
                  <ListItem isMobile={isMobile} name="Tourism is 90% of the economy. That doesn't mean it's welcome everywhere."
                    detail="Big Sur's permanent population is just 1,500 people. Four to five million visitors come annually. Many of the most beautiful spots are on private land or actively managed for conservation. The locals who remain here have chosen a difficult life in exchange for the landscape. Respect that bargain — and when you find somewhere that feels undiscovered, consider not sharing the exact location."
                    tags={["Private land awareness", "Resident respect", "Coastal access ethics"]} />
                </div>
              </div>
            </FadeIn>
          </section>

          <Divider />

          {/* ================================================================ */}
          {/* STAY                                                              */}
          {/* ================================================================ */}
          <section id="where-to-stay" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="stay" />
              <SectionLabel>Sleep</SectionLabel>
              <SectionTitle>Where to sleep</SectionTitle>
              <SectionSub isMobile={isMobile}>{"How you inhabit a place matters. From clifftop campgrounds above the Pacific to the most acclaimed hotel on the California coast."}</SectionSub>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div style={{
                padding: "14px 16px", background: C.cream,
                border: `1px solid ${C.stone}`, marginBottom: 20,
                display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 16, flexWrap: "wrap",
              }}>
                {[
                  { label: "Elemental", desc: "In the landscape", color: C.seaGlass },
                  { label: "Rooted", desc: "Boutique, local", color: C.seaGlass },
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
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Asilomar Conference Grounds" location="Pacific Grove" featured
                  detail={"107 acres of Pacific Grove beachfront — sand dunes, Monterey pines, tide pools. 313 rooms across 30 historic buildings designed by Julia Morgan. No televisions. Fire pits, heated pool, miles of walking paths. The name is a portmanteau of asilo (refuge) and mar (sea). Walking distance to Monarch Butterfly Sanctuary and 17-Mile Drive."}
                  tags={["Julia Morgan", "Beachfront", "No TVs", "State Parks"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Pfeiffer Big Sur State Park Campground" location="Big Sur" featured
                  detail={"218 sites in a cathedral redwood grove along the Big Sur River. The most popular campground in California — reservations open 6 months in advance and book within minutes. Worth setting a reservation alert. Dark sky conditions good; the river provides constant ambient sound."}
                  tags={["Redwood Grove", "River", "218 Sites", "Book 6 Mo Ahead"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name="Post Ranch Inn" location="Big Sur" featured
                  detail={"The most acclaimed hotel on the California coast. 40 accommodations — ocean view suites, treehouses on stilts, cliff houses cantilevered 1,200 feet above the sea. No televisions or alarm clocks. No children under 18. Three Michelin Keys. Sierra Mar restaurant at dinner. The standard against which all similar experiences are measured."}
                  tags={["Three Michelin Keys", "Treehouses", "Sierra Mar", "No TVs"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Kirk Creek Campground" location="Los Padres NF"
                  detail={"Clifftop sites directly above the Pacific — the most dramatic camping in California. 33 sites, all with ocean views. No hookups, no showers. At the southern end of the corridor, 30 miles south of Pfeiffer. Among the best drive-in stargazing campgrounds in the state."}
                  tags={["Clifftop", "Ocean Views", "Dark Sky", "Bortle 2"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Treebones Resort" location="Southern Big Sur" featured
                  detail={"Yurt resort perched on a coastal ridge above the Pacific. 16 yurts with ocean views, pool, hot tub, and nightly s'mores. The human nest — a sculptural outdoor sleeping structure built into the hillside — is bookable and genuinely singular."}
                  tags={["Yurts", "Ocean Views", "Human Nest", "Pool"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Glen Oaks Big Sur" location="Big Sur"
                  detail={"Cabins and motor lodge rooms in the redwoods alongside the Big Sur River. Design-forward, sustainably built, using natural wool and Coyuchi organic cotton. Walking distance to Big Sur Bakery and trailheads."}
                  tags={["Cabins", "Design", "River", "Sustainable"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Ventana Campground / Glampsites" location="Big Sur"
                  detail={"Traditional tent camping and luxury safari-style canvas glampsites in a 40-acre redwood canyon. The glampsites have custom mattresses, heated blankets, private fire pits, and bathhouse access with teak showers."}
                  tags={["Glamping", "Redwood Canyon", "Bathhouse"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Big Sur Lodge" location="Pfeiffer Big Sur SP"
                  detail={"Operated by California State Parks. Basic but storied — cottages inside the state park, walking distance to every trailhead. The least expensive roofed accommodation in the Big Sur corridor and the most convenient for serious hikers."}
                  tags={["State Park", "Trail Access", "Affordable"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Bernardus Lodge & Spa" location="Carmel Valley"
                  detail={"Fifteen miles inland from Carmel. Vineyard estate with full-service spa, heated pool, and restaurant built around estate wine and local produce. Warm, dry, sun-drenched when the coastal fog is thick."}
                  tags={["Wine Country", "Spa", "Inland", "Fog-Free"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="L'Auberge Carmel" location="Carmel-by-the-Sea"
                  detail={"Relais & Chateaux property in a 1929 building in Carmel village center. 20 rooms with antique furnishings, fireplace, and the Aubergine restaurant (one Michelin star) downstairs."}
                  tags={["Relais & Chateaux", "Michelin Star", "Village Center"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name="Alila Ventana Big Sur" location="Big Sur"
                  detail={"Adults-only, all-inclusive resort in the redwood canyon above the Pacific. All meals, wellness programming, Spa Alila access, and guided experiences included. Safari glamping and tent camping also bookable on the property."}
                  tags={["All-Inclusive", "Adults Only", "Spa Alila", "Redwood Canyon"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name="Hyatt Carmel Highlands" location="Carmel Highlands"
                  detail={"On a cliffside above Big Sur and Carmel, 10 miles south of Carmel center. Panoramic ocean views, fireplaces in most rooms, infinity pool. A less stratospheric price point than Post Ranch with similar view quality."}
                  tags={["Cliffside", "Infinity Pool", "Ocean Views"]} />
              </ExpandableList>
            </div>
          </section>


          <Divider />

          {/* ================================================================ */}
          {/* TRAILS                                                            */}
          {/* ================================================================ */}
          <section id="trails" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="move" />
              <SectionLabel>Move</SectionLabel>
              <SectionTitle>{"Trails, coast & redwoods"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From the waterfalls of Julia Pfeiffer Burns to the ancient cypress groves of Point Lobos. Every trail here earns its reputation."}</SectionSub>
            </FadeIn>

            {/* -- Iconic Hikes -- */}
            <FadeIn delay={0.06}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>{"Signature Hikes"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="McWay Falls Overlook Trail" featured
                  detail={"The most iconic single image in Big Sur — an 80-foot waterfall cascading directly onto the beach of a protected cove, with turquoise water and an arch of eroded rock. The overlook is wheelchair-accessible from the Julia Pfeiffer Burns parking lot. Short, essential."}
                  note="0.5 mi RT · Easy · 20–30 min"
                  tags={["Julia Pfeiffer Burns SP", "Waterfall", "Wheelchair Accessible"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Partington Cove Trail"
                  detail={"A hike down to a hidden rocky cove through a hand-carved tunnel in the cliffside. The tunnel was built by John Partington in the 1880s to haul out tanbark. The cove itself is dramatic: surging water, sea caves, a small footbridge. Short but memorable."}
                  note="1.1 mi RT · Easy-Moderate · 45 min"
                  tags={["Sea Caves", "History", "Photography"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Pfeiffer Falls & Valley View Trail" featured
                  detail={"The definitive redwood hike in Big Sur. The trail winds through coastal redwoods along Pfeiffer Big Sur Creek to a 60-foot waterfall, then climbs to a viewpoint overlooking the Big Sur Valley and Point Sur. Best after significant rainfall."}
                  note="2 mi RT · 500 ft gain · Easy-Moderate · 1.5–2 hrs"
                  tags={["Redwoods", "Waterfall", "Valley View"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Tanbark Trail & Tin House Loop" featured
                  detail={"The hardest hike in this guide and the most rewarding. The loop climbs steeply through redwood canyons and chaparral to the ruins of the Tin House — an old homestead with 360-degree views of the Big Sur coastline stretching in both directions. 2,000+ feet of elevation gain."}
                  note="6.4 mi loop · 2,000 ft gain · Strenuous · 4–5 hrs"
                  tags={["Ridge Views", "Strenuous", "Oct–May Best"]} />
              </div>
            </FadeIn>

            {/* -- Coastal Walks -- */}
            <FadeIn delay={0.1}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>{"Coastal Walks & Bluffs"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Soberanes Point & Whale Peak" featured
                  detail={"A coastal bluff loop with sweeping Pacific views and strong wildlife potential — sea otters, seals, and migrating whales visible from the trail. Soberanes Point is considered one of the best photography locations on the coast. Parking is roadside on Highway 1."}
                  note="1.8 mi loop · 300 ft gain · Easy-Moderate · 1–1.5 hrs"
                  tags={["Garrapata SP", "Whale Watching", "Photography"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Creamery Meadow / Bluffs / Panorama Loop"
                  detail={"The most complete single-day experience in Big Sur — meadows, coastal bluffs, redwood canyons, and a remote beach. River crossing required when seasonal footbridge is out (fall through mid-June). Panoramic views from the Ridge Trail stretch up and down the coast."}
                  note="8 mi loop · ~1,000 ft gain · Moderate-Strenuous · 4–5 hrs"
                  tags={["Andrew Molera SP", "Full Day", "Check Bridge Status"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Buzzard's Roost Trail"
                  detail={"A local favorite for sunset. The lollipop loop climbs through tan oaks and redwoods to a ridge viewpoint overlooking the Pacific. Less crowded than coastal trails; deeply wooded and quiet until the summit."}
                  note="2.6 mi · ~700 ft gain · Moderate · 1.5–2 hrs"
                  tags={["Pfeiffer Big Sur SP", "Sunset", "Solitude"]} />
              </div>
            </FadeIn>

            {/* -- Point Lobos -- */}
            <FadeIn delay={0.14}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>{"Point Lobos State Natural Reserve"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Cypress Grove Trail" featured
                  detail={"One of only two remaining native Monterey cypress forests on Earth — gnarled, wind-sculpted trees growing from clifftop rocks above a crashing sea. Wildlife at every turn: otters in the coves, cormorants on the rocks, sea lions audible from the water. A short loop with outsized power."}
                  note="0.8 mi loop · Easy · 30–45 min"
                  tags={["Monterey Cypress", "Wildlife", "Photography"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Bird Island Trail (China Cove)"
                  detail={"The trail to China Cove — the most photographed spot in Point Lobos. The cove is a deep emerald bowl of water framed by white cliffs. The trail also passes Pelican Point with long coastal views south toward Big Sur."}
                  note="0.8 mi RT · Easy · 30 min"
                  tags={["China Cove", "Photography", "Emerald Water"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="South Shore Trail"
                  detail={"The longer coastal route through the reserve, connecting Hidden Beach and Weston Beach (excellent tide pools) along a rugged south-facing shoreline. Combine with Cypress Grove for a half-day loop."}
                  note="2.6 mi RT · Easy-Moderate · 1.5 hrs"
                  tags={["Tide Pools", "Wildlife", "Half-Day Loop"]} />
              </div>
            </FadeIn>

            {/* -- Scenic Drives -- */}
            <FadeIn delay={0.18}>
              <div style={{ marginTop: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>Scenic Drives</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Highway 1 — Big Sur Corridor" featured
                  detail={"The drive itself is the destination. 90 miles between Carmel and San Simeon past Bixby Creek Bridge, through redwood canyons, past sea cliffs hundreds of feet above the Pacific. Stop at every turnout. The drive takes 2–3 hours without stops; plan a full day."}
                  tags={["90 Miles", "Bixby Bridge", "Full Day"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="17-Mile Drive (Pebble Beach)"
                  detail={"The natural connector between Monterey and Carmel. Toll road ($12.25/vehicle) through Del Monte Forest, past Ghost Tree, Seal Rock, Bird Rock, and the Lone Cypress — the most photographed tree in California. The light at Seal Rock in the late afternoon is extraordinary."}
                  tags={["Pebble Beach", "Lone Cypress", "$12.25 Toll"]} />
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ================================================================ */}
          {/* WELLNESS                                                          */}
          {/* ================================================================ */}
          <section id="wellness" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="breathe" />
              <SectionLabel>Breathe</SectionLabel>
              <SectionTitle>{"Yoga, soaking & contemplation"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"The ocean here is not calm. The coast provides both a mirror and a pulse. Practice on the edge of the continent."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="wellness experiences">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Esalen Institute" featured
                  detail={"The original. Founded in 1962 where the human potential movement was born — 600+ workshops annually on yoga, somatic practice, meditation, psychology, and consciousness. 27 acres of cliffs above the Pacific. Geothermal hot springs (119°F) flow into cliffside soaking tubs overlooking the ocean. Access by workshop registration only — no day visits. Plan well ahead."}
                  note="45 miles south of Carmel — workshop registration only"
                  tags={["Hot Springs", "Workshops", "Yoga", "Meditation"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Refuge Carmel" featured
                  detail={"The standout contrast therapy destination in the Carmel orbit — and one of the best in California. Nordic thermotherapy cycle: hot pools, Finnish cedar sauna with Himalayan salt wall, eucalyptus steam rooms, then cold plunge pools. Strictly enforced silence and no-phone policy. Genuinely one of the quietest places in the orbit. Reservations required."}
                  note="One Old Ranch Rd, Carmel"
                  tags={["Contrast Therapy", "Silence Policy", "Sauna", "Cold Plunge"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Seaside Yoga Sanctuary" featured
                  detail={"The anchor studio for drop-in yoga in the Carmel orbit. Voted best yoga studio in Monterey County eleven consecutive years. Carmel Plaza location (Ocean Ave & Mission St, 3rd floor) — all-level classes including sunrise sessions. Drop-in welcome; complimentary mats and props."}
                  note="Carmel Plaza, 3rd floor"
                  tags={["Drop-In", "Sunrise Sessions", "All Levels"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Yoga Shala by the Sea"
                  detail={"The most characterful drop-in studio in Carmel — a cottage that has housed yoga practice continuously since 1988, operating for 35+ years. Hatha, restorative, vinyasa, yoga nidra, sound therapy. Walk-ins welcome. Outdoor classes in the courtyard. Unpretentious, community-rooted."}
                  note="Cottage #18, San Carlos & 10th Ave, Carmel"
                  tags={["Since 1988", "Walk-In", "Sound Therapy", "Outdoor Classes"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Mount Madonna Center"
                  detail={"The most serious yoga retreat destination in the orbit — 380-acre intentional community in the Santa Cruz Mountains overlooking Monterey Bay, founded in the lineage of master yogi Baba Hari Dass. Classical Ashtanga Yoga, Bhakti tradition, Ayurveda, working Hanuman temple. About 45 minutes from Carmel."}
                  note="445 Summit Rd, Watsonville — personal retreats + programs"
                  tags={["Retreat Center", "Ayurveda", "Hanuman Temple", "45 min from Carmel"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Ventana Wellness (Alila Ventana)"
                  detail={"Complimentary wellness programming for resort guests: daily yoga, guided hikes, forest bathing, Spa Alila treatments, and Japanese-inspired hot baths. The most curated wellness experience in the corridor without a week-long workshop commitment."}
                  tags={["Resort Guests", "Forest Bathing", "Hot Baths"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Post Ranch Wellness"
                  detail={"Daily programming for guests: morning yoga in the yurt, guided forest meditation, naturalist hikes, stargazing sessions, chef's garden tours. Signature Big Sur Jade Stone Therapy uses locally sourced jade, basalt river rocks, and cooled marble."}
                  tags={["Post Ranch Guests", "Stargazing", "Jade Stone Therapy"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Big Sur River Gorge — Contemplative Practice"
                  detail={"The river gorge offers naturally sheltered contemplative spaces: flat rocks above swimming holes, redwood-shaded banks, the sound of moving water cutting through canyon walls. A 1-mile walk from the Pfeiffer Big Sur campground entrance finds you entirely alone on most weekday mornings."}
                  tags={["Free", "Solitude", "River", "Open-Air Meditation"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ================================================================ */}
          {/* LIGHT & SKY                                                       */}
          {/* ================================================================ */}
        </div>
      </section>

      {/* Night Sky section with full-width dark background */}
      <section id="light-sky" style={{ scrollMarginTop: 126, padding: isMobile ? "52px 20px" : "64px 52px", background: C.darkInk }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeIn>
            <SectionIcon type="awaken" />
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 12, textAlign: "center" }}>Night Sky</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 400, color: "#fff", margin: "0 0 6px", lineHeight: 1.2, textAlign: "center" }}>{"Light & sky"}</h2>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: isMobile ? 15 : "clamp(14px, 1.8vw, 15px)", fontWeight: 400, color: "rgba(255,255,255,0.7)", margin: "0 auto 28px", lineHeight: 1.7, textAlign: isMobile ? "left" : "center", maxWidth: isMobile ? "100%" : 520 }}>
              {"No formal IDA designation, but the skies here are genuinely world-class when conditions align. Pfeiffer Big Sur State Park is rated Bortle Class 2 — darker than most IDA-certified parks. The catch is the marine layer: the strategy is elevation."}
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>Best Viewing Locations</div>
              {[
                { name: "Pfeiffer Beach", note: "Protected cove naturally shielded from highway headlights. Milky Way visible when clear. Bortle 2–3. Day use only — arrive before sunset." },
                { name: "Kirk Creek Campground", note: "Clifftop above the Pacific with full night sky to south, west, and overhead. One of the few campgrounds where you can watch the Milky Way arc over the ocean. Bortle 2." },
                { name: "Pfeiffer Ridge / Tin House", note: "The most committed option — 6.4 miles and 3,000 feet up to the ridge above the marine layer. 270-degree views, no light sources. Bortle 1–2 above fog." },
                { name: "Andrew Molera State Park", note: "Open meadow at the mouth of the Big Sur River. Hike-in campsites are exceptionally dark — no facility lighting. Bortle 2." },
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
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>Calendar Anchors</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                {[
                  { event: "Milky Way Core", timing: "Mar – Oct", detail: "Best April–July when the galactic center is highest" },
                  { event: "Perseid Meteor Shower", timing: "Mid-August", detail: "Peak Aug 12–13 — go to ridge to beat marine layer" },
                  { event: "Bixby Bridge Astro", timing: "New Moon Nights", detail: "The bridge under the Milky Way — iconic astrophotography" },
                  { event: "Gray Whale + Stars", timing: "Dec – Apr", detail: "Watch migrating whales at dusk, then stay for the stars" },
                ].map((cal, i) => (
                  <div key={i} style={{ padding: "14px 16px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{cal.event}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 4 }}>{cal.timing}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>{cal.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div style={{ padding: "16px 18px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 10 }}>Marine Layer Note</div>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                {"Summer marine layer (June–August) is the thickest and most persistent, often burning off only to return by midnight. Fall (September–November) offers the most reliable clear nights. Winter has the clearest skies overall but cold temps and shorter windows. Check Clear Outside or Clear Dark Sky forecasts before committing to a ridge hike."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Continue guide content */}
      <section style={{ padding: isMobile ? "0 20px 60px" : "0 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>


          {/* ================================================================ */}
          {/* FOOD & CULTURE                                                    */}
          {/* ================================================================ */}
          <section id="food-culture" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Food & Culture</SectionLabel>
              <SectionTitle>{"Food, culture & stewardship"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From the most spectacular restaurant in California to a chair in the Big Sur River. The connections here go deeper than a meal."}</SectionSub>
            </FadeIn>

            {/* -- Big Sur Dining -- */}
            <FadeIn delay={0.06}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>{"Big Sur (On the Highway)"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Sierra Mar (Post Ranch Inn)" featured
                  detail={"The most spectacular restaurant in California, full stop. Floor-to-ceiling glass walls suspended 1,200 feet above the Pacific. Four-course prix fixe dinner; daily lunch more accessible in price. Reservations essential — book weeks or months ahead. Open to non-guests."}
                  tags={["Fine Dining", "Ocean Views", "Reserve Far Ahead"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Nepenthe" featured
                  detail={"The iconic Big Sur terrace. Built in 1949 on land Henry Miller once owned. The Ambrosia burger is a pilgrimage food for locals. The view from the outdoor deck — nothing between you and the horizon — is the point. No reservations; arrive early or late."}
                  tags={["Iconic Terrace", "Ambrosia Burger", "No Reservations"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Big Sur Bakery"
                  detail={"Breakfast and lunch in a converted house surrounded by redwoods. Wood-fired pastries, fresh eggs, excellent coffee. A local institution. Opens early; the pastry case sells out. Friday–Tuesday only."}
                  tags={["Pastries", "Wood-Fired", "Fri–Tue Only"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Big Sur River Inn Restaurant"
                  detail={"The gathering place of Big Sur's small community. Riverside deck over the Big Sur River — during warm months, patrons sit in chairs directly in the river. Less refined than Nepenthe but more authentically local."}
                  tags={["Riverside", "Chairs in the River", "Community"]} />
              </div>
            </FadeIn>

            {/* -- Carmel Dining -- */}
            <FadeIn delay={0.1}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>{"Carmel-by-the-Sea"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Aubergine (L'Auberge Carmel)" featured
                  detail={"One Michelin star. The best fine dining in the Carmel/Monterey orbit. Tasting menu format, intimate dining room, wine program anchored on local producers. The special occasion restaurant — worth planning a trip around."}
                  tags={["Michelin Star", "Tasting Menu", "Special Occasion"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="La Bicyclette"
                  detail={"Seasonal menu, wood-fired oven, French bistro sensibility with California ingredients. The mushroom appetizer is a regular on best-of lists. Takes reservations; has walk-in bar seating."}
                  tags={["Wood-Fired", "French Bistro", "Walk-In Bar"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Casanova"
                  detail={"A vintage Carmel farmhouse converted into a French/Italian restaurant with a legendary wine cellar. One of the most atmospheric dining rooms in California — low-beamed ceilings, candlelight, garden patio."}
                  tags={["Wine Cellar", "Candlelight", "Garden Patio"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Carmel Belle"
                  detail={"The morning anchor. Inside the Doud Craft Studios — coffee, breakfast bowls, local provisions. The preferred start to a day before heading south on Highway 1."}
                  tags={["Morning", "Coffee", "Provisions"]} />
              </div>
            </FadeIn>

            {/* -- Monterey Dining -- */}
            <FadeIn delay={0.14}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>{"Monterey"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Coastal Kitchen Monterey"
                  detail={"Tasting menu format, sustainable seafood-centric. Chef Michael Rotondo's multi-course experience is among the most serious culinary offerings on the Central Coast. Tuesday–Saturday evenings."}
                  tags={["Tasting Menu", "Seafood", "Tue–Sat"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Old Fisherman's Grotto"
                  detail={"Fisherman's Wharf, harbor views, fresh-caught local seafood. A tourist destination that has earned its reputation — the clam chowder and Dungeness crab are the real deal."}
                  tags={["Fisherman's Wharf", "Clam Chowder", "Dungeness Crab"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Alta Bakery"
                  detail={"The best coffee stop in Monterey. Sunny back courtyard, excellent pastries, a genuinely good neighborhood cafe energy. Downtown Monterey."}
                  tags={["Coffee", "Pastries", "Morning"]} />
              </div>
            </FadeIn>

            {/* -- Discover & Culture -- */}
            <FadeIn delay={0.18}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>{"Art, Culture & Discovery"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="Monterey Bay Aquarium" featured
                  detail={"One of the world's great marine science institutions. The Kelp Forest exhibit, the Sea Otter Program, and the deep-sea collection are extraordinary. A genuine research and conservation organization. The Seafood Watch program has changed how restaurants source fish nationwide."}
                  tags={["Cannery Row", "Marine Science", "Kelp Forest"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="Henry Miller Memorial Library"
                  detail={"Not a memorial, not a library — Miller himself called it \"a place to hang out.\" A clearing in the redwoods that hosts readings, concerts, and community events. The bookshop carries Miller's work and curated Big Sur literature."}
                  tags={["Literature", "Concerts", "Community"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="Robinson Jeffers' Tor House (Carmel)"
                  detail={"The stone house and tower that poet Robinson Jeffers built by hand between 1914 and 1963, hauling granite boulders from the Carmel shoreline. One of the most significant literary sites on the California coast. Saturday tours."}
                  tags={["Poetry", "Stone Tower", "Saturday Tours"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="Carmel Mission Basilica"
                  detail={"The most significant historical site in the Big Sur orbit. Founded in 1771 by Father Junipero Serra, who is buried beneath the sanctuary floor. The walled courtyard garden and fountain are original architecture. Five minutes from village center."}
                  tags={["History", "Architecture", "1771"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="Kayaking & SUP — Monterey Bay"
                  detail={"Sea otters rest in the kelp beds and occasionally swim up to kayaks. Guided tours launch from Cannery Row. Cold water (50°F year-round) — go with a guide on a first visit. Spring and fall optimal conditions."}
                  tags={["Sea Otters", "Kelp Beds", "Guided Tours"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="Lovers Point Park (Pacific Grove)"
                  detail={"A small rocky promontory with tide pools, a sandy cove, kelp beds where otters rest. The Monterey Recreation Trail follows the bay to Cannery Row. Cold and calm enough for kayaking and snorkeling among the kelp."}
                  tags={["Tide Pools", "Otters", "Pacific Grove"]} />
              </div>
            </FadeIn>

            {/* -- Give Back & Stewardship -- */}
            <FadeIn delay={0.22}>
              <div style={{ marginTop: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 16 }}>{"Cultural Heritage & Stewardship"}</div>
                <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.5vw, 14px)", fontWeight: 400, color: "#4A5650", lineHeight: 1.7, margin: "0 0 16px" }}>
                  {"The Big Sur coast has been home to the Esselen people for at least 3,000 years. The Esselen Tribe of Monterey County is working to reacquire ancestral land. Esalen Institute takes its name directly from the Esselen people who inhabited the land."}
                </p>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Stewardship')} name="Big Sur Land Trust" featured
                  detail={"A local nonprofit that has protected over 60,000 acres along the Central Coast since 1978. Volunteer opportunities and land stewardship programs available. The most impactful conservation organization in the corridor."}
                  tags={["Conservation", "60,000 Acres", "Volunteer"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Stewardship')} name="Point Lobos Foundation"
                  detail={"The nonprofit partner to Point Lobos State Natural Reserve. Supports conservation, volunteer docent programs, and educational initiatives. Volunteer naturalist days are available to the public."}
                  tags={["Volunteer Docent", "Conservation", "Education"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Stewardship')} name="Monterey Bay Aquarium — Seafood Watch"
                  detail={"A science-based seafood sustainability program that has changed sourcing practices at restaurants and retailers across the country. Download the Seafood Watch app before visiting — it changes how you read a menu everywhere you go after."}
                  tags={["Sustainability", "App", "Conservation"]} />
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
              <SectionSub isMobile={isMobile}>The coast and the people who live here need different kinds of support. These organizations cover both.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 8 }}>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Conservation</div>
                  <ListItem isMobile={isMobile} name="Big Sur Land Trust"
                    url="https://bigsurlandtrust.org"
                    detail="Since 1978, BSLT has conserved over 45,000 acres of Monterey County coastline and interior lands. They partner with the Esselen Tribe to manage Basin Ranch using traditional ecological stewardship — one of the most direct models of Indigenous land partnership on the California coast."
                    tags={["Donate", "Volunteer"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Indigenous Giving</div>
                  <ListItem isMobile={isMobile} name="Esselen Tribe of Monterey County"
                    url="https://www.esselen.com"
                    detail="In 2020 the Esselen Tribe regained its first ancestral homelands since displacement by the Spanish four centuries ago. Big Sur Land Trust is their partner in land stewardship. Supporting BSLT directly supports this ongoing restoration of Indigenous land relationship."
                    tags={["Learn & Support"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Trail Stewardship</div>
                  <ListItem isMobile={isMobile} name="Los Padres ForestWatch"
                    url="https://lpfw.org"
                    detail="Watchdog organization protecting Los Padres National Forest — the interior backbone of Big Sur — from illegal off-road vehicle damage, overdevelopment, and fire mismanagement."
                    tags={["Donate", "Volunteer"]} />
                </div>
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ================================================================ */}
          {/* CTA                                                               */}
          {/* ================================================================ */}
          <section id="cta" style={{ scrollMarginTop: 126, padding: "56px 0 72px", textAlign: "center" }}>
            <FadeIn>
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.seaGlass, display: "block", marginBottom: 16 }}>Begin</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300, color: C.darkInk, margin: "0 0 10px", lineHeight: 1.2 }}>{"Your coastal trip starts here"}</h3>
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
              onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'big-sur' })}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >{"Plan a Trip"}</Link>
            </FadeIn>
          </section>

          {/* -- Also Explore ------------------------------------------------ */}
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
                  { name: "Vancouver Island", slug: "vancouver-island", accent: C.oceanTeal },
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
      <WhisperBar destination="bigSur" label="Big Sur" />
      <Footer />
    </>
  );
}
