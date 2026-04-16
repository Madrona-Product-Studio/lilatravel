import { useRef, useState } from 'react';
import { C } from '@data/brand';
import { G } from '@data/guides/guide-styles';
import usePlacePhotos from '@hooks/usePlacePhotos';

function NPSArrowhead({ size = 14, color = "#2D5F2B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 22h3l5-11 5 11h3L12 2z" fill={color} opacity="0.85" />
      <circle cx="12" cy="16" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}

function StarRating({ rating }) {
  const full = Math.round(rating);
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= full ? C.goldenAmber : `${C.darkInk}20`, fontSize: 13 }}>★</span>
      ))}
    </span>
  );
}

function PhoneSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function DirectionsSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function GuideDetailSheet({ item, onClose, isMobile }) {
  const sheetRef = useRef(null);
  const dragStartY = useRef(null);
  const dragCurrentY = useRef(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Determine fetch conditions before hooks (hooks must run unconditionally)
  const nps = item?.nps;
  const isOrganization = !nps && !!item?.operator;
  const shouldFetchPlaces = !nps && !isOrganization && !!item;

  const places = usePlacePhotos(
    shouldFetchPlaces ? { name: item.name, location: item.location } : {}
  );

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
    elemental: { color: '#5a9e8a', label: "Elemental", bg: `${'#5a9e8a'}15` },
    rooted: { color: G.accent, label: "Rooted", bg: `${G.accent}12` },
    premium: { color: G.accentWarm, label: "Premium", bg: `${G.accentWarm}15` },
    luxury: { color: G.accent, label: "Luxury", bg: `${G.accent}15` },
  };

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

  const googlePhotos = places.photos || [];
  const heroPhoto = googlePhotos[activePhotoIdx] || googlePhotos[0];
  const mapsUrl = places.placeId ? `https://www.google.com/maps/place/?q=place_id:${places.placeId}` : null;

  const content = (
    <div className="max-w-[500px] mx-auto px-5 pt-[26px] pb-[60px]">
      {/* Badge row */}
      {item.type === 'stay' && item.tier && tierStyles[item.tier] && (
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-0.5"
            style={{ background: tierStyles[item.tier].bg, color: tierStyles[item.tier].color }}>{tierStyles[item.tier].label}</span>
          {item.location && (
            <span className="font-body text-[12px] font-medium text-[rgba(26,26,24,0.4)]">{item.location}</span>
          )}
        </div>
      )}
      {item.type === 'list' && item.section && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sky-blue mb-2.5 px-2.5 py-0.5"
          style={{ background: `${G.accent}15` }}>{item.section}</span>
      )}

      {/* Name */}
      <h3 className="font-serif text-[clamp(22px,4vw,28px)] font-normal text-dark-ink mb-2.5 leading-[1.2] mt-0">{item.name}</h3>

      {/* Lila Pick */}
      {item.featured && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sun-salmon mb-3.5 px-2.5 py-0.5"
          style={{ border: `1px solid ${G.accent}40` }}>Lila Pick</span>
      )}

      {/* ═══ GOOGLE PLACES PHOTOS (when no NPS) ═══ */}
      {!nps && googlePhotos.length > 0 && (
        <div className="mx-[-20px] mb-[18px] relative">
          <img
            src={heroPhoto}
            alt={item.name}
            className="w-full h-[220px] object-cover block"
            style={{ background: C.stone }}
          />
          {/* Dot indicators */}
          {googlePhotos.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {googlePhotos.slice(0, 6).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIdx(i)}
                  className="border-none cursor-pointer p-0"
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: i === activePhotoIdx ? 'white' : 'rgba(255,255,255,0.5)',
                    transition: 'background 0.2s',
                  }}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
          {/* Thumbnail strip */}
          {googlePhotos.length > 1 && (
            <div className="flex gap-[3px] px-5 mt-[3px] overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {googlePhotos.slice(0, 6).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="object-cover cursor-pointer"
                  style={{
                    width: 60, height: 42, opacity: i === activePhotoIdx ? 1 : 0.6,
                    transition: 'opacity 0.2s',
                  }}
                  onClick={() => setActivePhotoIdx(i)}
                />
              ))}
            </div>
          )}
          {/* Google attribution */}
          <div className="font-body text-[10px] font-normal text-[rgba(26,26,24,0.35)] text-right px-5 mt-1">
            Powered by Google
          </div>
        </div>
      )}

      {/* ═══ GOOGLE PLACES RATING ═══ */}
      {!nps && places.rating && (
        <div className="flex items-center gap-2 mb-3.5">
          <StarRating rating={places.rating} />
          <span className="font-body text-[13px] font-medium text-dark-ink">{places.rating}</span>
          {places.userRatingsTotal && (
            <span className="font-body text-[12px] font-normal text-[rgba(26,26,24,0.4)]">
              · {places.userRatingsTotal.toLocaleString()} reviews
            </span>
          )}
        </div>
      )}

      {/* ═══ CTA ROW ═══ */}
      {!nps && (item.url || places.phone || mapsUrl) && (
        <div className="flex gap-2 mb-[18px]">
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 font-body text-[11px] font-bold tracking-[0.14em] uppercase no-underline transition-opacity duration-200"
              style={{ background: C.darkInk, color: C.warmWhite }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >{isOrganization && item.operator ? item.operator : 'Visit Website'} <span className="text-[12px]">↗</span></a>
          )}
          {!isOrganization && places.phone && (
            <a href={`tel:${places.phone}`}
              className="flex items-center justify-center no-underline transition-opacity duration-200"
              style={{ width: 42, height: 42, border: `1.5px solid ${G.accent}`, color: G.accent }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              aria-label="Call"
            ><PhoneSVG /></a>
          )}
          {!isOrganization && mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center no-underline transition-opacity duration-200"
              style={{ width: 42, height: 42, border: `1.5px solid ${G.accent}`, color: G.accent }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              aria-label="Directions"
            ><DirectionsSVG /></a>
          )}
        </div>
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
                <div className="font-body text-[11px] font-normal text-[rgba(26,26,24,0.4)] leading-[1.5] px-5 py-1.5">
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
              <p className="font-body text-[14px] font-normal text-[rgba(26,26,24,0.5)] leading-[1.75] m-0">{stripHTML(nps.longDescription || nps.shortDescription)}</p>
            </div>
          )}

          {/* NPS Info Grid */}
          {npsInfoRows.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-5 py-3.5 border-y border-[rgba(107,128,120,0.12)]">
              {npsInfoRows.map((row, i) => (
                <div key={i} className={row.label === 'Location' ? 'col-span-full' : ''}>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">{row.label}</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{row.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* NPS Trail Accessibility */}
          {nps.accessibilityInformation && (() => {
            const html = nps.accessibilityInformation;
            const clean = (s) => s.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\xa0/g, ' ').replace(/<[^>]*>/g, '').trim();

            const liMatches = html.match(/<li>([\s\S]*?)<\/li>/gi);
            if (!liMatches || liMatches.length === 0) {
              const text = clean(html);
              if (!text) return null;
              return (
                <div className="mb-5">
                  <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[rgba(26,26,24,0.4)] mb-2">Accessibility</div>
                  <p className="font-body text-[13px] font-normal text-[rgba(26,26,24,0.5)] leading-[1.6] m-0">{text}</p>
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
                <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[rgba(26,26,24,0.4)] mb-2.5">Trail Accessibility</div>
                <div className="border border-[rgba(107,128,120,0.12)]" style={{ background: `${G.border}18` }}>
                  {rows.map((row, i) => (
                    <div key={i} className="py-[9px] px-3.5 border-b border-[rgba(107,128,120,0.12)]">
                      {row.label && (
                        <div className="font-body text-[11px] font-bold text-dark-ink mb-[3px]">{row.label}</div>
                      )}
                      {row.values.map((val, j) => (
                        <div key={j} className="font-body text-[12px] font-normal text-[rgba(26,26,24,0.5)] leading-[1.6]">{val}</div>
                      ))}
                    </div>
                  ))}
                  {footnote && (
                    <div className="font-body text-[11px] font-normal italic text-[rgba(26,26,24,0.4)] leading-[1.5] py-2 px-3.5">{footnote}</div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Lila's Take */}
          {(item.detail || item.note) && (
            <div className="py-3.5 px-4 mb-[18px]"
              style={{ background: `${G.accentWarm}08`, borderLeft: `3px solid ${G.accentWarm}40` }}>
              <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-golden-amber mb-2">Our Take</div>
              {item.detail && (
                <p className="font-body text-[14px] font-normal text-[rgba(26,26,24,0.5)] leading-[1.7] mt-0 mb-1.5">{item.detail}</p>
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
                <span key={i} className="font-body text-[12px] font-semibold text-[rgba(26,26,24,0.4)] py-[3px] px-2.5"
                  style={{ background: C.stone + '60' }}>{t}</span>
              ))}
            </div>
          )}

          {/* Outfitter / operator website (for guided NPS activities) */}
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-2.5 px-5 font-body text-[12px] font-bold tracking-[0.16em] uppercase no-underline transition-all duration-[250ms]"
              style={{ background: C.darkInk, color: C.warmWhite }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >{item.operator ? item.operator : 'Visit Website'} <span className="text-[13px]">↗</span></a>
          )}
        </>
      )}

      {/* ═══ STANDARD CONTENT (no NPS) ═══ */}
      {!nps && (
        <>
          {/* Notes from Lila */}
          {(item.detail || item.highlights?.length > 0) && (
            <div className="py-3.5 px-4 mb-[18px]" style={{ background: '#E8E0D5' }}>
              <div className="font-body text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: C.goldenAmber }}>
                ◈ Notes from Lila
              </div>
              {item.detail && (
                <p className="font-body text-[13px] font-normal text-[rgba(26,26,24,0.6)] leading-[1.7] mt-0 mb-1.5">{item.detail}</p>
              )}
              {item.highlights && item.highlights.length > 0 && (
                <div className="mt-2">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex gap-2.5 items-start mb-[5px]">
                      <div className="w-1 h-1 rounded-full mt-[7px] shrink-0" style={{ background: C.goldenAmber, opacity: 0.6 }} />
                      <span className="font-body text-[13px] font-normal text-[rgba(26,26,24,0.55)] leading-[1.65]">{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {item.note && (
            <div className="font-body text-[13px] font-semibold text-ocean-teal mb-3.5">{item.note}</div>
          )}

          {/* Activity info grid */}
          {item.type === 'tier' && (item.difficulty || item.duration || item.distance || item.operator || item.bookingWindow || item.tradition || item.priceRange) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-[18px] py-3.5 border-y border-[rgba(107,128,120,0.12)]">
              {item.difficulty && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Difficulty</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.difficulty}</div>
                </div>
              )}
              {item.distance && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Distance</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.distance}</div>
                </div>
              )}
              {item.duration && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Duration</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.duration}</div>
                </div>
              )}
              {item.tradition && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Tradition</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.tradition}</div>
                </div>
              )}
              {item.operator && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Operator</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.operator}</div>
                </div>
              )}
              {item.priceRange && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Price</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.priceRange}</div>
                </div>
              )}
              {item.bookingWindow && (
                <div className="col-span-full">
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Booking</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.bookingWindow}</div>
                </div>
              )}
              {item.location && (
                <div className="col-span-full">
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Location</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.location}</div>
                </div>
              )}
            </div>
          )}

          {/* Restaurant info grid */}
          {item.type === 'list' && (item.cuisine || item.priceRange || item.reservations || item.energy || item.difficulty || item.duration || item.distance) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-[18px] py-3.5 border-y border-[rgba(107,128,120,0.12)]">
              {item.cuisine && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Cuisine</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.cuisine}</div>
                </div>
              )}
              {item.difficulty && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Difficulty</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.difficulty}</div>
                </div>
              )}
              {item.distance && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Distance</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.distance}</div>
                </div>
              )}
              {item.duration && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Duration</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.duration}</div>
                </div>
              )}
              {item.priceRange && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Price</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.priceRange}</div>
                </div>
              )}
              {item.energy && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Vibe</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.energy}</div>
                </div>
              )}
              {item.reservations && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Reservations</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.reservations}</div>
                </div>
              )}
              {item.operator && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Operator</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.operator}</div>
                </div>
              )}
              {item.bookingWindow && (
                <div className="col-span-full">
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Booking</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.bookingWindow}</div>
                </div>
              )}
              {item.location && (
                <div className="col-span-full">
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Location</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.location}</div>
                </div>
              )}
              {item.dietary && (item.dietary.vegetarian || item.dietary.vegan || item.dietary.glutenFree) && (
                <div className="col-span-full">
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Dietary</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {item.dietary.vegetarian && <span className="font-body text-[11px] font-semibold text-sea-glass px-2 py-0.5" style={{ background: `${'#5a9e8a'}15` }}>vegetarian</span>}
                    {item.dietary.vegan && <span className="font-body text-[11px] font-semibold text-sea-glass px-2 py-0.5" style={{ background: `${'#5a9e8a'}15` }}>vegan</span>}
                    {item.dietary.glutenFree && <span className="font-body text-[11px] font-semibold text-sea-glass px-2 py-0.5" style={{ background: `${'#5a9e8a'}15` }}>gluten-free</span>}
                  </div>
                  {item.dietary.notes && <div className="font-body text-[12px] font-normal text-[rgba(26,26,24,0.4)] mt-1 leading-[1.5]">{item.dietary.notes}</div>}
                </div>
              )}
            </div>
          )}

          {/* Accommodation info grid */}
          {item.type === 'stay' && (item.priceRange || item.bookingWindow || item.seasonalNotes || item.groupFit) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-[18px] py-3.5 border-y border-[rgba(107,128,120,0.12)]">
              {item.priceRange && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Price Range</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.priceRange}</div>
                </div>
              )}
              {item.groupFit && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Good For</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.groupFit.join(', ')}</div>
                </div>
              )}
              {item.bookingWindow && (
                <div className="col-span-full">
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Booking</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.bookingWindow}</div>
                </div>
              )}
              {item.seasonalNotes && (
                <div className="col-span-full">
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-[3px]">Season</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink leading-[1.5]">{item.seasonalNotes}</div>
                </div>
              )}
            </div>
          )}

          {/* Amenities */}
          {item.type === 'stay' && item.amenities && item.amenities.length > 0 && (
            <div className="mb-[18px]">
              <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.4)] mb-2">Amenities</div>
              <div className="flex gap-1.5 flex-wrap">
                {item.amenities.map((a, i) => (
                  <span key={i} className="font-body text-[12px] font-semibold text-ocean-teal py-[3px] px-2.5" style={{ background: `${G.accent}10` }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-5">
              {item.tags.map((t, i) => (
                <span key={i} className="font-body text-[12px] font-semibold text-[rgba(26,26,24,0.4)] py-[3px] px-2.5"
                  style={{ background: C.stone + '60' }}>{t}</span>
              ))}
            </div>
          )}
        </>
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
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer font-body text-[15px] text-[rgba(26,26,24,0.4)] leading-none" style={{ background: `${G.panel}e0`, border: `1px solid ${G.border}15`, WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 8px ${G.ink}08` }} aria-label="Close">✕</button>
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
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-2 right-3.5 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer font-body text-[15px] text-[rgba(26,26,24,0.4)] leading-none" style={{ background: `${G.panel}e0`, border: `1px solid #7A857E15`, WebkitTapHighlightColor: 'transparent', boxShadow: `0 2px 8px ${G.ink}08` }} aria-label="Close">✕</button>
        </div>
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {content}
        </div>
      </div>
    </>
  );
}

export default GuideDetailSheet;
