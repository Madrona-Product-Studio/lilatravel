import { G } from '@data/guides/guide-styles';

// Sort accommodations: one lilaPick per tier (elemental → rooted → premium → luxury), then rest
export function sortByTierDiversity(items) {
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

const TIER_STYLES = {
  elemental: { color: '#5a9e8a', label: 'Elemental', bg: 'rgba(90,158,138,0.10)' },
  rooted:    { color: G.accent, label: 'Rooted', bg: 'rgba(58,125,123,0.08)' },
  premium:   { color: G.accentWarm, label: 'Premium', bg: 'rgba(201,150,58,0.10)' },
  luxury:    { color: '#c87a5a', label: 'Luxury', bg: 'rgba(200,122,90,0.10)' },
};

export default function StayItem({ name, location, tier, detail, tags, url, featured, onOpenSheet, priceRange, amenities, bookingWindow, seasonalNotes, groupFit }) {
  const s = TIER_STYLES[tier] || TIER_STYLES.rooted;
  const nameEl = onOpenSheet ? (
    <span className="font-body text-[14px] font-semibold" style={{ color: G.ink }}>{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="font-body text-[14px] font-semibold no-underline transition-[border-color] duration-200"
      style={{ color: G.ink, borderBottom: `1px solid ${G.border}` }}
      onMouseEnter={e => e.target.style.borderColor = G.accent}
      onMouseLeave={e => e.target.style.borderColor = G.border}>
      {name}
      <span className="text-[11px] ml-1" style={{ color: G.muted }}>↗</span>
    </a>
  ) : (
    <span className="font-body text-[14px] font-semibold" style={{ color: G.ink }}>{name}</span>
  );

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet({ type: 'stay', name, location, tier, detail, tags, featured, url, priceRange, amenities, bookingWindow, seasonalNotes, groupFit }) : undefined}
      className={`flex flex-col md:flex-row items-stretch md:items-center gap-3 py-[13px] ${onOpenSheet ? 'cursor-pointer transition-[background] duration-150' : ''}`}
      style={{ borderBottom: `1px solid ${G.borderSoft}` }}
      onMouseEnter={onOpenSheet ? e => { e.currentTarget.style.background = G.accentPale; } : undefined}
      onMouseLeave={onOpenSheet ? e => { e.currentTarget.style.background = 'transparent'; } : undefined}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-[3px] flex-wrap">
          <span className="font-body text-[9px] font-semibold tracking-[0.16em] uppercase px-1.5 py-[2px]"
            style={{ background: s.bg, color: s.color }}>{s.label}</span>
          <span className="font-body text-[11px] font-normal" style={{ color: G.ink40 }}>{location}</span>
          {featured && (
            <span
              className="font-body text-[9px] font-semibold tracking-[0.1em] uppercase px-1.5 py-[2px]"
              style={{ color: G.accent, border: `0.5px solid rgba(58,125,123,0.4)` }}
            >◈ Pick</span>
          )}
        </div>
        <div className="mb-[3px]">{nameEl}</div>
        <div className="font-body text-[13px] font-normal leading-[1.6]" style={{ color: G.inkDetail }}>{detail}</div>
        {tags && (
          <div className="flex gap-1 mt-[6px] flex-wrap">
            {tags.map((t, i) => (
              <span key={i} className="font-body text-[11px] font-medium py-[2px] px-[7px]"
                style={{ color: G.ink40, background: G.accentPale }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
