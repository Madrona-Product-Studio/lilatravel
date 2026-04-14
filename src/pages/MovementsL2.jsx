/**
 * MovementsL2.jsx — Lila Movements Level 2: How It Works
 * Route: /ethos/movements/science
 */

import { buildScreensL2, getTotalCardsL2, MOVEMENT_DECK_L2 } from '@data/movementDeckL2';
import { L2_MARK_IDS } from '@components/guide/DeckMarks';
import Movements from './Movements';

const SCREENS = buildScreensL2();

const config = {
  subtitle: 'the body as teacher',
  countLabel: `${MOVEMENT_DECK_L2.length} chapters · ${getTotalCardsL2()} cards`,
  title: 'Lila Movements — How It Works',
  description: 'Anatomy, movement science, and the patterns that modern life creates in your body.',
  markIds: L2_MARK_IDS,
  chapterMarkMap: {
    'how-your-body-works': 'body',
    'what-modern-life-does': 'force',
    'what-your-body-needs': 'understanding',
  },
};

export default function MovementsL2() {
  return <Movements screens={SCREENS} deckConfig={config} />;
}
