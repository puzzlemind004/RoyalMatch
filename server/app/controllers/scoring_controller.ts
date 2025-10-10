/**
 * Scoring Controller
 * Handles API endpoints for score calculation and management
 *
 * TODO: REMOVE roundId/mockRoundData FROM PAYLOADS WHEN GAME/ROUND MODELS ARE IMPLEMENTED
 *
 * Current implementation accepts roundId/mockRoundData in request payloads for demo purposes.
 * When database models are implemented:
 * - Get roundId from authenticated user's current game state
 * - Fetch round data from database instead of mock data
 * - Store scores in Player model
 * - Check victory conditions in Game model
 */

import type { HttpContext } from '@adonisjs/core/http'
import ScoringService from '#services/scoring_service'

export default class ScoringController {
  private scoringService = new ScoringService()

  /**
   * POST /api/scoring/calculate
   * Calculate scores for a round based on completed objectives
   * Body: { roundId: string, mockRoundData?: object }
   *
   * TODO: Remove mockRoundData when Round model is implemented
   * TODO: Get roundId from authenticated user's current game state
   */
  async calculate({ request, response }: HttpContext) {
    try {
      const { roundId, mockRoundData } = request.only(['roundId', 'mockRoundData'])

      if (!roundId) {
        return response.badRequest({
          success: false,
          message: 'game.errors.roundIdRequired',
        })
      }

      // Calculate scores for the round
      const result = await this.scoringService.calculateRoundScores(roundId, mockRoundData)

      // Convert Map to object for JSON serialization
      const playersData: Record<string, unknown> = {}
      result.players.forEach((playerResult, playerId) => {
        playersData[playerId] = playerResult
      })

      return response.ok({
        success: true,
        data: {
          roundId: result.roundId,
          gameId: result.gameId,
          players: playersData,
          timestamp: result.timestamp,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'game.errors.failedToCalculateScores',
      })
    }
  }

  /**
   * POST /api/scoring/reset
   * Reset all player scores (demo/testing only)
   *
   * TODO: Remove this endpoint when database is implemented
   */
  async reset({ response }: HttpContext) {
    try {
      this.scoringService.resetAllScores()

      return response.ok({
        success: true,
        message: 'game.messages.scoresReset',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'game.errors.failedToResetScores',
      })
    }
  }

  /**
   * GET /api/scoring/all
   * Get all player scores (demo/testing only)
   *
   * TODO: Remove this endpoint when database is implemented
   */
  async all({ response }: HttpContext) {
    try {
      const scores = this.scoringService.getAllScores()

      // Convert Map to object
      const scoresData: Record<string, number> = {}
      scores.forEach((score, playerId) => {
        scoresData[playerId] = score
      })

      return response.ok({
        success: true,
        data: {
          scores: scoresData,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'game.errors.failedToLoadScores',
      })
    }
  }
}
