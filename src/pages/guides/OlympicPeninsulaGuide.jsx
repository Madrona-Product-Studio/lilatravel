// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: OLYMPIC PENINSULA GUIDE (dedicated)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Full editorial guide for Olympic Peninsula — three parks in one. Uses shared
// Nav/Footer/FadeIn from the Lila Trips component library, with guide-specific
// components defined locally (ListItem, StayItem, ExpandableList).
//
// Route: /destinations/olympic-peninsula
//

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { getNPSData, buildNPSLookup, findNPSMatch } from '@services/npsService';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/olympic-peninsula.json';
import restaurants from '../../data/restaurants/olympic-peninsula.json';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';


// ─── Guide-Specific Components ───────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Quicksand', sans-serif",
      fontSize: 12, fontWeight: 700,
      letterSpacing: "0.28em", textTransform: "uppercase",
      color: C.skyBlue, marginBottom: 12,
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
          stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
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
          stroke={C.skyBlue} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
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
        <path d="M4 14 L14 5 L24 14" stroke={C.skyBlue} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 13 L7 23 L21 23 L21 13" stroke={C.skyBlue} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    windows: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="2" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
        <line x1="14" y1="4" x2="14" y2="24" stroke={C.skyBlue} strokeWidth="1.5" />
        <line x1="4" y1="14" x2="24" y2="14" stroke={C.skyBlue} strokeWidth="1.5" />
      </svg>
    ),
    threshold: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
          stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    plan: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
        <path d="M11 17 L13 13 L17 11 L15 15 Z" stroke={C.skyBlue} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    group: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="10" cy="10" r="3.5" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="10" r="3.5" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
        <path d="M4 22 C4 17 7 15 10 15 C11.5 15 12.5 15.5 14 16.5 C15.5 15.5 16.5 15 18 15 C21 15 24 17 24 22" stroke={C.skyBlue} strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
        <circle cx="14" cy="14" r="11" stroke={C.skyBlue} strokeWidth="1.5" fill="none" />
        <path d="M10 14 L14 6 L18 14 L14 22 Z" stroke={C.skyBlue} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
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

function ListItem({ name, detail, note, tags, featured, url, isMobile, onOpenSheet, location, hasNPS, cuisine, priceRange, reservations, dietary, energy }) {
  const nameEl = onOpenSheet ? (
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.darkInk }}>{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600,
      color: C.darkInk, textDecoration: "none",
      borderBottom: `1px solid ${C.stone}`, transition: "border-color 0.2s, color 0.2s",
    }} onMouseEnter={e => { e.target.style.borderColor = C.skyBlue; e.target.style.color = C.slate || "#3D5A6B"; }}
       onMouseLeave={e => { e.target.style.borderColor = C.stone; e.target.style.color = C.darkInk; }}>
      {name}
      <span style={{ fontSize: 12, marginLeft: 4, color: "#7A857E" }}>{"↗"}</span>
    </a>
  ) : (
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.darkInk }}>{name}</span>
  );

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet({ type: 'list', name, detail, note, tags, featured, url, location, cuisine, priceRange, reservations, dietary, energy }) : undefined}
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
              padding: "2px 10px", border: `1px solid ${C.skyBlue}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.skyBlue,
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
          fontSize: isMobile ? 14 : "clamp(13px, 1.5vw, 14px)", fontWeight: 400,
          color: "#4A5650", lineHeight: 1.65,
        }}>{detail}</div>
        {note && (
          <div style={{
            fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600,
            color: C.skyBlue, marginTop: 4,
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

function sortByTierDiversity(items) {
  const tierOrder = ['elemental', 'rooted', 'premium', 'luxury'];
  const picks = [];
  const seen = new Set();
  for (const tier of tierOrder) {
    const pick = items.find(a => a.lilaPick && a.stayStyle === tier && !seen.has(a.id));
    if (pick) { picks.push(pick); seen.add(pick.id); }
  }
  for (const a of items) {
    if (a.lilaPick && !seen.has(a.id)) { picks.push(a); seen.add(a.id); }
  }
  return [...picks, ...items.filter(a => !seen.has(a.id))];
}

function StayItem({ name, location, tier, detail, tags, url, featured, isMobile, onOpenSheet, priceRange, amenities, bookingWindow, seasonalNotes, groupFit }) {
  const styles = {
    elemental: { color: C.seaGlass, label: "Elemental", bg: `${C.seaGlass}15` },
    rooted: { color: C.oceanTeal, label: "Rooted", bg: `${C.oceanTeal}12` },
    premium: { color: C.goldenAmber, label: "Premium", bg: `${C.goldenAmber}15` },
    luxury: { color: C.sunSalmon, label: "Luxury", bg: `${C.sunSalmon}15` },
  };
  const s = styles[tier] || styles.rooted;
  const nameEl = onOpenSheet ? (
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.darkInk }}>{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{
      fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600,
      color: C.darkInk, textDecoration: "none",
      borderBottom: `1px solid ${C.stone}`, transition: "border-color 0.2s",
    }} onMouseEnter={e => e.target.style.borderColor = C.skyBlue}
       onMouseLeave={e => e.target.style.borderColor = C.stone}>
      {name}
      <span style={{ fontSize: 12, marginLeft: 4, color: "#7A857E" }}>{"↗"}</span>
    </a>
  ) : (
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 15, fontWeight: 600, color: C.darkInk }}>{name}</span>
  );

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet({ type: 'stay', name, location, tier, detail, tags, featured, url, priceRange, amenities, bookingWindow, seasonalNotes, groupFit }) : undefined}
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
              padding: "2px 10px", border: `1px solid ${C.skyBlue}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.skyBlue,
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
    luxury: { color: C.sunSalmon, label: "Luxury", bg: `${C.sunSalmon}15` },
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
          <span style={{ padding: '2px 10px', background: tierStyles[item.tier].bg, fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: tierStyles[item.tier].color }}>{tierStyles[item.tier].label}</span>
          {item.location && (<span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 500, color: '#7A857E' }}>{item.location}</span>)}
        </div>
      )}
      {item.type === 'list' && item.section && (
        <span style={{ display: 'inline-block', padding: '2px 10px', background: `${C.skyBlue}15`, fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.skyBlue, marginBottom: 10 }}>{item.section}</span>
      )}
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 400, color: C.darkInk, margin: '0 0 10px', lineHeight: 1.2 }}>{item.name}</h3>
      {item.featured && (
        <span style={{ display: 'inline-block', padding: '2px 10px', border: `1px solid ${C.skyBlue}40`, fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.skyBlue, marginBottom: 14 }}>Lila Pick</span>
      )}

      {/* NPS ENRICHMENT */}
      {nps && (
        <>
          {npsPrimaryImage && (
            <div style={{ margin: '0 -20px 18px', position: 'relative' }}>
              <img src={npsPrimaryImage.url} alt={npsPrimaryImage.altText || item.name} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
              {(npsPrimaryImage.caption || npsPrimaryImage.credit) && (
                <div style={{ padding: '6px 20px', fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400, color: '#7A857E', lineHeight: 1.5 }}>
                  {npsPrimaryImage.caption && <span>{npsPrimaryImage.caption}</span>}
                  {npsPrimaryImage.credit && (<span style={{ fontStyle: 'italic' }}>{npsPrimaryImage.caption ? ' · ' : ''}Photo: {npsPrimaryImage.credit}</span>)}
                </div>
              )}
              {npsImages.length > 1 && (
                <div style={{ display: 'flex', gap: 3, padding: '0 20px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {npsImages.slice(1, 5).map((img, i) => (<img key={i} src={img.url} alt={img.altText || ''} style={{ width: 60, height: 42, objectFit: 'cover', opacity: 0.8 }} />))}
                </div>
              )}
            </div>
          )}
          <a href={nps.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 18, background: '#2D5F2B0D', border: '1px solid #2D5F2B18', textDecoration: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#2D5F2B18'} onMouseLeave={e => e.currentTarget.style.background = '#2D5F2B0D'}>
            <NPSArrowhead size={20} color="#2D5F2B" />
            <div>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 500, color: '#2D5F2B', lineHeight: 1.5 }}>Trail information provided by the <strong>National Park Service</strong></div>
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
              return (<div style={{ marginBottom: 20 }}><div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 8 }}>Accessibility</div><p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: '#4A5650', lineHeight: 1.6, margin: 0 }}>{text}</p></div>);
            }
            const rows = liMatches.map(li => { const inner = li.replace(/<\/?li>/gi, ''); const boldMatch = inner.match(/<b>([\s\S]*?)<\/b>/); const lbl = boldMatch ? clean(boldMatch[1]).replace(/\s*\|\s*$/, '').trim() : ''; const valueHtml = boldMatch ? inner.slice(inner.indexOf('</b>') + 4) : inner; const valueParts = valueHtml.split(/<b>\s*\|?\s*<\/b>|<b>\s*\|\s*<\/b>/).map(clean).filter(Boolean); const finalParts = []; for (const part of valueParts) { part.split(/\s+\|\s+/).forEach(p => { if (p.trim()) finalParts.push(p.trim()); }); } return { label: lbl, values: finalParts }; });
            const footnoteMatch = html.match(/<p>([\s\S]*?)<\/p>/i);
            const footnote = footnoteMatch ? clean(footnoteMatch[1]) : null;
            return (<div style={{ marginBottom: 20 }}><div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 10 }}>Trail Accessibility</div><div style={{ border: `1px solid ${C.stone}`, background: `${C.stone}18` }}>{rows.map((row, i) => (<div key={i} style={{ padding: '9px 14px', borderBottom: `1px solid ${C.stone}` }}>{row.label && (<div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, color: C.darkInk, marginBottom: 3 }}>{row.label}</div>)}{row.values.map((val, j) => (<div key={j} style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: '#4A5650', lineHeight: 1.6 }}>{val}</div>))}</div>))}{footnote && (<div style={{ padding: '8px 14px', fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400, fontStyle: 'italic', color: '#7A857E', lineHeight: 1.5 }}>{footnote}</div>)}</div></div>);
          })()}
          {(item.detail || item.note) && (
            <div style={{ padding: '14px 16px', marginBottom: 18, background: `${C.goldenAmber}08`, borderLeft: `3px solid ${C.goldenAmber}40` }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.goldenAmber, marginBottom: 8 }}>Our Take</div>
              {item.detail && (<p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: '#4A5650', lineHeight: 1.7, margin: '0 0 6px' }}>{item.detail}</p>)}
              {item.note && (<div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: C.skyBlue }}>{item.note}</div>)}
            </div>
          )}
          {item.tags && item.tags.length > 0 && (<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>{item.tags.map((t, i) => (<span key={i} style={{ padding: '3px 10px', background: C.stone + '60', fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: '#7A857E' }}>{t}</span>))}</div>)}
        </>
      )}

      {!nps && (
        <>
          {item.detail && (<p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400, color: '#4A5650', lineHeight: 1.7, margin: '0 0 14px' }}>{item.detail}</p>)}
          {item.note && (<div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 600, color: C.skyBlue, marginBottom: 14 }}>{item.note}</div>)}

          {/* Restaurant info grid */}
          {item.type === 'list' && (item.cuisine || item.priceRange || item.reservations || item.energy) && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '10px 16px', marginBottom: 18,
              padding: '14px 0',
              borderTop: `1px solid ${C.stone}`,
              borderBottom: `1px solid ${C.stone}`,
            }}>
              {item.cuisine && (
                <div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Cuisine</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.cuisine}</div>
                </div>
              )}
              {item.priceRange && (
                <div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Price</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.priceRange}</div>
                </div>
              )}
              {item.energy && (
                <div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Vibe</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.energy}</div>
                </div>
              )}
              {item.reservations && (
                <div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Reservations</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.reservations}</div>
                </div>
              )}
              {item.location && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Location</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.location}</div>
                </div>
              )}
              {item.dietary && (item.dietary.vegetarian || item.dietary.vegan || item.dietary.glutenFree) && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Dietary</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {item.dietary.vegetarian && <span style={{ padding: '2px 8px', background: `${C.seaGlass}15`, fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600, color: C.seaGlass }}>vegetarian</span>}
                    {item.dietary.vegan && <span style={{ padding: '2px 8px', background: `${C.seaGlass}15`, fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600, color: C.seaGlass }}>vegan</span>}
                    {item.dietary.glutenFree && <span style={{ padding: '2px 8px', background: `${C.seaGlass}15`, fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600, color: C.seaGlass }}>gluten-free</span>}
                  </div>
                  {item.dietary.notes && <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: '#7A857E', marginTop: 4, lineHeight: 1.5 }}>{item.dietary.notes}</div>}
                </div>
              )}
            </div>
          )}

          {/* Accommodation info grid */}
          {item.type === 'stay' && (item.priceRange || item.bookingWindow || item.seasonalNotes || item.groupFit) && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '10px 16px', marginBottom: 18,
              padding: '14px 0',
              borderTop: `1px solid ${C.stone}`,
              borderBottom: `1px solid ${C.stone}`,
            }}>
              {item.priceRange && (
                <div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Price Range</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.priceRange}</div>
                </div>
              )}
              {item.groupFit && (
                <div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Good For</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.groupFit.join(', ')}</div>
                </div>
              )}
              {item.bookingWindow && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Booking</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.bookingWindow}</div>
                </div>
              )}
              {item.seasonalNotes && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 3 }}>Season</div>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500, color: C.darkInk, lineHeight: 1.5 }}>{item.seasonalNotes}</div>
                </div>
              )}
            </div>
          )}

          {/* Amenities */}
          {item.type === 'stay' && item.amenities && item.amenities.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A857E', marginBottom: 8 }}>Amenities</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {item.amenities.map((a, i) => (
                  <span key={i} style={{ padding: '3px 10px', background: `${C.skyBlue}10`, fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: C.skyBlue }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (<div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>{item.tags.map((t, i) => (<span key={i} style={{ padding: '3px 10px', background: C.stone + '60', fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: '#7A857E' }}>{t}</span>))}</div>)}
        </>
      )}

      {item.url && !nps && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: `1.5px solid ${C.skyBlue}`, fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.skyBlue, textDecoration: 'none', transition: 'all 0.25s' }}
        onMouseEnter={e => { e.currentTarget.style.background = C.skyBlue; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.skyBlue; }}
        >Visit Website <span style={{ fontSize: 13 }}>↗</span></a>
      )}
    </div>
  );

  if (!isMobile) {
    return (
      <>
        <style>{`@keyframes guideSheetSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } } @keyframes guideSheetBackdropIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
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
      <style>{`@keyframes guideSheetSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } } @keyframes guideSheetBackdropIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 249, background: 'rgba(0,0,0,0.3)', animation: 'guideSheetBackdropIn 0.25s ease' }} />
      <div ref={sheetRef} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '82vh', zIndex: 250, background: C.cream, borderRadius: '16px 16px 0 0', animation: 'guideSheetSlideUp 0.3s ease', boxShadow: '0 -4px 24px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ padding: '10px 14px 6px', flexShrink: 0, position: 'relative', zIndex: 10 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#7A857E30', margin: '0 auto 8px' }} />
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ position: 'absolute', top: 8, right: 14, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${C.warmWhite}e0`, border: '1px solid #7A857E15', borderRadius: '50%', cursor: 'pointer', fontFamily: "'Quicksand', sans-serif", fontSize: 15, color: '#7A857E', lineHeight: 1, WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 8px ${C.darkInk}08` }} aria-label="Close">✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>{content}</div>
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
    id: "olympic-np", name: "Olympic National Park", designation: "us-national-park", established: 1938,
    acreage: "922,650 ac", elevation: "sea level–7,980 ft", attribute: "Three ecosystems",
    soul: "Three parks in one — glacier-draped mountains, the wettest rainforests in the contiguous US, and 73 miles of wilderness coastline. No single road connects them. You choose your immersion.",
    facts: [
      "UNESCO World Heritage Site and International Biosphere Reserve",
      "The Hoh Rainforest receives 140–170 inches of rain annually",
      "Home to the largest unmanaged herd of Roosevelt elk in the Pacific Northwest",
    ],
    infoUrl: "https://www.nps.gov/olym/",
    driveFrom: null, accent: C.skyBlue, isAnchor: true,
  },
  {
    id: "olympic-nf", name: "Olympic National Forest", designation: "national-forest",
    acreage: "628,000 ac", elevation: null, attribute: "Dispersed camping",
    soul: "The buffer zone surrounding the national park — 628,000 acres of working forest, wild rivers, and dispersed campsites. Where the park draws boundaries, the forest offers freedom.",
    facts: [
      "Surrounds Olympic National Park on three sides",
      "Five designated wilderness areas within the forest",
      "Dispersed camping permitted throughout — no reservation needed",
    ],
    infoUrl: "https://www.fs.usda.gov/olympic",
    driveFrom: null, accent: "#6B8F71", isAnchor: false,
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
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
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
                borderBottom: `2px solid ${isActive ? C.skyBlue : "transparent"}`,
                cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: 11,
                fontWeight: isActive ? 700 : 600, letterSpacing: "0.14em", textTransform: "uppercase",
                color: isActive ? C.skyBlue : "#7A857E", whiteSpace: "nowrap", flexShrink: 0,
                transition: "color 0.25s ease, border-color 0.25s ease", position: "relative",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = C.darkInk; e.currentTarget.style.borderBottomColor = C.stone; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "#7A857E"; e.currentTarget.style.borderBottomColor = "transparent"; } }}>
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




// ─── Main Page ───────────────────────────────────────────────────────────────

export default function OlympicPeninsulaGuide() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const breathConfig = BREATH_CONFIG.olympic;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
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

  // ── NPS Data ──
  const [npsLookup, setNpsLookup] = useState(null);
  useEffect(() => {
    getNPSData(['olym'])
      .then(data => {
        setNpsLookup(buildNPSLookup(data.thingsToDo));
      })
      .catch(err => console.warn('NPS fetch failed:', err.message));
  }, []);

  const openSheet = (section) => (item) => {
    const npsMatch = npsLookup ? findNPSMatch(item.name, npsLookup) : null;
    setActiveSheet({ ...item, section, nps: npsMatch || undefined });
  };
  const checkNPS = useCallback((name) => npsLookup ? !!findNPSMatch(name, npsLookup) : false, [npsLookup]);

  return (
    <>
      <Helmet>
        <title>Olympic Peninsula Guide — Rainforest, Wild Coast & Slow Travel | Lila Trips</title>
        <meta name="description" content="Temperate rainforest, tide pools, and isolated Pacific coastline. A guide for travelers who want to move through one of North America's most intact ecosystems with care." />
        <link rel="canonical" href="https://lilatrips.com/destinations/olympic-peninsula" />
        <meta property="og:title" content="Olympic Peninsula Guide — Rainforest, Wild Coast & Slow Travel | Lila Trips" />
        <meta property="og:description" content="Temperate rainforest, tide pools, and isolated Pacific coastline. A guide for travelers who want to move through one of North America's most intact ecosystems with care." />
        <meta property="og:url" content="https://lilatrips.com/destinations/olympic-peninsula" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Olympic Peninsula — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Olympic Peninsula Guide — Rainforest, Wild Coast & Slow Travel | Lila Trips" />
        <meta name="twitter:description" content="Temperate rainforest, tide pools, and isolated Pacific coastline. A guide for travelers who want to move through one of North America's most intact ecosystems with care." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav breathConfig={breathConfig} />
      <div ref={breathWrapperRef} style={{ background: breathConfig ? C.warmWhite : undefined }}>
          <CelestialDrawer destination="olympic-peninsula" isMobile={isMobile} breathValueRef={breathValueRef} />

          {/* ══ TITLE MASTHEAD ═══════════════════════════════════════════════════ */}
          <section style={{ background: breathConfig ? 'transparent' : C.cream }}>
        <div style={{
          padding: isMobile ? "28px 20px 24px" : "44px 52px 40px",
          maxWidth: 920, margin: "0 auto",
        }}>
          <FadeIn from="bottom" delay={0.1}>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
              gap: isMobile ? 28 : 52,
              alignItems: "start",
              marginTop: 0,
            }}>

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow" style={{
                  color: C.skyBlue, marginBottom: 14, display: "block",
                }}>Destination Guide</span>

                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 300,
                  color: C.darkInk, lineHeight: 1.0,
                  margin: "0 0 22px", letterSpacing: "-0.02em",
                }}>
                  {"Olympic Peninsula"}
                </h1>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: "0 0 14px",
                }}>
                  {"Olympic is three parks in one, stacked against each other in ecological improbability. Glacier-draped mountains, the wettest rainforests in the contiguous United States, and 73 miles of wilderness shoreline — each zone requires its own day, its own state of mind."}
                </p>

                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: 0,
                }}>
                  {"You cannot see Olympic in a loop. You have to choose. What you get in exchange is complete immersion — in rain, in silence, in a landscape that feels like the Pacific Northwest distilled to its essence."}
                </p>
              </div>
              <div style={isMobile ? { borderTop: `1px solid ${C.stone}`, paddingTop: 28 } : { borderLeft: `1px solid ${C.stone}`, paddingLeft: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A857E", marginBottom: 18 }}>This guide covers</div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 10 }}>Ecosystem Zones</div>
                  {["Alpine (Hurricane Ridge)", "Rainforest (Hoh Valley)", "Coastal (La Push / Rialto)"].map((area, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: C.skyBlue, opacity: 0.5 }} /><span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", color: C.darkInk }}>{area}</span></div>))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.goldenAmber, marginBottom: 10 }}>Gateway Towns</div>
                  {["Port Angeles", "Sequim", "Forks", "Port Townsend"].map((town, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: C.goldenAmber, opacity: 0.5 }} /><span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", color: C.darkInk }}>{town}</span></div>))}
                </div>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: "#7A857E", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.stone}` }}>Updated 2026</div>
              </div>
            </div>
          </FadeIn>
        </div>
          </section>
      </div>

      <GuideNav isMobile={isMobile} />

      {/* IMAGE STRIP */}
      <section style={{ position: "relative" }}>
        <div style={{ display: "flex", gap: 2, overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {[
            { src: P.olympic,             alt: "Olympic Peninsula mountains",            caption: "Olympic Range from Hurricane Ridge",         width: 420 },
            { src: P.olympicHohRainforest, alt: "Hoh Rainforest mossy trail",             caption: "Hall of Mosses — the Hoh Rainforest",        width: 280 },
            { src: P.olympicLakeCrescent,  alt: "Lake Crescent with Adirondack chairs",   caption: "Lake Crescent — glacially carved turquoise",  width: 420 },
            { src: P.olympicLakeSunset,    alt: "Olympic lake at sunset",                 caption: "Sunset over the peninsula",                  width: 360 },
          ].map((img, i) => (
            <div key={i} style={{ flex: "0 0 auto", width: isMobile ? "85vw" : img.width, scrollSnapAlign: "start", position: "relative", overflow: "hidden" }}>
              <img src={img.src} alt={img.alt} style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 16px 14px", background: "linear-gradient(to top, rgba(10,18,26,0.7), transparent)" }}>
                <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.8)" }}>{img.caption}</span>
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
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8, fontWeight: 400, color: "#4A5650", margin: "0 0 16px" }}>
                {"Olympic is three parks in one, stacked against each other in ecological improbability. In the center: the Olympic Mountains, glacier-draped and largely roadless, presiding over the peninsula's wild interior. On the west slope: the Hoh, Quinault, and Queets Rainforests — the wettest place in the contiguous United States, where bigleaf maples grow so dense with mosses and ferns they look like they're breathing. On the coast: 73 miles of wilderness shoreline, sea stacks rising from the surf, tide pools full of life, driftwood the size of tree trunks."}
              </p>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8, fontWeight: 400, color: "#4A5650", margin: "0 0 16px" }}>
                {"Each zone requires its own day, its own state of mind. You cannot see Olympic in a loop. You have to choose. What you get in exchange is complete immersion — in rain, in silence, in a landscape that feels like the Pacific Northwest distilled to its essence. This is a place that rewards unhurried attention."}
              </p>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8, fontWeight: 400, color: "#4A5650", margin: "0 0 28px" }}>
                {"Nine Indigenous Nations have called this peninsula home since time immemorial: the Makah, Quileute, Hoh, Quinault, Jamestown S'Klallam, Port Gamble S'Klallam, Lower Elwha Klallam, Skokomish, and Squaxin Island tribes. The land and water here carry thousands of years of their relationship."}
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: isMobile ? 12 : 16,
                padding: isMobile ? 16 : 20,
                background: C.cream,
                border: `1px solid ${C.stone}`,
                marginBottom: 20,
              }}>
                {[
                  { l: "Recommended", v: "4–7 days" },
                  { l: "Nearest Airport", v: "Seattle (SEA)" },
                  { l: "Drive from SEA", v: "~2.5 hours" },
                  { l: "Best Times", v: "Jun–Sep" },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      color: C.skyBlue, marginBottom: 3,
                    }}>{s.l}</div>
                    <div style={{
                      fontFamily: "'Quicksand', sans-serif",
                      fontSize: 14, fontWeight: 600,
                      color: C.darkInk,
                    }}>{s.v}</div>
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

            {/* Driving Note */}
            <FadeIn delay={0.14}>
              <div style={{
                padding: "14px 16px",
                background: `${C.skyBlue}06`,
                borderLeft: `3px solid ${C.skyBlue}40`,
                marginTop: 16,
              }}>
                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 13, fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.65,
                  margin: 0,
                }}>
                  {"No shuttle system — personal vehicle required. Olympic is enormous and discontiguous: the park covers nearly a million acres across mountain, rainforest, and coastal ecosystems, and there is no single road through it. Plan driving time between zones — Hoh to Hurricane Ridge is 2.5 hours."}
                </p>
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
              <SectionSub isMobile={isMobile}>{"Olympic rewards every season differently. These are the moments when the peninsula is most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Summer — Alpine Access" featured
                  detail={"Peak window for Hurricane Ridge. High trails are snow-free. Busiest crowds. Rainforest trails accessible year-round; the coast is foggier. July and August are the driest months on the peninsula."}
                  tags={["Jul–Aug", "Alpine", "Peak Season"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Fall — Elk Rut & Golden Light" featured
                  detail={"Best overall. Crowds thin, light is extraordinary, elk rut in the Hoh Valley, weather still cooperative in the mountains. September and October offer the finest balance of access and solitude."}
                  tags={["Sep–Oct", "Wildlife", "Fewer Crowds"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Winter — Storm Season"
                  detail={"Rainforest at its most atmospheric — mosses saturated, rivers running high. Coast is dramatic in storm season. Hurricane Ridge becomes a snowshoe destination. Alpine trails buried."}
                  tags={["Dec–Feb", "Storms", "Rainforest"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Spring — Whales & Wildflowers"
                  detail={"Wildflowers on the ridge, migrating gray whales offshore, rivers running fast. Hurricane Ridge Road often closed until late spring — check ahead."}
                  tags={["Mar–May", "Migration", "Wildflowers"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Gray Whale Migration"
                  detail={"Gray whales migrate offshore March through May, visible from coastal bluffs at La Push and Kalaloch. One of the most reliable cetacean viewing windows on the Pacific coast."}
                  tags={["Mar–May", "Wildlife", "Coastal"]} />
              </div>
            </FadeIn>

            {/* Threshold Moments */}
            <FadeIn delay={0.12}>
              <div style={{ marginTop: 28, padding: "20px", border: `1px solid ${C.stone}`, background: C.warmWhite }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 14 }}>{"Threshold Moments"}</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
                  {[
                    { event: "Gray Whale Migration", timing: "Mar–May", detail: "Offshore, visible from coastal bluffs" },
                    { event: "Elk Rut", timing: "Sep–Oct", detail: "Hoh Valley at dawn and dusk" },
                    { event: "Winter Storms", timing: "Nov–Feb", detail: "Dramatic surf at Rialto Beach and Kalaloch" },
                    { event: "Summer Solstice", timing: "June 20–21", detail: "Longest light window for the alpine zone" },
                    { event: "Alpine Wildflowers", timing: "Jul–Aug", detail: "Hurricane Ridge meadows in full bloom" },
                    { event: "Salmon Runs", timing: "Sep–Nov", detail: "Sol Duc and Hoh rivers — spawning season" },
                  ].map((cal, i) => (
                    <div key={i} style={{ padding: "12px 14px", border: `1px solid ${C.stone}`, background: C.cream }}>
                      <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk, marginBottom: 3 }}>{cal.event}</div>
                      <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 4 }}>{cal.timing}</div>
                      <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, color: "#7A857E" }}>{cal.detail}</div>
                    </div>
                  ))}
                </div>
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
              <SectionSub isMobile={isMobile}>One of the last temperate wildernesses in the lower 48. Treat it that way.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 8 }}>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Hall of Mosses · Trail Widening</div>
                  <ListItem isMobile={isMobile} name="The moss took decades to grow. It takes one footstep to damage it."
                    detail="The surge in visitors has widened and compacted trails like the Hall of Mosses — paths previously edged with lush moss are now bare, hard-packed dirt. Social trails to objects of interest make it worse. Moss can withstand light traffic but not the volume the Hoh now sees. Stay on wooden boardwalks and established paths. Resist the urge to step off for a photo."
                    tags={["Stay on trail", "No social trails", "Moss protection"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Hoh Rainforest · Peak Season</div>
                  <ListItem isMobile={isMobile} name="In August, 107,000 people came here. Plan accordingly."
                    detail="In August 2011, the Hoh Rainforest saw 38,000 visitors. By August 2021, that number had tripled to over 107,000. The single access road gridlocks by mid-morning. Arriving before 8am dramatically changes the experience and reduces pressure on the parking area. The Hoh River Trail beyond the first two miles sees a fraction of the crowd and rewards the extra distance."
                    note="◈ Arrive before 8am in summer — the parking lot fills completely by mid-morning"
                    tags={["Off-peak arrival", "Dawn entry", "Hoh River Trail"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Elwha River · Dam Removal Recovery</div>
                  <ListItem isMobile={isMobile} name="The largest dam removal in US history is still healing."
                    detail="The Elwha River restoration — removal of two dams completed in 2014 — is the most significant river recovery project in American history. Salmon are returning for the first time in over a century. The riparian corridor is still fragile. We orient itineraries around witnessing that recovery from the trail, not wading through active restoration zones or disturbing newly colonizing vegetation on the former reservoir beds."
                    tags={["River restoration", "Active recovery", "Witness don't disturb"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Hoh Tribe · Indigenous Territory</div>
                  <ListItem isMobile={isMobile} name="The Hoh River valley is the ancestral home of the Hoh people."
                    detail="The Hoh River valley is the ancestral home of the Hoh people, who have maintained a continuous relationship with this watershed for centuries. The park's boundaries were drawn around — not with — the tribe. The Hoh Indian Reservation sits at the river's mouth. When visiting, that history is part of the landscape. We support Hoh-led cultural programs and recommend purchasing directly from tribal artisans when the opportunity arises."
                    tags={["Hoh tribal territory", "Indigenous-led programs", "Support tribal artisans"]} />
                </div>
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
              <SectionSub isMobile={isMobile}>{"How you inhabit a place matters. From ocean-bluff campgrounds to historic park lodges to Victorian B&Bs overlooking the Strait."}</SectionSub>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div style={{ padding: "14px 16px", background: C.cream, border: `1px solid ${C.stone}`, marginBottom: 20, display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 16, flexWrap: "wrap" }}>
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
                {sortByTierDiversity(accommodations.filter(a => !a.corridor)).map(a => (
                  <StayItem
                    key={a.id}
                    name={a.name}
                    location={a.location}
                    tier={a.stayStyle}
                    detail={a.highlights?.join('. ')}
                    tags={a.tags}
                    url={a.links?.booking || a.links?.website}
                    featured={a.lilaPick}
                    isMobile={isMobile}
                    onOpenSheet={setActiveSheet}
                    priceRange={a.priceRange}
                    amenities={a.amenities}
                    bookingWindow={a.bookingWindow}
                    seasonalNotes={a.seasonalNotes}
                    groupFit={a.groupFit}
                  />
                ))}
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
              <SectionTitle>{"Trails by ecosystem"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"Olympic's three distinct ecosystems each demand their own section. Choose your entry point based on the landscape that calls you."}</SectionSub>
            </FadeIn>

            {/* Alpine Zone */}
            <FadeIn delay={0.06}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 16 }}>{"Alpine Zone — Hurricane Ridge"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Hurricane Hill Trail" featured hasNPS={checkNPS("Hurricane Hill Trail")}
                  detail={"The finest panoramic summit accessible by trail in the park. A paved path climbs past wildflower meadows and marmot habitat to a 5,757-foot summit with 360-degree views: the Olympic Range, the Strait of Juan de Fuca, and on clear days, Vancouver Island."}
                  note="3.2 mi RT · 800 ft gain · Easy-Moderate · 2 hrs"
                  tags={["Alpine Views", "Wildflowers", "Jul–Oct"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="High Divide Trail & Seven Lakes Basin Loop" hasNPS={checkNPS("High Divide Trail")}
                  detail={"The defining backcountry traverse in the Olympics. The loop climbs from the Sol Duc valley to a ridge with unobstructed views of Mount Olympus's glaciers, descends through subalpine lakes, and returns through old-growth forest. Plan two to three days."}
                  note="18–19 mi loop · ~3,500 ft gain · Strenuous · 2–3 days"
                  tags={["Backpacking", "Glaciers", "Alpine Lakes", "Jul–Sep"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Mount Storm King" hasNPS={checkNPS("Mount Storm King")}
                  detail={"The steepest and most dramatic day hike in the park. The summit involves exposed scrambling and a rope-assisted section near the top. The reward: jaw-dropping views of Lake Crescent's turquoise water far below."}
                  note="4.4 mi RT · 2,100 ft gain · Strenuous · 3–4 hrs"
                  tags={["Scrambling", "Lake Crescent Views", "May–Oct"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Marymere Falls Trail" hasNPS={checkNPS("Marymere Falls Trail")}
                  detail={"Through old-growth conifers to a 90-foot waterfall tucked into a sandstone gorge. Short enough for any level, beautiful enough to anchor a morning."}
                  note="1.8 mi RT · Easy · 1 hr"
                  tags={["Waterfall", "Old-Growth", "Year-Round"]} />
              </div>
            </FadeIn>

            {/* Rainforest Zone */}
            <FadeIn delay={0.1}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 16 }}>{"Rainforest Zone — Hoh Valley"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Hall of Mosses Trail" featured hasNPS={checkNPS("Hall of Mosses Trail")}
                  detail={"The rainforest's most iconic walk. Bigleaf maples draped in club moss form a cathedral canopy — one of the most otherworldly short walks in North America. The Hoh receives up to 140 inches of rain a year, and it shows: every surface is alive with fern, lichen, and moss."}
                  note="0.8 mi loop · Easy · 30–45 min"
                  tags={["Iconic", "Photography", "Year-Round"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Hoh River Trail" hasNPS={checkNPS("Hoh River Trail")}
                  detail={"Runs 17 miles up-valley toward Mount Olympus. Day hikers can go as far as they want. The concept of 'One Square Inch of Silence' was developed here — one of the quietest places in the hemisphere. The deeper you go, the more the forest closes around you."}
                  note="Varies (2–17 mi one way) · Easy-Moderate"
                  tags={["Silence", "Forest Bathing", "Backpacking"]} />
              </div>
            </FadeIn>

            {/* Coastal Zone */}
            <FadeIn delay={0.14}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 16 }}>{"Coastal Zone — La Push & Rialto"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Second Beach (La Push)" featured hasNPS={checkNPS("Second Beach")}
                  detail={"The defining Olympic coast experience. A 0.7-mile trail through forest opens suddenly onto a wild beach of black sand and sea stacks — spires of rock rising from the surf, dense with seabirds. Sunsets here are extraordinary. On the traditional territory of the Quileute Nation."}
                  note="1.4 mi RT · Easy · 45 min"
                  tags={["Sea Stacks", "Sunset", "Year-Round"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Hole-in-the-Wall (Rialto Beach)" hasNPS={checkNPS("Hole-in-the-Wall")}
                  detail={"A natural sea arch carved by the surf, accessible by a 1.5-mile walk north along Rialto Beach. Tide pools, sea stacks, bald eagles, and the sound of the Pacific. Check tides — the final section requires low tide passage."}
                  note="3 mi RT · Easy (tide-dependent) · 1.5–2 hrs"
                  tags={["Sea Arch", "Tide Pools", "Check Tides"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Ozette Triangle (Cape Alava / Sand Point Loop)" hasNPS={checkNPS("Ozette Triangle")}
                  detail={"A 9-mile loop combining a beach segment with ancient cedar boardwalk trails. Cape Alava is the westernmost point in the contiguous United States. The beach passes Wedding Rocks — petroglyphs carved by the Makah people, some of the most significant ancient rock art on the peninsula."}
                  note="9 mi loop · Moderate · 4–5 hrs"
                  tags={["Petroglyphs", "Westernmost Point", "Indigenous Heritage"]} />
              </div>
            </FadeIn>

            {/* Sol Duc */}
            <FadeIn delay={0.18}>
              <div style={{ marginTop: 28 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 16 }}>{"Sol Duc & Scenic Drives"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Sol Duc Falls" hasNPS={checkNPS("Sol Duc Falls")}
                  detail={"A short walk through old-growth forest to a powerful three-pronged waterfall dropping into a basalt gorge. Photogenic in any weather, close to the Sol Duc Hot Springs. Combine the two for one of the best half-days in the park."}
                  note="1.6 mi RT · Easy · 45 min"
                  tags={["Waterfall", "Old-Growth", "Year-Round"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Hurricane Ridge Road"
                  detail={"17 miles of switchbacks from Port Angeles to the ridge. The road climbs through old growth, breaks into meadow, and delivers you to a view that stops conversation. Drive it at sunset if you can."}
                  tags={["17 Miles", "Switchbacks", "Sunset Drive"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="US-101 Coastal Loop"
                  detail={"The highway circles the Olympic Peninsula and offers access to all ecosystems. The stretch between Forks and Kalaloch runs close enough to the coast that you can pull off and walk to the beach repeatedly."}
                  tags={["Full Day", "All Ecosystems", "Beach Pull-Offs"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Lake Crescent"
                  detail={"The lake sits in a glacially carved valley 20 miles west of Port Angeles. Turquoise water (low in nutrients, exceptionally clear), old-growth forest framing both shores. The East Beach picnic area, the Storm King trailhead, and Lake Crescent Lodge are all accessible without crowds if you arrive before 10 AM."}
                  tags={["Turquoise Water", "Old-Growth", "Arrive Early"]} />
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
              <SectionTitle>{"Soaking, silence & contemplation"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"The peninsula's pace makes practice feel less like effort and more like returning to something you already knew."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="wellness experiences">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Sol Duc Hot Springs Resort" featured
                  url="https://www.olympicnationalparks.com/lodging/sol-duc-hot-springs-resort/"
                  detail={"Geothermal hot springs deep in the Sol Duc valley, surrounded by old-growth forest. Three soaking pools (98°F to 104°F), a freshwater swimming pool, and access to the Sol Duc River below. The resort has operated here since 1912. Day use from Memorial Day through early October — arrive early, it fills quickly."}
                  note="Day use: Memorial Day–early Oct · Arrive early"
                  tags={["Hot Springs", "Old-Growth", "Day Use"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Olympic Hot Springs (dispersed)"
                  detail={"A remote soaking experience reached by a 2.5-mile hike or 10-mile bike ride (road closed to vehicles). Small primitive pools along Boulder Creek, fed by geothermal springs. No facilities — pack in and pack out. Check conditions at the Elwha Ranger Station."}
                  note="2.5 mi hike · Free · Year-round"
                  tags={["Primitive", "Hike-In", "Free", "Wilderness"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Hoh Rainforest — One Square Inch of Silence" featured
                  detail={"Acoustic ecologist Gordon Hempton designated a specific point on the Hoh River Trail as one of the quietest places in the Western Hemisphere. Walking the Hoh with no agenda — no earbuds, no podcast, just the sound of the river and the rain on bigleaf maple — is one of the most genuinely meditative experiences in any national park."}
                  tags={["Silence", "Forest Bathing", "Meditative"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Hurricane Ridge — Dawn Alpine Meditation"
                  detail={"Arrive at Hurricane Ridge before the visitor center opens (typically 9 AM). The parking lot faces the entire Olympic Range. At dawn, light rolls across the glaciers and meadows in waves. No interpretation needed — just a thermos and a place to sit."}
                  tags={["Sunrise", "Alpine", "Contemplative"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Port Angeles & Sequim — Local Studios"
                  detail={"Port Angeles has a small but active wellness community. Studios rotate; search 'yoga Port Angeles' for current offerings. Sequim has additional options, particularly for Pilates and somatic work."}
                  tags={["Yoga", "Drop-In", "Local Community"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Kalaloch Lodge — Coastal Stillness"
                  detail={"No formal wellness programming, but the location — above a sweep of wild beach with sea stacks visible from the windows — invites a particular quality of stillness. Recommended for anyone who wants the coast without camping."}
                  tags={["Wild Coast", "Contemplative", "No Camping Needed"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* NIGHT SKY                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="light-sky" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Night Sky</SectionLabel>
              <SectionTitle>After dark on the peninsula.</SectionTitle>
              <SectionSub isMobile={isMobile}>Hurricane Ridge and the coast offer some of the darkest skies in the Pacific Northwest.</SectionSub>
            </FadeIn>

            {/* Dark Sky Note */}
            <FadeIn delay={0.1}>
              <div style={{
                padding: "20px 24px",
                background: C.darkInk,
                margin: "28px 0",
              }}>
                <div style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: C.skyBlue, marginBottom: 10,
                }}>Dark Sky Note</div>
                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 14, fontWeight: 400,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.7, margin: 0,
                }}>
                  {"No IDA dark sky certification. Consistent cloud cover limits sky access on the west side of the peninsula. The clearest conditions are found on the rain shadow side — Sequim and Dungeness — particularly in summer. When the clouds do break, the lack of development means genuine darkness is available from any park campground."}
                </p>
              </div>
            </FadeIn>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* FOOD & CULTURE                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="food-culture" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Food & Culture</SectionLabel>
              <SectionTitle>{"Food & Culture"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From Indigenous heritage to lavender farms to the peninsula's best kitchens. The connections here go deeper than a meal."}</SectionSub>
            </FadeIn>

            <FadeIn delay={0.06}>
              <ExpandableList initialCount={5} label="places to eat">
                {restaurants.filter(r => !r.corridor).sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(r => (
                  <ListItem
                    key={r.id}
                    name={r.name}
                    detail={r.highlights?.join('. ')}
                    note={r.hours}
                    tags={r.tags}
                    featured={r.lilaPick}
                    url={r.links?.website}
                    location={r.location}
                    cuisine={r.cuisine}
                    priceRange={r.priceRange}
                    reservations={r.reservations}
                    dietary={r.dietary}
                    energy={r.energy}
                    isMobile={isMobile}
                    onOpenSheet={openSheet('Food')}
                  />
                ))}
              </ExpandableList>
            </FadeIn>

            {/* Farm & Landscape */}
            <FadeIn delay={0.18}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 16 }}>{"Farm & Landscape"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="Sequim Lavender Trail" featured
                  url="https://sequimlavender.org"
                  detail={"A cluster of family-owned lavender farms in the Sequim-Dungeness Valley — sheltered by the Olympic rain shadow, averaging just 17 inches of rain per year. Nine working farms, u-pick fields, essential oil distillation, lavender ice cream. Jardin du Soleil and Purple Haze are the two anchors."}
                  note="Peak bloom mid-July · Annual festival third weekend of July"
                  tags={["Lavender", "U-Pick", "Rain Shadow", "Jun–Sep"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Discover')} name="Dungeness Spit — National Wildlife Refuge"
                  detail={"The longest natural sand spit in the United States — nearly seven miles extending into the Strait of Juan de Fuca. Over 250 bird species recorded. At the tip sits the New Dungeness Lighthouse, operating since 1857 — free tours daily."}
                  note="Up to 10 mi RT · $3/family · Open daily"
                  tags={["Birdwatching", "Lighthouse", "Coastal Walk"]} />
              </div>
            </FadeIn>

            {/* Indigenous Heritage & Discover */}
            <FadeIn delay={0.22}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 16 }}>{"Indigenous Heritage & Discovery"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Makah Museum & Cape Flattery" featured
                  url="https://makahmuseum.com"
                  detail={"The Makah Museum in Neah Bay houses artifacts from the excavation of Ozette — a village buried by a mudslide 500 years ago, remarkably preserved. One of the most significant archaeological finds in North America. Cape Flattery is the northwesternmost point in the contiguous US — a 1.5-mile Makah-managed trail to dramatic sea arch overlooks. $10/vehicle recreation permit."}
                  note="Plan a dedicated half-day"
                  tags={["Museum", "Cape Flattery", "Ozette", "Makah Nation"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Elwha River Restoration" featured
                  url="https://www.elwha.org"
                  detail={"The largest dam removal project in U.S. history, led by the Lower Elwha Klallam Tribe. Sacred sites submerged for a century were re-exposed. An archaeological site revealing 8,000 years of continuous habitation was uncovered. Drive the Elwha River road and walk to the former dam sites."}
                  tags={["Dam Removal", "Restoration", "Lower Elwha Klallam"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Jamestown S'Klallam Tribe"
                  detail={"'The Strong People' — operate the 7 Cedars Resort near Sequim and are known for hand-carved totem poles on their campus. The Jamestown Tribal Library offers cultural programming. The tribe welcomes visitors year-round."}
                  note="Sequim area"
                  tags={["Totem Poles", "Cultural Center", "Year-Round"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Port Townsend — Victorian Seaport"
                  detail={"One of the most architecturally intact Victorian seaports in the Pacific Northwest. Galleries, independent bookstores, live music via the Centrum Foundation. The Olympic Music Festival performs Saturdays in summer — world-class chamber music in a barn."}
                  tags={["Arts", "Victorian", "Music Festival"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Culture')} name="Feiro Marine Life Center"
                  url="https://www.feiromarinecenter.org/"
                  detail={"A small, excellent marine science center in Port Angeles focused on species from the Strait of Juan de Fuca and Puget Sound. Touch tanks, knowledgeable volunteers, good complement to coast tide pool experiences."}
                  note="Port Angeles"
                  tags={["Marine Science", "Touch Tanks", "Families"]} />
              </div>
            </FadeIn>

            {/* Regional Corridor */}
            <FadeIn delay={0.26}>
              <div style={{ marginTop: 28, marginBottom: 8 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 16 }}>{"Regional Corridor"}</div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Corridor')} name="Cape Flattery & Makah Reservation" featured
                  url="https://makah.com"
                  detail={"The northwesternmost point in the contiguous United States — accessible by a 1.5-mile Makah-managed trail through old-growth cedar and hemlock to overlooks above a dramatic sea arch and open Pacific. A $10/vehicle recreation permit is required. Pair with the Makah Museum for one of the most complete Indigenous-land experiences in the Pacific Northwest."}
                  note="1.5 mi RT · Easy-Moderate · 1 hr · $10/vehicle"
                  tags={["Makah Nation", "Cape Flattery", "Northwesternmost Point"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Corridor')} name="Port Townsend — Victorian Seaport"
                  detail={"Victorian seaport at the tip of the Quimper Peninsula. Historic architecture, art galleries, serious coffee, and a slower pace than Seattle. The Olympic Music Festival performs Saturdays in summer in a barn — world-class chamber music in a pastoral setting. A strong argument for arriving a day early or leaving a day late."}
                  tags={["Arts", "Architecture", "Music Festival", "Day Trip"]} />
              </div>
            </FadeIn>

            {/* Logistics */}
            <FadeIn delay={0.28}>
              <div style={{ marginTop: 28, marginBottom: 8, padding: "20px", border: `1px solid ${C.stone}`, background: C.warmWhite }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.skyBlue, marginBottom: 14 }}>{"Logistics & Practical Notes"}</div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", marginBottom: 4 }}>Getting There</div>
                    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.65, margin: 0 }}>
                      {"From Seattle: Bainbridge Island ferry (35 min) + 2-hour drive to Port Angeles — scenic and avoids traffic. Or drive around the south end of Puget Sound (~3 hrs). Rent a car; there is no other practical way to access multiple park zones."}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", marginBottom: 4 }}>Best Base Camps</div>
                    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.65, margin: 0 }}>
                      {"Alpine/Hurricane Ridge: Port Angeles. Rainforest/Hoh: Forks or camp in-park. Coast: La Push or Kalaloch Lodge. Sol Duc: Sol Duc Campground or day trip from Port Angeles."}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", marginBottom: 4 }}>Tide Awareness</div>
                    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.65, margin: 0 }}>
                      {"Critical for coastal hikes. Several trails (Hole-in-the-Wall, Ozette, coastal wilderness route) require low tide passage. Download a tide chart app (Tides Near Me or NOAA) before heading to the coast."}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", marginBottom: 4 }}>Rain & Gear</div>
                    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.65, margin: 0 }}>
                      {"The west-facing rainforest zone receives 140+ inches per year. Waterproof everything — pack layers, bring a dry bag, accept the rain as part of the experience. The east side (Port Angeles, Hurricane Ridge) is significantly drier."}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", marginBottom: 4 }}>Hurricane Ridge Road</div>
                    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.65, margin: 0 }}>
                      {"Open year-round on Saturdays and Sundays (weather permitting); generally open daily July–October. Check the park website before driving — road closures are common."}
                    </p>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", marginBottom: 4 }}>Wildlife Safety</div>
                    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.65, margin: 0 }}>
                      {"Black bear, Roosevelt elk, mountain goat, river otter, harbor seal. Keep 100 yards from elk and bear. Elk are bold and can be dangerous during rut (September–October)."}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.stone}` }}>
                  <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7A857E", marginBottom: 8 }}>Essential Links</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                      { label: "NPS Park Info", url: "https://www.nps.gov/olym" },
                      { label: "Hurricane Ridge Status", url: "https://www.nps.gov/olym/planyourvisit/hurricane-ridge.htm" },
                      { label: "Tide Charts", url: "https://tidesandcurrents.noaa.gov" },
                      { label: "WTA Trail Reports", url: "https://www.wta.org" },
                    ].map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                        fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600,
                        color: C.skyBlue, textDecoration: "none",
                        borderBottom: `1px solid ${C.skyBlue}40`,
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={e => e.target.style.borderColor = C.skyBlue}
                      onMouseLeave={e => e.target.style.borderColor = `${C.skyBlue}40`}
                      >{link.label} <span style={{ fontSize: 10 }}>↗</span></a>
                    ))}
                  </div>
                </div>
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
              <SectionSub isMobile={isMobile}>The Elwha is still recovering. The tribes never stopped tending it.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 8 }}>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Indigenous Giving</div>
                  <ListItem isMobile={isMobile} name="Lower Elwha Klallam Tribe"
                    url="https://www.elwha.org"
                    detail="The driving force behind the Elwha dam removal and river restoration. Tribe staff and volunteers have planted nearly 800 acres of dewatered lands with 425,000 native plants to date. The tribe accepts volunteers for restoration planting days — the most directly meaningful way to give back on the Peninsula."
                    tags={["Volunteer", "Support"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Conservation</div>
                  <ListItem isMobile={isMobile} name="North Olympic Land Trust"
                    url="https://northolympiclandtrust.org"
                    detail="Conserves land across Clallam County in the traditional homeland of the Hoh, Makah, Quileute, Jamestown S'Klallam, and Lower Elwha Klallam tribes. Volunteer for site stewardship, salmon habitat monitoring, and restoration work parties."
                    tags={["Donate", "Volunteer"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Trail Stewardship</div>
                  <ListItem isMobile={isMobile} name="Olympic Park Associates"
                    url="https://www.olympicparkassociates.org"
                    detail="The oldest friends group for Olympic National Park, funding research, conservation, and education programs inside the park boundary since 1948."
                    tags={["Donate", "Become a Member"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Trail Stewardship</div>
                  <ListItem isMobile={isMobile} name="Washington Trails Association (WTA)"
                    url="https://www.wta.org"
                    detail="Organizes trail maintenance work parties across the Olympic Peninsula. Day and weekend events — brushing, drainage work, blowdown clearing. Family-friendly and well-organized."
                    tags={["Trail Maintenance", "Family-Friendly", "Weekend Events"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Conservation</div>
                  <ListItem isMobile={isMobile} name="Friends of the Hoh"
                    url="https://friendsofthehoh.org"
                    detail="Small nonprofit supporting the Hoh Rainforest corridor — education, restoration, and advocacy for one of the world's rarest temperate rainforest ecosystems."
                    tags={["Donate", "Rainforest", "Advocacy"]} />
                </div>
              </div>
            </FadeIn>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CTA                                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="cta" style={{ scrollMarginTop: 126, padding: "56px 0 72px", textAlign: "center" }}>
            <FadeIn>
              <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: C.skyBlue, display: "block", marginBottom: 16 }}>Begin</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300, color: C.darkInk, margin: "0 0 10px", lineHeight: 1.2 }}>{"Your peninsula trip starts here"}</h3>
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
              onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'olympic-peninsula' })}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >{"Plan a Trip"}</Link>
            </FadeIn>
          </section>

          {/* Also Explore */}
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
                  { name: "Big Sur", slug: "big-sur", accent: C.seaGlass },
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

      <GuideDetailSheet item={activeSheet} onClose={() => setActiveSheet(null)} isMobile={isMobile} />
      <WhisperBar destination="olympic" label="Olympic Peninsula" />
      <Footer />
    </>
  );
}
