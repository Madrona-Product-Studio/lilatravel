// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: JOSHUA TREE GUIDE (dedicated)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Full editorial guide for Joshua Tree & its orbit. Uses shared Nav/Footer/FadeIn
// from the Lila Trips component library, with guide-specific components
// defined locally (ListItem, StayItem, ExpandableList).
//
// Route: /destinations/joshua-tree
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, Breadcrumb } from '@components';
import TripCard from '@components/TripCard';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { getTripsByDestination } from '@data/trips';
import { trackEvent } from '@utils/analytics';
import { getCelestialSnapshot } from '@services/celestialService';
import { getNPSData, buildNPSLookup, findNPSMatch } from '@services/npsService';


// ─── Guide-Specific Components ───────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Quicksand', sans-serif",
      fontSize: 12, fontWeight: 700,
      letterSpacing: "0.28em", textTransform: "uppercase",
      color: C.goldenAmber, marginBottom: 12,
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
          stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
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
          stroke={C.goldenAmber} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
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
        <rect x="4" y="4" width="20" height="20" rx="2" stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
        <line x1="14" y1="4" x2="14" y2="24" stroke={C.goldenAmber} strokeWidth="1.5" />
        <line x1="4" y1="14" x2="24" y2="14" stroke={C.goldenAmber} strokeWidth="1.5" />
      </svg>
    ),
    threshold: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
          stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
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
        <circle cx="10" cy="10" r="3.5" stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="10" r="3.5" stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
        <path d="M4 22 C4 17 7 15 10 15 C11.5 15 12.5 15.5 14 16.5 C15.5 15.5 16.5 15 18 15 C21 15 24 17 24 22" stroke={C.goldenAmber} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    darksky: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
          stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
        <circle cx="22" cy="6" r="1" fill={C.goldenAmber} opacity="0.6" />
        <circle cx="8" cy="5" r="0.8" fill={C.goldenAmber} opacity="0.5" />
        <circle cx="24" cy="12" r="0.6" fill={C.goldenAmber} opacity="0.4" />
      </svg>
    ),
    discover: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
        <path d="M10 14 L14 6 L18 14 L14 22 Z" stroke={C.goldenAmber} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
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

function NPSArrowhead({ size = 14, color = "#2D5F2B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 22h3l5-11 5 11h3L12 2z" fill={color} opacity="0.85" />
      <circle cx="12" cy="16" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}

function ListItem({ name, detail, note, tags, featured, url, isMobile, onOpenSheet, location, hasNPS }) {
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
              padding: "2px 10px", border: `1px solid ${C.goldenAmber}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.goldenAmber,
            }}>{"Lila Pick"}</span>
          )}
          {hasNPS && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "2px 8px", background: "#2D5F2B10",
              fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "#2D5F2B",
            }}>
              <NPSArrowhead size={10} />NPS
            </span>
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
              padding: "2px 10px", border: `1px solid ${C.goldenAmber}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.goldenAmber,
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

  const nps = item.nps;
  const npsImages = nps?.images?.filter(img => img.url) || [];
  const npsPrimaryImage = npsImages[0];

  const stripHTML = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
  };

  const npsInfoRows = [];
  if (nps) {
    if (nps.duration) npsInfoRows.push({ label: 'Duration', value: nps.duration });
    if (nps.season?.length) npsInfoRows.push({ label: 'Best Seasons', value: Array.isArray(nps.season) ? nps.season.join(', ') : nps.season });
    if (nps.location || nps.locationDescription) npsInfoRows.push({ label: 'Location', value: stripHTML(nps.locationDescription || nps.location || '') });
    const petsAllowed = nps.arePetsPermitted === 'true' || nps.arePetsPermitted === true;
    if (nps.petsDescription || nps.arePetsPermitted !== undefined) {
      npsInfoRows.push({ label: 'Pets', value: nps.petsDescription ? stripHTML(nps.petsDescription) : (petsAllowed ? 'Pets allowed' : 'No pets') });
    }
    const hasFees = nps.doFeesApply === 'true' || nps.doFeesApply === true;
    if (nps.feeDescription || nps.doFeesApply !== undefined) {
      npsInfoRows.push({ label: 'Fees', value: nps.feeDescription ? stripHTML(nps.feeDescription) : (hasFees ? 'Fees apply' : 'Free') });
    }
    const needsReservation = nps.isReservationRequired === 'true' || nps.isReservationRequired === true;
    if (nps.isReservationRequired !== undefined) {
      npsInfoRows.push({ label: 'Reservation', value: needsReservation ? 'Required' : 'Not required' });
    }
  }

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
          display: 'inline-block', padding: '2px 10px', background: `${C.goldenAmber}15`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.goldenAmber, marginBottom: 10,
        }}>{item.section}</span>
      )}

      <h3 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 400,
        color: C.darkInk, margin: '0 0 10px', lineHeight: 1.2,
      }}>{item.name}</h3>

      {item.featured && (
        <span style={{
          display: 'inline-block', padding: '2px 10px', border: `1px solid ${C.goldenAmber}40`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.goldenAmber, marginBottom: 14,
        }}>Lila Pick</span>
      )}

      {nps && (
        <>
          {npsPrimaryImage && (
            <div style={{ margin: '0 -20px 18px', position: 'relative' }}>
              <img src={npsPrimaryImage.url} alt={npsPrimaryImage.altText || item.name}
                style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
              {(npsPrimaryImage.caption || npsPrimaryImage.credit) && (
                <div style={{ padding: '6px 20px', fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400, color: '#7A857E', lineHeight: 1.5 }}>
                  {npsPrimaryImage.caption && <span>{npsPrimaryImage.caption}</span>}
                  {npsPrimaryImage.credit && (
                    <span style={{ fontStyle: 'italic' }}>{npsPrimaryImage.caption ? ' · ' : ''}Photo: {npsPrimaryImage.credit}</span>
                  )}
                </div>
              )}
              {npsImages.length > 1 && (
                <div style={{ display: 'flex', gap: 3, padding: '0 20px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {npsImages.slice(1, 5).map((img, i) => (
                    <img key={i} src={img.url} alt={img.altText || ''} style={{ width: 60, height: 42, objectFit: 'cover', opacity: 0.8 }} />
                  ))}
                </div>
              )}
            </div>
          )}

          <a href={nps.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 18,
            background: '#2D5F2B0D', border: '1px solid #2D5F2B18', textDecoration: 'none', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2D5F2B18'}
          onMouseLeave={e => e.currentTarget.style.background = '#2D5F2B0D'}>
            <NPSArrowhead size={20} color="#2D5F2B" />
            <div>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 500, color: '#2D5F2B', lineHeight: 1.5 }}>
                Trail information provided by the <strong>National Park Service</strong>
              </div>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2D5F2B', opacity: 0.6, marginTop: 2 }}>View on NPS.gov ↗</div>
            </div>
          </a>

          {(nps.longDescription || nps.shortDescription) && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2D5F2B', marginBottom: 8 }}>NPS Description</div>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: '#4A5650', lineHeight: 1.75, margin: 0 }}>{stripHTML(nps.longDescription || nps.shortDescription)}</p>
            </div>
          )}

          {npsInfoRows.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: 20, padding: '14px 0', borderTop: `1px solid ${C.stone}`, borderBottom: `1px solid ${C.stone}` }}>
              {npsInfoRows.map((row, i) => (
                <div key={i} style={row.label === 'Location' ? { gridColumn: '1 / -1' } : {}}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{row.value}</div>
                </div>
              ))}
            </div>
          )}

          {nps.accessibilityInformation && (() => {
            const html = nps.accessibilityInformation;
            const clean = (s) => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\xa0/g, ' ').replace(/<[^>]*>/g, '').trim();
            const liMatches = html.match(/<li>([\s\S]*?)<\/li>/gi);
            if (!liMatches || liMatches.length === 0) {
              const text = clean(html);
              if (!text) return null;
              return (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 8 }}>Accessibility</div>
                  <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: '#4A5650', lineHeight: 1.6, margin: 0 }}>{text}</p>
                </div>
              );
            }
            const rows = liMatches.map(li => {
              const inner = li.replace(/<\/?li>/gi, '');
              const boldMatch = inner.match(/<b>([\s\S]*?)<\/b>/);
              const label = boldMatch ? clean(boldMatch[1]).replace(/\s*\|\s*$/, '').trim() : '';
              const valueHtml = boldMatch ? inner.slice(inner.indexOf('</b>') + 4) : inner;
              const valueParts = valueHtml.split(/<b>\s*\|?\s*<\/b>|<b>\s*\|\s*<\/b>/).map(clean).filter(Boolean);
              const finalParts = [];
              for (const part of valueParts) {
                part.split(/\s+\|\s+/).forEach(p => { if (p.trim()) finalParts.push(p.trim()); });
              }
              return { label, values: finalParts };
            });
            const footnoteMatch = html.match(/<p>([\s\S]*?)<\/p>/i);
            const footnote = footnoteMatch ? clean(footnoteMatch[1]) : null;
            return (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 10 }}>Trail Accessibility</div>
                <div style={{ border: `1px solid ${C.stone}`, background: `${C.stone}18` }}>
                  {rows.map((row, i) => (
                    <div key={i} style={{ padding: '9px 14px', borderBottom: `1px solid ${C.stone}` }}>
                      {row.label && (<div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, color: C.darkInk, marginBottom: 3 }}>{row.label}</div>)}
                      {row.values.map((val, j) => (
                        <div key={j} style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: '#4A5650', lineHeight: 1.6 }}>{val}</div>
                      ))}
                    </div>
                  ))}
                  {footnote && (<div style={{ padding: '8px 14px', fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400, fontStyle: 'italic', color: '#7A857E', lineHeight: 1.5 }}>{footnote}</div>)}
                </div>
              </div>
            );
          })()}

          {(item.detail || item.note) && (
            <div style={{ padding: '14px 16px', marginBottom: 18, background: `${C.goldenAmber}08`, borderLeft: `3px solid ${C.goldenAmber}40` }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.goldenAmber, marginBottom: 8 }}>Our Take</div>
              {item.detail && (<p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: '#4A5650', lineHeight: 1.7, margin: '0 0 6px' }}>{item.detail}</p>)}
              {item.note && (<div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: C.oceanTeal }}>{item.note}</div>)}
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {item.tags.map((t, i) => (
                <span key={i} style={{ padding: '3px 10px', background: C.stone + '60', fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: '#7A857E' }}>{t}</span>
              ))}
            </div>
          )}
        </>
      )}

      {!nps && (
        <>
          {item.detail && (<p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: '#4A5650', lineHeight: 1.7, margin: '0 0 14px' }}>{item.detail}</p>)}
          {item.note && (<div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 600, color: C.oceanTeal, marginBottom: 14 }}>{item.note}</div>)}
          {item.tags && item.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {item.tags.map((t, i) => (
                <span key={i} style={{ padding: '3px 10px', background: C.stone + '60', fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: '#7A857E' }}>{t}</span>
              ))}
            </div>
          )}
        </>
      )}

      {item.url && !nps && (
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

function WildlifeEntry({ name, season, detail, isMobile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "16px 0", borderBottom: `1px solid ${C.stone}` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk }}>{name}</span>
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.goldenAmber }}>{season}</span>
      </div>
      <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.5vw, 14px)", fontWeight: 400, color: "#4A5650", lineHeight: 1.7, margin: 0 }}>{detail}</p>
    </div>
  );
}

function ParkPassport({ park, isMobile }) {
  return (
    <div style={{
      flex: "1", minWidth: isMobile ? "100%" : 0,
      border: `1px solid ${park.accent}60`,
      background: `${park.accent}06`,
      padding: isMobile ? "20px 18px" : "24px 22px",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: park.accent }}>
            Anchor Park
          </div>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 400, color: C.darkInk, lineHeight: 1.1, marginBottom: 8 }}>{park.name}</div>
        <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.6, fontStyle: "italic" }}>{park.soul}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", padding: "12px 0", borderTop: `1px solid ${C.stone}`, borderBottom: `1px solid ${C.stone}`, marginBottom: 14 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A857E", marginBottom: 2 }}>Established</div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk }}>{park.established}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A857E", marginBottom: 2 }}>Acreage</div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 600, color: C.darkInk }}>{park.acreage}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A857E", marginBottom: 2 }}>Elevation</div>
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 600, color: C.darkInk }}>{park.elevation}</div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {park.facts.map((fact, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: park.accent, opacity: 0.6, marginTop: 6, flexShrink: 0 }} />
            <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: "#4A5650", lineHeight: 1.6 }}>{fact}</span>
          </div>
        ))}
      </div>
      <a href={park.npsUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 16, fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: park.accent, textDecoration: "none" }}>
        NPS Page ↗
      </a>
    </div>
  );
}


// ─── Email Capture ────────────────────────────────────────────────────────────

function TimingAlertCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <FadeIn>
      <div style={{ padding: "28px 24px", background: `${C.goldenAmber}08`, border: `1px solid ${C.goldenAmber}30`, textAlign: "center", margin: "8px 0" }}>
        {submitted ? (
          <>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 8 }}>You're on the list</div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: "#4A5650", lineHeight: 1.6 }}>We'll let you know when the desert comes alive.</div>
          </>
        ) : (
          <>
            <SectionIcon type="windows" />
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400, color: C.darkInk, marginBottom: 6 }}>Get Joshua Tree timing alerts</div>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: "#4A5650", lineHeight: 1.6, maxWidth: 420, margin: "0 auto 20px" }}>We track dark sky windows, wildflower blooms, and meteor showers — and let you know when it's time to go.</p>
            <div style={{ display: "flex", gap: 8, maxWidth: 380, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: "1 1 200px", padding: "10px 16px", border: `1px solid ${C.stone}`, background: "#fff", fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: C.darkInk, outline: "none" }} />
              <button onClick={() => { if (email) setSubmitted(true); }} style={{ padding: "10px 20px", background: C.goldenAmber, border: "none", color: "#fff", fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", transition: "opacity 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>Notify Me</button>
            </div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400, color: "#7A857E", marginTop: 10, letterSpacing: "0.04em" }}>No spam. Just timing.</div>
          </>
        )}
      </div>
    </FadeIn>
  );
}


// ─── Guide Section Navigation (sticky anchor bar) ───────────────────────────

const GUIDE_SECTIONS = [
  { id: "sense-of-place", label: "The Place" },
  { id: "when-to-go",     label: "When to Go" },
  { id: "trails",         label: "Sacred Terrain" },
  { id: "dark-sky",       label: "Dark Sky" },
  { id: "wellness",       label: "Living Practice" },
  { id: "food-culture",   label: "Nourish" },
  { id: "discover",       label: "Discover" },
  { id: "where-to-stay",  label: "Unique Stays" },
  { id: "give-back",      label: "Give Back" },
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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setIsSticky(!entry.isIntersecting), { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isMobile && activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = activeItemRef.current;
      const offset = item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  }, [activeId, isMobile]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !isMobile) { setCanScrollRight(false); return; }
    const check = () => { const gap = container.scrollWidth - container.scrollLeft - container.clientWidth; setCanScrollRight(gap > 4); };
    check();
    container.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { container.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
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
      <div ref={sentinelRef} style={{ height: 1, width: "100%", pointerEvents: "none" }} />
      <nav ref={navRef} style={{
        position: (isSticky && !isMobile) ? "fixed" : "relative",
        top: (isSticky && !isMobile) ? MAIN_NAV_HEIGHT : "auto",
        left: 0, right: 0, zIndex: 90,
        background: (isSticky && !isMobile) ? "rgba(250, 247, 243, 0.97)" : C.cream,
        backdropFilter: (isSticky && !isMobile) ? "blur(12px)" : "none",
        WebkitBackdropFilter: (isSticky && !isMobile) ? "blur(12px)" : "none",
        borderBottom: `1px solid ${(isSticky && !isMobile) ? C.stone : "transparent"}`,
        transition: "border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
        boxShadow: (isSticky && !isMobile) ? "0 1px 8px rgba(0,0,0,0.04)" : "none",
      }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: isMobile ? "0 16px" : "0 52px", display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <div ref={scrollContainerRef} className="guide-nav-scroll" style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 0, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}>
            <style>{`.guide-nav-scroll::-webkit-scrollbar { display: none; }`}</style>
            {GUIDE_SECTIONS.map((section) => {
              const isActive = activeId === section.id;
              return (
                <button key={section.id} ref={isActive ? activeItemRef : null} onClick={() => handleClick(section.id)} className="guide-nav-scroll" style={{
                  padding: isMobile ? "16px 14px" : "20px 18px", background: "none", border: "none",
                  borderBottom: `2px solid ${isActive ? C.goldenAmber : "transparent"}`,
                  cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: 12,
                  fontWeight: isActive ? 700 : 600, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: isActive ? C.goldenAmber : "#7A857E", whiteSpace: "nowrap", flexShrink: 0,
                  transition: "color 0.25s ease, border-color 0.25s ease", position: "relative",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = C.darkInk; e.currentTarget.style.borderBottomColor = C.stone; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#7A857E"; e.currentTarget.style.borderBottomColor = "transparent"; } }}
                >
                  {section.label}
                  <span style={{ display: "inline-block", marginLeft: 4, fontSize: 9, opacity: isActive ? 1 : 0.5, transition: "opacity 0.25s" }}>{"↓"}</span>
                </button>
              );
            })}
            </div>
            {isMobile && canScrollRight && (
              <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 40, background: `linear-gradient(to right, transparent, ${isSticky ? "rgba(250,247,243,0.97)" : C.cream})`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 4, pointerEvents: "none", transition: "opacity 0.3s" }}>
                <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: "#7A857E" }}>{"›"}</span>
              </div>
            )}
          </div>
        </div>
      </nav>
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
    getCelestialSnapshot("joshuaTree")
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
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.goldenAmber, animation: "celestialPulse 2s ease-in-out infinite", flexShrink: 0 }} />
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", flexShrink: 0 }}>
          Joshua Tree Right Now
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
                <div style={{ ...VAL_STYLE, color: C.goldenAmber }}>{sun.daylight}</div>
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
                <div style={{ ...VAL_STYLE, color: C.goldenAmber }}>{sky.label}</div>
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

export default function JoshuaTreeGuide() {
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

  // ── NPS Data ──
  const [npsLookup, setNpsLookup] = useState(null);
  useEffect(() => {
    getNPSData(['jotr'])
      .then(data => {
        setNpsLookup(buildNPSLookup(data.thingsToDo));
      })
      .catch(() => {});
  }, []);

  const openSheet = (section) => (item) => {
    const npsMatch = npsLookup ? findNPSMatch(item.name, npsLookup) : null;
    setActiveSheet({ ...item, section, nps: npsMatch || undefined });
  };
  const checkNPS = useCallback((name) => npsLookup ? !!findNPSMatch(name, npsLookup) : false, [npsLookup]);

  const PARK_DATA = {
    name: "Joshua Tree",
    full: "Joshua Tree National Park",
    soul: "The silence here has weight.",
    established: 1994,
    acreage: "795,156",
    elevation: "536 – 5,814 ft",
    npsUrl: "https://www.nps.gov/jotr/",
    facts: [
      "Sits at the convergence of the Mojave and Colorado Deserts",
      "Certified International Dark Sky Park — Bortle Class 2–3",
      "Over 8,000 climbing routes on 400+ formations",
      "Home to the Serrano and Cahuilla peoples for thousands of years",
    ],
    accent: C.goldenAmber,
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
              { label: "Joshua Tree" },
            ]} />

            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 28 : 52, alignItems: "start",
              marginTop: 28,
            }}>

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow" style={{ color: C.goldenAmber, marginBottom: 14, display: "block" }}>Destination Guide</span>

                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 300,
                  color: C.darkInk, lineHeight: 1.0,
                  margin: "0 0 22px", letterSpacing: "-0.02em",
                }}>
                  Joshua Tree
                </h1>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: "0 0 14px",
                }}>
                  Joshua Tree sits at the convergence of two deserts — the Mojave and the Colorado — and that collision is part of what makes it singular. The high desert is cool and boulder-studded. The silence here has weight.
                </p>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: 0,
                }}>
                  This is a place for people who want to feel small in the best possible way. We built this guide to help you find it.
                </p>
              </div>

              {/* ── Right: This Guide Covers ── */}
              <div style={isMobile ? { borderTop: `1px solid ${C.stone}`, paddingTop: 28 } : { borderLeft: `1px solid ${C.stone}`, paddingLeft: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A857E", marginBottom: 18 }}>This guide covers</div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 10 }}>Park</div>
                  <a href="https://www.nps.gov/jotr/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7, textDecoration: "none" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.seaGlass, opacity: 0.5 }} />
                    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", color: C.darkInk }}>Joshua Tree National Park</span>
                  </a>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 10 }}>Orbit Towns</div>
                  {["Joshua Tree town", "Twentynine Palms", "Pioneertown", "Palm Springs"].map((town, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.goldenAmber, opacity: 0.5 }} />
                      <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", color: C.darkInk }}>{town}</span>
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
            { src: P.joshuaTreeDawn,     alt: "Joshua Tree at dawn",            caption: "First light in the high desert",     width: 420 },
            { src: P.joshuaTreeCholla,    alt: "Cholla Cactus Garden",           caption: "Cholla Cactus Garden at golden hour", width: 280 },
            { src: P.joshuaTreeBoulders,  alt: "Joshua Tree boulder formations", caption: "Jumbo Rocks — ancient granite",       width: 420 },
            { src: P.joshuaTreeNightSky,  alt: "Night sky over Joshua Tree",     caption: "Bortle Class 2 darkness",            width: 360 },
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
          {/* THE PLACE                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="sense-of-place" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionLabel>The Place</SectionLabel>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 16px",
              }}>
                {"Joshua Tree sits at the convergence of two deserts — the Mojave and the Colorado — and that collision is part of what makes it singular. The high desert is cool and boulder-studded, carpeted in the alien silhouettes of Yucca brevifolia. Drop below the transition zone into the Colorado Desert and the landscape shifts: more open, more stark, warmer. The park covers 800,000 acres. Most visitors see a fraction of it."}
              </p>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 28px",
              }}>
                {"The surrounding communities each add a distinct layer. The town of Joshua Tree is small, arty, and increasingly a destination in itself. Twentynine Palms is the working town with the quietest skies. Pioneertown was built as a movie set in 1946 and never entirely stopped performing. Palm Springs is 45 minutes south: mid-century architecture, serious spas, a counterpoint when you want polished comfort after days in the dust."}
              </p>
            </FadeIn>

            {/* ── Park Passport ── */}
            <FadeIn delay={0.06}>
              <ParkPassport park={PARK_DATA} isMobile={isMobile} />
            </FadeIn>

            {/* ── Wildlife Section ── */}
            <FadeIn delay={0.1}>
              <div style={{ border: `1px solid ${C.stone}`, background: C.cream, marginTop: 28, padding: isMobile ? "18px" : "22px" }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 8 }}>Desert Wildlife</div>
                <WildlifeEntry isMobile={isMobile} name="Desert Bighorn Sheep" season="Year-round" detail="Most visible at dawn and dusk near water sources. Barker Dam and Lost Palms Oasis are reliable sighting zones." />
                <WildlifeEntry isMobile={isMobile} name="Desert Tortoise" season="Spring – Fall" detail="Threatened species — do not approach or handle if encountered. Most active in spring after rain. Found in the Colorado Desert section." />
                <WildlifeEntry isMobile={isMobile} name="Coyote" season="Year-round" detail="Listen for them at dusk. Their calls across the open desert are part of the sound of this place." />
                <WildlifeEntry isMobile={isMobile} name="Roadrunner" season="Year-round" detail="Fast, curious, and frequently spotted along park roads and at campground edges." />
                <WildlifeEntry isMobile={isMobile} name="Sidewinder Rattlesnake" season="Warm months" detail="Watch where you step and reach, especially in rocky areas. They're shy but present." />
              </div>
            </FadeIn>

            {/* ── Quick Stats Bar ── */}
            <FadeIn delay={0.12}>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: isMobile ? 12 : 16, padding: isMobile ? 16 : 20,
                background: C.cream, border: `1px solid ${C.stone}`, marginTop: 24,
              }}>
                {[
                  { l: "Recommended", v: "3–5 days" },
                  { l: "Nearest Airport", v: "Palm Springs (PSP)" },
                  { l: "Drive from PSP", v: "~45 minutes" },
                  { l: "Best Times", v: "Mar–May, Oct–Nov" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 3 }}>{s.l}</div>
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
              <SectionSub isMobile={isMobile}>The desert transforms with the seasons. These are the moments when the land is most alive.</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Spring Wildflower Bloom" featured
                  detail="After wet winters, the desert erupts in color — poppies, lupine, desert lilies. Intensity varies year to year. When it happens, it's unforgettable."
                  tags={["Late Feb – Apr", "Weather-Dependent", "Magic Window"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Autumn Light"
                  detail="Second-best window. Crowds thinner than spring. The color is subtle but the light is extraordinary — amber and pink at golden hour."
                  tags={["Oct – Nov", "Golden Light", "Fewer Crowds"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Dark Sky Season" featured
                  detail="Winter's long nights and dry, stable air create the park's best stargazing conditions. The winter solstice provides the longest dark window of the year."
                  tags={["Nov – Feb", "Milky Way", "Geminids"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Perseid Meteor Shower"
                  detail="Mid-August. Up to 100 meteors per hour at peak. Best viewed from the backcountry or Pinto Basin Road pullouts after midnight."
                  tags={["Aug 12–13 Peak", "Night Sky", "Summer"]} />
              </div>
            </FadeIn>

            <TimingAlertCapture />
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SACRED TERRAIN                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="trails" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="move" />
              <SectionLabel>Sacred Terrain</SectionLabel>
              <SectionTitle>{"Hikes, trails & landscape"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From easy desert loops to world-class climbing. The terrain teaches you something new at every turn."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="trails & adventures">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Barker Dam Loop" featured
                  hasNPS={checkNPS("Barker Dam")}
                  url="https://www.nps.gov/jotr/planyourvisit/barkerdam.htm"
                  detail="A former ranching dam reflecting sky and cliff. Rock art on the canyon walls. Bighorn sheep territory at dawn and dusk."
                  tags={["1.3 mi", "Easy", "Rock Art", "Bighorn Sheep"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Ryan Mountain" featured
                  hasNPS={checkNPS("Ryan Mountain")}
                  url="https://www.nps.gov/jotr/planyourvisit/ryanmountain.htm"
                  detail="The best panoramic summit in the park. Views of both desert systems, the Little San Bernardino Mountains, and on clear days, the Salton Sea. Sunrise from here is transformative."
                  tags={["3 mi RT", "Moderate", "1,050 ft gain", "Sunrise"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Hidden Valley Trail"
                  hasNPS={checkNPS("Hidden Valley")}
                  url="https://www.nps.gov/jotr/planyourvisit/hiddenvalley.htm"
                  detail="Enclosed by massive boulder formations — the valley floor feels like a secret the desert kept. A legendary bouldering area."
                  tags={["1 mi Loop", "Easy", "Bouldering"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Cholla Cactus Garden" featured
                  hasNPS={checkNPS("Cholla Cactus Garden")}
                  url="https://www.nps.gov/jotr/planyourvisit/chollacactusgarden.htm"
                  detail="Walking through cholla forest at golden hour is one of the park's most otherworldly experiences. Do not touch."
                  tags={["0.25 mi", "Flat", "Golden Hour", "Photography"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Skull Rock Nature Trail"
                  hasNPS={checkNPS("Skull Rock")}
                  url="https://www.nps.gov/jotr/planyourvisit/skull-rock.htm"
                  detail="The signature rock formation, but the trail earns its length — good for tuning in to desert micro-ecosystems."
                  tags={["1.7 mi", "Easy", "Iconic"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Lost Palms Oasis" featured
                  hasNPS={checkNPS("Lost Palms Oasis")}
                  url="https://www.nps.gov/jotr/planyourvisit/lostpalms.htm"
                  detail="The park's largest fan palm oasis, deep in the Colorado Desert. Bighorn sheep, a genuine sense of wilderness. Carry more water than you think you need."
                  tags={["7.5 mi RT", "Moderate–Strenuous", "Oasis", "Wilderness"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Keys View"
                  hasNPS={checkNPS("Keys View")}
                  url="https://www.nps.gov/jotr/planyourvisit/keys-view.htm"
                  detail="Drive-up overlook. Views of the Coachella Valley, the San Andreas Fault, and the Salton Sea. Best in morning before haze builds."
                  tags={["Drive-Up", "Overlook", "San Andreas Fault"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Fortynine Palms Oasis"
                  hasNPS={checkNPS("Fortynine Palms Oasis")}
                  url="https://www.nps.gov/jotr/planyourvisit/fortyninepalms.htm"
                  detail="A surprise: a lush palm oasis tucked into otherwise arid hills. The contrast is visceral."
                  tags={["3 mi RT", "Moderate", "Oasis"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Mastodon Peak Loop"
                  hasNPS={checkNPS("Mastodon Peak")}
                  url="https://www.nps.gov/jotr/planyourvisit/mastodonpeak.htm"
                  detail="Gold mine ruins, Cottonwood Spring oasis, bighorn territory. A layered walk."
                  tags={["2.9 mi", "Moderate", "Ruins", "Oasis"]} />
              </ExpandableList>
            </FadeIn>

            {/* ── Bouldering & Climbing ── */}
            <FadeIn delay={0.12}>
              <div style={{ marginTop: 36 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 16 }}>Bouldering & Climbing</div>
                <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.5vw, 14px)", fontWeight: 400, color: "#4A5650", lineHeight: 1.7, margin: "0 0 16px" }}>
                  Joshua Tree is one of the world's great trad climbing destinations — over 8,000 established routes on 400+ formations. The rock is monzogranite, coarse-textured and grippy. For non-climbers, watching skilled climbers work the boulders is its own kind of meditation.
                </p>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Climbing')} name="Intersection Rock"
                  detail="The social hub. All levels. Walk-ups visible from the road." tags={["All Levels", "Social", "Accessible"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Climbing')} name="Dome Rock"
                  detail="Towering. Impressive even to watch." tags={["Advanced", "Trad", "Impressive"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Climbing')} name="Jumbo Rocks Area"
                  detail="Accessible bouldering with iconic formations. Adjacent to the campground." tags={["Bouldering", "All Levels", "Iconic"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Climbing')} name="Joshua Tree Rock Climbing School"
                  detail="Established since 1988. Half and full-day instruction for all levels."
                  tags={["Instruction", "Half/Full Day", "Since 1988"]} />
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* DARK SKY                                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
        </div>
      </section>

      {/* Dark Sky section with full-width dark background */}
      <section id="dark-sky" style={{ padding: isMobile ? "52px 20px" : "64px 52px", background: C.darkInk }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <FadeIn>
            <SectionIcon type="darksky" />
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 12, textAlign: "center" }}>Dark Sky</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 400, color: "#fff", margin: "0 0 6px", lineHeight: 1.2, textAlign: "center" }}>The night sky here is extraordinary</h2>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: isMobile ? 15 : "clamp(14px, 1.8vw, 15px)", fontWeight: 400, color: "rgba(255,255,255,0.7)", margin: "0 auto 28px", lineHeight: 1.7, textAlign: isMobile ? "left" : "center", maxWidth: isMobile ? "100%" : 520 }}>
              Joshua Tree is a certified International Dark Sky Park. Bortle Class 2 conditions in the backcountry — among the darkest accessible skies in Southern California.
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            {/* Best Viewing Areas */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 16 }}>Best Viewing Areas</div>
              {[
                { name: "Cholla Cactus Garden parking area", note: "Colorado Desert — minimal tree obstruction. Silhouetted cactus against the Milky Way." },
                { name: "Jumbo Rocks Campground", note: "High desert, open sky. Dark sky conditions excellent from your campsite." },
                { name: "Pinto Basin Road pullouts", note: "The least-trafficked corridor. Darkest skies accessible by car." },
                { name: "Cap Rock area", note: "Open sky, easy access. Good for meteor shower viewing." },
              ].map((area, i) => (
                <div key={i} style={{ padding: "14px 0", borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{area.name}</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{area.note}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {/* Calendar Anchors */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 16 }}>Calendar Anchors</div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                {[
                  { event: "New Moon Windows", timing: "Monthly", detail: "Plan around them for optimal stargazing" },
                  { event: "Perseid Meteor Shower", timing: "Aug 12–13 peak", detail: "Up to 100 meteors/hour" },
                  { event: "Geminid Meteor Shower", timing: "Dec 13–14 peak", detail: "Often the year's best — up to 150/hour" },
                  { event: "Milky Way Core", timing: "May – August", detail: "Best overhead viewing after midnight" },
                ].map((cal, i) => (
                  <div key={i} style={{ padding: "14px 16px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{cal.event}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 4 }}>{cal.timing}</div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>{cal.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            {/* Practical Notes */}
            <div style={{ padding: "16px 18px", border: `1px solid rgba(255,255,255,0.12)`, background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 10 }}>Practical Notes</div>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                Allow 20–30 minutes for eyes to fully dark-adapt. Use a red-lens headlamp — white light ruins night vision for everyone nearby. Download a stargazing app (Sky Guide, Stellarium) before entering the park — there's no cell service. Pair dark sky sessions with Cholla Cactus Garden for the surreal combination of silhouetted cactus against the Milky Way.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Continue guide content */}
      <section style={{ padding: isMobile ? "0 20px 60px" : "0 52px 80px", background: C.cream }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* LIVING PRACTICE                                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="wellness" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="breathe" />
              <SectionLabel>Living Practice</SectionLabel>
              <SectionTitle>{"Yoga, breathwork & wellness"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"The desert climate itself is the elemental encounter here — daytime heat, night cold, low humidity. The elemental contrast is between day and night, sun and shade."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="wellness options">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Integratron Sound Bath" featured
                  url="https://www.integratron.com/"
                  detail="A one-of-a-kind acoustic sound bath inside a resonant wood dome built in the 1950s by George Van Tassel. Rooted in fringe science but the experience is genuinely resonant. Bookings fill quickly — reserve well ahead."
                  note="Landers, ~25 min north — book well ahead"
                  tags={["Sound Bath", "Acoustic Dome", "Unique", "Reserve Early"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Joshua Tree Retreat Center" featured
                  url="https://www.jtrcc.org/"
                  detail="Long-established retreat venue with meditation halls, healing arts practitioners, and residential programs. About 2 miles from the park's west entrance."
                  tags={["Retreat", "Meditation", "Healing Arts", "Residential"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Two Bunch Palms Hot Springs" featured
                  url="https://www.twobunchpalms.com/"
                  detail="Historic mineral hot springs spa fed by a natural geothermal aquifer. Grotto pools, couples treatments, serious relaxation. The counterpoint to a strenuous park day."
                  note="Desert Hot Springs, ~45 min"
                  tags={["Hot Springs", "Spa", "Grotto", "Historic"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Bhakti Yoga Shala"
                  url="https://www.bhaktiyogashala.com/"
                  detail="One of the Coachella Valley's most respected studios. Consistent instruction, strong community."
                  note="Palm Springs, ~45 min"
                  tags={["Yoga Studio", "Palm Springs", "Community"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Miracle Springs Resort"
                  url="https://www.miraclesprings.com/"
                  detail="More affordable than Two Bunch. Eight mineral pools ranging from warm to hot. Good for a long afternoon soak."
                  tags={["Mineral Pools", "Affordable", "Desert Hot Springs"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Sunrise Yoga at Ryan Mountain Trailhead"
                  detail="Before the hike. The early desert light — rose, amber, then white — provides natural rhythm for a sun salutation sequence. Bring your own mat."
                  tags={["Free", "Self-Guided", "Sunrise", "Solo"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Desert Silence as Practice"
                  detail="The high desert has measurable acoustic quiet. 29 Palms backcountry and the Wonderland of Rocks both offer conditions where ambient sound drops to near-zero. For breath-centered practice, there are few better natural environments."
                  tags={["Free", "Meditation", "Solitude", "Self-Guided"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* NOURISH                                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="food-culture" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Nourish</SectionLabel>
              <SectionTitle>Where to eat</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From the desert's most celebrated kitchen to roadhouse BBQ and pre-hike espresso."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={6} label="places to eat">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="La Copine" featured
                  url="https://www.lacopinekitchen.com/"
                  detail="The destination restaurant. A converted house in the high desert, farm-sourced, frequently changing menu. Written about in every major food publication. Reservations essential — book weeks ahead."
                  note="Joshua Tree town — reservations essential"
                  tags={["Brunch", "Lunch", "Farm-Sourced", "$$$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name={"Pappy & Harriet's"} featured
                  url="https://www.pappyandharriets.com/"
                  detail="Legendary roadhouse — part BBQ joint, part honky-tonk, part live music venue. Red-checkered tablecloths, mesquite-smoked meats, artists playing on a stage built into an old movie set. Don't miss it."
                  note="Pioneertown — check the music calendar"
                  tags={["BBQ", "Live Music", "Iconic", "$$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Crossroads Cafe"
                  detail="The local gathering spot. Good coffee, eggs, benedicts, fresh-squeezed juice. The community bulletin board tells you more about the town than any guidebook."
                  tags={["Breakfast", "Lunch", "Community", "$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="29 Palms Inn Restaurant"
                  url="https://29palmsinn.com/"
                  detail="On the grounds of the historic inn near the north entrance. Farm-to-table, uses their own garden produce. Sit outside if weather permits."
                  tags={["Breakfast", "Dinner", "Farm-to-Table", "$$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Natural Sisters Cafe"
                  detail="Vegetarian and vegan-friendly. Smoothies, bowls, wraps. A reliable healthy option near the west entrance."
                  tags={["Vegetarian", "Vegan", "Smoothies", "$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Workshop Kitchen + Bar"
                  url="https://www.workshoppalmsprings.com/"
                  detail="Downtown Palm Springs, design-forward, farm-to-table. The kind of restaurant that rewards a nicer dinner out."
                  note="Palm Springs orbit"
                  tags={["Dinner", "Farm-to-Table", "Palm Springs", "$$$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Pie for the People"
                  detail="Pizza by the slice, unpretentious, good. A late-afternoon hiker staple."
                  tags={["Pizza", "Casual", "$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Joshua Tree Coffee Company"
                  detail="The pre-hike stop. Good espresso, pastries from local bakers. Community hub."
                  tags={["Coffee", "Pastries", "Pre-Hike", "$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Cheeky's"
                  detail="Weekend brunch institution in Palm Springs. Seasonal, rotating menu, long waits. Worth it."
                  tags={["Brunch", "Palm Springs", "$$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food')} name="Joshua Tree Health Foods"
                  detail="Small grocery near the west entrance. Good for stocking up on real food before heading into the park."
                  tags={["Market", "Provisions", "Natural", "$"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* DISCOVER                                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="discover" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="discover" />
              <SectionLabel>Discover</SectionLabel>
              <SectionTitle>{"Art, architecture & music"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"The desert has drawn artists, architects, and musicians for decades. These are the places where that creative energy is most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="cultural experiences">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Pioneertown" featured
                  detail="The whole town is an artifact. Built as a movie set in 1946, it never entirely stopped performing. Walk Mane Street — the original set thoroughfare. Surreal and atmospheric."
                  tags={["Movie Set", "Historic", "Free"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="High Desert Test Sites" featured
                  url="https://www.highdeserttestsites.com/"
                  detail="An ongoing art initiative founded in 2002 by Andrea Zittel. Site-specific works scattered across the high desert landscape. HDTS has seeded a generation of artists coming to the desert to make work."
                  tags={["Site-Specific Art", "Contemporary", "Free"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Palm Springs Art Museum"
                  url="https://www.psmuseum.org/"
                  detail="World-class collection with strong desert Southwest emphasis. Architecture, photography, and modern art all represented. The building itself is striking."
                  note="Palm Springs orbit"
                  tags={["Museum", "Modern Art", "Architecture", "$$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Modernism Week" featured
                  url="https://www.modernismweek.com/"
                  detail="The largest celebration of mid-century modern architecture and design in the world. Home tours, lectures, parties. Mid-to-late February."
                  note="Palm Springs — February"
                  tags={["Architecture", "Mid-Century", "February", "$–$$$"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name={"Pappy & Harriet's Live Music"} featured
                  url="https://www.pappyandharriets.com/"
                  detail="The essential live music destination in this entire orbit. Touring artists of serious caliber play here regularly — past performers include Paul McCartney, Robert Plant, Arctic Monkeys."
                  tags={["Live Music", "Pioneertown", "Year-Round"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Art Queen"
                  detail="Gallery and art supply in Joshua Tree town. A hub of the local creative community. Rotating exhibitions."
                  tags={["Gallery", "Art Supply", "Local"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Coyote Corner"
                  detail="The landmark local gift shop. Rocks, crystals, desert goods, maps, information. A genuine local institution."
                  tags={["Gift Shop", "Crystals", "Institution"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Twentynine Palms Art Gallery"
                  detail="Rotating shows featuring work by local and regional desert artists. Run by a nonprofit since 1944."
                  tags={["Gallery", "Nonprofit", "Since 1944"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* UNIQUE STAYS                                                  */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="where-to-stay" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="stay" />
              <SectionLabel>Unique Stays</SectionLabel>
              <SectionTitle>Where to sleep</SectionTitle>
              <SectionSub isMobile={isMobile}>How you inhabit a place matters. Options across the full spectrum — from sleeping under the stars to Palm Springs luxury.</SectionSub>
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
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Skylight Joshua Tree" location="Twentynine Palms" featured
                  url="https://www.skylightjt.com/"
                  detail="Intentionally designed desert cabins and domes near the park's north edge. Stargazing-optimized. Off-grid feel with considered design."
                  tags={["Cabins", "Domes", "Stargazing", "Design"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Jumbo Rocks Campground" location="Inside the park"
                  detail="124 sites set among massive boulder formations. The most immersive camping in the park. Dark sky conditions excellent. First-come, first-served."
                  tags={["Camping", "Boulders", "Dark Sky", "FCFS"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="elemental" name="Hicksville Trailer Palace" location="Joshua Tree town"
                  url="https://www.hicksville.com/"
                  detail="Vintage trailers on a small ranch. Each themed and designed. Playful, adult, deeply Joshua Tree in spirit. Hot tub, pool, fire pit."
                  tags={["Vintage Trailers", "Pool", "Hot Tub", "Quirky"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="29 Palms Inn" location="Twentynine Palms" featured
                  url="https://29palmsinn.com/"
                  detail="Historic oasis property since 1928. Adobe bungalows around a natural pool fed by underground spring. Gardens, resident animals, a genuinely timeless quality."
                  tags={["Historic", "Oasis", "Gardens", "Since 1928"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Sacred Sands" location="Joshua Tree town"
                  url="https://www.sacredsands.com/"
                  detail="Boutique B&B — two rooms only. Thoughtfully appointed, meditation garden, personal attention, 360-degree desert views."
                  tags={["B&B", "Two Rooms", "Meditation Garden"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="rooted" name="Pioneertown Motel" location="Pioneertown"
                  url="https://www.pioneertownmotel.com/"
                  detail="Basic but atmospheric. The only place to sleep in Pioneertown itself. Walking distance to Pappy's."
                  tags={["Motel", "Atmospheric", "Pappy's Access"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name="Two Bunch Palms" location="Desert Hot Springs" featured
                  url="https://www.twobunchpalms.com/"
                  detail="Historic mineral hot springs spa. Grotto, thermal pools, healing arts. A true decompression experience."
                  tags={["Hot Springs", "Spa", "Grotto", "Historic"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name="Parker Palm Springs" location="Palm Springs" featured
                  url="https://www.parkerpalmsprings.com/"
                  detail="Jonathan Adler-designed, 13 acres. The most design-forward major property in the valley. Pool culture, strong restaurant (Norma's), unhurried pace."
                  tags={["Design", "13 Acres", "Pool Culture", "Norma's"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name="L'Horizon Resort" location="Palm Springs"
                  url="https://www.lhorizonpalmsprings.com/"
                  detail="William Cody, 1952. Mid-century masterpiece, small pool-centric property. Intimate and refined."
                  tags={["Mid-Century", "Pool", "Intimate"]} />
                <StayItem isMobile={isMobile} onOpenSheet={setActiveSheet} tier="premium" name="Arrive Palm Springs" location="Palm Springs"
                  url="https://www.arrivehotels.com/palm-springs"
                  detail="Smaller, hipper, more affordable entry point to the PS hotel scene. Good bar, good location."
                  tags={["Boutique", "Bar", "Accessible Luxury"]} />
              </ExpandableList>
            </div>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* GIVE BACK                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="give-back" style={{ padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="giveback" />
              <SectionLabel>Give Back</SectionLabel>
              <SectionTitle>{"Cultural heritage & stewardship"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"Honor the land and the people who have called it home for thousands of years."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Give Back')} name="Serrano & Cahuilla Nations" featured
                  detail="The land that is now Joshua Tree National Park has been home to the Serrano and Cahuilla peoples for thousands of years. Petroglyphs, bedrock mortars, and plant use sites throughout the park attest to sustained presence. The Oasis of Mara was a Serrano gathering place."
                  tags={["Indigenous Heritage", "Cultural", "Serrano", "Cahuilla"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Give Back')} name="Twentynine Palms Band of Mission Indians"
                  detail="The native Serrano community with federally recognized status. Their website and cultural programs offer context for understanding this land."
                  tags={["Indigenous", "Serrano", "Cultural Programs"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Give Back')} name="Desert Institute at Joshua Tree" featured
                  url="https://www.joshuatree.org/"
                  detail="Field institute offering educational programs, natural history classes, night sky programs, and guided experiences inside the park. Proceeds support the park."
                  tags={["Educational", "Night Sky", "Nonprofit"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Give Back')} name="Joshua Tree National Park Association" featured
                  url="https://www.joshuatree.org/"
                  detail="The park's official nonprofit partner. Supports conservation, education, and volunteer programs. Volunteer opportunities available for trail maintenance and restoration."
                  note="joshuatree.org"
                  tags={["Conservation", "Volunteer", "Nonprofit"]} />
              </div>
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
              <SectionTitle>Tuned to Cosmic Rhythms</SectionTitle>
              <SectionSub isMobile={isMobile}>Small group trips timed to natural crescendos. Expert guides, meaningful connection, transformative terrain. Eight travelers maximum.</SectionSub>
            </FadeIn>

            {(() => {
              const jtTrips = getTripsByDestination("Joshua Tree");
              return jtTrips.length > 0 ? (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : (jtTrips.length > 1 ? "repeat(2, 1fr)" : "1fr"),
                  gap: 24,
                  maxWidth: jtTrips.length === 1 ? 400 : "100%",
                }}>
                  {jtTrips.map((trip, i) => (
                    <FadeIn key={trip.slug} delay={0.08 + i * 0.06}>
                      <TripCard trip={trip} />
                    </FadeIn>
                  ))}
                </div>
              ) : null;
            })()}

            <FadeIn delay={0.2}>
              <div style={{ padding: "20px 24px", border: `1px solid ${C.stone}`, textAlign: "center", marginTop: 16 }}>
                <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: "#4A5650", lineHeight: 1.6, margin: "0 0 16px" }}>See all upcoming group trips across every destination.</p>
                <Link to="/group-trips" style={{
                  padding: "10px 24px", background: "transparent",
                  border: `1.5px solid ${C.goldenAmber}`, color: C.goldenAmber,
                  fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none",
                  transition: "all 0.25s", display: "inline-block",
                }}
                onClick={() => trackEvent('guide_cta_clicked', { action: 'view_group_trips', destination: 'joshua-tree' })}
                onMouseEnter={e => { e.currentTarget.style.background = C.goldenAmber; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.goldenAmber; }}
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
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.goldenAmber, display: "block", marginBottom: 16 }}>Begin</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300, color: C.darkInk, margin: "0 0 10px", lineHeight: 1.2 }}>Your desert trip starts here</h3>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400, color: "#4A5650", maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.65 }}>
                Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you.
              </p>
              <Link to="/plan" style={{
                padding: "14px 36px", border: "none",
                background: C.darkInk, color: "#fff",
                textAlign: "center", display: "inline-block",
                fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                cursor: "pointer", transition: "opacity 0.2s", textDecoration: "none",
              }}
              onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'joshua-tree' })}
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
                  { name: "Olympic Peninsula", slug: "olympic-peninsula", accent: C.skyBlue },
                  { name: "Big Sur", slug: "big-sur", accent: C.seaGlass },
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
      <Footer />
    </>
  );
}
