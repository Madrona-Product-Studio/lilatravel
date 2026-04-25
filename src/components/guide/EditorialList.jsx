import { G } from '@data/guides/guide-styles';

const BAR_COLOR = 'rgba(28,25,23,0.10)';

export default function EditorialList({ items, style = {} }) {
  return (
    <div style={{ margin: '16px 0 28px', ...style }}>
      {items.map((item, i) => {
        const hasUrl = !!item.url;
        const rowContent = (
          <>
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
                {item.name} {hasUrl && <span style={{ fontSize: 11, opacity: 0.4 }}>↗︎</span>}
              </div>
              <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: 13, fontWeight: 400, lineHeight: 1.6, color: G.inkDetail, margin: 0 }}>
                {item.detail}
              </p>
            </div>
          </>
        );

        const rowStyle = {
          display: 'flex', alignItems: 'stretch',
          padding: '13px 0',
          borderBottom: i < items.length - 1 ? `0.5px solid ${G.borderSoft}` : 'none',
          ...(hasUrl ? { cursor: 'pointer', textDecoration: 'none', color: 'inherit', transition: 'background 0.15s' } : {}),
        };

        return hasUrl ? (
          <a key={item.name + i} href={item.url} target="_blank" rel="noopener noreferrer"
            style={rowStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(28,25,23,0.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {rowContent}
          </a>
        ) : (
          <div key={item.name + i} style={rowStyle}>
            {rowContent}
          </div>
        );
      })}
    </div>
  );
}
