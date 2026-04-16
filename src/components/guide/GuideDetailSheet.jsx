import { useRef, useState, useEffect } from 'react';
import { C, FONTS } from '@data/brand';
import { G } from '@data/guides/guide-styles';
import usePlacePhotos from '@hooks/usePlacePhotos';
import useWildlifeData from '@hooks/useWildlifeData';

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

  // Photo swipe refs
  const photoTouchStartX = useRef(null);
  const photoTouchStartY = useRef(null);
  const photoSwiping = useRef(false);

  // Reset photo index when item changes
  useEffect(() => { setActivePhotoIdx(0); }, [item?.name]);

  // Determine fetch conditions before hooks (hooks must run unconditionally)
  const nps = item?.nps;
  const isWildlife = item?.type === 'wildlife';
  const isOrganization = !nps && !isWildlife && !!item?.operator;
  const shouldFetchPlaces = !nps && !isOrganization && !isWildlife && !!item;

  const places = usePlacePhotos(
    shouldFetchPlaces ? { name: item.name, location: item.location } : {}
  );

  const wildlife = useWildlifeData(
    isWildlife && item ? { name: item.name, lat: item.lat, lng: item.lng } : {}
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
    <div className="max-w-[500px] mx-auto px-5 pt-5 pb-10">
      {/* Badge */}
      {item.type === 'stay' && item.tier && tierStyles[item.tier] && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-0.5 mb-1.5"
          style={{ background: tierStyles[item.tier].bg, color: tierStyles[item.tier].color }}>{tierStyles[item.tier].label}</span>
      )}
      {item.type === 'list' && item.section && (
        <span className="inline-block font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sky-blue mb-1.5 px-2.5 py-0.5"
          style={{ background: `${G.accent}15` }}>{item.section}</span>
      )}

      {/* Name + Lila Pick inline */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: item.featured ? 10 : 6 }}>
        <h3 className="font-serif text-[clamp(20px,4vw,26px)] font-normal text-dark-ink leading-[1.2]" style={{ margin: 0 }}>{item.name}</h3>
        {item.featured && (
          <span className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-sun-salmon px-2.5 py-0.5"
            style={{ border: `1px solid ${G.accent}40`, flexShrink: 0, whiteSpace: 'nowrap' }}>Lila Pick</span>
        )}
      </div>

      {/* ═══ GOOGLE PLACES PHOTO (when no NPS) ═══ */}
      {!nps && shouldFetchPlaces && (places.loading || googlePhotos.length > 0) && (
        <div
          className="mx-[-20px] mb-3 relative overflow-hidden"
          style={{ height: 260, background: C.stone, touchAction: 'pan-y' }}
          onTouchStart={e => {
            photoTouchStartX.current = e.touches[0].clientX;
            photoTouchStartY.current = e.touches[0].clientY;
            photoSwiping.current = false;
          }}
          onTouchMove={e => {
            if (photoTouchStartX.current === null) return;
            const dx = Math.abs(e.touches[0].clientX - photoTouchStartX.current);
            const dy = Math.abs(e.touches[0].clientY - photoTouchStartY.current);
            if (dx > dy && dx > 10) photoSwiping.current = true;
          }}
          onTouchEnd={e => {
            if (photoTouchStartX.current === null || !photoSwiping.current) {
              photoTouchStartX.current = null;
              return;
            }
            const dx = e.changedTouches[0].clientX - photoTouchStartX.current;
            const maxIdx = Math.min(googlePhotos.length, 6) - 1;
            if (dx < -50 && activePhotoIdx < maxIdx) setActivePhotoIdx(prev => prev + 1);
            if (dx > 50 && activePhotoIdx > 0) setActivePhotoIdx(prev => prev - 1);
            photoTouchStartX.current = null;
            photoSwiping.current = false;
          }}
        >
          {places.loading && !heroPhoto && (
            <>
              <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
              <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`, animation: 'shimmer 1.5s infinite' }} />
            </>
          )}
          {heroPhoto && (
            <img
              src={heroPhoto}
              alt={item.name}
              className="w-full h-[260px] object-cover block"
              style={{ animation: 'fadeIn 0.3s ease' }}
            />
          )}
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
          {/* Left/right arrows */}
          {googlePhotos.length > 1 && activePhotoIdx > 0 && (
            <button
              onClick={() => setActivePhotoIdx(prev => prev - 1)}
              aria-label="Previous photo"
              style={{
                position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: 0,
                cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0,
              }}
            >&#8249;</button>
          )}
          {googlePhotos.length > 1 && activePhotoIdx < Math.min(googlePhotos.length, 6) - 1 && (
            <button
              onClick={() => setActivePhotoIdx(prev => prev + 1)}
              aria-label="Next photo"
              style={{
                position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
                width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: 0,
                cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0,
              }}
            >&#8250;</button>
          )}
          {googlePhotos.length > 1 && (
            <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
              {googlePhotos.slice(0, 6).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIdx(i)}
                  className="border-none cursor-pointer p-0"
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: i === activePhotoIdx ? 'white' : 'rgba(255,255,255,0.5)',
                    transition: 'background 0.2s',
                  }}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ RATING + CTA (compact row) ═══ */}
      {!nps && (places.rating || item.cuisine) && (
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {places.rating && (
            <>
              <span className="font-body text-[13px] font-semibold text-dark-ink">{places.rating}</span>
              <StarRating rating={places.rating} />
              {places.userRatingsTotal && (
                <span className="font-body text-[12px] font-normal text-[rgba(26,26,24,0.35)]">
                  ({places.userRatingsTotal.toLocaleString()})
                </span>
              )}
            </>
          )}
          {places.rating && item.cuisine && <span className="font-body text-[12px] text-[rgba(26,26,24,0.25)]">·</span>}
          {item.cuisine && (
            <span className="font-body text-[12px] font-normal text-[rgba(26,26,24,0.45)]">{item.cuisine}</span>
          )}
        </div>
      )}

      {/* Hours line */}
      {!nps && item.hours && (
        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: C.oceanTeal, marginBottom: 10 }}>{item.hours}</div>
      )}

      {!nps && (item.url || places.phone || mapsUrl) && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', color: C.darkInk, border: `1.5px solid ${C.darkInk}`, transition: 'opacity 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              {isOrganization && item.operator ? item.operator : 'Website'}
            </a>
          )}
          {places.phone && (
            <a href={`tel:${places.phone}`}
              style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', border: `1.5px solid ${C.darkInk}20`, color: C.darkInk, transition: 'opacity 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              aria-label="Call"
            ><PhoneSVG /></a>
          )}
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', border: `1.5px solid ${C.darkInk}20`, color: C.darkInk, transition: 'opacity 0.2s' }}
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
                className="w-full h-[260px] object-cover block"
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

      {/* ═══ WILDLIFE CONTENT ═══ */}
      {isWildlife && (
        <>
          {/* iNaturalist photo */}
          {(wildlife.loading || wildlife.photo) && (
            <div className="mx-[-20px] mb-3 relative overflow-hidden" style={{ height: 260, background: C.stone }}>
              {wildlife.loading && !wildlife.photo && (
                <>
                  <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
                  <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)`, animation: 'shimmer 1.5s infinite' }} />
                </>
              )}
              {wildlife.photo && (
                <img src={wildlife.photo} alt={item.name} className="w-full h-[260px] object-cover block" style={{ animation: 'fadeIn 0.3s ease', objectPosition: 'center top' }} />
              )}
              <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
              {wildlife.photoAttribution && (
                <div style={{ fontFamily: FONTS.body, fontSize: 9, color: 'rgba(26,26,24,0.35)', textAlign: 'right', padding: '4px 20px 0' }}>{wildlife.photoAttribution}</div>
              )}
            </div>
          )}

          {/* Scientific name */}
          {wildlife.scientificName && (
            <div style={{ fontFamily: FONTS.serif, fontSize: 16, fontWeight: 300, fontStyle: 'italic', color: '#777', marginBottom: 8 }}>
              {wildlife.scientificName}
            </div>
          )}

          {/* Our editorial description */}
          {item.detail && (
            <div style={{ background: '#E8E0D5', padding: '12px 16px', marginBottom: 12 }}>
              <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, color: '#666', lineHeight: 1.55, margin: 0 }}>{item.detail}</p>
            </div>
          )}

          {/* Info grid: season, parks, observations, conservation */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 py-3 border-y border-[rgba(107,128,120,0.1)]">
            {item.season && (
              <div>
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,26,24,0.35)', marginBottom: 2 }}>Season</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: C.darkInk }}>{item.season}</div>
              </div>
            )}
            {wildlife.iconicTaxon && (
              <div>
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,26,24,0.35)', marginBottom: 2 }}>Type</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: C.darkInk }}>{wildlife.iconicTaxon}</div>
              </div>
            )}
            {item.parks && item.parks.length > 0 && (
              <div className="col-span-full">
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,26,24,0.35)', marginBottom: 2 }}>Where to Spot</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: C.darkInk }}>{item.parks.join(', ')}</div>
              </div>
            )}
            {wildlife.conservationStatus && (
              <div className="col-span-full">
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,26,24,0.35)', marginBottom: 2 }}>Conservation</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: C.darkInk }}>
                  {wildlife.conservationStatus.statusName} <span style={{ fontSize: 11, color: '#999' }}>— {wildlife.conservationStatus.authority}</span>
                </div>
              </div>
            )}
            {wildlife.localObservations != null && (
              <div>
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,26,24,0.35)', marginBottom: 2 }}>Nearby Sightings</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: C.darkInk }}>{wildlife.localObservations.toLocaleString()}</div>
              </div>
            )}
            {wildlife.observationCount != null && (
              <div>
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,26,24,0.35)', marginBottom: 2 }}>Global Observations</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: C.darkInk }}>{wildlife.observationCount.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* Wikipedia summary */}
          {wildlife.wikipediaSummary && (
            <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, color: '#777', lineHeight: 1.6, margin: '0 0 16px' }}>
              {wildlife.wikipediaSummary}
            </p>
          )}

          {/* CTA links */}
          <div style={{ display: 'flex', gap: 8 }}>
            {wildlife.inatUrl && (
              <a href={wildlife.inatUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: C.darkInk, border: `1.5px solid ${C.darkInk}`, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'opacity 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >iNaturalist ↗</a>
            )}
            {wildlife.wikipediaUrl && (
              <a href={wildlife.wikipediaUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', color: C.oceanTeal, border: `1.5px solid ${C.oceanTeal}40`, padding: '8px 16px', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'opacity 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >Wikipedia ↗</a>
            )}
          </div>
        </>
      )}

      {/* ═══ STANDARD CONTENT (no NPS, no wildlife) ═══ */}
      {!nps && !isWildlife && (
        <>
          {/* ◈ Vibe block */}
          {(item.energy || item.detail) && (
            <div style={{ background: '#E8E0D5', padding: '12px 16px', marginBottom: 12 }}>
              <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.goldenAmber, marginBottom: 6 }}>
                ◈ Vibe
              </div>
              {item.energy && (
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 300, fontStyle: 'italic', color: '#555', lineHeight: 1.3, marginBottom: item.detail ? 6 : 0 }}>
                  {item.energy}
                </div>
              )}
              {item.detail && (
                <p style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 400, color: '#666', lineHeight: 1.55, margin: 0 }}>{item.detail}</p>
              )}
            </div>
          )}

          {/* Compact info grid — universal for all non-NPS items */}
          {(item.priceRange || item.reservations || item.difficulty || item.duration || item.distance || item.operator || item.bookingWindow) && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 py-3 border-y border-[rgba(107,128,120,0.1)]">
              {item.priceRange && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.35)] mb-[2px]">Price</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink">{item.priceRange}</div>
                </div>
              )}
              {item.reservations && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.35)] mb-[2px]">Reservations</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink">{item.reservations}</div>
                </div>
              )}
              {item.difficulty && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.35)] mb-[2px]">Difficulty</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink">{item.difficulty}</div>
                </div>
              )}
              {item.distance && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.35)] mb-[2px]">Distance</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink">{item.distance}</div>
                </div>
              )}
              {item.duration && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.35)] mb-[2px]">Duration</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink">{item.duration}</div>
                </div>
              )}
              {item.operator && (
                <div>
                  <div className="font-body text-[10px] font-bold tracking-[0.18em] uppercase text-[rgba(26,26,24,0.35)] mb-[2px]">Operator</div>
                  <div className="font-body text-[13px] font-medium text-dark-ink">{item.operator}</div>
                </div>
              )}
            </div>
          )}

          {/* Dietary pills */}
          {item.dietary && (() => {
            const pills = [];
            if (item.dietary.vegetarian) pills.push('vegetarian-friendly');
            if (item.dietary.vegan) pills.push('vegan');
            if (item.dietary.glutenFree) pills.push('gluten-free');
            if (!pills.length) return null;
            return (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', marginBottom: 6 }}>Dietary</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {pills.map((p, i) => (
                    <span key={i} style={{ fontFamily: FONTS.body, fontSize: 11, color: C.oceanTeal, border: `0.5px solid ${C.oceanTeal}`, padding: '3px 10px' }}>{p}</span>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Tags row */}
          {item.tags && item.tags.length > 0 && (
            <>
              <div style={{ height: '0.5px', background: '#ddd', marginBottom: 10 }} />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {item.tags.map((t, i) => (
                  <span key={i} style={{ fontFamily: FONTS.body, fontSize: 11, color: '#666', border: '0.5px solid #bbb', padding: '4px 10px' }}>{t}</span>
                ))}
              </div>
            </>
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
      <div ref={sheetRef} className="fixed bottom-0 left-0 right-0 z-[250] bg-cream rounded-t-2xl flex flex-col" style={{ height: isWildlife ? '96vh' : '92vh', animation: 'guideSheetSlideUp 0.3s ease', boxShadow: '0 -4px 24px rgba(0,0,0,0.1)' }}>
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
