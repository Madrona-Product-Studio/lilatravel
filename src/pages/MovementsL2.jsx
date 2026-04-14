/**
 * MovementsL2.jsx — Lila Body
 * Route: /practice/movements/science
 */

import { buildScreensL2, getTotalCardsL2, MOVEMENT_DECK_L2 } from '@data/movementDeckL2';
import { L2_MARK_IDS } from '@components/guide/DeckMarks';
import { C, FONTS } from '@data/brand';
import DeckMark from '@components/guide/DeckMarks';
import Movements from './Movements';

const SANS = FONTS.body;
const SCREENS = buildScreensL2();

// ═══════════════════════════════════════════════════════════════════════════════
// COVER SCREEN — warm amber dunes
// ═══════════════════════════════════════════════════════════════════════════════

export function CoverScreen() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 14 }}>

      {/* Sky gradient — deep sienna to warm amber */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(185deg, #2e1c10 0%, #6a4028 28%, #b07038 62%, #d09448 100%)',
      }} />

      {/* Sun glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '54%',
        transform: 'translate(-50%, -50%)',
        width: 220, height: 220, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(240,172,72,0.50) 0%, rgba(240,172,72,0.12) 45%, transparent 70%)',
        filter: 'blur(32px)', pointerEvents: 'none',
      }} />

      {/* Dune silhouettes */}
      <svg style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%' }}
        viewBox="0 0 400 320" preserveAspectRatio="none">
        {/* Back dune — softest, furthest */}
        <path d="M0,320 L0,168 Q80,132 160,145 Q240,158 320,132 Q370,118 400,125 L400,320 Z"
          fill="rgba(16,8,4,0.42)" />
        {/* Mid dune */}
        <path d="M0,320 L0,220 Q70,190 150,205 Q230,220 310,195 Q360,180 400,188 L400,320 Z"
          fill="rgba(16,8,4,0.65)" />
        {/* Front dune — closest, darkest, smoothest curve */}
        <path d="M0,320 L0,282 Q80,255 170,270 Q260,285 340,260 Q375,248 400,254 L400,320 Z"
          fill="rgba(16,8,4,0.92)" />
      </svg>

      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(16,8,4,0.05) 0%, rgba(16,8,4,0.40) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 28px 15%', gap: 16, zIndex: 2,
      }}>
        {/* Chapter marks */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {L2_MARK_IDS.map(id => (
            <DeckMark key={id} id={id} size={22} />
          ))}
        </div>
        <div style={{ width: 28, height: '0.5px', background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 'clamp(42px,10vw,58px)', fontFamily: SANS,
            color: C.warmWhite, fontWeight: 700, lineHeight: 1.0,
            letterSpacing: '-0.01em', textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>lila</div>
          <div style={{
            fontSize: 'clamp(42px,10vw,58px)', fontFamily: SANS,
            color: C.warmWhite, fontWeight: 700, lineHeight: 1.0,
            letterSpacing: '-0.01em', textShadow: '0 2px 24px rgba(0,0,0,0.3)',
          }}>body</div>
        </div>
        <div style={{ width: 28, height: '0.5px', background: 'rgba(255,255,255,0.35)' }} />
        <div style={{
          fontSize: 12, fontFamily: SANS,
          color: 'rgba(255,255,255,0.75)', fontWeight: 400,
          letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.9,
        }}>
          the body as teacher
        </div>
        <div style={{
          fontSize: 11, fontFamily: SANS,
          color: 'rgba(255,255,255,0.35)', fontWeight: 400,
          letterSpacing: '0.06em',
        }}>
          {`${MOVEMENT_DECK_L2.length} chapters \u00b7 ${getTotalCardsL2()} cards`}
        </div>
      </div>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const config = {
  subtitle: 'the body as teacher',
  countLabel: `${MOVEMENT_DECK_L2.length} chapters \u00b7 ${getTotalCardsL2()} cards`,
  title: 'Lila Body',
  description: 'Anatomy, movement science, and the patterns that modern life creates in your body.',
  markIds: L2_MARK_IDS,
  chapters: MOVEMENT_DECK_L2,
  coverOverride: CoverScreen,
  chapterMarkMap: {
    'how-your-body-works': 'body',
    'what-modern-life-does': 'force',
    'what-your-body-needs': 'understanding',
  },
  welcome: {
    title: 'Begin',
    tagline: 'The body beneath the movement.',
    bold: 'Not a textbook \u2014 a lens.',
    lines: [
      'to see what you carry,',
      'to understand what moves you,',
      'to think differently about form.',
    ],
    returnLine: 'Return to the ones that shift something.',
    bottomAnchor: 'Some concepts invite you deeper.',
  },
};

export default function MovementsL2() {
  return <Movements screens={SCREENS} deckConfig={config} />;
}
