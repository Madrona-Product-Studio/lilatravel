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
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon, TierItem, TierLegend } from '@components/guide';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/kauai.json';
import restaurants from '../../data/restaurants/kauai-eat.json';
import experiences from '../../data/restaurants/kauai-experience.json';
import breatheItems from '../../data/restaurants/kauai-breathe.json';
import moveItems from '../../data/restaurants/kauai-move.json';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';


// ─── Guide-Specific Components ───────────────────────────────────────────────
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

      <h3 className="font-serif text-[clamp(22px,4vw,28px)] font-normal text-dark-ink mb-2.5 leading-[1.2] mt-0">{item.name}</h3>

      {item.featured && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-ocean-teal mb-3.5 px-2.5 py-0.5"
          style={{ border: `1px solid ${C.oceanTeal}40` }}>Lila Pick</span>
      )}

      {item.detail && (
        <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] mt-0 mb-3.5">{item.detail}</p>
      )}

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

      {item.tags && item.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-5">
          {item.tags.map((t, i) => (
            <span key={i} className="font-body text-[12px] font-semibold text-[#7A857E] py-[3px] px-2.5"
              style={{ background: C.stone + '60' }}>{t}</span>
          ))}
        </div>
      )}

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
  climb: { color: '#E8A090', label: 'Climb', bg: '#E8A09015' },
};

const MOVE_TIER_META = {
  hike:  { label: 'Hike',  desc: 'On foot',          color: '#8a8078' },
  water: { label: 'Water', desc: 'Surf & paddle',    color: '#7BB8D4' },
  ride:  { label: 'Ride',  desc: 'Cycle & roll',     color: '#D4A853' },
  climb: { label: 'Climb', desc: 'Vertical terrain',  color: '#E8A090' },
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

export default function KauaiGuide() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const breathConfig = BREATH_CONFIG.kauai;
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
      <Nav breathConfig={breathConfig} />

      {/* ══ CELESTIAL DRAWER ═══════════════════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? C.warmWhite : undefined }}>
          <CelestialDrawer destination="kauai" isMobile={isMobile} breathValueRef={breathValueRef} />

          {/* ══ TITLE MASTHEAD ═══════════════════════════════════════════════════ */}
          <section style={{ background: breathConfig ? 'transparent' : C.cream }}>
        <div className="py-7 px-5 md:py-11 md:px-[52px] md:pb-10 max-w-[920px] mx-auto">
          <FadeIn from="bottom" delay={0.1}>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-7 md:gap-[52px] items-start">

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow text-ocean-teal mb-3.5 block">Destination Guide</span>

                <h1 className="font-serif text-[clamp(38px,6vw,64px)] font-light text-dark-ink leading-none mb-[22px] tracking-[-0.02em] mt-0">
                  {"Kauaʻi — The Garden Isle"}
                </h1>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] mt-0 mb-3.5">
                  {"Kauaʻi is the oldest of the main Hawaiian Islands — five million years old, worn into shapes the other islands haven't had time to become yet. The Nā Pali Coast is an argument for the word sublime. The Waimea Canyon earned the name \"Grand Canyon of the Pacific\" without apology."}
                </p>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] m-0">
                  {"The island is small enough that you can understand its geography from a single lookout but rich enough that a week barely touches the surface. We built this guide to help you find it."}
                </p>
              </div>

              {/* ── Right: This Guide Covers ── */}
              <div className="border-t md:border-t-0 md:border-l border-stone pt-7 md:pt-0 md:pl-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-[18px]">This guide covers</div>

                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-ocean-teal mb-2.5">Island Areas</div>
                  {["North Shore (Hanalei)", "South Shore (Poipū)", "West Side (Waimea)", "East Side (Kapaʻa / Līhuʻe)"].map((area, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-[7px]">
                      <div className="w-[5px] h-[5px] rounded-full bg-ocean-teal opacity-50" />
                      <span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{area}</span>
                    </div>
                  ))}
                </div>

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
            { src: P.kauaiNapaliCoast,   alt: "Nā Pali Coast trail",         caption: "Nā Pali Coast — the trail begins",     width: 420 },
            { src: P.kauaiGardens,        alt: "Kauaʻi gardens at golden hour", caption: "Garden light at golden hour",          width: 280 },
            { src: P.kauaiKalalauValley,  alt: "Kalalau Valley overlook",     caption: "Kalalau Valley — from the rim",         width: 420 },
            { src: P.kauaiWaimeaCanyon,   alt: "Waimea Canyon waterfall",     caption: "Waimea Canyon — the Pacific's Grand Canyon", width: 360 },
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
                {"Kauaʻi is the oldest of the main Hawaiian Islands — five million years old, worn into shapes the other islands haven't had time to become yet. The Nā Pali Coast in the northwest is an argument for the word sublime: fluted sea cliffs rising 4,000 feet directly from the Pacific, draped in waterfalls, inaccessible by road. The Waimea Canyon cuts 14 miles through the island's interior — red rock, green forest, silver river."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"The island is wetter than the other islands — Mount Waiʻaleʻale, near the center, receives an average of 450 inches of rain a year, making it one of the wettest places on Earth. That rain feeds waterfalls visible from the road, keeps the vegetation impossibly green, and defines the character of the land."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                {"The Hawaiian people have called Kauaʻi home for over 1,500 years. Place names carry history: Hanalei means \"crescent bay\"; Waimea means \"reddish water\"; Poipū is a place of crashing waves. The island avoided many of the worst impacts of tourism development through a building-height ordinance — no structure taller than a palm tree — and through active Native Hawaiian advocacy. That restraint shapes what Kauaʻi still is."}
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3 md:gap-4 p-4 md:p-5 bg-cream border border-stone mb-5">
                {[
                  { l: "Recommended", v: "5–7 days" },
                  { l: "Nearest Airport", v: "Lihue (LIH)" },
                  { l: "Direct Flights", v: "West Coast" },
                  { l: "Best Times", v: "Apr–Oct" },
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
              <SectionSub>{"Kauaʻi rewards every season differently. These are the moments when the island is most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem onOpenSheet={openSheet('When to Go')} name="Humpback Whale Season" featured
                  detail={"Humpbacks arrive in December and peak January through March. Best viewed from the cliffs above Poipū or Kīlauea Lighthouse headland. Whale spouts visible by moonlight from the south shore overlooks."}
                  tags={["Dec – Apr", "Wildlife", "Magic Window"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Kalalau Trail in Spring" featured
                  detail={"April through May: optimal conditions before summer crowds and heat. Nā Pali sea conditions improving for boat tours. Waimea Canyon wildflowers."}
                  tags={["Apr – May", "Hiking", "Fewer Crowds"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Summer — North Shore Calm"
                  detail={"Hanalei Bay calms down for swimming, kayaking, and SUP. The bay is one of the finest flat-water environments in the Pacific. Milky Way visible from dark beaches."}
                  tags={["Jun – Sep", "Swimming", "Stargazing"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Makahiki Season"
                  detail={"The traditional Hawaiian winter — November through January — a time of rest, ceremony, and renewal in the Hawaiian calendar. A meaningful cultural context for a visit."}
                  tags={["Nov – Jan", "Hawaiian Culture", "Ceremony"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Fall Shoulder Season"
                  detail={"October and November: least crowded season. Weather unpredictable but some of the best trade wind conditions. Prices lower."}
                  tags={["Oct – Nov", "Value", "Trade Winds"]} />
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
              <SectionSub>Hawaiʻi receives more visitors per resident than almost anywhere on earth. Travel with that in mind.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Visitor Density · 10M Arrivals</div>
                  <ListItem name="Hawaiʻi receives more visitors per resident than almost anywhere on earth."
                    detail="Hawaiʻi hit a record 10.4 million visitors in 2019 — for a resident population of 1.4 million, on a chain of islands with finite resources. Kauaʻi is the least developed of the major islands and absorbs this pressure on a smaller infrastructure. The tension between residents and visitors is real and documented. Traveling with awareness of that dynamic — not just the landscape — is part of what it means to visit respectfully."
                    tags={["Visitor pressure", "Resident tension", "Travel mindfully"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Heiau · Sacred Sites</div>
                  <ListItem name="Some places are not on the map. They shouldn't be."
                    detail="Heiau — ancient Hawaiian temples, fishing shrines, and ceremonial platforms — have been desecrated in their use and misuse as tourist attractions, and hundreds have been destroyed for resort development. Several heiau on Kauaʻi are known to locals and deliberately kept off visitor maps. We do not put these places on itineraries. If you encounter a site that looks ceremonial or marked, leave it undisturbed and do not photograph it."
                    tags={["Sacred sites", "No photography", "Leave undisturbed"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Nā Pali Coast · Trail Safety</div>
                  <ListItem name="Rescues on the Kalalau Trail are common. Go prepared or don't go."
                    detail="The Kalalau Trail is one of the most spectacular and most dangerous trails in the United States. Flash flooding, steep unprotected sections, and difficult river crossings have killed experienced hikers. Permits are required and limited. If you don't have one, the legal beaches are accessible by kayak or boat tour. We route around unpermitted sections entirely."
                    note="◈ Day hiking to Hanakāpīʻai Beach (2 miles) requires no permit — the full 11-mile Kalalau Trail requires a camping permit"
                    tags={["Permit required", "Flash flood risk", "Know your limits"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Hāʻena State Park · Community-Managed Access</div>
                  <ListItem name="The north shore developed a new model. Follow it."
                    detail="Hāʻena State Park was the first in Hawaiʻi to set a daily visitor cap, managed by two nonprofits led by Native Hawaiian lineal descendants. Nonresidents must reserve and pay for entry. This is what responsible access looks like in practice — a community-led system built because the alternative was losing the place entirely. Book your reservation, pay the fee, and recognize the system as the point."
                    tags={["Reservation required", "Community-managed", "Daily visitor cap"]} />
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
              <SectionSub>{"How you inhabit a place matters. From beach camping under the Nā Pali cliffs to the island's grandest resort."}</SectionSub>
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
              <SectionIcon type="move" />
              <SectionLabel>Move</SectionLabel>
              <SectionTitle>How to get into the landscape</SectionTitle>
              <SectionSub>{"Nā Pali coast hikes, Hanalei surfing, and the best coastal cycling in Hawaii."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.05}>
              <TierLegend tiers={moveLegend} />
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="activities">
                {moveItems.sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(item => (
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
                    light={item.type === 'climb'}
                  />
                ))}
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* WELLNESS                                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="wellness" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="breathe" />
              <SectionLabel>Breathe</SectionLabel>
              <SectionTitle>{"Yoga, Hawaiian healing & ancient terraces"}</SectionTitle>
              <SectionSub>{"Yoga, Hawaiian healing traditions, and ancient terraces as practice."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.05}>
              <TierLegend tiers={BREATHE_LEGEND} />
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="wellness options">
                {breatheItems.sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(item => (
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
                  />
                ))}
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
      <section id="light-sky" className="scroll-mt-[126px] py-[52px] px-5 md:py-16 md:px-[52px] bg-dark-ink">
        <div className="max-w-[680px] mx-auto">
          <FadeIn>
            <SectionIcon type="awaken" color={ACCENT} />
            <div className="font-body text-[12px] font-bold tracking-[0.28em] uppercase text-ocean-teal mb-3 text-center">Night Sky</div>
            <h2 className="font-serif text-[clamp(24px,4vw,32px)] font-normal text-white m-0 mb-1.5 leading-[1.2] text-center">{"Light & sky"}</h2>
            <p className="font-body text-[15px] md:text-[clamp(14px,1.8vw,15px)] font-normal text-white/70 mx-auto mb-7 leading-[1.7] text-left md:text-center max-w-full md:max-w-[520px]">
              {"No IDA designation, but the island's building-height law and low development density create genuinely dark conditions on the south and west shores. The Milky Way core is visible from the coast on moonless nights between April and October."}
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            <div className="mb-8">
              <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-ocean-teal mb-4">Best Viewing Locations</div>
              {[
                { name: "Poipū Beach / Shipwreck Beach (South Shore)", note: "Open horizon to the south and west, minimal coastal light. Best for Milky Way core viewing." },
                { name: "Polihale State Park (West Shore)", note: "The most remote and darkest beach accessible by road on Kauaʻi. Open horizon, no development for miles. Bortle 3." },
                { name: "Kīlauea Lighthouse headland (North Shore)", note: "Faces open ocean north; best for star trails and Milky Way arcing overhead." },
              ].map((area, i) => (
                <div key={i} className="py-3.5 border-b border-white/10">
                  <div className="font-body text-[14px] font-semibold text-white mb-1">{area.name}</div>
                  <div className="font-body text-[13px] font-normal text-white/55 leading-[1.6]">{area.note}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mb-8">
              <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-ocean-teal mb-4">Calendar Anchors</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { event: "Milky Way Core", timing: "Apr – Oct", detail: "Best from June–August when the core is highest" },
                  { event: "Perseid Meteor Shower", timing: "Mid-August", detail: "Peak around the 12th — best from dark beaches" },
                  { event: "Whale Spouts by Moonlight", timing: "Dec – Apr", detail: "Rare pairing: whale spouts visible from south shore overlooks" },
                  { event: "Humpback Peak", timing: "Jan – Mar", detail: "Best from Kīlauea Lighthouse or Poipū clifftops" },
                ].map((cal, i) => (
                  <div key={i} className="p-3.5 px-4 border border-white/[0.12]" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="font-body text-[14px] font-semibold text-white mb-[3px]">{cal.event}</div>
                    <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-ocean-teal mb-1">{cal.timing}</div>
                    <div className="font-body text-[12px] font-normal text-white/50">{cal.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div className="p-4 px-[18px] border border-white/[0.12]" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-ocean-teal mb-2.5">Marine Layer Note</div>
              <p className="font-body text-[13px] font-normal text-white/60 leading-[1.7] m-0">
                {"Cloud cover can roll in quickly at night from the north and east. South and west shore locations (Poipū, Polihale) tend to be clearest. Check Clear Outside before committing to a late drive to Polihale."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Continue guide content */}
      <section className="px-5 pb-[60px] md:px-[52px] md:pb-20 bg-cream">
        <div className="max-w-[680px] mx-auto">


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* EAT                                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="eat" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Eat</SectionLabel>
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
              </ExpandableList>
            </FadeIn>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* EXPERIENCE                                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="experience" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Experience</SectionLabel>
              <SectionTitle>{"Culture, heritage & discovery"}</SectionTitle>
              <SectionSub>{"Sacred sites, farm tours, Indigenous heritage, and the living culture of Kauaʻi."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={4} label="experiences">
                {experiences.sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(item => (
                  <ListItem key={item.id} name={item.name} detail={item.highlights?.join('. ')} note={item.hours} tags={item.tags} featured={item.lilaPick} url={item.links?.website} location={item.location} />
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
              <SectionSub>Mālama — to care for. These organizations make that concrete.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Conservation</div>
                  <ListItem name="Mālama Hawaiʻi"
                    url="https://www.gohawaii.com/malama"
                    detail="A statewide program connecting visitors to volunteer opportunities — beach cleanups, native tree planting, cultural preservation projects. Several participating hotels offer a complimentary night in exchange for a volunteer day. One of the cleanest models in regenerative tourism anywhere."
                    tags={["Volunteer", "Book a Mālama Stay"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Conservation</div>
                  <ListItem name="Hawaiʻi Conservation Alliance"
                    url="https://www.hawaiiconservation.org"
                    detail="Provides unified scientific and community leadership to conserve and restore native ecosystems across the islands, guided by Hawaiian values and practice. Donations support watershed protection and native species restoration."
                    tags={["Donate"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous Giving</div>
                  <ListItem name="Malama Kauai"
                    url="https://malamakauai.org"
                    detail="Kauaʻi-based community organization running local food, land stewardship, and cultural programs rooted in Native Hawaiian relationships to ʻāina. Beach cleanup events, native planting, and community food programs are open to visitors."
                    tags={["Volunteer", "Donate"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous Giving</div>
                  <ListItem name="Hawaiʻi Natural Area Reserves System"
                    url="https://dlnr.hawaii.gov/ecosystems/nars/donate"
                    detail="Direct donations fund protection of critical watersheds and native habitats — including culturally significant areas not open to visitors that depend entirely on funding to survive. One of the most direct conservation giving options in the state."
                    tags={["Donate"]} />
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
              <h3 className="font-serif text-[clamp(28px,5vw,42px)] font-light text-dark-ink m-0 mb-2.5 leading-[1.2]">{"Your island trip starts here"}</h3>
              <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] max-w-[460px] mx-auto mb-9 leading-[1.65]">
                {"Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you."}
              </p>
              <Link to="/plan"
                className="py-3.5 px-9 border-none bg-dark-ink text-white text-center inline-block font-body text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-opacity duration-200 no-underline hover:opacity-85"
                onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'kauai' })}
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
                  { name: "Vancouver Island", slug: "vancouver-island", accent: C.oceanTeal },
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
      <WhisperBar destination="kauai" label="Kauaʻi" />
      <Footer />
    </>
  );
}
