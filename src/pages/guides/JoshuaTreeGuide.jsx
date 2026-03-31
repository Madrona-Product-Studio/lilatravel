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
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon, TierItem, TierLegend, TierFilter } from '@components/guide';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { getNPSData, buildNPSLookup, findNPSMatch } from '@services/npsService';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/joshua-tree.json';
import restaurants from '../../data/restaurants/joshua-tree-eat.json';
import experiences from '../../data/restaurants/joshua-tree-experience.json';
import breatheItems from '../../data/restaurants/joshua-tree-breathe.json';
import moveItems from '../../data/restaurants/joshua-tree-move.json';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';


// ─── Guide-Specific Components ───────────────────────────────────────────────
// SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon imported from @components/guide
const ACCENT = C.goldenAmber;

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
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-golden-amber px-2.5 py-0.5"
              style={{ border: `1px solid ${C.goldenAmber}40` }}>{"Lila Pick"}</span>
          )}
          {hasNPS && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 font-body text-[9px] font-bold tracking-[0.14em] uppercase text-[#2D5F2B]"
              style={{ background: "#2D5F2B10" }}>
              <NPSArrowhead size={10} />NPS
            </span>
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
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-golden-amber px-2.5 py-0.5"
              style={{ border: `1px solid ${C.goldenAmber}40` }}>{"Lila Pick"}</span>
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
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-golden-amber mb-2.5 px-2.5 py-0.5"
          style={{ background: `${C.goldenAmber}15` }}>{item.section}</span>
      )}

      <h3 className="font-serif text-[clamp(22px,4vw,28px)] font-normal text-dark-ink mb-2.5 leading-[1.2] mt-0">{item.name}</h3>

      {item.featured && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-golden-amber mb-3.5 px-2.5 py-0.5"
          style={{ border: `1px solid ${C.goldenAmber}40` }}>Lila Pick</span>
      )}

      {nps && (
        <>
          {npsPrimaryImage && (
            <div className="mx-[-20px] mb-[18px] relative">
              <img src={npsPrimaryImage.url} alt={npsPrimaryImage.altText || item.name}
                className="w-full h-[220px] object-cover block" />
              {(npsPrimaryImage.caption || npsPrimaryImage.credit) && (
                <div className="px-5 py-1.5 font-body text-[11px] font-normal text-[#7A857E] leading-[1.5]">
                  {npsPrimaryImage.caption && <span>{npsPrimaryImage.caption}</span>}
                  {npsPrimaryImage.credit && (
                    <span className="italic">{npsPrimaryImage.caption ? ' · ' : ''}Photo: {npsPrimaryImage.credit}</span>
                  )}
                </div>
              )}
              {npsImages.length > 1 && (
                <div className="flex gap-[3px] px-5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {npsImages.slice(1, 5).map((img, i) => (
                    <img key={i} src={img.url} alt={img.altText || ''} className="w-[60px] h-[42px] object-cover opacity-80" />
                  ))}
                </div>
              )}
            </div>
          )}

          <a href={nps.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 mb-[18px] no-underline transition-[background] duration-200"
            style={{ background: '#2D5F2B0D', border: '1px solid #2D5F2B18' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2D5F2B18'}
            onMouseLeave={e => e.currentTarget.style.background = '#2D5F2B0D'}>
            <NPSArrowhead size={20} color="#2D5F2B" />
            <div>
              <div className="font-body text-[12px] font-medium text-[#2D5F2B] leading-[1.5]">
                Trail information provided by the <strong>National Park Service</strong>
              </div>
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
              return (
                <div className="mb-5">
                  <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A857E] mb-2">Accessibility</div>
                  <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.6] m-0">{text}</p>
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
              <div className="mb-5">
                <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#7A857E] mb-2.5">Trail Accessibility</div>
                <div className="border border-stone" style={{ background: `${C.stone}18` }}>
                  {rows.map((row, i) => (
                    <div key={i} className="px-3.5 py-[9px] border-b border-stone">
                      {row.label && (<div className="font-body text-[11px] font-bold text-dark-ink mb-[3px]">{row.label}</div>)}
                      {row.values.map((val, j) => (
                        <div key={j} className="font-body text-[12px] font-normal text-[#4A5650] leading-[1.6]">{val}</div>
                      ))}
                    </div>
                  ))}
                  {footnote && (<div className="px-3.5 py-2 font-body text-[11px] font-normal italic text-[#7A857E] leading-[1.5]">{footnote}</div>)}
                </div>
              </div>
            );
          })()}

          {(item.detail || item.note) && (
            <div className="px-4 py-3.5 mb-[18px]" style={{ background: `${C.goldenAmber}08`, borderLeft: `3px solid ${C.goldenAmber}40` }}>
              <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-golden-amber mb-2">Our Take</div>
              {item.detail && (<p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] mt-0 mb-1.5">{item.detail}</p>)}
              {item.note && (<div className="font-body text-[12px] font-semibold text-ocean-teal">{item.note}</div>)}
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
          {item.note && (<div className="font-body text-[13px] font-semibold text-ocean-teal mb-3.5">{item.note}</div>)}

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
        </>
      )}

      {item.url && !nps && (
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

function WildlifeEntry({ name, season, detail }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-stone">
      <div className="flex items-baseline gap-2.5 flex-wrap">
        <span className="font-body text-[14px] font-semibold text-dark-ink">{name}</span>
        <span className="font-body text-[11px] font-bold tracking-[0.16em] uppercase text-golden-amber">{season}</span>
      </div>
      <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] m-0">{detail}</p>
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
                  borderBottom: `2px solid ${isActive ? C.goldenAmber : "transparent"}`,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? C.goldenAmber : "#7A857E",
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

export default function JoshuaTreeGuide() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const breathConfig = BREATH_CONFIG.joshuaTree;
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
  const [activeSleepTiers, setActiveSleepTiers] = useState(() => new Set(['elemental', 'rooted', 'premium', 'luxury']));
  const handleSleepToggle = (tierKey) => {
    setActiveSleepTiers(prev => {
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

  // ── NPS Data ──
  const [npsLookup, setNpsLookup] = useState(null);
  useEffect(() => {
    getNPSData(['jotr'])
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

  const PARKS = [{
    id: "joshua-tree", name: "Joshua Tree", designation: "us-national-park", established: 1994,
    acreage: "795,156 ac", elevation: "536–5,814 ft", attribute: "IDA Dark Sky Certified",
    soul: "One of the last truly dark skies in Southern California — IDA certified, Bortle 3–4. The park straddles two deserts: Mojave (high, cooler, Joshua trees) and Colorado (low, hotter, cholla and ocotillo).",
    facts: [
      "Sits at the convergence of the Mojave and Colorado Deserts",
      "Certified International Dark Sky Park — Bortle Class 2–3",
      "Over 8,000 climbing routes on 400+ formations",
      "Home to the Serrano and Cahuilla peoples for thousands of years",
    ],
    infoUrl: "https://www.nps.gov/jotr/",
    driveFrom: null, accent: C.goldenAmber, isAnchor: true,
  }];

  return (
    <>
      <Helmet>
        <title>Joshua Tree Guide — Desert Stillness, Dark Sky & Low-Impact Travel | Lila Trips</title>
        <meta name="description" content="One of California's darkest skies, and one of its most fragile landscapes. A guide for travelers who come to listen, not just look." />
        <link rel="canonical" href="https://lilatrips.com/destinations/joshua-tree" />
        <meta property="og:title" content="Joshua Tree Guide — Desert Stillness, Dark Sky & Low-Impact Travel | Lila Trips" />
        <meta property="og:description" content="One of California's darkest skies, and one of its most fragile landscapes. A guide for travelers who come to listen, not just look." />
        <meta property="og:url" content="https://lilatrips.com/destinations/joshua-tree" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lilatrips.com/og-image.png" />
        <meta property="og:image:alt" content="Joshua Tree — Lila Trips" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Joshua Tree Guide — Desert Stillness, Dark Sky & Low-Impact Travel | Lila Trips" />
        <meta name="twitter:description" content="One of California's darkest skies, and one of its most fragile landscapes. A guide for travelers who come to listen, not just look." />
        <meta name="twitter:image" content="https://lilatrips.com/og-image.png" />
      </Helmet>
      <Nav breathConfig={breathConfig} />

      {/* ══ CELESTIAL DRAWER ═══════════════════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? C.warmWhite : undefined }}>
          <CelestialDrawer destination="joshua-tree" isMobile={isMobile} breathValueRef={breathValueRef} />

          {/* ══ TITLE MASTHEAD ═══════════════════════════════════════════════════ */}
          <section style={{ background: breathConfig ? 'transparent' : C.cream }}>
        <div className="py-7 px-5 md:py-11 md:px-[52px] md:pb-10 max-w-[920px] mx-auto">
          <FadeIn from="bottom" delay={0.1}>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-7 md:gap-[52px] items-start">

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow text-golden-amber mb-3.5 block">Destination Guide</span>

                <h1 className="font-serif text-[clamp(38px,6vw,64px)] font-light text-dark-ink leading-none mb-[22px] tracking-[-0.02em] mt-0">
                  Joshua Tree
                </h1>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] mt-0 mb-3.5">
                  Joshua Tree sits at the convergence of two deserts — the Mojave and the Colorado — and that collision is part of what makes it singular. The high desert is cool and boulder-studded. The silence here has weight.
                </p>

                <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] m-0">
                  This is a place for people who want to feel small in the best possible way. We built this guide to help you find it.
                </p>
              </div>

              {/* ── Right: This Guide Covers ── */}
              <div className="border-t md:border-t-0 md:border-l border-stone pt-7 md:pt-0 md:pl-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-[18px]">This guide covers</div>

                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-sea-glass mb-2.5">Park</div>
                  <a href="https://www.nps.gov/jotr/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 mb-[7px] no-underline">
                    <div className="w-[5px] h-[5px] rounded-full bg-sea-glass opacity-50" />
                    <span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">Joshua Tree National Park</span>
                  </a>
                </div>

                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-golden-amber mb-2.5">Orbit Towns</div>
                  {["Joshua Tree town", "Twentynine Palms", "Pioneertown", "Palm Springs"].map((town, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-[7px]">
                      <div className="w-[5px] h-[5px] rounded-full bg-golden-amber opacity-50" />
                      <span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{town}</span>
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
            { src: P.joshuaTreeDawn,     alt: "Joshua Tree at dawn",            caption: "First light in the high desert",     width: 420 },
            { src: P.joshuaTreeCholla,    alt: "Cholla Cactus Garden",           caption: "Cholla Cactus Garden at golden hour", width: 280 },
            { src: P.joshuaTreeBoulders,  alt: "Joshua Tree boulder formations", caption: "Jumbo Rocks — ancient granite",       width: 420 },
            { src: P.joshuaTreeNightSky,  alt: "Night sky over Joshua Tree",     caption: "Bortle Class 2 darkness",            width: 360 },
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
          {/* THE PLACE                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="sense-of-place" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionLabel accentColor={ACCENT}>Sense of Place</SectionLabel>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"Joshua Tree sits at the convergence of two deserts — the Mojave and the Colorado — and that collision is part of what makes it singular. The high desert is cool and boulder-studded, carpeted in the alien silhouettes of Yucca brevifolia. Drop below the transition zone into the Colorado Desert and the landscape shifts: more open, more stark, warmer. The park covers 800,000 acres. Most visitors see a fraction of it."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                {"The surrounding communities each add a distinct layer. The town of Joshua Tree is small, arty, and increasingly a destination in itself. Twentynine Palms is the working town with the quietest skies. Pioneertown was built as a movie set in 1946 and never entirely stopped performing. Palm Springs is 45 minutes south: mid-century architecture, serious spas, a counterpoint when you want polished comfort after days in the dust."}
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3 md:gap-4 p-4 md:p-5 bg-cream border border-stone mb-5">
                {[
                  { l: "Recommended", v: "3–5 days" },
                  { l: "Nearest Airport", v: "Palm Springs (PSP) or LAX" },
                  { l: "Drive from LAX", v: "~2.5 hours" },
                  { l: "Best Times", v: "Oct–Apr" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-golden-amber mb-[3px]">{s.l}</div>
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

            {/* ── Wildlife Section ── */}
            <FadeIn delay={0.1}>
              <div className="border border-stone bg-cream mt-7 p-[18px] md:p-[22px]">
                <div className="font-body text-[10px] font-bold tracking-[0.24em] uppercase text-sea-glass mb-2">Desert Wildlife</div>
                <WildlifeEntry name="Desert Bighorn Sheep" season="Year-round" detail="Most visible at dawn and dusk near water sources. Barker Dam and Lost Palms Oasis are reliable sighting zones." />
                <WildlifeEntry name="Desert Tortoise" season="Spring – Fall" detail="Threatened species — do not approach or handle if encountered. Most active in spring after rain. Found in the Colorado Desert section." />
                <WildlifeEntry name="Coyote" season="Year-round" detail="Listen for them at dusk. Their calls across the open desert are part of the sound of this place." />
                <WildlifeEntry name="Roadrunner" season="Year-round" detail="Fast, curious, and frequently spotted along park roads and at campground edges." />
                <WildlifeEntry name="Sidewinder Rattlesnake" season="Warm months" detail="Watch where you step and reach, especially in rocky areas. They're shy but present." />
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
              <SectionSub>The desert transforms with the seasons. These are the moments when the land is most alive.</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem onOpenSheet={openSheet('When to Go')} name="Spring Wildflower Bloom" featured
                  detail="After wet winters, the desert erupts in color — poppies, lupine, desert lilies. Intensity varies year to year. When it happens, it's unforgettable."
                  tags={["Late Feb – Apr", "Weather-Dependent", "Magic Window"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Autumn Light"
                  detail="Second-best window. Crowds thinner than spring. The color is subtle but the light is extraordinary — amber and pink at golden hour."
                  tags={["Oct – Nov", "Golden Light", "Fewer Crowds"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Dark Sky Season" featured
                  detail="Winter's long nights and dry, stable air create the park's best stargazing conditions. The winter solstice provides the longest dark window of the year."
                  tags={["Nov – Feb", "Milky Way", "Geminids"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Perseid Meteor Shower"
                  detail="Mid-August. Up to 100 meteors per hour at peak. Best viewed from the backcountry or Pinto Basin Road pullouts after midnight."
                  tags={["Aug 12–13 Peak", "Night Sky", "Summer"]} />
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
              <SectionSub>The desert moves slowly. So should you.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Joshua Trees · Age & Fragility</div>
                  <ListItem name="The trees you're walking past are older than anyone you know."
                    detail="Joshua trees grow roughly an inch a year — the ones lining the trail may be a century old or more. Off-trail movement compacts soil that took millennia to develop and damages root systems that aren't visible from the surface. Stay on trail without exception. The desert floor looks empty. It isn't."
                    tags={["Stay on trail", "Soil compaction", "Desert fragility"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Dark Sky · IDA Certification</div>
                  <ListItem name="One of the last truly dark horizons in Southern California."
                    detail="Joshua Tree sits sandwiched between the Inland Empire's 4 million residents to the west and the last pool of natural darkness in Southern California to the east. The park earned International Dark Sky Park designation in 2017. That status depends on visitors using red-filtered lights at night, staying in designated stargazing areas, and not pulling off-road into undisturbed terrain. The darker you let it stay, the more sky you get."
                    note="◈ Head east into the park for the darkest skies — away from Palm Springs light pollution"
                    tags={["IDA dark sky park", "Red light only", "Stay on designated areas"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Peregrine Falcons · Seasonal Closures</div>
                  <ListItem name="Some trails close in spring. That's not an inconvenience — it's conservation."
                    detail="In spring, certain trails and rock-climbing routes close to protect nesting peregrine falcons. These closures are temporary and specific. Respecting them is the difference between a falcon pair successfully nesting and abandoning the site entirely. Check the NPS alerts page before you arrive — route closures shift year to year."
                    tags={["Seasonal closures", "Nesting protection", "Check before you go"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Camping · Fire & Waste</div>
                  <ListItem name="The 2019 shutdown showed what happens without rangers."
                    detail="During the 2019 government shutdown, visitors camped illegally in sensitive areas and drove off-road vehicles over fragile landscapes, creating new roads in previously undisturbed terrain. The damage took months to recover from. Camp only in designated sites. Pack out all waste. Never build fires outside established rings — desert scrub ignites fast and the park has limited suppression capacity."
                    tags={["Designated camping only", "Pack it out", "No off-road"]} />
                </div>
              </div>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* WHERE TO SLEEP                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="where-to-stay" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="stay" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Sleep</SectionLabel>
              <SectionTitle>Where to sleep</SectionTitle>
              <SectionSub>How you inhabit a place matters. Options across the full spectrum — from sleeping under the stars to Palm Springs luxury.</SectionSub>
            </FadeIn>

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

              {accommodations.filter(a => a.corridor && activeSleepTiers.has(a.stayStyle)).length > 0 && (
                <>
                  <p className="font-body text-[13px] font-semibold tracking-[0.08em] uppercase mt-8 mb-3" style={{ color: C.warmGray }}>
                    Regional Corridor
                  </p>
                  {sortByTierDiversity(accommodations.filter(a => a.corridor && activeSleepTiers.has(a.stayStyle))).map(a => (
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
          <section id="move" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="move" />
              <SectionLabel>Move</SectionLabel>
              <SectionTitle>How to get into the landscape</SectionTitle>
              <SectionSub>Desert hikes, world-class rock climbing, and cycling through the geological record.</SectionSub>
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
                    light={item.type === 'climb'}
                    onOpenSheet={openSheet('Move')}
                    hasNPS={item.type === 'hike' && checkNPS(item.name)}
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
              <SectionIcon type="breathe" />
              <SectionLabel>Breathe</SectionLabel>
              <SectionTitle>{"Yoga, sound baths & desert silence"}</SectionTitle>
              <SectionSub>{"Yoga, sound baths, and desert silence as practice."}</SectionSub>
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
          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* NIGHT SKY                                                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
        </div>
      </section>

      {/* Night Sky section with full-width dark background */}
      <section id="light-sky" className="scroll-mt-[126px] py-[52px] px-5 md:py-16 md:px-[52px] bg-dark-ink">
        <div className="max-w-[680px] mx-auto">
          <FadeIn>
            <SectionIcon type="darksky" color={ACCENT} />
            <div className="font-body text-[12px] font-bold tracking-[0.28em] uppercase text-golden-amber mb-3 text-center">Night Sky</div>
            <h2 className="font-serif text-[clamp(24px,4vw,32px)] font-normal text-white mt-0 mb-1.5 leading-[1.2] text-center">The night sky here is extraordinary</h2>
            <p className="font-body text-[15px] md:text-[clamp(14px,1.8vw,15px)] font-normal text-white/70 mx-auto mb-7 leading-[1.7] text-left md:text-center max-w-full md:max-w-[520px] mt-0">
              Joshua Tree is a certified International Dark Sky Park. Bortle Class 2 conditions in the backcountry — among the darkest accessible skies in Southern California.
            </p>
          </FadeIn>

          <FadeIn delay={0.06}>
            {/* Best Viewing Areas */}
            <div className="mb-8">
              <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-golden-amber mb-4">Best Viewing Areas</div>
              {[
                { name: "Cholla Cactus Garden parking area", note: "Colorado Desert — minimal tree obstruction. Silhouetted cactus against the Milky Way." },
                { name: "Jumbo Rocks Campground", note: "High desert, open sky. Dark sky conditions excellent from your campsite." },
                { name: "Pinto Basin Road pullouts", note: "The least-trafficked corridor. Darkest skies accessible by car." },
                { name: "Cap Rock area", note: "Open sky, easy access. Good for meteor shower viewing." },
              ].map((area, i) => (
                <div key={i} className="py-3.5 border-b border-white/10">
                  <div className="font-body text-[14px] font-semibold text-white mb-1">{area.name}</div>
                  <div className="font-body text-[13px] font-normal text-white/55 leading-[1.6]">{area.note}</div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {/* Calendar Anchors */}
            <div className="mb-8">
              <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-golden-amber mb-4">Calendar Anchors</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { event: "New Moon Windows", timing: "Monthly", detail: "Plan around them for optimal stargazing" },
                  { event: "Perseid Meteor Shower", timing: "Aug 12–13 peak", detail: "Up to 100 meteors/hour" },
                  { event: "Geminid Meteor Shower", timing: "Dec 13–14 peak", detail: "Often the year's best — up to 150/hour" },
                  { event: "Milky Way Core", timing: "May – August", detail: "Best overhead viewing after midnight" },
                ].map((cal, i) => (
                  <div key={i} className="p-3.5 px-4 border border-white/[0.12] bg-white/[0.03]">
                    <div className="font-body text-[14px] font-semibold text-white mb-[3px]">{cal.event}</div>
                    <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-golden-amber mb-1">{cal.timing}</div>
                    <div className="font-body text-[12px] font-normal text-white/50">{cal.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            {/* Practical Notes */}
            <div className="p-4 px-[18px] border border-white/[0.12] bg-white/[0.03]">
              <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-golden-amber mb-2.5">Practical Notes</div>
              <p className="font-body text-[13px] font-normal text-white/60 leading-[1.7] m-0">
                Allow 20–30 minutes for eyes to fully dark-adapt. Use a red-lens headlamp — white light ruins night vision for everyone nearby. Download a stargazing app (Sky Guide, Stellarium) before entering the park — there's no cell service. Pair dark sky sessions with Cholla Cactus Garden for the surreal combination of silhouetted cactus against the Milky Way.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.18}>
            {/* Sky's the Limit Callout */}
            <div className="mt-7 p-5 px-[22px] bg-white/[0.04]" style={{ borderLeft: `3px solid ${C.goldenAmber}` }}>
              <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-golden-amber mb-1.5">Local Spotlight</div>
              <a href="https://skysthelimit29.org/" target="_blank" rel="noopener noreferrer"
                className="font-serif text-[20px] font-normal text-white no-underline inline-block mb-2 transition-[border-color] duration-200"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.25)" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.goldenAmber}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"}
              >Sky's the Limit Observatory & Nature Center <span className="text-[14px]">{"↗"}</span></a>
              <p className="font-body text-[13px] font-normal text-white/60 leading-[1.7] m-0">
                A volunteer-run observatory and dark sky education center in Twentynine Palms — right at the edge of the park. Free public star parties every Saturday night with research-grade telescopes, knowledgeable astronomers, and one of the best night sky experiences available anywhere in Southern California. No reservation needed.
              </p>
              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                {["Free Admission", "Saturday Star Parties", "Twentynine Palms"].map((t, i) => (
                  <span key={i} className="py-[3px] px-[9px] bg-white/[0.08] font-body text-[11px] font-semibold text-white/50">{t}</span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Continue guide content */}
      <section className="px-5 pb-[60px] md:px-[52px] md:pb-20 bg-cream">
        <div className="max-w-[680px] mx-auto">


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* EAT                                                            */}
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
                {restaurants.filter(r => r.corridor).length > 0 && (
                  <>
                    <p className="font-body text-[13px] font-semibold tracking-[0.08em] uppercase text-warm-gray mt-8 mb-3">Regional Corridor</p>
                    {restaurants.filter(r => r.corridor).sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(r => (
                      <ListItem key={r.id} name={r.name} detail={r.highlights?.join('. ')} note={r.hours} tags={r.tags} featured={r.lilaPick} url={r.links?.website} location={r.location} onOpenSheet={openSheet('Eat')} />
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
              <SectionIcon type="connect" />
              <SectionLabel>Experience</SectionLabel>
              <SectionTitle>{"Culture, heritage & discovery"}</SectionTitle>
              <SectionSub>{"Cultural sites, art initiatives, and the desert's creative community."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={4} label="experiences">
                {experiences.sort((a, b) => (b.lilaPick ? 1 : 0) - (a.lilaPick ? 1 : 0)).map(item => (
                  <ListItem key={item.id} name={item.name} detail={item.highlights?.[0]} note={item.admission === 'reservation-required' || item.admission === 'paid' ? item.admission : null} tags={item.tags} featured={item.lilaPick} url={item.links?.website} location={item.location} onOpenSheet={openSheet('Experience')} />
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
              <SectionIcon type="giveback" color={ACCENT} />
              <SectionLabel accentColor={ACCENT}>Give Back</SectionLabel>
              <SectionTitle>Leave it better than you found it.</SectionTitle>
              <SectionSub>The desert sustains itself slowly. These organizations help it along.</SectionSub>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Conservation</div>
                  <ListItem name="Mojave Desert Land Trust"
                    url="https://www.mdlt.org"
                    detail="Based in Joshua Tree, MDLT protects the California desert through land acquisition, habitat restoration, and a native plant seed bank — including growing thousands of Joshua trees for replanting in the park. Volunteer on land monitoring hikes or donate to their seed bank program."
                    tags={["Donate", "Volunteer"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous Giving</div>
                  <ListItem name="Native American Land Conservancy"
                    url="https://www.nativeamericanlandconservancy.org"
                    detail="A partner in MDLT's Joshua tree conservation coalition, bringing Indigenous cultural knowledge to desert stewardship. To Indigenous communities in this region, the Joshua tree — Humwichawa — is a family member, not a landmark."
                    tags={["Donate"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Trail Stewardship</div>
                  <ListItem name="Joshua Tree National Park Volunteer Program"
                    url="https://www.nps.gov/jotr/getinvolved/volunteer.htm"
                    detail="The most direct option for visitors who want to give time rather than money. Trail maintenance, restoration, and education programs run directly through the park."
                    tags={["Volunteer"]} />
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
              <span className="font-body text-[12px] font-bold tracking-[0.28em] uppercase text-golden-amber block mb-4">Begin</span>
              <h3 className="font-serif text-[clamp(28px,5vw,42px)] font-light text-dark-ink mt-0 mb-2.5 leading-[1.2]">Your desert trip starts here</h3>
              <p className="font-body text-[clamp(14px,1.6vw,14px)] font-normal text-[#4A5650] max-w-[460px] mx-auto mb-9 leading-[1.65] mt-0">
                Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you.
              </p>
              <Link to="/plan"
                className="py-3.5 px-9 border-none bg-dark-ink text-white text-center inline-block font-body text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-opacity duration-200 no-underline hover:opacity-85"
                onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'joshua-tree' })}
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
                  { name: "Olympic Peninsula", slug: "olympic-peninsula", accent: C.skyBlue },
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

      <GuideDetailSheet
        item={activeSheet}
        onClose={() => setActiveSheet(null)}
        isMobile={isMobile}
      />
      <WhisperBar destination="joshuaTree" label="Joshua Tree" />
      <Footer />
    </>
  );
}
