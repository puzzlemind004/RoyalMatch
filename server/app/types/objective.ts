/**
 * Objective system types for RoyalMatch
 * Implements Strategy Pattern for objective verification
 */

import type { Card, CardSuit } from './card.js'
import { CardValue } from './card.js'

/**
 * Objective categories
 */
export enum ObjectiveCategory {
  TRICKS = 'tricks', // Based on number of tricks won
  COLORS = 'colors', // Based on card colors/suits
  VALUES = 'values', // Based on card values
  SPECIAL = 'special', // Special objectives (effects, etc.)
}

/**
 * Objective difficulty levels
 * Determines points awarded
 */
export enum ObjectiveDifficulty {
  EASY = 'easy', // 1-2 points
  MEDIUM = 'medium', // 3-4 points
  HARD = 'hard', // 5-7 points
  VERY_HARD = 'very_hard', // 8-10 points
}

/**
 * Player state during a round
 * Immutable snapshot used for objective verification
 */
export interface PlayerRoundState {
  readonly playerId: string
  readonly tricksWon: number // Number of tricks won by player
  readonly cardsWon: readonly Card[] // All cards won in tricks
  readonly cardsPlayed: readonly Card[] // All cards played by player
  readonly effectsActivated: number // Number of card effects activated
  readonly remainingCards: number // Cards still in hand
  readonly firstTrickWon: boolean // Did player win the first trick?
  readonly lastTrickWon: boolean // Did player win the last trick?
  readonly consecutiveTricksWon: number // Max consecutive tricks won
  readonly dominantSuit: CardSuit // Current round's dominant suit
}

/**
 * Progress tracking for objectives
 */
export interface ObjectiveProgress {
  current: number // Current progress value
  target: number // Target value to complete
  percentage: number // Completion percentage (0-100)
  message?: string // Optional progress message key for i18n
}

/**
 * Strategy interface for objective verification
 * Implementations must be pure functions (no side effects)
 * for optimal performance and testability
 */
export interface ObjectiveVerifier {
  /**
   * Check if objective is completed
   * @param state - Immutable player state
   * @returns true if objective is completed
   */
  checkCompletion(state: PlayerRoundState): boolean

  /**
   * Get objective progress (optional)
   * @param state - Immutable player state
   * @returns Progress tracking or undefined
   */
  getProgress?(state: PlayerRoundState): ObjectiveProgress | undefined
}

/**
 * Objective definition
 * Immutable configuration for an objective
 */
export interface ObjectiveDefinition {
  readonly id: string // Unique identifier (e.g., "win_exactly_3_tricks_1")
  readonly baseId: string // Base identifier without instance number (e.g., "win_exactly_3_tricks")
  readonly instanceNumber: number // Instance number (1, 2, or 3) for deck variety
  readonly nameKey: string // Translation key for name (e.g., "objectives.win_exactly_3_tricks.name")
  readonly descriptionKey: string // Translation key for description
  readonly category: ObjectiveCategory
  readonly difficulty: ObjectiveDifficulty
  readonly points: number // Points awarded when completed
  readonly verifier: ObjectiveVerifier // Strategy for verification
}

/**
 * Player's assigned objective for a round
 */
export interface PlayerObjective {
  readonly id: string // Unique assignment ID
  readonly playerId: string
  readonly roundId: string
  readonly objective: ObjectiveDefinition
  isCompleted: boolean // Mutable: updated during round
  pointsEarned: number // Points earned (0 until completed)
  progress?: ObjectiveProgress // Current progress
}

/**
 * Difficulty to points mapping
 * Ensures consistent point distribution
 */
export const DIFFICULTY_POINTS: Record<ObjectiveDifficulty, number[]> = {
  [ObjectiveDifficulty.EASY]: [1, 2],
  [ObjectiveDifficulty.MEDIUM]: [3, 4],
  [ObjectiveDifficulty.HARD]: [5, 6, 7],
  [ObjectiveDifficulty.VERY_HARD]: [8, 9, 10],
}

/**
 * Helper: Check if card is red (Hearts or Diamonds)
 */
export function isRedCard(card: Card): boolean {
  return card.suit === 'hearts' || card.suit === 'diamonds'
}

/**
 * Helper: Check if card is black (Clubs or Spades)
 */
export function isBlackCard(card: Card): boolean {
  return card.suit === 'clubs' || card.suit === 'spades'
}

/**
 * Helper: Check if card is a face card (J, Q, K)
 */
export function isFaceCard(card: Card): boolean {
  return card.value === 'J' || card.value === 'Q' || card.value === 'K'
}

/**
 * Helper: Check if card value is even
 */
export function isEvenCard(card: Card): boolean {
  const evenValues: CardValue[] = [
    CardValue.TWO,
    CardValue.FOUR,
    CardValue.SIX,
    CardValue.EIGHT,
    CardValue.TEN,
    CardValue.QUEEN,
  ]
  return evenValues.includes(card.value)
}

/**
 * Helper: Calculate total numeric value of cards
 */
export function calculateTotalValue(cards: readonly Card[]): number {
  return cards.reduce((sum, card) => sum + card.numericValue, 0)
}
