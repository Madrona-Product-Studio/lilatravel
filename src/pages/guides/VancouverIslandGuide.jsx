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
import { SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon, TierItem, TierLegend, TierFilter } from '@components/guide';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/vancouver-island.json';
import restaurants from '../../data/restaurants/vancouver-island-eat.json';
import experiences from '../../data/restaurants/vancouver-island-experience.json';
import breatheItems from '../../data/restaurants/vancouver-island-breathe.json';
import moveItems from '../../data/restaurants/vancouver-island-move.json';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';


// --- Guide-Specific Components ------------------------------------------------
// SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon imported from @components/guide
const ACCENT = C.oceanTeal;

function ListItem({ name, detail, note, tags, featured, url, onOpenSheet, location, cuisine, priceRange, reservations, dietary, energy }) {
  const nameEl = onOpenSheet ? (
    <span className="font-body text-[15px] font-semibold text-dark-ink">{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="font-body text-[15px] font-semibold text-dark-ink no-underline transition-[border-color,color] duration-200"
      style={{ borderBottom: `1px solid ${C.stone}` }}
      onMouseEnter={e => { e.target.style.borderColor = C.oceanTeal; e.target.style.color = C.slate || "#3D5A6B"; }}
      onMouseLeave={e => { e.target.style.borderColor = C.stone; e.target.style.color = C.darkInk; }}>
      {name}
      <span className="text-[12px] ml-1 text-[#7A857E]">{"↗"}</span>
    </a>
  ) : (
    <span className="font-body text-[15px] font-semibold text-dark-ink">{name}</span>
  );

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet({ type: 'list', name, detail, note, tags, featured, url, location, cuisine, priceRange, reservations, dietary, energy }) : undefined}
      className={`flex flex-col md:flex-row items-start md:items-center gap-3.5 py-4 border-b border-stone ${onOpenSheet ? 'cursor-pointer transition-[background] duration-150' : ''}`}
      onMouseEnter={onOpenSheet ? e => { e.currentTarget.style.background = `${C.stone}30`; } : undefined}
      onMouseLeave={onOpenSheet ? e => { e.currentTarget.style.background = 'transparent'; } : undefined}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-[3px]">
          {nameEl}
          {featured && (
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-ocean-teal px-2.5 py-0.5"
              style={{ border: `1px solid ${C.oceanTeal}40` }}>{"Lila Pick"}</span>
          )}
        </div>
        <div className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.65]">{detail}</div>
        {note && (
          <div className="font-body text-[12px] font-semibold text-ocean-teal mt-1">{note}</div>
        )}
        {tags && tags.length > 0 && (
          <div className="flex gap-[5px] mt-[7px] flex-wrap">
            {tags.map((t, i) => (
              <span key={i} className="font-body text-[11px] font-semibold text-[#7A857E] px-2 py-0.5"
                style={{ background: C.stone + "60" }}>{t}</span>
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

function StayItem({ name, location, tier, detail, tags, url, featured, onOpenSheet, priceRange, amenities, bookingWindow, seasonalNotes, groupFit }) {
  const styles = {
    elemental: { color: C.seaGlass, label: "Elemental", bg: `${C.seaGlass}15` },
    rooted: { color: C.oceanTeal, label: "Rooted", bg: `${C.oceanTeal}12` },
    premium: { color: C.goldenAmber, label: "Premium", bg: `${C.goldenAmber}15` },
    luxury: { color: C.sunSalmon, label: "Luxury", bg: `${C.sunSalmon}15` },
  };
  const s = styles[tier] || styles.rooted;
  const nameEl = onOpenSheet ? (
    <span className="font-body text-[15px] font-semibold text-dark-ink">{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="font-body text-[15px] font-semibold text-dark-ink no-underline transition-[border-color] duration-200"
      style={{ borderBottom: `1px solid ${C.stone}` }}
      onMouseEnter={e => e.target.style.borderColor = C.oceanTeal}
      onMouseLeave={e => e.target.style.borderColor = C.stone}>
      {name}
      <span className="text-[12px] ml-1 text-[#7A857E]">{"↗"}</span>
    </a>
  ) : (
    <span className="font-body text-[15px] font-semibold text-dark-ink">{name}</span>
  );

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet({ type: 'stay', name, location, tier, detail, tags, featured, url, priceRange, amenities, bookingWindow, seasonalNotes, groupFit }) : undefined}
      className={`flex flex-col md:flex-row items-stretch md:items-center gap-3.5 py-[18px] border-b border-stone ${onOpenSheet ? 'cursor-pointer transition-[background] duration-150' : ''}`}
      onMouseEnter={onOpenSheet ? e => { e.currentTarget.style.background = `${C.stone}30`; } : undefined}
      onMouseLeave={onOpenSheet ? e => { e.currentTarget.style.background = 'transparent'; } : undefined}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-[3px] flex-wrap">
          <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-0.5"
            style={{ background: s.bg, color: s.color }}>{s.label}</span>
          <span className="font-body text-[12px] font-medium text-[#7A857E]">{location}</span>
          {featured && (
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-ocean-teal px-2.5 py-0.5"
              style={{ border: `1px solid ${C.oceanTeal}40` }}>{"Lila Pick"}</span>
          )}
        </div>
        <div className="mb-[3px]">{nameEl}</div>
        <div className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.65]">{detail}</div>
        {tags && (
          <div className="flex gap-[5px] mt-[7px] flex-wrap">
            {tags.map((t, i) => (
              <span key={i} className="font-body text-[11px] font-semibold text-[#7A857E] px-2 py-0.5"
                style={{ background: C.stone + "60" }}>{t}</span>
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
          className="inline-flex items-center gap-2 mt-5 pt-2 pb-1 bg-transparent border-none border-b border-dark-ink cursor-pointer font-body text-[12px] font-bold tracking-[0.2em] uppercase text-dark-ink transition-opacity duration-200 hover:opacity-55"
        >
          {expanded ? "Show less" : `Show ${items.length - initialCount} more ${label}`}
          <span className="inline-block transition-transform duration-[250ms] ease-in-out text-[11px]"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>{"▼"}</span>
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
    <div className="max-w-[500px] mx-auto px-5 pt-[26px] pb-[60px]">
      {/* Badge row */}
      {item.type === 'stay' && item.tier && tierStyles[item.tier] && (
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-0.5"
            style={{ background: tierStyles[item.tier].bg, color: tierStyles[item.tier].color }}>{tierStyles[item.tier].label}</span>
          {item.location && (
            <span className="font-body text-[12px] font-medium text-[#7A857E]">{item.location}</span>
          )}
        </div>
      )}
      {item.type === 'list' && item.section && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-ocean-teal mb-2.5 px-2.5 py-0.5"
          style={{ background: `${C.oceanTeal}15` }}>{item.section}</span>
      )}

      {/* Name */}
      <h3 className="font-serif text-[clamp(22px,4vw,28px)] font-normal text-dark-ink mb-2.5 leading-[1.2] mt-0">{item.name}</h3>

      {/* Lila Pick */}
      {item.featured && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-ocean-teal mb-3.5 px-2.5 py-0.5"
          style={{ border: `1px solid ${C.oceanTeal}40` }}>Lila Pick</span>
      )}

      {/* Detail */}
      {item.detail && (
        <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] mt-0 mb-3.5">{item.detail}</p>
      )}

      {/* Note */}
      {item.note && (
        <div className="font-body text-[13px] font-semibold text-ocean-teal mb-3.5">{item.note}</div>
      )}

      {/* Restaurant info grid */}
      {item.type === 'list' && (item.cuisine || item.priceRange || item.reservations || item.energy) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-[18px] py-3.5 border-y border-stone">
          {item.cuisine && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Cuisine</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.cuisine}</div>
            </div>
          )}
          {item.priceRange && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Price</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.priceRange}</div>
            </div>
          )}
          {item.energy && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Vibe</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.energy}</div>
            </div>
          )}
          {item.reservations && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Reservations</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.reservations}</div>
            </div>
          )}
          {item.location && (
            <div className="col-span-full">
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Location</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.location}</div>
            </div>
          )}
          {item.dietary && (item.dietary.vegetarian || item.dietary.vegan || item.dietary.glutenFree) && (
            <div className="col-span-full">
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Dietary</div>
              <div className="flex gap-1.5 flex-wrap">
                {item.dietary.vegetarian && <span className="font-body text-[11px] font-semibold text-sea-glass px-2 py-0.5" style={{ background: `${C.seaGlass}15` }}>vegetarian</span>}
                {item.dietary.vegan && <span className="font-body text-[11px] font-semibold text-sea-glass px-2 py-0.5" style={{ background: `${C.seaGlass}15` }}>vegan</span>}
                {item.dietary.glutenFree && <span className="font-body text-[11px] font-semibold text-sea-glass px-2 py-0.5" style={{ background: `${C.seaGlass}15` }}>gluten-free</span>}
              </div>
              {item.dietary.notes && <div className="font-body text-[12px] font-normal text-[#7A857E] mt-1 leading-[1.5]">{item.dietary.notes}</div>}
            </div>
          )}
        </div>
      )}

      {/* Accommodation info grid */}
      {item.type === 'stay' && (item.priceRange || item.bookingWindow || item.seasonalNotes || item.groupFit) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-[18px] py-3.5 border-y border-stone">
          {item.priceRange && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Price Range</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.priceRange}</div>
            </div>
          )}
          {item.groupFit && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Good For</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.groupFit.join(', ')}</div>
            </div>
          )}
          {item.bookingWindow && (
            <div className="col-span-full">
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Booking</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.bookingWindow}</div>
            </div>
          )}
          {item.seasonalNotes && (
            <div className="col-span-full">
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Season</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.seasonalNotes}</div>
            </div>
          )}
        </div>
      )}

      {/* Amenities */}
      {item.type === 'stay' && item.amenities && item.amenities.length > 0 && (
        <div className="mb-[18px]">
          <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-2">Amenities</div>
          <div className="flex gap-1.5 flex-wrap">
            {item.amenities.map((a, i) => (
              <span key={i} className="font-body text-[12px] font-semibold text-ocean-teal py-[3px] px-2.5" style={{ background: `${C.oceanTeal}10` }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-5">
          {item.tags.map((t, i) => (
            <span key={i} className="font-body text-[12px] font-semibold text-[#7A857E] py-[3px] px-2.5"
              style={{ background: C.stone + '60' }}>{t}</span>
          ))}
        </div>
      )}

      {/* Visit Website link */}
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 py-2.5 px-5 font-body text-[12px] font-bold tracking-[0.16em] uppercase text-ocean-teal no-underline transition-all duration-[250ms]"
          style={{ border: `1.5px solid ${C.oceanTeal}` }}
          onMouseEnter={e => { e.currentTarget.style.background = C.oceanTeal; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.oceanTeal; }}
        >Visit Website <span className="text-[13px]">↗</span></a>
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
        <div onClick={onClose} className="fixed inset-0 z-[249]" style={{ background: 'rgba(0,0,0,0.3)', animation: 'guideSheetBackdropIn 0.25s ease' }} />
        <div className="fixed top-0 right-0 bottom-0 w-[440px] z-[250] bg-cream overflow-y-auto" style={{ animation: 'guideSheetSlideIn 0.3s ease', boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' }}>
          <div className="sticky top-0 z-10 flex justify-end pr-3.5 pt-3">
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer font-body text-[15px] text-[#7A857E] leading-none" style={{ background: `${C.warmWhite}e0`, border: `1px solid ${C.stone}15`, WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 8px ${C.darkInk}08` }} aria-label="Close">✕</button>
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
      <div onClick={onClose} className="fixed inset-0 z-[249]" style={{ background: 'rgba(0,0,0,0.3)', animation: 'guideSheetBackdropIn 0.25s ease' }} />
      <div ref={sheetRef} className="fixed bottom-0 left-0 right-0 h-[82vh] z-[250] bg-cream rounded-t-2xl flex flex-col" style={{ animation: 'guideSheetSlideUp 0.3s ease', boxShadow: '0 -4px 24px rgba(0,0,0,0.1)' }}>
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="px-3.5 pt-2.5 pb-1.5 shrink-0 relative z-10">
          <div className="w-9 h-1 rounded-sm mx-auto mb-2" style={{ background: '#7A857E30' }} />
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-3.5 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer font-body text-[15px] text-[#7A857E] leading-none" style={{ background: `${C.warmWhite}e0`, border: `1px solid #7A857E15`, WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 8px ${C.darkInk}08` }} aria-label="Close">✕</button>
        </div>
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
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

function ParkCard({ park, isExpanded, onToggle }) {
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
    <div className="mb-1.5 transition-[border-color,background] duration-200"
      style={{
        borderLeft: `4px solid ${park.accent}`,
        border: `1px solid ${isExpanded ? park.accent + "40" : C.stone}`,
        borderLeftWidth: 4, borderLeftColor: park.accent,
        background: isExpanded ? `${park.accent}06` : C.cream,
      }}>
      <button
        onClick={onToggle}
        className="w-full p-3.5 md:px-5 md:py-4 bg-transparent border-none cursor-pointer flex items-center gap-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: park.accent }}>
              {DESIGNATION_LABELS[park.designation] || park.designation}{park.established ? ` · Est. ${park.established}` : ""}
            </div>
            {!park.isAnchor && park.driveFrom && (
              <div className="font-body text-[10px] font-semibold tracking-[0.08em] text-[#7A857E]">
                {park.driveFrom}
              </div>
            )}
          </div>
          <div className="font-serif text-[clamp(18px,2.5vw,22px)] font-normal text-dark-ink leading-[1.15]"
            style={{ marginBottom: chips.length ? 8 : 0 }}>{park.name}</div>
          {chips.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {chips.map((chip, i) => (
                <span key={i} className="font-body text-[11px] font-semibold text-[#4A5650] whitespace-nowrap px-2.5 py-0.5"
                  style={{ background: `${park.accent}10` }}>{chip}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <DesignationIcon designation={park.designation} size={16} color={park.accent} />
          <span className="inline-block text-[14px] text-[#7A857E] leading-none transition-transform duration-300 ease-in-out"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>
      </button>
      <div className="overflow-hidden transition-[max-height] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ maxHeight: isExpanded ? 400 : 0 }}>
        <div className="px-3.5 pb-4 md:px-5 md:pb-[18px]">
          <div className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.7] italic mb-3 pt-0.5">
            {"◈ "}{park.soul}
          </div>
          {park.facts.map((fact, i) => (
            <div key={i} className="flex gap-2 mb-[5px] items-start">
              <div className="w-1 h-1 rounded-full opacity-60 mt-[7px] shrink-0" style={{ background: park.accent }} />
              <span className="font-body text-[12px] font-normal text-[#4A5650] leading-[1.65]">{fact}</span>
            </div>
          ))}
          {park.infoUrl && (
            <a href={park.infoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block mt-2.5 font-body text-[10px] font-bold tracking-[0.18em] uppercase no-underline"
              style={{ color: park.accent }}>
              {park.designation === "canadian-national-park" ? "Parks Canada" : park.designation === "us-national-park" ? "NPS Page" : "Park Info"} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tier Constants ─────────────────────────────────────────────────────────

const MOVE_TIERS = {
  hike:  { color: '#8a8078', label: 'Hike',  bg: '#8a807815' },
  water: { color: '#7BB8D4', label: 'Water', bg: '#7BB8D415' },
  ride:  { color: '#D4A853', label: 'Ride',  bg: '#D4A85315' },
};

const MOVE_TIER_META = {
  hike:  { label: 'Hike',  desc: 'On foot',          color: '#8a8078' },
  water: { label: 'Water', desc: 'Surf & paddle',    color: '#7BB8D4' },
  ride:  { label: 'Ride',  desc: 'Cycle & roll',     color: '#D4A853' },
};
const moveLegend = [...new Set(moveItems.map(i => i.moveTier))].map(t => MOVE_TIER_META[t]);

const BREATHE_TIERS = {
  practice: { color: '#4A9B9F', label: 'Practice', bg: '#4A9B9F15' },
  soak:     { color: '#7BB8D4', label: 'Soak',     bg: '#7BB8D415' },
  restore:  { color: '#7BB8A0', label: 'Restore',  bg: '#7BB8A015' },
};
const BREATHE_LEGEND = [
  { label: 'Practice', desc: 'In the tradition', color: '#4A9B9F' },
  { label: 'Soak',     desc: 'Water & heat',     color: '#7BB8D4' },
  { label: 'Restore',  desc: 'Integration',      color: '#7BB8A0' },
];
const moveFilterTiers = [...new Set(moveItems.map(i => i.moveTier))].map(t => ({ key: t, ...MOVE_TIER_META[t] }));
const breatheFilterTiers = [
  { key: 'practice', label: 'Practice', desc: 'In the tradition', color: '#4A9B9F' },
  { key: 'soak',     label: 'Soak',     desc: 'Water & heat',     color: '#7BB8D4' },
  { key: 'restore',  label: 'Restore',  desc: 'Integration',      color: '#7BB8A0' },
];

// ─── Guide Section Navigation (sticky anchor bar) ───────────────────────────

const GUIDE_SECTIONS = [
  { id: "sense-of-place", label: "Sense of Place" },
  { id: "when-to-go",     label: "Magic Windows" },
  { id: "tread-lightly",  label: "Tread Lightly" },
  { id: "where-to-stay",  label: "Sleep" },
  { id: "move",           label: "Move" },
  { id: "wellness",       label: "Breathe" },
  { id: "light-sky",      label: "Night Sky" },
  { id: "eat",            label: "Eat" },
  { id: "experience",     label: "Experience" },
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
      <div className="mx-5 mb-6 border border-stone p-4 px-[18px] bg-cream">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-body text-[10px] font-bold tracking-[0.22em] uppercase text-[#7A857E]">In this guide</span>
          <span className="font-body text-[10px] font-medium text-[#b8b0a8] tracking-[0.06em]">{GUIDE_SECTIONS.length} sections</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          {GUIDE_SECTIONS.map((section, i) => (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className="flex items-center gap-2 py-[7px] bg-transparent border-none cursor-pointer text-left"
            >
              <span className="font-body text-[9px] font-bold tracking-[0.1em] text-[#b8b0a8] min-w-4">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-body text-[11px] font-semibold tracking-[0.08em] uppercase text-[#4A5650]">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav className="sticky top-[72px] z-90 border-y border-stone" style={{ background: "rgba(250, 247, 243, 0.97)" }}>
      <div className="max-w-[1120px] mx-auto pt-1 px-10 flex items-center">
        <div className="flex-1 min-w-0 relative">
          <div ref={scrollContainerRef} className="guide-nav-scroll flex items-center overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style>{`.guide-nav-scroll::-webkit-scrollbar { display: none; }`}</style>
          {GUIDE_SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button key={section.id} onClick={() => handleClick(section.id)}
                className="guide-nav-scroll px-3.5 h-11 bg-transparent border-none cursor-pointer font-body text-[11px] tracking-[0.14em] uppercase whitespace-nowrap shrink-0 transition-[color,border-color] duration-[250ms] ease-in-out relative"
                style={{
                  borderBottom: `2px solid ${isActive ? C.oceanTeal : "transparent"}`,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? C.oceanTeal : "#7A857E",
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




// ─── Main Page ───────────────────────────────────────────────────────────────

export default function VancouverIslandGuide() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const breathConfig = BREATH_CONFIG.vancouver;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [expandedPark, setExpandedPark] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);
  const [activeMoveTiers, setActiveMoveTiers] = useState(() => new Set(moveItems.map(i => i.moveTier)));
  const [activeBreatheTiers, setActiveBreatheTiers] = useState(() => new Set(['practice', 'soak', 'restore']));
  const handleMoveToggle = (tierKey) => {
    setActiveMoveTiers(prev => {
      if (prev.has(tierKey) && prev.size === 1) return prev;
      const next = new Set(prev);
      next.has(tierKey) ? next.delete(tierKey) : next.add(tierKey);
      return next;
    });
  };
  const handleBreatheToggle = (tierKey) => {
    setActiveBreatheTiers(prev => {
      if (prev.has(tierKey) && prev.size === 1) return prev;
      const next = new Set(prev);
      next.has(tierKey) ? next.delete(tierKey) : next.add(tierKey);
      return next;
    });
  };
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
        <div className="py-7 px-5 md:py-11 md:px-[52px] md:pb-10 max-w-[920px] mx-auto">
          <FadeIn from="bottom" delay={0.1}>

            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-7 md:gap-[52px] items-start">

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow text-ocean-teal mb-3.5 block">Destination Guide</span>

                <h1 className="font-serif text-[clamp(38px,6vw,64px)] font-light text-dark-ink leading-none mb-[22px] tracking-[-0.02em] mt-0">
                  Vancouver Island
                </h1>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] mt-0 mb-3.5">
                  Tofino sits at the end of Highway 4, where the road runs out of places to go. What surrounds it is enormous: Clayoquot Sound, a UNESCO Biosphere Reserve; the old-growth forests of Meares Island; Pacific Rim National Park's Long Beach; and an open Pacific horizon with nothing between you and Japan.
                </p>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] m-0">
                  Where the forest meets the sea — we built this guide to help you find it.
                </p>
              </div>

              {/* ── Right: This Guide Covers ── */}
              <div className="border-t md:border-t-0 md:border-l border-stone pt-7 md:pt-0 md:pl-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-[18px]">This guide covers</div>

                {/* Parks & Reserves */}
                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-sea-glass mb-2.5">Parks & Reserves</div>
                  {[
                    { label: "Pacific Rim National Park Reserve", url: "https://parks.canada.ca/pn-np/bc/pacificrim" },
                    { label: "Strathcona Provincial Park", url: "https://bcparks.ca/strathcona-park/" },
                    { label: "Clayoquot Sound UNESCO Biosphere", url: "https://www.clayoquotbiosphere.org/" },
                  ].map((park, i) => (
                    <a key={i} href={park.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 mb-[7px] no-underline">
                      <div className="w-[5px] h-[5px] rounded-full bg-sea-glass opacity-50" />
                      <span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{park.label}</span>
                    </a>
                  ))}
                </div>

                {/* Gateway Towns */}
                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-ocean-teal mb-2.5">Gateway Towns</div>
                  {["Tofino", "Ucluelet", "Victoria (corridor)"].map((town, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-[7px]">
                      <div className="w-[5px] h-[5px] rounded-full bg-ocean-teal opacity-50" />
                      <span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{town}</span>
                    </div>
                  ))}
                </div>

                {/* Updated */}
                <div className="font-body text-[11px] font-medium tracking-[0.06em] text-[#7A857E] mt-3.5 pt-3 border-t border-stone">
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
      <section className="relative">
        <div className="flex gap-0.5 overflow-x-auto snap-x snap-mandatory" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {[
            { src: P.vancouver,            alt: "Vancouver Island coastline",            caption: "Where the forest meets the sea",          width: 420 },
            { src: P.vancouverInlet,        alt: "Clayoquot Sound inlet",                caption: "Clayoquot Sound — island-studded waters",  width: 280 },
            { src: P.vancouverRainforest,   alt: "Old-growth rainforest boardwalk",       caption: "Ancient cedar — 1,000 years of standing", width: 420 },
            { src: P.vancouverBeach,        alt: "Pacific Rim beach at dusk",             caption: "Long Beach at low tide",                  width: 360 },
          ].map((img, i) => (
            <div key={i} className="flex-none snap-start relative overflow-hidden"
              style={{ width: isMobile ? "85vw" : img.width }}>
              <img src={img.src} alt={img.alt} className="w-full h-80 object-cover block" />
              <div className="absolute bottom-0 left-0 right-0 pt-8 px-4 pb-3.5" style={{ background: "linear-gradient(to top, rgba(10,18,26,0.7), transparent)" }}>
                <span className="font-body text-[11px] font-semibold tracking-[0.08em] text-white/80">{img.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ GUIDE CONTENT ═══════════════════════════════════════════════════ */}
      <section className="py-8 px-5 pb-[60px] md:py-12 md:px-[52px] md:pb-20 bg-cream">
        <div className="max-w-[680px] mx-auto">


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SENSE OF PLACE                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="sense-of-place" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionLabel accentColor={ACCENT}>Sense of Place</SectionLabel>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"The town is small — fewer than 2,000 residents — and for most of its history was accessible only by boat or float plane. The character here is shaped by weather. Tofino is a surf town that gets 3,000mm of rain a year. The storm season — November through March — draws a different kind of traveler than summer: people who want to watch the Pacific throw itself against the coast, who want to feel the wind on the beach at Chesterman, who want to sit in a cedar sauna while rain hammers the roof."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"The land around Tofino has been home to the Nuu-chah-nulth peoples for over 10,000 years. Five Nations hold traditional territories in the region: Ahousaht, Hesquiaht, Tla-o-qui-aht, Toquaht, and Ucluelet (Yuułuʔiłʔatḥ). The village of Opitsaht on Meares Island, directly across from Tofino, is estimated to be over 5,000 years old and continues as an active community. The forests, waters, and shorelines here are still in relationship with the people who have always called them home."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                {"Ucluelet sits 40 minutes south — quieter, more weathered, equally compelling. Victoria, at the island's southern tip, is a world apart: architectural, ceremonial, the counterpoint when you want stone buildings and afternoon tea after a week of surf and cedar. Together they make a complete journey."}
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3 md:gap-4 p-4 md:p-5 bg-cream border border-stone mb-5">
                {[
                  { l: "Recommended", v: "5–8 days" },
                  { l: "Nearest Airport", v: "Victoria (YYJ) or Vancouver (YVR)" },
                  { l: "From Vancouver", v: "~1.5 hrs ferry" },
                  { l: "Best Times", v: "Jun–Sep" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-ocean-teal mb-[3px]">{s.l}</div>
                    <div className="font-body text-[14px] font-semibold text-dark-ink">{s.v}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* ── Park Cards ── */}
            <FadeIn delay={0.08}>
              <div className="mb-1">
                {PARKS.map(park => (
                  <ParkCard
                    key={park.id}
                    park={park}
                    isExpanded={expandedPark === park.id}
                    onToggle={() => setExpandedPark(expandedPark === park.id ? null : park.id)}
                  />
                ))}
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* WHEN TO GO                                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="when-to-go" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="windows" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Magic Windows</SectionLabel>
              <SectionTitle>When to go</SectionTitle>
              <SectionSub>Both seasons are true. Both are worth knowing.</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem onOpenSheet={openSheet('When to Go')} name="Summer Season" featured
                  detail="Peak surf season, warmest temperatures (15-22°C). Long Beach busiest. Book accommodation 6+ months ahead. Best for kayaking, bear watching, and hiking without rain gear."
                  tags={["Jun-Sep", "Peak Season", "Book Early"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Fall Transition"
                  detail="Storm season begins, crowds thin, gray whales migrating south offshore, old-growth in its most atmospheric state. Excellent for photography."
                  tags={["Sep-Oct", "Migration", "Photography"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Winter Storm Watching" featured
                  detail="The Pacific storms that roll in from November onward generate swells that can top 10 meters. Many lodges host dedicated storm watching packages. Cold (5-10°C) and wet — but the experience is singular."
                  tags={["Nov-Feb", "Storm Season", "Lodge Packages"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Spring Whale Migration" featured
                  detail="Gray whale northward migration peaks in March-April. You can watch from shore. Rain eases toward May. Wildflowers in Strathcona. West Coast Trail opens in May."
                  tags={["Mar-May", "Gray Whales", "Wildflowers"]} />
              </div>
            </FadeIn>

            {/* ── Threshold Moments ── */}
            <FadeIn delay={0.12}>
              <div className="mt-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-ocean-teal mb-4">Threshold Moments</div>
                {[
                  { event: "Gray whale northward migration", timing: "March-April", detail: "Offshore from Long Beach and the headlands" },
                  { event: "Peak surf season", timing: "September-November", detail: "Biggest consistent swells of the year" },
                  { event: "Winter storm watching", timing: "November-January", detail: "Peak dramatic Pacific storms" },
                  { event: "Tla-o-qui-aht Canoe Journey", timing: "Summer (varies)", detail: "Check tourismtofino.com for dates" },
                ].map((cal, i) => (
                  <div key={i} className="py-3.5 border-b border-stone">
                    <div className="font-body text-[14px] font-semibold text-dark-ink mb-[3px]">{cal.event}</div>
                    <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-ocean-teal mb-1">{cal.timing}</div>
                    <div className="font-body text-[12px] font-normal text-[#7A857E]">{cal.detail}</div>
                  </div>
                ))}
              </div>
            </FadeIn>

          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TREAD LIGHTLY                                                 */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="tread-lightly" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="awaken" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Tread Lightly</SectionLabel>
              <SectionTitle>Traveling responsibly.</SectionTitle>
              <SectionSub>This land has a legal and spiritual context that precedes any trail map.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Unceded Territory · Kwakwaka'wakw, Nuu-chah-nulth, Coast Salish</div>
                  <ListItem name="This is unceded territory. The legal and spiritual context precedes any trail map."
                    detail="Much of Vancouver Island remains the unceded traditional territories of the Kwakwaka'wakw, Nuu-chah-nulth, and Coast Salish peoples — meaning it was never ceded through treaty. Protected areas on this island move at the speed of the local First Nations whose territories they occupy. The land you're walking has Indigenous governance, law, and relationship that precede and supersede park boundaries."
                    tags={["Unceded territory", "Indigenous governance", "No treaty land"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Old Growth · Fairy Creek & Beyond</div>
                  <ListItem name="Vancouver Island is down to 20% of its original ancient forest."
                    detail="By the early 1990s, just 30% of the Island's original forest remained unlogged. Today it's down to 20%, with only around 3% of the most productive valley-bottom old growth still standing. The Fairy Creek blockades — the largest act of civil disobedience in Canadian history, with over 1,100 arrests — were an attempt to save some of the last intact valleys. When you walk among these trees, you're in contested, living terrain."
                    tags={["Old-growth crisis", "Active logging conflict", "20% remaining"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Tofino & Pacific Rim · Coastal Access</div>
                  <ListItem name="Tofino's permanent population is 2,500. Summer brings 20 times that."
                    detail="The Tofino corridor absorbs extreme visitor density against a tiny permanent community and a sensitive marine environment. Grey whale migration, sea otters, and nesting shorebirds share the coastline with surfers and day-trippers. Stay on boardwalks in the dune systems, give wide berth to any wildlife, and book well ahead so you're not improvising accommodation in sensitive areas."
                    note="◈ Pacific Rim National Park Reserve requires day-use fees — they fund trail maintenance and wildlife monitoring"
                    tags={["Coastal wildlife", "Dune protection", "Book ahead"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous-Led Tourism · Active Stewardship</div>
                  <ListItem name="Seek out Indigenous-led experiences. They're the best ones anyway."
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
          <section id="where-to-stay" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="stay" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Sleep</SectionLabel>
              <SectionTitle>Where to sleep</SectionTitle>
              <SectionSub>From sleeping on First Nations territory to watching storms from your room at the edge of the Pacific.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="p-3.5 px-4 bg-cream border border-stone mb-5 flex flex-col md:flex-row gap-2.5 md:gap-4 flex-wrap">
                {[
                  { label: "Elemental", desc: "In the landscape", color: C.seaGlass },
                  { label: "Rooted", desc: "Boutique, local", color: C.oceanTeal },
                  { label: "Premium", desc: "Elevated experience", color: C.goldenAmber },
                ].map((t, i) => (
                  <div key={i} className="flex-none md:flex-[1_1_140px]">
                    <span className="font-body text-[12px] font-bold tracking-[0.1em]" style={{ color: t.color }}>{t.label}</span>
                    <span className="font-body text-[13px] font-normal text-[#4A5650] ml-1.5">{t.desc}</span>
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
          {/* MOVE                                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="move" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="move" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Move</SectionLabel>
              <SectionTitle>{"How to get into the landscape"}</SectionTitle>
              <SectionSub>{"Old-growth forest trails, cold-water surfing, and the bike path to Long Beach."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.05}>
              <TierFilter tiers={moveFilterTiers} activeTiers={activeMoveTiers} onToggle={handleMoveToggle} />
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="activities">
                {moveItems.filter(item => activeMoveTiers.has(item.moveTier)).sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(item => (
                  <TierItem
                    key={item.id}
                    name={item.name}
                    location={item.location}
                    tier={item.moveTier}
                    tierStyles={MOVE_TIERS}
                    detail={item.highlights?.join('. ')}
                    tags={item.tags}
                    url={item.links?.website}
                    featured={item.lilaPick}
                    note={item.bookingWindow}
                    duration={item.duration}
                    distance={item.distance}
                    operator={item.operator}
                    onOpenSheet={openSheet('Move')}
                  />
                ))}
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* BREATHE                                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="wellness" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="breathe" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Breathe</SectionLabel>
              <SectionTitle>{"Soaking, forest bathing & practice"}</SectionTitle>
              <SectionSub>{"Forest bathing, geothermal springs, and the Pacific as practice."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.05}>
              <TierFilter tiers={breatheFilterTiers} activeTiers={activeBreatheTiers} onToggle={handleBreatheToggle} />
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="wellness options">
                {breatheItems.filter(item => activeBreatheTiers.has(item.breatheTier)).sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(item => (
                  <TierItem
                    key={item.id}
                    name={item.name}
                    location={item.location}
                    tier={item.breatheTier}
                    tierStyles={BREATHE_TIERS}
                    detail={item.highlights?.join('. ')}
                    tags={item.tags}
                    url={item.links?.website}
                    featured={item.lilaPick}
                    note={item.bookingWindow}
                    tradition={item.tradition}
                    onOpenSheet={openSheet('Breathe')}
                  />
                ))}
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* LIGHT & SKY — DISCOVER                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="light-sky" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="awaken" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Night Sky</SectionLabel>
              <SectionTitle>{"Wildlife, storms & the living coast"}</SectionTitle>
              <SectionSub>{"Whales offshore. Bears on the shoreline. Storms that shake the windows. The coast at its most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="experiences">
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Whale Watching with Ahous Adventures" featured
                  url="https://www.ahousadventures.com/"
                  detail="The Ahousaht Nation-owned tour operator. Gray whales (March-October), humpbacks (summer-fall), occasional orcas. Guides carry Ahousaht cultural knowledge — place names, ecological relationships, history. Visitors are guests in Ahousaht haḥuułii."
                  note="The recommended operator — every tour is an act of reciprocity"
                  tags={["Whale Watching", "Ahousaht Nation", "Mar-Oct", "Cultural"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Bear Watching" featured
                  url="https://www.ahousadventures.com/"
                  detail="Black bears foraging along the rocky intertidal shores of Clayoquot Sound. Best viewed by zodiac with an experienced guide. Spring through fall is the active season."
                  tags={["Bear Watching", "Zodiac", "Spring-Fall", "Ahousaht Guides"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Storm Watching" featured
                  detail="November through January for peak dramatic Pacific storms. The best vantage points are Chesterman Beach, the Wild Pacific Trail in Ucluelet, and from the windows of the Wickaninnish Inn. Many lodges host dedicated storm watching packages."
                  tags={["Nov-Jan", "Chesterman Beach", "Lodge Packages", "Dramatic"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Tofino Botanical Gardens"
                  url="https://www.tofinobotanicalgardens.com/"
                  detail="A 12-acre coastal garden at the edge of Tofino, adjacent to a working estuary. Native plant collections, Pacific Rim ecology exhibits, and seasonal events including the Tofino Food and Wine Festival in October."
                  tags={["Gardens", "Ecology", "12 Acres", "Year-Round"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Raincoast Education Society"
                  url="https://www.raincoast.org/"
                  detail="Tofino-based environmental education nonprofit running guided intertidal ecology walks, marine ecosystem programming, and naturalist-led experiences. One of the better ways to understand what you're looking at on the coast."
                  tags={["Ecology Walks", "Marine Programs", "Educational", "Seasonal"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* EAT                                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="eat" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="connect" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Eat</SectionLabel>
              <SectionTitle>Where to eat</SectionTitle>
              <SectionSub>{"The restaurants, cafés, and provisions that fuel the trip."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={4} label="places">
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
                    onOpenSheet={openSheet('Eat')}
                    cuisine={r.cuisine}
                    priceRange={r.priceRange}
                    reservations={r.reservations}
                    dietary={r.dietary}
                    energy={r.energy}
                  />
                ))}
                {restaurants.filter(r => r.corridor).length > 0 && (
                  <>
                    <p className="font-body text-[13px] font-semibold tracking-[0.08em] uppercase text-warm-gray mt-8 mb-3">
                      Regional Corridor
                    </p>
                    {restaurants.filter(r => r.corridor).sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(r => (
                      <ListItem
                        key={r.id}
                        name={r.name}
                        detail={r.highlights?.join('. ')}
                        note={r.hours}
                        tags={r.tags}
                        featured={r.lilaPick}
                        url={r.links?.website}
                        location={r.location}
                        onOpenSheet={openSheet('Eat')}
                      />
                    ))}
                  </>
                )}
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* EXPERIENCE                                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="experience" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="connect" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Experience</SectionLabel>
              <SectionTitle>{"Culture, heritage & discovery"}</SectionTitle>
              <SectionSub>{"Cultural sites, Indigenous heritage, and galleries worth your time."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={4} label="experiences">
                {experiences.sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(item => (
                  <ListItem
                    key={item.id}
                    name={item.name}
                    detail={item.highlights?.join('. ')}
                    note={item.hours}
                    tags={item.tags}
                    featured={item.lilaPick}
                    url={item.links?.website}
                    location={item.location}
                    onOpenSheet={openSheet('Experience')}
                  />
                ))}
              </ExpandableList>
            </FadeIn>
          </section>



          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* GIVE BACK                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="give-back" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="threshold" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Give Back</SectionLabel>
              <SectionTitle>Leave it better than you found it.</SectionTitle>
              <SectionSub>The old growth is still being logged. These organizations are fighting to stop it — and to restore what's been lost.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous Giving</div>
                  <ListItem name="Tla-o-qui-aht Tribal Parks"
                    url="https://www.tribalparks.com"
                    detail="Tla-o-qui-aht and neighboring First Nations have protected 76,000 hectares of critical habitat — the largest intact coastal temperate rainforest on Vancouver Island — through Indigenous governance. Donate directly or look for the Tribal Parks Allies logo on Tofino businesses whose 1% revenue contribution funds Guardian programs on the ground."
                    tags={["Donate", "Support Allied Businesses"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Conservation</div>
                  <ListItem name="Ancient Forest Alliance"
                    url="https://ancientforestalliance.org"
                    detail="The leading charitable organization working to protect BC's endangered old-growth forests and ensure a transition to sustainable second-growth forestry. Direct donations support advocacy, documentation, and political pressure on the BC government."
                    tags={["Donate"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Cultural Preservation</div>
                  <ListItem name="U'mista Cultural Centre"
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
          <section id="cta" className="scroll-mt-[126px] pt-14 pb-[72px] text-center">
            <FadeIn>
              <span className="font-body text-[12px] font-bold tracking-[0.28em] uppercase text-ocean-teal block mb-4">Begin</span>
              <h3 className="font-serif text-[clamp(28px,5vw,42px)] font-light text-dark-ink mt-0 mb-2.5 leading-[1.2]">Your island journey starts here</h3>
              <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] max-w-[460px] mx-auto mb-9 leading-[1.65] mt-0">
                Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you.
              </p>
              <Link to="/plan"
                className="py-3.5 px-9 border-none bg-dark-ink text-white text-center inline-block font-body text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-opacity duration-200 no-underline hover:opacity-85"
                onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'vancouver-island' })}
              >{"Plan a Trip"}</Link>
            </FadeIn>
          </section>

          {/* ── Also Explore ────────────────────────────────────────────── */}
          <Divider />
          <FadeIn>
            <div className="py-11">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <span className="eyebrow text-[#7A857E]">Also Explore</span>
                <span className="font-body text-[12px] font-semibold tracking-[0.1em] text-[#7A857E]">Guides available for each destination</span>
              </div>
              <div className="flex gap-4 flex-wrap mt-4">
                {[
                  { name: "Zion Canyon", slug: "zion-canyon", accent: C.sunSalmon },
                  { name: "Joshua Tree", slug: "joshua-tree", accent: C.goldenAmber },
                  { name: "Olympic Peninsula", slug: "olympic-peninsula", accent: C.skyBlue },
                  { name: "Big Sur", slug: "big-sur", accent: C.seaGlass },
                  { name: "Kauai", slug: "kauai", accent: C.oceanTeal },
                ].map(other => (
                  <Link key={other.slug} to={`/destinations/${other.slug}`}
                    className="flex items-center gap-3 py-3 px-5 border border-stone transition-all duration-[250ms] bg-warm-white no-underline"
                    onMouseEnter={e => { e.currentTarget.style.borderColor = other.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.stone; }}
                  >
                    <div className="w-2 h-2 rounded-full opacity-60" style={{ background: other.accent }} />
                    <span className="font-body text-[13px] font-semibold tracking-[0.1em] uppercase text-dark-ink">{other.name}</span>
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
