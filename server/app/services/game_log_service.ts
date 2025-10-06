/**
 * Game Log Service
 * Comprehensive logging for game actions
 * Enables game replay and cheat detection
 */

import logger from '@adonisjs/core/services/logger'

/**
 * Game action types
 */
export type GameActionType =
  | 'GAME_CREATED'
  | 'PLAYER_JOINED'
  | 'PLAYER_LEFT'
  | 'CARDS_DEALT'
  | 'STARTING_CARDS_SELECTED'
  | 'TURN_STARTED'
  | 'CARD_PLAYED'
  | 'CARD_DRAWN'
  | 'EFFECT_ACTIVATED'
  | 'TRICK_WON'
  | 'ROUND_ENDED'
  | 'GAME_ENDED'
  | 'VALIDATION_FAILED'
  | 'CHEAT_DETECTED'

/**
 * Game log entry
 */
export interface GameLogEntry {
  gameId: string
  actionType: GameActionType
  playerId?: number
  timestamp: Date
  data: any
  validationResult?: { valid: boolean; reason?: string }
}

/**
 * Game Log Service
 */
export class GameLogService {
  /**
   * In-memory log storage (should be persisted to database in production)
   */
  private logs: Map<string, GameLogEntry[]> = new Map()

  /**
   * Log a game action
   */
  log(entry: Omit<GameLogEntry, 'timestamp'>): void {
    const fullEntry: GameLogEntry = {
      ...entry,
      timestamp: new Date(),
    }

    // Get or create log array for this game
    const gameLogs = this.logs.get(entry.gameId) || []
    gameLogs.push(fullEntry)
    this.logs.set(entry.gameId, gameLogs)

    // Also log to application logger
    logger.info(
      {
        gameId: entry.gameId,
        action: entry.actionType,
        playerId: entry.playerId,
      },
      `Game action: ${entry.actionType}`
    )
  }

  /**
   * Log a validation failure
   */
  logValidationFailure(
    gameId: string,
    playerId: number,
    actionType: GameActionType,
    reason: string,
    data: any
  ): void {
    this.log({
      gameId,
      actionType: 'VALIDATION_FAILED',
      playerId,
      data: {
        originalAction: actionType,
        reason,
        attemptedData: data,
      },
      validationResult: {
        valid: false,
        reason,
      },
    })

    logger.warn(
      {
        gameId,
        playerId,
        actionType,
        reason,
      },
      'Validation failed'
    )
  }

  /**
   * Log cheat detection
   */
  logCheatDetection(gameId: string, playerId: number, cheatType: string, evidence: any): void {
    this.log({
      gameId,
      actionType: 'CHEAT_DETECTED',
      playerId,
      data: {
        cheatType,
        evidence,
      },
    })

    logger.error(
      {
        gameId,
        playerId,
        cheatType,
        evidence,
      },
      'CHEAT DETECTED'
    )
  }

  /**
   * Get all logs for a game
   */
  getGameLogs(gameId: string): GameLogEntry[] {
    return this.logs.get(gameId) || []
  }

  /**
   * Get logs for a specific player in a game
   */
  getPlayerLogs(gameId: string, playerId: number): GameLogEntry[] {
    const gameLogs = this.getGameLogs(gameId)
    return gameLogs.filter((log) => log.playerId === playerId)
  }

  /**
   * Get validation failures for a game
   */
  getValidationFailures(gameId: string): GameLogEntry[] {
    const gameLogs = this.getGameLogs(gameId)
    return gameLogs.filter((log) => log.actionType === 'VALIDATION_FAILED')
  }

  /**
   * Get cheat detections for a game
   */
  getCheatDetections(gameId: string): GameLogEntry[] {
    const gameLogs = this.getGameLogs(gameId)
    return gameLogs.filter((log) => log.actionType === 'CHEAT_DETECTED')
  }

  /**
   * Clear logs for a game (after game ends and data is persisted)
   */
  clearGameLogs(gameId: string): void {
    this.logs.delete(gameId)
  }

  /**
   * Get game timeline (all actions in chronological order)
   */
  getGameTimeline(gameId: string): GameLogEntry[] {
    const logs = this.getGameLogs(gameId)
    return logs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  /**
   * Export game logs for analysis (JSON format)
   */
  exportGameLogs(gameId: string): string {
    const logs = this.getGameTimeline(gameId)
    return JSON.stringify(logs, null, 2)
  }
}

// Export singleton instance
export default new GameLogService()
