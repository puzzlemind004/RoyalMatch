import { Injectable, signal } from '@angular/core';
import type {
  EffectDefinition,
  ActiveEffect,
  EffectAnimation,
  EffectResult,
} from '../../models/effect.model';
import type { Card } from '../../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class EffectService {
  // Signals for reactive state
  readonly activeEffects = signal<ActiveEffect[]>([]);
  readonly pendingAnimation = signal<EffectAnimation | null>(null);
  readonly selectedTarget = signal<number | null>(null);

  // Effect definitions loaded from server
  private effectDefinitions = new Map<string, EffectDefinition>();

  /**
   * Load effect definitions from server
   */
  async loadEffectDefinitions(definitions: EffectDefinition[]): Promise<void> {
    this.effectDefinitions.clear();
    for (const def of definitions) {
      this.effectDefinitions.set(this.getEffectKey(def.card.value, def.card.suit), def);
    }
  }

  /**
   * Get effect key from card
   */
  private getEffectKey(value: string, suit: string): string {
    const suitMap: Record<string, string> = {
      hearts: 'H',
      diamonds: 'D',
      clubs: 'C',
      spades: 'S',
    };
    const valueMap: Record<string, string> = {
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6',
      '7': '7',
      '8': '8',
      '9': '9',
      '10': '10',
      J: 'J',
      Q: 'Q',
      K: 'K',
      A: 'A',
    };
    return `${valueMap[value]}${suitMap[suit]}`;
  }

  /**
   * Get effect description for a card
   */
  getEffectDescription(card: Card): string {
    const effect = this.effectDefinitions.get(this.getEffectKey(card.value, card.suit));
    return effect?.description ?? "Pas d'effet";
  }

  /**
   * Get full effect definition for a card
   */
  getEffectDefinition(card: Card): EffectDefinition | undefined {
    return this.effectDefinitions.get(this.getEffectKey(card.value, card.suit));
  }

  /**
   * Check if effect can be activated
   */
  canActivateEffect(card: Card, gameState: any): boolean {
    const effect = this.getEffectDefinition(card);
    if (!effect) return false;

    // Check if effect needs a target and if valid targets exist
    if (effect.needsTarget && effect.targetType === 'opponent') {
      return gameState.players?.length > 1;
    }

    // Check deck for draw effects
    if (effect.category === 'draw' && effect.description.includes('Piochez')) {
      return gameState.deckRemaining > 0;
    }

    return true;
  }

  /**
   * Check if effect needs target selection
   */
  needsTargetSelection(card: Card): boolean {
    const effect = this.getEffectDefinition(card);
    return effect?.needsTarget ?? false;
  }

  /**
   * Get effect category icon
   */
  getEffectCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      objective: '♥️',
      draw: '♦️',
      random: '♣️',
      attack: '♠️',
    };
    return icons[category] ?? '❓';
  }

  /**
   * Get effect category color
   */
  getEffectCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      objective: '#ff1744', // Red (hearts)
      draw: '#ff9800', // Orange (diamonds)
      random: '#4caf50', // Green (clubs)
      attack: '#9c27b0', // Purple (spades)
    };
    return colors[category] ?? '#757575';
  }

  /**
   * Add an active effect
   */
  addActiveEffect(effect: ActiveEffect): void {
    this.activeEffects.update((effects) => [...effects, effect]);
  }

  /**
   * Remove an active effect
   */
  removeActiveEffect(effectId: string): void {
    this.activeEffects.update((effects) => effects.filter((e) => e.id !== effectId));
  }

  /**
   * Clear all active effects
   */
  clearActiveEffects(): void {
    this.activeEffects.set([]);
  }

  /**
   * Trigger effect animation
   */
  triggerAnimation(animation: EffectAnimation): void {
    this.pendingAnimation.set(animation);

    // Auto-clear animation after duration
    setTimeout(() => {
      if (this.pendingAnimation() === animation) {
        this.pendingAnimation.set(null);
      }
    }, animation.duration);
  }

  /**
   * Select a target for an effect
   */
  selectTarget(playerId: number): void {
    this.selectedTarget.set(playerId);
  }

  /**
   * Clear selected target
   */
  clearTarget(): void {
    this.selectedTarget.set(null);
  }

  /**
   * Get effect power level (for visual representation)
   */
  getEffectPowerLevel(power: number): 'low' | 'medium' | 'high' {
    if (power <= 2) return 'low';
    if (power <= 3) return 'medium';
    return 'high';
  }

  /**
   * Format effect timing for display
   */
  formatEffectTiming(timing: string): string {
    const timings: Record<string, string> = {
      immediate: 'Immédiat',
      next_turn: 'Tour suivant',
      end_round: 'Fin de manche',
    };
    return timings[timing] ?? timing;
  }

  /**
   * Get effect icon based on card value and suit
   */
  getEffectIcon(card: Card): string {
    const effect = this.getEffectDefinition(card);
    if (!effect) return '❓';

    // Different icons based on effect type
    const categoryIcons: Record<string, string> = {
      objective: '🎯',
      draw: '🃏',
      random: '🎲',
      attack: '⚔️',
    };

    return categoryIcons[effect.category] ?? '❓';
  }
}
