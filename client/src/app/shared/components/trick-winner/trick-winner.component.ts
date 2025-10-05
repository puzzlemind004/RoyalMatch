import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import type {
  ComparableCard,
  CardComparisonService,
} from '../../../core/services/card-comparison.service';
import { CardSuit } from '../../../models/card.model';

/**
 * Played card with player info
 */
export interface PlayedCardInfo {
  playerId: number;
  playerName: string;
  card: ComparableCard;
}

/**
 * Trick Winner Component
 * Displays visual feedback about which card won and why
 */
@Component({
  selector: 'app-trick-winner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trick-winner.component.html',
  styleUrl: './trick-winner.component.css',
})
export class TrickWinnerComponent {
  private transloco = inject(TranslocoService);

  // Inputs
  playedCards = input.required<PlayedCardInfo[]>();
  dominantColor = input.required<CardSuit>();
  showExplanation = input<boolean>(true);

  // Computed winner
  winner = computed(() => {
    const cards = this.playedCards();
    if (cards.length === 0) return null;

    // Find the winning card
    let winningCard = cards[0];
    for (const card of cards) {
      if (this.compareCards(card.card, winningCard.card) > 0) {
        winningCard = card;
      }
    }

    return winningCard;
  });

  // Computed explanation
  explanation = computed(() => {
    const winner = this.winner();
    if (!winner) return '';

    const cards = this.playedCards();
    const otherCards = cards.filter((c) => c.playerId !== winner.playerId);
    if (otherCards.length === 0) return this.transloco.translate('game.tricks.onlyCardPlayed');

    // Compare with the best losing card
    let bestLoser = otherCards[0];
    for (const card of otherCards) {
      if (this.compareCards(card.card, bestLoser.card) > 0) {
        bestLoser = card;
      }
    }

    return this.getExplanation(winner.card, bestLoser.card);
  });

  /**
   * Compare two cards (using the same logic as CardComparisonService)
   */
  private compareCards(card1: ComparableCard, card2: ComparableCard): -1 | 0 | 1 {
    const value1 = this.getNumericValue(card1.value);
    const value2 = this.getNumericValue(card2.value);

    if (value1 !== value2) {
      return value1 > value2 ? 1 : -1;
    }

    const dominantColor = this.dominantColor();
    const weakColor = this.getOppositeColor(dominantColor);

    if (card1.suit === dominantColor) return 1;
    if (card2.suit === dominantColor) return -1;

    if (card1.suit === weakColor) return -1;
    if (card2.suit === weakColor) return 1;

    const isDominantRed = this.isRedSuit(dominantColor);
    const isCard1Red = this.isRedSuit(card1.suit);

    return isCard1Red === isDominantRed ? 1 : -1;
  }

  /**
   * Get explanation for why a card won
   */
  private getExplanation(winningCard: ComparableCard, losingCard: ComparableCard): string {
    const winValue = this.getNumericValue(winningCard.value);
    const loseValue = this.getNumericValue(losingCard.value);

    if (winValue !== loseValue) {
      return this.transloco.translate('game.tricks.higherValue', {
        winner: winningCard.value,
        loser: losingCard.value,
      });
    }

    const dominantColor = this.dominantColor();
    const weakColor = this.getOppositeColor(dominantColor);

    if (winningCard.suit === dominantColor) {
      return this.transloco.translate('game.tricks.dominantColor');
    }

    if (losingCard.suit === weakColor) {
      return this.transloco.translate('game.tricks.opponentWeakColor');
    }

    const isDominantRed = this.isRedSuit(dominantColor);
    return isDominantRed
      ? this.transloco.translate('game.tricks.redNeutral')
      : this.transloco.translate('game.tricks.blackNeutral');
  }

  /**
   * Get suit symbol
   */
  getSuitSymbol(suit: CardSuit): string {
    const symbols: Record<CardSuit, string> = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    };
    return symbols[suit];
  }

  /**
   * Get suit color class
   */
  getSuitColorClass(suit: CardSuit): string {
    return this.isRedSuit(suit) ? 'text-red-600' : 'text-black';
  }

  /**
   * Check if card is the winner
   */
  isWinner(playerId: number): boolean {
    return this.winner()?.playerId === playerId;
  }

  // Helper methods
  private getNumericValue(value: string): number {
    const map: Record<string, number> = {
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
    return map[value] ?? 0;
  }

  private getOppositeColor(color: CardSuit): CardSuit {
    const opposites: Record<CardSuit, CardSuit> = {
      [CardSuit.HEARTS]: CardSuit.SPADES,
      [CardSuit.SPADES]: CardSuit.HEARTS,
      [CardSuit.DIAMONDS]: CardSuit.CLUBS,
      [CardSuit.CLUBS]: CardSuit.DIAMONDS,
    };
    return opposites[color];
  }

  private isRedSuit(suit: CardSuit): boolean {
    return suit === CardSuit.HEARTS || suit === CardSuit.DIAMONDS;
  }
}
