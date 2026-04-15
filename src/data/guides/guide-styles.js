/**
 * guide-styles.js — Shared style tokens for destination guide pages.
 *
 * All guide pages (main + sub-guides) import from here to ensure
 * consistent typography, color, and spacing.
 *
 * These are CSS-in-JS values for inline styles. Tailwind classes
 * handle layout; these handle brand-specific visual properties.
 */

// ─── Colors ──────────────────────────────────────────────────────────────────

export const G = {
  bg:          '#f5f0e8',
  panel:       'rgba(255, 255, 255, 0.5)',
  ink:         '#1a1a18',
  inkBody:     'rgba(26, 26, 24, 0.78)',
  inkDetail:   'rgba(26, 26, 24, 0.62)',
  ink40:       'rgba(26, 26, 24, 0.4)',
  ink30:       'rgba(26, 26, 24, 0.3)',
  border:      'rgba(107, 128, 120, 0.12)',
  borderSoft:  'rgba(107, 128, 120, 0.08)',
  accent:      '#3a7d7b',
  accentMid:   'rgba(58, 125, 123, 0.7)',
  accentPale:  'rgba(58, 125, 123, 0.08)',
  accentWarm:  '#c9963a',
  muted:       '#6B8078',
  accentDot:   'rgba(58, 125, 123, 0.45)',
  ghostNum:    'rgba(58, 125, 123, 0.18)',
  panelLabel:  'rgba(26, 26, 24, 0.35)',
  sourceDot:   'rgba(26, 26, 24, 0.72)',
  chipText:    'rgba(26, 26, 24, 0.55)',
};
