/**
 * Objectives Controller
 * Handles API endpoints for objective distribution and validation
 *
 * Authentication: All routes require auth.user
 * Game context: Supports both demo mode and real game sessions
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
   * No authentication required (public data)
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
   * Query: ?gameId=demo-game (optional, defaults to user's active game)
   */
  async draw({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()

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

      // Get gameId (demo or user's active game)
      const gameId = this.getGameId(request, user.id)

      // Demo mode: use in-memory storage
      if (gameId === 'demo-game') {
        objectiveStorageService.store(gameId, user.id, objectives)

        return response.ok({
          success: true,
          data: {
            objectives,
            selection,
            count: objectives.length,
            mode: 'demo',
          },
        })
      }

      // Production mode: store in database
      // TODO: Implement DB storage when Round/GamePlayer flow is ready
      // For now, fall back to in-memory storage
      objectiveStorageService.store(gameId, user.id, objectives)

      return response.ok({
        success: true,
        data: {
          objectives,
          selection,
          count: objectives.length,
          mode: 'memory', // Will be 'database' when implemented
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
   * Query: ?gameId=demo-game (optional)
   */
  async redraw({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const gameId = this.getGameId(request, user.id)

      // Get current objectives from storage
      const currentObjectives = objectiveStorageService.retrieve(gameId, user.id)

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

      // Store new objectives
      objectiveStorageService.store(gameId, user.id, newObjectives)

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
   * Body: { objectiveIds: string[] }
   * Query: ?gameId=demo-game (optional)
   */
  async reject({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const gameId = this.getGameId(request, user.id)
      const { objectiveIds } = request.only(['objectiveIds'])

      // Validate max 2 rejections
      if (objectiveIds.length > 2) {
        return response.badRequest({
          success: false,
          message: 'game.errors.tooManyRejections',
        })
      }

      // Get current objectives from storage
      const currentObjectives = objectiveStorageService.retrieve(gameId, user.id)

      // Remove rejected objectives
      const remainingObjectives = currentObjectives.filter(
        (obj: ObjectiveDefinition) => !objectiveIds.includes(obj.id)
      )

      // Store remaining objectives
      objectiveStorageService.store(gameId, user.id, remainingObjectives)

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
   * Body: { rejectedIds?: string[] }
   * Query: ?gameId=demo-game (optional)
   */
  async validate({ request, response, auth }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const gameId = this.getGameId(request, user.id)
      const { rejectedIds } = request.only(['rejectedIds'])

      // Get current objectives from storage
      let objectives = objectiveStorageService.retrieve(gameId, user.id)

      // Apply final rejections if provided
      if (rejectedIds && rejectedIds.length > 0) {
        objectives = objectives.filter((obj: ObjectiveDefinition) => !rejectedIds.includes(obj.id))
      }

      // Store validated objectives
      objectiveStorageService.store(gameId, user.id, objectives)

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
   * TODO: Remove mockRoundData when Round model is fully integrated
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

  /**
   * Helper: Get gameId from query param or user's active game
   */
  private getGameId(request: any, _userId: string): string {
    // Check query param first (for demos)
    const queryGameId = request.qs().gameId
    if (queryGameId) {
      return queryGameId
    }

    // TODO: Get from PlayerConnection when integrated
    // const connection = await ConnectionManager.getPlayerConnection(_userId)
    // if (connection?.gameId) {
    //   return connection.gameId
    // }

    // Default to demo mode
    return 'demo-game'
  }
}
