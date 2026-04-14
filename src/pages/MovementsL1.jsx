/**
 * MovementsL1.jsx — Lila Movements Level 1: The Practice
 * Route: /ethos/movements/practice
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
};

export default function MovementsL1() {
  return <Movements screens={SCREENS} deckConfig={config} />;
}
