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
   * Examples:
   * - "Piochez 2 cartes" → { action: 'draw', count: 2 }
   * - "+3 points" → { action: 'points', count: 3 }
   * - "Révélez un objectif" → { action: 'reveal', target: 'objective' }
   */
  private parseEffectActions(description: string): Array<{
    action: string
    count?: number
    target?: string
  }> {
    const actions: Array<{ action: string; count?: number; target?: string }> = []

    // Draw cards
    const drawMatch = description.match(/(?:Piochez|piochez)\s+(\d+)\s+carte/i)
    if (drawMatch) {
      actions.push({ action: 'draw', count: Number.parseInt(drawMatch[1]) })
    }

    // Add points
    const pointsMatch = description.match(/\+(\d+)\s+points?/i)
    if (pointsMatch) {
      actions.push({ action: 'points', count: Number.parseInt(pointsMatch[1]) })
    }

    // Discard cards
    const discardMatch = description.match(/(?:défaussez|Défaussez)\s+(\d+)\s+carte/i)
    if (discardMatch) {
      actions.push({ action: 'discard', count: Number.parseInt(discardMatch[1]) })
    }

    // Reveal objective
    if (description.match(/révélez.*objectif/i)) {
      const allMatch = description.match(/tous les objectifs/i)
      actions.push({ action: 'reveal', target: 'objective', count: allMatch ? 999 : 1 })
    }

    // Steal cards
    const stealMatch = description.match(/volez\s+(\d+)\s+carte/i)
    if (stealMatch) {
      actions.push({ action: 'steal', count: Number.parseInt(stealMatch[1]) })
    }

    // Double trick
    if (description.match(/compte double/i)) {
      actions.push({ action: 'double', target: 'trick' })
    }

    // Block effect
    if (description.match(/bloquez|annulez/i)) {
      actions.push({ action: 'block', target: 'effect' })
    }

    // Change color
    if (description.match(/relancez.*roulette|inversez/i)) {
      actions.push({ action: 'change_color' })
    }

    // Protect
    if (description.match(/protégez|protéger/i)) {
      actions.push({ action: 'protect', target: 'trick' })
    }

    // Look at cards
    const lookMatch = description.match(/regardez.*(\d+)/i)
    if (lookMatch) {
      actions.push({ action: 'look', count: Number.parseInt(lookMatch[1]) })
    }

    // Exchange cards
    const exchangeMatch = description.match(/échangez\s+(\d+)\s+carte/i)
    if (exchangeMatch) {
      actions.push({ action: 'exchange', count: Number.parseInt(exchangeMatch[1]) })
    }

    // Random effect
    if (description.match(/aléatoire|chance|hasard/i)) {
      actions.push({ action: 'random' })
    }

    // If no specific action found, use generic based on category
    if (actions.length === 0) {
      actions.push({ action: 'generic' })
    }

    return actions
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
