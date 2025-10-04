/**
 * Effect Engine Service
 * Manages card effect registration, queueing, and execution
 */

import type {
  EffectDefinition,
  EffectContext,
  EffectResult,
  QueuedEffect,
  EffectValidation,
  StateModification,
} from '#types/effect'
import type { CardSuit } from '#types/card'
import effectsData from '#data/effects.json' with { type: 'json' }

export class EffectEngine {
  private effects: Map<string, EffectDefinition> = new Map()
  private effectQueue: QueuedEffect[] = []

  constructor() {
    this.loadEffects()
  }

  /**
   * Load all effect definitions from JSON
   */
  private loadEffects(): void {
    for (const effect of effectsData.effects) {
      const key = this.getEffectKey(effect.card.value, effect.card.suit)
      this.effects.set(key, effect as EffectDefinition)
    }
  }

  /**
   * Get effect key from card value and suit
   */
  private getEffectKey(value: number, suit: CardSuit): string {
    const suitMap: Record<string, string> = {
      hearts: 'H',
      diamonds: 'D',
      clubs: 'C',
      spades: 'S',
    }
    const valueMap: Record<number, string> = {
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: 'J',
      12: 'Q',
      13: 'K',
      14: 'A',
    }
    return `${valueMap[value]}${suitMap[suit as string]}`
  }

  /**
   * Get effect definition for a card
   */
  getEffect(value: number, suit: CardSuit): EffectDefinition | undefined {
    return this.effects.get(this.getEffectKey(value, suit))
  }

  /**
   * Register a custom effect (for testing or special cards)
   */
  registerEffect(definition: EffectDefinition): void {
    const key = this.getEffectKey(definition.card.value, definition.card.suit)
    this.effects.set(key, definition)
  }

  /**
   * Queue an effect for later execution
   */
  queueEffect(effect: QueuedEffect): void {
    this.effectQueue.push(effect)
    // Sort by priority (lower number = higher priority) and timestamp
    this.effectQueue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      return a.timestamp - b.timestamp
    })
  }

  /**
   * Execute all queued effects
   */
  async executeQueuedEffects(): Promise<EffectResult[]> {
    const results: EffectResult[] = []

    while (this.effectQueue.length > 0) {
      const queuedEffect = this.effectQueue.shift()
      if (!queuedEffect) continue

      const result = await this.executeEffect(queuedEffect)
      results.push(result)
    }

    return results
  }

  /**
   * Execute a single effect
   */
  private async executeEffect(queuedEffect: QueuedEffect): Promise<EffectResult> {
    const { effectDefinition, context } = queuedEffect

    try {
      // Validate effect can be executed
      const validation = this.validateEffect(effectDefinition, context)
      if (!validation.valid) {
        return {
          success: false,
          message: validation.reason || 'Effect validation failed',
          modifications: [],
        }
      }

      // Execute effect based on category
      const result = await this.executeEffectByCategory(effectDefinition, context)
      return result
    } catch (error) {
      return {
        success: false,
        message: `Effect execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        modifications: [],
      }
    }
  }

  /**
   * Execute effect based on its category
   */
  private async executeEffectByCategory(
    effect: EffectDefinition,
    context: EffectContext
  ): Promise<EffectResult> {
    switch (effect.category) {
      case 'objective':
        return this.executeObjectiveEffect(effect, context)
      case 'draw':
        return this.executeDrawEffect(effect, context)
      case 'random':
        return this.executeRandomEffect(effect, context)
      case 'attack':
        return this.executeAttackEffect(effect, context)
      default:
        return {
          success: false,
          message: `Unknown effect category: ${effect.category}`,
          modifications: [],
        }
    }
  }

  /**
   * Execute objective-related effects (Hearts)
   */
  private async executeObjectiveEffect(
    effect: EffectDefinition,
    context: EffectContext
  ): Promise<EffectResult> {
    const modifications: StateModification[] = []
    let message = effect.description

    // Implementation based on specific effect
    switch (effect.card.value) {
      case 2: // +1 point if win trick
        modifications.push({
          type: 'add_points',
          targetPlayerId: context.caster.id,
          data: { points: 1, condition: 'win_trick' },
        })
        break

      case 3: // Reveal opponent objective
      case 10:
      case 13:
        if (context.targets && context.targets.length > 0) {
          modifications.push({
            type: 'reveal_objective',
            targetPlayerId: context.targets[0].id,
            data: { count: effect.card.value === 13 ? 'all' : 1 },
          })
        }
        break

      case 4: // Protect trick
        modifications.push({
          type: 'protect_trick',
          targetPlayerId: context.caster.id,
          data: { duration: 1 },
        })
        break

      case 5: // Double trick counting
        modifications.push({
          type: 'double_trick',
          targetPlayerId: context.caster.id,
          data: { multiplier: 2 },
        })
        break

      default:
        modifications.push({
          type: 'add_points',
          targetPlayerId: context.caster.id,
          data: { points: 1 },
        })
    }

    return {
      success: true,
      message,
      modifications,
      visualEffect: {
        type: 'aura',
        color: '#ff1744',
        duration: 2000,
      },
    }
  }

  /**
   * Execute draw-related effects (Diamonds)
   */
  private async executeDrawEffect(
    effect: EffectDefinition,
    context: EffectContext
  ): Promise<EffectResult> {
    const modifications: StateModification[] = []
    let message = effect.description

    // Implementation based on card value
    switch (effect.card.value) {
      case 2: // Draw 1 card
      case 8: // Draw 2 cards
      case 13: // Draw 3 cards
        const drawCount = effect.card.value === 2 ? 1 : effect.card.value === 8 ? 2 : 3
        modifications.push({
          type: 'draw_card',
          targetPlayerId: context.caster.id,
          data: { count: drawCount },
        })
        break

      case 3: // Discard and draw
      case 14: // Draw 3, discard 2
        modifications.push({
          type: 'discard_card',
          targetPlayerId: context.caster.id,
          data: { count: effect.card.value === 3 ? 1 : 2 },
        })
        modifications.push({
          type: 'draw_card',
          targetPlayerId: context.caster.id,
          data: { count: effect.card.value === 3 ? 1 : 3 },
        })
        break

      case 9: // Swap 1 card
      case 10: // Swap 2 cards
        modifications.push({
          type: 'swap_cards',
          targetPlayerId: context.caster.id,
          data: { count: effect.card.value === 9 ? 1 : 2 },
        })
        break

      default:
        modifications.push({
          type: 'draw_card',
          targetPlayerId: context.caster.id,
          data: { count: 1 },
        })
    }

    return {
      success: true,
      message,
      modifications,
      visualEffect: {
        type: 'particles',
        color: '#2196f3',
        duration: 1500,
      },
    }
  }

  /**
   * Execute random effects (Clubs)
   */
  private async executeRandomEffect(
    effect: EffectDefinition,
    context: EffectContext
  ): Promise<EffectResult> {
    const modifications: StateModification[] = []
    let message = effect.description

    // Implementation based on card value
    switch (effect.card.value) {
      case 2: // 50% chance to draw 1
        if (Math.random() < 0.5) {
          modifications.push({
            type: 'draw_card',
            targetPlayerId: context.caster.id,
            data: { count: 1 },
          })
          message = 'Chance réussie ! Vous piochez 1 carte'
        } else {
          message = 'Pas de chance cette fois'
        }
        break

      case 4: // Random: +1 or +2 points
        const points = Math.random() < 0.5 ? 1 : 2
        modifications.push({
          type: 'add_points',
          targetPlayerId: context.caster.id,
          data: { points },
        })
        message = `Fortune : +${points} points`
        break

      case 5: // Random: draw 1 or 2 cards
        const drawCount = Math.random() < 0.5 ? 1 : 2
        modifications.push({
          type: 'draw_card',
          targetPlayerId: context.caster.id,
          data: { count: drawCount },
        })
        message = `Pioche aléatoire : ${drawCount} carte(s)`
        break

      case 9: // Reroll color wheel for 1 turn
      case 14:
        modifications.push({
          type: 'change_dominant_color',
          targetPlayerId: context.caster.id,
          data: { duration: 1, temporary: true },
        })
        break

      case 10: // Invert strong/weak
        modifications.push({
          type: 'change_dominant_color',
          targetPlayerId: context.caster.id,
          data: { invert: true, duration: 1 },
        })
        break

      default:
        modifications.push({
          type: 'draw_card',
          targetPlayerId: context.caster.id,
          data: { count: 1 },
        })
    }

    return {
      success: true,
      message,
      modifications,
      visualEffect: {
        type: 'explosion',
        color: '#4caf50',
        duration: 1800,
      },
    }
  }

  /**
   * Execute attack effects (Spades)
   */
  private async executeAttackEffect(
    effect: EffectDefinition,
    context: EffectContext
  ): Promise<EffectResult> {
    const modifications: StateModification[] = []
    let message = effect.description

    if (!context.targets || context.targets.length === 0) {
      return {
        success: false,
        message: 'Aucune cible sélectionnée',
        modifications: [],
      }
    }

    const target = context.targets[0]

    // Implementation based on card value
    switch (effect.card.value) {
      case 3: // Force discard chosen card
      case 5: // Force discard random card
      case 11: // Force discard 2 random cards
        const discardCount = effect.card.value === 11 ? 2 : 1
        modifications.push({
          type: 'force_discard',
          targetPlayerId: target.id,
          data: { count: discardCount, random: effect.card.value !== 3 },
        })
        break

      case 4: // Block effect value <= 5
      case 9: // Block effect value <= 10
      case 12: // Block any effect
        modifications.push({
          type: 'block_effect',
          targetPlayerId: target.id,
          data: { maxValue: effect.card.value === 4 ? 5 : effect.card.value === 9 ? 10 : 14 },
        })
        break

      case 7: // Steal 1 random card
      case 14: // Steal 2 random cards
        const stealCount = effect.card.value === 14 ? 2 : 1
        modifications.push({
          type: 'steal_card',
          targetPlayerId: target.id,
          data: { count: stealCount, beneficiaryId: context.caster.id },
        })
        break

      default:
        modifications.push({
          type: 'force_discard',
          targetPlayerId: target.id,
          data: { count: 1, random: true },
        })
    }

    return {
      success: true,
      message,
      modifications,
      visualEffect: {
        type: 'lightning',
        color: '#9c27b0',
        duration: 2000,
      },
    }
  }

  /**
   * Validate if an effect can be executed
   */
  validateEffect(effect: EffectDefinition, context: EffectContext): EffectValidation {
    // Check if effect needs a target
    if (effect.needsTarget) {
      if (!context.targets || context.targets.length === 0) {
        return {
          valid: false,
          reason: 'This effect requires a target',
        }
      }
    }

    // Check if target type is valid
    if (effect.targetType === 'opponent' && context.targets) {
      for (const target of context.targets) {
        if (target.id === context.caster.id) {
          return {
            valid: false,
            reason: 'Cannot target yourself with an opponent effect',
          }
        }
      }
    }

    return { valid: true }
  }

  /**
   * Resolve conflicts when multiple effects target the same state
   */
  resolveConflicts(effects: QueuedEffect[]): QueuedEffect[] {
    // Group effects by target
    const effectsByTarget = new Map<number, QueuedEffect[]>()

    for (const effect of effects) {
      const targetId = effect.context.targets?.[0]?.id ?? effect.context.caster.id
      if (!effectsByTarget.has(targetId)) {
        effectsByTarget.set(targetId, [])
      }
      effectsByTarget.get(targetId)!.push(effect)
    }

    // Resolve conflicts: block effects have priority
    const resolved: QueuedEffect[] = []
    for (const [, targetEffects] of effectsByTarget) {
      const blockEffects = targetEffects.filter((e) => e.effectDefinition.category === 'attack')
      const otherEffects = targetEffects.filter((e) => e.effectDefinition.category !== 'attack')

      // Block effects apply first, potentially canceling other effects
      resolved.push(...blockEffects, ...otherEffects)
    }

    return resolved
  }

  /**
   * Clear effect queue
   */
  clearQueue(): void {
    this.effectQueue = []
  }

  /**
   * Get all registered effects
   */
  getAllEffects(): Map<string, EffectDefinition> {
    return new Map(this.effects)
  }
}

// Export singleton instance
export default new EffectEngine()
