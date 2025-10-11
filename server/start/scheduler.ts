/**
 * Connection Scheduler
 * Periodically checks for stale WebSocket connections
 * and triggers disconnection for inactive players
 */

import { ConnectionManager } from '#services/connection_manager'
import logger from '@adonisjs/core/services/logger'

/**
 * Check interval: Every minute
 */
const CHECK_INTERVAL_MS = 60 * 1000 // 1 minute

/**
 * Start the connection checker scheduler
 * This runs every minute to detect and disconnect stale connections
 */
function startConnectionChecker() {
  setInterval(async () => {
    try {
      await ConnectionManager.checkStaleConnections()
      logger.debug('Connection checker: Stale connections check completed')
    } catch (error) {
      logger.error('Connection checker: Error checking stale connections', { error })
    }
  }, CHECK_INTERVAL_MS)

  logger.info('Connection checker scheduler started', {
    interval: `${CHECK_INTERVAL_MS / 1000}s`,
  })
}

// Start scheduler on application boot
startConnectionChecker()
