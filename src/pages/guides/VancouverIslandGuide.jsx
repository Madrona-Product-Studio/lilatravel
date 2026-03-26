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
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/vancouver-island.json';
import restaurants from '../../data/restaurants/vancouver-island.json';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';


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

function ListItem({ name, detail, note, tags, featured, url, isMobile, onOpenSheet, location, cuisine, priceRange, reservations, dietary, energy }) {
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
    luxury: { color: C.sunSalmon, label: "Luxury", bg: `${C.sunSalmon}15` },
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
              <span key={i} style={{ padding: '3px 10px', background: `${C.oceanTeal}10`, fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 600, color: C.oceanTeal }}>{a}</span>
            ))}
          </div>
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
    id: "pacific-rim", name: "Pacific Rim National Park Reserve", designation: "canadian-national-park", established: 1970,
    acreage: "511 km²", elevation: "sea level–900 m", attribute: "Three distinct units",
    soul: "Three landscapes in one reserve — Long Beach's endless sand, the Broken Group Islands' sheltered archipelago, and the West Coast Trail's 75 km of wilderness coastline. Parks Canada protects it in partnership with the Nuu-chah-nulth Nations.",
    facts: [
      "Long Beach unit stretches 16 km — the longest beach on Vancouver Island",
      "Broken Group Islands: 100+ islands accessible only by boat or kayak",
      "West Coast Trail: 75 km coastal trek, open May–September, permit required",
    ],
    infoUrl: "https://parks.canada.ca/pn-np/bc/pacificrim",
    driveFrom: null, accent: C.oceanTeal, isAnchor: true,
  },
  {
    id: "strathcona", name: "Strathcona Provincial Park", designation: "provincial-park", established: 1911,
    acreage: "2,458 km²", elevation: null, attribute: "Oldest BC provincial park",
    soul: "British Columbia's oldest provincial park and Vancouver Island's wild interior — alpine meadows, glacier-fed lakes, and the island's highest peak. What the coast promises, Strathcona delivers in altitude.",
    facts: [
      "Contains Golden Hinde (2,195 m) — Vancouver Island's highest peak",
      "Della Falls: 440 m, one of Canada's tallest waterfalls",
      "Established 1911 — the first provincial park in British Columbia",
    ],
    infoUrl: "https://bcparks.ca/strathcona-park/",
    driveFrom: "~2.5 hrs from Tofino", accent: "#6B8F71", isAnchor: false,
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

export default function VancouverIslandGuide() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const breathConfig = isMobile ? null : BREATH_CONFIG.vancouver;
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

  const openSheet = (section) => (item) => {
    setActiveSheet({ ...item, section });
  };

  return (
    <>
      <Helmet>
        <title>Vancouver Island Guide — Ancient Forest, Pacific Shores & Mindful Travel | Lila Trips</title>
        <meta name="description" content="Old-growth cedar, orca-watched straits, and wild coastline. A guide for travelers who understand that some places ask more of you than a photo." />
        <link rel="canonical" href="https://lilatrips.com/destinations/vancouver-island" />
        <meta property="og:title" content="Vancouver Island Guide — Ancient Forest, Pacific Shores & Mindful Travel | Lila Trips" />
        <meta property="og:description" content="Old-growth cedar, orca-watched straits, and wild coastline. A guide for travelers who understand that some places ask more of you than a photo." />
        <meta property="og:url" content="https://lilatrips.com/destinations/vancouver-island" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Vancouver Island — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vancouver Island Guide — Ancient Forest, Pacific Shores & Mindful Travel | Lila Trips" />
        <meta name="twitter:description" content="Old-growth cedar, orca-watched straits, and wild coastline. A guide for travelers who understand that some places ask more of you than a photo." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav breathConfig={breathConfig} />

      {/* ══ CELESTIAL DRAWER ═══════════════════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? C.warmWhite : undefined }}>
          <CelestialDrawer destination="vancouver-island" isMobile={isMobile} breathValueRef={breathValueRef} />

          {/* ══ TITLE MASTHEAD ═══════════════════════════════════════════════════ */}
          <section style={{ background: breathConfig ? 'transparent' : C.cream }}>
        <div style={{ padding: isMobile ? "28px 20px 24px" : "44px 52px 40px", maxWidth: 920, margin: "0 auto" }}>
          <FadeIn from="bottom" delay={0.1}>

            {/* Two column layout */}
            <div style={{
              display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: isMobile ? 28 : 52, alignItems: "start",
              marginTop: 0,
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
      </div>

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
          <section id="sense-of-place" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
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

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: isMobile ? 12 : 16, padding: isMobile ? 16 : 20,
                background: C.cream, border: `1px solid ${C.stone}`, marginBottom: 20,
              }}>
                {[
                  { l: "Recommended", v: "5–8 days" },
                  { l: "Nearest Airport", v: "Victoria (YYJ) or Vancouver (YVR)" },
                  { l: "From Vancouver", v: "~1.5 hrs ferry" },
                  { l: "Best Times", v: "Jun–Sep" },
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
          {/* TREAD LIGHTLY                                                 */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="tread-lightly" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Tread Lightly</SectionLabel>
              <SectionTitle>Traveling responsibly.</SectionTitle>
              <SectionSub isMobile={isMobile}>This land has a legal and spiritual context that precedes any trail map.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div style={{ marginTop: 8 }}>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Unceded Territory · Kwakwaka'wakw, Nuu-chah-nulth, Coast Salish</div>
                  <ListItem isMobile={isMobile} name="This is unceded territory. The legal and spiritual context precedes any trail map."
                    detail="Much of Vancouver Island remains the unceded traditional territories of the Kwakwaka'wakw, Nuu-chah-nulth, and Coast Salish peoples — meaning it was never ceded through treaty. Protected areas on this island move at the speed of the local First Nations whose territories they occupy. The land you're walking has Indigenous governance, law, and relationship that precede and supersede park boundaries."
                    tags={["Unceded territory", "Indigenous governance", "No treaty land"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Old Growth · Fairy Creek & Beyond</div>
                  <ListItem isMobile={isMobile} name="Vancouver Island is down to 20% of its original ancient forest."
                    detail="By the early 1990s, just 30% of the Island's original forest remained unlogged. Today it's down to 20%, with only around 3% of the most productive valley-bottom old growth still standing. The Fairy Creek blockades — the largest act of civil disobedience in Canadian history, with over 1,100 arrests — were an attempt to save some of the last intact valleys. When you walk among these trees, you're in contested, living terrain."
                    tags={["Old-growth crisis", "Active logging conflict", "20% remaining"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Tofino & Pacific Rim · Coastal Access</div>
                  <ListItem isMobile={isMobile} name="Tofino's permanent population is 2,500. Summer brings 20 times that."
                    detail="The Tofino corridor absorbs extreme visitor density against a tiny permanent community and a sensitive marine environment. Grey whale migration, sea otters, and nesting shorebirds share the coastline with surfers and day-trippers. Stay on boardwalks in the dune systems, give wide berth to any wildlife, and book well ahead so you're not improvising accommodation in sensitive areas."
                    note="◈ Pacific Rim National Park Reserve requires day-use fees — they fund trail maintenance and wildlife monitoring"
                    tags={["Coastal wildlife", "Dune protection", "Book ahead"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Indigenous-Led Tourism · Active Stewardship</div>
                  <ListItem isMobile={isMobile} name="Seek out Indigenous-led experiences. They're the best ones anyway."
                    detail="Several First Nations on Vancouver Island operate exceptional cultural tourism — Tla-o-qui-aht Tribal Parks near Tofino, Namgis First Nation in Alert Bay, and others. These aren't add-ons to a trip — they're the most grounded way to understand where you are. Booking directly with Indigenous-operated guides and lodges ensures revenue flows to the community and that the experience is sanctioned rather than extracted."
                    tags={["Indigenous-led tourism", "Tla-o-qui-aht Tribal Parks", "Book direct"]} />
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
          <section id="wellness" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="breathe" />
              <SectionLabel>Breathe</SectionLabel>
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
          <section id="light-sky" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Night Sky</SectionLabel>
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
          <section id="food-culture" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Food & Culture</SectionLabel>
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

                {/* ── Dining ── */}
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
                    onOpenSheet={openSheet('Food & Culture')}
                  />
                ))}

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
          {/* GIVE BACK                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="give-back" style={{ scrollMarginTop: 126, padding: "44px 0" }}>
            <FadeIn>
              <SectionIcon type="threshold" />
              <SectionLabel>Give Back</SectionLabel>
              <SectionTitle>Leave it better than you found it.</SectionTitle>
              <SectionSub isMobile={isMobile}>The old growth is still being logged. These organizations are fighting to stop it — and to restore what's been lost.</SectionSub>
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
                  <ListItem isMobile={isMobile} name="Tla-o-qui-aht Tribal Parks"
                    url="https://www.tribalparks.com"
                    detail="Tla-o-qui-aht and neighboring First Nations have protected 76,000 hectares of critical habitat — the largest intact coastal temperate rainforest on Vancouver Island — through Indigenous governance. Donate directly or look for the Tribal Parks Allies logo on Tofino businesses whose 1% revenue contribution funds Guardian programs on the ground."
                    tags={["Donate", "Support Allied Businesses"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Conservation</div>
                  <ListItem isMobile={isMobile} name="Ancient Forest Alliance"
                    url="https://ancientforestalliance.org"
                    detail="The leading charitable organization working to protect BC's endangered old-growth forests and ensure a transition to sustainable second-growth forestry. Direct donations support advocacy, documentation, and political pressure on the BC government."
                    tags={["Donate"]} />
                </div>
                <div style={{ paddingTop: 16 }}>
                  <div style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#7A857E", marginBottom: 2,
                  }}>Cultural Preservation</div>
                  <ListItem isMobile={isMobile} name="U'mista Cultural Centre"
                    url="https://www.umista.ca"
                    detail="Located in Alert Bay on Cormorant Island, U'mista houses historic potlatch artifacts and works to ensure the survival of Kwakwa̱ka̱ʼwakw cultural heritage through exhibits, tours, and dance performances. Visit and donate directly."
                    tags={["Visit", "Donate"]} />
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
