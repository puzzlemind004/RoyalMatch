import type { HttpContext } from '@adonisjs/core/http'
import StatisticsService from '#services/statistics_service'
import {
  getStatisticsValidator,
  getGameHistoryValidator,
  getLeaderboardValidator,
} from '#validators/statistics/get_statistic'

export default class StatisticsController {
  private statisticsService: StatisticsService

  constructor() {
    this.statisticsService = new StatisticsService()
  }

  /**
   * Get user statistics
   * GET /api/statistics/:userId
   */
  async getUserStatistics({ request, response }: HttpContext) {
    const { params } = await request.validateUsing(getStatisticsValidator)
    const { userId } = params

    const stats = await this.statisticsService.getUserStatistics(userId)

    if (!stats) {
      return response.notFound({
        success: false,
        message: 'profile.errors.statisticsNotFound',
      })
    }

    return response.ok({
      success: true,
      data: stats,
    })
  }

  /**
   * Get current user statistics (authenticated)
   * GET /api/statistics/me
   */
  async getMyStatistics({ auth, response }: HttpContext) {
    const user = auth.user!
    const stats = await this.statisticsService.getUserStatistics(user.id)

    if (!stats) {
      // Create statistics if they don't exist
      await this.statisticsService.createForUser(user.id)
      const newStats = await this.statisticsService.getUserStatistics(user.id)
      return response.ok({
        success: true,
        data: newStats,
      })
    }

    return response.ok({
      success: true,
      data: stats,
    })
  }

  /**
   * Get user game history
   * GET /api/statistics/:userId/history?limit=10
   */
  async getGameHistory({ request, response }: HttpContext) {
    const { params, qs } = await request.validateUsing(getGameHistoryValidator)
    const { userId } = params
    const limit = qs.limit || 10

    const history = await this.statisticsService.getUserGameHistory(userId, limit)

    return response.ok({
      success: true,
      data: history,
    })
  }

  /**
   * Get current user game history (authenticated)
   * GET /api/statistics/me/history?limit=10
   */
  async getMyGameHistory({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const limit = request.qs().limit ? Number(request.qs().limit) : 10

    const history = await this.statisticsService.getUserGameHistory(user.id, limit)

    return response.ok({
      success: true,
      data: history,
    })
  }

  /**
   * Get leaderboard
   * GET /api/statistics/leaderboard?limit=10
   */
  async getLeaderboard({ request, response }: HttpContext) {
    const { qs } = await request.validateUsing(getLeaderboardValidator)
    const limit = qs.limit || 10

    const leaderboard = await this.statisticsService.getLeaderboard(limit)

    return response.ok({
      success: true,
      data: leaderboard,
    })
  }

  /**
   * Reset user statistics (for testing)
   * DELETE /api/statistics/me/reset
   */
  async resetMyStatistics({ auth, response }: HttpContext) {
    const user = auth.user!
    await this.statisticsService.resetUserStatistics(user.id)

    return response.ok({
      success: true,
      message: 'profile.success.statisticsReset',
    })
  }
}