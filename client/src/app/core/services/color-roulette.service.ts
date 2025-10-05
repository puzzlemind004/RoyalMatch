import { Injectable, signal, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { CardSuit, SUIT_SYMBOLS } from '../../models/card.model';
import type { RouletteResult } from '../../models/roulette.model';

/**
 * Color Roulette Service
 * Manages color hierarchy state for the current round
 */
@Injectable({
  providedIn: 'root',
})
export class ColorRouletteService {
  private transloco = inject(TranslocoService);

  // Signals for current color hierarchy
  readonly dominantColor = signal<CardSuit | null>(null);
  readonly weakColor = signal<CardSuit | null>(null);
  readonly neutralColors = signal<CardSuit[]>([]);

  /**
   * Updates color hierarchy from server WebSocket event
   */
  updateFromServer(result: RouletteResult): void {
    this.dominantColor.set(result.dominantColor);
    this.weakColor.set(result.weakColor);
    this.neutralColors.set(result.neutrals);
  }

  /**
   * Gets translated label for a card suit based on current hierarchy
   */
  getColorLabel(suit: CardSuit): string {
    const suitSymbol = SUIT_SYMBOLS[suit];

    if (suit === this.dominantColor()) {
      return `${suitSymbol} ${this.transloco.translate('game.roulette.strong')}`;
    }

    if (suit === this.weakColor()) {
      return `${suitSymbol} ${this.transloco.translate('game.roulette.weak')}`;
    }

    return `${suitSymbol} ${this.transloco.translate('game.roulette.neutral')}`;
  }

  /**
   * Gets CSS class for a card suit based on hierarchy
   */
  getColorClass(suit: CardSuit): string {
    if (suit === this.dominantColor()) {
      return 'text-yellow-500 font-bold';
    }

    if (suit === this.weakColor()) {
      return 'text-gray-400 line-through';
    }

    return 'text-blue-500';
  }

  /**
   * Resets the roulette state
   */
  reset(): void {
    this.dominantColor.set(null);
    this.weakColor.set(null);
    this.neutralColors.set([]);
  }

  /**
   * Checks if a color is dominant
   */
  isDominant(suit: CardSuit): boolean {
    return suit === this.dominantColor();
  }

  /**
   * Checks if a color is weak
   */
  isWeak(suit: CardSuit): boolean {
    return suit === this.weakColor();
  }

  /**
   * Checks if a color is neutral
   */
  isNeutral(suit: CardSuit): boolean {
    return this.neutralColors().includes(suit);
  }
}
