/**
 * Effect system type definitions
 */

import type { CardSuit } from './card.js'
import type Game from '#models/game'
import type User from '#models/user'

/**
 * Effect categories based on card suits
 */
export type EffectCategory = 'objective' | 'draw' | 'random' | 'attack'

/**
 * Target types for effects
 */
export type TargetType = 'self' | 'opponent' | 'all' | 'random' | 'none'

/**
 * Effect definition structure
 */
export interface EffectDefinition {
  id: string
  card: {
    value: number
    suit: CardSuit
  }
  name: string
  description: string
  category: EffectCategory
  targetType: TargetType
  needsTarget: boolean
  timing: 'immediate' | 'next_turn' | 'end_round'
}

/**
 * Player context in effect execution
 */
export interface PlayerContext {
  id: number
  userId: number
  user: User
  hand: Array<{ value: number; suit: CardSuit }>
  playedCards: Array<{ value: number; suit: CardSuit }>
  score: number
  objectives: Array<{
    id: number
    description: string
    points: number
    revealed: boolean
  }>
}

/**
 * Round state context
 */
export interface RoundState {
  roundNumber: number
  dominantColor: CardSuit
  currentTurn: number
  tricksWon: Record<number, number> // playerId -> tricks count
}

/**
 * Effect execution context
 */
export interface EffectContext {
  game: Game
  gameState: {
    players: PlayerContext[]
    currentRound: RoundState
    deckRemaining: number
  }
  caster: PlayerContext
  targets?: PlayerContext[]
  additionalData?: Record<string, any>
}

/**
 * State modifications resulting from effect execution
 */
export interface StateModification {
  type:
    | 'draw_card'
    | 'discard_card'
    | 'reveal_objective'
    | 'add_points'
    | 'block_effect'
    | 'swap_cards'
    | 'change_dominant_color'
    | 'force_discard'
    | 'steal_card'
    | 'double_trick'
    | 'protect_trick'
  targetPlayerId: number
  data: Record<string, any>
}

/**
 * Effect execution result
 */
export interface EffectResult {
  success: boolean
  message: string
  modifications: StateModification[]
  visualEffect?: {
    type: 'particles' | 'lightning' | 'aura' | 'explosion' | 'tornado'
    color: string
    duration: number
  }
}

/**
 * Queued effect waiting for execution
 */
export interface QueuedEffect {
  id: string
  effectDefinition: EffectDefinition
  context: EffectContext
  priority: number // Lower number = higher priority
  timestamp: number
}

/**
 * Effect validation result
 */
export interface EffectValidation {
  valid: boolean
  reason?: string
}
