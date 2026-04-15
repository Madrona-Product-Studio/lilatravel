import { G } from '@data/guides/guide-styles';

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
    <span className="font-body text-[14px] font-semibold" style={{ color: G.ink }}>{name}</span>
  ) : url ? (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="font-body text-[14px] font-semibold no-underline transition-[border-color,color] duration-200"
      style={{ color: G.ink, borderBottom: `1px solid ${G.border}` }}
      onMouseEnter={e => { e.target.style.borderColor = G.accent; }}
      onMouseLeave={e => { e.target.style.borderColor = G.border; }}>
      {name}
      <span className="text-[11px] ml-1" style={{ color: G.muted }}>↗</span>
    </a>
  ) : (
    <span className="font-body text-[14px] font-semibold" style={{ color: G.ink }}>{name}</span>
  );

  return (
    <div
      onClick={onOpenSheet ? () => onOpenSheet({ type: 'list', name, detail, note, tags, featured, url, location, cuisine, priceRange, reservations, dietary, energy }) : undefined}
      className={`flex flex-col md:flex-row items-start md:items-center gap-3 py-[13px] ${onOpenSheet ? 'cursor-pointer transition-[background] duration-150' : ''}`}
      style={{ borderBottom: `1px solid ${G.borderSoft}` }}
      onMouseEnter={onOpenSheet ? e => { e.currentTarget.style.background = G.accentPale; } : undefined}
      onMouseLeave={onOpenSheet ? e => { e.currentTarget.style.background = 'transparent'; } : undefined}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-[3px]">
          {nameEl}
          {featured && (
            <span
              className="font-body text-[9px] font-semibold tracking-[0.1em] uppercase px-1.5 py-[2px]"
              style={{ color: G.accent, border: `0.5px solid rgba(58,125,123,0.4)` }}
            >◈ Pick</span>
          )}
          {hasNPS && (
            <span className="inline-flex items-center gap-1 font-body text-[9px] font-bold tracking-[0.14em] uppercase text-[#2D5F2B] px-2 py-0.5"
              style={{ background: "#2D5F2B10" }}>
              <NPSArrowhead size={10} />NPS
            </span>
          )}
        </div>
        <div className="font-body text-[13px] font-normal leading-[1.6]" style={{ color: G.ink50 }}>{detail}</div>
        {note && (
          <div className="font-body text-[12px] font-semibold mt-1" style={{ color: G.accent }}>{note}</div>
        )}
        {tags && tags.length > 0 && (
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

export { NPSArrowhead };
export default ListItem;
