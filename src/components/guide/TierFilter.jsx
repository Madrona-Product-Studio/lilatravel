import { C } from '@data/brand';

/**
 * TierFilter — interactive tier toggle for Move and Breathe sections.
 * Replaces TierLegend with clickable segments that filter visible cards.
 *
 * @param {Array} tiers - [{ key, label, desc, color }]
 * @param {Set} activeTiers - Set of active tier keys
 * @param {Function} onToggle - (tierKey) => void
 */
export default function TierFilter({ tiers, activeTiers, onToggle }) {
  return (
    <div
      className="mb-5 flex flex-col md:flex-row border border-stone"
      style={{ borderRadius: 0, background: C.warmWhite }}
    >
      {tiers.map((t, i) => {
        const isActive = activeTiers.has(t.key);
        const isLast = i === tiers.length - 1;
        return (
          <button
            key={t.key}
            role="checkbox"
            aria-checked={isActive}
            aria-label={t.label}
            onClick={() => onToggle(t.key)}
            className={`flex items-center gap-3 flex-1 border-0 cursor-pointer text-left min-h-[48px] md:min-h-0 py-3 px-3.5 ${!isLast ? 'border-b md:border-b-0 md:border-r border-stone' : ''}`}
            style={{
              background: 'transparent',
              borderRadius: 0,
              transition: 'background 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${C.stone}18`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {/* Checkbox */}
            <div
              className="shrink-0 flex items-center justify-center"
              style={{
                width: 15,
                height: 15,
                borderRadius: 0,
                border: isActive ? 'none' : '1px solid #D8D3CE',
                background: isActive ? t.color : C.warmWhite,
                transition: 'all 0.18s',
              }}
            >
              {isActive && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>

            {/* Desktop: stacked text */}
            <div className="hidden md:flex flex-col">
              <span
                className="font-body text-[11px] font-bold tracking-[0.1em] uppercase leading-tight"
                style={{ color: isActive ? t.color : '#C2BDB7', transition: 'color 0.18s' }}
              >
                {t.label}
              </span>
              <span
                className="font-body text-[11px] font-normal leading-tight"
                style={{ color: '#7A857E', opacity: isActive ? 1 : 0.3, transition: 'opacity 0.18s' }}
              >
                {t.desc}
              </span>
            </div>

            {/* Mobile: inline text */}
            <div className="flex md:hidden items-center gap-2">
              <span
                className="font-body text-[11px] font-bold tracking-[0.1em] uppercase"
                style={{ color: isActive ? t.color : '#C2BDB7', transition: 'color 0.18s' }}
              >
                {t.label}
              </span>
              <span
                className="font-body text-[11px] font-normal"
                style={{ color: '#7A857E', opacity: isActive ? 1 : 0.3, transition: 'opacity 0.18s' }}
              >
                {t.desc}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
