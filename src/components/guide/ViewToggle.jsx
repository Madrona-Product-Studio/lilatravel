import { G, FONTS } from '@data/guides/guide-styles';

export default function ViewToggle({ view, onToggle }) {
  return (
    <div style={{
      display: 'flex', gap: 0, marginBottom: 8,
      border: `1px solid ${G.border}`,
      alignSelf: 'flex-start',
    }}>
      <button
        onClick={() => onToggle('list')}
        style={{
          fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '7px 16px', border: 'none', cursor: 'pointer',
          background: view === 'list' ? G.darkInk : 'transparent',
          color: view === 'list' ? G.warmWhite : G.ink40,
          transition: 'all 0.2s',
        }}
      >
        List
      </button>
      <button
        onClick={() => onToggle('map')}
        style={{
          fontFamily: FONTS.body, fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '7px 16px', border: 'none', cursor: 'pointer',
          borderLeft: `1px solid ${G.border}`,
          background: view === 'map' ? G.darkInk : 'transparent',
          color: view === 'map' ? G.warmWhite : G.ink40,
          transition: 'all 0.2s',
        }}
      >
        Map
      </button>
    </div>
  );
}
