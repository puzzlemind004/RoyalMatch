import type { HttpContext } from '@adonisjs/core/http'
import { WebSocketService, WebSocketEvent } from '#services/websocket_service'

/**
 * Controller for testing WebSocket functionality
 * These endpoints will be removed in production
 */
export default class WebSocketTestController {
  /**
   * Test broadcasting a player joined event
   */
  async testPlayerJoined({ request, response }: HttpContext) {
    const { gameId, playerId, username } = request.only(['gameId', 'playerId', 'username'])

    WebSocketService.playerJoined(gameId, {
      id: playerId,
      username,
    })

    return response.ok({
      message: 'Player joined event broadcasted',
      event: WebSocketEvent.PLAYER_JOINED,
      gameId,
    })
  }

  /**
   * Test broadcasting a game started event
   */
  async testGameStarted({ request, response }: HttpContext) {
    const { gameId, playerCount } = request.only(['gameId', 'playerCount'])

    WebSocketService.gameStarted(gameId, {
      playerCount: Number(playerCount),
      startTime: Date.now(),
    })

    return response.ok({
      message: 'Game started event broadcasted',
      event: WebSocketEvent.GAME_STARTED,
      gameId,
    })
  }

  /**
   * Test broadcasting a turn started event
   */
  async testTurnStarted({ request, response }: HttpContext) {
    const { gameId, turnNumber, activePlayer } = request.only([
      'gameId',
      'turnNumber',
      'activePlayer',
    ])

    WebSocketService.turnStarted(gameId, {
      turnNumber: Number(turnNumber),
      activePlayer,
    })

    return response.ok({
      message: 'Turn started event broadcasted',
      event: WebSocketEvent.TURN_STARTED,
      gameId,
    })
  }

  /**
   * Test broadcasting a card played event
   */
  async testCardPlayed({ request, response }: HttpContext) {
    const { gameId, playerId, cardId, hidden } = request.only([
      'gameId',
      'playerId',
      'cardId',
      'hidden',
    ])

    WebSocketService.cardPlayed(gameId, {
      playerId,
      cardId,
      hidden: hidden === 'true',
    })

    return response.ok({
      message: 'Card played event broadcasted',
      event: WebSocketEvent.CARD_PLAYED,
      gameId,
    })
  }
}
