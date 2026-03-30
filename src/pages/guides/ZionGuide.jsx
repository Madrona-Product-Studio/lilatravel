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
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Footer, FadeIn, WhisperBar } from '@components';
import { SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon } from '@components/guide';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { getNPSData, buildNPSLookup, findNPSMatch } from '@services/npsService';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/zion.json';
import restaurants from '../../data/restaurants/zion.json';
import { BREATH_CONFIG } from '@data/breathConfig';
import useBreathCanvas from '@hooks/useBreathCanvas';


// --- Guide-Specific Components ------------------------------------------------
// SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon imported from @components/guide
const ACCENT = C.sunSalmon;


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
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sun-salmon px-2.5 py-0.5"
              style={{ border: `1px solid ${C.sunSalmon}40` }}>{"Lila Pick"}</span>
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

// Sort accommodations: one lilaPick per tier (elemental → rooted → premium → luxury), then rest
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
            <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sun-salmon px-2.5 py-0.5"
              style={{ border: `1px solid ${C.sunSalmon}40` }}>{"Lila Pick"}</span>
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
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sky-blue mb-2.5 px-2.5 py-0.5"
          style={{ background: `${C.skyBlue}15` }}>{item.section}</span>
      )}

      {/* Name */}
      <h3 className="font-serif text-[clamp(22px,4vw,28px)] font-normal text-dark-ink mb-2.5 leading-[1.2] mt-0">{item.name}</h3>

      {/* Lila Pick */}
      {item.featured && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sun-salmon mb-3.5 px-2.5 py-0.5"
          style={{ border: `1px solid ${C.sunSalmon}40` }}>Lila Pick</span>
      )}

      {/* ═══ NPS ENRICHMENT (when available) ═══ */}
      {nps && (
        <>
          {/* NPS Photo */}
          {npsPrimaryImage && (
            <div className="mx-[-20px] mb-[18px] relative">
              <img
                src={npsPrimaryImage.url}
                alt={npsPrimaryImage.altText || item.name}
                className="w-full h-[220px] object-cover block"
              />
              {(npsPrimaryImage.caption || npsPrimaryImage.credit) && (
                <div className="font-body text-[11px] font-normal text-[#7A857E] leading-[1.5] px-5 py-1.5">
                  {npsPrimaryImage.caption && <span>{npsPrimaryImage.caption}</span>}
                  {npsPrimaryImage.credit && (
                    <span className="italic">{npsPrimaryImage.caption ? ' · ' : ''}Photo: {npsPrimaryImage.credit}</span>
                  )}
                </div>
              )}
              {/* Thumbnail strip */}
              {npsImages.length > 1 && (
                <div className="flex gap-[3px] px-5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {npsImages.slice(1, 5).map((img, i) => (
                    <img key={i} src={img.url} alt={img.altText || ''} className="w-[60px] h-[42px] object-cover opacity-80" />
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
            className="flex items-center gap-2.5 py-2.5 px-3.5 mb-[18px] no-underline transition-[background] duration-200"
            style={{ background: '#2D5F2B0D', border: '1px solid #2D5F2B18' }}
            onMouseEnter={e => e.currentTarget.style.background = '#2D5F2B18'}
            onMouseLeave={e => e.currentTarget.style.background = '#2D5F2B0D'}
          >
            <NPSArrowhead size={20} color="#2D5F2B" />
            <div>
              <div className="font-body text-[12px] font-medium text-[#2D5F2B] leading-[1.5]">
                Trail information provided by the <strong>National Park Service</strong>
              </div>
              <div className="font-body text-[10px] font-semibold tracking-[0.12em] uppercase text-[#2D5F2B] opacity-60 mt-0.5">View on NPS.gov ↗</div>
            </div>
          </a>

          {/* NPS Description */}
          {(nps.longDescription || nps.shortDescription) && (
            <div className="mb-[18px]">
              <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#2D5F2B] mb-2">NPS Description</div>
              <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.75] m-0">{stripHTML(nps.longDescription || nps.shortDescription)}</p>
            </div>
          )}

          {/* NPS Info Grid */}
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

          {/* NPS Trail Accessibility -- structured breakdown */}
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
              const label = boldMatch
                ? clean(boldMatch[1]).replace(/\s*\|\s*$/, '').trim()
                : '';
              const valueHtml = boldMatch
                ? inner.slice(inner.indexOf('</b>') + 4)
                : inner;
              const valueParts = valueHtml
                .split(/<b>\s*\|?\s*<\/b>|<b>\s*\|\s*<\/b>/)
                .map(clean)
                .filter(Boolean);
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
                    <div key={i} className="py-[9px] px-3.5 border-b border-stone">
                      {row.label && (
                        <div className="font-body text-[11px] font-bold text-dark-ink mb-[3px]">{row.label}</div>
                      )}
                      {row.values.map((val, j) => (
                        <div key={j} className="font-body text-[12px] font-normal text-[#4A5650] leading-[1.6]">{val}</div>
                      ))}
                    </div>
                  ))}
                  {footnote && (
                    <div className="font-body text-[11px] font-normal italic text-[#7A857E] leading-[1.5] py-2 px-3.5">{footnote}</div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Lila's Take -- editorial content below NPS */}
          {(item.detail || item.note) && (
            <div className="py-3.5 px-4 mb-[18px]"
              style={{ background: `${C.goldenAmber}08`, borderLeft: `3px solid ${C.goldenAmber}40` }}>
              <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-golden-amber mb-2">Our Take</div>
              {item.detail && (
                <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.7] mt-0 mb-1.5">{item.detail}</p>
              )}
              {item.note && (
                <div className="font-body text-[12px] font-semibold text-ocean-teal">{item.note}</div>
              )}
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
        </>
      )}

      {/* STANDARD CONTENT (no NPS) */}
      {!nps && (
        <>
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

          {/* Tags */}
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

      {/* Visit Website link */}
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

function WildlifeEntry({ name, season, detail, accent }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-stone">
      <div className="flex items-baseline gap-2.5 flex-wrap">
        <span className="font-body text-[14px] font-semibold text-dark-ink">{name}</span>
        <span className="font-body text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: accent }}>{season}</span>
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
        border: `1px solid ${isExpanded ? park.accent + "40" : C.stone}`,
        borderLeftWidth: 4, borderLeftColor: park.accent,
        background: isExpanded ? `${park.accent}06` : C.cream,
      }}>
      <button
        onClick={onToggle}
        className="w-full p-3.5 md:px-5 md:py-4 bg-transparent border-none cursor-pointer flex items-center gap-3 text-left"
      >
        <div className="flex-1 min-w-0">
          {/* Eyebrow */}
          <div className="flex items-center justify-between mb-1">
            <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: park.accent }}>
              {DESIGNATION_LABELS[park.designation] || park.designation}{park.established ? ` · Est. ${park.established}` : ""}
            </div>
            {!park.isAnchor && park.driveFrom && (
              <div className="font-body text-[10px] font-semibold tracking-[0.08em] text-[#7A857E]">
                {park.driveFrom}
              </div>
            )}
          </div>
          {/* Name */}
          <div className={`font-serif text-[clamp(18px,2.5vw,22px)] font-normal text-dark-ink leading-[1.15] ${chips.length ? 'mb-2' : ''}`}>{park.name}</div>
          {/* Chips */}
          {chips.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {chips.map((chip, i) => (
                <span key={i} className="font-body text-[11px] font-semibold text-[#4A5650] whitespace-nowrap px-2.5 py-0.5"
                  style={{ background: `${park.accent}10` }}>{chip}</span>
              ))}
            </div>
          )}
        </div>
        {/* Icon + chevron */}
        <div className="flex items-center gap-2 shrink-0">
          <DesignationIcon designation={park.designation} size={16} color={park.accent} />
          <span className="inline-block text-[14px] text-[#7A857E] leading-none transition-transform duration-300 ease-in-out"
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
        </div>
      </button>
      {/* Expanded body */}
      <div className="overflow-hidden transition-[max-height] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
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

// ─── Wildlife Drawer ────────────────────────────────────────────────────────

function WildlifeDrawer() {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState("Mammals");
  const [expandedEntry, setExpandedEntry] = useState(null);

  const group = WILDLIFE_GROUPS.find(g => g.label === activeGroup);

  return (
    <div className="border border-stone bg-cream mt-7">
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-[18px] py-4 md:px-[22px] md:py-[18px] bg-transparent border-none cursor-pointer flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C9 2 3 5 3 10C3 13.3137 5.68629 16 9 16C12.3137 16 15 13.3137 15 10C15 5 9 2 9 2Z"
              stroke={C.seaGlass} strokeWidth="1.2" fill="none" />
            <line x1="9" y1="16" x2="9" y2="8" stroke={C.seaGlass} strokeWidth="1.2" />
            <line x1="9" y1="11" x2="6" y2="9" stroke={C.seaGlass} strokeWidth="1" />
            <line x1="9" y1="13" x2="12" y2="11" stroke={C.seaGlass} strokeWidth="1" />
          </svg>
          <div>
            <div className="font-body text-[10px] font-bold tracking-[0.24em] uppercase mb-0.5" style={{ color: C.seaGlass }}>
              The Living Corridor
            </div>
            <div className="font-serif text-[17px] md:text-[19px] font-normal text-dark-ink leading-[1.1]">
              Plants &amp; Wildlife
            </div>
          </div>
        </div>
        <div className="font-body text-[10px] font-semibold tracking-[0.12em] text-[#7A857E] flex items-center gap-1.5">
          <span>{open ? "Collapse" : "Explore"}</span>
          <span style={{ display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", fontSize: 13 }}>↓</span>
        </div>
      </button>

      {/* Body */}
      <div style={{ maxHeight: open ? 1200 : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
        <div className="border-t border-stone">
          {/* Intro */}
          <div className="px-[18px] py-4 pb-3 md:px-[22px] md:py-[18px] md:pb-3">
            <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.7] m-0">
              Zion sits at the crossroads of four ecological zones. Bryce's high plateaus add a fifth dimension. Capitol Reef's Waterpocket Fold creates micro-climates found nowhere else. Together, the corridor hosts 78 mammal species, 291 birds, and plant life that shifts from desert floor to subalpine forest within a single day's drive.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-b border-stone">
            {WILDLIFE_GROUPS.map(g => (
              <button key={g.label}
                onClick={() => { setActiveGroup(g.label); setExpandedEntry(null); }}
                className="flex-1 py-[11px] px-2 border-none cursor-pointer font-body text-[10px] font-bold tracking-[0.18em] uppercase transition-all duration-200"
                style={{
                  background: activeGroup === g.label ? `${g.accent}10` : "transparent",
                  borderBottom: `2px solid ${activeGroup === g.label ? g.accent : "transparent"}`,
                  color: activeGroup === g.label ? g.accent : "#7A857E",
                }}
              >{g.label}</button>
            ))}
          </div>

          {/* Entries */}
          <div className="py-1 pb-2">
            {group.entries.map((entry, i) => {
              const isExpanded = expandedEntry === i;
              return (
                <div key={i} style={{ borderBottom: i < group.entries.length - 1 ? `1px solid ${C.stone}` : "none" }}>
                  <button
                    onClick={() => setExpandedEntry(isExpanded ? null : i)}
                    className="w-full px-[18px] py-[13px] md:px-[22px] md:py-3.5 border-none cursor-pointer flex items-start justify-between gap-3 text-left"
                    style={{ background: isExpanded ? `${group.accent}08` : "transparent" }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
                        <span className="font-body text-[14px] font-semibold text-dark-ink">{entry.name}</span>
                        <span className="font-body text-[10px] font-bold tracking-[0.16em] uppercase" style={{ color: group.accent }}>{entry.season}</span>
                      </div>
                      <div className="flex gap-[5px] flex-wrap">
                        {entry.parks.map((p, pi) => (
                          <span key={p} className="font-body text-[10px] font-medium text-[#7A857E] tracking-[0.04em]">
                            {p}{pi < entry.parks.length - 1 ? " ·" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="inline-block text-[#7A857E] text-[13px] shrink-0 mt-0.5" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>↓</span>
                  </button>
                  <div style={{ maxHeight: isExpanded ? 200 : 0, overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
                    <div className="px-[18px] pb-4 md:px-[22px]">
                      <p className="font-body text-[13px] font-normal text-[#4A5650] leading-[1.75] m-0 pl-3" style={{ borderLeft: `2px solid ${group.accent}50` }}>
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
      className="p-7 flex flex-col cursor-default min-w-0 transition-all duration-300"
      style={{
        background: hovered ? `${accent}08` : "transparent",
        border: `1px solid ${hovered ? accent : C.stone}`,
      }}
    >
      <div className="mb-5">{icon}</div>
      <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase mb-2.5" style={{ color: accent }}>{label}</div>
      <div className="font-serif text-[clamp(20px,2.5vw,26px)] font-normal text-dark-ink leading-[1.2] mb-3.5">{title}</div>
      <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.65] m-0 mb-auto pb-6">{description}</p>
      <button
        onClick={ctaAction}
        className="self-start py-[11px] px-[22px] bg-transparent font-body text-[11px] font-bold tracking-[0.16em] uppercase cursor-pointer transition-all duration-[250ms]"
        style={{ border: `1.5px solid ${accent}`, color: accent }}
        onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = accent; }}
      >{cta}</button>
      {secondary && (
        <div className="font-body text-[11px] font-medium text-[#7A857E] mt-2.5 tracking-[0.04em]">{secondary}</div>
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
      <div className="p-7 my-2 text-center" style={{ background: v.bg, border: `1px solid ${v.border}` }}>
        {!isDark && (
          <div className="mb-3">
            <SectionIcon type="plan" />
          </div>
        )}
        <div className="font-serif text-[clamp(20px,3vw,26px)] font-normal leading-[1.2] mb-2"
          style={{ color: isDark ? "#fff" : C.darkInk }}>{v.heading}</div>
        <p className="font-body text-[14px] font-normal leading-[1.65] max-w-[480px] mx-auto mb-6"
          style={{ color: isDark ? "rgba(255,255,255,0.75)" : "#4A5650", margin: "0 auto 24px" }}>{v.body}</p>
        <button
          onClick={() => navigate('/plan')}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="py-3 px-8 font-body text-[12px] font-bold tracking-[0.18em] uppercase cursor-pointer transition-all duration-300"
          style={{
            background: isDark
              ? (hovered ? "#fff" : "transparent")
              : (hovered ? C.darkInk : "transparent"),
            border: isDark
              ? "1.5px solid rgba(255,255,255,0.4)"
              : `1.5px solid ${C.darkInk}`,
            color: isDark
              ? (hovered ? C.darkInk : "#fff")
              : (hovered ? "#fff" : C.darkInk),
          }}
        >{v.cta}</button>
        {!isDark && (
          <div className="font-body text-[11px] font-medium text-[#7A857E] mt-3 tracking-[0.04em]">One-time purchase · Includes offline access</div>
        )}
      </div>
    </FadeIn>
  );
}


// ─── Threshold Trip Card (new) ───────────────────────────────────────────────

function ThresholdTripCard({ title, dates, duration, description, spotsLeft, accent = C.sunSalmon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="p-7 bg-dark-ink mb-3 transition-all duration-300">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase" style={{ color: accent }}>Threshold Trip</div>
        {spotsLeft && (
          <div className="py-0.5 px-2.5 font-body text-[10px] font-bold tracking-[0.14em] uppercase"
            style={{ border: `1px solid ${accent}40`, color: accent }}>{spotsLeft} spots left</div>
        )}
      </div>
      <div className="font-serif text-[clamp(22px,3vw,28px)] font-light text-white mb-1 leading-[1.2]">{title}</div>
      <div className="font-body text-[12px] font-semibold tracking-[0.06em] mb-4" style={{ color: accent }}>{dates} · {duration} · Guided group</div>
      <p className="font-body text-[14px] font-normal leading-[1.7] text-white/75 m-0 mb-6">{description}</p>
      <div className="flex gap-3 items-center flex-wrap">
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="py-[11px] px-7 font-body text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-all duration-300"
          style={{
            border: "1px solid rgba(255,255,255,0.4)",
            background: hovered ? "white" : "transparent",
            color: hovered ? C.darkInk : "white",
          }}
        >Express Interest</button>
        <span className="font-body text-[12px] font-medium text-white/55 tracking-[0.04em]">From $895 per person</span>
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
      <div className="mx-5 mb-6 border border-stone p-4 bg-cream">
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
              <span className="font-body text-[9px] font-bold tracking-[0.1em] text-[#b8b0a8] min-w-[16px]">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-body text-[11px] font-semibold tracking-[0.08em] uppercase text-[#4A5650]">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <nav
      className="sticky top-[72px] z-[90] border-t border-b border-stone"
      style={{ background: "rgba(250, 247, 243, 0.97)" }}
    >
      <div className="max-w-[1120px] mx-auto pt-1 px-10 flex items-center">
        <div className="flex-1 min-w-0 relative">
          <div
            ref={scrollContainerRef}
            className="guide-nav-scroll flex items-center overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                className="guide-nav-scroll px-3.5 h-[44px] bg-transparent border-none cursor-pointer font-body text-[11px] tracking-[0.14em] uppercase whitespace-nowrap shrink-0 relative transition-[color,border-color] duration-[250ms]"
                style={{
                  borderBottom: `2px solid ${isActive ? C.oceanTeal : "transparent"}`,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? C.oceanTeal : "#7A857E",
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
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const breathConfig = BREATH_CONFIG.zion;
  const breathWrapperRef = useRef(null);
  const breathValueRef = useBreathCanvas(breathConfig, breathWrapperRef);

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
      <Nav breathConfig={breathConfig} />

      {/* ══ CELESTIAL DRAWER ═══════════════════════════════════════════════ */}
      <div ref={breathWrapperRef} style={{ background: breathConfig ? C.warmWhite : undefined }}>
          <CelestialDrawer destination="zion" isMobile={isMobile} breathValueRef={breathValueRef} />

          {/* ══ TITLE MASTHEAD ═══════════════════════════════════════════════════ */}
          <section style={{ background: breathConfig ? 'transparent' : C.cream }}>
        <div className="px-5 py-7 md:px-[52px] md:py-11 max-w-[920px] mx-auto">
          <FadeIn from="bottom" delay={0.1}>


            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-7 md:gap-[52px] items-start">

              {/* ── Left: Title + description ── */}
              <div>
                <span className="eyebrow block mb-3.5 text-sun-salmon">Destination Guide</span>

                <h1 className="font-serif text-[clamp(38px,6vw,64px)] font-light text-dark-ink leading-none tracking-[-0.02em] mt-0 mb-[22px]">
                  Zion &amp; its orbit
                </h1>

                <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] mt-0 mb-3.5">
                  The Southern Paiute called this place <span className="text-dark-ink">Mukuntuweap</span>. The sandstone is 170 million years old. For thousands of years, this land has drawn people inward.
                </p>

                <p className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.75] max-w-[460px] m-0">
                  The scale quiets the mind. The light feels earned. Something here shifts — and we built this guide to help you find it.
                </p>
              </div>

              {/* ── Right: This Guide Covers ── */}
              <div className="border-t md:border-t-0 md:border-l border-stone pt-7 md:pt-0 md:pl-7">
                <div className="font-body text-[11px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-[18px]">This guide covers</div>

                {/* Parks */}
                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-sea-glass mb-2.5">Parks</div>
                  {[
                    { label: "Zion National Park", url: "https://www.nps.gov/zion/" },
                    { label: "Bryce Canyon National Park", url: "https://www.nps.gov/brca/" },
                    { label: "Capitol Reef National Park", url: "https://www.nps.gov/care/" },
                  ].map((park, i) => (
                    <a key={i} href={park.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 mb-[7px] no-underline">
                      <div className="w-[5px] h-[5px] rounded-full bg-sea-glass opacity-50" />
                      <span className="font-body text-[12px] font-semibold tracking-[0.02em] text-dark-ink">{park.label}</span>
                    </a>
                  ))}
                </div>

                {/* Gateway Towns */}
                <div className="mb-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-golden-amber mb-2.5">Gateway Towns</div>
                  {["Springdale", "Kanab", "Escalante", "Torrey"].map((town, i) => (
                    <div key={i} className="flex items-center gap-2.5 mb-[7px]">
                      <div className="w-[5px] h-[5px] rounded-full bg-golden-amber opacity-50" />
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
            { src: P.zionWatchman,    alt: "The Watchman at golden hour",     caption: "The Watchman at golden hour",       width: 420 },
            { src: P.zionNarrows,     alt: "The Narrows",                    caption: "The Narrows — ankle to waist",      width: 280 },
            { src: P.bryceCanyon,     alt: "Bryce Canyon hoodoos",           caption: "Bryce Canyon hoodoos",              width: 420 },
            { src: P.capitolReef,     alt: "Capitol Reef at sunset",         caption: "Capitol Reef at sunset",            width: 360 },
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
      <section className="px-5 py-8 md:px-[52px] md:py-12 bg-cream">
        <div className="max-w-[680px] mx-auto">


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SENSE OF PLACE                                                */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="sense-of-place" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionLabel>Sense of Place</SectionLabel>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-4">
                {"Zion Canyon was carved over millions of years by the Virgin River cutting through Navajo sandstone. The walls glow copper at sunrise, amber at midday, impossible pink at dusk. The Paiute called it Mukuntuweap — \"straight-up land.\" Whatever name you give it, the experience is the same: you stand among these walls of stone and you stop talking."}
              </p>
              <p className="font-body text-[clamp(14px,1.8vw,15px)] leading-[1.8] font-normal text-[#4A5650] mt-0 mb-7">
                This guide covers the full orbit — three parks, three personalities, one continuous landscape. Zion pulls you in. Bryce lifts you up. Capitol Reef reminds you the earth is still becoming.
              </p>
            </FadeIn>

            {/* ── At a Glance ── */}
            <FadeIn delay={0.06}>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-3 md:gap-4 p-4 md:p-5 bg-cream border border-stone mb-5">
                {[
                  { l: "Recommended", v: "4–7 days" },
                  { l: "Nearest Airport", v: "Las Vegas (LAS)" },
                  { l: "Drive from LAS", v: "~2.5 hours" },
                  { l: "Best Times", v: "Mar–May, Sep–Nov" },
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

            {/* ── Wildlife Drawer ── */}
            <FadeIn delay={0.1}>
              <WildlifeDrawer />
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* MAGIC WINDOWS                                                 */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="when-to-go" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="windows" />
              <SectionLabel>Magic Windows</SectionLabel>
              <SectionTitle>When to go</SectionTitle>
              <SectionSub>Zion transforms with the seasons. These are the moments when the land is most alive.</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>
                <ListItem onOpenSheet={openSheet('When to Go')} name={"Early Autumn — The Golden Corridor"} featured
                  detail="Cottonwoods turn gold along the Virgin River. Crowds thin. Light goes amber. Best hiking weather of the year."
                  tags={["Late Sep – Oct", "Golden Light", "Best Weather"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Desert Bloom" featured
                  detail="After a wet winter, the desert floor erupts in wildflowers. Cacti crown themselves. Timing is everything — and unpredictable."
                  tags={["Mar – Apr", "Wildflowers", "Variable"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Winter Solstice"
                  detail="Shortest day, most dramatic canyon light. Snow dusting the upper walls at sunset. Fewer people, deeper silence."
                  tags={["Dec 19–22", "Solstice", "Canyon Light"]} />
                <ListItem onOpenSheet={openSheet('When to Go')} name="Dark Sky Season"
                  detail="Late summer and early fall offer warm nights for stargazing. The Milky Way peaks overhead from June through September."
                  tags={["Jun – Sep", "Milky Way", "Warm Nights"]} />
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
              <SectionSub>The canyon has been here for 250 million years. How you move through it matters.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Cryptobiotic Soil</div>
                  <ListItem name="The ground is alive. Stay on the trail."
                    detail="The dark, lumpy biological crust visible just off the path is cryptobiotic soil — a living community of cyanobacteria, lichens, and fungi that can take 50–250 years to recover from a single footstep. It holds the desert floor together, fixes nitrogen, and retains moisture. It looks like nothing. It is everything. The trail exists for a reason."
                    tags={["Stay on trail", "Desert fragility"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">The Narrows · Peak Season</div>
                  <ListItem name="Dawn entry isn't just better. It's right."
                    detail="The Narrows receives nearly 3,000 visitors on a peak summer day. By 9am, the slot canyon is a slow-moving crowd. Dawn entry — before the shuttle starts running — means the river is yours, the light is extraordinary, and you're carrying a smaller footprint through one of the most fragile corridors in the park. We route toward it every time."
                    note="◈ Arrive at the Temple of Sinawava trailhead no later than 6:30am in July–August"
                    tags={["Off-peak timing", "Low impact", "Dawn entry"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Angels Landing · Permit System</div>
                  <ListItem name="The lottery exists because we loved it too hard."
                    detail="Angels Landing now requires a permit — not because the NPS wanted to gatekeep it, but because the trail was eroding under the weight of unmanaged visitation. The permit system is an act of conservation. If you don't get one, the West Rim Trail above Scouts Lookout offers the same exposure and a fraction of the crowd. We're happy to route you there instead."
                    tags={["Permit required", "Alternatives available"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Virgin River · Water Ethics</div>
                  <ListItem name="What goes in comes out downstream."
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
          <section id="where-to-stay" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="stay" />
              <SectionLabel>Sleep</SectionLabel>
              <SectionTitle>Where to sleep</SectionTitle>
              <SectionSub>How you inhabit a place matters. Options across the full spectrum — from sleeping under the stars to world-class luxury.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="p-3.5 bg-cream border border-stone mb-5 flex flex-col md:flex-row gap-2.5 md:gap-4 flex-wrap">
                {[
                  { label: "Elemental", desc: "In the landscape", color: C.seaGlass },
                  { label: "Rooted", desc: "Boutique, local", color: C.oceanTeal },
                  { label: "Premium", desc: "World-class", color: C.goldenAmber },
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

              {accommodations.filter(a => a.corridor).length > 0 && (
                <>
                  <p className="font-body text-[13px] font-semibold tracking-[0.08em] uppercase text-warm-gray mt-8 mb-3">
                    Regional Corridor
                  </p>
                  {sortByTierDiversity(accommodations.filter(a => a.corridor)).map(a => (
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
          <section id="trails" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="move" />
              <SectionLabel>Move</SectionLabel>
              <SectionTitle>Hikes, trails &amp; adventures</SectionTitle>
              <SectionSub>{"From easy canyon strolls to world-class challenges. The terrain teaches you something new at every elevation."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={5} label="trails & adventures">
                <ListItem onOpenSheet={openSheet('Trails')} name="Angels Landing" featured
                  hasNPS={checkNPS("Angels Landing")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail={"The iconic chain-assisted ridgeline summit. Exposure, adrenaline, and views that justify every step. Permit required — book 3 months out."}
                  note="Permit required — recreation.gov · Seasonal lottery"
                  tags={["5.4 mi RT", "Strenuous", "1,488 ft gain", "Permit"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="The Narrows" featured
                  hasNPS={checkNPS("The Narrows")}
                  url="https://www.nps.gov/zion/planyourvisit/thenarrows.htm"
                  detail="Hiking through the Virgin River between thousand-foot walls. Water levels dictate access — check conditions daily. Rent gear in Springdale."
                  note="River-level dependent — check NPS morning reports"
                  tags={["Up to 10 mi", "Moderate–Strenuous", "Water Hiking"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="The Subway" featured
                  hasNPS={checkNPS("The Subway")}
                  url="https://www.nps.gov/zion/planyourvisit/the-subway.htm"
                  detail="A tunnel-shaped canyon carved by flowing water. Technical bottom-up route or wilderness top-down. Unforgettable geology."
                  tags={["9 mi RT", "Technical", "Permit Required"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Canyon Overlook Trail"
                  hasNPS={checkNPS("Canyon Overlook Trail")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Short, punchy, with one of the best views in the park. East side of the tunnel. Arrive early or at sunset."
                  tags={["1 mi RT", "Easy–Moderate", "Sunset", "Family Friendly"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Observation Point"
                  hasNPS={checkNPS("Observation Point")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Higher than Angels Landing, quieter, arguably more stunning. Full panorama of Zion Canyon."
                  tags={["8 mi RT", "Strenuous", "2,150 ft gain"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Kolob Canyons"
                  hasNPS={checkNPS("Kolob Canyons")}
                  url="https://www.nps.gov/zion/planyourvisit/kolob-canyons-wilderness-hiking-trails.htm"
                  detail={"Zion's quiet northern section. Fewer visitors, deeper solitude. Finger canyons of red Navajo sandstone."}
                  tags={["Multiple Trails", "Remote", "Separate Entrance"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Hidden Canyon"
                  hasNPS={checkNPS("Hidden Canyon")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="A narrow slot canyon reached by a chain-assisted trail. Small, intimate, often overlooked."
                  tags={["2.4 mi RT", "Moderate–Strenuous", "Chains"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Emerald Pools"
                  hasNPS={checkNPS("Emerald Pools")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Three tiers of pools and waterfalls, increasingly beautiful as you climb. Upper pool is the reward."
                  tags={["1–3 mi RT", "Easy–Moderate", "Family Friendly"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name={"Pa'rus Trail"}
                  hasNPS={checkNPS("Pa'rus Trail")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Flat, paved riverside trail. Bikes allowed. Perfect for decompression, morning walks, or families."
                  tags={["3.5 mi RT", "Easy", "Paved", "Bikes OK"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Watchman Trail"
                  hasNPS={checkNPS("Watchman Trail")}
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="A moderate loop to a viewpoint overlooking the town of Springdale, the Towers of the Virgin, and lower Zion Canyon. Best at sunset when the Watchman ignites."
                  tags={["3.3 mi RT", "Moderate", "Views", "Sunset"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Snow Canyon State Park"
                  url="https://stateparks.utah.gov/parks/snow-canyon/"
                  detail="Red and white sandstone, lava flows, and sand dunes 45 min from Zion. Far fewer crowds."
                  note="Near St. George — great half-day trip"
                  tags={["State Park", "Lava Tubes", "Less Crowded"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Scenic Drive to Capitol Reef"
                  detail="The 2.5-hour drive via Highway 12 is one of the most beautiful roads in America. Make it the journey, not the commute."
                  tags={["Scenic Drive", "Half Day", "Highway 12"]} />

                {/* ── Bryce Canyon Trails ──────────────────────────── */}
                <ListItem onOpenSheet={openSheet('Trails')} name="Navajo Loop Trail" location="Bryce Canyon NP" featured
                  hasNPS={checkNPS("Navajo Loop Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/navajo-loop-trail.htm"
                  detail="Drops you into the amphitheater via Wall Street — a narrow slot between hoodoos that blocks the sky. The most visceral way to enter Bryce. Combine with Queen's Garden for the best loop in the park."
                  tags={["1.4 mi RT", "Moderate", "Hoodoos", "1.5 hrs from Zion"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Queen's Garden Trail" location="Bryce Canyon NP" featured
                  hasNPS={checkNPS("Queen's Garden Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/queens-garden-trail.htm"
                  detail="The easiest route below the rim. Descends into a garden of hoodoos and connects to the Navajo Loop for the park's most popular combination hike. Queen Victoria stands guard."
                  tags={["1.8 mi RT", "Moderate", "Hoodoos", "Best Combined with Navajo"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Peek-a-Boo Loop Trail" location="Bryce Canyon NP"
                  hasNPS={checkNPS("Peek-a-Boo Loop Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/peek-a-boo-loop-trail.htm"
                  detail="The most strenuous of Bryce's amphitheater trails. Weaves through towering hoodoos, natural arches, and the Wall of Windows. Horse traffic shares the trail. Worth every step of elevation gain."
                  tags={["5.5 mi Loop", "Strenuous", "1,555 ft gain", "Wall of Windows"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Fairyland Loop" location="Bryce Canyon NP" featured
                  hasNPS={checkNPS("Fairyland Loop")}
                  url="https://www.nps.gov/brca/planyourvisit/fairyland-loop-trail.htm"
                  detail="The park's most rewarding full-day hike. Ridge walks, dense hoodoo forests, Tower Bridge arch, and views of the surrounding valley in every direction. Far fewer people than the main amphitheater trails."
                  tags={["7.8 mi Loop", "Strenuous", "1,545 ft gain", "Full Day"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Bristlecone Loop" location="Bryce Canyon NP"
                  hasNPS={checkNPS("Bristlecone Loop")}
                  url="https://www.nps.gov/brca/planyourvisit/bristlecone-loop-trail.htm"
                  detail="High-elevation loop through ancient bristlecone pines — some over 1,600 years old. Quiet, meditative, otherworldly. Best panoramic views in the park from Rainbow Point at 9,115 feet."
                  tags={["1 mi Loop", "Easy", "9,115 ft", "Rainbow Point"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Mossy Cave Trail" location="Bryce Canyon NP"
                  hasNPS={checkNPS("Mossy Cave Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/mossycave.htm"
                  detail="Off the beaten path on the east side of the park. Follows Water Canyon past hoodoos and arches to a small waterfall and ice-filled grotto. Outside the fee station — no park pass needed."
                  tags={["1 mi RT", "Easy", "Waterfall", "No Fee"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Rim Trail" location="Bryce Canyon NP"
                  hasNPS={checkNPS("Rim Trail")}
                  url="https://www.nps.gov/brca/planyourvisit/rimtrail.htm"
                  detail="A flat walk along the canyon rim connecting all the major viewpoints — Sunrise, Sunset, Inspiration, and Bryce Point. Do segments or all 5.5 miles. Shuttle-assisted for one-way hikes."
                  tags={["Up to 5.5 mi", "Easy", "Viewpoints", "Shuttle Access"]} />

                {/* ── Capitol Reef Trails ──────────────────────────── */}
                <ListItem onOpenSheet={openSheet('Trails')} name="Hickman Bridge Trail" location="Capitol Reef NP" featured
                  hasNPS={checkNPS("Hickman Bridge Trail")}
                  url="https://www.nps.gov/care/planyourvisit/hickman-bridge.htm"
                  detail="The park's signature hike. Follows the Fremont River then climbs to a 133-foot natural bridge with a 360-foot drop to the canyon below. Passes ancient Fremont granaries and a pit house ruin on the way up."
                  tags={["1.8 mi RT", "Moderate", "Natural Bridge", "Fremont Ruins"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Cassidy Arch Trail" location="Capitol Reef NP" featured
                  hasNPS={checkNPS("Cassidy Arch Trail")}
                  url="https://www.nps.gov/care/planyourvisit/cassidy-arch.htm"
                  detail="Named for Butch Cassidy, who hid in these canyons. Climbs steeply from the Grand Wash floor to stand on top of a massive natural arch with vertigo-inducing drop-offs on both sides. The reward-to-effort ratio is exceptional."
                  tags={["3.4 mi RT", "Strenuous", "870 ft gain", "Arch"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Capitol Gorge Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Capitol Gorge Trail")}
                  url="https://www.nps.gov/care/planyourvisit/capitol-gorge.htm"
                  detail="Walks between canyon walls carved with pioneer inscriptions from the 1870s and ancient Fremont petroglyphs. The 'Pioneer Register' and natural water tanks (potholes) are highlights. Flat and easy."
                  tags={["2.4 mi RT", "Easy", "Petroglyphs", "Pioneer Register"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Navajo Knobs Trail" location="Capitol Reef NP" featured
                  hasNPS={checkNPS("Navajo Knobs Trail")}
                  url="https://www.nps.gov/care/planyourvisit/navajoknobbstrail.htm"
                  detail="The park's finest dayhike. Starts at the Hickman Bridge trailhead and climbs to 360-degree views at 6,979 feet — the Waterpocket Fold, the Henry Mountains, and formations like Pectols Pyramid spread out below. Almost no one does it."
                  tags={["9.4 mi RT", "Strenuous", "1,620 ft gain", "Best Views"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Cohab Canyon Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Cohab Canyon Trail")}
                  url="https://www.nps.gov/care/planyourvisit/cohabcanyontrail.htm"
                  detail="Steep switchbacks climb to sweeping aerial views over Fruita, the orchard, and the Waterpocket Fold. The hidden slot canyons tucked into the walls reward anyone who wanders off the main path."
                  tags={["3.4 mi RT", "Moderate", "Canyon Views", "Fruita Overlook"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Grand Wash Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Grand Wash Trail")}
                  url="https://www.nps.gov/care/planyourvisit/grandwash.htm"
                  detail="A flat walk through the Waterpocket Fold between canyon walls that press to shoulder-width at the Narrows. Connects to the Cassidy Arch Trail for a longer loop. The easiest way to feel the scale of Capitol Reef."
                  tags={["4.5 mi RT", "Easy", "Slot Canyon", "Connects to Cassidy Arch"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Chimney Rock Trail" location="Capitol Reef NP"
                  hasNPS={checkNPS("Chimney Rock Trail")}
                  url="https://www.nps.gov/care/planyourvisit/chimney-rock.htm"
                  detail="A loop trail circling beneath the park's most recognizable formation. Views of the Waterpocket Fold, Capitol Reef, and the distant Henry Mountains. Excellent wildflowers in spring."
                  tags={["3.6 mi Loop", "Moderate", "590 ft gain", "Wildflowers"]} />
                <ListItem onOpenSheet={openSheet('Trails')} name="Sunset Point Trail" location="Capitol Reef NP"
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
          <section id="wellness" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="breathe" />
              <SectionLabel>Breathe</SectionLabel>
              <SectionTitle>{"Yoga, spa & wellness"}</SectionTitle>
              <SectionSub>{"Slow down. The canyon holds space for stillness just as powerfully as it holds space for adventure. As you move through the corridor, Bryce's high-plateau silence and Capitol Reef's near-total solitude become their own practice — no studio required."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={6} label="wellness options">
                <ListItem onOpenSheet={openSheet('Wellness')} name={"Hillside Yoga at Flanigan's"} featured
                  url="https://flanigans.com/spa/"
                  detail={"Gentle yoga with sound bath on a terrace overlooking Zion. The vibration carries differently at this elevation. All levels welcome — come for the practice, stay for the view."}
                  note={"At Flanigan's Resort — check schedule for sound bath sessions"}
                  tags={["Sound Bath", "Canyon Views", "All Levels"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Zion Guru Skydeck Yoga" featured
                  url="https://www.zionguru.com/"
                  detail="Open-air deck with the Watchman as your backdrop. Morning sessions catch first light on the canyon walls."
                  tags={["Outdoor", "Morning", "All Levels"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Deep Canyon Spa" featured
                  url="https://flanigans.com/spa/"
                  detail={"Full-service spa inside Flanigan's Resort. Massages, body treatments, and facials after long trail days. The canyon's first spa, open since 1994."}
                  tags={["Full Spa", "Springdale", "Walk-In"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Open Sky Wellness Programs" featured
                  url="https://www.openskyzion.com/"
                  detail="Immersive yoga, meditation, and sound healing in an off-grid desert setting. Multi-day programs available."
                  tags={["Multi-Day", "Off-Grid", "Immersive"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Zion Canyon Hot Springs" featured
                  url="https://www.zioncanyonhotsprings.com/"
                  detail="32 geothermal hot springs, globally-inspired mineral pools, Finnish barrel saunas, and cold plunges in La Verkin — 30 minutes from the park. The 21+ Premier area has cocktails by the firepit and its own saunas. This is your post-hike recovery circuit."
                  tags={["Hot Springs", "Sauna", "Cold Plunge", "21+ Area"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="True North Float" featured
                  url="https://www.tnfloat.com/"
                  detail="Sensory deprivation float tanks, fire & ice suite (sauna + cold plunge), vibroacoustic therapy, and massage in St. George — 45 minutes from Zion. Founded by a wellness seeker who left corporate life. The real deal."
                  tags={["Float Tank", "Sauna", "Cold Plunge", "St. George"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Cable Mountain Spa"
                  url="https://cablemountainspa.com/"
                  detail="Full-service spa with sauna at the park entrance. Massage, facials, and body treatments. Walk-in friendly."
                  tags={["Full Spa", "Sauna", "Springdale"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Homebody Healing"
                  url="https://www.homebodyhealing.love/"
                  detail="Weekly yoga classes at Cable Mountain Spa — vinyasa, hatha, yin, restorative, breathwork, and meditation. Private somatic sessions available. A deeply rooted local teacher."
                  tags={["Yoga", "Breathwork", "Meditation", "Weekly Classes"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Cosmic Flow Yoga"
                  url="https://www.yogainzion.com/"
                  detail="Yoga, meditation, and sound healing with sessions across Springdale, Kanab, and St. George. Riverside location in Springdale next to the Virgin River. Private group sessions available."
                  tags={["Yoga", "Sound Healing", "Multiple Locations"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Zion Yogis"
                  url="https://www.zionyogis.com/"
                  detail="Outdoor yoga sessions in and around Zion National Park. Calming flow classes designed as the perfect cool-down after a day on the trails."
                  tags={["Yoga", "Outdoor", "Post-Hike"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Amangiri Spa" featured
                  url="https://www.aman.com/hotels/amangiri"
                  detail="Aman's desert spa draws from Navajo healing traditions. Flotation therapy, desert clay wraps, and a water pavilion carved into the mesa. A pilgrimage in itself — 90 minutes from Springdale at Canyon Point."
                  tags={["Ultra-Luxury", "Navajo Traditions", "Float", "Canyon Point"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Elite Float Spa"
                  detail="Southern Utah's first float spa in St. George. Floatation therapy, infrared sauna, and massage. Small family-owned operation with deep expertise."
                  note="St. George, UT — find them on Yelp or TripAdvisor"
                  tags={["Float Tank", "Infrared Sauna", "St. George"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Five Petals Spa at the Cliffrose"
                  url="https://www.cliffroselodge.com/"
                  detail="Riverfront spa steps from the park. Deep-tissue, hot stone, and custom facials."
                  tags={["Riverfront", "Hotel Spa"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Sunrise Meditation at Canyon Junction"
                  detail="Arrive before the shuttles. Sit at the Pine Creek bridge. Watch the walls ignite in silence. No teacher needed."
                  tags={["Free", "Early AM", "Solo", "Self-Guided"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Earthing on the Canyon Floor"
                  detail="Take your shoes off. Stand on the sandstone. Feel the warmth the rock has been collecting for 200 million years."
                  tags={["Free", "Grounding", "Self-Guided"]} />
                <ListItem onOpenSheet={openSheet('Wellness')} name="Journaling at the Virgin River"
                  detail={"Find a bench along the Pa'rus Trail. The sound of the river is its own kind of teacher."}
                  tags={["Free", "Contemplative", "Self-Guided"]} />
              </ExpandableList>
            </FadeIn>
          </section>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* AWAKEN                                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section id="light-sky" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="awaken" />
              <SectionLabel>Night Sky</SectionLabel>
              <SectionTitle>{"Light, sky & wonder"}</SectionTitle>
              <SectionSub>{"The moments that shift something inside you. Sunrise, starlight, the land at its most alive."}</SectionSub>
            </FadeIn>
            <FadeIn delay={0.08}>
              <ExpandableList initialCount={4} label="experiences">
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Stargazing from the Canyon Floor" featured
                  hasNPS={checkNPS("Stargazing")}
                  url="https://www.nps.gov/thingstodo/stargazing-in-zion.htm"
                  detail={"Zion is a certified International Dark Sky Park. On a moonless night, the Milky Way arcs directly overhead between the canyon walls. Bring a blanket, lie down, and give yourself an hour."}
                  tags={["Free", "Night", "Dark Sky Park"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Sunrise at the Watchman" featured
                  url="https://www.nps.gov/zion/planyourvisit/zion-canyon-trail-descriptions.htm"
                  detail="Get to the trailhead before first light. Watch the canyon walls ignite one layer at a time. Worth every minute of lost sleep."
                  tags={["3.3 mi RT", "Moderate", "Early AM"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Drive Historic Highway 12" featured
                  detail="One of America's most dramatic scenic byways. 124 miles from Bryce Canyon to Capitol Reef through red rock canyons, hogbacks with thousand-foot drops on both sides, and the high forests of Boulder Mountain. Don't rush it."
                  tags={["Scenic Drive", "Half Day", "Bryce to Capitol Reef"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="Drive the Mt. Carmel Tunnel" featured
                  detail="The 1.1-mile tunnel carved through sandstone in 1930. Emerge on the east side to a completely different landscape — checkerboard mesas, white slickrock, open sky."
                  tags={["Scenic Drive", "East Side", "Historic"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name="NPS Ranger Stargazing Program"
                  url="https://www.nps.gov/zion/planyourvisit/sunset-stargazing.htm"
                  detail="Free ranger-led night sky programs. Telescopes provided, no reservation needed. Check the park calendar for dates."
                  tags={["Free", "Ranger-Led", "Seasonal"]} />
                <ListItem onOpenSheet={openSheet('Light & Sky')} name={"Bryce Canyon Under Stars"}
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
          <section id="food-culture" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="connect" />
              <SectionLabel>Food & Culture</SectionLabel>
              <SectionTitle>{"Food, culture & community"}</SectionTitle>
              <SectionSub>{"The people and places that turn a visit into a memory. Where to eat, give back, honor the land, and linger."}</SectionSub>
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
                    onOpenSheet={openSheet('Food & Culture')}
                    cuisine={r.cuisine}
                    priceRange={r.priceRange}
                    reservations={r.reservations}
                    dietary={r.dietary}
                    energy={r.energy}
                  />
                ))}

                {/* ── Cultural Heritage & Service ──────────────────────── */}
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="Tribal Arts Zion"
                  detail="Native American art and jewelry sourced directly from tribal artists."
                  tags={["Native Art", "Jewelry", "Gallery"]} />
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="David J. West Gallery"
                  url="https://www.davidjwest.com/"
                  detail={"Fine art photography of the Southwest in light that makes you question whether you've ever really seen these places."}
                  tags={["Photography", "Fine Art"]} />
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="Springdale Farmers Market"
                  detail="Saturday mornings in season. Local produce, artisan goods."
                  tags={["Seasonal", "Saturday AM", "Local"]} />
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="Paiute Cultural Heritage" featured
                  url="https://pitu.gov/culture/"
                  detail={"The Southern Paiute called this land Mukuntuweap long before it was Zion. The Paiute Indian Tribe of Utah preserves language, oral history, and traditions through cultural programs and the annual Restoration Powwow in Cedar City each June."}
                  note="Paiute Indian Tribe of Utah — pitu.gov"
                  tags={["Indigenous Heritage", "Cultural", "Cedar City"]} />
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="Pipe Spring National Monument" featured
                  url="https://www.nps.gov/pisp/"
                  detail={"Jointly managed by NPS and the Kaibab Band of Paiutes. A desert oasis that tells the layered story of water, sovereignty, and survival — Native, pioneer, and ranching history in one place. The Kaibab Paiutes operate the visitor center."}
                  tags={["NPS Monument", "Indigenous History", "Day Trip"]} />
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="Zion Forever Project" featured
                  url="https://www.zionpark.org/"
                  detail={"The park's official nonprofit partner. Conservation volunteer days, trail restoration, hanging garden protection, and dark sky preservation. A way to give back to the land that gives so much."}
                  note="Volunteer opportunities available — zionpark.org"
                  tags={["Conservation", "Volunteer", "Nonprofit"]} />
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="Conserve Southwest Utah" featured
                  url="https://www.conserveswu.org/stewardship"
                  detail={"Hands-on desert habitat restoration at Red Cliffs NCA near St. George. Planting native shrubs, protecting threatened Mojave desert tortoise habitat, invasive species removal. Over 5,000 native plants restored since 2020."}
                  note="Regular volunteer days — 45 min from Zion"
                  tags={["Habitat Restoration", "Volunteer", "Desert Tortoise"]} />
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="Parowan Gap Petroglyphs"
                  detail={"A free, open-air gallery of ancient rock art attributed to the Fremont people, near Cedar City. Hundreds of petroglyphs etched into the canyon walls — a contemplative stop that asks nothing but attention."}
                  tags={["Free", "Ancient Rock Art", "Self-Guided", "Cedar City"]} />
                <ListItem onOpenSheet={openSheet('Food & Culture')} name="Fruita Orchards at Capitol Reef" location="Capitol Reef NP" featured
                  url="https://www.nps.gov/care/planyourvisit/fruita.htm"
                  detail="The park's historic orchard — apricot, cherry, peach, pear, apple — is still harvested by visitors in season. Walk in, pick fruit off the tree, pay by the pound. One of the most quietly extraordinary things you can do in any national park."
                  tags={["Free to Enter", "U-Pick", "In-Season", "Historic"]} />

                {/* ── Corridor Restaurants ──────────────────────── */}
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
          <section id="give-back" className="scroll-mt-[126px] py-11">
            <FadeIn>
              <SectionIcon type="threshold" />
              <SectionLabel>Give Back</SectionLabel>
              <SectionTitle>Leave it better than you found it.</SectionTitle>
              <SectionSub>Zion sits on ancestral Southern Paiute land. These organizations honor that, and the canyon itself.</SectionSub>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-2">
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Trail Stewardship</div>
                  <ListItem name="Zion Forever Project"
                    url="https://www.zionpark.org"
                    detail="The official nonprofit partner of Zion National Park, funding trail restoration, wildlife habitat protection, youth education, and night sky stewardship. Direct, local, and legitimate."
                    tags={["Donate", "Volunteer"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous Giving</div>
                  <ListItem name="Paiute Indian Tribe of Utah"
                    url="https://pitu.gov"
                    detail="Zion's canyon walls are named Mukuntuweap — a Paiute word. The tribe's cultural department works on language preservation, repatriation, and youth culture camps run in partnership with the NPS and Zion Forever Project. Supporting their programs is the most meaningful reciprocity you can offer this place."
                    tags={["Learn & Support"]} />
                </div>
                <div className="pt-4">
                  <div className="font-body text-[11px] font-bold tracking-[0.14em] uppercase text-[#7A857E] mb-0.5">Indigenous Land</div>
                  <ListItem name="Utah Diné Bikéyah"
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
          <section id="cta" className="scroll-mt-[126px] pt-14 pb-[72px] text-center">
            <FadeIn>
              <span className="font-body text-[12px] font-bold tracking-[0.28em] uppercase text-sky-blue block mb-4">Begin</span>
              <h3 className="font-serif text-[clamp(28px,5vw,42px)] font-light text-dark-ink mt-0 mb-2.5 leading-[1.2]">Your Zion trip starts here</h3>
              <p className="font-body text-[14px] font-normal text-[#4A5650] max-w-[460px] mx-auto mb-9 leading-[1.65]">
                Choose your path — build it yourself with our Trip Planner, or let us craft something personalized for you.
              </p>

              <Link to="/plan"
                className="inline-block py-3.5 px-9 bg-dark-ink text-white text-center font-body text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-opacity duration-200 no-underline border-none hover:opacity-85"
                onClick={() => trackEvent('guide_cta_clicked', { action: 'plan_a_trip', destination: 'zion' })}
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
                  { name: "Joshua Tree", slug: "joshua-tree", accent: C.goldenAmber },
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
      <WhisperBar destination="zion" label="Zion" />
      <Footer />
    </>
  );
}
