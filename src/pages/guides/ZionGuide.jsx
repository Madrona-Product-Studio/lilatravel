// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: ZION CANYON GUIDE (dedicated)
// ═══════════════════════════════════════════════════════════════════════════════
//
// Full editorial guide for Zion & its orbit. Uses shared Nav/Footer/FadeIn
// from the Lila Trips component library, with guide-specific components
// defined locally (ListItem, StayItem, ExpandableList).
//
// Route: /destinations/zion-canyon
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
import accommodations from '../../data/accommodations/zion.json';
import restaurants from '../../data/restaurants/zion.json';


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

// Minimal geometric icons matching the Rituals page
function SectionIcon({ type }) {
  const size = 28;
  const icons = {
    // Rotated diamond — Move
    move: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <rect x="14" y="2" width="15" height="15" rx="2" transform="rotate(45 14 2)"
          stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    // Circle — Breathe
    breathe: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10"
          stroke={C.seaGlass} strokeWidth="1.5" fill="none" />
      </svg>
    ),
    // Star/sparkle — Awaken
    awaken: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M14 3 L16 11 L24 14 L16 17 L14 25 L12 17 L4 14 L12 11 Z"
          stroke={C.sunSalmon} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
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
        <rect x="4" y="4" width="20" height="20" rx="2" stroke={C.goldenAmber} strokeWidth="1.5" fill="none" />
        <line x1="14" y1="4" x2="14" y2="24" stroke={C.goldenAmber} strokeWidth="1.5" />
        <line x1="4" y1="14" x2="24" y2="14" stroke={C.goldenAmber} strokeWidth="1.5" />
      </svg>
    ),
    // Threshold — crescent
    threshold: (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <path d="M18 6 A10 10 0 1 0 18 22 A7 7 0 1 1 18 6 Z"
          stroke={C.sunSalmon} strokeWidth="1.5" fill="none" />
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
        <circle cx="10" cy="10" r="3.5" stroke={C.sunSalmon} strokeWidth="1.5" fill="none" />
        <circle cx="18" cy="10" r="3.5" stroke={C.sunSalmon} strokeWidth="1.5" fill="none" />
        <path d="M4 22 C4 17 7 15 10 15 C11.5 15 12.5 15.5 14 16.5 C15.5 15.5 16.5 15 18 15 C21 15 24 17 24 22" stroke={C.sunSalmon} strokeWidth="1.5" fill="none" strokeLinecap="round" />
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
              padding: "2px 10px", border: `1px solid ${C.sunSalmon}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.sunSalmon,
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
              padding: "2px 10px", border: `1px solid ${C.sunSalmon}40`,
              fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase", color: C.sunSalmon,
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

  const nps = item.nps;
  const npsImages = nps?.images?.filter(img => img.url) || [];
  const npsPrimaryImage = npsImages[0];

  // Helper to strip HTML tags for clean display
  const stripHTML = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
  };

  // NPS info grid rows
  const npsInfoRows = [];
  if (nps) {
    if (nps.duration) npsInfoRows.push({ label: 'Duration', value: nps.duration });
    if (nps.season?.length) npsInfoRows.push({ label: 'Best Seasons', value: Array.isArray(nps.season) ? nps.season.join(', ') : nps.season });
    if (nps.location || nps.locationDescription) npsInfoRows.push({ label: 'Location', value: stripHTML(nps.locationDescription || nps.location || '') });
    // Accessibility is rendered separately below the grid
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
          display: 'inline-block', padding: '2px 10px', background: `${C.skyBlue}15`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.skyBlue, marginBottom: 10,
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
          display: 'inline-block', padding: '2px 10px', border: `1px solid ${C.sunSalmon}40`,
          fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase', color: C.sunSalmon, marginBottom: 14,
        }}>Lila Pick</span>
      )}

      {/* ═══ NPS ENRICHMENT (when available) ═══ */}
      {nps && (
        <>
          {/* NPS Photo */}
          {npsPrimaryImage && (
            <div style={{ margin: '0 -20px 18px', position: 'relative' }}>
              <img
                src={npsPrimaryImage.url}
                alt={npsPrimaryImage.altText || item.name}
                style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
              />
              {(npsPrimaryImage.caption || npsPrimaryImage.credit) && (
                <div style={{
                  padding: '6px 20px',
                  fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400,
                  color: '#7A857E', lineHeight: 1.5,
                }}>
                  {npsPrimaryImage.caption && <span>{npsPrimaryImage.caption}</span>}
                  {npsPrimaryImage.credit && (
                    <span style={{ fontStyle: 'italic' }}>{npsPrimaryImage.caption ? ' · ' : ''}Photo: {npsPrimaryImage.credit}</span>
                  )}
                </div>
              )}
              {/* Thumbnail strip */}
              {npsImages.length > 1 && (
                <div style={{
                  display: 'flex', gap: 3, padding: '0 20px', overflowX: 'auto',
                  scrollbarWidth: 'none', msOverflowStyle: 'none',
                }}>
                  {npsImages.slice(1, 5).map((img, i) => (
                    <img key={i} src={img.url} alt={img.altText || ''} style={{
                      width: 60, height: 42, objectFit: 'cover', opacity: 0.8,
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NPS Attribution */}
          <a
            href={nps.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', marginBottom: 18,
              background: '#2D5F2B0D',
              border: '1px solid #2D5F2B18',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2D5F2B18'}
            onMouseLeave={e => e.currentTarget.style.background = '#2D5F2B0D'}
          >
            <NPSArrowhead size={20} color="#2D5F2B" />
            <div>
              <div style={{
                fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 500,
                color: '#2D5F2B', lineHeight: 1.5,
              }}>
                Trail information provided by the <strong>National Park Service</strong>
              </div>
              <div style={{
                fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#2D5F2B', opacity: 0.6, marginTop: 2,
              }}>View on NPS.gov ↗</div>
            </div>
          </a>

          {/* NPS Description */}
          {(nps.longDescription || nps.shortDescription) && (
            <div style={{ marginBottom: 18 }}>
              <div style={{
                fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#2D5F2B', marginBottom: 8,
              }}>NPS Description</div>
              <p style={{
                fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400,
                color: '#4A5650', lineHeight: 1.75, margin: 0,
              }}>{stripHTML(nps.longDescription || nps.shortDescription)}</p>
            </div>
          )}

          {/* NPS Info Grid */}
          {npsInfoRows.length > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '10px 16px', marginBottom: 20,
              padding: '14px 0',
              borderTop: `1px solid ${C.stone}`,
              borderBottom: `1px solid ${C.stone}`,
            }}>
              {npsInfoRows.map((row, i) => (
                <div key={i} style={row.label === 'Location' ? { gridColumn: '1 / -1' } : {}}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: '#7A857E', marginBottom: 3,
                  }}>{row.label}</div>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 500,
                    color: C.darkInk, lineHeight: 1.5,
                  }}>{row.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* NPS Trail Accessibility — structured breakdown */}
          {nps.accessibilityInformation && (() => {
            const html = nps.accessibilityInformation;
            const clean = (s) => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\xa0/g, ' ').replace(/<[^>]*>/g, '').trim();

            // Check if it's the structured <ul><li><b>Label | </b>Value format
            const liMatches = html.match(/<li>([\s\S]*?)<\/li>/gi);
            if (!liMatches || liMatches.length === 0) {
              // Simple plain-text accessibility note (e.g. "Strenuous trail with...")
              const text = clean(html);
              if (!text) return null;
              return (
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: '#7A857E', marginBottom: 8,
                  }}>Accessibility</div>
                  <p style={{
                    fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400,
                    color: '#4A5650', lineHeight: 1.6, margin: 0,
                  }}>{text}</p>
                </div>
              );
            }

            // Parse structured <li> items: <b>Label  |  </b>Value  |  Value2
            const rows = liMatches.map(li => {
              const inner = li.replace(/<\/?li>/gi, '');
              // Extract the bold label
              const boldMatch = inner.match(/<b>([\s\S]*?)<\/b>/);
              const label = boldMatch
                ? clean(boldMatch[1]).replace(/\s*\|\s*$/, '').trim()
                : '';
              // Everything after the first </b> is the value (may contain more <b>|</b> separators)
              const valueHtml = boldMatch
                ? inner.slice(inner.indexOf('</b>') + 4)
                : inner;
              // Split on bold pipe separators: <b> | </b> or <b>|</b>
              const valueParts = valueHtml
                .split(/<b>\s*\|?\s*<\/b>|<b>\s*\|\s*<\/b>/)
                .map(clean)
                .filter(Boolean);
              // Also split remaining plain-text pipe separators within each part
              const finalParts = [];
              for (const part of valueParts) {
                // Don't split on | inside measurements like "12 in | 30 cm" — only split on spaced pipes
                part.split(/\s+\|\s+/).forEach(p => { if (p.trim()) finalParts.push(p.trim()); });
              }
              return { label, values: finalParts };
            });

            // Check for a footnote paragraph after the list
            const footnoteMatch = html.match(/<p>([\s\S]*?)<\/p>/i);
            const footnote = footnoteMatch ? clean(footnoteMatch[1]) : null;

            return (
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#7A857E', marginBottom: 10,
                }}>Trail Accessibility</div>
                <div style={{
                  border: `1px solid ${C.stone}`,
                  background: `${C.stone}18`,
                }}>
                  {rows.map((row, i) => (
                    <div key={i} style={{
                      padding: '9px 14px',
                      borderBottom: `1px solid ${C.stone}`,
                    }}>
                      {row.label && (
                        <div style={{
                          fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700,
                          color: C.darkInk, marginBottom: 3,
                        }}>{row.label}</div>
                      )}
                      {row.values.map((val, j) => (
                        <div key={j} style={{
                          fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400,
                          color: '#4A5650', lineHeight: 1.6,
                        }}>{val}</div>
                      ))}
                    </div>
                  ))}
                  {footnote && (
                    <div style={{
                      padding: '8px 14px',
                      fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400,
                      fontStyle: 'italic', color: '#7A857E', lineHeight: 1.5,
                    }}>{footnote}</div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Lila's Take — editorial content below NPS */}
          {(item.detail || item.note) && (
            <div style={{
              padding: '14px 16px', marginBottom: 18,
              background: `${C.goldenAmber}08`,
              borderLeft: `3px solid ${C.goldenAmber}40`,
            }}>
              <div style={{
                fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: C.goldenAmber, marginBottom: 8,
              }}>Our Take</div>
              {item.detail && (
                <p style={{
                  fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 400,
                  color: '#4A5650', lineHeight: 1.7, margin: '0 0 6px',
                }}>{item.detail}</p>
              )}
              {item.note && (
                <div style={{
                  fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600,
                  color: C.oceanTeal,
                }}>{item.note}</div>
              )}
            </div>
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
        </>
      )}

      {/* ═══ STANDARD CONTENT (no NPS, or items without NPS data) ═══ */}
      {!nps && (
        <>
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
        </>
      )}

      {/* Visit Website link */}
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
              background: `${C.white}e0`, border: `1px solid ${C.sage}15`,
              borderRadius: '50%', cursor: 'pointer',
              fontFamily: "'Quicksand', sans-serif", fontSize: 15, color: C.sage, lineHeight: 1,
              WebkitTapHighlightColor: 'transparent',
              boxShadow: `0 2px 8px ${C.ink}08`,
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
            background: `${C.sage}30`, margin: '0 auto 8px',
          }} />
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{
            position: 'absolute', top: 8, right: 14,
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${C.white}e0`, border: `1px solid ${C.sage}15`,
            borderRadius: '50%', cursor: 'pointer',
            fontFamily: "'Quicksand', sans-serif", fontSize: 15, color: C.sage, lineHeight: 1,
            WebkitTapHighlightColor: 'transparent',
            boxShadow: `0 2px 8px ${C.ink}08`,
          }} aria-label="Close">✕</button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
          {content}
        </div>
      </div>
    </>
  );
}

function WildlifeEntry({ name, season, detail, accent, isMobile }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 4,
      padding: "16px 0", borderBottom: `1px solid ${C.stone}`,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk }}>{name}</span>
        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: accent }}>{season}</span>
      </div>
      <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 400, color: "#4A5650", lineHeight: 1.7, margin: 0 }}>{detail}</p>
    </div>
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
          {/* Eyebrow */}
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
          {/* Name */}
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 400,
            color: C.darkInk, lineHeight: 1.15, marginBottom: chips.length ? 8 : 0,
          }}>{park.name}</div>
          {/* Chips */}
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
        {/* Icon + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <DesignationIcon designation={park.designation} size={16} color={park.accent} />
          <span style={{
            display: "inline-block", fontSize: 14, color: "#7A857E", lineHeight: 1,
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}>▾</span>
        </div>
      </button>
      {/* Expanded body */}
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

// ─── Wildlife Drawer ────────────────────────────────────────────────────────

function WildlifeDrawer({ isMobile }) {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState("Mammals");
  const [expandedEntry, setExpandedEntry] = useState(null);

  const group = WILDLIFE_GROUPS.find(g => g.label === activeGroup);

  return (
    <div style={{ border: `1px solid ${C.stone}`, background: C.cream, marginTop: 28 }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: isMobile ? "16px 18px" : "18px 22px",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C9 2 3 5 3 10C3 13.3137 5.68629 16 9 16C12.3137 16 15 13.3137 15 10C15 5 9 2 9 2Z"
              stroke={C.seaGlass} strokeWidth="1.2" fill="none" />
            <line x1="9" y1="16" x2="9" y2="8" stroke={C.seaGlass} strokeWidth="1.2" />
            <line x1="9" y1="11" x2="6" y2="9" stroke={C.seaGlass} strokeWidth="1" />
            <line x1="9" y1="13" x2="12" y2="11" stroke={C.seaGlass} strokeWidth="1" />
          </svg>
          <div>
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", color: C.seaGlass, marginBottom: 2 }}>
              The Living Corridor
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 17 : 19, fontWeight: 400, color: C.darkInk, lineHeight: 1.1 }}>
              Plants &amp; Wildlife
            </div>
          </div>
        </div>
        <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "#7A857E", display: "flex", alignItems: "center", gap: 6 }}>
          <span>{open ? "Collapse" : "Explore"}</span>
          <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", fontSize: 13 }}>↓</span>
        </div>
      </button>

      {/* Body */}
      <div style={{ maxHeight: open ? 1200 : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
        <div style={{ borderTop: `1px solid ${C.stone}` }}>
          {/* Intro */}
          <div style={{ padding: isMobile ? "16px 18px 12px" : "18px 22px 12px" }}>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.7, margin: 0 }}>
              Zion sits at the crossroads of four ecological zones. Bryce's high plateaus add a fifth dimension. Capitol Reef's Waterpocket Fold creates micro-climates found nowhere else. Together, the corridor hosts 78 mammal species, 291 birds, and plant life that shifts from desert floor to subalpine forest within a single day's drive.
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderTop: `1px solid ${C.stone}`, borderBottom: `1px solid ${C.stone}` }}>
            {WILDLIFE_GROUPS.map(g => (
              <button key={g.label}
                onClick={() => { setActiveGroup(g.label); setExpandedEntry(null); }}
                style={{
                  flex: 1, padding: "11px 8px", background: activeGroup === g.label ? `${g.accent}10` : "transparent",
                  border: "none", borderBottom: `2px solid ${activeGroup === g.label ? g.accent : "transparent"}`,
                  cursor: "pointer", fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: activeGroup === g.label ? g.accent : "#7A857E", transition: "all 0.2s",
                }}
              >{g.label}</button>
            ))}
          </div>

          {/* Entries */}
          <div style={{ padding: "4px 0 8px" }}>
            {group.entries.map((entry, i) => {
              const isExpanded = expandedEntry === i;
              return (
                <div key={i} style={{ borderBottom: i < group.entries.length - 1 ? `1px solid ${C.stone}` : "none" }}>
                  <button
                    onClick={() => setExpandedEntry(isExpanded ? null : i)}
                    style={{
                      width: "100%", padding: isMobile ? "13px 18px" : "14px 22px",
                      background: isExpanded ? `${group.accent}08` : "transparent",
                      border: "none", cursor: "pointer",
                      display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, textAlign: "left",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 600, color: C.darkInk }}>{entry.name}</span>
                        <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: group.accent }}>{entry.season}</span>
                      </div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {entry.parks.map((p, pi) => (
                          <span key={p} style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 500, color: "#7A857E", letterSpacing: "0.04em" }}>
                            {p}{pi < entry.parks.length - 1 ? " ·" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span style={{ display: "inline-block", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s", color: "#7A857E", fontSize: 13, flexShrink: 0, marginTop: 2 }}>↓</span>
                  </button>
                  <div style={{ maxHeight: isExpanded ? 200 : 0, overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
                    <div style={{ padding: isMobile ? "0 18px 16px" : "0 22px 16px" }}>
                      <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, color: "#4A5650", lineHeight: 1.75, margin: 0, borderLeft: `2px solid ${group.accent}50`, paddingLeft: 12 }}>
                        {entry.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Offering Cards (new) ────────────────────────────────────────────────────

function OfferingCard({ icon, label, title, description, cta, ctaAction, accent, secondary }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "32px 28px",
        background: hovered ? `${accent}08` : "transparent",
        border: `1px solid ${hovered ? accent : C.stone}`,
        transition: "all 0.3s ease",
        display: "flex", flexDirection: "column",
        cursor: "default",
        minWidth: 0,
      }}
    >
      <div style={{ marginBottom: 20 }}>{icon}</div>
      <div style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: 11, fontWeight: 700,
        letterSpacing: "0.22em", textTransform: "uppercase",
        color: accent, marginBottom: 10,
      }}>{label}</div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 400,
        color: C.darkInk, lineHeight: 1.2, marginBottom: 14,
      }}>{title}</div>
      <p style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: 14, fontWeight: 400,
        color: "#4A5650", lineHeight: 1.65, margin: "0 0 auto",
        paddingBottom: 24,
      }}>{description}</p>
      <button
        onClick={ctaAction}
        style={{
          alignSelf: "flex-start",
          padding: "11px 22px",
          background: "transparent",
          border: `1.5px solid ${accent}`,
          color: accent,
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.16em", textTransform: "uppercase",
          cursor: "pointer", transition: "all 0.25s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = accent; }}
      >{cta}</button>
      {secondary && (
        <div style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, fontWeight: 500, color: "#7A857E",
          marginTop: 10, letterSpacing: "0.04em",
        }}>{secondary}</div>
      )}
    </div>
  );
}


// ─── Plan My Trip CTA (contextual mid-page prompt) ──────────────────────────

function PlanMyTripCTA({ variant = "default" }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const variants = {
    default: {
      heading: "Ready to build your trip?",
      body: "Unlock the Zion Trip Planner — turn your favorite picks into a day-by-day itinerary with booking links, optimal timing, and offline access.",
      cta: "Unlock Trip Planner — $39",
      bg: C.cream,
      border: C.stone,
    },
    afterStay: {
      heading: "Found your place to stay?",
      body: "The Trip Planner pairs your accommodation with curated daily itineraries — trails, meals, and golden-hour timing built around where you're sleeping.",
      cta: "Unlock Trip Planner — $39",
      bg: C.cream,
      border: C.stone,
    },
    afterMove: {
      heading: "That's a lot of trails.",
      body: "The Trip Planner sequences the best hikes by day, handles permit timing, and builds in recovery between the big ones. We've done this route dozens of times.",
      cta: "Unlock Trip Planner — $39",
      bg: C.cream,
      border: C.stone,
    },
    custom: {
      heading: "Want someone to build it for you?",
      body: "Tell us your dates, your group, and what matters most. We'll create a personalized Zion itinerary — every detail handled.",
      cta: "Request Custom Itinerary — from $199",
      bg: C.darkInk,
      border: "transparent",
    },
  };

  const v = variants[variant] || variants.default;
  const isDark = variant === "custom";

  return (
    <FadeIn>
      <div style={{
        padding: "32px 28px",
        background: v.bg,
        border: `1px solid ${v.border}`,
        margin: "8px 0",
        textAlign: "center",
      }}>
        {!isDark && (
          <div style={{ marginBottom: 12 }}>
            <SectionIcon type="plan" />
          </div>
        )}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 400,
          color: isDark ? "#fff" : C.darkInk, lineHeight: 1.2,
          marginBottom: 8,
        }}>{v.heading}</div>
        <p style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
          color: isDark ? "rgba(255,255,255,0.75)" : "#4A5650",
          lineHeight: 1.65, maxWidth: 480, margin: "0 auto 24px",
        }}>{v.body}</p>
        <button
          onClick={() => navigate('/plan')}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            padding: "12px 32px",
            background: isDark
              ? (hovered ? "#fff" : "transparent")
              : (hovered ? C.darkInk : "transparent"),
            border: isDark
              ? "1.5px solid rgba(255,255,255,0.4)"
              : `1.5px solid ${C.darkInk}`,
            color: isDark
              ? (hovered ? C.darkInk : "#fff")
              : (hovered ? "#fff" : C.darkInk),
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            cursor: "pointer", transition: "all 0.3s",
          }}
        >{v.cta}</button>
        {!isDark && (
          <div style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 11, fontWeight: 500, color: "#7A857E",
            marginTop: 12, letterSpacing: "0.04em",
          }}>One-time purchase · Includes offline access</div>
        )}
      </div>
    </FadeIn>
  );
}


// ─── Threshold Trip Card (new) ───────────────────────────────────────────────

function ThresholdTripCard({ title, dates, duration, description, spotsLeft, accent = C.sunSalmon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{
      padding: 28, background: C.darkInk,
      marginBottom: 12,
      transition: "all 0.3s",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
      }}>
        <div style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
          color: accent,
        }}>Threshold Trip</div>
        {spotsLeft && (
          <div style={{
            padding: "2px 10px",
            border: `1px solid ${accent}40`,
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: accent,
          }}>{spotsLeft} spots left</div>
        )}
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 300, color: "white", marginBottom: 4, lineHeight: 1.2,
      }}>{title}</div>
      <div style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
        color: accent, marginBottom: 16,
      }}>{dates} · {duration} · Guided group</div>
      <p style={{
        fontFamily: "'Quicksand', sans-serif",
        fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
        lineHeight: 1.7, color: "rgba(255,255,255,0.75)", margin: "0 0 24px",
      }}>{description}</p>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            padding: "11px 28px",
            border: `1px solid rgba(255,255,255,0.4)`,
            background: hovered ? "white" : "transparent",
            color: hovered ? C.darkInk : "white",
            fontFamily: "'Quicksand', sans-serif",
            fontSize: 12, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase",
            cursor: "pointer", transition: "all 0.3s",
          }}
        >Express Interest</button>
        <span style={{
          fontFamily: "'Quicksand', sans-serif",
          fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.04em",
        }}>From $895 per person</span>
      </div>
    </div>
  );
}



// ─── Corridor Parks & Wildlife Data ──────────────────────────────────────────

const PARKS = [
  {
    id: "zion", name: "Zion", designation: "us-national-park", established: 1919,
    acreage: "147,242 ac", elevation: "3,666–8,726 ft", attribute: "Virgin River narrows",
    soul: "The canyon that stops you mid-sentence. Carved by the Virgin River through 2,000 ft of Navajo sandstone — walls that glow copper at sunrise, amber at midday, impossible pink at dusk.",
    facts: [
      "Carved by the Virgin River over 250 million years",
      "Home to the slot canyon known as The Narrows",
      "Named Mukuntuweap by the Southern Paiute",
    ],
    infoUrl: "https://www.nps.gov/zion/",
    driveFrom: null, accent: C.sunSalmon, isAnchor: true,
  },
  {
    id: "bryce", name: "Bryce Canyon", designation: "us-national-park", established: 1928,
    acreage: "35,835 ac", elevation: "8,000–9,115 ft", attribute: "Darkest night skies",
    soul: "A forest of stone spires that blushed and never recovered. Not a canyon at all — a series of natural amphitheaters eroded into the Paunsaugunt Plateau.",
    facts: [
      "Not a canyon — a series of natural amphitheaters",
      "One of the darkest night skies in the continental US",
      "Named for settler Ebenezer Bryce, who called it 'a hell of a place to lose a cow'",
    ],
    infoUrl: "https://www.nps.gov/brca/",
    driveFrom: "~1.5 hrs from Zion", accent: C.goldenAmber, isAnchor: false,
  },
  {
    id: "capitol-reef", name: "Capitol Reef", designation: "us-national-park", established: 1971,
    acreage: "241,904 ac", elevation: "3,900–8,960 ft", attribute: "Waterpocket Fold",
    soul: "The hidden wrinkle in the earth that most people drive past. The Waterpocket Fold — a 100-mile warp in the crust — runs through orchards still harvested by visitors.",
    facts: [
      "The Waterpocket Fold — a 100-mile warp in the earth's crust",
      "Fruita Historic District: an orchard still harvested by visitors",
      "Far fewer crowds than Zion or Bryce despite comparable grandeur",
    ],
    infoUrl: "https://www.nps.gov/care/",
    driveFrom: "~3 hrs from Zion", accent: C.oceanTeal, isAnchor: false,
  },
];

const WILDLIFE_GROUPS = [
  {
    label: "Mammals",
    accent: C.sunSalmon,
    entries: [
      { name: "Desert Bighorn Sheep", parks: ["Zion", "Capitol Reef"], season: "Year-round", detail: "Often spotted on sheer canyon walls where no foothold seems possible. They descend to water sources at dawn. In Zion, Angels Landing and the Kayenta Trail are reliable sighting zones." },
      { name: "Mule Deer", parks: ["Zion", "Bryce Canyon", "Capitol Reef"], season: "Year-round", detail: "The canyon's most visible mammal. They gather along river corridors at dusk, moving unhurried through cottonwood groves. Early morning light finds them best near Zion Lodge meadows." },
      { name: "Pronghorn", parks: ["Bryce Canyon", "Capitol Reef"], season: "Spring – Fall", detail: "The fastest land animal in the Western Hemisphere, capable of 55 mph. Spotted most often on open plateaus above Bryce and in Capitol Reef's Fruita Valley." },
    ],
  },
  {
    label: "Birds",
    accent: C.skyBlue,
    entries: [
      { name: "California Condor", parks: ["Zion"], season: "Year-round", detail: "One of the rarest birds on earth. With a wingspan over nine feet, condors ride thermal columns above the canyon walls — often spotted near Angels Landing. There are roughly 95 flying free in Arizona and Utah." },
      { name: "Peregrine Falcon", parks: ["Zion", "Capitol Reef"], season: "Mar – Sep", detail: "Nesting on sheer sandstone faces, they dive at speeds exceeding 240 mph. The canyon walls amplify their call — a sharp, insistent cry that bounces between the walls before you locate the source." },
      { name: "Steller's Jay", parks: ["Bryce Canyon"], season: "Year-round", detail: "Electric blue against the red hoodoos. Bryce's high-elevation ponderosa forest is prime territory. Bold and social — they'll find your lunch before you do." },
    ],
  },
  {
    label: "Plants",
    accent: C.seaGlass,
    entries: [
      { name: "Desert Wildflowers", parks: ["Zion", "Capitol Reef"], season: "Mar – Apr", detail: "After a wet winter, the canyon floor erupts — sacred datura, cliffrose, scarlet gilia, and prickly pear in bloom. Capitol Reef's orchards blossom simultaneously, for one of the most extraordinary weeks in Utah." },
      { name: "Fremont Cottonwood", parks: ["Zion", "Capitol Reef"], season: "Late Sep – Oct", detail: "The cottonwoods lining the Virgin River and Capitol Reef's Fremont River turn gold in late September. A transformation that lasts only a few weeks — the quiet crescendo most visitors don't know to look for." },
      { name: "Bristlecone Pine", parks: ["Bryce Canyon"], season: "Year-round", detail: "Among the oldest living organisms on Earth — some individuals exceed 1,600 years. Found at Bryce's highest elevations, twisted by wind, stripped to silver by weather. They look like they've seen everything. They have." },
    ],
  },
];

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

  // Observe which section is in view (desktop only)
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
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
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
    <nav
      style={{
        position: "sticky",
        top: 72,
        zIndex: 90,
        background: "rgba(250, 247, 243, 0.97)",
        borderTop: `1px solid ${C.stone}`,
        borderBottom: `1px solid ${C.stone}`,
      }}
    >
      <div style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "4px 40px 0",
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
              gap: 0,
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
          <style>{`
            .guide-nav-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          {GUIDE_SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => handleClick(section.id)}
                className="guide-nav-scroll"
                style={{
                  padding: "0 14px",
                  height: 44,
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${isActive ? C.oceanTeal : "transparent"}`,
                  cursor: "pointer",
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: 11,
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

export default function ZionGuide() {
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

  // ── NPS Data ──
  const [npsLookup, setNpsLookup] = useState(null);
  useEffect(() => {
    getNPSData(['zion', 'brca', 'care'])
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
        <title>Zion Canyon Guide — Trails, Dark Sky & Responsible Adventure | Lila Trips</title>
        <meta name="description" content="Curated trails, dark sky windows, and wellness practices for travelers who want to move through Zion with intention — and leave it intact." />
        <link rel="canonical" href="https://lilatrips.com/destinations/zion-canyon" />
        <meta property="og:title" content="Zion Canyon Guide — Trails, Dark Sky & Responsible Adventure | Lila Trips" />
        <meta property="og:description" content="Curated trails, dark sky windows, and wellness practices for travelers who want to move through Zion with intention — and leave it intact." />
        <meta property="og:url" content="https://lilatrips.com/destinations/zion-canyon" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Zion Canyon — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zion Canyon Guide — Trails, Dark Sky & Responsible Adventure | Lila Trips" />
        <meta name="twitter:description" content="Curated trails, dark sky windows, and wellness practices for travelers who want to move through Zion with intention — and leave it intact." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav />

      {/* ══ CELESTIAL DRAWER ═══════════════════════════════════════════════ */}
      <CelestialDrawer destination="zion" isMobile={isMobile} />

      {/* ══ TITLE MASTHEAD ═══════════════════════════════════════════════════ */}
      <section style={{ background: C.cream }}>
        <div style={{ padding: isMobile ? "28px 20px 24px" : "44px 52px 40px", maxWidth: 920, margin: "0 auto" }}>
          <FadeIn from="bottom" delay={0.1}>


            {/* Two column layout */}
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 28 : 52, alignItems: "start",
              marginTop: 0,
            }}>

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow" style={{ color: C.sunSalmon, marginBottom: 14, display: "block" }}>Destination Guide</span>

                <h1 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 300,
                  color: C.darkInk, lineHeight: 1.0,
                  margin: "0 0 22px", letterSpacing: "-0.02em",
                }}>
                  Zion &amp; its orbit
                </h1>

                {/* The land's history */}
                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: "0 0 14px",
                }}>
                  The Southern Paiute called this place <span style={{ color: C.darkInk }}>Mukuntuweap</span>. The sandstone is 170 million years old. For thousands of years, this land has drawn people inward.
                </p>

                {/* Why we think it's magical */}
                <p style={{
                  fontFamily: "'Quicksand', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 14px)", fontWeight: 400,
                  color: "#4A5650", lineHeight: 1.75, maxWidth: 460,
                  margin: 0,
                }}>
                  The scale quiets the mind. The light feels earned. Something here shifts — and we built this guide to help you find it.
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

                {/* Parks */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: C.seaGlass, marginBottom: 10,
                  }}>Parks</div>
                  {[
                    { label: "Zion National Park", url: "https://www.nps.gov/zion/" },
                    { label: "Bryce Canyon National Park", url: "https://www.nps.gov/brca/" },
                    { label: "Capitol Reef National Park", url: "https://www.nps.gov/care/" },
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
                    color: C.goldenAmber, marginBottom: 10,
                  }}>Gateway Towns</div>
                  {["Springdale", "Kanab", "Escalante", "Torrey"].map((town, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10, marginBottom: 7,
                    }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: C.goldenAmber, opacity: 0.5,
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
            { src: P.zionWatchman,    alt: "The Watchman at golden hour",     caption: "The Watchman at golden hour",       width: 420 },
            { src: P.zionNarrows,     alt: "The Narrows",                    caption: "The Narrows — ankle to waist",      width: 280 },
            { src: P.bryceCanyon,     alt: "Bryce Canyon hoodoos",           caption: "Bryce Canyon hoodoos",              width: 420 },
            { src: P.capitolReef,     alt: "Capitol Reef at sunset",         caption: "Capitol Reef at sunset",            width: 360 },
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
                {"Zion Canyon was carved over millions of years by the Virgin River cutting through Navajo sandstone. The walls glow copper at sunrise, amber at midday, impossible pink at dusk. The Paiute called it Mukuntuweap — \"straight-up land.\" Whatever name you give it, the experience is the same: you stand among these walls of stone and you stop talking."}
              </p>
              <p style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 15px)", lineHeight: 1.8,
                fontWeight: 400, color: "#4A5650", margin: "0 0 28px",
              }}>
                This guide covers the full orbit — three parks, three personalities, one continuous landscape. Zion pulls you in. Bryce lifts you up. Capitol Reef reminds you the earth is still becoming.
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: isMobile ? 12 : 16, padding: isMobile ? 16 : 20,
                background: C.cream, border: `1px solid ${C.stone}`,
                marginBottom: 20,
              }}>
                {[
                  { l: "Recommended", v: "4–7 days" },
                  { l: "Nearest Airport", v: "Las Vegas (LAS)" },
                  { l: "Drive from LAS", v: "~2.5 hours" },
                  { l: "Best Times", v: "Mar–May, Sep–Nov" },
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

            {/* ── Wildlife Drawer ── */}
            <FadeIn delay={0.1}>
              <WildlifeDrawer isMobile={isMobile} />
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* MAGIC WINDOWS                                                 */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="when-to-go" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="windows" />
              <SectionLabel>Magic Windows</SectionLabel>
              <SectionTitle>When to go</SectionTitle>
              <SectionSub isMobile={isMobile}>Zion transforms with the seasons. These are the moments when the land is most alive.</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name={"Early Autumn — The Golden Corridor"} featured
                  detail="Cottonwoods turn gold along the Virgin River. Crowds thin. Light goes amber. Best hiking weather of the year."
                  tags={["Late Sep – Oct", "Golden Light", "Best Weather"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Desert Bloom" featured
                  detail="After a wet winter, the desert floor erupts in wildflowers. Cacti crown themselves. Timing is everything — and unpredictable."
                  tags={["Mar – Apr", "Wildflowers", "Variable"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Winter Solstice"
                  detail="Shortest day, most dramatic canyon light. Snow dusting the upper walls at sunset. Fewer people, deeper silence."
                  tags={["Dec 19–22", "Solstice", "Canyon Light"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('When to Go')} name="Dark Sky Season"
                  detail="Late summer and early fall offer warm nights for stargazing. The Milky Way peaks overhead from June through September."
                  tags={["Jun – Sep", "Milky Way", "Warm Nights"]} />
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
              <SectionSub isMobile={isMobile}>The canyon has been here for 250 million years. How you move through it matters.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 8 }}>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Cryptobiotic Soil</div>
                  <ListItem isMobile={isMobile} name="The ground is alive. Stay on the trail."
                    detail="The dark, lumpy biological crust visible just off the path is cryptobiotic soil — a living community of cyanobacteria, lichens, and fungi that can take 50–250 years to recover from a single footstep. It holds the desert floor together, fixes nitrogen, and retains moisture. It looks like nothing. It is everything. The trail exists for a reason."
                    tags={["Stay on trail", "Desert fragility"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>The Narrows · Peak Season</div>
                  <ListItem isMobile={isMobile} name="Dawn entry isn't just better. It's right."
                    detail="The Narrows receives nearly 3,000 visitors on a peak summer day. By 9am, the slot canyon is a slow-moving crowd. Dawn entry — before the shuttle starts running — means the river is yours, the light is extraordinary, and you're carrying a smaller footprint through one of the most fragile corridors in the park. We route toward it every time."
                    note="◈ Arrive at the Temple of Sinawava trailhead no later than 6:30am in July–August"
                    tags={["Off-peak timing", "Low impact", "Dawn entry"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Angels Landing · Permit System</div>
                  <ListItem isMobile={isMobile} name="The lottery exists because we loved it too hard."
                    detail="Angels Landing now requires a permit — not because the NPS wanted to gatekeep it, but because the trail was eroding under the weight of unmanaged visitation. The permit system is an act of conservation. If you don't get one, the West Rim Trail above Scouts Lookout offers the same exposure and a fraction of the crowd. We're happy to route you there instead."
                    tags={["Permit required", "Alternatives available"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Virgin River · Water Ethics</div>
                  <ListItem isMobile={isMobile} name="What goes in comes out downstream."
                    detail="The Virgin River runs through the entire canyon and sustains one of the most biodiverse riparian corridors in the American Southwest. Sunscreen, insect repellent, and soap — even biodegradable — affect the aquatic ecosystem. Apply well before you enter the water. Pack out everything. The river is not a wash."
                    tags={["Water stewardship", "Riparian habitat"]} />
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
              <SectionSub isMobile={isMobile}>How you inhabit a place matters. Options across the full spectrum — from sleeping under the stars to world-class luxury.</SectionSub>
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
                  { label: "Premium", desc: "World-class", color: C.goldenAmber },
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
                {accommodations.filter(a => !a.corridor).map(a => (
                  <StayItem
                    key={a.id}
                    name={a.name}
                    location={a.location}
                    tier={a.stayStyle}
                    detail={a.highlights?.[0]}
                    tags={a.tags}
                    url={a.links?.booking || a.links?.website}
                    featured={a.lilaPick}
                    isMobile={isMobile}
                    onOpenSheet={setActiveSheet}
                  />
                ))}
              </ExpandableList>

              {accommodations.filter(a => a.corridor).length > 0 && (
                <>
                  <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 600,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: C.warmGray, marginTop: 32, marginBottom: 12 }}>
                    Regional Corridor
                  </p>
                  {accommodations.filter(a => a.corridor).map(a => (
                    <StayItem
                      key={a.id}
                      name={a.name}
                      location={a.location}
                      tier={a.stayStyle}
                      detail={a.highlights?.[0]}
                      tags={a.tags}
                      url={a.links?.booking || a.links?.website}
                      featured={a.lilaPick}
                      isMobile={isMobile}
                      onOpenSheet={setActiveSheet}
                    />
                  ))}
                </>
              )}
            </div>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* MOVE                                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="trails" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="move" />
              <SectionLabel>Move</SectionLabel>
              <SectionTitle>Hikes, trails &amp; adventures</SectionTitle>
              <SectionSub isMobile={isMobile}>{"From easy canyon strolls to world-class challenges. The terrain teaches you something new at every elevation."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="trails & adventures">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Angels Landing" featured
                  hasNPS={checkNPS("Angels Landing")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail={"The iconic chain-assisted ridgeline summit. Exposure, adrenaline, and views that justify every step. Permit required — book 3 months out."}
                  note="Permit required — recreation.gov · Seasonal lottery"
                  tags={["5.4 mi RT", "Strenuous", "1,488 ft gain", "Permit"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="The Narrows" featured
                  hasNPS={checkNPS("The Narrows")}
                  url="https://www.nps.gov/zion/planyourvisit/thenarrows.htm"
                  detail="Hiking through the Virgin River between thousand-foot walls. Water levels dictate access — check conditions daily. Rent gear in Springdale."
                  note="River-level dependent — check NPS morning reports"
                  tags={["Up to 10 mi", "Moderate–Strenuous", "Water Hiking"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="The Subway" featured
                  hasNPS={checkNPS("The Subway")}
                  url="https://www.nps.gov/zion/planyourvisit/the-subway.htm"
                  detail="A tunnel-shaped canyon carved by flowing water. Technical bottom-up route or wilderness top-down. Unforgettable geology."
                  tags={["9 mi RT", "Technical", "Permit Required"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Canyon Overlook Trail"
                  hasNPS={checkNPS("Canyon Overlook Trail")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Short, punchy, with one of the best views in the park. East side of the tunnel. Arrive early or at sunset."
                  tags={["1 mi RT", "Easy–Moderate", "Sunset", "Family Friendly"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Observation Point"
                  hasNPS={checkNPS("Observation Point")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Higher than Angels Landing, quieter, arguably more stunning. Full panorama of Zion Canyon."
                  tags={["8 mi RT", "Strenuous", "2,150 ft gain"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Kolob Canyons"
                  hasNPS={checkNPS("Kolob Canyons")}
                  url="https://www.nps.gov/zion/planyourvisit/kolob-canyons-wilderness-hiking-trails.htm"
                  detail={"Zion's quiet northern section. Fewer visitors, deeper solitude. Finger canyons of red Navajo sandstone."}
                  tags={["Multiple Trails", "Remote", "Separate Entrance"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Hidden Canyon"
                  hasNPS={checkNPS("Hidden Canyon")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="A narrow slot canyon reached by a chain-assisted trail. Small, intimate, often overlooked."
                  tags={["2.4 mi RT", "Moderate–Strenuous", "Chains"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Emerald Pools"
                  hasNPS={checkNPS("Emerald Pools")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Three tiers of pools and waterfalls, increasingly beautiful as you climb. Upper pool is the reward."
                  tags={["1–3 mi RT", "Easy–Moderate", "Family Friendly"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name={"Pa'rus Trail"}
                  hasNPS={checkNPS("Pa'rus Trail")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Flat, paved riverside trail. Bikes allowed. Perfect for decompression, morning walks, or families."
                  tags={["3.5 mi RT", "Easy", "Paved", "Bikes OK"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Watchman Trail"
                  hasNPS={checkNPS("Watchman Trail")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="A moderate loop to a viewpoint overlooking the town of Springdale, the Towers of the Virgin, and lower Zion Canyon. Best at sunset when the Watchman ignites."
                  tags={["3.3 mi RT", "Moderate", "Views", "Sunset"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Snow Canyon State Park"
                  url="https://stateparks.utah.gov/parks/snow-canyon/"
                  detail="Red and white sandstone, lava flows, and sand dunes 45 min from Zion. Far fewer crowds."
                  note="Near St. George — great half-day trip"
                  tags={["State Park", "Lava Tubes", "Less Crowded"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Scenic Drive to Capitol Reef"
                  detail="The 2.5-hour drive via Highway 12 is one of the most beautiful roads in America. Make it the journey, not the commute."
                  tags={["Scenic Drive", "Half Day", "Highway 12"]} />

                {/* ── Bryce Canyon Trails ──────────────────────────── */}
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Navajo Loop Trail" location="Bryce Canyon NP" featured
                  hasNPS={checkNPS("Navajo Loop Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/navajo-loop-trail.htm"
                  detail="Drops you into the amphitheater via Wall Street — a narrow slot between hoodoos that blocks the sky. The most visceral way to enter Bryce. Combine with Queen's Garden for the best loop in the park."
                  tags={["1.4 mi RT", "Moderate", "Hoodoos", "1.5 hrs from Zion"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Queen's Garden Trail" location="Bryce Canyon NP" featured
                  hasNPS={checkNPS("Queen's Garden Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/queens-garden-trail.htm"
                  detail="The easiest route below the rim. Descends into a garden of hoodoos and connects to the Navajo Loop for the park's most popular combination hike. Queen Victoria stands guard."
                  tags={["1.8 mi RT", "Moderate", "Hoodoos", "Best Combined with Navajo"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Peek-a-Boo Loop Trail" location="Bryce Canyon NP"
                  hasNPS={checkNPS("Peek-a-Boo Loop Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/peek-a-boo-loop-trail.htm"
                  detail="The most strenuous of Bryce's amphitheater trails. Weaves through towering hoodoos, natural arches, and the Wall of Windows. Horse traffic shares the trail. Worth every step of elevation gain."
                  tags={["5.5 mi Loop", "Strenuous", "1,555 ft gain", "Wall of Windows"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Fairyland Loop" location="Bryce Canyon NP" featured
                  hasNPS={checkNPS("Fairyland Loop")}
                  url="https://www.nps.gov/brca/planyourvisit/fairyland-loop-trail.htm"
                  detail="The park's most rewarding full-day hike. Ridge walks, dense hoodoo forests, Tower Bridge arch, and views of the surrounding valley in every direction. Far fewer people than the main amphitheater trails."
                  tags={["7.8 mi Loop", "Strenuous", "1,545 ft gain", "Full Day"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Bristlecone Loop" location="Bryce Canyon NP"
                  hasNPS={checkNPS("Bristlecone Loop")}
                  url="https://www.nps.gov/brca/planyourvisit/bristlecone-loop-trail.htm"
                  detail="High-elevation loop through ancient bristlecone pines — some over 1,600 years old. Quiet, meditative, otherworldly. Best panoramic views in the park from Rainbow Point at 9,115 feet."
                  tags={["1 mi Loop", "Easy", "9,115 ft", "Rainbow Point"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Mossy Cave Trail" location="Bryce Canyon NP"
                  hasNPS={checkNPS("Mossy Cave Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/mossycave.htm"
                  detail="Off the beaten path on the east side of the park. Follows Water Canyon past hoodoos and arches to a small waterfall and ice-filled grotto. Outside the fee station — no park pass needed."
                  tags={["1 mi RT", "Easy", "Waterfall", "No Fee"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Rim Trail" location="Bryce Canyon NP"
                  hasNPS={checkNPS("Rim Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/rimtrail.htm"
                  detail="A flat walk along the canyon rim connecting all the major viewpoints — Sunrise, Sunset, Inspiration, and Bryce Point. Do segments or all 5.5 miles. Shuttle-assisted for one-way hikes."
                  tags={["Up to 5.5 mi", "Easy", "Viewpoints", "Shuttle Access"]} />

                {/* ── Capitol Reef Trails ──────────────────────────── */}
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Hickman Bridge Trail" location="Capitol Reef NP" featured
                  hasNPS={checkNPS("Hickman Bridge Trail")}
                  url="https://www.nps.gov/care/planyourvisit/hickman-bridge.htm"
                  detail="The park's signature hike. Follows the Fremont River then climbs to a 133-foot natural bridge with a 360-foot drop to the canyon below. Passes ancient Fremont granaries and a pit house ruin on the way up."
                  tags={["1.8 mi RT", "Moderate", "Natural Bridge", "Fremont Ruins"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Cassidy Arch Trail" location="Capitol Reef NP" featured
                  hasNPS={checkNPS("Cassidy Arch Trail")}
                  url="https://www.nps.gov/care/planyourvisit/cassidy-arch.htm"
                  detail="Named for Butch Cassidy, who hid in these canyons. Climbs steeply from the Grand Wash floor to stand on top of a massive natural arch with vertigo-inducing drop-offs on both sides. The reward-to-effort ratio is exceptional."
                  tags={["3.4 mi RT", "Strenuous", "870 ft gain", "Arch"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Capitol Gorge Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Capitol Gorge Trail")}
                  url="https://www.nps.gov/care/planyourvisit/capitol-gorge.htm"
                  detail="Walks between canyon walls carved with pioneer inscriptions from the 1870s and ancient Fremont petroglyphs. The 'Pioneer Register' and natural water tanks (potholes) are highlights. Flat and easy."
                  tags={["2.4 mi RT", "Easy", "Petroglyphs", "Pioneer Register"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Navajo Knobs Trail" location="Capitol Reef NP" featured
                  hasNPS={checkNPS("Navajo Knobs Trail")}
                  url="https://www.nps.gov/care/planyourvisit/navajoknobbstrail.htm"
                  detail="The park's finest dayhike. Starts at the Hickman Bridge trailhead and climbs to 360-degree views at 6,979 feet — the Waterpocket Fold, the Henry Mountains, and formations like Pectols Pyramid spread out below. Almost no one does it."
                  tags={["9.4 mi RT", "Strenuous", "1,620 ft gain", "Best Views"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Cohab Canyon Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Cohab Canyon Trail")}
                  url="https://www.nps.gov/care/planyourvisit/cohabcanyontrail.htm"
                  detail="Steep switchbacks climb to sweeping aerial views over Fruita, the orchard, and the Waterpocket Fold. The hidden slot canyons tucked into the walls reward anyone who wanders off the main path."
                  tags={["3.4 mi RT", "Moderate", "Canyon Views", "Fruita Overlook"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Grand Wash Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Grand Wash Trail")}
                  url="https://www.nps.gov/care/planyourvisit/grandwash.htm"
                  detail="A flat walk through the Waterpocket Fold between canyon walls that press to shoulder-width at the Narrows. Connects to the Cassidy Arch Trail for a longer loop. The easiest way to feel the scale of Capitol Reef."
                  tags={["4.5 mi RT", "Easy", "Slot Canyon", "Connects to Cassidy Arch"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Chimney Rock Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Chimney Rock Trail")}
                  url="https://www.nps.gov/care/planyourvisit/chimney-rock.htm"
                  detail="A loop trail circling beneath the park's most recognizable formation. Views of the Waterpocket Fold, Capitol Reef, and the distant Henry Mountains. Excellent wildflowers in spring."
                  tags={["3.6 mi Loop", "Moderate", "590 ft gain", "Wildflowers"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Trails')} name="Sunset Point Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Sunset Point Trail")}
                  url="https://www.nps.gov/care/planyourvisit/sunset-point.htm"
                  detail="A short walk to one of the most dramatic viewpoints in the park. The Waterpocket Fold stretches endlessly south. Best in late afternoon when the cliffs glow. Combine with Goosenecks Overlook."
                  tags={["0.8 mi RT", "Easy", "Sunset Views", "Waterpocket Fold"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* BREATHE                                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="wellness" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="breathe" />
              <SectionLabel>Breathe</SectionLabel>
              <SectionTitle>{"Yoga, spa & wellness"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"Slow down. The canyon holds space for stillness just as powerfully as it holds space for adventure. As you move through the corridor, Bryce's high-plateau silence and Capitol Reef's near-total solitude become their own practice — no studio required."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={6} label="wellness options">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name={"Hillside Yoga at Flanigan's"} featured
                  url="https://flanigans.com/spa/"
                  detail={"Gentle yoga with sound bath on a terrace overlooking Zion. The vibration carries differently at this elevation. All levels welcome — come for the practice, stay for the view."}
                  note={"At Flanigan's Resort — check schedule for sound bath sessions"}
                  tags={["Sound Bath", "Canyon Views", "All Levels"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Zion Guru Skydeck Yoga" featured
                  url="https://www.zionguru.com/"
                  detail="Open-air deck with the Watchman as your backdrop. Morning sessions catch first light on the canyon walls."
                  tags={["Outdoor", "Morning", "All Levels"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Deep Canyon Spa" featured
                  url="https://flanigans.com/spa/"
                  detail={"Full-service spa inside Flanigan's Resort. Massages, body treatments, and facials after long trail days. The canyon's first spa, open since 1994."}
                  tags={["Full Spa", "Springdale", "Walk-In"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Open Sky Wellness Programs" featured
                  url="https://www.openskyzion.com/"
                  detail="Immersive yoga, meditation, and sound healing in an off-grid desert setting. Multi-day programs available."
                  tags={["Multi-Day", "Off-Grid", "Immersive"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Zion Canyon Hot Springs" featured
                  url="https://www.zioncanyonhotsprings.com/"
                  detail="32 geothermal hot springs, globally-inspired mineral pools, Finnish barrel saunas, and cold plunges in La Verkin — 30 minutes from the park. The 21+ Premier area has cocktails by the firepit and its own saunas. This is your post-hike recovery circuit."
                  tags={["Hot Springs", "Sauna", "Cold Plunge", "21+ Area"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="True North Float" featured
                  url="https://www.tnfloat.com/"
                  detail="Sensory deprivation float tanks, fire & ice suite (sauna + cold plunge), vibroacoustic therapy, and massage in St. George — 45 minutes from Zion. Founded by a wellness seeker who left corporate life. The real deal."
                  tags={["Float Tank", "Sauna", "Cold Plunge", "St. George"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Cable Mountain Spa"
                  url="https://cablemountainspa.com/"
                  detail="Full-service spa with sauna at the park entrance. Massage, facials, and body treatments. Walk-in friendly."
                  tags={["Full Spa", "Sauna", "Springdale"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Homebody Healing"
                  url="https://www.homebodyhealing.love/"
                  detail="Weekly yoga classes at Cable Mountain Spa — vinyasa, hatha, yin, restorative, breathwork, and meditation. Private somatic sessions available. A deeply rooted local teacher."
                  tags={["Yoga", "Breathwork", "Meditation", "Weekly Classes"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Cosmic Flow Yoga"
                  url="https://www.yogainzion.com/"
                  detail="Yoga, meditation, and sound healing with sessions across Springdale, Kanab, and St. George. Riverside location in Springdale next to the Virgin River. Private group sessions available."
                  tags={["Yoga", "Sound Healing", "Multiple Locations"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Zion Yogis"
                  url="https://www.zionyogis.com/"
                  detail="Outdoor yoga sessions in and around Zion National Park. Calming flow classes designed as the perfect cool-down after a day on the trails."
                  tags={["Yoga", "Outdoor", "Post-Hike"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Amangiri Spa" featured
                  url="https://www.aman.com/hotels/amangiri"
                  detail="Aman's desert spa draws from Navajo healing traditions. Flotation therapy, desert clay wraps, and a water pavilion carved into the mesa. A pilgrimage in itself — 90 minutes from Springdale at Canyon Point."
                  tags={["Ultra-Luxury", "Navajo Traditions", "Float", "Canyon Point"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Elite Float Spa"
                  detail="Southern Utah's first float spa in St. George. Floatation therapy, infrared sauna, and massage. Small family-owned operation with deep expertise."
                  note="St. George, UT — find them on Yelp or TripAdvisor"
                  tags={["Float Tank", "Infrared Sauna", "St. George"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Five Petals Spa at the Cliffrose"
                  url="https://www.cliffroselodge.com/"
                  detail="Riverfront spa steps from the park. Deep-tissue, hot stone, and custom facials."
                  tags={["Riverfront", "Hotel Spa"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Sunrise Meditation at Canyon Junction"
                  detail="Arrive before the shuttles. Sit at the Pine Creek bridge. Watch the walls ignite in silence. No teacher needed."
                  tags={["Free", "Early AM", "Solo", "Self-Guided"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Earthing on the Canyon Floor"
                  detail="Take your shoes off. Stand on the sandstone. Feel the warmth the rock has been collecting for 200 million years."
                  tags={["Free", "Grounding", "Self-Guided"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Wellness')} name="Journaling at the Virgin River"
                  detail={"Find a bench along the Pa'rus Trail. The sound of the river is its own kind of teacher."}
                  tags={["Free", "Contemplative", "Self-Guided"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* AWAKEN                                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="light-sky" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Night Sky</SectionLabel>
              <SectionTitle>{"Light, sky & wonder"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"The moments that shift something inside you. Sunrise, starlight, the land at its most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={4} label="experiences">
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Stargazing from the Canyon Floor" featured
                  hasNPS={checkNPS("Stargazing")}
                  url="https://www.nps.gov/thingstodo/stargazing-in-zion.htm"
                  detail={"Zion is a certified International Dark Sky Park. On a moonless night, the Milky Way arcs directly overhead between the canyon walls. Bring a blanket, lie down, and give yourself an hour."}
                  tags={["Free", "Night", "Dark Sky Park"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Sunrise at the Watchman" featured
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Get to the trailhead before first light. Watch the canyon walls ignite one layer at a time. Worth every minute of lost sleep."
                  tags={["3.3 mi RT", "Moderate", "Early AM"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Drive Historic Highway 12" featured
                  detail="One of America's most dramatic scenic byways. 124 miles from Bryce Canyon to Capitol Reef through red rock canyons, hogbacks with thousand-foot drops on both sides, and the high forests of Boulder Mountain. Don't rush it."
                  tags={["Scenic Drive", "Half Day", "Bryce to Capitol Reef"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="Drive the Mt. Carmel Tunnel" featured
                  detail="The 1.1-mile tunnel carved through sandstone in 1930. Emerge on the east side to a completely different landscape — checkerboard mesas, white slickrock, open sky."
                  tags={["Scenic Drive", "East Side", "Historic"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name="NPS Ranger Stargazing Program"
                  url="https://www.nps.gov/zion/planyourvisit/sunset-stargazing.htm"
                  detail="Free ranger-led night sky programs. Telescopes provided, no reservation needed. Check the park calendar for dates."
                  tags={["Free", "Ranger-Led", "Seasonal"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Light & Sky')} name={"Bryce Canyon Under Stars"}
                  url="https://www.nps.gov/thingstodo/stargazing-at-bryce-canyon.htm"
                  detail={"Some of the darkest skies in the country. The hoodoos by starlight are otherworldly. Ranger-led telescope programs available."}
                  tags={["Day Trip", "Dark Sky", "Telescope Programs"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CONNECT                                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="food-culture" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Food & Culture</SectionLabel>
              <SectionTitle>{"Food, culture & community"}</SectionTitle>
              <SectionSub isMobile={isMobile}>{"The people and places that turn a visit into a memory. Where to eat, give back, honor the land, and linger."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={4} label="places">
                {restaurants.filter(r => !r.corridor).map(r => (
                  <ListItem
                    key={r.id}
                    name={r.name}
                    detail={r.highlights?.[0]}
                    note={r.hours}
                    tags={r.tags}
                    featured={r.lilaPick}
                    url={r.links?.website}
                    location={r.location}
                    isMobile={isMobile}
                    onOpenSheet={openSheet('Food & Culture')}
                  />
                ))}

                {/* ── Cultural Heritage & Service ──────────────────────── */}
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Tribal Arts Zion"
                  detail="Native American art and jewelry sourced directly from tribal artists."
                  tags={["Native Art", "Jewelry", "Gallery"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="David J. West Gallery"
                  url="https://www.davidjwest.com/"
                  detail={"Fine art photography of the Southwest in light that makes you question whether you've ever really seen these places."}
                  tags={["Photography", "Fine Art"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Springdale Farmers Market"
                  detail="Saturday mornings in season. Local produce, artisan goods."
                  tags={["Seasonal", "Saturday AM", "Local"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Paiute Cultural Heritage" featured
                  url="https://pitu.gov/culture/"
                  detail={"The Southern Paiute called this land Mukuntuweap long before it was Zion. The Paiute Indian Tribe of Utah preserves language, oral history, and traditions through cultural programs and the annual Restoration Powwow in Cedar City each June."}
                  note="Paiute Indian Tribe of Utah — pitu.gov"
                  tags={["Indigenous Heritage", "Cultural", "Cedar City"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Pipe Spring National Monument" featured
                  url="https://www.nps.gov/pisp/"
                  detail={"Jointly managed by NPS and the Kaibab Band of Paiutes. A desert oasis that tells the layered story of water, sovereignty, and survival — Native, pioneer, and ranching history in one place. The Kaibab Paiutes operate the visitor center."}
                  tags={["NPS Monument", "Indigenous History", "Day Trip"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Zion Forever Project" featured
                  url="https://www.zionpark.org/"
                  detail={"The park's official nonprofit partner. Conservation volunteer days, trail restoration, hanging garden protection, and dark sky preservation. A way to give back to the land that gives so much."}
                  note="Volunteer opportunities available — zionpark.org"
                  tags={["Conservation", "Volunteer", "Nonprofit"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Conserve Southwest Utah" featured
                  url="https://www.conserveswu.org/stewardship"
                  detail={"Hands-on desert habitat restoration at Red Cliffs NCA near St. George. Planting native shrubs, protecting threatened Mojave desert tortoise habitat, invasive species removal. Over 5,000 native plants restored since 2020."}
                  note="Regular volunteer days — 45 min from Zion"
                  tags={["Habitat Restoration", "Volunteer", "Desert Tortoise"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Parowan Gap Petroglyphs"
                  detail={"A free, open-air gallery of ancient rock art attributed to the Fremont people, near Cedar City. Hundreds of petroglyphs etched into the canyon walls — a contemplative stop that asks nothing but attention."}
                  tags={["Free", "Ancient Rock Art", "Self-Guided", "Cedar City"]} />
                <ListItem isMobile={isMobile} onOpenSheet={openSheet('Food & Culture')} name="Fruita Orchards at Capitol Reef" location="Capitol Reef NP" featured
                  url="https://www.nps.gov/care/planyourvisit/fruita.htm"
                  detail="The park's historic orchard — apricot, cherry, peach, pear, apple — is still harvested by visitors in season. Walk in, pick fruit off the tree, pay by the pound. One of the most quietly extraordinary things you can do in any national park."
                  tags={["Free to Enter", "U-Pick", "In-Season", "Historic"]} />

                {/* ── Corridor Restaurants ──────────────────────── */}
                {restaurants.filter(r => r.corridor).length > 0 && (
                  <>
                    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: C.warmGray, marginTop: 32, marginBottom: 12 }}>
                      Regional Corridor
                    </p>
                    {restaurants.filter(r => r.corridor).map(r => (
                      <ListItem
                        key={r.id}
                        name={r.name}
                        detail={r.highlights?.[0]}
                        note={r.hours}
                        tags={r.tags}
                        featured={r.lilaPick}
                        url={r.links?.website}
                        location={r.location}
                        isMobile={isMobile}
                        onOpenSheet={openSheet('Food & Culture')}
                      />
                    ))}
                  </>
                )}
              </ExpandableList>
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
              <SectionSub isMobile={isMobile}>Zion sits on ancestral Southern Paiute land. These organizations honor that, and the canyon itself.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 8 }}>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Trail Stewardship</div>
                  <ListItem isMobile={isMobile} name="Zion Forever Project"
                    url="https://www.zionpark.org"
                    detail="The official nonprofit partner of Zion National Park, funding trail restoration, wildlife habitat protection, youth education, and night sky stewardship. Direct, local, and legitimate."
                    tags={["Donate", "Volunteer"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Indigenous Giving</div>
                  <ListItem isMobile={isMobile} name="Paiute Indian Tribe of Utah"
                    url="https://pitu.gov"
                    detail="Zion's canyon walls are named Mukuntuweap — a Paiute word. The tribe's cultural department works on language preservation, repatriation, and youth culture camps run in partnership with the NPS and Zion Forever Project. Supporting their programs is the most meaningful reciprocity you can offer this place."
                    tags={["Learn & Support"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Indigenous Land</div>
                  <ListItem isMobile={isMobile} name="Utah Diné Bikéyah"
                    url="https://utahdinebikeyah.org"
                    detail="A 501(c)(3) dedicated to healing people and the Earth by supporting Indigenous communities and protecting culturally significant ancestral lands across the broader Colorado Plateau."
                    tags={["Donate"]} />
                </div>
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* CTA — DUAL PATH                                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="cta" style={{ scrollMarginTop: 126, padding: "56px 0 72px", textAlign: "center" }}>
            <FadeIn>
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: C.skyBlue, display: "block", marginBottom: 16,
              }}>Begin</span>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 300,
                color: C.darkInk, margin: "0 0 10px", lineHeight: 1.2,
              }}>Your Zion trip starts here</h3>
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
              onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'zion' })}
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
                  { name: "Joshua Tree", slug: "joshua-tree", accent: C.goldenAmber },
                  { name: "Olympic Peninsula", slug: "olympic-peninsula", accent: C.skyBlue },
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
      <WhisperBar destination="zion" label="Zion" />
      <Footer />
    </>
  );
}
