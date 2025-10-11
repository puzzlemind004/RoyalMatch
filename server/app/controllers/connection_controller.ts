import type { HttpContext } from '@adonisjs/core/http'
import { ConnectionManager } from '#services/connection_manager'

/**
 * ConnectionController
 * Handles WebSocket connection lifecycle HTTP endpoints
 */
export default class ConnectionController {
  /**
   * Heartbeat endpoint
   * Updates the last_heartbeat timestamp for the authenticated user's connection
   */
  async heartbeat({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      // Get user's active connection
      const connection = await ConnectionManager.getPlayerConnection(user.id)

      if (!connection) {
        return response.notFound({
          success: false,
          message: 'websocket.errors.noActiveConnection',
        })
      }

      // Update heartbeat
      await ConnectionManager.heartbeat(connection.sessionId)

      return response.ok({
        success: true,
        timestamp: Date.now(),
      })
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: 'websocket.errors.notAuthenticated',
      })
    }
  }

  /**
   * Get current session information
   * Returns the session ID for the authenticated user's active connection
   */
  async getSession({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      // Get user's active connection
      const connection = await ConnectionManager.getPlayerConnection(user.id)

      if (!connection) {
        return response.notFound({
          success: false,
          message: 'websocket.errors.noActiveConnection',
        })
      }

      return response.ok({
        success: true,
        sessionId: connection.sessionId,
        status: connection.status,
        connectedAt: connection.connectedAt.toISO(),
      })
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: 'websocket.errors.notAuthenticated',
      })
    }
  }

  /**
   * Manually disconnect the current user's session
   */
  async disconnect({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const connection = await ConnectionManager.getPlayerConnection(user.id)

      if (!connection) {
        return response.notFound({
          success: false,
          message: 'websocket.errors.noActiveConnection',
        })
      }

      await ConnectionManager.disconnect(connection.sessionId)

      return response.ok({
        success: true,
        message: 'websocket.info.disconnected',
      })
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: 'websocket.errors.notAuthenticated',
      })
    }
  }

  /**
   * Get list of online players
   */
  async getOnlinePlayers({ auth, response }: HttpContext) {
    try {
      await auth.authenticate()

      const players = await ConnectionManager.getOnlinePlayers()

      return response.ok({
        success: true,
        players: players.map((p) => ({
          userId: p.userId,
          username: p.user.username,
          status: p.status,
          connectedAt: p.connectedAt.toISO(),
        })),
        count: players.length,
      })
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: 'websocket.errors.notAuthenticated',
      })
    }
  }
}
