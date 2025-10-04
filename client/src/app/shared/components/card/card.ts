import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import {
  CardSuit,
  SUIT_SYMBOLS,
  SUIT_COLORS,
  VALUE_DISPLAY_NAMES,
} from '../../../models/card.model';
import type { Card } from '../../../models/card.model';

@Component({
  selector: 'app-card',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class CardComponent {
  // Inputs
  card = input.required<Card>();
  faceUp = input<boolean>(true);
  selectable = input<boolean>(false);
  selected = input<boolean>(false);
  dominantColor = input<CardSuit | null>(null); // For showing strong/weak badges

  // Output
  cardSelected = output<Card>();

  // Tooltip state for mobile
  showTooltip = signal(false);

  // Helper getters
  get suitSymbol(): string {
    return SUIT_SYMBOLS[this.card().suit];
  }

  get suitColor(): 'red' | 'black' {
    return SUIT_COLORS[this.card().suit];
  }

  get valueDisplay(): string {
    return VALUE_DISPLAY_NAMES[this.card().value];
  }

  get effectTranslationKey(): string {
    return `cards.effects.${this.card().effect.type}`;
  }

  get ribbonGradient(): string {
    const suit = this.card().suit;
    switch (suit) {
      case CardSuit.HEARTS:
        return 'from-rose-600 to-rose-700'; // Rouge framboise
      case CardSuit.DIAMONDS:
        return 'from-orange-500 to-orange-600'; // Orange
      case CardSuit.SPADES:
        return 'from-purple-900 to-purple-950'; // Violet foncé
      case CardSuit.CLUBS:
        return 'from-emerald-900 to-slate-900'; // Noir verdâtre
      default:
        return 'from-gray-800 to-gray-700';
    }
  }

  get colorStrength(): 'strong' | 'weak' | 'neutral' | null {
    const dominant = this.dominantColor();
    if (!dominant) return null;

    const suit = this.card().suit;
    if (suit === dominant) return 'strong';

    const opposite = this.getOppositeColor(dominant);
    if (suit === opposite) return 'weak';

    return 'neutral';
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

  // Methods
  onCardClick(): void {
    if (this.selectable()) {
      this.cardSelected.emit(this.card());
    } else {
      // Toggle tooltip on mobile when card is not selectable
      this.showTooltip.update((v) => !v);
    }
  }

  onCardTap(event: Event): void {
    // For mobile: show tooltip on tap if selectable
    if (this.selectable()) {
      event.stopPropagation();
      this.showTooltip.set(true);
      setTimeout(() => this.showTooltip.set(false), 3000);
    }
  }
}
