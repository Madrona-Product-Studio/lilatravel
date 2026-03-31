import { C } from '@data/brand';

/**
 * TierItem — reusable tier-tagged card for Breathe, Move, and Sleep sections.
 * Follows the exact same visual pattern as StayItem in the guide pages.
 *
 * @param {string} name
 * @param {string} location
 * @param {string} tier - e.g. "practice", "soak", "restore", "hike", "water", "ride", "climb"
 * @param {object} tierStyles - { [tier]: { color, label, bg } }
 * @param {string} detail - joined highlights or description
 * @param {string[]} tags
 * @param {string} url
 * @param {boolean} featured - drives Lila Pick badge
 * @param {string} note - optional (hours, booking window, etc.)
 * @param {string} tradition - optional yoga tradition tag
 * @param {string} duration - optional
 * @param {string} distance - optional
 * @param {string} operator - optional
 * @param {boolean} light - if true, renders lighter card (Climb pattern)
 */
export default function TierItem({ name, location, tier, tierStyles, detail, tags, url, featured, note, tradition, duration, distance, operator, light }) {
  const s = tierStyles[tier] || Object.values(tierStyles)[0];

  const nameEl = url ? (
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

  if (light) {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3.5 py-4 border-b border-stone">
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
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3.5 py-[18px] border-b border-stone">
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
        {(duration || distance) && (
          <div className="font-body text-[12px] font-medium text-[#7A857E] mb-[3px]">
            {[distance, duration].filter(Boolean).join(' · ')}
          </div>
        )}
        <div className="font-body text-[14px] font-normal text-[#4A5650] leading-[1.65]">{detail}</div>
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
