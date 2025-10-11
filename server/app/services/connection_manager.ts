import { DateTime } from 'luxon'
import PlayerConnection, { PlayerStatus } from '#models/player_connection'
import User from '#models/user'
import { WebSocketService, WebSocketEvent } from './websocket_service.js'
import { randomUUID } from 'node:crypto'

/**
 * Connection timeout configuration
 * After 2 minutes of disconnection, AI takes over
 */
const DISCONNECT_TIMEOUT_MS = 2 * 60 * 1000 // 2 minutes
const HEARTBEAT_TIMEOUT_MS = 45 * 1000 // 45 seconds (Transmit ping is 30s)

/**
 * ConnectionManager
 * Manages player connections, heartbeats, and disconnection handling
 */
export class ConnectionManager {
  private static timeoutCheckers: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Register a new player connection
   */
  static async connect(user: User, sessionId?: string): Promise<PlayerConnection> {
    const sid = sessionId || randomUUID()

    // Check if user already has an active connection
    const existingConnection = await PlayerConnection.query()
      .where('user_id', user.id)
      .where('status', PlayerStatus.ONLINE)
      .first()

    if (existingConnection) {
      // Update existing connection
      existingConnection.sessionId = sid
      existingConnection.connectedAt = DateTime.now()
      existingConnection.lastHeartbeat = DateTime.now()
      existingConnection.disconnectedAt = null
      await existingConnection.save()

      return existingConnection
    }

    // Create new connection
    const connection = await PlayerConnection.create({
      id: randomUUID(),
      userId: user.id,
      status: PlayerStatus.ONLINE,
      sessionId: sid,
      connectedAt: DateTime.now(),
      lastHeartbeat: DateTime.now(),
    })

    // Broadcast player connected event
    WebSocketService.broadcastGlobal(WebSocketEvent.PLAYER_CONNECTED, {
      userId: user.id,
      username: user.username,
      status: PlayerStatus.ONLINE,
    })

    return connection
  }

  /**
   * Handle player disconnect
   */
  static async disconnect(sessionId: string): Promise<void> {
    const connection = await PlayerConnection.query().where('session_id', sessionId).first()

    if (!connection) {
      return
    }

    await connection.load('user')

    // If player is in game, start timeout for AI takeover
    if (connection.status === PlayerStatus.IN_GAME && connection.gameId) {
      connection.status = PlayerStatus.OFFLINE
      connection.disconnectedAt = DateTime.now()
      await connection.save()

      // Broadcast temporary disconnect
      WebSocketService.broadcastToGame(connection.gameId, WebSocketEvent.PLAYER_DISCONNECTED, {
        userId: connection.userId,
        username: connection.user.username,
        temporary: true,
        timeout: DISCONNECT_TIMEOUT_MS,
      })

      // Start timeout checker
      this.startDisconnectTimeout(connection)
    } else {
      // Normal disconnect
      connection.status = PlayerStatus.OFFLINE
      connection.disconnectedAt = DateTime.now()
      await connection.save()

      // Broadcast player disconnected event
      WebSocketService.broadcastGlobal(WebSocketEvent.PLAYER_DISCONNECTED, {
        userId: connection.userId,
        username: connection.user.username,
        temporary: false,
      })
    }
  }

  /**
   * Update heartbeat timestamp
   */
  static async heartbeat(sessionId: string): Promise<void> {
    const connection = await PlayerConnection.query().where('session_id', sessionId).first()

    if (!connection) {
      return
    }

    connection.lastHeartbeat = DateTime.now()
    await connection.save()

    // If player reconnected before timeout, cancel AI takeover
    if (connection.status === PlayerStatus.OFFLINE && connection.gameId) {
      await this.reconnect(sessionId)
    }
  }

  /**
   * Handle player reconnection
   */
  static async reconnect(sessionId: string): Promise<void> {
    const connection = await PlayerConnection.query().where('session_id', sessionId).first()

    if (!connection) {
      return
    }

    await connection.load('user')

    // Cancel timeout if exists
    if (this.timeoutCheckers.has(connection.id)) {
      clearTimeout(this.timeoutCheckers.get(connection.id)!)
      this.timeoutCheckers.delete(connection.id)
    }

    // Restore connection
    connection.status = connection.gameId ? PlayerStatus.IN_GAME : PlayerStatus.ONLINE
    connection.disconnectedAt = null
    connection.lastHeartbeat = DateTime.now()
    await connection.save()

    // Broadcast reconnection
    if (connection.gameId) {
      WebSocketService.broadcastToGame(connection.gameId, WebSocketEvent.PLAYER_RECONNECTED, {
        userId: connection.userId,
        username: connection.user.username,
      })
    } else {
      WebSocketService.broadcastGlobal(WebSocketEvent.PLAYER_CONNECTED, {
        userId: connection.userId,
        username: connection.user.username,
        status: PlayerStatus.ONLINE,
      })
    }
  }

  /**
   * Set player as in-game
   */
  static async joinGame(userId: string, gameId: string): Promise<void> {
    const connection = await PlayerConnection.query()
      .where('user_id', userId)
      .where('status', PlayerStatus.ONLINE)
      .first()

    if (!connection) {
      return
    }

    connection.status = PlayerStatus.IN_GAME
    connection.gameId = gameId
    await connection.save()
  }

  /**
   * Set player as online (left game)
   */
  static async leaveGame(userId: string): Promise<void> {
    const connection = await PlayerConnection.query()
      .where('user_id', userId)
      .where('status', PlayerStatus.IN_GAME)
      .first()

    if (!connection) {
      return
    }

    connection.status = PlayerStatus.ONLINE
    connection.gameId = null
    await connection.save()
  }

  /**
   * Start disconnect timeout checker
   * After 2 minutes, AI takes over
   */
  private static startDisconnectTimeout(connection: PlayerConnection): void {
    const timeoutId = setTimeout(async () => {
      // Check if player is still disconnected
      const current = await PlayerConnection.find(connection.id)

      if (!current || current.status !== PlayerStatus.OFFLINE) {
        // Player reconnected, do nothing
        return
      }

      await current.load('user')

      // Trigger AI takeover
      if (current.gameId) {
        WebSocketService.broadcastToGame(current.gameId, WebSocketEvent.AI_TAKEOVER, {
          userId: current.userId,
          username: current.user.username,
        })

        // Mark as permanently disconnected from game
        current.gameId = null
        await current.save()
      }

      // Clean up
      this.timeoutCheckers.delete(connection.id)
    }, DISCONNECT_TIMEOUT_MS)

    this.timeoutCheckers.set(connection.id, timeoutId)
  }

  /**
   * Check for stale connections (no heartbeat for > 45 seconds)
   * Should be called periodically (e.g., every minute)
   */
  static async checkStaleConnections(): Promise<void> {
    const threshold = DateTime.now().minus({ milliseconds: HEARTBEAT_TIMEOUT_MS })

    const staleConnections = await PlayerConnection.query()
      .where('status', '!=', PlayerStatus.OFFLINE)
      .where('last_heartbeat', '<', threshold.toSQL())
      .preload('user')

    for (const connection of staleConnections) {
      // Force disconnect
      await this.disconnect(connection.sessionId)
    }
  }

  /**
   * Get all online players
   */
  static async getOnlinePlayers(): Promise<PlayerConnection[]> {
    return PlayerConnection.query()
      .where('status', PlayerStatus.ONLINE)
      .orWhere('status', PlayerStatus.IN_GAME)
      .preload('user')
  }

  /**
   * Get player connection by user ID
   */
  static async getPlayerConnection(userId: string): Promise<PlayerConnection | null> {
    return PlayerConnection.query().where('user_id', userId).first()
  }
}
