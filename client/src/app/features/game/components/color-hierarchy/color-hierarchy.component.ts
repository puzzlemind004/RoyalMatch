/**
 * Color Hierarchy Component
 *
 * Displays the current color hierarchy based on the dominant color
 */

import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService, TranslocoPipe } from '@jsverse/transloco';
import { CardSuit, SUIT_SYMBOLS } from '../../../../models/card.model';
import {
  getOppositeColor,
  getColorBadge,
  getColorBadgeClass,
  getSuitColor,
} from '../../../../core/utils/color-relations';

@Component({
  selector: 'app-color-hierarchy',
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './color-hierarchy.component.html',
  styleUrls: ['./color-hierarchy.component.css'],
})
export class ColorHierarchyComponent {
  private transloco = inject(TranslocoService);
  /**
   * The current dominant/strong color
   */
  dominantColor = input.required<CardSuit>();

  /**
   * Computed weak color (opposite of dominant)
   */
  weakColor = computed(() => getOppositeColor(this.dominantColor()));

  /**
   * All suits in display order
   */
  allSuits: CardSuit[] = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];

  /**
   * Get the suit symbol
   */
  getSuitSymbol(suit: CardSuit): string {
    return SUIT_SYMBOLS[suit];
  }

  /**
   * Get the suit color (for CSS)
   */
  getSuitColor(suit: CardSuit): string {
    return getSuitColor(suit);
  }

  /**
   * Get the badge text for a suit
   */
  getBadgeText(suit: CardSuit): string {
    if (suit === this.dominantColor()) return this.transloco.translate('game.hierarchy.dominant');
    if (suit === this.weakColor()) return this.transloco.translate('game.hierarchy.weak');
    return this.transloco.translate('game.hierarchy.neutral');
  }

  /**
   * Get the badge CSS classes for a suit
   */
  getBadgeClass(suit: CardSuit): string {
    const badge = getColorBadge(suit, this.dominantColor());
    return getColorBadgeClass(badge);
  }
}
