/**
 * Card Comparison Service
 * Implements the card comparison logic to determine trick winners
 * Uses the color roulette system with dominant/weak/neutral colors
 *
 * NEW LOGIC: Color trumps value (like classic trump card games)
 */

import { CardSuit } from '#types/card'
import { getOppositeColor, getColorType } from '#constants/color_relations'

/**
 * Represents a card for comparison purposes
 */
export interface ComparableCard {
  value: number // Numeric value (2-14, where A=14)
  suit: CardSuit
}

/**
 * Played card with player info for trick resolution
 */
export interface PlayedCard extends ComparableCard {
  playerId: number
}

/**
 * Result of trick winner determination
 */
export interface TrickWinnerResult {
  winnerCard: PlayedCard
  reason: WinningReason
}

/**
 * Reason why a card won
 */
export type WinningReason =
  | { type: 'only_card_played' }
  | { type: 'only_dominant_color'; suit: CardSuit }
  | { type: 'only_card_of_strongest_color'; suit: CardSuit }
  | { type: 'highest_value_among_dominant'; value: number }
  | { type: 'highest_value_among_color'; suit: CardSuit; value: number }
  | { type: 'highest_value'; value: number }

/**
 * Card comparison service
 * Critical logic that determines who wins tricks
 */
export class CardComparisonService {
  /**
   * Red suits
   */
  private readonly RED_SUITS: CardSuit[] = [CardSuit.HEARTS, CardSuit.DIAMONDS]

  /**
   * Find the winner of a trick using the "color first, then value" logic
   *
   * Algorithm:
   * 1. Look at all cards in the trick
   * 2. Identify the strongest color present
   * 3. Keep ONLY cards of that color
   * 4. Compare by value (highest wins)
   *
   * @param playedCards Array of played cards with player info
   * @param dominantColor The dominant color from the roulette
   * @returns Winner result with card and reason
   */
  findTrickWinner(playedCards: PlayedCard[], dominantColor: CardSuit): TrickWinnerResult {
    if (playedCards.length === 0) {
      throw new Error('No cards played')
    }

    if (playedCards.length === 1) {
      return {
        winnerCard: playedCards[0],
        reason: { type: 'only_card_played' },
      }
    }

    // 1. Identify the strongest color present in the trick
    const strongestColorInTrick = this.getStrongestColorInTrick(playedCards, dominantColor)

    // 2. Filter to keep only cards of that color
    const cardsOfStrongestColor = playedCards.filter((card) => card.suit === strongestColorInTrick)

    // 3. Compare by value
    const winner = cardsOfStrongestColor.reduce((highest, current) => {
      return current.value > highest.value ? current : highest
    })

    // 4. Determine winning reason
    const reason = this.getWinningReason(
      winner,
      cardsOfStrongestColor,
      strongestColorInTrick,
      dominantColor
    )

    return { winnerCard: winner, reason }
  }

  /**
   * Find the strongest color present in the trick
   *
   * @param cards Cards in the trick
   * @param dominantColor The dominant color
   * @returns The strongest color present
   */
  private getStrongestColorInTrick(cards: PlayedCard[], dominantColor: CardSuit): CardSuit {
    const weakColor = getOppositeColor(dominantColor)
    const colorsInTrick = new Set(cards.map((c) => c.suit))

    // If dominant color is present → it wins
    if (colorsInTrick.has(dominantColor)) {
      return dominantColor
    }

    // Otherwise, find the best neutral color
    const neutralColors = Array.from(colorsInTrick).filter((color) => color !== weakColor)

    if (neutralColors.length > 0) {
      // Prioritize neutral of same color type (red/black) as dominant
      const dominantType = getColorType(dominantColor)
      const sameTypeNeutral = neutralColors.find((color) => getColorType(color) === dominantType)
      return sameTypeNeutral || neutralColors[0]
    }

    // Otherwise, weak color is the only one present
    return weakColor
  }

  /**
   * Determine the reason why a card won
   *
   * @param winner The winning card
   * @param cardsOfSameColor All cards of the winning color
   * @param strongestColor The strongest color in the trick
   * @param dominantColor The dominant color
   * @returns Winning reason
   */
  private getWinningReason(
    winner: PlayedCard,
    cardsOfSameColor: PlayedCard[],
    strongestColor: CardSuit,
    dominantColor: CardSuit
  ): WinningReason {
    // Only card of this color
    if (cardsOfSameColor.length === 1) {
      if (strongestColor === dominantColor) {
        return {
          type: 'only_dominant_color',
          suit: dominantColor,
        }
      }
      return {
        type: 'only_card_of_strongest_color',
        suit: strongestColor,
      }
    }

    // Multiple cards of same color → decided by value
    if (strongestColor === dominantColor) {
      return {
        type: 'highest_value_among_dominant',
        value: winner.value,
      }
    }

    return {
      type: 'highest_value_among_color',
      suit: strongestColor,
      value: winner.value,
    }
  }

  /**
   * Compare two cards and determine which is stronger
   * DEPRECATED: Use findTrickWinner() for proper trick resolution
   * Kept for backward compatibility
   *
   * Returns:
   * - 1 if card1 > card2
   * - -1 if card1 < card2
   * - 0 should NEVER happen (no ties in this game)
   *
   * @param card1 First card
   * @param card2 Second card
   * @param dominantColor The dominant color from the roulette
   * @returns Comparison result (-1, 0, or 1)
   */
  compareCards(card1: ComparableCard, card2: ComparableCard, dominantColor: CardSuit): -1 | 0 | 1 {
    // Priority 1: Compare by color hierarchy
    const colorComparison = this.compareCardsByColor(card1, card2, dominantColor)
    if (colorComparison !== 0) {
      return colorComparison
    }

    // Priority 2: Same color → compare by value
    if (card1.value !== card2.value) {
      return card1.value > card2.value ? 1 : -1
    }

    // Should never happen (same color and same value)
    return 0
  }

  /**
   * Compare two cards by their color hierarchy only
   *
   * @param card1 First card
   * @param card2 Second card
   * @param dominantColor The dominant color
   * @returns Comparison result
   */
  private compareCardsByColor(
    card1: ComparableCard,
    card2: ComparableCard,
    dominantColor: CardSuit
  ): -1 | 0 | 1 {
    if (card1.suit === card2.suit) return 0

    const weakColor = getOppositeColor(dominantColor)

    // Dominant color beats everything
    if (card1.suit === dominantColor) return 1
    if (card2.suit === dominantColor) return -1

    // Weak color loses to everything
    if (card1.suit === weakColor) return -1
    if (card2.suit === weakColor) return 1

    // Both are neutral colors → same color type as dominant wins
    const isDominantRed = this.isRedSuit(dominantColor)
    const isCard1Red = this.isRedSuit(card1.suit)

    return isCard1Red === isDominantRed ? 1 : -1
  }

  /**
   * Find the winner among multiple played cards
   * DEPRECATED: Use findTrickWinner() for proper trick resolution
   *
   * @param playedCards Map of player IDs to their played cards
   * @param dominantColor The dominant color from the roulette
   * @returns The player ID of the winner
   */
  findWinner(playedCards: Map<number, ComparableCard>, dominantColor: CardSuit): number {
    if (playedCards.size === 0) {
      throw new Error('Cannot find winner with no cards played')
    }

    // Convert to PlayedCard array
    const playedCardsArray: PlayedCard[] = Array.from(playedCards.entries()).map(
      ([playerId, card]) => ({
        ...card,
        playerId,
      })
    )

    // Use new trick winner logic
    const result = this.findTrickWinner(playedCardsArray, dominantColor)
    return result.winnerCard.playerId
  }

  /**
   * Get the relationship between two colors given a dominant color
   * Used for detailed analysis/debugging
   *
   * @param color1 First color
   * @param color2 Second color
   * @param dominantColor The dominant color
   * @returns Relationship: "stronger", "weaker", or "equal"
   */
  getColorRelation(
    color1: CardSuit,
    color2: CardSuit,
    dominantColor: CardSuit
  ): 'stronger' | 'weaker' | 'equal' {
    if (color1 === color2) return 'equal'

    const weakColor = getOppositeColor(dominantColor)

    // Strong color beats everything
    if (color1 === dominantColor) return 'stronger'
    if (color2 === dominantColor) return 'weaker'

    // Weak color loses to everything
    if (color1 === weakColor) return 'weaker'
    if (color2 === weakColor) return 'stronger'

    // Both neutral → check red/black alignment with dominant
    const isDominantRed = this.isRedSuit(dominantColor)
    const isColor1Red = this.isRedSuit(color1)

    return isColor1Red === isDominantRed ? 'stronger' : 'weaker'
  }

  /**
   * Get the opposite color
   * DEPRECATED: Use getOppositeColor from color_relations constants instead
   *
   * @param color The color
   * @returns The opposite color
   */
  getOppositeColor(color: CardSuit): CardSuit {
    return getOppositeColor(color)
  }

  /**
   * Check if a suit is red (hearts or diamonds)
   *
   * @param suit The suit to check
   * @returns True if red, false if black
   */
  isRedSuit(suit: CardSuit): boolean {
    return this.RED_SUITS.includes(suit)
  }

  /**
   * Get the complete color hierarchy for a given dominant color
   * Returns colors from strongest to weakest
   *
   * @param dominantColor The dominant color
   * @returns Array of colors in order of strength
   */
  getColorHierarchy(dominantColor: CardSuit): CardSuit[] {
    const weakColor = getOppositeColor(dominantColor)
    const isDominantRed = this.isRedSuit(dominantColor)

    // Find the two neutral colors
    const allColors: CardSuit[] = [
      CardSuit.HEARTS,
      CardSuit.DIAMONDS,
      CardSuit.CLUBS,
      CardSuit.SPADES,
    ]
    const neutralColors = allColors.filter((c) => c !== dominantColor && c !== weakColor)

    // Separate neutral colors by red/black
    const redNeutral = neutralColors.find((c) => this.isRedSuit(c))
    const blackNeutral = neutralColors.find((c) => !this.isRedSuit(c))

    // Build hierarchy
    const hierarchy: CardSuit[] = [dominantColor]

    if (isDominantRed) {
      // Red dominant → red neutral > black neutral > weak
      if (redNeutral) hierarchy.push(redNeutral)
      if (blackNeutral) hierarchy.push(blackNeutral)
    } else {
      // Black dominant → black neutral > red neutral > weak
      if (blackNeutral) hierarchy.push(blackNeutral)
      if (redNeutral) hierarchy.push(redNeutral)
    }

    hierarchy.push(weakColor)

    return hierarchy
  }

  /**
   * Get a detailed explanation of why a card won
   * Useful for UI feedback and debugging
   * DEPRECATED: Use WinningReason from findTrickWinner() instead
   *
   * @param winningCard The winning card
   * @param losingCard The losing card
   * @param dominantColor The dominant color
   * @returns Human-readable explanation
   */
  getComparisonExplanation(
    winningCard: ComparableCard,
    losingCard: ComparableCard,
    dominantColor: CardSuit
  ): string {
    // Color hierarchy comparison
    const colorComparison = this.compareCardsByColor(winningCard, losingCard, dominantColor)

    if (colorComparison !== 0) {
      const weakColor = getOppositeColor(dominantColor)

      if (winningCard.suit === dominantColor) {
        return `Dominant color (${dominantColor})`
      }

      if (losingCard.suit === weakColor) {
        return `Opponent has weak color (${weakColor})`
      }

      // Neutral color logic
      const isDominantRed = this.isRedSuit(dominantColor)
      return isDominantRed
        ? 'Red neutral beats black neutral (red is dominant)'
        : 'Black neutral beats red neutral (black is dominant)'
    }

    // Same color → value difference
    return `Higher value (${winningCard.value} > ${losingCard.value})`
  }
}

// Export singleton instance
export default new CardComparisonService()
