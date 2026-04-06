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
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon, TierItem, TierLegend, TierFilter } from '@components/guide';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/big-sur.json';
import restaurants from '../../data/restaurants/big-sur-eat.json';
import experiences from '../../data/restaurants/big-sur-experience.json';
import breatheItems from '../../data/restaurants/big-sur-breathe.json';
import moveItems from '../../data/restaurants/big-sur-move.json';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';


// --- Guide-Specific Components ------------------------------------------------
// SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon imported from @components/guide
const ACCENT = C.seaGlass;

function ListItem({ name, detail, note, tags, featured, url, onOpenSheet, location, cuisine, priceRange, reservations, dietary, energy }) {
  const nameEl = onOpenSheet ? (
    <span className="font-body text-[15px] font-semibold text-dark-ink">{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="font-body text-[15px] font-semibold text-dark-ink no-underline transition-[border-color,color] duration-200"
      style={{ borderBottom: `1px solid ${C.stone}` }}
      onMouseEnter={e => { e.target.style.borderColor = C.seaGlass; e.target.style.color = C.slate || "#3D5A6B"; }}
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
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sea-glass px-2.5 py-0.5"
              style={{ border: `1px solid ${C.seaGlass}40` }}>{"Lila Pick"}</span>
          )}
        </div>
        <div className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.65]">{detail}</div>
        {note && (
          <div className="font-body text-[12px] font-semibold text-sea-glass mt-1">{note}</div>
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
    rooted: { color: C.seaGlass, label: "Rooted", bg: `${C.seaGlass}12` },
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
      onMouseEnter={e => e.target.style.borderColor = C.seaGlass}
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
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sea-glass px-2.5 py-0.5"
              style={{ border: `1px solid ${C.seaGlass}40` }}>{"Lila Pick"}</span>
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

function CollapsibleSection({ id, label, title, teaser, isOpen, onToggle, children }) {
  const bodyRef = useRef(null);

  return (
    <section id={id} className="scroll-mt-[126px]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-6 bg-transparent border-none cursor-pointer text-left group"
      >
        <div className="flex-1 min-w-0">
          <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase mb-1 text-[#7A857E]">{label}</div>
          <div className="font-serif text-[clamp(20px,3vw,26px)] font-light leading-[1.2] text-dark-ink">{title}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-body text-[12px] whitespace-nowrap text-[#7A857E]">{teaser}</span>
          <span className="inline-block text-[12px] transition-transform duration-300 ease-in-out text-[#7A857E]"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </div>
      </button>
      <div
        className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ maxHeight: isOpen ? 5000 : 0 }}
      >
        <div ref={bodyRef} className="pb-6">
          {children}
        </div>
      </div>
    </section>
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
    rooted: { color: C.seaGlass, label: "Rooted", bg: `${C.seaGlass}12` },
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
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sea-glass mb-2.5 px-2.5 py-0.5"
          style={{ background: `${C.seaGlass}15` }}>{item.section}</span>
      )}

      <h3 className="font-serif text-[clamp(22px,4vw,28px)] font-normal text-dark-ink mb-2.5 leading-[1.2] mt-0">{item.name}</h3>

      {item.featured && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sea-glass mb-3.5 px-2.5 py-0.5"
          style={{ border: `1px solid ${C.seaGlass}40` }}>Lila Pick</span>
      )}

      {item.type === 'tier' && item.highlights && item.highlights.length > 0 && (
        <div className="mb-[18px]">
          {item.highlights.map((h, i) => (
            <div key={i} className="flex gap-2.5 items-start mb-[7px]">
              <div className="w-1 h-1 rounded-full mt-[7px] shrink-0" style={{ background: C.skyBlue, opacity: 0.6 }} />
              <span className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7]">{h}</span>
            </div>
          ))}
        </div>
      )}

      {item.detail && (
        <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] mt-0 mb-3.5">{item.detail}</p>
      )}

      {item.note && (
        <div className="font-body text-[13px] font-semibold text-sea-glass mb-3.5">{item.note}</div>
      )}

      {item.type === 'tier' && (item.difficulty || item.duration || item.distance || item.operator || item.bookingWindow || item.tradition || item.priceRange) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-[18px] py-3.5 border-y border-stone">
          {item.difficulty && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Difficulty</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.difficulty}</div>
            </div>
          )}
          {item.distance && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Distance</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.distance}</div>
            </div>
          )}
          {item.duration && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Duration</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.duration}</div>
            </div>
          )}
          {item.tradition && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Tradition</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.tradition}</div>
            </div>
          )}
          {item.operator && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Operator</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.operator}</div>
            </div>
          )}
          {item.priceRange && (
            <div>
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Price</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.priceRange}</div>
            </div>
          )}
          {item.bookingWindow && (
            <div className="col-span-full">
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Booking</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.bookingWindow}</div>
            </div>
          )}
          {item.location && (
            <div className="col-span-full">
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">Location</div>
              <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.location}</div>
            </div>
          )}
        </div>
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
              <span key={i} className="font-body text-[12px] font-semibold text-sea-glass py-[3px] px-2.5" style={{ background: `${C.seaGlass}10` }}>{a}</span>
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
          className="inline-flex items-center gap-1.5 py-2.5 px-5 font-body text-[12px] font-bold tracking-[0.16em] uppercase text-sea-glass no-underline transition-all duration-[250ms]"
          style={{ border: `1.5px solid ${C.seaGlass}` }}
          onMouseEnter={e => { e.currentTarget.style.background = C.seaGlass; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.seaGlass; }}
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

function ParkCard({ park }) {
  const DESIGNATION_LABELS = {
    "us-national-park": "National Park",
    "canadian-national-park": "National Park Reserve",
    "state-park": "State Park",
    "provincial-park": "Provincial Park",
    "national-forest": "National Forest",
    "state-wilderness": "State Wilderness Preserve",
  };
  const stats = [park.acreage, park.elevation, park.attribute, park.driveFrom].filter(Boolean);
  return (
    <div style={{ background: C.warmWhite }} className="p-4 md:p-5">
      <div className="font-body text-[9px] tracking-[0.16em] uppercase text-[#7A857E] mb-1">
        {DESIGNATION_LABELS[park.designation] || park.designation}{park.established ? ` · Est. ${park.established}` : ""}
      </div>
      <div className="font-serif font-normal text-[20px] text-dark-ink leading-[1.2] mb-1">{park.name}</div>
      <div className="font-body text-[11px] text-[#7A857E] leading-[1.4] mb-3">
        {stats.map((s, i) => <span key={i}>{i > 0 && " · "}{s}</span>)}
      </div>
      <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.7] m-0">{park.soul}</p>
      {park.infoUrl && (
        <a href={park.infoUrl} target="_blank" rel="noopener noreferrer"
          className="inline-block mt-3 font-body text-[10px] font-bold tracking-[0.12em] uppercase no-underline"
          style={{ color: C.goldenAmber, borderBottom: '1px solid rgba(212,168,83,0.3)' }}>
          {park.infoUrl.includes('nps.gov') ? `nps.gov/${park.infoUrl.split('nps.gov/')[1].replace(/\/$/, '')}` : park.infoUrl.includes('parks.canada.ca') ? 'Parks Canada' : park.infoUrl.includes('parks.ca.gov') ? 'CA State Parks' : park.infoUrl.includes('fs.usda.gov') ? 'US Forest Service' : 'Park Info'} ↗
        </a>
      )}
    </div>
  );
}


// --- Tier constants (Move / Breathe) ------------------------------------------

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
const sleepFilterTiers = [
  { key: 'elemental', label: 'Elemental', desc: 'In the landscape', color: '#7BB8A0' },
  { key: 'rooted',    label: 'Rooted',    desc: 'Boutique, local',  color: '#4A9B9F' },
  { key: 'premium',   label: 'Premium',   desc: 'World-class',      color: '#D4A853' },
];

// --- Guide Section Navigation (sticky anchor bar) ----------------------------

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

function GuideNav({ isMobile, onOpenSection }) {
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
    if (onOpenSection) onOpenSection(id);
    const el = document.getElementById(id);
    if (!el) return;
    const mainNavHeight = isMobile ? 58 : 64;
    const guideNavHeight = isMobile ? 0 : 52;
    const y = el.getBoundingClientRect().top + window.scrollY - guideNavHeight - mainNavHeight - 32;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, [isMobile, onOpenSection]);

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
                  borderBottom: `2px solid ${isActive ? C.seaGlass : "transparent"}`,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? C.seaGlass : "#7A857E",
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




// --- Main Page ----------------------------------------------------------------

export default function BigSurGuide() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const breathConfig = BREATH_CONFIG.bigSur;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
  const [activeSleepTiers, setActiveSleepTiers] = useState(() => new Set(['elemental', 'rooted', 'premium', 'luxury']));
  const handleSleepToggle = (tierKey) => {
    setActiveSleepTiers(prev => {
      if (prev.has(tierKey) && prev.size === 1) return prev;
      const next = new Set(prev);
      next.has(tierKey) ? next.delete(tierKey) : next.add(tierKey);
      return next;
    });
  };
  const [collapsedSections, setCollapsedSections] = useState({
    'where-to-stay': true,
    'move': true,
    'wellness': true,
    'light-sky': true,
    'eat': true,
    'experience': true,
    'give-back': true,
  });
  const toggleSection = useCallback((id) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);
  const openSection = useCallback((id) => {
    setCollapsedSections(prev => prev[id] ? { ...prev, [id]: false } : prev);
  }, []);
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
      <Nav breathConfig={breathConfig} />

      {/* == CELESTIAL DRAWER ================================================ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? C.warmWhite : undefined }}>
          <CelestialDrawer destination="big-sur" isMobile={isMobile} breathValueRef={breathValueRef} />

          {/* == TITLE MASTHEAD ================================================== */}
          <section style={{ background: breathConfig ? 'transparent' : C.cream }}>
        <div className="py-7 px-5 md:py-11 md:px-[52px] md:pb-10 max-w-[920px] mx-auto">
          <FadeIn from="bottom" delay={0.1}>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-7 md:gap-[52px] items-start">

              {/* -- Left: Title + description -- */}
              <div>
                <span className="eyebrow text-sea-glass mb-3.5 block">Destination Guide</span>

                <h1 className="font-serif text-[clamp(38px,6vw,64px)] font-light text-dark-ink leading-none mb-[22px] tracking-[-0.02em] mt-0">
                  {"Big Sur & the Central Coast"}
                </h1>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] mt-0 mb-3.5">
                  {"Big Sur is not a town. It's a condition. Ninety miles of Highway 1 between Carmel and San Simeon where the Santa Lucia Mountains drop directly into the Pacific — no coastal plain, no buffer, just rock and ocean and redwood and fog. The place has gravity."}
                </p>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] m-0">
                  {"The orbit pulls north to Carmel-by-the-Sea and Monterey, south toward San Simeon and Cambria. We built this guide to help you find the coast, the redwoods, and the edge of the continent."}
                </p>
              </div>

              {/* -- Right: This Guide Covers -- */}
              <div className="border-t md:border-t-0 md:border-l border-stone pt-7 md:pt-0 md:pl-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-[18px]">This guide covers</div>

                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-sea-glass mb-2.5">Gateway & Corridor</div>
                  {["Carmel-by-the-Sea", "Monterey & Pacific Grove", "Big Sur Corridor (Highway 1)", "Cambria & San Simeon"].map((area, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-[7px]">
                      <div className="w-[5px] h-[5px] rounded-full bg-sea-glass opacity-50" />
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

      {/* == GUIDE SECTION NAV =============================================== */}
      <GuideNav isMobile={isMobile} onOpenSection={openSection} />

      {/* == IMAGE STRIP ===================================================== */}
      <section className="relative">
        <div className="flex gap-0.5 overflow-x-auto snap-x snap-mandatory" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {[
            { src: P.bigSur,          alt: "Big Sur coastline at sunset",         caption: "Highway 1 — where the mountains meet the sea", width: 420 },
            { src: P.bigSurSurfer,     alt: "Surfer at sunset in Big Sur",         caption: "Golden hour on the Central Coast",              width: 280 },
            { src: P.bigSurHiddenCove, alt: "Hidden cove along the Big Sur coast", caption: "Hidden cove — only accessible on foot",         width: 420 },
            { src: P.bigSurShoreline,  alt: "Rocky shoreline with crashing wave",  caption: "The shoreline at Garrapata",                    width: 360 },
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

      {/* == GUIDE CONTENT =================================================== */}
      <section className="py-8 px-5 pb-[60px] md:py-12 md:px-[52px] md:pb-20 bg-cream">
        <div className="max-w-[680px] mx-auto">


          {/* ================================================================ */}
          {/* SENSE OF PLACE                                                    */}
          {/* ================================================================ */}
          <section id="sense-of-place" className="scroll-mt-[126px] pt-11 pb-4">
            <FadeIn>
              <SectionLabel accentColor={ACCENT}>Sense of Place</SectionLabel>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"Big Sur is not a town. It's a condition. Ninety miles of Highway 1 between Carmel and San Simeon where the Santa Lucia Mountains drop directly into the Pacific — no coastal plain, no buffer, just rock and ocean and redwood and fog. The landscape here does something to people. It has always drawn artists, seekers, and writers who needed the edge of the continent to think clearly: Henry Miller, Robinson Jeffers, Jack Kerouac, the founders of Esalen. The place has gravity."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"The orbit pulls in two directions. North, Carmel-by-the-Sea is a fairytale village — cottage gardens, galleries, one of the most beautiful white-sand beaches in California. Further north, Monterey is the working counterpoint: the Aquarium, Cannery Row, a serious food scene, the Monterey Bay National Marine Sanctuary extending 276 miles along the coast. These towns are not afterthoughts to Big Sur — they are the base camp."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                {"What Big Sur asks of you is presence. The road is too narrow and winding for distraction. The vistas demand pause. The fog that rolls in most mornings burns off by noon, and when it does, the light on the water is unrepeatable."}
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div>
                <div className="h-px" style={{ background: `${C.darkInk}14` }} />
                <div className="grid grid-cols-2 md:grid-cols-4 py-5">
                  {[
                    { l: "Recommended", v: "3–5 days" },
                    { l: "Nearest Airport", v: "Monterey (MRY)" },
                    { l: "From SFO", v: "~3 hours" },
                    { l: "Best Times", v: "Apr–Oct" },
                  ].map((s, i) => (
                    <div key={i} className="text-center px-3 py-2 md:py-0" style={{ borderLeft: i > 0 ? `1px solid ${C.darkInk}14` : 'none' }}>
                      <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-1">{s.l}</div>
                      <div className="font-body text-[14px] font-medium text-dark-ink leading-[1.3]">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="h-px" style={{ background: `${C.darkInk}14` }} />
              </div>
            </FadeIn>
          </section>


          {/* ================================================================ */}
          {/* THE LAND                                                          */}
          {/* ================================================================ */}
          <section id="the-land" className="scroll-mt-[126px] pb-11">
            {/* ── The Parks ── */}
            <FadeIn>
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: C.seaGlass }}>The Parks</p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="grid grid-cols-1 gap-px mb-1" style={{ background: `${C.darkInk}0A` }}>
                {PARKS.map((park) => (
                  <ParkCard key={park.id} park={park} />
                ))}
              </div>
            </FadeIn>

            {/* ── The Towns ── */}
            <FadeIn delay={0.09}>
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mt-10 mb-3.5" style={{ color: C.goldenAmber }}>The Towns</p>
              <div className="grid grid-cols-1 gap-px" style={{ background: `${C.darkInk}0A` }}>
                {[
                  { name: "Carmel-by-the-Sea", context: "Artistic Village", description: "A one-square-mile village with no street addresses, no chain restaurants, and more than 80 art galleries. The beach at the bottom of Ocean Avenue is one of the most beautiful in California.", accent: C.seaGlass },
                  { name: "Monterey", context: "Cannery Row & Aquarium", description: "Steinbeck's old fishing town, now anchored by the Monterey Bay Aquarium. The wharf, the coastal trail, and Pacific Grove's Victorian neighborhoods are all walkable from downtown.", accent: C.oceanTeal },
                  { name: "Big Sur", context: "Highway 1 Corridor", description: "Not a town so much as a state of mind. Sixty miles of coast between Carmel and San Simeon with no traffic lights. Nepenthe, Deetjen's, and the Henry Miller Library are the landmarks.", accent: C.sunSalmon },
                  { name: "Cambria & San Simeon", context: "Southern Anchor", description: "The quiet end of the coast. Elephant seal rookery at Piedras Blancas, Hearst Castle above the fog line, and Cambria's East Village art scene.", accent: C.goldenAmber },
                ].map(town => (
                  <div key={town.name} style={{ background: C.warmWhite }} className="p-4 md:p-5">
                    <div className="font-body text-[9px] tracking-[0.16em] uppercase text-[#7A857E] mb-1">{town.context}</div>
                    <div className="font-serif font-normal text-[20px] text-dark-ink leading-[1.2] mb-3">{town.name}</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.7] m-0">{town.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* ── Divider ── */}
            <div className="h-px my-10" style={{ background: `${C.darkInk}14` }} />

            {/* ── Places That Stop You ── */}
            <FadeIn delay={0.1}>
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: C.goldenAmber }}>Places That Stop You</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: `${C.darkInk}0A` }}>
                {[
                  { name: "McWay Falls", category: "Waterfall · Cove", blurb: "An 80-foot waterfall that drops directly onto a turquoise cove beach. The definitive image of this coast. Viewable from the overlook trail — no beach access." },
                  { name: "Bixby Creek Bridge", category: "Landmark · Drive", blurb: "The most photographed bridge in California. 714 feet long, 280 feet above the canyon floor. Best seen from the pullout on the north side at golden hour." },
                  { name: "Pfeiffer Beach", category: "Beach · Keyhole Rock", blurb: "Purple sand and a natural rock arch that frames the sunset in winter. The unmarked turnoff on Sycamore Canyon Road is easy to miss. That's part of the charm." },
                  { name: "Ewoldsen Trail", category: "Trail · Redwoods", blurb: "A 4.3-mile loop through old-growth redwoods that opens onto coastal ridge views. The transition from forest floor to exposed ridge happens in a single switchback." },
                  { name: "Point Lobos", category: "Reserve · Tide Pools", blurb: "The crown jewel of California's state reserves. Sea otters in the kelp, harbor seals on the rocks, and some of the richest tide pools on the coast." },
                  { name: "Limekiln State Park", category: "Beach · History", blurb: "Four 19th-century lime kilns standing in a redwood canyon, a waterfall at the end of the trail, and a rocky beach with sea stacks. Most visitors never make it this far south." },
                ].map(h => (
                  <div key={h.name} style={{ background: C.warmWhite }} className="p-4 md:p-5">
                    <div className="font-body text-[11px] font-semibold mb-1" style={{ color: C.goldenAmber }}>◈</div>
                    <div className="font-serif text-[17px] font-normal text-dark-ink leading-[1.3] mb-1">{h.name}</div>
                    <div className="font-body text-[9px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: '#7A857E' }}>{h.category}</div>
                    <p className="font-body text-[12px] font-normal text-[#7A857E] leading-[1.5] m-0">{h.blurb}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ================================================================ */}
          {/* WHEN TO GO                                                        */}
          {/* ================================================================ */}
          <section id="when-to-go" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="windows" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Magic Windows</SectionLabel>
              <SectionTitle>When to go</SectionTitle>
              <SectionSub>{"Big Sur rewards every season differently. These are the moments when the coast is most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem onOpenSheet={openSheet('When to Go')} name="Spring Wildflowers & Waterfalls" featured
                  detail={"March through May: the coast at its most lush and green. Wildflowers through April. Waterfalls at maximum flow after winter rains. McWay Falls and Pfeiffer Falls at their most dramatic. Fog common in the mornings but burns off by noon. Best overall window."}
                  tags={["Mar – May", "Wildflowers", "Waterfalls"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Gray Whale Migration" featured
                  detail={"Gray whales migrate south December through February, north March through April. Peak shore-watching January through March. Point Lobos and the McWay Falls overlook are premier viewing spots. Humpbacks visible March through December."}
                  tags={["Dec – Apr", "Wildlife", "Magic Window"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Fall Shoulder Season"
                  detail={"September through November: fog clears earlier, crowds thin, excellent light. Whale migration begins in late October. The most reliable clear nights for stargazing. The best balance of access and solitude."}
                  tags={["Sep – Nov", "Clear Skies", "Fewer Crowds"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Monarch Butterfly Migration"
                  detail={"Tens of thousands of monarchs overwinter in the Pacific Grove eucalyptus grove near Monterey. Late October through February. The trees draped in living orange. A short walk through the grove is genuinely moving."}
                  tags={["Oct – Feb", "Wildlife", "Pacific Grove"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Summer — Marine Layer Season"
                  detail={"Peak tourist season. Highway 1 can back up. Morning fog is thick and persistent — often doesn't burn off until early afternoon. Redwood canyon hikes are comfortable when the coast is socked in. Milky Way core visible on clear nights."}
                  tags={["Jun – Aug", "Peak Season", "Fog"]} />
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
              <SectionSub>The coast operates on its own terms. Arrive accordingly.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Highway 1 · Erosion & Access</div>
                  <ListItem name="The road exists on borrowed time. Drive like it."
                    detail="The dramatic cliffs of Big Sur aren't a stable place to build a highly trafficked highway — collapses, mudslides, and fires are a recurring reality. The pullouts are engineered for momentary stops, not extended gatherings. Parking on the shoulder damages drainage infrastructure that keeps the road viable. When a section closes, it closes for everyone — including the 1,500 people who live here."
                    tags={["Road etiquette", "No shoulder parking", "Respect closures"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Bixby Bridge · Overtourism</div>
                  <ListItem name="The most photographed spot is also the most pressured."
                    detail="Bixby Creek Bridge has become a tourist magnet — traffic jams, illegal parking, visitors clambering down unstable cliffs for the shot. We route toward the interior trails and quieter coves instead. The encounter feels earned rather than extracted. Several of the most-photographed spots along this coast are on private land or actively eroding. Closed means closed."
                    tags={["Off the main road", "Interior trails", "Slow travel"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Pfeiffer Beach · Dispersed Camping</div>
                  <ListItem name="Illegal camping caused one of the costliest wildfires in US history."
                    detail="The Soberanes Fire of 2016 started from an illegal campfire. Big Sur's coastal scrub and redwood understory ignite fast in dry conditions. Dispersed camping outside designated sites is not just illegal here — it's genuinely dangerous for the ecosystem and for the permanent community that depends on Highway 1 remaining open. Book a site or a stay."
                    tags={["Designated camping only", "Fire risk", "Protect the corridor"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Resident Community · 1,500 People</div>
                  <ListItem name="Tourism is 90% of the economy. That doesn't mean it's welcome everywhere."
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
          <CollapsibleSection
            id="where-to-stay"
            label="Sleep"
            title="Where to sleep"
            teaser={`${accommodations.filter(a => !a.corridor && activeSleepTiers.has(a.stayStyle)).length} places`}
            isOpen={!collapsedSections['where-to-stay']}
            onToggle={() => toggleSection('where-to-stay')}
          >
            <FadeIn delay={0.05}>
              <TierFilter tiers={sleepFilterTiers} activeTiers={activeSleepTiers} onToggle={handleSleepToggle} />
            </FadeIn>

            <div>
              <ExpandableList initialCount={5} label="places to stay">
                {sortByTierDiversity(accommodations.filter(a => !a.corridor && activeSleepTiers.has(a.stayStyle))).map(a => (
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
          </CollapsibleSection>


          <Divider />

          {/* ================================================================ */}
          {/* MOVE                                                              */}
          {/* ================================================================ */}
          <CollapsibleSection
            id="move"
            label="Move"
            title="Coastal trails, sea kayaking & road cycling"
            teaser={`${moveItems.filter(item => activeMoveTiers.has(item.moveTier)).length} activities`}
            isOpen={!collapsedSections['move']}
            onToggle={() => toggleSection('move')}
          >
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
                    highlights={item.highlights}
                    difficulty={item.difficulty}
                    bookingWindow={item.bookingWindow}
                    priceRange={item.priceRange}
                    type={item.type}
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
          </CollapsibleSection>


          <Divider />

          {/* ================================================================ */}
          {/* BREATHE                                                           */}
          {/* ================================================================ */}
          <CollapsibleSection
            id="wellness"
            label="Breathe"
            title="Yoga, thermal waters & integration"
            teaser={`${breatheItems.filter(item => activeBreatheTiers.has(item.breatheTier)).length} options`}
            isOpen={!collapsedSections['wellness']}
            onToggle={() => toggleSection('wellness')}
          >
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
                    highlights={item.highlights}
                    bookingWindow={item.bookingWindow}
                    type={item.type}
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
          </CollapsibleSection>


          <Divider />

          {/* ================================================================ */}
          {/* LIGHT & SKY                                                       */}
          {/* ================================================================ */}

          <CollapsibleSection
            id="light-sky"
            label="Night Sky"
            title="Light & sky"
            teaser="Bortle 2 at Pfeiffer — best Jun–Oct"
            isOpen={!collapsedSections['light-sky']}
            onToggle={() => toggleSection('light-sky')}
          >
            <FadeIn delay={0.06}>
              <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.7] mb-6">
                Big Sur has some of the darkest skies on the California coast — Bortle 2 at Pfeiffer Beach on clear nights. The marine layer is the variable: it can roll in fast and erase the sky, or part dramatically to frame the Milky Way over the ocean.
              </p>
              <div className="mb-8">
                <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: C.seaGlass }}>Best Viewing Locations</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: `${C.darkInk}0A` }}>
                  {[
                    { name: "Pfeiffer Beach", note: "Bortle 2 on clear nights. The keyhole rock silhouetted against the Milky Way is the defining image." },
                    { name: "Kirk Creek Campground", note: "Clifftop sites with unobstructed ocean horizon. Fall asleep to the sound of surf under open sky." },
                    { name: "Pfeiffer Ridge / Tin House", note: "Higher elevation, above the marine layer. When the coast is socked in, the ridge is often clear." },
                    { name: "Andrew Molera State Park", note: "Beach access with minimal light pollution. The meadow near the river mouth opens a wide sky." },
                  ].map((area, i) => (
                    <div key={i} style={{ background: C.warmWhite }} className="p-4 md:p-5">
                      <div className="font-serif text-[15px] font-normal text-dark-ink leading-[1.3] mb-1">{area.name}</div>
                      <div className="font-body text-[12px] font-normal text-[#7A857E] leading-[1.5]">{area.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="mb-8">
                <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: C.seaGlass }}>Calendar Anchors</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: `${C.darkInk}0A` }}>
                  {[
                    { event: "Milky Way Core", timing: "Mar–Oct", detail: "Best after midnight in spring, earlier as summer progresses. Check marine layer forecasts." },
                    { event: "Perseid Meteor Shower", timing: "Mid-August", detail: "Peak viewing from Pfeiffer Beach or Kirk Creek. Warm nights, minimal fog in August." },
                    { event: "Bixby Bridge Astro", timing: "New Moon Nights", detail: "The bridge lit by starlight only. A pilgrimage shot for astrophotographers." },
                    { event: "Gray Whale + Stars", timing: "Dec–Apr", detail: "Whale spouts by moonlight from the bluffs. Point Lobos and Andrew Molera are the best vantage points." },
                  ].map((item, i) => (
                    <div key={i} style={{ background: C.warmWhite }} className="p-4 md:p-5">
                      <div className="font-serif text-[15px] font-normal text-dark-ink leading-[1.3] mb-0.5">{item.event}</div>
                      <div className="font-body text-[9px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: C.seaGlass }}>{item.timing}</div>
                      <div className="font-body text-[12px] font-normal text-[#7A857E] leading-[1.5]">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </CollapsibleSection>





          {/* ================================================================ */}
          {/* EAT                                                               */}
          {/* ================================================================ */}
          <CollapsibleSection
            id="eat"
            label="Eat"
            title="Where to eat"
            teaser={`${restaurants.length} places`}
            isOpen={!collapsedSections['eat']}
            onToggle={() => toggleSection('eat')}
          >
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
          </CollapsibleSection>

          <Divider />

          {/* ================================================================ */}
          {/* EXPERIENCE                                                        */}
          {/* ================================================================ */}
          <CollapsibleSection
            id="experience"
            label="Experience"
            title="Culture, heritage & discovery"
            teaser={`${experiences.length} experiences`}
            isOpen={!collapsedSections['experience']}
            onToggle={() => toggleSection('experience')}
          >
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={4} label="experiences">
                {experiences.sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(item => (
                  <ListItem
                    key={item.id}
                    name={item.name}
                    detail={item.highlights?.[0]}
                    note={item.admission === 'reservation-required' || item.admission === 'paid' ? item.admission : null}
                    tags={item.tags}
                    featured={item.lilaPick}
                    url={item.links?.website}
                    location={item.location}
                    onOpenSheet={openSheet('Experience')}
                  />
                ))}
              </ExpandableList>
            </FadeIn>
          </CollapsibleSection>



          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* GIVE BACK                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <CollapsibleSection
            id="give-back"
            label="Give Back"
            title="Leave it better than you found it."
            teaser="3 organizations"
            isOpen={!collapsedSections['give-back']}
            onToggle={() => toggleSection('give-back')}
          >
            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Conservation</div>
                  <ListItem name="Big Sur Land Trust"
                    url="https://bigsurlandtrust.org"
                    detail="Since 1978, BSLT has conserved over 45,000 acres of Monterey County coastline and interior lands. They partner with the Esselen Tribe to manage Basin Ranch using traditional ecological stewardship — one of the most direct models of Indigenous land partnership on the California coast."
                    tags={["Donate", "Volunteer"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous Giving</div>
                  <ListItem name="Esselen Tribe of Monterey County"
                    url="https://www.esselen.com"
                    detail="In 2020 the Esselen Tribe regained its first ancestral homelands since displacement by the Spanish four centuries ago. Big Sur Land Trust is their partner in land stewardship. Supporting BSLT directly supports this ongoing restoration of Indigenous land relationship."
                    tags={["Learn & Support"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Trail Stewardship</div>
                  <ListItem name="Los Padres ForestWatch"
                    url="https://lpfw.org"
                    detail="Watchdog organization protecting Los Padres National Forest — the interior backbone of Big Sur — from illegal off-road vehicle damage, overdevelopment, and fire mismanagement."
                    tags={["Donate", "Volunteer"]} />
                </div>
              </div>
            </FadeIn>
          </CollapsibleSection>


          <Divider />

          {/* ================================================================ */}
          {/* CTA                                                               */}
          {/* ================================================================ */}
          <section id="cta" className="scroll-mt-[126px] pt-14 pb-[72px] text-center">
            <FadeIn>
              <span className="font-body text-[12px] font-bold tracking-[0.28em] uppercase text-sea-glass block mb-4">Begin</span>
              <h3 className="font-serif text-[clamp(28px,5vw,42px)] font-light text-dark-ink mt-0 mb-2.5 leading-[1.2]">{"Your coastal trip starts here"}</h3>
              <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] max-w-[460px] mx-auto mb-9 leading-[1.65] mt-0">
                {"Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you."}
              </p>
              <Link to="/plan"
                className="py-3.5 px-9 border-none bg-dark-ink text-white text-center inline-block font-body text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-opacity duration-200 no-underline hover:opacity-85"
                onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'big-sur' })}
              >{"Plan a Trip"}</Link>
            </FadeIn>
          </section>

          {/* -- Also Explore ------------------------------------------------ */}
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
                  { name: "Vancouver Island", slug: "vancouver-island", accent: C.oceanTeal },
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
      <WhisperBar destination="bigSur" label="Big Sur" />
      <Footer />
    </>
  );
}
