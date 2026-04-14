/**
 * MovementsL2.jsx — Lila Movements Level 2: How It Works
 * Route: /ethos/movements/science
 */

import { buildScreensL2, getTotalCardsL2, MOVEMENT_DECK_L2 } from '@data/movementDeckL2';
// Pass L2 chapters so ChaptersScreen only shows the 3 L2 chapters (not the original 4)
import { L2_MARK_IDS } from '@components/guide/DeckMarks';
import Movements from './Movements';

const SCREENS = buildScreensL2();

const config = {
  subtitle: 'the body as teacher',
  countLabel: `${MOVEMENT_DECK_L2.length} chapters · ${getTotalCardsL2()} cards`,
  title: 'Lila Movements — How It Works',
  description: 'Anatomy, movement science, and the patterns that modern life creates in your body.',
  markIds: L2_MARK_IDS,
  chapters: MOVEMENT_DECK_L2,
  chapterMarkMap: {
    'how-your-body-works': 'body',
    'what-modern-life-does': 'force',
    'what-your-body-needs': 'understanding',
  },
  welcome: {
    title: 'Begin',
    tagline: 'The body beneath the movement.',
    bold: 'Not a textbook — a lens.',
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
