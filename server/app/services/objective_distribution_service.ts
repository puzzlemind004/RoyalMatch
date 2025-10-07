/**
 * Objective Distribution Service
 * Handles semi-random objective distribution based on player's difficulty selection
 *
 * Features:
 * - No limit on number of objectives a player can draw
 * - Random drawing from each difficulty pool
 * - Ensures uniqueness (no duplicate objectives)
 */

import type { ObjectiveDefinition } from '../types/objective.js'
import { ObjectiveDifficulty } from '../types/objective.js'
import { ALL_OBJECTIVES, getObjectivesByDifficulty } from '../data/objectives.js'

/**
 * Player's selection for objective distribution
 */
export interface ObjectiveSelection {
  easy: number // Number of easy objectives to draw
  medium: number // Number of medium objectives to draw
  hard: number // Number of hard + very_hard objectives to draw
}

/**
 * Available objectives grouped by simplified difficulty
 */
export interface AvailableObjectives {
  easy: ObjectiveDefinition[]
  medium: ObjectiveDefinition[]
  hard: ObjectiveDefinition[] // Combines HARD + VERY_HARD
}

/**
 * Service for managing objective distribution
 */
export default class ObjectiveDistributionService {
  /**
   * Get all available objectives grouped by simplified difficulty
   * Frontend difficulty mapping: EASY, MEDIUM, HARD (includes VERY_HARD)
   */
  public getAvailableObjectives(): AvailableObjectives {
    const easy = getObjectivesByDifficulty(ObjectiveDifficulty.EASY)
    const medium = getObjectivesByDifficulty(ObjectiveDifficulty.MEDIUM)
    const hard = [
      ...getObjectivesByDifficulty(ObjectiveDifficulty.HARD),
      ...getObjectivesByDifficulty(ObjectiveDifficulty.VERY_HARD),
    ]

    return {
      easy: Array.from(easy),
      medium: Array.from(medium),
      hard,
    }
  }

  /**
   * Draw random objectives based on player's selection
   * @param selection - Number of objectives to draw from each difficulty
   * @returns Array of unique randomly selected objectives
   * @throws Error if not enough objectives in a pool
   */
  public drawObjectives(selection: ObjectiveSelection): ObjectiveDefinition[] {
    const available = this.getAvailableObjectives()
    const drawn: ObjectiveDefinition[] = []

    // Validate selection
    this.validateSelection(selection, available)

    // Draw from easy pool
    if (selection.easy > 0) {
      const easyDrawn = this.drawRandom(available.easy, selection.easy)
      drawn.push(...easyDrawn)
    }

    // Draw from medium pool
    if (selection.medium > 0) {
      const mediumDrawn = this.drawRandom(available.medium, selection.medium)
      drawn.push(...mediumDrawn)
    }

    // Draw from hard pool
    if (selection.hard > 0) {
      const hardDrawn = this.drawRandom(available.hard, selection.hard)
      drawn.push(...hardDrawn)
    }

    return drawn
  }

  /**
   * Validate that the selection is feasible given available objectives
   * @throws Error if selection exceeds available objectives in any pool
   */
  private validateSelection(
    selection: ObjectiveSelection,
    available: AvailableObjectives
  ): void {
    if (selection.easy > available.easy.length) {
      throw new Error(
        `game.errors.notEnoughObjectives|easy|${selection.easy}|${available.easy.length}`
      )
    }

    if (selection.medium > available.medium.length) {
      throw new Error(
        `game.errors.notEnoughObjectives|medium|${selection.medium}|${available.medium.length}`
      )
    }

    if (selection.hard > available.hard.length) {
      throw new Error(
        `game.errors.notEnoughObjectives|hard|${selection.hard}|${available.hard.length}`
      )
    }

    // All selections must be non-negative
    if (selection.easy < 0 || selection.medium < 0 || selection.hard < 0) {
      throw new Error('game.errors.negativeSelection')
    }
  }

  /**
   * Draw random objectives from a pool without replacement
   * Uses Fisher-Yates shuffle for uniform randomness
   * @param pool - Pool of objectives to draw from
   * @param count - Number to draw
   * @returns Array of randomly selected objectives
   */
  private drawRandom(pool: ObjectiveDefinition[], count: number): ObjectiveDefinition[] {
    // Clone pool to avoid mutation
    const shuffled = [...pool]

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled.slice(0, count)
  }

  /**
   * Get total count of all available objectives
   */
  public getTotalAvailableCount(): number {
    return ALL_OBJECTIVES.length
  }

  /**
   * Get count of objectives by simplified difficulty
   */
  public getCountsByDifficulty(): { easy: number; medium: number; hard: number } {
    const available = this.getAvailableObjectives()
    return {
      easy: available.easy.length,
      medium: available.medium.length,
      hard: available.hard.length,
    }
  }
}
