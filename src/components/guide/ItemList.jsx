import { G } from '@data/guides/guide-styles';

export default function ItemList({ items, style = {} }) {
  return (
    <div style={{ margin: '16px 0 28px', ...style }}>
      {items.map((item, i) => (
        <div key={item.name} style={{ padding: '14px 0', borderBottom: i < items.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none' }}>
          {item.context && (
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: G.ink40, marginBottom: 4 }}>
              {item.context}
            </div>
          )}
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 14, fontWeight: 700, color: G.darkInk, lineHeight: 1.2, marginBottom: 5 }}>
            {item.name}
          </div>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 12, fontWeight: 400, lineHeight: 1.65, color: G.inkDetail, margin: 0 }}>
            {item.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
