import { useRef } from 'react';
import { C } from '@data/brand';

function NPSArrowhead({ size = 14, color = "#2D5F2B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 22h3l5-11 5 11h3L12 2z" fill={color} opacity="0.85" />
      <circle cx="12" cy="16" r="2.5" fill={color} opacity="0.6" />
    </svg>
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

export default GuideDetailSheet;
