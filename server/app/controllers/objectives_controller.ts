/**
 * Objectives Controller
 * Handles API endpoints for objective distribution and validation
 *
 * TODO: REMOVE gameId/playerId FROM PAYLOADS WHEN AUTHENTICATION IS IMPLEMENTED
 *
 * Current implementation accepts gameId/playerId in request payloads for demo purposes.
 * When authentication is implemented:
 * - Remove gameId/playerId from all request payloads
 * - Use ctx.auth.user.id to identify the player
 * - Store objectives in database with proper models (Game, PlayerObjective)
 * - Add authorization middleware to ensure players can only access their own data
 */

import type { HttpContext } from '@adonisjs/core/http'
import type { ObjectiveDefinition } from '../types/objective.js'
import ObjectiveDistributionService from '#services/objective_distribution_service'
import ObjectiveVerificationService from '#services/objective_verification_service'
import objectiveStorageService from '#services/objective_storage_service'
import { drawObjectivesValidator } from '#validators/objective_distribution_validator'

export default class ObjectivesController {
  private distributionService = new ObjectiveDistributionService()
  private verificationService = new ObjectiveVerificationService()

  /**
   * GET /api/objectives/available
   * Get all available objectives grouped by difficulty
   */
  async available({ response }: HttpContext) {
    try {
      const objectives = this.distributionService.getAvailableObjectives()
      const counts = this.distributionService.getCountsByDifficulty()

      return response.ok({
        success: true,
        data: {
          objectives,
          counts,
          total: this.distributionService.getTotalAvailableCount(),
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'game.errors.failedToLoadObjectives',
      })
    }
  }

  /**
   * POST /api/objectives/draw
   * Draw random objectives based on selection
   * Body: { easy?: number, medium?: number, hard?: number }
   */
  async draw({ request, response }: HttpContext) {
    try {
      // Validate request
      const payload = await request.validateUsing(drawObjectivesValidator)

      // Default to 0 if not provided
      const selection = {
        easy: payload.easy ?? 0,
        medium: payload.medium ?? 0,
        hard: payload.hard ?? 0,
      }

      // Validate minimum 3 objectives
      const totalObjectives = selection.easy + selection.medium + selection.hard
      if (totalObjectives < 3) {
        return response.badRequest({
          success: false,
          message: 'game.errors.minimumThreeObjectives',
        })
      }

      // Draw objectives
      const objectives = this.distributionService.drawObjectives(selection)

      // TODO: Remove this when authentication is implemented - use auth.user.id instead
      const gameId = request.input('gameId', 'demo-game')
      const playerId = request.input('playerId', 'demo-player')

      // Store objectives using singleton service (persists between requests)
      objectiveStorageService.store(gameId, playerId, objectives)

      return response.ok({
        success: true,
        data: {
          objectives,
          selection,
          count: objectives.length,
        },
      })
    } catch (error) {
      // Handle validation errors
      if (error.messages) {
        return response.badRequest({
          success: false,
          message: 'game.errors.invalidSelection',
          errors: error.messages,
        })
      }

      // Handle service errors (not enough objectives, etc.)
      if (error instanceof Error) {
        return response.badRequest({
          success: false,
          message: error.message,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'game.errors.failedToDrawObjectives',
      })
    }
  }

  /**
   * POST /api/objectives/redraw
   * Redraw objectives with the same difficulty distribution
   * Body: { gameId: string, playerId: string }
   *
   * TODO: Remove gameId/playerId from body when authentication is implemented
   */
  async redraw({ request, response }: HttpContext) {
    try {
      // TODO: Replace with auth.user.id when authentication is implemented
      const { gameId, playerId } = request.only(['gameId', 'playerId'])

      // Get current objectives from storage service
      const currentObjectives = objectiveStorageService.retrieve(gameId, playerId)

      if (currentObjectives.length === 0) {
        return response.badRequest({
          success: false,
          message: 'game.errors.noObjectivesToRedraw',
        })
      }

      // Calculate the difficulty distribution of current objectives
      const distribution = {
        easy: 0,
        medium: 0,
        hard: 0,
      }

      currentObjectives.forEach((obj: ObjectiveDefinition) => {
        const diff = obj.difficulty
        if (diff === 'easy') distribution.easy++
        else if (diff === 'medium') distribution.medium++
        else if (diff === 'hard' || diff === 'very_hard') distribution.hard++
      })

      // Redraw with same distribution
      const newObjectives = this.distributionService.drawObjectives(distribution)

      // Store new objectives in storage service
      objectiveStorageService.store(gameId, playerId, newObjectives)

      return response.ok({
        success: true,
        data: {
          objectives: newObjectives,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'game.errors.failedToRedrawObjectives',
      })
    }
  }

  /**
   * POST /api/objectives/reject
   * Reject specific objectives (max 2)
   * Body: { gameId: string, playerId: string, objectiveIds: string[] }
   *
   * TODO: Remove gameId/playerId from body when authentication is implemented
   */
  async reject({ request, response }: HttpContext) {
    try {
      // TODO: Replace with auth.user.id when authentication is implemented
      const { gameId, playerId, objectiveIds } = request.only([
        'gameId',
        'playerId',
        'objectiveIds',
      ])

      // Validate max 2 rejections
      if (objectiveIds.length > 2) {
        return response.badRequest({
          success: false,
          message: 'game.errors.tooManyRejections',
        })
      }

      // Get current objectives from storage service
      const currentObjectives = objectiveStorageService.retrieve(gameId, playerId)

      // Remove rejected objectives
      const remainingObjectives = currentObjectives.filter(
        (obj: ObjectiveDefinition) => !objectiveIds.includes(obj.id)
      )

      // Store remaining objectives in storage service
      objectiveStorageService.store(gameId, playerId, remainingObjectives)

      return response.ok({
        success: true,
        data: {
          remainingObjectives,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'game.errors.failedToRejectObjectives',
      })
    }
  }

  /**
   * POST /api/objectives/validate
   * Validate (confirm) the current objectives
   * Body: { gameId: string, playerId: string, rejectedIds?: string[] }
   *
   * TODO: Remove gameId/playerId from body when authentication is implemented
   * TODO: Save validated objectives to database instead of in-memory storage
   */
  async validate({ request, response }: HttpContext) {
    try {
      // TODO: Replace with auth.user.id when authentication is implemented
      const { gameId, playerId, rejectedIds } = request.only([
        'gameId',
        'playerId',
        'rejectedIds',
      ])

      // Get current objectives from storage service
      let objectives = objectiveStorageService.retrieve(gameId, playerId)

      // Apply final rejections if provided
      if (rejectedIds && rejectedIds.length > 0) {
        objectives = objectives.filter((obj: ObjectiveDefinition) => !rejectedIds.includes(obj.id))
      }

      // TODO: In production, save validated objectives to database
      // For demo, we just store them back in memory
      objectiveStorageService.store(gameId, playerId, objectives)

      return response.ok({
        success: true,
        data: {
          validatedObjectives: objectives,
        },
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'game.errors.failedToValidateObjectives',
      })
    }
  }

  /**
   * POST /api/objectives/verify
   * Verify objectives for a round and calculate points
   * Body: { roundId: string, mockRoundData?: object }
   *
   * TODO: Remove mockRoundData when Round model is implemented
   * TODO: Get roundId from authenticated user's current game state
   */
  async verify({ request, response }: HttpContext) {
    try {
      const { roundId, mockRoundData } = request.only(['roundId', 'mockRoundData'])

      if (!roundId) {
        return response.badRequest({
          success: false,
          message: 'game.errors.roundIdRequired',
        })
      }

      // Verify objectives for the round
      const result = await this.verificationService.verifyRound(roundId, mockRoundData)

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
        message: 'game.errors.failedToVerifyObjectives',
      })
    }
  }
}
