/**
 * MovementsL1.jsx — Lila Movements Level 1: The Practice
 * Route: /practice/movements/practice
 */

import { buildScreensL1, getTotalCardsL1 } from '@data/movementDeckL1';
import { L1_MARK_IDS } from '@components/guide/DeckMarks';
import Movements from './Movements';

const SCREENS = buildScreensL1();

const config = {
  subtitle: '30 poses for a complete practice',
  countLabel: `6 sections · ${getTotalCardsL1()} cards`,
  title: 'Lila Movements — The Practice',
  description: '30 yoga poses organized into a single flowing sequence: arrive, awaken, open, balance, ground, rest.',
  markIds: L1_MARK_IDS,
  welcome: {
    title: 'Begin',
    tagline: 'A language for your body in motion.',
    bold: 'Not a posture — a purpose.',
    lines: [
      'to arrive in your body,',
      'to move with intention,',
      'to find stillness in form.',
    ],
    returnLine: 'Return to the ones that open you.',
    bottomAnchor: 'Some poses invite you deeper.',
  },
  continue: {
    subtitle: 'Movement is learned by moving.',
    lines: [
      'carry the shapes that found you,',
      'return to the ones that opened,',
      'let the practice become the body.',
    ],
    omit: ['movements'],
  },
};

export default function MovementsL1() {
  return <Movements screens={SCREENS} deckConfig={config} />;
}
