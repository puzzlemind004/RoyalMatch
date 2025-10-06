import { Component, signal, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ColorHierarchyComponent } from '../../../../shared/components/color-hierarchy/color-hierarchy.component';
import { CardSuit, SUIT_SYMBOLS, SUIT_COLORS } from '../../../../models/card.model';

/**
 * Roulette Animation Component
 * Displays an animated color roulette wheel that spins and selects a dominant color
 */
@Component({
  selector: 'app-roulette-animation',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ColorHierarchyComponent],
  templateUrl: './roulette-animation.component.html',
})
export class RouletteAnimationComponent {
  // Input: final suit selected (null during animation)
  readonly finalSuit = input<CardSuit | null>(null);

  // Input: weak suit (opposite of dominant)
  readonly weakSuit = input<CardSuit | null>(null);

  // Input: allow skipping animation
  readonly allowSkip = input<boolean>(true);

  // Output: animation completed
  readonly animationComplete = output<void>();

  // Output: animation skipped
  readonly animationSkipped = output<void>();

  // Animation state
  readonly isSpinning = signal(false);
  readonly selectedSuit = signal<CardSuit | null>(null);
  readonly rotation = signal(0);
  readonly showResult = signal(false);
  readonly canSkip = signal(false);

  // All suits for the wheel (ordered in 2x2 grid, alternating red/black)
  // Red on one diagonal, black on the other diagonal
  // Layout: [Hearts (red), Clubs (black)]
  //         [Spades (black), Diamonds (red)]
  readonly suits: CardSuit[] = [
    CardSuit.HEARTS, // Top-left (red)
    CardSuit.CLUBS, // Top-right (black)
    CardSuit.SPADES, // Bottom-left (black)
    CardSuit.DIAMONDS, // Bottom-right (red)
  ];

  // Computed: neutral colors
  readonly neutralColors = computed(() => {
    const final = this.finalSuit();
    const weak = this.weakSuit();
    if (!final || !weak) return [];
    return this.suits.filter((s) => s !== final && s !== weak);
  });

  /**
   * Starts the roulette animation
   * @param finalSuit - The suit that will be selected
   * @param weakSuit - The weak suit (opposite)
   */
  async animateRoulette(finalSuit: CardSuit, weakSuit: CardSuit): Promise<void> {
    // Reset rotation to 0 first (without transition)
    this.rotation.set(0);
    this.isSpinning.set(false);
    this.selectedSuit.set(null);
    this.showResult.set(false);
    this.canSkip.set(false);

    // Wait a frame for the reset to take effect
    await this.delay(10);

    // Now start spinning and allow skipping immediately
    this.isSpinning.set(true);
    this.canSkip.set(true);

    // Calculate final rotation angle
    // Grid layout: [Hearts, Clubs]
    //              [Spades, Diamonds]
    // The arrow points at the top center
    // We rotate to center each suit under the arrow (adding 45° to center the top-left quadrant)
    const suitAngles: Record<CardSuit, number> = {
      [CardSuit.HEARTS]: 45, // Top-left: rotate 45° to center under arrow
      [CardSuit.CLUBS]: -45, // Top-right: rotate -45° to center under arrow
      [CardSuit.SPADES]: 135, // Bottom-left: rotate 135° to center under arrow
      [CardSuit.DIAMONDS]: -135, // Bottom-right: rotate -135° to center under arrow
    };

    // 5 full rotations (1800°) + final angle
    const targetAngle = 1800 + suitAngles[finalSuit];
    this.rotation.set(targetAngle);

    // Wait for animation duration (3 seconds)
    await this.delay(3000);

    this.completeAnimation(finalSuit);
  }

  /**
   * Skips the animation and shows result immediately
   */
  skipAnimation(): void {
    if (!this.canSkip() || !this.isSpinning()) return;

    const final = this.finalSuit();
    if (!final) return;

    // Force instant rotation to final position
    const suitAngles: Record<CardSuit, number> = {
      [CardSuit.HEARTS]: 45,
      [CardSuit.CLUBS]: -45,
      [CardSuit.SPADES]: 135,
      [CardSuit.DIAMONDS]: -135,
    };
    this.rotation.set(1800 + suitAngles[final]);

    this.completeAnimation(final);
    this.animationSkipped.emit();
  }

  /**
   * Completes the animation
   */
  private completeAnimation(finalSuit: CardSuit): void {
    this.isSpinning.set(false);
    this.canSkip.set(false);
    this.selectedSuit.set(finalSuit);
    this.showResult.set(true);

    // Emit completion event
    this.animationComplete.emit();
  }

  /**
   * Gets the rotation transform style
   */
  getRotation(): string {
    return `rotate(${this.rotation()}deg)`;
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
    return SUIT_COLORS[suit] === 'red' ? 'text-red-600' : 'text-gray-900';
  }

  /**
   * Gets the rotation angle for a suit icon based on its grid position
   * Icons are rotated to point toward the center of the wheel
   */
  getSuitRotation(index: number): string {
    // Rotation angles for each grid position to point toward center
    // [0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right]
    const rotations = [-45, 45, -135, 135];
    return `rotate(${rotations[index]}deg)`;
  }

  /**
   * Gets the background class for a wheel segment
   */
  getSegmentBackgroundClass(suit: CardSuit): string {
    if (suit === this.selectedSuit() && !this.isSpinning()) {
      return 'bg-gradient-to-br from-yellow-400 to-orange-400';
    }
    // Use same colors as card ribbonGradient but with low opacity (100/200 variants)
    // Matching card.ts ribbonGradient colors
    const suitBackgrounds: Record<CardSuit, string> = {
      [CardSuit.HEARTS]: 'bg-rose-100', // Rose framboise (from-rose-600)
      [CardSuit.DIAMONDS]: 'bg-orange-100', // Orange (from-orange-500)
      [CardSuit.SPADES]: 'bg-purple-100', // Violet (from-purple-900)
      [CardSuit.CLUBS]: 'bg-emerald-100', // Émeraude/noir verdâtre (from-emerald-900)
    };
    return suitBackgrounds[suit];
  }

  /**
   * Helper to create a delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
