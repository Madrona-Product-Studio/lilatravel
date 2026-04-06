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
import { SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon, TierItem, TierLegend, TierFilter } from '@components/guide';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { getNPSData, buildNPSLookup, findNPSMatch } from '@services/npsService';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/olympic-peninsula.json';
import restaurants from '../../data/restaurants/olympic-peninsula-eat.json';
import experiences from '../../data/restaurants/olympic-peninsula-experience.json';
import breatheItems from '../../data/restaurants/olympic-peninsula-breathe.json';
import moveItems from '../../data/restaurants/olympic-peninsula-move.json';
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

function CollapsibleSection({ id, label, title, teaser, isOpen, onToggle, children }) {
  const bodyRef = useRef(null);
  return (
    <section id={id} className="scroll-mt-[126px]">
      <button onClick={onToggle} className="w-full flex items-center gap-4 py-6 bg-transparent border-none cursor-pointer text-left group">
        <div className="flex-1 min-w-0">
          <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-1">{label}</div>
          <div className="font-serif text-[clamp(20px,3vw,26px)] font-light text-dark-ink leading-[1.2]">{title}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-body text-[12px] text-[#7A857E] whitespace-nowrap">{teaser}</span>
          <span className="inline-block text-[12px] text-[#7A857E] transition-transform duration-300 ease-in-out" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </div>
      </button>
      <div className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ maxHeight: isOpen ? 5000 : 0 }}>
        <div ref={bodyRef} className="pb-6">{children}</div>
      </div>
    </section>
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

          {item.detail && (<p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] mt-0 mb-3.5">{item.detail}</p>)}
          {item.note && (<div className="font-body text-[13px] font-semibold text-sky-blue mb-3.5">{item.note}</div>)}

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
          {park.infoUrl.includes('nps.gov') ? `nps.gov/${park.infoUrl.split('nps.gov/')[1].replace(/\/$/, '')}` : park.infoUrl.includes('fs.usda.gov') ? 'US Forest Service' : 'Park Info'} ↗
        </a>
      )}
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
const sleepFilterTiers = [
  { key: 'elemental', label: 'Elemental', desc: 'In the landscape', color: '#7BB8A0' },
  { key: 'rooted',    label: 'Rooted',    desc: 'Boutique, local',  color: '#4A9B9F' },
  { key: 'premium',   label: 'Premium',   desc: 'World-class',      color: '#D4A853' },
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
    const el = document.getElementById(id);
    if (!el) return;
    const mainNavHeight = isMobile ? 58 : 64;
    const guideNavHeight = isMobile ? 0 : 52;
    const y = el.getBoundingClientRect().top + window.scrollY - guideNavHeight - mainNavHeight - 32;
    window.scrollTo({ top: y, behavior: "smooth" });
    if (onOpenSection) onOpenSection(id);
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
    'where-to-stay': true, 'move': true, 'wellness': true, 'light-sky': true, 'eat': true, 'experience': true, 'give-back': true,
  });
  const toggleSection = useCallback((id) => { setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] })); }, []);
  const openSection = useCallback((id) => { setCollapsedSections(prev => prev[id] ? { ...prev, [id]: false } : prev); }, []);

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

      <GuideNav isMobile={isMobile} onOpenSection={openSection} />

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
          <section id="sense-of-place" className="scroll-mt-[126px] pt-11 pb-4">
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
              <div>
                <div className="h-px" style={{ background: `${C.darkInk}14` }} />
                <div className="grid grid-cols-2 md:grid-cols-4 py-5">
                  {[
                    { l: "Recommended", v: "4–7 days" },
                    { l: "Nearest Airport", v: "Seattle (SEA)" },
                    { l: "Drive from SEA", v: "~2.5 hours" },
                    { l: "Best Times", v: "Jun–Sep" },
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


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* THE LAND                                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="the-land" className="scroll-mt-[126px] pb-11">
            {/* ── The Parks ── */}
            <FadeIn>
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: C.skyBlue }}>The Parks</p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div className="grid grid-cols-1 gap-px mb-1" style={{ background: `${C.darkInk}0A` }}>
                {PARKS.map((park) => (
                  <ParkCard key={park.id} park={park} />
                ))}
              </div>
            </FadeIn>

            {/* Driving Note */}
            <FadeIn delay={0.09}>
              <div className="py-3.5 px-4 mt-4" style={{ background: `${C.skyBlue}06`, borderLeft: `3px solid ${C.skyBlue}40` }}>
                <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.65] m-0">
                  {"No shuttle system — personal vehicle required. Olympic is enormous and discontiguous: the park covers nearly a million acres across mountain, rainforest, and coastal ecosystems, and there is no single road through it. Plan driving time between zones — Hoh to Hurricane Ridge is 2.5 hours."}
                </p>
              </div>
            </FadeIn>

            {/* ── The Towns ── */}
            <FadeIn delay={0.1}>
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mt-10 mb-3.5" style={{ color: C.goldenAmber }}>The Towns</p>
              <div className="grid grid-cols-1 gap-px" style={{ background: `${C.darkInk}0A` }}>
                {[
                  { name: "Port Angeles", context: "Park Headquarters", description: "The main gateway to Olympic. Hurricane Ridge is a 45-minute drive from downtown. Solid food scene for a town this size — Kokopelli Grill and Next Door Gastropub are reliable.", accent: C.skyBlue },
                  { name: "Sequim", context: "Rain Shadow Town", description: "In the rain shadow of the Olympics — gets 16 inches of rain while the Hoh gets 170. Lavender farms, the Olympic Discovery Trail, and the driest skies on the peninsula.", accent: C.goldenAmber },
                  { name: "Forks", context: "Rainforest Gateway", description: "Timber town turned trailhead. The closest services to the Hoh Rainforest and Rialto Beach. Small, practical, and surrounded by some of the most productive temperate rainforest on Earth.", accent: C.seaGlass },
                  { name: "Port Townsend", context: "Victorian Seaport", description: "A 19th-century seaport town with more Victorian buildings per capita than anywhere in the US. Fort Worden, the marine science center, and a strong arts community. The civilized end of the peninsula.", accent: C.oceanTeal },
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
            <FadeIn delay={0.12}>
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: C.goldenAmber }}>Places That Stop You</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: `${C.darkInk}0A` }}>
                {[
                  { name: "Hoh Rain Forest", category: "Rainforest · Silence", blurb: "The quietest place in the contiguous US — measured. Bigleaf maples draped in moss, nurse logs sprouting new trees. The Hall of Mosses trail is less than a mile and changes your sense of time." },
                  { name: "Hurricane Ridge", category: "Alpine · Panorama", blurb: "A 45-minute drive from sea level to 5,200 feet. The Olympic Mountains spread in every direction, glaciers visible on clear days. Wildflower meadows in July and August." },
                  { name: "Rialto Beach", category: "Coast · Sea Stacks", blurb: "Walk north past the Hole-in-the-Wall arch at low tide. Sea stacks, tide pools, and driftwood the size of telephone poles. The Pacific at its most dramatic." },
                  { name: "Sol Duc Falls", category: "Waterfall · Forest", blurb: "A short hike through old-growth forest to a three-pronged waterfall dropping into a narrow gorge. The hot springs resort nearby makes for a complete loop." },
                  { name: "Lake Crescent", category: "Lake · Glacial", blurb: "A glacier-carved lake so clear the bottom is visible at 60 feet. Marymere Falls is a one-mile walk from the lodge. The drive along the south shore is one of the peninsula's best." },
                  { name: "Shi Shi Beach", category: "Coast · Remote", blurb: "A 2-mile trail through forest opens onto a beach with the largest collection of sea stacks on the Olympic coast. Permit required. Point of the Arches at sunset is worth the hike alone." },
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
          <CollapsibleSection id="where-to-stay" label="Sleep" title="Where to sleep" teaser={`${accommodations.filter(a => !a.corridor && activeSleepTiers.has(a.stayStyle)).length} places`} isOpen={!collapsedSections['where-to-stay']} onToggle={() => toggleSection('where-to-stay')}>
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

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* MOVE                                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <CollapsibleSection id="move" label="Move" title="How to get into the landscape" teaser={`${moveItems.filter(item => activeMoveTiers.has(item.moveTier)).length} activities`} isOpen={!collapsedSections['move']} onToggle={() => toggleSection('move')}>
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
                    hasNPS={item.type === 'hike' && checkNPS(item.name)}
                  />
                ))}
              </ExpandableList>
            </FadeIn>
          </CollapsibleSection>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* BREATHE                                                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <CollapsibleSection id="wellness" label="Breathe" title={"Hot springs, radical silence & the Iyengar tradition"} teaser={`${breatheItems.filter(item => activeBreatheTiers.has(item.breatheTier)).length} options`} isOpen={!collapsedSections['wellness']} onToggle={() => toggleSection('wellness')}>
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

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* NIGHT SKY                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <CollapsibleSection id="light-sky" label="Night Sky" title="After dark on the peninsula." teaser="Hurricane Ridge — best Jun–Sep" isOpen={!collapsedSections['light-sky']} onToggle={() => toggleSection('light-sky')}>
            <FadeIn delay={0.06}>
              <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.7] mb-6">
                Olympic isn't IDA-certified, but genuine darkness is available from any park campground away from Port Angeles. The rain shadow side — Sequim and Dungeness — offers the clearest skies, especially in summer when the west side is still clouded over.
              </p>
              <div className="mb-8">
                <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: C.skyBlue }}>Best Viewing Areas</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: `${C.darkInk}0A` }}>
                  {[
                    { name: "Hurricane Ridge", note: "Above the clouds at 5,200 ft. When the lowlands are overcast, the ridge is often clear. Summer nights only — road closes in winter." },
                    { name: "Dungeness Spit area", note: "In the rain shadow — 16 inches of rain versus 170 on the west side. The clearest and driest skies on the peninsula." },
                    { name: "Kalaloch Beach", note: "Remote coastal darkness. The sound of surf under stars. Accessible year-round from the campground." },
                    { name: "Deer Park Campground", note: "The highest drive-to point in the park at 5,400 ft. No water, no services, extraordinary sky." },
                  ].map((area, i) => (
                    <div key={i} style={{ background: C.warmWhite }} className="p-4 md:p-5">
                      <div className="font-serif text-[15px] font-normal text-dark-ink leading-[1.3] mb-1">{area.name}</div>
                      <div className="font-body text-[12px] font-normal text-[#7A857E] leading-[1.5]">{area.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </CollapsibleSection>

          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* EAT                                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <CollapsibleSection id="eat" label="Eat" title="Where to eat" teaser={`${restaurants.length} places`} isOpen={!collapsedSections['eat']} onToggle={() => toggleSection('eat')}>
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

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* EXPERIENCE                                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <CollapsibleSection id="experience" label="Experience" title={"Culture, heritage & discovery"} teaser={`${experiences.length} experiences`} isOpen={!collapsedSections['experience']} onToggle={() => toggleSection('experience')}>
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
          <CollapsibleSection id="give-back" label="Give Back" title="Leave it better than you found it." teaser="5 organizations" isOpen={!collapsedSections['give-back']} onToggle={() => toggleSection('give-back')}>
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
          </CollapsibleSection>

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
