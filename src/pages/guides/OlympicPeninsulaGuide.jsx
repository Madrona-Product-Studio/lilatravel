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
import { SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon } from '@components/guide';
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
// SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon imported from @components/guide
const ACCENT = C.skyBlue;

function NPSArrowhead({ size = 14, color = "#2D5F2B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 22h3l5-11 5 11h3L12 2z" fill={color} opacity="0.85" />
      <circle cx="12" cy="16" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}

function ListItem({ name, detail, note, tags, featured, url, onOpenSheet, location, hasNPS, cuisine, priceRange, reservations, dietary, energy }) {
  const nameEl = onOpenSheet ? (
    <span className="font-body text-[15px] font-semibold text-dark-ink">{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="font-body text-[15px] font-semibold text-dark-ink no-underline transition-[border-color,color] duration-200"
      style={{ borderBottom: `1px solid ${C.stone}` }}
      onMouseEnter={e => { e.target.style.borderColor = C.skyBlue; e.target.style.color = C.slate || "#3D5A6B"; }}
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
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sky-blue px-2.5 py-0.5"
              style={{ border: `1px solid ${C.skyBlue}40` }}>{"Lila Pick"}</span>
          )}
          {hasNPS && (
            <span className="inline-flex items-center gap-1 font-body text-[9px] font-bold tracking-[0.14em] uppercase text-[#2D5F2B] px-2 py-0.5"
              style={{ background: "#2D5F2B10" }}>
              <NPSArrowhead size={10} />NPS
            </span>
          )}
        </div>
        <div className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.65]">{detail}</div>
        {note && (
          <div className="font-body text-[12px] font-semibold text-sky-blue mt-1">{note}</div>
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
      onMouseEnter={e => e.target.style.borderColor = C.skyBlue}
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
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sky-blue px-2.5 py-0.5"
              style={{ border: `1px solid ${C.skyBlue}40` }}>{"Lila Pick"}</span>
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
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sky-blue mb-2.5 px-2.5 py-0.5"
          style={{ background: `${C.skyBlue}15` }}>{item.section}</span>
      )}

      <h3 className="font-serif text-[clamp(22px,4vw,28px)] font-normal text-dark-ink mb-2.5 leading-[1.2] mt-0">{item.name}</h3>

      {item.featured && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sky-blue mb-3.5 px-2.5 py-0.5"
          style={{ border: `1px solid ${C.skyBlue}40` }}>Lila Pick</span>
      )}

      {/* NPS ENRICHMENT */}
      {nps && (
        <>
          {npsPrimaryImage && (
            <div className="mx-[-20px] mb-[18px] relative">
              <img src={npsPrimaryImage.url} alt={npsPrimaryImage.altText || item.name} className="w-full h-[220px] object-cover block" />
              {(npsPrimaryImage.caption || npsPrimaryImage.credit) && (
                <div className="font-body text-[11px] font-normal text-[#7A857E] leading-[1.5] py-1.5 px-5">
                  {npsPrimaryImage.caption && <span>{npsPrimaryImage.caption}</span>}
                  {npsPrimaryImage.credit && (<span className="italic">{npsPrimaryImage.caption ? ' · ' : ''}Photo: {npsPrimaryImage.credit}</span>)}
                </div>
              )}
              {npsImages.length > 1 && (
                <div className="flex gap-[3px] px-5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {npsImages.slice(1, 5).map((img, i) => (<img key={i} src={img.url} alt={img.altText || ''} className="w-[60px] h-[42px] object-cover opacity-80" />))}
                </div>
              )}
            </div>
          )}
          <a href={nps.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 py-2.5 px-3.5 mb-[18px] no-underline transition-[background] duration-200" style={{ background: '#2D5F2B0D', border: '1px solid #2D5F2B18' }} onMouseEnter={e => e.currentTarget.style.background = '#2D5F2B18'} onMouseLeave={e => e.currentTarget.style.background = '#2D5F2B0D'}>
            <NPSArrowhead size={20} color="#2D5F2B" />
            <div>
              <div className="font-body text-[12px] font-medium text-[#2D5F2B] leading-[1.5]">Trail information provided by the <strong>National Park Service</strong></div>
              <div className="font-body text-[10px] font-semibold tracking-[0.12em] uppercase text-[#2D5F2B] opacity-60 mt-0.5">View on NPS.gov ↗</div>
            </div>
          </a>
          {(nps.longDescription || nps.shortDescription) && (
            <div className="mb-[18px]">
              <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#2D5F2B] mb-2">NPS Description</div>
              <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.75] m-0">{stripHTML(nps.longDescription || nps.shortDescription)}</p>
            </div>
          )}
          {npsInfoRows.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5 py-3.5 border-y border-stone">
              {npsInfoRows.map((row, i) => (
                <div key={i} className={row.label === 'Location' ? 'col-span-full' : ''}>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-[3px]">{row.label}</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{row.value}</div>
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
              return (<div className="mb-5"><div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A857E] mb-2">Accessibility</div><p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.6] m-0">{text}</p></div>);
            }
            const rows = liMatches.map(li => { const inner = li.replace(/<\/?li>/gi, ''); const boldMatch = inner.match(/<b>([\s\S]*?)<\/b>/); const lbl = boldMatch ? clean(boldMatch[1]).replace(/\s*\|\s*$/, '').trim() : ''; const valueHtml = boldMatch ? inner.slice(inner.indexOf('</b>') + 4) : inner; const valueParts = valueHtml.split(/<b>\s*\|?\s*<\/b>|<b>\s*\|\s*<\/b>/).map(clean).filter(Boolean); const finalParts = []; for (const part of valueParts) { part.split(/\s+\|\s+/).forEach(p => { if (p.trim()) finalParts.push(p.trim()); }); } return { label: lbl, values: finalParts }; });
            const footnoteMatch = html.match(/<p>([\s\S]*?)<\/p>/i);
            const footnote = footnoteMatch ? clean(footnoteMatch[1]) : null;
            return (<div className="mb-5"><div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A857E] mb-2.5">Trail Accessibility</div><div style={{ border: `1px solid ${C.stone}`, background: `${C.stone}18` }}>{rows.map((row, i) => (<div key={i} className="py-[9px] px-3.5" style={{ borderBottom: `1px solid ${C.stone}` }}>{row.label && (<div className="font-body text-[11px] font-bold text-dark-ink mb-[3px]">{row.label}</div>)}{row.values.map((val, j) => (<div key={j} className="font-body text-[12px] font-normal text-[#4A5650] leading-[1.6]">{val}</div>))}</div>))}{footnote && (<div className="font-body text-[11px] font-normal italic text-[#7A857E] leading-[1.5] py-2 px-3.5">{footnote}</div>)}</div></div>);
          })()}
          {(item.detail || item.note) && (
            <div className="py-3.5 px-4 mb-[18px]" style={{ background: `${C.goldenAmber}08`, borderLeft: `3px solid ${C.goldenAmber}40` }}>
              <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-golden-amber mb-2">Our Take</div>
              {item.detail && (<p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] mt-0 mb-1.5">{item.detail}</p>)}
              {item.note && (<div className="font-body text-[12px] font-semibold text-sky-blue">{item.note}</div>)}
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-5">
              {item.tags.map((t, i) => (<span key={i} className="font-body text-[12px] font-semibold text-[#7A857E] py-[3px] px-2.5" style={{ background: C.stone + '60' }}>{t}</span>))}
            </div>
          )}
        </>
      )}

      {!nps && (
        <>
          {item.detail && (<p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] mt-0 mb-3.5">{item.detail}</p>)}
          {item.note && (<div className="font-body text-[13px] font-semibold text-sky-blue mb-3.5">{item.note}</div>)}

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
                  <span key={i} className="font-body text-[12px] font-semibold text-sky-blue py-[3px] px-2.5" style={{ background: `${C.skyBlue}10` }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-5">
              {item.tags.map((t, i) => (<span key={i} className="font-body text-[12px] font-semibold text-[#7A857E] py-[3px] px-2.5" style={{ background: C.stone + '60' }}>{t}</span>))}
            </div>
          )}
        </>
      )}

      {item.url && !nps && (
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 py-2.5 px-5 font-body text-[12px] font-bold tracking-[0.16em] uppercase text-sky-blue no-underline transition-all duration-[250ms]"
          style={{ border: `1.5px solid ${C.skyBlue}` }}
          onMouseEnter={e => { e.currentTarget.style.background = C.skyBlue; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.skyBlue; }}
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
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-3.5 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer font-body text-[15px] text-[#7A857E] leading-none" style={{ background: `${C.warmWhite}e0`, border: '1px solid #7A857E15', WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 8px ${C.darkInk}08` }} aria-label="Close">✕</button>
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
                  borderBottom: `2px solid ${isActive ? C.skyBlue : "transparent"}`,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? C.skyBlue : "#7A857E",
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
        <div className="py-7 px-5 md:py-11 md:px-[52px] md:pb-10 max-w-[920px] mx-auto">
          <FadeIn from="bottom" delay={0.1}>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-7 md:gap-[52px] items-start">

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow text-sky-blue mb-3.5 block">Destination Guide</span>

                <h1 className="font-serif text-[clamp(38px,6vw,64px)] font-light text-dark-ink leading-none mb-[22px] tracking-[-0.02em] mt-0">
                  {"Olympic Peninsula"}
                </h1>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] mt-0 mb-3.5">
                  {"Olympic is three parks in one, stacked against each other in ecological improbability. Glacier-draped mountains, the wettest rainforests in the contiguous United States, and 73 miles of wilderness shoreline — each zone requires its own day, its own state of mind."}
                </p>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] m-0">
                  {"You cannot see Olympic in a loop. You have to choose. What you get in exchange is complete immersion — in rain, in silence, in a landscape that feels like the Pacific Northwest distilled to its essence."}
                </p>
              </div>

              {/* ── Right: This Guide Covers ── */}
              <div className="border-t md:border-t-0 md:border-l border-stone pt-7 md:pt-0 md:pl-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-[18px]">This guide covers</div>
                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-sky-blue mb-2.5">Ecosystem Zones</div>
                  {["Alpine (Hurricane Ridge)", "Rainforest (Hoh Valley)", "Coastal (La Push / Rialto)"].map((area, i) => (<div key={i} className="flex items-center gap-2.5 mb-[7px]"><div className="w-[5px] h-[5px] rounded-full bg-sky-blue opacity-50" /><span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{area}</span></div>))}
                </div>
                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-golden-amber mb-2.5">Gateway Towns</div>
                  {["Port Angeles", "Sequim", "Forks", "Port Townsend"].map((town, i) => (<div key={i} className="flex items-center gap-2.5 mb-[7px]"><div className="w-[5px] h-[5px] rounded-full bg-golden-amber opacity-50" /><span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{town}</span></div>))}
                </div>
                <div className="font-body text-[11px] font-medium tracking-[0.06em] text-[#7A857E] mt-3.5 pt-3 border-t border-stone">Updated 2026</div>
              </div>
            </div>
          </FadeIn>
        </div>
          </section>
      </div>

      <GuideNav isMobile={isMobile} />

      {/* IMAGE STRIP */}
      <section className="relative">
        <div className="flex gap-0.5 overflow-x-auto snap-x snap-mandatory" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {[
            { src: P.olympic,             alt: "Olympic Peninsula mountains",            caption: "Olympic Range from Hurricane Ridge",         width: 420 },
            { src: P.olympicHohRainforest, alt: "Hoh Rainforest mossy trail",             caption: "Hall of Mosses — the Hoh Rainforest",        width: 280 },
            { src: P.olympicLakeCrescent,  alt: "Lake Crescent with Adirondack chairs",   caption: "Lake Crescent — glacially carved turquoise",  width: 420 },
            { src: P.olympicLakeSunset,    alt: "Olympic lake at sunset",                 caption: "Sunset over the peninsula",                  width: 360 },
          ].map((img, i) => (
            <div key={i} className="flex-none snap-start relative overflow-hidden" style={{ width: isMobile ? "85vw" : img.width }}>
              <img src={img.src} alt={img.alt} className="w-full h-[320px] object-cover block" />
              <div className="absolute bottom-0 left-0 right-0 px-4 pt-8 pb-3.5" style={{ background: "linear-gradient(to top, rgba(10,18,26,0.7), transparent)" }}>
                <span className="font-body text-[11px] font-semibold tracking-[0.08em] text-white/80">{img.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ GUIDE CONTENT ═══════════════════════════════════════════════════ */}
      <section className="px-5 py-8 md:px-[52px] md:py-12 md:pb-20 bg-cream">
        <div className="max-w-[680px] mx-auto">


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SENSE OF PLACE                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="sense-of-place" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionLabel>Sense of Place</SectionLabel>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"Olympic is three parks in one, stacked against each other in ecological improbability. In the center: the Olympic Mountains, glacier-draped and largely roadless, presiding over the peninsula's wild interior. On the west slope: the Hoh, Quinault, and Queets Rainforests — the wettest place in the contiguous United States, where bigleaf maples grow so dense with mosses and ferns they look like they're breathing. On the coast: 73 miles of wilderness shoreline, sea stacks rising from the surf, tide pools full of life, driftwood the size of tree trunks."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"Each zone requires its own day, its own state of mind. You cannot see Olympic in a loop. You have to choose. What you get in exchange is complete immersion — in rain, in silence, in a landscape that feels like the Pacific Northwest distilled to its essence. This is a place that rewards unhurried attention."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                {"Nine Indigenous Nations have called this peninsula home since time immemorial: the Makah, Quileute, Hoh, Quinault, Jamestown S'Klallam, Port Gamble S'Klallam, Lower Elwha Klallam, Skokomish, and Squaxin Island tribes. The land and water here carry thousands of years of their relationship."}
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3 md:gap-4 p-4 md:p-5 bg-cream border border-stone mb-5">
                {[
                  { l: "Recommended", v: "4–7 days" },
                  { l: "Nearest Airport", v: "Seattle (SEA)" },
                  { l: "Drive from SEA", v: "~2.5 hours" },
                  { l: "Best Times", v: "Jun–Sep" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-[3px]">{s.l}</div>
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

            {/* Driving Note */}
            <FadeIn delay={0.14}>
              <div className="py-3.5 px-4 mt-4" style={{ background: `${C.skyBlue}06`, borderLeft: `3px solid ${C.skyBlue}40` }}>
                <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.65] m-0">
                  {"No shuttle system — personal vehicle required. Olympic is enormous and discontiguous: the park covers nearly a million acres across mountain, rainforest, and coastal ecosystems, and there is no single road through it. Plan driving time between zones — Hoh to Hurricane Ridge is 2.5 hours."}
                </p>
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* WHEN TO GO                                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="when-to-go" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="windows" />
              <SectionLabel>Magic Windows</SectionLabel>
              <SectionTitle>When to go</SectionTitle>
              <SectionSub>{"Olympic rewards every season differently. These are the moments when the peninsula is most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem onOpenSheet={openSheet('When to Go')} name="Summer — Alpine Access" featured
                  detail={"Peak window for Hurricane Ridge. High trails are snow-free. Busiest crowds. Rainforest trails accessible year-round; the coast is foggier. July and August are the driest months on the peninsula."}
                  tags={["Jul–Aug", "Alpine", "Peak Season"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Fall — Elk Rut & Golden Light" featured
                  detail={"Best overall. Crowds thin, light is extraordinary, elk rut in the Hoh Valley, weather still cooperative in the mountains. September and October offer the finest balance of access and solitude."}
                  tags={["Sep–Oct", "Wildlife", "Fewer Crowds"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Winter — Storm Season"
                  detail={"Rainforest at its most atmospheric — mosses saturated, rivers running high. Coast is dramatic in storm season. Hurricane Ridge becomes a snowshoe destination. Alpine trails buried."}
                  tags={["Dec–Feb", "Storms", "Rainforest"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Spring — Whales & Wildflowers"
                  detail={"Wildflowers on the ridge, migrating gray whales offshore, rivers running fast. Hurricane Ridge Road often closed until late spring — check ahead."}
                  tags={["Mar–May", "Migration", "Wildflowers"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Gray Whale Migration"
                  detail={"Gray whales migrate offshore March through May, visible from coastal bluffs at La Push and Kalaloch. One of the most reliable cetacean viewing windows on the Pacific coast."}
                  tags={["Mar–May", "Wildlife", "Coastal"]} />
              </div>
            </FadeIn>

            {/* Threshold Moments */}
            <FadeIn delay={0.12}>
              <div className="mt-7 p-5 border border-stone bg-warm-white">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-3.5">{"Threshold Moments"}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { event: "Gray Whale Migration", timing: "Mar–May", detail: "Offshore, visible from coastal bluffs" },
                    { event: "Elk Rut", timing: "Sep–Oct", detail: "Hoh Valley at dawn and dusk" },
                    { event: "Winter Storms", timing: "Nov–Feb", detail: "Dramatic surf at Rialto Beach and Kalaloch" },
                    { event: "Summer Solstice", timing: "June 20–21", detail: "Longest light window for the alpine zone" },
                    { event: "Alpine Wildflowers", timing: "Jul–Aug", detail: "Hurricane Ridge meadows in full bloom" },
                    { event: "Salmon Runs", timing: "Sep–Nov", detail: "Sol Duc and Hoh rivers — spawning season" },
                  ].map((cal, i) => (
                    <div key={i} className="p-3 px-3.5 border border-stone bg-cream">
                      <div className="font-body text-[14px] font-semibold text-dark-ink mb-[3px]">{cal.event}</div>
                      <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-sky-blue mb-1">{cal.timing}</div>
                      <div className="font-body text-[12px] font-normal text-[#7A857E]">{cal.detail}</div>
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
          <section id="tread-lightly" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Tread Lightly</SectionLabel>
              <SectionTitle>Traveling responsibly.</SectionTitle>
              <SectionSub>One of the last temperate wildernesses in the lower 48. Treat it that way.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Hall of Mosses · Trail Widening</div>
                  <ListItem name="The moss took decades to grow. It takes one footstep to damage it."
                    detail="The surge in visitors has widened and compacted trails like the Hall of Mosses — paths previously edged with lush moss are now bare, hard-packed dirt. Social trails to objects of interest make it worse. Moss can withstand light traffic but not the volume the Hoh now sees. Stay on wooden boardwalks and established paths. Resist the urge to step off for a photo."
                    tags={["Stay on trail", "No social trails", "Moss protection"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Hoh Rainforest · Peak Season</div>
                  <ListItem name="In August, 107,000 people came here. Plan accordingly."
                    detail="In August 2011, the Hoh Rainforest saw 38,000 visitors. By August 2021, that number had tripled to over 107,000. The single access road gridlocks by mid-morning. Arriving before 8am dramatically changes the experience and reduces pressure on the parking area. The Hoh River Trail beyond the first two miles sees a fraction of the crowd and rewards the extra distance."
                    note="◈ Arrive before 8am in summer — the parking lot fills completely by mid-morning"
                    tags={["Off-peak arrival", "Dawn entry", "Hoh River Trail"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Elwha River · Dam Removal Recovery</div>
                  <ListItem name="The largest dam removal in US history is still healing."
                    detail="The Elwha River restoration — removal of two dams completed in 2014 — is the most significant river recovery project in American history. Salmon are returning for the first time in over a century. The riparian corridor is still fragile. We orient itineraries around witnessing that recovery from the trail, not wading through active restoration zones or disturbing newly colonizing vegetation on the former reservoir beds."
                    tags={["River restoration", "Active recovery", "Witness don't disturb"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Hoh Tribe · Indigenous Territory</div>
                  <ListItem name="The Hoh River valley is the ancestral home of the Hoh people."
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
          <section id="where-to-stay" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="stay" />
              <SectionLabel>Sleep</SectionLabel>
              <SectionTitle>Where to sleep</SectionTitle>
              <SectionSub>{"How you inhabit a place matters. From ocean-bluff campgrounds to historic park lodges to Victorian B&Bs overlooking the Strait."}</SectionSub>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="py-3.5 px-4 bg-cream border border-stone mb-5 flex flex-col md:flex-row gap-2.5 md:gap-4 flex-wrap">
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
          {/* TRAILS                                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="trails" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="move" />
              <SectionLabel>Move</SectionLabel>
              <SectionTitle>{"Trails by ecosystem"}</SectionTitle>
              <SectionSub>{"Olympic's three distinct ecosystems each demand their own section. Choose your entry point based on the landscape that calls you."}</SectionSub>
            </FadeIn>

            {/* Alpine Zone */}
            <FadeIn delay={0.06}>
              <div className="mb-2">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-4">{"Alpine Zone — Hurricane Ridge"}</div>
                <ListItem onOpenSheet={openSheet('Trails')} name="Hurricane Hill Trail" featured hasNPS={checkNPS("Hurricane Hill Trail")}
                  detail={"The finest panoramic summit accessible by trail in the park. A paved path climbs past wildflower meadows and marmot habitat to a 5,757-foot summit with 360-degree views: the Olympic Range, the Strait of Juan de Fuca, and on clear days, Vancouver Island."}
                  note="3.2 mi RT · 800 ft gain · Easy-Moderate · 2 hrs"
                  tags={["Alpine Views", "Wildflowers", "Jul–Oct"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="High Divide Trail & Seven Lakes Basin Loop" hasNPS={checkNPS("High Divide Trail")}
                  detail={"The defining backcountry traverse in the Olympics. The loop climbs from the Sol Duc valley to a ridge with unobstructed views of Mount Olympus's glaciers, descends through subalpine lakes, and returns through old-growth forest. Plan two to three days."}
                  note="18–19 mi loop · ~3,500 ft gain · Strenuous · 2–3 days"
                  tags={["Backpacking", "Glaciers", "Alpine Lakes", "Jul–Sep"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Mount Storm King" hasNPS={checkNPS("Mount Storm King")}
                  detail={"The steepest and most dramatic day hike in the park. The summit involves exposed scrambling and a rope-assisted section near the top. The reward: jaw-dropping views of Lake Crescent's turquoise water far below."}
                  note="4.4 mi RT · 2,100 ft gain · Strenuous · 3–4 hrs"
                  tags={["Scrambling", "Lake Crescent Views", "May–Oct"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Marymere Falls Trail" hasNPS={checkNPS("Marymere Falls Trail")}
                  detail={"Through old-growth conifers to a 90-foot waterfall tucked into a sandstone gorge. Short enough for any level, beautiful enough to anchor a morning."}
                  note="1.8 mi RT · Easy · 1 hr"
                  tags={["Waterfall", "Old-Growth", "Year-Round"]} />
              </div>
            </FadeIn>

            {/* Rainforest Zone */}
            <FadeIn delay={0.1}>
              <div className="mt-7 mb-2">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-4">{"Rainforest Zone — Hoh Valley"}</div>
                <ListItem onOpenSheet={openSheet('Trails')} name="Hall of Mosses Trail" featured hasNPS={checkNPS("Hall of Mosses Trail")}
                  detail={"The rainforest's most iconic walk. Bigleaf maples draped in club moss form a cathedral canopy — one of the most otherworldly short walks in North America. The Hoh receives up to 140 inches of rain a year, and it shows: every surface is alive with fern, lichen, and moss."}
                  note="0.8 mi loop · Easy · 30–45 min"
                  tags={["Iconic", "Photography", "Year-Round"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Hoh River Trail" hasNPS={checkNPS("Hoh River Trail")}
                  detail={"Runs 17 miles up-valley toward Mount Olympus. Day hikers can go as far as they want. The concept of 'One Square Inch of Silence' was developed here — one of the quietest places in the hemisphere. The deeper you go, the more the forest closes around you."}
                  note="Varies (2–17 mi one way) · Easy-Moderate"
                  tags={["Silence", "Forest Bathing", "Backpacking"]} />
              </div>
            </FadeIn>

            {/* Coastal Zone */}
            <FadeIn delay={0.14}>
              <div className="mt-7 mb-2">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-4">{"Coastal Zone — La Push & Rialto"}</div>
                <ListItem onOpenSheet={openSheet('Trails')} name="Second Beach (La Push)" featured hasNPS={checkNPS("Second Beach")}
                  detail={"The defining Olympic coast experience. A 0.7-mile trail through forest opens suddenly onto a wild beach of black sand and sea stacks — spires of rock rising from the surf, dense with seabirds. Sunsets here are extraordinary. On the traditional territory of the Quileute Nation."}
                  note="1.4 mi RT · Easy · 45 min"
                  tags={["Sea Stacks", "Sunset", "Year-Round"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Hole-in-the-Wall (Rialto Beach)" hasNPS={checkNPS("Hole-in-the-Wall")}
                  detail={"A natural sea arch carved by the surf, accessible by a 1.5-mile walk north along Rialto Beach. Tide pools, sea stacks, bald eagles, and the sound of the Pacific. Check tides — the final section requires low tide passage."}
                  note="3 mi RT · Easy (tide-dependent) · 1.5–2 hrs"
                  tags={["Sea Arch", "Tide Pools", "Check Tides"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Ozette Triangle (Cape Alava / Sand Point Loop)" hasNPS={checkNPS("Ozette Triangle")}
                  detail={"A 9-mile loop combining a beach segment with ancient cedar boardwalk trails. Cape Alava is the westernmost point in the contiguous United States. The beach passes Wedding Rocks — petroglyphs carved by the Makah people, some of the most significant ancient rock art on the peninsula."}
                  note="9 mi loop · Moderate · 4–5 hrs"
                  tags={["Petroglyphs", "Westernmost Point", "Indigenous Heritage"]} />
              </div>
            </FadeIn>

            {/* Sol Duc */}
            <FadeIn delay={0.18}>
              <div className="mt-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-4">{"Sol Duc & Scenic Drives"}</div>
                <ListItem onOpenSheet={openSheet('Trails')} name="Sol Duc Falls" hasNPS={checkNPS("Sol Duc Falls")}
                  detail={"A short walk through old-growth forest to a powerful three-pronged waterfall dropping into a basalt gorge. Photogenic in any weather, close to the Sol Duc Hot Springs. Combine the two for one of the best half-days in the park."}
                  note="1.6 mi RT · Easy · 45 min"
                  tags={["Waterfall", "Old-Growth", "Year-Round"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Hurricane Ridge Road"
                  detail={"17 miles of switchbacks from Port Angeles to the ridge. The road climbs through old growth, breaks into meadow, and delivers you to a view that stops conversation. Drive it at sunset if you can."}
                  tags={["17 Miles", "Switchbacks", "Sunset Drive"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="US-101 Coastal Loop"
                  detail={"The highway circles the Olympic Peninsula and offers access to all ecosystems. The stretch between Forks and Kalaloch runs close enough to the coast that you can pull off and walk to the beach repeatedly."}
                  tags={["Full Day", "All Ecosystems", "Beach Pull-Offs"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Lake Crescent"
                  detail={"The lake sits in a glacially carved valley 20 miles west of Port Angeles. Turquoise water (low in nutrients, exceptionally clear), old-growth forest framing both shores. The East Beach picnic area, the Storm King trailhead, and Lake Crescent Lodge are all accessible without crowds if you arrive before 10 AM."}
                  tags={["Turquoise Water", "Old-Growth", "Arrive Early"]} />
              </div>
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
              <SectionTitle>{"Soaking, silence & contemplation"}</SectionTitle>
              <SectionSub>{"The peninsula's pace makes practice feel less like effort and more like returning to something you already knew."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="wellness experiences">
                <ListItem onOpenSheet={openSheet('Wellness')} name="Sol Duc Hot Springs Resort" featured
                  url="https://www.olympicnationalparks.com/lodging/sol-duc-hot-springs-resort/"
                  detail={"Geothermal hot springs deep in the Sol Duc valley, surrounded by old-growth forest. Three soaking pools (98°F to 104°F), a freshwater swimming pool, and access to the Sol Duc River below. The resort has operated here since 1912. Day use from Memorial Day through early October — arrive early, it fills quickly."}
                  note="Day use: Memorial Day–early Oct · Arrive early"
                  tags={["Hot Springs", "Old-Growth", "Day Use"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Olympic Hot Springs (dispersed)"
                  detail={"A remote soaking experience reached by a 2.5-mile hike or 10-mile bike ride (road closed to vehicles). Small primitive pools along Boulder Creek, fed by geothermal springs. No facilities — pack in and pack out. Check conditions at the Elwha Ranger Station."}
                  note="2.5 mi hike · Free · Year-round"
                  tags={["Primitive", "Hike-In", "Free", "Wilderness"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Hoh Rainforest — One Square Inch of Silence" featured
                  detail={"Acoustic ecologist Gordon Hempton designated a specific point on the Hoh River Trail as one of the quietest places in the Western Hemisphere. Walking the Hoh with no agenda — no earbuds, no podcast, just the sound of the river and the rain on bigleaf maple — is one of the most genuinely meditative experiences in any national park."}
                  tags={["Silence", "Forest Bathing", "Meditative"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Hurricane Ridge — Dawn Alpine Meditation"
                  detail={"Arrive at Hurricane Ridge before the visitor center opens (typically 9 AM). The parking lot faces the entire Olympic Range. At dawn, light rolls across the glaciers and meadows in waves. No interpretation needed — just a thermos and a place to sit."}
                  tags={["Sunrise", "Alpine", "Contemplative"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Port Angeles & Sequim — Local Studios"
                  detail={"Port Angeles has a small but active wellness community. Studios rotate; search 'yoga Port Angeles' for current offerings. Sequim has additional options, particularly for Pilates and somatic work."}
                  tags={["Yoga", "Drop-In", "Local Community"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Kalaloch Lodge — Coastal Stillness"
                  detail={"No formal wellness programming, but the location — above a sweep of wild beach with sea stacks visible from the windows — invites a particular quality of stillness. Recommended for anyone who wants the coast without camping."}
                  tags={["Wild Coast", "Contemplative", "No Camping Needed"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* NIGHT SKY                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="light-sky" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Night Sky</SectionLabel>
              <SectionTitle>After dark on the peninsula.</SectionTitle>
              <SectionSub>Hurricane Ridge and the coast offer some of the darkest skies in the Pacific Northwest.</SectionSub>
            </FadeIn>

            {/* Dark Sky Note */}
            <FadeIn delay={0.1}>
              <div className="py-5 px-6 bg-dark-ink my-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-2.5">Dark Sky Note</div>
                <p className="font-body text-[14px] font-normal text-white/70 leading-[1.7] m-0">
                  {"No IDA dark sky certification. Consistent cloud cover limits sky access on the west side of the peninsula. The clearest conditions are found on the rain shadow side — Sequim and Dungeness — particularly in summer. When the clouds do break, the lack of development means genuine darkness is available from any park campground."}
                </p>
              </div>
            </FadeIn>
          </section>

          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* FOOD & CULTURE                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="food-culture" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Food & Culture</SectionLabel>
              <SectionTitle>{"Food & Culture"}</SectionTitle>
              <SectionSub>{"From Indigenous heritage to lavender farms to the peninsula's best kitchens. The connections here go deeper than a meal."}</SectionSub>
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
                    onOpenSheet={openSheet('Food')}
                  />
                ))}
              </ExpandableList>
            </FadeIn>

            {/* Farm & Landscape */}
            <FadeIn delay={0.18}>
              <div className="mt-7 mb-2">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-4">{"Farm & Landscape"}</div>
                <ListItem onOpenSheet={openSheet('Discover')} name="Sequim Lavender Trail" featured
                  url="https://sequimlavender.org"
                  detail={"A cluster of family-owned lavender farms in the Sequim-Dungeness Valley — sheltered by the Olympic rain shadow, averaging just 17 inches of rain per year. Nine working farms, u-pick fields, essential oil distillation, lavender ice cream. Jardin du Soleil and Purple Haze are the two anchors."}
                  note="Peak bloom mid-July · Annual festival third weekend of July"
                  tags={["Lavender", "U-Pick", "Rain Shadow", "Jun–Sep"]} />
                <ListItem onOpenSheet={openSheet('Discover')} name="Dungeness Spit — National Wildlife Refuge"
                  detail={"The longest natural sand spit in the United States — nearly seven miles extending into the Strait of Juan de Fuca. Over 250 bird species recorded. At the tip sits the New Dungeness Lighthouse, operating since 1857 — free tours daily."}
                  note="Up to 10 mi RT · $3/family · Open daily"
                  tags={["Birdwatching", "Lighthouse", "Coastal Walk"]} />
              </div>
            </FadeIn>

            {/* Indigenous Heritage & Discover */}
            <FadeIn delay={0.22}>
              <div className="mt-7 mb-2">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-4">{"Indigenous Heritage & Discovery"}</div>
                <ListItem onOpenSheet={openSheet('Culture')} name="Makah Museum & Cape Flattery" featured
                  url="https://makahmuseum.com"
                  detail={"The Makah Museum in Neah Bay houses artifacts from the excavation of Ozette — a village buried by a mudslide 500 years ago, remarkably preserved. One of the most significant archaeological finds in North America. Cape Flattery is the northwesternmost point in the contiguous US — a 1.5-mile Makah-managed trail to dramatic sea arch overlooks. $10/vehicle recreation permit."}
                  note="Plan a dedicated half-day"
                  tags={["Museum", "Cape Flattery", "Ozette", "Makah Nation"]} />
                <ListItem onOpenSheet={openSheet('Culture')} name="Elwha River Restoration" featured
                  url="https://www.elwha.org"
                  detail={"The largest dam removal project in U.S. history, led by the Lower Elwha Klallam Tribe. Sacred sites submerged for a century were re-exposed. An archaeological site revealing 8,000 years of continuous habitation was uncovered. Drive the Elwha River road and walk to the former dam sites."}
                  tags={["Dam Removal", "Restoration", "Lower Elwha Klallam"]} />
                <ListItem onOpenSheet={openSheet('Culture')} name="Jamestown S'Klallam Tribe"
                  detail={"'The Strong People' — operate the 7 Cedars Resort near Sequim and are known for hand-carved totem poles on their campus. The Jamestown Tribal Library offers cultural programming. The tribe welcomes visitors year-round."}
                  note="Sequim area"
                  tags={["Totem Poles", "Cultural Center", "Year-Round"]} />
                <ListItem onOpenSheet={openSheet('Culture')} name="Port Townsend — Victorian Seaport"
                  detail={"One of the most architecturally intact Victorian seaports in the Pacific Northwest. Galleries, independent bookstores, live music via the Centrum Foundation. The Olympic Music Festival performs Saturdays in summer — world-class chamber music in a barn."}
                  tags={["Arts", "Victorian", "Music Festival"]} />
                <ListItem onOpenSheet={openSheet('Culture')} name="Feiro Marine Life Center"
                  url="https://www.feiromarinecenter.org/"
                  detail={"A small, excellent marine science center in Port Angeles focused on species from the Strait of Juan de Fuca and Puget Sound. Touch tanks, knowledgeable volunteers, good complement to coast tide pool experiences."}
                  note="Port Angeles"
                  tags={["Marine Science", "Touch Tanks", "Families"]} />
              </div>
            </FadeIn>

            {/* Regional Corridor */}
            <FadeIn delay={0.26}>
              <div className="mt-7 mb-2">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-4">{"Regional Corridor"}</div>
                <ListItem onOpenSheet={openSheet('Corridor')} name="Cape Flattery & Makah Reservation" featured
                  url="https://makah.com"
                  detail={"The northwesternmost point in the contiguous United States — accessible by a 1.5-mile Makah-managed trail through old-growth cedar and hemlock to overlooks above a dramatic sea arch and open Pacific. A $10/vehicle recreation permit is required. Pair with the Makah Museum for one of the most complete Indigenous-land experiences in the Pacific Northwest."}
                  note="1.5 mi RT · Easy-Moderate · 1 hr · $10/vehicle"
                  tags={["Makah Nation", "Cape Flattery", "Northwesternmost Point"]} />
                <ListItem onOpenSheet={openSheet('Corridor')} name="Port Townsend — Victorian Seaport"
                  detail={"Victorian seaport at the tip of the Quimper Peninsula. Historic architecture, art galleries, serious coffee, and a slower pace than Seattle. The Olympic Music Festival performs Saturdays in summer in a barn — world-class chamber music in a pastoral setting. A strong argument for arriving a day early or leaving a day late."}
                  tags={["Arts", "Architecture", "Music Festival", "Day Trip"]} />
              </div>
            </FadeIn>

            {/* Logistics */}
            <FadeIn delay={0.28}>
              <div className="mt-7 mb-2 p-5 border border-stone bg-warm-white">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-sky-blue mb-3.5">{"Logistics & Practical Notes"}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-1">Getting There</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.65] m-0">
                      {"From Seattle: Bainbridge Island ferry (35 min) + 2-hour drive to Port Angeles — scenic and avoids traffic. Or drive around the south end of Puget Sound (~3 hrs). Rent a car; there is no other practical way to access multiple park zones."}
                    </p>
                  </div>
                  <div>
                    <div className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-1">Best Base Camps</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.65] m-0">
                      {"Alpine/Hurricane Ridge: Port Angeles. Rainforest/Hoh: Forks or camp in-park. Coast: La Push or Kalaloch Lodge. Sol Duc: Sol Duc Campground or day trip from Port Angeles."}
                    </p>
                  </div>
                  <div>
                    <div className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-1">Tide Awareness</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.65] m-0">
                      {"Critical for coastal hikes. Several trails (Hole-in-the-Wall, Ozette, coastal wilderness route) require low tide passage. Download a tide chart app (Tides Near Me or NOAA) before heading to the coast."}
                    </p>
                  </div>
                  <div>
                    <div className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-1">Rain & Gear</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.65] m-0">
                      {"The west-facing rainforest zone receives 140+ inches per year. Waterproof everything — pack layers, bring a dry bag, accept the rain as part of the experience. The east side (Port Angeles, Hurricane Ridge) is significantly drier."}
                    </p>
                  </div>
                  <div>
                    <div className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-1">Hurricane Ridge Road</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.65] m-0">
                      {"Open year-round on Saturdays and Sundays (weather permitting); generally open daily July–October. Check the park website before driving — road closures are common."}
                    </p>
                  </div>
                  <div>
                    <div className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-1">Wildlife Safety</div>
                    <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.65] m-0">
                      {"Black bear, Roosevelt elk, mountain goat, river otter, harbor seal. Keep 100 yards from elk and bear. Elk are bold and can be dangerous during rut (September–October)."}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3.5 border-t border-stone">
                  <div className="font-body text-[11px] font-bold tracking-[0.18em] uppercase text-[#7A857E] mb-2">Essential Links</div>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { label: "NPS Park Info", url: "https://www.nps.gov/olym" },
                      { label: "Hurricane Ridge Status", url: "https://www.nps.gov/olym/planyourvisit/hurricane-ridge.htm" },
                      { label: "Tide Charts", url: "https://tidesandcurrents.noaa.gov" },
                      { label: "WTA Trail Reports", url: "https://www.wta.org" },
                    ].map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="font-body text-[12px] font-semibold text-sky-blue no-underline transition-[border-color] duration-200"
                        style={{ borderBottom: `1px solid ${C.skyBlue}40` }}
                        onMouseEnter={e => e.target.style.borderColor = C.skyBlue}
                        onMouseLeave={e => e.target.style.borderColor = `${C.skyBlue}40`}
                      >{link.label} <span className="text-[10px]">↗</span></a>
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
          <section id="give-back" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="threshold" />
              <SectionLabel>Give Back</SectionLabel>
              <SectionTitle>Leave it better than you found it.</SectionTitle>
              <SectionSub>The Elwha is still recovering. The tribes never stopped tending it.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous Giving</div>
                  <ListItem name="Lower Elwha Klallam Tribe"
                    url="https://www.elwha.org"
                    detail="The driving force behind the Elwha dam removal and river restoration. Tribe staff and volunteers have planted nearly 800 acres of dewatered lands with 425,000 native plants to date. The tribe accepts volunteers for restoration planting days — the most directly meaningful way to give back on the Peninsula."
                    tags={["Volunteer", "Support"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Conservation</div>
                  <ListItem name="North Olympic Land Trust"
                    url="https://northolympiclandtrust.org"
                    detail="Conserves land across Clallam County in the traditional homeland of the Hoh, Makah, Quileute, Jamestown S'Klallam, and Lower Elwha Klallam tribes. Volunteer for site stewardship, salmon habitat monitoring, and restoration work parties."
                    tags={["Donate", "Volunteer"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Trail Stewardship</div>
                  <ListItem name="Olympic Park Associates"
                    url="https://www.olympicparkassociates.org"
                    detail="The oldest friends group for Olympic National Park, funding research, conservation, and education programs inside the park boundary since 1948."
                    tags={["Donate", "Become a Member"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Trail Stewardship</div>
                  <ListItem name="Washington Trails Association (WTA)"
                    url="https://www.wta.org"
                    detail="Organizes trail maintenance work parties across the Olympic Peninsula. Day and weekend events — brushing, drainage work, blowdown clearing. Family-friendly and well-organized."
                    tags={["Trail Maintenance", "Family-Friendly", "Weekend Events"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Conservation</div>
                  <ListItem name="Friends of the Hoh"
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
          <section id="cta" className="scroll-mt-[126px] pt-14 pb-[72px] text-center">
            <FadeIn>
              <span className="font-body text-[12px] font-bold tracking-[0.28em] uppercase text-sky-blue block mb-4">Begin</span>
              <h3 className="font-serif text-[clamp(28px,5vw,42px)] font-light text-dark-ink mt-0 mb-2.5 leading-[1.2]">{"Your peninsula trip starts here"}</h3>
              <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] max-w-[460px] mx-auto mb-9 leading-[1.65]">
                {"Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you."}
              </p>
              <Link to="/plan"
                className="inline-block py-3.5 px-9 bg-dark-ink text-white text-center font-body text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer no-underline transition-opacity duration-200 hover:opacity-85"
                onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'olympic-peninsula' })}
              >{"Plan a Trip"}</Link>
            </FadeIn>
          </section>

          {/* Also Explore */}
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
                  { name: "Big Sur", slug: "big-sur", accent: C.seaGlass },
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

      <GuideDetailSheet item={activeSheet} onClose={() => setActiveSheet(null)} isMobile={isMobile} />
      <WhisperBar destination="olympic" label="Olympic Peninsula" />
      <Footer />
    </>
  );
}
