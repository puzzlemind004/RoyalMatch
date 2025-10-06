import { Injectable } from '@angular/core';
import { CardSuit } from '../../models/card.model';
import type { Card } from '../../models/card.model';
import { getOppositeColor, getColorType } from '../utils/color-relations';

/**
 * Card for comparison (simplified structure)
 */
export interface ComparableCard {
  value: string; // '2'-'10', 'J', 'Q', 'K', 'A'
  suit: CardSuit;
}

/**
 * Played card with player info
 */
export interface PlayedCard extends ComparableCard {
  playerId: number;
}

/**
 * Result of trick winner determination
 */
export interface TrickWinnerResult {
  winnerCard: PlayedCard;
  reason: WinningReason;
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
  | { type: 'highest_value'; value: number };

/**
 * Card Comparison Service (Frontend)
 * Mirrors backend logic for client-side predictions and animations
 *
 * NEW LOGIC: Color trumps value (like classic trump card games)
 */
@Injectable({
  providedIn: 'root',
})
export class CardComparisonService {
  /**
   * Color opposites mapping
   */
  private readonly OPPOSITE_COLORS: Record<CardSuit, CardSuit> = {
    [CardSuit.HEARTS]: CardSuit.SPADES,
    [CardSuit.SPADES]: CardSuit.HEARTS,
    [CardSuit.DIAMONDS]: CardSuit.CLUBS,
    [CardSuit.CLUBS]: CardSuit.DIAMONDS,
  };

  /**
   * Red suits
   */
  private readonly RED_SUITS: CardSuit[] = [CardSuit.HEARTS, CardSuit.DIAMONDS];

  /**
   * Card value mapping to numeric values
   */
  private readonly VALUE_MAP: Record<string, number> = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };

  /**
   * Convert card value to numeric value
   */
  private getNumericValue(value: string): number {
    return this.VALUE_MAP[value] ?? 0;
  }

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
      throw new Error('No cards played');
    }

    if (playedCards.length === 1) {
      return {
        winnerCard: playedCards[0],
        reason: { type: 'only_card_played' },
      };
    }

    // 1. Identify the strongest color present in the trick
    const strongestColorInTrick = this.getStrongestColorInTrick(playedCards, dominantColor);

    // 2. Filter to keep only cards of that color
    const cardsOfStrongestColor = playedCards.filter((card) => card.suit === strongestColorInTrick);

    // 3. Compare by value
    const winner = cardsOfStrongestColor.reduce((highest, current) => {
      const highestValue = this.getNumericValue(highest.value);
      const currentValue = this.getNumericValue(current.value);
      return currentValue > highestValue ? current : highest;
    });

    // 4. Determine winning reason
    const reason = this.getWinningReason(
      winner,
      cardsOfStrongestColor,
      strongestColorInTrick,
      dominantColor,
    );

    return { winnerCard: winner, reason };
  }

  /**
   * Find the strongest color present in the trick
   */
  private getStrongestColorInTrick(cards: PlayedCard[], dominantColor: CardSuit): CardSuit {
    const weakColor = getOppositeColor(dominantColor);
    const colorsInTrick = new Set(cards.map((c) => c.suit));

    // If dominant color is present → it wins
    if (colorsInTrick.has(dominantColor)) {
      return dominantColor;
    }

    // Otherwise, find the best neutral color
    const neutralColors = Array.from(colorsInTrick).filter((color) => color !== weakColor);

    if (neutralColors.length > 0) {
      // Prioritize neutral of same color type (red/black) as dominant
      const dominantType = getColorType(dominantColor);
      const sameTypeNeutral = neutralColors.find((color) => getColorType(color) === dominantType);
      return sameTypeNeutral || neutralColors[0];
    }

    // Otherwise, weak color is the only one present
    return weakColor;
  }

  /**
   * Determine the reason why a card won
   */
  private getWinningReason(
    winner: PlayedCard,
    cardsOfSameColor: PlayedCard[],
    strongestColor: CardSuit,
    dominantColor: CardSuit,
  ): WinningReason {
    // Only card of this color
    if (cardsOfSameColor.length === 1) {
      if (strongestColor === dominantColor) {
        return {
          type: 'only_dominant_color',
          suit: dominantColor,
        };
      }
      return {
        type: 'only_card_of_strongest_color',
        suit: strongestColor,
      };
    }

    // Multiple cards of same color → decided by value
    if (strongestColor === dominantColor) {
      return {
        type: 'highest_value_among_dominant',
        value: this.getNumericValue(winner.value),
      };
    }

    return {
      type: 'highest_value_among_color',
      suit: strongestColor,
      value: this.getNumericValue(winner.value),
    };
  }

  /**
   * Compare two cards and determine which is stronger
   * DEPRECATED: Use findTrickWinner() for proper trick resolution
   *
   * @param card1 First card
   * @param card2 Second card
   * @param dominantColor The dominant color from the roulette
   * @returns 1 if card1 > card2, -1 if card1 < card2, 0 should never happen
   */
  compareCards(card1: ComparableCard, card2: ComparableCard, dominantColor: CardSuit): -1 | 0 | 1 {
    // Priority 1: Compare by color hierarchy
    const colorComparison = this.compareCardsByColor(card1, card2, dominantColor);
    if (colorComparison !== 0) {
      return colorComparison;
    }

    // Priority 2: Same color → compare by value
    const value1 = this.getNumericValue(card1.value);
    const value2 = this.getNumericValue(card2.value);

    if (value1 !== value2) {
      return value1 > value2 ? 1 : -1;
    }

    // Should never happen (same color and same value)
    return 0;
  }

  /**
   * Compare two cards by their color hierarchy only
   */
  private compareCardsByColor(
    card1: ComparableCard,
    card2: ComparableCard,
    dominantColor: CardSuit,
  ): -1 | 0 | 1 {
    if (card1.suit === card2.suit) return 0;

    const weakColor = getOppositeColor(dominantColor);

    // Dominant color beats everything
    if (card1.suit === dominantColor) return 1;
    if (card2.suit === dominantColor) return -1;

    // Weak color loses to everything
    if (card1.suit === weakColor) return -1;
    if (card2.suit === weakColor) return 1;

    // Both are neutral colors → same color type as dominant wins
    const isDominantRed = this.isRedSuit(dominantColor);
    const isCard1Red = this.isRedSuit(card1.suit);

    return isCard1Red === isDominantRed ? 1 : -1;
  }

  /**
   * Find the winner among multiple played cards
   * DEPRECATED: Use findTrickWinner() for proper trick resolution
   *
   * @param playedCards Map of player IDs to their cards
   * @param dominantColor The dominant color
   * @returns The player ID of the winner
   */
  findWinner(playedCards: Map<number, ComparableCard>, dominantColor: CardSuit): number | null {
    if (playedCards.size === 0) {
      return null;
    }

    // Convert to PlayedCard array
    const playedCardsArray: PlayedCard[] = Array.from(playedCards.entries()).map(([playerId, card]) => ({
      ...card,
      playerId,
    }));

    // Use new trick winner logic
    const result = this.findTrickWinner(playedCardsArray, dominantColor);
    return result.winnerCard.playerId;
  }

  /**
   * Get the opposite color
   * DEPRECATED: Use getOppositeColor from color-relations utils instead
   */
  getOppositeColor(color: CardSuit): CardSuit {
    return getOppositeColor(color);
  }

  /**
   * Check if a suit is red
   */
  isRedSuit(suit: CardSuit): boolean {
    return this.RED_SUITS.includes(suit);
  }

  /**
   * Get the complete color hierarchy for a given dominant color
   *
   * @param dominantColor The dominant color
   * @returns Array of colors from strongest to weakest
   */
  getColorHierarchy(dominantColor: CardSuit): CardSuit[] {
    const weakColor = this.getOppositeColor(dominantColor);
    const isDominantRed = this.isRedSuit(dominantColor);

    // Find the two neutral colors
    const allColors: CardSuit[] = [
      CardSuit.HEARTS,
      CardSuit.DIAMONDS,
      CardSuit.CLUBS,
      CardSuit.SPADES,
    ];
    const neutralColors = allColors.filter((c) => c !== dominantColor && c !== weakColor);

    // Separate by red/black
    const redNeutral = neutralColors.find((c) => this.isRedSuit(c));
    const blackNeutral = neutralColors.find((c) => !this.isRedSuit(c));

    // Build hierarchy
    const hierarchy: CardSuit[] = [dominantColor];

    if (isDominantRed) {
      if (redNeutral) hierarchy.push(redNeutral);
      if (blackNeutral) hierarchy.push(blackNeutral);
    } else {
      if (blackNeutral) hierarchy.push(blackNeutral);
      if (redNeutral) hierarchy.push(redNeutral);
    }

    hierarchy.push(weakColor);

    return hierarchy;
  }

  /**
   * Get color strength label for UI display
   */
  getColorStrengthLabel(suit: CardSuit, dominantColor: CardSuit): 'strong' | 'weak' | 'neutral' {
    if (suit === dominantColor) return 'strong';
    if (suit === this.getOppositeColor(dominantColor)) return 'weak';
    return 'neutral';
  }

  /**
   * Get detailed explanation of comparison result
   * DEPRECATED: Use WinningReason from findTrickWinner() instead
   */
  getComparisonExplanation(
    winningCard: ComparableCard,
    losingCard: ComparableCard,
    dominantColor: CardSuit,
  ): string {
    // Color hierarchy comparison
    const colorComparison = this.compareCardsByColor(winningCard, losingCard, dominantColor);

    if (colorComparison !== 0) {
      const weakColor = getOppositeColor(dominantColor);

      if (winningCard.suit === dominantColor) {
        return 'Couleur dominante';
      }

      if (losingCard.suit === weakColor) {
        return 'Adversaire a couleur faible';
      }

      // Neutral color logic
      const isDominantRed = this.isRedSuit(dominantColor);
      return isDominantRed
        ? 'Neutre rouge bat neutre noir (rouge dominant)'
        : 'Neutre noir bat neutre rouge (noir dominant)';
    }

    // Same color → value difference
    return `Valeur plus haute (${winningCard.value} > ${losingCard.value})`;
  }

  /**
   * Check if a card would win against another specific card
   * Useful for UI hints and predictions
   */
  wouldWinAgainst(
    myCard: ComparableCard,
    theirCard: ComparableCard,
    dominantColor: CardSuit,
  ): boolean {
    return this.compareCards(myCard, theirCard, dominantColor) > 0;
  }

  /**
   * Get the winning probability hint for a card
   * Returns a hint about the card's strength given the dominant color
   */
  getCardStrengthHint(card: ComparableCard, dominantColor: CardSuit): string {
    const strength = this.getColorStrengthLabel(card.suit, dominantColor);
    const value = this.getNumericValue(card.value);

    if (value >= 13) {
      // King or Ace
      return strength === 'strong'
        ? 'Très forte'
        : strength === 'weak'
          ? 'Forte (valeur)'
          : 'Forte';
    } else if (value >= 10) {
      return strength === 'strong' ? 'Forte' : strength === 'weak' ? 'Moyenne' : 'Moyenne';
    } else {
      return strength === 'strong' ? 'Moyenne' : strength === 'weak' ? 'Faible' : 'Faible';
    }
  }
}
