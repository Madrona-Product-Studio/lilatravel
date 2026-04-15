import { G } from '@data/guides/guide-styles';
import Badge from './Badge';
import LilaPick from './LilaPick';

export default function ContentList({ items, style = {} }) {
  return (
    <div style={{ margin: '16px 0 28px', ...style }}>
      {items.map((item, i) => (
        <div key={item.name} style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: '0 16px', padding: '14px 0',
          borderBottom: i < items.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none',
        }}>
          <div>
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
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, lineHeight: 1.2, marginBottom: 5 }}>
              {item.name}
            </div>
            {item.detail && (
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, lineHeight: 1.6, color: G.inkDetail, margin: 0 }}>
                {item.detail}
              </p>
            )}
          </div>
          {item.lilaPick && (
            <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 2 }}>
              <LilaPick />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
