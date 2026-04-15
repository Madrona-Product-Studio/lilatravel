/**
 * guide-styles.js — Shared style tokens for destination guide pages.
 *
 * These mirror the approved design mockup (ZionGuideRedesign.jsx).
 * Guide pages use these tokens instead of brand.js for guide-specific
 * colors that differ from the main brand palette.
 */

export const G = {
  // Backgrounds
  warmWhite:   '#faf8f4',
  panel:       'rgba(28,25,23,0.03)',
  panelMid:    'rgba(28,25,23,0.05)',

  // Text hierarchy
  ink:         '#1C1917',
  darkInk:     '#1a1a18',
  inkBody:     'rgba(28,25,23,0.65)',
  inkDetail:   'rgba(28,25,23,0.55)',
  ink40:       'rgba(28,25,23,0.40)',
  ink25:       'rgba(28,25,23,0.25)',

  // Borders
  border:      'rgba(28,25,23,0.12)',
  borderSoft:  'rgba(28,25,23,0.07)',

  // Accents
  oceanTeal:   '#3a7d7b',
  tealFaint:   'rgba(58,125,123,0.06)',
  tealBorder:  'rgba(58,125,123,0.3)',
  goldenAmber: '#c9963a',
  amberFaint:  'rgba(201,150,58,0.07)',
  amberBorder: 'rgba(201,150,58,0.45)',

  // Ghost / decorative
  ghostNum:    'rgba(28,25,23,0.10)',
};

export const FONTS = {
  body:  "'Quicksand', sans-serif",
  serif: "'Cormorant Garamond', Georgia, serif",
};
