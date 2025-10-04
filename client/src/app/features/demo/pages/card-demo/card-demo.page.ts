import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CardComponent } from '../../../../shared/components/card/card';
import type { Card } from '../../../../models/card.model';
import { CardSuit, CardValue } from '../../../../models/card.model';

@Component({
  selector: 'app-card-demo',
  imports: [CommonModule, CardComponent, TranslocoModule],
  templateUrl: './card-demo.page.html',
  styleUrl: './card-demo.page.css',
})
export class CardDemoPage {
  constructor(private transloco: TranslocoService) {}
  // Sample cards for demonstration
  sampleCards: Card[] = [
    {
      id: '1',
      value: CardValue.ACE,
      suit: CardSuit.HEARTS,
      numericValue: 14,
      effect: { type: 'objective_ultimate', target: 'self' },
    },
    {
      id: '2',
      value: CardValue.KING,
      suit: CardSuit.SPADES,
      numericValue: 13,
      effect: { type: 'devastate', target: 'all' },
    },
    {
      id: '3',
      value: CardValue.QUEEN,
      suit: CardSuit.DIAMONDS,
      numericValue: 12,
      effect: { type: 'resurrect', target: 'self' },
    },
    {
      id: '4',
      value: CardValue.JACK,
      suit: CardSuit.CLUBS,
      numericValue: 11,
      effect: { type: 'jackpot', target: 'self' },
    },
    {
      id: '5',
      value: CardValue.TEN,
      suit: CardSuit.HEARTS,
      numericValue: 10,
      effect: { type: 'protection_strong', target: 'self' },
    },
    {
      id: '6',
      value: CardValue.FIVE,
      suit: CardSuit.DIAMONDS,
      numericValue: 5,
      effect: { type: 'draw', target: 'self' },
    },
  ];

  selectedCard = signal<Card | null>(null);

  // Initialize card states as a Record for better reactivity
  cardsState = signal<Record<string, { faceUp: boolean; selectable: boolean }>>(
    this.sampleCards.reduce(
      (acc, card) => {
        acc[card.id] = { faceUp: true, selectable: true };
        return acc;
      },
      {} as Record<string, { faceUp: boolean; selectable: boolean }>,
    ),
  );

  onCardSelected(card: Card): void {
    this.selectedCard.set(card);
  }

  toggleCardFace(cardId: string): void {
    this.cardsState.update((state) => ({
      ...state,
      [cardId]: {
        ...state[cardId],
        faceUp: !state[cardId].faceUp,
      },
    }));
  }

  toggleCardSelectable(cardId: string): void {
    this.cardsState.update((state) => ({
      ...state,
      [cardId]: {
        ...state[cardId],
        selectable: !state[cardId].selectable,
      },
    }));
  }

  getCardState(cardId: string) {
    return this.cardsState()[cardId] || { faceUp: true, selectable: false };
  }

  isSelected(card: Card): boolean {
    return this.selectedCard()?.id === card.id;
  }

  get currentLocale(): string {
    return this.transloco.getActiveLang();
  }

  switchLocale(locale: string): void {
    this.transloco.setActiveLang(locale);
  }
}
