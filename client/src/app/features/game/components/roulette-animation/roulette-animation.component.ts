import { Component, signal, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { CardSuit, SUIT_SYMBOLS } from '../../../../models/card.model';

/**
 * Roulette Animation Component
 * Displays an animated color roulette wheel that spins and selects a dominant color
 */
@Component({
  selector: 'app-roulette-animation',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './roulette-animation.component.html',
})
export class RouletteAnimationComponent {
  // Input: final suit selected (null during animation)
  readonly finalSuit = input<CardSuit | null>(null);

  // Input: weak suit (opposite of dominant)
  readonly weakSuit = input<CardSuit | null>(null);

  // Output: animation completed
  readonly animationComplete = output<void>();

  // Animation state
  readonly isSpinning = signal(false);
  readonly selectedSuit = signal<CardSuit | null>(null);

  // All suits for the wheel (checkerboard pattern: red-black-black-red)
  readonly suits: CardSuit[] = [
    CardSuit.HEARTS, // Top-left: red
    CardSuit.CLUBS, // Top-right: black
    CardSuit.SPADES, // Bottom-left: black
    CardSuit.DIAMONDS, // Bottom-right: red
  ];

  /**
   * Starts the roulette animation
   * @param finalSuit - The suit that will be selected
   * @param weakSuit - The weak suit (opposite)
   */
  async animateRoulette(finalSuit: CardSuit, weakSuit: CardSuit): Promise<void> {
    this.isSpinning.set(true);
    this.selectedSuit.set(null);

    // Wait for animation duration (2 seconds)
    await this.delay(2000);

    this.isSpinning.set(false);
    this.selectedSuit.set(finalSuit);

    // Emit completion event
    this.animationComplete.emit();
  }

  /**
   * Gets the suit symbol (♥, ♦, ♣, ♠)
   */
  getSuitSymbol(suit: CardSuit): string {
    return SUIT_SYMBOLS[suit];
  }

  /**
   * Gets the suit color class
   */
  getSuitColorClass(suit: CardSuit): string {
    if (suit === CardSuit.HEARTS || suit === CardSuit.DIAMONDS) {
      return 'text-red-600';
    }
    return 'text-gray-900';
  }

  /**
   * Helper to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
