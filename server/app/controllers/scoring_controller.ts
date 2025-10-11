/**
 * Scoring Controller
 * Handles API endpoints for score calculation and management
 *
 * Authentication: All routes require auth.user
 * Game context: Supports both demo mode and real game sessions
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
   * TODO: Remove mockRoundData when Round model is fully integrated
   * TODO: Get roundId from authenticated user's current active round
   */
  async calculate({ request, response, auth }: HttpContext) {
    try {
      await auth.authenticate()
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
   * TODO: Remove this endpoint when database is fully integrated
   */
  async reset({ response, auth }: HttpContext) {
    try {
      await auth.authenticate()
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
   * TODO: Remove this endpoint when database is fully integrated
   */
  async all({ response, auth }: HttpContext) {
    try {
      await auth.authenticate()
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
