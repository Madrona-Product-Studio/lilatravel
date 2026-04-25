import { C } from '@data/brand';

function NPSArrowhead({ size = 14, color = "#2D5F2B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 22h3l5-11 5 11h3L12 2z" fill={color} opacity="0.85" />
      <circle cx="12" cy="16" r="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}

/**
 * TierItem — reusable tier-tagged card for Breathe, Move, and Sleep sections.
 *
 * List view shows highlights[0] only (one line of orienting text).
 * Full highlights array is passed to the detail sheet via onOpenSheet.
 * Functional specs (distance, difficulty, duration) shown inline for scanning.
 */
export default function TierItem({
  name, location, tier, tierStyles, detail, highlights, tags, url, featured,
  note, tradition, duration, distance, difficulty, operator, light,
  onOpenSheet, hasNPS,
  // Extra fields passed through to detail sheet
  bookingWindow, priceRange, hours, admission, type: itemType,
}) {
  const s = tierStyles[tier] || Object.values(tierStyles)[0];

  // Build sheet data with full highlights for detail view
  const buildSheetData = () => ({
    type: 'tier',
    name, location, tier, tags, featured, url, note,
    highlights: highlights || (detail ? [detail] : []),
    tradition, duration, distance, difficulty, operator,
    bookingWindow, priceRange, hours, admission, itemType,
  });

  // One-line detail for list view: highlights[0] or truncated detail
  const listDetail = highlights?.[0] || detail || null;

  // Functional specs line for Move items (distance · difficulty · duration)
  const specsLine = [distance, difficulty, duration].filter(Boolean).join(' · ');

  const nameEl = onOpenSheet ? (
    <span className="font-body text-[15px] font-semibold text-dark-ink">{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="font-body text-[15px] font-semibold text-dark-ink no-underline transition-[border-color] duration-200"
      style={{ borderBottom: `1px solid ${C.stone}` }}
      onMouseEnter={e => e.target.style.borderColor = C.oceanTeal}
      onMouseLeave={e => e.target.style.borderColor = C.stone}>
      {name}
      <span className="text-[12px] ml-1 text-[#7A857E]">{"↗︎"}</span>
    </a>
  ) : (
    <span className="font-body text-[15px] font-semibold text-dark-ink">{name}</span>
  );

  // Light card (Climb pattern) — keep as-is, already minimal
  if (light) {
    return (
      <div
        onClick={onOpenSheet ? () => onOpenSheet(buildSheetData()) : undefined}
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
          </div>
          {detail && <div className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.65]">{detail}</div>}
          {operator && <div className="font-body text-[12px] font-semibold text-ocean-teal mt-1">{operator}</div>}
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

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet(buildSheetData()) : undefined}
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
          {hasNPS && (
            <span className="inline-flex items-center gap-1 font-body text-[9px] font-bold tracking-[0.14em] uppercase text-[#2D5F2B] px-2 py-0.5"
              style={{ background: "#2D5F2B10" }}>
              <NPSArrowhead size={10} />NPS
            </span>
          )}
        </div>
        <div className="mb-[3px]">{nameEl}</div>
        {specsLine && (
          <div className="font-body text-[12px] font-medium text-[#7A857E] mb-[3px]">
            {specsLine}
          </div>
        )}
        {listDetail && (
          <div className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.65]">{listDetail}</div>
        )}
        {note && <div className="font-body text-[12px] font-semibold text-ocean-teal mt-1">{note}</div>}
        {tags && tags.length > 0 && (
          <div className="flex gap-[5px] mt-[7px] flex-wrap">
            {tradition && (
              <span className="font-body text-[11px] font-semibold px-2 py-0.5"
                style={{ background: `${C.oceanTeal}18`, color: C.oceanTeal }}>{tradition}</span>
            )}
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
