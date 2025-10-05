import { Injectable } from '@angular/core';
import { CardSuit } from '../../models/card.model';
import type { Card } from '../../models/card.model';

/**
 * Card for comparison (simplified structure)
 */
export interface ComparableCard {
  value: string; // '2'-'10', 'J', 'Q', 'K', 'A'
  suit: CardSuit;
}

/**
 * Card Comparison Service (Frontend)
 * Mirrors backend logic for client-side predictions and animations
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
   * Compare two cards and determine which is stronger
   *
   * @param card1 First card
   * @param card2 Second card
   * @param dominantColor The dominant color from the roulette
   * @returns 1 if card1 > card2, -1 if card1 < card2, 0 should never happen
   */
  compareCards(card1: ComparableCard, card2: ComparableCard, dominantColor: CardSuit): -1 | 0 | 1 {
    const value1 = this.getNumericValue(card1.value);
    const value2 = this.getNumericValue(card2.value);

    // Priority 1: Compare numeric values
    if (value1 !== value2) {
      return value1 > value2 ? 1 : -1;
    }

    // Priority 2: Values are equal → compare colors using hierarchy
    const weakColor = this.getOppositeColor(dominantColor);

    // Strong color beats everything
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
   *
   * @param playedCards Map of player IDs to their cards
   * @param dominantColor The dominant color
   * @returns The player ID of the winner
   */
  findWinner(playedCards: Map<number, ComparableCard>, dominantColor: CardSuit): number | null {
    if (playedCards.size === 0) {
      return null;
    }

    let winningPlayerId: number | null = null;
    let winningCard: ComparableCard | null = null;

    for (const [playerId, card] of playedCards.entries()) {
      if (winningCard === null) {
        winningPlayerId = playerId;
        winningCard = card;
      } else {
        const comparison = this.compareCards(card, winningCard, dominantColor);
        if (comparison > 0) {
          winningPlayerId = playerId;
          winningCard = card;
        }
      }
    }

    return winningPlayerId;
  }

  /**
   * Get the opposite color
   */
  getOppositeColor(color: CardSuit): CardSuit {
    return this.OPPOSITE_COLORS[color];
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
   */
  getComparisonExplanation(
    winningCard: ComparableCard,
    losingCard: ComparableCard,
    dominantColor: CardSuit,
  ): string {
    const winValue = this.getNumericValue(winningCard.value);
    const loseValue = this.getNumericValue(losingCard.value);

    // Value difference
    if (winValue !== loseValue) {
      return `Valeur plus haute (${winningCard.value} > ${losingCard.value})`;
    }

    // Color hierarchy
    const weakColor = this.getOppositeColor(dominantColor);

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
