import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardSuit, SUIT_SYMBOLS, SUIT_COLORS } from '../../../models/card.model';

/**
 * Color Hierarchy Component
 * Displays the color hierarchy for the current round in a simple vertical layout
 * - Dominant color (with crown and colored background)
 * - Strong neutral color (red if dominant is red, black if dominant is black)
 * - Weak neutral color (the other neutral)
 * - Weak color
 */
@Component({
  selector: 'app-color-hierarchy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-hierarchy.component.html',
})
export class ColorHierarchyComponent {
  // Input: dominant color
  readonly dominantColor = input.required<CardSuit>();

  // Input: weak color
  readonly weakColor = input.required<CardSuit>();

  // Input: neutral colors
  readonly neutralColors = input.required<CardSuit[]>();

  /**
   * Computed: ordered hierarchy from strongest to weakest
   */
  readonly hierarchy = computed(() => {
    const dominant = this.dominantColor();
    const weak = this.weakColor();
    const neutrals = this.neutralColors();

    // Determine which neutral is "stronger"
    // If dominant is red (hearts/diamonds), red neutral comes first
    // If dominant is black (clubs/spades), black neutral comes first
    const isDominantRed = SUIT_COLORS[dominant] === 'red';

    const strongNeutral = neutrals.find((suit) => {
      const isRed = SUIT_COLORS[suit] === 'red';
      return isDominantRed ? isRed : !isRed;
    });

    const weakNeutral = neutrals.find((suit) => suit !== strongNeutral);

    return [
      { suit: dominant, type: 'dominant' as const },
      { suit: strongNeutral!, type: 'neutral-strong' as const },
      { suit: weakNeutral!, type: 'neutral-weak' as const },
      { suit: weak, type: 'weak' as const },
    ];
  });

  /**
   * Gets the suit symbol
   */
  getSuitSymbol(suit: CardSuit): string {
    return SUIT_SYMBOLS[suit];
  }

  /**
   * Gets the suit color class
   */
  getSuitColorClass(suit: CardSuit): string {
    return SUIT_COLORS[suit] === 'red' ? 'text-red-600' : 'text-gray-900';
  }

  /**
   * Gets the background class for a hierarchy item
   */
  getBackgroundClass(type: 'dominant' | 'neutral-strong' | 'neutral-weak' | 'weak'): string {
    if (type === 'dominant') {
      return 'bg-gradient-to-r from-yellow-400 to-orange-400';
    }
    return 'bg-transparent';
  }
}
