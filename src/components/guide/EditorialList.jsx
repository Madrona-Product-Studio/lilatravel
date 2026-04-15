import { G } from '@data/guides/guide-styles';

const BAR_COLOR = 'rgba(28,25,23,0.10)';

export default function EditorialList({ items, style = {} }) {
  return (
    <div style={{ margin: '16px 0 28px', ...style }}>
      {items.map((item, i) => (
        <div key={item.name + i} style={{
          display: 'flex', alignItems: 'stretch',
          padding: '13px 0',
          borderBottom: i < items.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none',
        }}>
          {/* Left bar — faint ink */}
          <div style={{ width: 3, flexShrink: 0, marginRight: 18, background: BAR_COLOR }} />

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {item.context && (
              <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: G.ink40, marginBottom: 4 }}>
                {item.context}
              </div>
            )}
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, lineHeight: 1.2, marginBottom: 5 }}>
              {item.name}
            </div>
            <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, lineHeight: 1.55, color: G.inkDetail, margin: 0 }}>
              {item.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
