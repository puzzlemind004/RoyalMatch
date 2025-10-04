import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import type { Card } from '../../../models/card.model';
import { SUIT_SYMBOLS, SUIT_COLORS, VALUE_DISPLAY_NAMES } from '../../../models/card.model';

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
      case 'hearts':
        return 'from-rose-600 to-rose-700'; // Rouge framboise
      case 'diamonds':
        return 'from-orange-500 to-orange-600'; // Orange
      case 'spades':
        return 'from-purple-900 to-purple-950'; // Violet foncé
      case 'clubs':
        return 'from-emerald-900 to-slate-900'; // Noir verdâtre
      default:
        return 'from-gray-800 to-gray-700';
    }
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
