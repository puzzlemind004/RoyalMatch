/**
 * Color roulette models for RoyalMatch frontend
 */

import { CardSuit } from './card.model';

/**
 * Roulette result interface
 * Represents the color hierarchy for a round
 */
export interface RouletteResult {
  dominantColor: CardSuit;
  weakColor: CardSuit;
  neutrals: CardSuit[];
}
