import { Component, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { RouletteAnimationComponent } from '../../../game/components/roulette-animation/roulette-animation.component';
import { ColorHierarchyComponent } from '../../../../shared/components/color-hierarchy/color-hierarchy.component';
import { ColorRouletteService } from '../../../../core/services/color-roulette.service';
import { CardSuit, SUIT_SYMBOLS } from '../../../../models/card.model';

@Component({
  selector: 'app-roulette-demo',
  imports: [CommonModule, TranslocoModule, RouletteAnimationComponent, ColorHierarchyComponent],
  templateUrl: './roulette-demo.page.html',
  styleUrl: './roulette-demo.page.css',
})
export class RouletteDemoPage {
  private colorRouletteService = inject(ColorRouletteService);

  @ViewChild(RouletteAnimationComponent) rouletteComponent!: RouletteAnimationComponent;

  // Demo state
  readonly isSpinning = signal(false);
  readonly lastResult = signal<{
    dominant: CardSuit;
    weak: CardSuit;
    neutrals: CardSuit[];
  } | null>(null);

  // Statistics for distribution demo
  readonly spinCount = signal(0);
  readonly distribution = signal<Record<CardSuit, number>>({
    [CardSuit.HEARTS]: 0,
    [CardSuit.DIAMONDS]: 0,
    [CardSuit.CLUBS]: 0,
    [CardSuit.SPADES]: 0,
  });

  // All suits for buttons
  readonly allSuits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];

  /**
   * Simulates a roulette spin
   */
  async spinRoulette(): Promise<void> {
    if (this.isSpinning()) return;

    this.isSpinning.set(true);

    // Simulate server-side random selection
    const suits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];
    const randomIndex = Math.floor(Math.random() * 4);
    const selectedSuit = suits[randomIndex];

    // Get weak color and neutral colors
    const weakColor = this.getOppositeColor(selectedSuit);
    const neutrals = suits.filter((s) => s !== selectedSuit && s !== weakColor);

    // Update service state
    this.colorRouletteService.updateFromServer({
      dominantColor: selectedSuit,
      weakColor: weakColor,
      neutrals: neutrals,
    });

    // Store result
    this.lastResult.set({
      dominant: selectedSuit,
      weak: weakColor,
      neutrals: neutrals,
    });

    // Update distribution statistics
    this.spinCount.update((count) => count + 1);
    this.distribution.update((dist) => ({
      ...dist,
      [selectedSuit]: dist[selectedSuit] + 1,
    }));

    // Trigger animation
    if (this.rouletteComponent) {
      await this.rouletteComponent.animateRoulette(selectedSuit, weakColor);
    }

    this.isSpinning.set(false);
  }

  /**
   * Spins the roulette with a specific color (for testing)
   */
  async spinWithColor(suit: CardSuit): Promise<void> {
    if (this.isSpinning()) return;

    this.isSpinning.set(true);

    const weakColor = this.getOppositeColor(suit);
    const suits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];
    const neutrals = suits.filter((s) => s !== suit && s !== weakColor);

    // Update service state
    this.colorRouletteService.updateFromServer({
      dominantColor: suit,
      weakColor: weakColor,
      neutrals: neutrals,
    });

    // Store result
    this.lastResult.set({
      dominant: suit,
      weak: weakColor,
      neutrals: neutrals,
    });

    // Trigger animation
    if (this.rouletteComponent) {
      await this.rouletteComponent.animateRoulette(suit, weakColor);
    }

    this.isSpinning.set(false);
  }

  /**
   * Resets statistics
   */
  resetStatistics(): void {
    this.spinCount.set(0);
    this.distribution.set({
      [CardSuit.HEARTS]: 0,
      [CardSuit.DIAMONDS]: 0,
      [CardSuit.CLUBS]: 0,
      [CardSuit.SPADES]: 0,
    });
    this.lastResult.set(null);
    this.colorRouletteService.reset();
  }

  /**
   * Gets the percentage for a suit in distribution
   */
  getPercentage(suit: CardSuit): number {
    const total = this.spinCount();
    if (total === 0) return 0;
    return Math.round((this.distribution()[suit] / total) * 100);
  }

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
    if (suit === CardSuit.HEARTS || suit === CardSuit.DIAMONDS) {
      return 'text-red-600';
    }
    return 'text-gray-900';
  }

  /**
   * Gets the opposite color (weak color)
   */
  private getOppositeColor(suit: CardSuit): CardSuit {
    const opposites: Record<CardSuit, CardSuit> = {
      [CardSuit.HEARTS]: CardSuit.SPADES,
      [CardSuit.SPADES]: CardSuit.HEARTS,
      [CardSuit.DIAMONDS]: CardSuit.CLUBS,
      [CardSuit.CLUBS]: CardSuit.DIAMONDS,
    };
    return opposites[suit];
  }
}
