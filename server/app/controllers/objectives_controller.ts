/**
 * Objectives Controller
 * Handles API endpoints for objective distribution
 */

import type { HttpContext } from '@adonisjs/core/http'
import ObjectiveDistributionService from '#services/objective_distribution_service'
import { drawObjectivesValidator } from '#validators/objective_distribution_validator'

export default class ObjectivesController {
  private distributionService = new ObjectiveDistributionService()

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

      // Draw objectives
      const objectives = this.distributionService.drawObjectives(selection)

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
}
