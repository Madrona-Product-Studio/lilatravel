import { G, TIER_COLORS } from '@data/guides/guide-styles';
import Badge from './Badge';
import LilaPick from './LilaPick';

function NPSArrowhead({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 22h3l5-11 5 11h3L12 2z" fill="#2D5F2B" opacity="0.85" />
      <circle cx="12" cy="16" r="2.5" fill="#2D5F2B" opacity="0.6" />
    </svg>
  );
}

function NPSBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: '#2D5F2B', background: 'rgba(45,95,43,0.06)',
      padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <NPSArrowhead />NPS
    </span>
  );
}

export default function ContentList({ items, onOpenSheet, style = {} }) {
  return (
    <div style={{ margin: '16px 0 28px', ...style }}>
      {items.map((item, i) => {
        // Tier-aware bar color for stays; lilaPick color for other sections
        const tierColor = item.tier && TIER_COLORS[item.tier];
        const barColor = tierColor ? tierColor.color : (item.lilaPick ? G.goldenAmber : G.tealBorder);
        const isClickable = !!onOpenSheet;

        const nameEl = isClickable ? (
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, lineHeight: 1.2 }}>
            {item.name}
          </span>
        ) : item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, lineHeight: 1.2, textDecoration: 'none', borderBottom: `0.5px solid ${G.ink25}` }}>
            {item.name}
          </a>
        ) : (
          <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, lineHeight: 1.2 }}>
            {item.name}
          </span>
        );

        return (
          <div
            key={item.name + i}
            onClick={isClickable ? () => onOpenSheet(item) : undefined}
            style={{
              display: 'flex', alignItems: 'stretch',
              padding: item.thumbnail ? '16px 0' : '13px 0',
              borderBottom: i < items.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none',
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'background 0.15s',
            }}
            onMouseEnter={isClickable ? e => { e.currentTarget.style.background = 'rgba(58,125,123,0.04)'; } : undefined}
            onMouseLeave={isClickable ? e => { e.currentTarget.style.background = 'transparent'; } : undefined}
          >
            {/* Left bar */}
            <div style={{ width: 3, flexShrink: 0, marginRight: item.thumbnail ? 12 : 18, background: barColor }} />

            {/* Thumbnail or placeholder (eat + sleep sections) */}
            {(item.thumbnail || item.tier || item.cuisine) && (
              <div style={{
                width: 96, height: 96, flexShrink: 0, marginRight: 14, alignSelf: 'center',
                overflow: 'hidden', borderRadius: 6, background: G.panel,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={G.ink25} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                )}
              </div>
            )}

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name row with Lila Pick */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {nameEl}
                  {item.hasNPS && <NPSBadge />}
                </div>
                {item.lilaPick && !item.tier && <LilaPick />}
              </div>

              {/* Badge + context row */}
              {(item.badge || item.context) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  {item.badge && <Badge label={item.badge} tier={item.tier} />}
                  {item.context && (
                    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 500, color: G.ink40 }}>
                      {item.context}
                    </span>
                  )}
                </div>
              )}

              {/* Detail */}
              {item.detail && (
                <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.6, color: G.inkDetail, margin: 0 }}>
                  {item.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
