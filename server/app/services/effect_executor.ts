/**
 * Effect Executor - Strategy Pattern
 * Each effect type has a configurable executor based on JSON data
 * This makes effects easily modifiable without code changes
 */

import type {
  EffectDefinition,
  EffectContext,
  EffectResult,
  StateModification,
} from '#types/effect'

/**
 * Generic effect executor that interprets effect data from JSON
 * NO HARDCODED LOGIC - everything is data-driven
 */
export class EffectExecutor {
  /**
   * Execute effect based on its definition
   * Uses the effect's data properties to determine behavior
   */
  async execute(effect: EffectDefinition, context: EffectContext): Promise<EffectResult> {
    const modifications: StateModification[] = []

    // Use effect power and category to determine visual effect
    const visualEffect = this.getVisualEffect(effect)

    // Parse effect description to extract action keywords
    const actions = this.parseEffectActions(effect.description)

    // Build modifications based on parsed actions
    for (const action of actions) {
      const modification = this.createModification(action, effect, context)
      if (modification) {
        modifications.push(modification)
      }
    }

    return {
      success: true,
      message: effect.description,
      modifications,
      visualEffect,
    }
  }

  /**
   * Parse effect description to extract actionable data
   * NOTE: This method is no longer used for text parsing.
   * Effect data should be determined by card suit/value, not by description text.
   * Descriptions are now translation keys handled by the frontend.
   */
  private parseEffectActions(_description: string): Array<{
    action: string
    count?: number
    target?: string
  }> {
    // This method should be refactored to use card data instead of text parsing
    // For now, return a generic action to maintain compatibility
    return [{ action: 'generic' }]
  }

  /**
   * Create state modification based on action
   */
  private createModification(
    action: { action: string; count?: number; target?: string },
    _effect: EffectDefinition,
    context: EffectContext
  ): StateModification | null {
    const targetPlayerId = context.targets?.[0]?.id ?? context.caster.id

    switch (action.action) {
      case 'draw':
        return {
          type: 'draw_card',
          targetPlayerId: context.caster.id,
          data: { count: action.count || 1 },
        }

      case 'points':
        return {
          type: 'add_points',
          targetPlayerId: context.caster.id,
          data: { points: action.count || 1 },
        }

      case 'discard':
        return {
          type: 'discard_card',
          targetPlayerId: context.caster.id,
          data: { count: action.count || 1 },
        }

      case 'reveal':
        return {
          type: 'reveal_objective',
          targetPlayerId,
          data: { count: action.count || 1 },
        }

      case 'steal':
        return {
          type: 'steal_card',
          targetPlayerId,
          data: { count: action.count || 1, beneficiaryId: context.caster.id },
        }

      case 'double':
        return {
          type: 'double_trick',
          targetPlayerId: context.caster.id,
          data: { multiplier: 2 },
        }

      case 'block':
        return {
          type: 'block_effect',
          targetPlayerId,
          data: {},
        }

      case 'change_color':
        return {
          type: 'change_dominant_color',
          targetPlayerId: context.caster.id,
          data: { temporary: true, duration: 1 },
        }

      case 'protect':
        return {
          type: 'protect_trick',
          targetPlayerId: context.caster.id,
          data: { duration: 1 },
        }

      case 'exchange':
        return {
          type: 'swap_cards',
          targetPlayerId: context.caster.id,
          data: { count: action.count || 1 },
        }

      case 'random':
        // Random effects
        const randomOutcome = Math.random() < 0.5
        return {
          type: randomOutcome ? 'draw_card' : 'add_points',
          targetPlayerId: context.caster.id,
          data: { count: 1 },
        }

      default:
        // Generic effect
        return {
          type: 'add_points',
          targetPlayerId: context.caster.id,
          data: { points: 1 },
        }
    }
  }

  /**
   * Get visual effect based on category
   */
  private getVisualEffect(effect: EffectDefinition) {
    const visualMap = {
      objective: { type: 'aura' as const, color: '#ff1744', duration: 2000 }, // Red hearts
      draw: { type: 'explosion' as const, color: '#ff9800', duration: 1500 }, // Orange diamonds
      random: { type: 'tornado' as const, color: '#4caf50', duration: 1800 }, // Green clubs
      attack: { type: 'lightning' as const, color: '#9c27b0', duration: 2000 }, // Purple spades
    }

    return visualMap[effect.category]
  }
}

export default new EffectExecutor()
