import { G } from '@data/guides/guide-styles';

export default function ItemListGrid({ items, style = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', margin: '16px 0 28px', ...style }}>
      {items.map((item, i) => (
        <div key={item.name} style={{ padding: '16px 18px', background: i % 2 === 0 ? G.panel : G.panelMid }}>
          {item.context && (
            <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: G.ink40, marginBottom: 4 }}>
              {item.context}
            </div>
          )}
          <div style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 700, color: G.darkInk, marginBottom: 5 }}>
            {item.name}
          </div>
          <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 11, fontWeight: 400, lineHeight: 1.6, color: G.inkDetail, margin: 0 }}>
            {item.detail}
          </p>
        </div>
      ))}
    </div>
  );
}
