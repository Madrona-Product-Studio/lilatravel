import { G } from '@data/guides/guide-styles';
import Badge from './Badge';
import LilaPick from './LilaPick';

export default function ContentList({ items, style = {} }) {
  return (
    <div style={{ margin: '16px 0 28px', ...style }}>
      {items.map((item, i) => {
        const barColor = item.lilaPick ? G.goldenAmber : G.tealBorder;
        return (
          <div key={item.name + i} style={{
            display: 'flex', alignItems: 'stretch',
            padding: '13px 0',
            borderBottom: i < items.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none',
          }}>
            {/* Left bar */}
            <div style={{ width: 3, flexShrink: 0, marginRight: 18, background: barColor }} />

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name row with Lila Pick */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4 }}>
                <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, lineHeight: 1.2 }}>
                  {item.name}
                </div>
                {item.lilaPick && <LilaPick />}
              </div>

              {/* Badge + context row */}
              {(item.badge || item.context) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  {item.badge && <Badge label={item.badge} />}
                  {item.context && (
                    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 10, fontWeight: 500, color: G.ink40 }}>
                      {item.context}
                    </span>
                  )}
                </div>
              )}

              {/* Detail */}
              {item.detail && (
                <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, lineHeight: 1.6, color: G.inkDetail, margin: 0 }}>
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
