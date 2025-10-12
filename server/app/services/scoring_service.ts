/**
 * Scoring Service
 * Handles score calculation and attribution at the end of a round
 *
 * Responsibilities:
 * - Calculate round score based on completed objectives
 * - Apply bonus if all objectives completed (+5 points)
 * - Update player total score
 * - Check victory conditions
 *
 * @TODO: Once Player model is implemented, update player score in database
 * @TODO: Once Game model is implemented, check victory conditions
 */

import type { ObjectiveVerificationResult } from './objective_verification_service.js'
import ObjectiveVerificationService from './objective_verification_service.js'
import logger from '@adonisjs/core/services/logger'

/**
 * Score calculation result for a single player
 */
export interface PlayerScoreResult {
  playerId: string
  roundPoints: number
  objectivesCompleted: number
  objectivesTotal: number
  bonusApplied: boolean
  bonusPoints: number
  totalScore: number
  details: ObjectiveVerificationResult[]
}

/**
 * Complete scoring result for a round
 */
export interface RoundScoringResult {
  roundId: string
  gameId: string
  players: Map<string, PlayerScoreResult>
  timestamp: Date
}

/**
 * In-memory storage for player scores (temporary until database is ready)
 * @TODO: Replace with database queries when Player model is implemented
 */
const playerScores = new Map<string, number>()

/**
 * Scoring Service
 * Calculates and attributes points based on completed objectives
 */
export default class ScoringService {
  private verificationService: ObjectiveVerificationService

  constructor() {
    this.verificationService = new ObjectiveVerificationService()
  }

  /**
   * Calculate scores for all players in a round
   *
   * @param roundId - The round to score
   * @param mockRoundData - Optional mock data for demo
   * @returns Complete scoring results
   */
  async calculateRoundScores(roundId: string, mockRoundData?: any): Promise<RoundScoringResult> {
    logger.info(`Starting score calculation for round ${roundId}`)

    // Verify all objectives for the round
    const verificationResult = await this.verificationService.verifyRound(roundId, mockRoundData)

    const scoringResults = new Map<string, PlayerScoreResult>()

    // Calculate score for each player
    verificationResult.players.forEach((playerResult, playerId) => {
      const scoreResult = this.calculatePlayerScore(playerId, playerResult.objectives)
      scoringResults.set(playerId, scoreResult)

      logger.info(
        `Player ${playerId}: ${scoreResult.roundPoints} points this round (${scoreResult.objectivesCompleted}/${scoreResult.objectivesTotal} objectives${scoreResult.bonusApplied ? ' + bonus' : ''}), total: ${scoreResult.totalScore}`
      )
    })

    return {
      roundId: verificationResult.roundId,
      gameId: verificationResult.gameId,
      players: scoringResults,
      timestamp: new Date(),
    }
  }

  /**
   * Calculate score for a single player
   *
   * @param playerId - The player
   * @param objectiveResults - Player's objective verification results
   * @returns Player's score result
   */
  private calculatePlayerScore(
    playerId: string,
    objectiveResults: ObjectiveVerificationResult[]
  ): PlayerScoreResult {
    // Calculate base points from objectives
    let roundPoints = 0
    let completedCount = 0

    for (const result of objectiveResults) {
      if (result.completed) {
        completedCount++
        roundPoints += result.points
      }
    }

    // Apply bonus if all objectives completed
    const bonusApplied = completedCount === objectiveResults.length && completedCount > 0
    const bonusPoints = bonusApplied ? 5 : 0

    if (bonusApplied) {
      roundPoints += bonusPoints
      logger.info(`Player ${playerId} completed all objectives! Bonus +${bonusPoints} points`)
    }

    // Update total score
    const previousScore = this.getPlayerScore(playerId)
    const totalScore = previousScore + roundPoints
    this.updatePlayerScore(playerId, totalScore)

    return {
      playerId,
      roundPoints,
      objectivesCompleted: completedCount,
      objectivesTotal: objectiveResults.length,
      bonusApplied,
      bonusPoints,
      totalScore,
      details: objectiveResults,
    }
  }

  /**
   * Get current total score for a player
   *
   * @param playerId - The player
   * @returns Current total score
   * @TODO: Replace with database query when Player model is ready
   */
  private getPlayerScore(playerId: string): number {
    return playerScores.get(playerId) || 0
  }

  /**
   * Update player's total score
   *
   * @param playerId - The player
   * @param newScore - New total score
   * @TODO: Replace with database update when Player model is ready
   */
  private updatePlayerScore(playerId: string, newScore: number): void {
    playerScores.set(playerId, newScore)
    logger.debug(`Player ${playerId} score updated to ${newScore}`)
  }

  /**
   * Reset all player scores (for testing/demo purposes)
   *
   * @TODO: Remove when database is implemented
   */
  resetAllScores(): void {
    playerScores.clear()
    logger.info('All player scores reset')
  }

  /**
   * Get all player scores (for testing/demo purposes)
   *
   * @returns Map of player scores
   * @TODO: Remove when database is implemented
   */
  getAllScores(): Map<string, number> {
    return new Map(playerScores)
  }

  /**
   * @TODO: Future methods to implement when database models are ready
   */

  // private async checkVictoryCondition(gameId: string): Promise<{
  //   gameEnded: boolean
  //   winnerId?: string
  //   winnerScore?: number
  // }> {
  //   const game = await Game.find(gameId)
  //   const players = await game.related('players').query()
  //
  //   // Find player with highest score
  //   const winner = players.reduce((prev, current) =>
  //     current.score > prev.score ? current : prev
  //   )
  //
  //   // Check if victory condition met (e.g., 100 points)
  //   if (winner.score >= game.victoryPoints) {
  //     return {
  //       gameEnded: true,
  //       winnerId: winner.id,
  //       winnerScore: winner.score,
  //     }
  //   }
  //
  //   return { gameEnded: false }
  // }

  // private async updatePlayerScoreInDatabase(
  //   playerId: string,
  //   additionalPoints: number
  // ): Promise<void> {
  //   const player = await Player.findOrFail(playerId)
  //   player.score += additionalPoints
  //   await player.save()
  // }
}
