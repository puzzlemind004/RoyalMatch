import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { CardSuit } from '../../../../models/card.model';
import { CardComparisonService } from '../../../../core/services/card-comparison.service';
import type { PlayedCard, TrickWinnerResult } from '../../../../core/services/card-comparison.service';

interface SelectableCard {
  value: string;
  suit: CardSuit;
  selected: boolean;
}

@Component({
  selector: 'app-trick-resolution-demo',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './trick-resolution-demo.component.html',
  styleUrl: './trick-resolution-demo.component.css',
})
export class TrickResolutionDemoComponent {
  // Signals
  dominantColor = signal<CardSuit>(CardSuit.HEARTS);
  availableCards = signal<SelectableCard[]>(this.initializeCards());

  // Computed signals
  selectedCards = computed(() =>
    this.availableCards().filter(card => card.selected)
  );

  selectedCount = computed(() => this.selectedCards().length);

  canSelectMore = computed(() => this.selectedCount() < 4);

  trickResult = computed<TrickWinnerResult | null>(() => {
    const selected = this.selectedCards();
    if (selected.length === 0) return null;

    const playedCards: PlayedCard[] = selected.map((card, index) => ({
      value: card.value,
      suit: card.suit,
      playerId: index + 1,
    }));

    return this.cardComparison.findTrickWinner(playedCards, this.dominantColor());
  });

  constructor(private cardComparison: CardComparisonService) {}

  /**
   * Initialize card deck (4-6 cards per suit)
   */
  private initializeCards(): SelectableCard[] {
    const suits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];
    const values = ['2', '3', '5', '7', '10', 'K', 'A']; // 7 cards per suit
    const cards: SelectableCard[] = [];

    for (const suit of suits) {
      for (const value of values) {
        cards.push({ value, suit, selected: false });
      }
    }

    return cards;
  }

  /**
   * Get cards grouped by suit
   */
  getCardsBySuit(): Map<CardSuit, SelectableCard[]> {
    const grouped = new Map<CardSuit, SelectableCard[]>();
    const suits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];

    for (const suit of suits) {
      grouped.set(suit, this.availableCards().filter(card => card.suit === suit));
    }

    return grouped;
  }

  /**
   * Toggle card selection
   */
  toggleCard(card: SelectableCard): void {
    if (card.selected) {
      // Deselect
      this.updateCardSelection(card, false);
    } else if (this.canSelectMore()) {
      // Select if we can
      this.updateCardSelection(card, true);
    }
  }

  /**
   * Update card selection state
   */
  private updateCardSelection(targetCard: SelectableCard, selected: boolean): void {
    this.availableCards.update(cards =>
      cards.map(card =>
        card.value === targetCard.value && card.suit === targetCard.suit
          ? { ...card, selected }
          : card
      )
    );
  }

  /**
   * Reset all selections
   */
  resetTrick(): void {
    this.availableCards.update(cards =>
      cards.map(card => ({ ...card, selected: false }))
    );
  }

  /**
   * Change dominant color
   */
  setDominantColor(color: CardSuit): void {
    this.dominantColor.set(color);
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
    return suit === CardSuit.HEARTS || suit === CardSuit.DIAMONDS
      ? 'text-red-600'
      : 'text-black';
  }

  /**
   * Get color hierarchy label
   */
  getColorLabel(suit: CardSuit): string {
    const dominant = this.dominantColor();
    const weak = this.cardComparison.getOppositeColor(dominant);

    if (suit === dominant) return 'FORTE';
    if (suit === weak) return 'FAIBLE';
    return 'Neutre';
  }

  /**
   * Get color hierarchy badge class
   */
  getColorBadgeClass(suit: CardSuit): string {
    const dominant = this.dominantColor();
    const weak = this.cardComparison.getOppositeColor(dominant);

    if (suit === dominant) return 'bg-yellow-500 text-black font-bold';
    if (suit === weak) return 'bg-gray-400 text-white';
    return 'bg-blue-500 text-white';
  }

  /**
   * Get winning reason text
   */
  getWinningReasonText(): string {
    const result = this.trickResult();
    if (!result) return '';

    const reason = result.reason;

    switch (reason.type) {
      case 'only_card_played':
        return 'Seule carte jouée';
      case 'only_dominant_color':
        return `Seule carte de la couleur FORTE (${this.getSuitSymbol(reason.suit)})`;
      case 'only_card_of_strongest_color':
        return `Seule carte de la couleur la plus forte (${this.getSuitSymbol(reason.suit)})`;
      case 'highest_value_among_dominant':
        return `Plus haute valeur parmi les cartes FORTES (${reason.value})`;
      case 'highest_value_among_color':
        return `Plus haute valeur parmi les ${this.getSuitSymbol(reason.suit)} (${reason.value})`;
      case 'highest_value':
        return `Plus haute valeur (${reason.value})`;
      default:
        return 'Victoire';
    }
  }

  /**
   * Check if a card is the winner
   */
  isWinningCard(card: SelectableCard): boolean {
    const result = this.trickResult();
    if (!result) return false;

    return (
      result.winnerCard.value === card.value &&
      result.winnerCard.suit === card.suit
    );
  }

  /**
   * Get card CSS classes
   */
  getCardClasses(card: SelectableCard): string {
    const base = 'relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105';
    const selected = card.selected ? 'border-blue-600 bg-blue-50 scale-105' : 'border-gray-300 hover:border-gray-400';
    const disabled = !card.selected && !this.canSelectMore() ? 'opacity-50 cursor-not-allowed' : '';
    const winner = this.isWinningCard(card) ? 'ring-4 ring-yellow-400 animate-pulse' : '';

    return `${base} ${selected} ${disabled} ${winner}`;
  }

  // Expose CardSuit enum to template
  readonly CardSuit = CardSuit;
}
