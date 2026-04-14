/**
 * MovementTabs.jsx
 * ────────────────
 * Pill-style tab switcher for the movement card back face.
 * Uses e.stopPropagation() on tab clicks to prevent flipping.
 */

import { useState } from 'react';
import { FONTS } from '@data/brand';

const SANS = FONTS.body;

export default function MovementTabs({ tabs, accent }) {
  const [active, setActive] = useState(0);

  if (!tabs || tabs.length === 0) return null;

  const current = tabs[active];
  const isInjuryRisk = current.label === 'Injury Risk';

  return (
    <div>
      {/* Tab row */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap',
        marginBottom: 16,
      }}>
        {tabs.map((tab, i) => {
          const isActive = i === active;
          const isInjury = tab.label === 'Injury Risk';
          return (
            <button
              key={tab.label}
              onClick={(e) => { e.stopPropagation(); setActive(i); }}
              style={{
                fontFamily: SANS,
                fontSize: 11,
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.04em',
                padding: '5px 10px',
                borderRadius: 20,
                border: isActive
                  ? `1.5px solid ${accent}`
                  : '1.5px solid rgba(44,36,32,0.12)',
                background: isActive ? accent : 'transparent',
                color: isActive
                  ? 'white'
                  : isInjury
                    ? '#C4875A'
                    : 'rgba(44,36,32,0.55)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {isInjury && !isActive && (
                <span style={{
                  display: 'inline-block',
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: '#C4875A',
                  marginRight: 5,
                  verticalAlign: 'middle',
                }} />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          fontSize: 14,
          fontFamily: SANS,
          fontWeight: 400,
          color: isInjuryRisk ? '#8A5A3A' : '#1C1917',
          lineHeight: 1.75,
          ...(isInjuryRisk ? {
            background: 'rgba(196,135,90,0.06)',
            borderLeft: '2px solid rgba(196,135,90,0.4)',
            padding: '12px 14px',
            borderRadius: '0 6px 6px 0',
          } : {}),
        }}
      >
        {Array.isArray(current.content) ? (
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
            {current.content.map((item, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'baseline', gap: 8,
                marginBottom: 6,
              }}>
                <span style={{
                  display: 'inline-block',
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: accent,
                  flexShrink: 0,
                  marginTop: 7,
                }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>{current.content}</div>
        )}
      </div>
    </div>
  );
}
