/**
 * Objective models for RoyalMatch frontend
 * Mirror of backend types for type-safe communication
 */

import type { Card, CardSuit } from './card.model';

/**
 * Objective categories
 */
export enum ObjectiveCategory {
  TRICKS = 'tricks',
  COLORS = 'colors',
  VALUES = 'values',
  SPECIAL = 'special',
}

/**
 * Objective difficulty levels
 */
export enum ObjectiveDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very_hard',
}

/**
 * Progress tracking for objectives
 */
export interface ObjectiveProgress {
  current: number;
  target: number;
  percentage: number;
  message?: string;
}

/**
 * Objective definition (read-only from server)
 * Note: verifier is not included as it's backend-only
 */
export interface ObjectiveDefinition {
  readonly id: string;
  readonly baseId: string;
  readonly instanceNumber: number;
  readonly nameKey: string;
  readonly descriptionKey: string;
  readonly category: ObjectiveCategory;
  readonly difficulty: ObjectiveDifficulty;
  readonly points: number;
}

/**
 * Player's assigned objective for a round
 */
export interface PlayerObjective {
  readonly id: string;
  readonly playerId: string;
  readonly roundId: string;
  readonly objective: ObjectiveDefinition;
  isCompleted: boolean;
  pointsEarned: number;
  progress?: ObjectiveProgress;
}

/**
 * Player state during a round (for display purposes)
 * Backend calculates this, frontend just displays
 */
export interface PlayerRoundState {
  readonly playerId: string;
  readonly tricksWon: number;
  readonly cardsWon: readonly Card[];
  readonly cardsPlayed: readonly Card[];
  readonly effectsActivated: number;
  readonly remainingCards: number;
  readonly firstTrickWon: boolean;
  readonly lastTrickWon: boolean;
  readonly consecutiveTricksWon: number;
  readonly dominantSuit: CardSuit;
}

/**
 * Difficulty to points mapping (for UI display)
 */
export const DIFFICULTY_POINTS: Record<ObjectiveDifficulty, number[]> = {
  [ObjectiveDifficulty.EASY]: [1, 2],
  [ObjectiveDifficulty.MEDIUM]: [3, 4],
  [ObjectiveDifficulty.HARD]: [5, 6, 7],
  [ObjectiveDifficulty.VERY_HARD]: [8, 9, 10],
};

/**
 * Difficulty colors for UI
 */
export const DIFFICULTY_COLORS: Record<ObjectiveDifficulty, string> = {
  [ObjectiveDifficulty.EASY]: 'text-green-600 bg-green-100',
  [ObjectiveDifficulty.MEDIUM]: 'text-blue-600 bg-blue-100',
  [ObjectiveDifficulty.HARD]: 'text-orange-600 bg-orange-100',
  [ObjectiveDifficulty.VERY_HARD]: 'text-red-600 bg-red-100',
};

/**
 * Category icons for UI
 */
export const CATEGORY_ICONS: Record<ObjectiveCategory, string> = {
  [ObjectiveCategory.TRICKS]: '🎯',
  [ObjectiveCategory.COLORS]: '🎨',
  [ObjectiveCategory.VALUES]: '🔢',
  [ObjectiveCategory.SPECIAL]: '✨',
};
