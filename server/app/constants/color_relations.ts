/**
 * Color Relations Constants
 *
 * Defines the fixed relationships between card suits (colors) in RoyalMatch.
 * These relationships determine the hierarchy when a dominant color is selected.
 */

import { CardSuit } from '#types/card'

/**
 * Opposite suit mapping
 * Each suit has exactly one opposite suit of a different color (red/black)
 *
 * - Hearts (♥️ red) ↔ Spades (♠️ black)
 * - Diamonds (♦️ red) ↔ Clubs (♣️ black)
 */
export const COLOR_OPPOSITES: Record<CardSuit, CardSuit> = {
  [CardSuit.HEARTS]: CardSuit.SPADES,
  [CardSuit.CLUBS]: CardSuit.DIAMONDS,
  [CardSuit.DIAMONDS]: CardSuit.CLUBS,
  [CardSuit.SPADES]: CardSuit.HEARTS,
}

/**
 * Suit to color type mapping
 * Each suit is either red or black
 */
export const COLOR_TYPE: Record<CardSuit, 'red' | 'black'> = {
  [CardSuit.HEARTS]: 'red',
  [CardSuit.DIAMONDS]: 'red',
  [CardSuit.CLUBS]: 'black',
  [CardSuit.SPADES]: 'black',
}

/**
 * Get the opposite suit for a given suit
 *
 * @param suit - The suit to find the opposite for
 * @returns The opposite suit
 *
 * @example
 * getOppositeColor(CardSuit.HEARTS) // CardSuit.SPADES
 * getOppositeColor(CardSuit.CLUBS) // CardSuit.DIAMONDS
 */
export function getOppositeColor(suit: CardSuit): CardSuit {
  return COLOR_OPPOSITES[suit]
}

/**
 * Check if two suits are opposites
 *
 * @param suit1 - First suit
 * @param suit2 - Second suit
 * @returns True if the suits are opposites, false otherwise
 *
 * @example
 * areOpposites(CardSuit.HEARTS, CardSuit.SPADES) // true
 * areOpposites(CardSuit.HEARTS, CardSuit.DIAMONDS) // false
 */
export function areOpposites(suit1: CardSuit, suit2: CardSuit): boolean {
  return COLOR_OPPOSITES[suit1] === suit2
}

/**
 * Get the color type (red or black) for a given suit
 *
 * @param suit - The suit to get the color type for
 * @returns 'red' or 'black'
 *
 * @example
 * getColorType(CardSuit.HEARTS) // 'red'
 * getColorType(CardSuit.SPADES) // 'black'
 */
export function getColorType(suit: CardSuit): 'red' | 'black' {
  return COLOR_TYPE[suit]
}
