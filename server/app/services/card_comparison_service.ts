/**
 * Card Comparison Service
 * Implements the card comparison logic to determine trick winners
 * Uses the color roulette system with dominant/weak/neutral colors
 */

import { CardSuit } from '#types/card'

/**
 * Represents a card for comparison purposes
 */
export interface ComparableCard {
  value: number // Numeric value (2-14, where A=14)
  suit: CardSuit
}

/**
 * Card comparison service
 * Critical logic that determines who wins tricks
 */
export class CardComparisonService {
  /**
   * Color opposites mapping
   * Hearts ↔ Spades, Diamonds ↔ Clubs
   */
  private readonly OPPOSITE_COLORS: Record<CardSuit, CardSuit> = {
    [CardSuit.HEARTS]: CardSuit.SPADES,
    [CardSuit.SPADES]: CardSuit.HEARTS,
    [CardSuit.DIAMONDS]: CardSuit.CLUBS,
    [CardSuit.CLUBS]: CardSuit.DIAMONDS,
  }

  /**
   * Red suits
   */
  private readonly RED_SUITS: CardSuit[] = [CardSuit.HEARTS, CardSuit.DIAMONDS]

  /**
   * Compare two cards and determine which is stronger
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
    // Priority 1: Compare numeric values
    if (card1.value !== card2.value) {
      return card1.value > card2.value ? 1 : -1
    }

    // Priority 2: Values are equal → compare colors using hierarchy
    const weakColor = this.getOppositeColor(dominantColor)

    // Strong color beats everything
    if (card1.suit === dominantColor) return 1
    if (card2.suit === dominantColor) return -1

    // Weak color loses to everything
    if (card1.suit === weakColor) return -1
    if (card2.suit === weakColor) return 1

    // Both are neutral colors → same color type as dominant wins
    // If dominant is red, red neutral beats black neutral
    // If dominant is black, black neutral beats red neutral
    const isDominantRed = this.isRedSuit(dominantColor)
    const isCard1Red = this.isRedSuit(card1.suit)

    return isCard1Red === isDominantRed ? 1 : -1
  }

  /**
   * Find the winner among multiple played cards
   *
   * @param playedCards Map of player IDs to their played cards
   * @param dominantColor The dominant color from the roulette
   * @returns The player ID of the winner
   */
  findWinner(playedCards: Map<number, ComparableCard>, dominantColor: CardSuit): number {
    if (playedCards.size === 0) {
      throw new Error('Cannot find winner with no cards played')
    }

    let winningPlayerId: number | null = null
    let winningCard: ComparableCard | null = null

    for (const [playerId, card] of playedCards.entries()) {
      if (winningCard === null) {
        winningPlayerId = playerId
        winningCard = card
      } else {
        const comparison = this.compareCards(card, winningCard, dominantColor)
        if (comparison > 0) {
          winningPlayerId = playerId
          winningCard = card
        }
      }
    }

    if (winningPlayerId === null) {
      throw new Error('Failed to determine winner')
    }

    return winningPlayerId
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

    const weakColor = this.getOppositeColor(dominantColor)

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
   *
   * @param color The color
   * @returns The opposite color
   */
  getOppositeColor(color: CardSuit): CardSuit {
    return this.OPPOSITE_COLORS[color]
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
    const weakColor = this.getOppositeColor(dominantColor)
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
    // Value difference
    if (winningCard.value !== losingCard.value) {
      return `Higher value (${winningCard.value} > ${losingCard.value})`
    }

    // Color hierarchy
    const weakColor = this.getOppositeColor(dominantColor)

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
}

// Export singleton instance
export default new CardComparisonService()
