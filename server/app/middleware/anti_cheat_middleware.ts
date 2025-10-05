/**
 * Anti-Cheat Middleware
 * Detects and prevents cheating attempts
 * Logs suspicious activity for audit
 */

import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

/**
 * Action timestamps for rate limiting detection
 */
const playerActionTimestamps = new Map<string, number[]>()

/**
 * Suspicious activity counter
 */
const suspiciousActivityCounter = new Map<string, number>()

/**
 * Temporarily banned players
 */
const bannedPlayers = new Set<string>()

/**
 * Anti-Cheat Middleware
 */
export default class AntiCheatMiddleware {
  /**
   * Handle request
   */
  async handle(ctx: HttpContext, next: NextFn) {
    const { auth, request } = ctx

    // Must be authenticated
    if (!auth.user) {
      return ctx.response.unauthorized({
        code: 'AUTHENTICATION_REQUIRED',
        message: 'game.errors.authRequired',
      })
    }

    const playerId = String(auth.user.id)

    // Check if player is banned
    if (bannedPlayers.has(playerId)) {
      logger.warn({ playerId, path: request.url() }, 'Banned player attempted action')
      return ctx.response.forbidden({
        code: 'PLAYER_BANNED',
        message: 'game.errors.playerBanned',
      })
    }

    // Rate limiting: detect impossible action speeds
    const now = Date.now()
    const timestamps = playerActionTimestamps.get(playerId) || []

    // Keep only last 10 actions
    const recentTimestamps = [...timestamps, now].slice(-10)
    playerActionTimestamps.set(playerId, recentTimestamps)

    // Detect if more than 5 actions in less than 1 second
    if (recentTimestamps.length >= 5) {
      const oldestRecent = recentTimestamps[recentTimestamps.length - 5]
      const timeDiff = now - oldestRecent

      if (timeDiff < 1000) {
        this.logSuspiciousActivity(playerId, 'RAPID_ACTIONS', {
          actionsPerSecond: 5000 / timeDiff,
          path: request.url(),
        })

        // Increment suspicious counter
        const count = (suspiciousActivityCounter.get(playerId) || 0) + 1
        suspiciousActivityCounter.set(playerId, count)

        // Ban after 3 suspicious activities
        if (count >= 3) {
          bannedPlayers.add(playerId)
          logger.error({ playerId }, 'Player banned for repeated suspicious activity')

          // Auto-unban after 5 minutes
          setTimeout(
            () => {
              bannedPlayers.delete(playerId)
              suspiciousActivityCounter.delete(playerId)
              logger.info({ playerId }, 'Player auto-unbanned')
            },
            5 * 60 * 1000
          )

          return ctx.response.forbidden({
            code: 'PLAYER_BANNED',
            message: 'game.errors.playerBanned',
          })
        }

        return ctx.response.tooManyRequests({
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'game.errors.rateLimitExceeded',
        })
      }
    }

    // Log the action
    logger.debug(
      {
        playerId,
        path: request.url(),
        method: request.method(),
        ip: request.ip(),
      },
      'Player game action'
    )

    // Continue to next middleware/controller
    await next()
  }

  /**
   * Log suspicious activity
   */
  private logSuspiciousActivity(playerId: string, type: string, details: any) {
    logger.warn(
      {
        playerId,
        type,
        details,
        timestamp: new Date().toISOString(),
      },
      'Suspicious activity detected'
    )
  }
}
