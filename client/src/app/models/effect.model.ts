/**
 * Effect model types for frontend
 */

import type { Card } from './card.model';

/**
 * Effect categories based on card suits
 */
export type EffectCategory = 'objective' | 'draw' | 'random' | 'attack';

/**
 * Target types for effects
 */
export type TargetType = 'self' | 'opponent' | 'all' | 'random' | 'none';

/**
 * Effect timing
 */
export type EffectTiming = 'immediate' | 'next_turn' | 'end_round';

/**
 * Effect definition
 */
export interface EffectDefinition {
  id: string;
  card: {
    value: string;
    suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  };
  name: string;
  description: string;
  category: EffectCategory;
  targetType: TargetType;
  needsTarget: boolean;
  timing: EffectTiming;
}

/**
 * Active effect in the game
 */
export interface ActiveEffect {
  id: string;
  definition: EffectDefinition;
  casterId: number;
  targetIds?: number[];
  activatedAt: number;
  expiresAt?: number;
}

/**
 * Effect animation data
 */
export interface EffectAnimation {
  type: 'particles' | 'lightning' | 'aura' | 'explosion' | 'tornado';
  color: string;
  duration: number;
  position?: { x: number; y: number };
}

/**
 * Effect result
 */
export interface EffectResult {
  success: boolean;
  message: string;
  visualEffect?: EffectAnimation;
}
