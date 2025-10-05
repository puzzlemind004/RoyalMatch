import crypto from 'node:crypto'
import { CardSuit, ALL_SUITS, OPPOSITE_SUITS } from '#types/card'

/**
 * Color hierarchy result interface
 */
export interface ColorHierarchy {
  dominant: CardSuit
  weak: CardSuit
  neutrals: CardSuit[]
}

/**
 * Service responsible for color roulette logic
 * Selects dominant color and determines hierarchy
 */
export default class ColorRouletteService {
  /**
   * Spins the roulette to select a random dominant color
   * Uses cryptographically secure randomness
   * @returns {CardSuit} The selected dominant color
   */
  spinRoulette(): CardSuit {
    const randomIndex = crypto.randomInt(0, 4)
    return ALL_SUITS[randomIndex]
  }

  /**
   * Gets the weak color (opposite) of the dominant color
   * @param {CardSuit} dominantColor - The dominant color
   * @returns {CardSuit} The weak color
   */
  getWeakColor(dominantColor: CardSuit): CardSuit {
    return OPPOSITE_SUITS[dominantColor]
  }

  /**
   * Gets the neutral colors (neither dominant nor weak)
   * @param {CardSuit} dominantColor - The dominant color
   * @returns {CardSuit[]} Array of neutral colors
   */
  getNeutralColors(dominantColor: CardSuit): CardSuit[] {
    const weakColor = this.getWeakColor(dominantColor)
    return ALL_SUITS.filter((suit) => suit !== dominantColor && suit !== weakColor)
  }

  /**
   * Gets complete color hierarchy for a round
   * @param {CardSuit} dominantColor - The dominant color
   * @returns {ColorHierarchy} Complete hierarchy with dominant, weak, and neutral colors
   */
  getColorHierarchy(dominantColor: CardSuit): ColorHierarchy {
    return {
      dominant: dominantColor,
      weak: this.getWeakColor(dominantColor),
      neutrals: this.getNeutralColors(dominantColor),
    }
  }
}
