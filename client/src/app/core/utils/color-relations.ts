/**
 * Color Relations Utilities for Frontend
 *
 * Helper functions for displaying card color hierarchy in the UI
 */

import { CardSuit } from '../../models/card.model';

/**
 * Opposite suit mapping (must match backend)
 */
export const COLOR_OPPOSITES: Record<CardSuit, CardSuit> = {
  [CardSuit.HEARTS]: CardSuit.SPADES,
  [CardSuit.CLUBS]: CardSuit.DIAMONDS,
  [CardSuit.DIAMONDS]: CardSuit.CLUBS,
  [CardSuit.SPADES]: CardSuit.HEARTS,
};

/**
 * Suit to color type mapping
 */
export const COLOR_TYPE: Record<CardSuit, 'red' | 'black'> = {
  [CardSuit.HEARTS]: 'red',
  [CardSuit.DIAMONDS]: 'red',
  [CardSuit.CLUBS]: 'black',
  [CardSuit.SPADES]: 'black',
};

/**
 * Get the opposite suit for a given suit
 */
export function getOppositeColor(suit: CardSuit): CardSuit {
  return COLOR_OPPOSITES[suit];
}

/**
 * Check if two suits are opposites
 */
export function areOpposites(suit1: CardSuit, suit2: CardSuit): boolean {
  return COLOR_OPPOSITES[suit1] === suit2;
}

/**
 * Get the color type (red or black) for a given suit
 */
export function getColorType(suit: CardSuit): 'red' | 'black' {
  return COLOR_TYPE[suit];
}

/**
 * Badge type for visual representation of color hierarchy
 */
export type ColorBadge = 'dominant' | 'weak' | 'neutral';

/**
 * Get the badge type for a suit based on the dominant color
 *
 * @param suit - The suit to get the badge for
 * @param dominantColor - The current dominant/strong color
 * @returns The badge type ('dominant', 'weak', or 'neutral')
 *
 * @example
 * getColorBadge(CardSuit.HEARTS, CardSuit.HEARTS) // 'dominant'
 * getColorBadge(CardSuit.SPADES, CardSuit.HEARTS) // 'weak' (opposite)
 * getColorBadge(CardSuit.DIAMONDS, CardSuit.HEARTS) // 'neutral'
 */
export function getColorBadge(suit: CardSuit, dominantColor: CardSuit): ColorBadge {
  if (suit === dominantColor) return 'dominant';
  if (suit === getOppositeColor(dominantColor)) return 'weak';
  return 'neutral';
}

/**
 * Get TailwindCSS classes for a color badge
 *
 * @param badge - The badge type
 * @returns TailwindCSS class string
 */
export function getColorBadgeClass(badge: ColorBadge): string {
  const classes: Record<ColorBadge, string> = {
    dominant: 'bg-yellow-500 text-black font-bold',
    weak: 'bg-gray-400 text-white opacity-50',
    neutral: 'bg-blue-500 text-white',
  };
  return classes[badge];
}

/**
 * Get the HTML entity for a card suit icon
 *
 * @param suit - The suit to get the icon for
 * @returns HTML entity string for the suit symbol
 */
export function getSuitIcon(suit: CardSuit): string {
  const icons: Record<CardSuit, string> = {
    [CardSuit.HEARTS]: '&hearts;',
    [CardSuit.DIAMONDS]: '&diams;',
    [CardSuit.CLUBS]: '&clubs;',
    [CardSuit.SPADES]: '&spades;',
  };
  return icons[suit];
}

/**
 * Get the color for a suit (for CSS)
 *
 * @param suit - The suit to get the color for
 * @returns CSS color string
 */
export function getSuitColor(suit: CardSuit): string {
  return getColorType(suit) === 'red' ? '#dc2626' : '#1f2937';
}
