/**
 * MovementsL2.jsx — Lila Movements Level 2: How It Works
 * Route: /ethos/movements/science
 */

import { buildScreensL2, getTotalCardsL2, MOVEMENT_DECK_L2 } from '@data/movementDeckL2';
import Movements from './Movements';

const SCREENS = buildScreensL2();

const config = {
  subtitle: 'the body as teacher',
  countLabel: `${MOVEMENT_DECK_L2.length} chapters · ${getTotalCardsL2()} cards`,
  title: 'Lila Movements — How It Works',
  description: 'Anatomy, movement science, and the patterns that modern life creates in your body.',
};

export default function MovementsL2() {
  return <Movements screens={SCREENS} deckConfig={config} />;
}
