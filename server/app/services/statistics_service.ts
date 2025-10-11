/**
 * Statistics Service
 * Handles user statistics tracking and updates
 *
 * Responsibilities:
 * - Create statistics entry for new users
 * - Update statistics after game completion
 * - Calculate aggregated stats (win rate, averages, etc.)
 * - Retrieve user statistics with game history
 *
 * Statistics tracked:
 * - Games played/won/lost
 * - Win rate
 * - Objectives completed/total
 * - Effects activated
 * - Tricks won (total and average)
 * - Scores (best, total, average)
 */

import UserStatistic from '#models/user_statistic'
import User from '#models/user'
import GamePlayer from '#models/game_player'
import logger from '@adonisjs/core/services/logger'

export interface GameStatisticsUpdate {
  userId: string
  gameId: string
  won: boolean
  score: number
  objectivesCompleted: number
  objectivesTotal: number
  effectsActivated: number
  tricksWon: number
}

export interface UserStatisticsData {
  userId: string
  username: string
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  winRate: number
  objectivesCompleted: number
  objectivesTotal: number
  effectsActivated: number
  tricksWonTotal: number
  tricksWonAverage: number
  bestScore: number
  totalPoints: number
  averageScore: number
  createdAt: string
  updatedAt: string
}

export interface GameHistoryEntry {
  gameId: string
  status: string
  won: boolean
  score: number
  playerCount: number
  playedAt: string
}

export default class StatisticsService {
  /**
   * Create initial statistics entry for a new user
   * Should be called after user registration
   */
  async createForUser(userId: string): Promise<UserStatistic> {
    logger.info(`Creating statistics for user ${userId}`)

    const stats = await UserStatistic.create({
      userId,
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      winRate: 0,
      objectivesCompleted: 0,
      objectivesTotal: 0,
      effectsActivated: 0,
      tricksWonTotal: 0,
      tricksWonAverage: 0,
      bestScore: 0,
      totalPoints: 0,
      averageScore: 0,
    })

    logger.info(`Statistics created for user ${userId}`)
    return stats
  }

  /**
   * Update statistics after a game finishes
   */
  async updateAfterGame(update: GameStatisticsUpdate): Promise<UserStatistic> {
    logger.info(`Updating statistics for user ${update.userId} after game ${update.gameId}`)

    // Get or create statistics
    let stats = await UserStatistic.query().where('userId', update.userId).first()

    if (!stats) {
      logger.warn(`No statistics found for user ${update.userId}, creating new entry`)
      stats = await this.createForUser(update.userId)
    }

    // Update game counts
    stats.gamesPlayed += 1
    if (update.won) {
      stats.gamesWon += 1
    } else {
      stats.gamesLost += 1
    }

    // Calculate win rate
    stats.winRate = (stats.gamesWon / stats.gamesPlayed) * 100

    // Update objectives
    stats.objectivesCompleted += update.objectivesCompleted
    stats.objectivesTotal += update.objectivesTotal

    // Update effects
    stats.effectsActivated += update.effectsActivated

    // Update tricks
    stats.tricksWonTotal += update.tricksWon
    stats.tricksWonAverage = stats.tricksWonTotal / stats.gamesPlayed

    // Update scores
    stats.totalPoints += update.score
    stats.averageScore = stats.totalPoints / stats.gamesPlayed
    if (update.score > stats.bestScore) {
      stats.bestScore = update.score
    }

    await stats.save()

    logger.info(
      `Statistics updated for user ${update.userId}: ${stats.gamesPlayed} games, ${stats.gamesWon} wins, ${stats.winRate.toFixed(2)}% win rate`
    )

    return stats
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(userId: string): Promise<UserStatisticsData | null> {
    const stats = await UserStatistic.query().where('userId', userId).first()

    if (!stats) {
      logger.warn(`No statistics found for user ${userId}`)
      return null
    }

    const user = await User.findOrFail(userId)

    return {
      userId: stats.userId,
      username: user.username,
      gamesPlayed: stats.gamesPlayed,
      gamesWon: stats.gamesWon,
      gamesLost: stats.gamesLost,
      winRate: Number(stats.winRate),
      objectivesCompleted: stats.objectivesCompleted,
      objectivesTotal: stats.objectivesTotal,
      effectsActivated: stats.effectsActivated,
      tricksWonTotal: stats.tricksWonTotal,
      tricksWonAverage: Number(stats.tricksWonAverage),
      bestScore: stats.bestScore,
      totalPoints: stats.totalPoints,
      averageScore: Number(stats.averageScore),
      createdAt: stats.createdAt.toISO() || '',
      updatedAt: stats.updatedAt?.toISO() || '',
    }
  }

  /**
   * Get user game history
   * Returns the last N games played by the user
   */
  async getUserGameHistory(userId: string, limit: number = 10): Promise<GameHistoryEntry[]> {
    const gamePlayers = await GamePlayer.query()
      .where('userId', userId)
      .preload('game')
      .orderBy('createdAt', 'desc')
      .limit(limit)

    const history: GameHistoryEntry[] = []

    for (const gp of gamePlayers) {
      const game = gp.game
      const playerCount = await GamePlayer.query().where('gameId', game.id).count('* as total')

      history.push({
        gameId: game.id,
        status: game.status,
        won: game.winnerId === userId,
        score: gp.totalScore,
        playerCount: Number(playerCount[0].$extras.total),
        playedAt: gp.createdAt.toISO() || '',
      })
    }

    return history
  }

  /**
   * Get statistics for multiple users (leaderboard)
   */
  async getLeaderboard(limit: number = 10): Promise<UserStatisticsData[]> {
    const stats = await UserStatistic.query()
      .preload('user')
      .orderBy('winRate', 'desc')
      .orderBy('gamesWon', 'desc')
      .limit(limit)

    return stats.map((stat) => ({
      userId: stat.userId,
      username: stat.user.username,
      gamesPlayed: stat.gamesPlayed,
      gamesWon: stat.gamesWon,
      gamesLost: stat.gamesLost,
      winRate: Number(stat.winRate),
      objectivesCompleted: stat.objectivesCompleted,
      objectivesTotal: stat.objectivesTotal,
      effectsActivated: stat.effectsActivated,
      tricksWonTotal: stat.tricksWonTotal,
      tricksWonAverage: Number(stat.tricksWonAverage),
      bestScore: stat.bestScore,
      totalPoints: stat.totalPoints,
      averageScore: Number(stat.averageScore),
      createdAt: stat.createdAt.toISO() || '',
      updatedAt: stat.updatedAt?.toISO() || '',
    }))
  }

  /**
   * Reset statistics for a user (for testing purposes)
   */
  async resetUserStatistics(userId: string): Promise<void> {
    const stats = await UserStatistic.query().where('userId', userId).first()

    if (!stats) {
      logger.warn(`No statistics to reset for user ${userId}`)
      return
    }

    stats.gamesPlayed = 0
    stats.gamesWon = 0
    stats.gamesLost = 0
    stats.winRate = 0
    stats.objectivesCompleted = 0
    stats.objectivesTotal = 0
    stats.effectsActivated = 0
    stats.tricksWonTotal = 0
    stats.tricksWonAverage = 0
    stats.bestScore = 0
    stats.totalPoints = 0
    stats.averageScore = 0

    await stats.save()

    logger.info(`Statistics reset for user ${userId}`)
  }
}
