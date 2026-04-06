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
import { SectionLabel, SectionTitle, SectionSub, Divider, SectionIcon, TierItem, TierLegend, TierFilter } from '@components/guide';
import { C } from '@data/brand';
import { P } from '@data/photos';
import { trackEvent } from '@utils/analytics';
import { CelestialDrawer } from '@components';
import { getNPSData, buildNPSLookup, findNPSMatch } from '@services/npsService';
import { Helmet } from 'react-helmet-async';
import accommodations from '../../data/accommodations/zion.json';
import restaurants from '../../data/restaurants/zion-eat.json';
import experiences from '../../data/restaurants/zion-experience.json';
import breatheItems from '../../data/restaurants/zion-breathe.json';
import moveItems from '../../data/restaurants/zion-move.json';
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

function CollapsibleSection({ id, label, title, teaser, isOpen, onToggle, children }) {
  const bodyRef = useRef(null);

  return (
    <section id={id} className="scroll-mt-[126px]">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-6 bg-transparent border-none cursor-pointer text-left group"
      >
        <div className="flex-1 min-w-0">
          <div className="font-body text-[10px] font-bold tracking-[0.22em] uppercase text-[#7A857E] mb-1">{label}</div>
          <div className="font-serif text-[clamp(20px,3vw,26px)] font-light text-dark-ink leading-[1.2]">{title}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-body text-[12px] text-[#7A857E] whitespace-nowrap">{teaser}</span>
          <span className="inline-block text-[12px] text-[#7A857E] transition-transform duration-300 ease-in-out"
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
            <div className="font-body text-[13px] font-semibold text-ocean-teal mb-3.5">{item.note}</div>
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

function ParkCard({ park }) {
  const DESIGNATION_LABELS = {
    "us-national-park": "National Park",
    "canadian-national-park": "National Park Reserve",
    "state-park": "State Park",
    "provincial-park": "Provincial Park",
    "national-forest": "National Forest",
    "state-wilderness": "State Wilderness Preserve",
  };
  const NPS_CODES = { zion: "zion", bryce: "brca", "capitol-reef": "care" };
  const npsCode = NPS_CODES[park.id] || null;
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
      {npsCode && (
        <a href={`https://www.nps.gov/${npsCode}/`} target="_blank" rel="noopener noreferrer"
          className="inline-block mt-3 font-body text-[10px] font-bold tracking-[0.12em] uppercase no-underline"
          style={{ color: C.goldenAmber, borderBottom: `1px solid rgba(212,168,83,0.3)` }}>
          nps.gov/{npsCode} ↗
        </a>
      )}
    </div>
  );
}

// ─── Wildlife Drawer ────────────────────────────────────────────────────────

function WildlifeSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: `${C.darkInk}0A` }}>
      {WILDLIFE_GROUPS.flatMap(g => g.entries).slice(0, 8).map(entry => (
        <div key={entry.name} style={{ background: C.warmWhite }} className="p-4 md:p-5">
          <div className="font-serif text-[17px] font-normal text-dark-ink leading-[1.3] mb-1">{entry.name}</div>
          <div className="font-body text-[9px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: C.oceanTeal }}>
            {entry.season} · {entry.parks.join(", ")}
          </div>
          <p className="font-body text-[12px] font-normal text-[#7A857E] leading-[1.5] m-0">{entry.detail}</p>
        </div>
      ))}
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

const TOWNS = [
  {
    name: "Springdale",
    context: "Zion's Front Door",
    description: "A single-street town pressed against the canyon mouth. Walk to the park entrance. Restaurants, gear shops, and galleries line the half-mile stretch — all of it sandstone red and cottonwood green.",
    accent: C.sunSalmon,
  },
  {
    name: "Kanab",
    context: "Film-Set Desert Town",
    description: "An hour south of Zion on the Utah–Arizona line. Old Western film sets, a growing food scene, and the staging point for permits to The Wave, White Pocket, and Buckskin Gulch.",
    accent: C.goldenAmber,
  },
  {
    name: "Escalante",
    context: "Trailhead Town",
    description: "A one-stoplight town on Scenic Byway 12 that punches above its weight. Slot canyons, petrified forests, and the kind of solitude that the main parks can't offer. Stock up here — services are sparse beyond.",
    accent: C.oceanTeal,
  },
  {
    name: "Torrey",
    context: "Capitol Reef Gateway",
    description: "A handful of buildings at the edge of the Waterpocket Fold. The nearest services to Capitol Reef. Rim Rock Inn and the Torrey Schoolhouse serve as base camp for the park. The orchards start just down the road.",
    accent: C.seaGlass,
  },
];

const HIGHLIGHTS = [
  {
    name: "The Narrows",
    category: "Canyon · Water",
    blurb: "Wade the Virgin River through slot canyon walls 2,000 ft tall. Some sections are shoulder-width. The light is unlike anywhere else on earth.",
  },
  {
    name: "Angels Landing",
    category: "Summit · Exposure",
    blurb: "The final half-mile is chains bolted to rock with 1,000 ft of air on both sides. Permit required. Unforgettable in the way that changes your baseline.",
  },
  {
    name: "The Subway",
    category: "Slot Canyon · Permit",
    blurb: "Left Fork of North Creek forms a perfect cylindrical tunnel. Swimming holes, log jams, emerald pools. One of the park's true hidden chambers.",
  },
  {
    name: "Kolob Arch",
    category: "Backcountry · Arch",
    blurb: "One of the world's largest free-standing arches at 287 ft. Most visitors never see it. 14-mile round trip into Kolob Canyons — a completely different Zion.",
  },
  {
    name: "Canyon Overlook",
    category: "Viewpoint · Easy Access",
    blurb: "A one-mile round trip that delivers an outsized reward — Pine Creek Canyon spread below, the Great Arch to your left. Best at sunrise before the shuttle crowds arrive.",
  },
  {
    name: "Zion–Mt. Carmel Highway",
    category: "Drive · Checkerboard Mesa",
    blurb: "The switchbacks alone are worth it. The tunnel emerges onto slickrock benches of the Colorado Plateau — a completely different landscape. Easy to rush through. Don't.",
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

// ─── Move / Breathe Tier Styles ─────────────────────────────────────────────

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
    if (onOpenSection) onOpenSection(id);
  }, [isMobile, onOpenSection]);

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
      <GuideNav isMobile={isMobile} onOpenSection={openSection} />

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
          <section id="sense-of-place" className="scroll-mt-[126px] pt-11 pb-4">
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
              <div>
                <div className="h-px" style={{ background: `${C.darkInk}14` }} />
                <div className="grid grid-cols-2 md:grid-cols-4 py-5">
                  {[
                    { l: "Recommended", v: "4–7 days" },
                    { l: "Nearest Airport", v: "Las Vegas (LAS)" },
                    { l: "Drive from LAS", v: "~2.5 hours" },
                    { l: "Best Times", v: "Mar–May, Sep–Nov" },
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
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: C.sunSalmon }}>The Parks</p>
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
                {TOWNS.map(town => (
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
                {HIGHLIGHTS.map(h => (
                  <div key={h.name} style={{ background: C.warmWhite }} className="p-4 md:p-5">
                    <div className="font-body text-[11px] font-semibold mb-1" style={{ color: C.goldenAmber }}>◈</div>
                    <div className="font-serif text-[17px] font-normal text-dark-ink leading-[1.3] mb-1">{h.name}</div>
                    <div className="font-body text-[9px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: '#7A857E' }}>{h.category}</div>
                    <p className="font-body text-[12px] font-normal text-[#7A857E] leading-[1.5] m-0">{h.blurb}</p>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* ── Divider ── */}
            <div className="h-px my-10" style={{ background: `${C.darkInk}14` }} />

            {/* ── The Living Corridor ── */}
            <FadeIn delay={0.12}>
              <p className="font-body text-[10px] font-bold tracking-[0.18em] uppercase mb-3.5" style={{ color: C.seaGlass }}>The Living Corridor</p>
              <WildlifeSection />
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
          <CollapsibleSection
            id="where-to-stay"
            label="Sleep"
            title="Where to sleep"
            teaser={(() => {
              const filtered = accommodations.filter(a => activeSleepTiers.has(a.stayStyle)).length;
              const total = accommodations.length;
              return filtered < total ? `${filtered} of ${total} options` : `${total} options`;
            })()}
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

              {accommodations.filter(a => a.corridor && activeSleepTiers.has(a.stayStyle)).length > 0 && (
                <>
                  <p className="font-body text-[13px] font-semibold tracking-[0.08em] uppercase text-warm-gray mt-8 mb-3">
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
          </CollapsibleSection>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* MOVE                                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <CollapsibleSection
            id="move"
            label="Move"
            title="How to get into the landscape"
            teaser={(() => {
              const filtered = moveItems.filter(item => activeMoveTiers.has(item.moveTier)).length;
              const total = moveItems.length;
              return filtered < total ? `${filtered} of ${total} activities` : `${total} activities`;
            })()}
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
                    light={item.type === 'climb'}
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
          <CollapsibleSection
            id="wellness"
            label="Breathe"
            title="Yoga, thermal waters & integration"
            teaser={(() => {
              const filtered = breatheItems.filter(item => activeBreatheTiers.has(item.breatheTier)).length;
              const total = breatheItems.length;
              return filtered < total ? `${filtered} of ${total} options` : `${total} options`;
            })()}
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

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* AWAKEN                                                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <CollapsibleSection
            id="light-sky"
            label="Night Sky"
            title="Light, sky & wonder"
            teaser="Bortle Class 2 — best Sept–Nov"
            isOpen={!collapsedSections['light-sky']}
            onToggle={() => toggleSection('light-sky')}
          >
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
          </CollapsibleSection>


          <Divider />

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* EAT                                                           */}
          {/* ══════════════════════════════════════════════════════════════ */}
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
          </CollapsibleSection>


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
