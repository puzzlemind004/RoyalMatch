import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoService } from '@jsverse/transloco';
import { EffectService } from '../../../../core/services/effect.service';
import { EffectAnimationComponent } from '../../../../shared/components/effect-animation/effect-animation.component';
import type { EffectDefinition, EffectAnimation } from '../../../../models/effect.model';

@Component({
  selector: 'app-effect-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, EffectAnimationComponent],
  templateUrl: './effect-demo.page.html',
  styleUrl: './effect-demo.page.css',
})
export class EffectDemoPage {
  private transloco = inject(TranslocoService);
  // All card suits and values
  suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
  values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

  // Selected filters
  selectedSuit = signal<string | null>(null);
  selectedCategory = signal<string | null>(null);
  searchQuery = signal<string>('');

  // Current animation
  currentAnimation = signal<EffectAnimation | null>(null);

  // Mock effect definitions (will be loaded from JSON in real app)
  effects = signal<EffectDefinition[]>(this.loadMockEffects());

  // Filtered effects
  filteredEffects = computed(() => {
    let result = this.effects();

    // Filter by suit
    if (this.selectedSuit()) {
      result = result.filter((e) => e.card.suit === this.selectedSuit());
    }

    // Filter by category
    if (this.selectedCategory()) {
      result = result.filter((e) => e.category === this.selectedCategory());
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.card.value.toLowerCase().includes(query),
      );
    }

    return result;
  });

  constructor(public effectService: EffectService) {}

  /**
   * Load mock effects (in real app, this would fetch from server)
   */
  private loadMockEffects(): EffectDefinition[] {
    const mockEffects: EffectDefinition[] = [];

    for (const suit of this.suits) {
      for (const value of this.values) {
        const category =
          suit === 'hearts'
            ? 'objective'
            : suit === 'diamonds'
              ? 'draw'
              : suit === 'clubs'
                ? 'random'
                : 'attack';

        // Use translation keys
        const nameKey = `game.effects.${suit}.${value}.name`;
        const descKey = `game.effects.${suit}.${value}.desc`;

        mockEffects.push({
          id: `${value}${suit[0].toUpperCase()}`,
          card: { value, suit },
          name: this.transloco.translate(nameKey),
          description: this.transloco.translate(descKey),
          category,
          targetType: category === 'attack' ? 'opponent' : 'self',
          needsTarget: category === 'attack' || suit === 'hearts',
          timing: 'immediate',
        });
      }
    }

    return mockEffects;
  }

  /**
   * Get suit symbol
   */
  getSuitSymbol(suit: string): string {
    const symbols: Record<string, string> = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    };
    return symbols[suit] || '?';
  }

  /**
   * Get suit color
   */
  getSuitColor(suit: string): string {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  }

  /**
   * Trigger effect animation
   */
  triggerEffect(effect: EffectDefinition, event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    const animation: EffectAnimation = {
      type:
        effect.category === 'objective'
          ? 'aura'
          : effect.category === 'draw'
            ? 'explosion' // Orange explosion for diamonds
            : effect.category === 'random'
              ? 'tornado' // New tornado animation for clubs
              : 'lightning',
      color: this.effectService.getEffectCategoryColor(effect.category),
      duration: 1500,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
    };

    this.currentAnimation.set(animation);
    setTimeout(() => this.currentAnimation.set(null), 1500);
  }

  /**
   * Clear filters
   */
  clearFilters(): void {
    this.selectedSuit.set(null);
    this.selectedCategory.set(null);
    this.searchQuery.set('');
  }
}
