import transmit from '@adonisjs/transmit/services/main'

/**
 * WebSocket event types for real-time game communication
 */
export enum WebSocketEvent {
  // Connection events
  PLAYER_CONNECTED = 'player:connected',
  PLAYER_DISCONNECTED = 'player:disconnected',
  PLAYER_RECONNECTED = 'player:reconnected',
  AI_TAKEOVER = 'player:ai_takeover',

  // Player events
  PLAYER_JOINED = 'player:joined',
  PLAYER_LEFT = 'player:left',

  // Game lifecycle events
  GAME_STARTED = 'game:started',
  GAME_ENDED = 'game:ended',

  // Turn events
  TURN_STARTED = 'turn:started',
  TURN_ENDED = 'turn:ended',

  // Round events
  ROUND_STARTED = 'round:started',
  ROUND_ENDED = 'round:ended',
  ROULETTE_RESULT = 'roulette:result',

  // Card events
  CARDS_DISTRIBUTED = 'cards:distributed',
  CARD_PLAYED = 'card:played',

  // Mulligan events
  MULLIGAN_PHASE_STARTED = 'mulligan:phase_started',
  MULLIGAN_COMPLETED = 'mulligan:completed',
  MULLIGAN_TIMEOUT = 'mulligan:timeout',
}

/**
 * WebSocket channel patterns for different game contexts
 */
export class WebSocketChannels {
  /**
   * Channel for a specific game room
   */
  static game(gameId: string): string {
    return `game:${gameId}`
  }

  /**
   * Channel for waiting room/lobby
   */
  static room(roomId: string): string {
    return `room:${roomId}`
  }

  /**
   * Channel for spectators watching a game
   */
  static spectator(gameId: string): string {
    return `spectator:${gameId}`
  }

  /**
   * Private channel for a specific user
   */
  static user(userId: string): string {
    return `user:${userId}`
  }
}

/**
 * Service to manage WebSocket communications using AdonisJS Transmit
 */
export class WebSocketService {
  /**
   * Broadcast an event to all connected clients (global)
   */
  static broadcastGlobal<T = any>(event: WebSocketEvent, data: T): void {
    const channel = 'global'
    transmit.broadcast(channel, JSON.stringify({ event, data, timestamp: Date.now() }))
  }

  /**
   * Broadcast an event to all clients in a game
   */
  static broadcastToGame<T = any>(gameId: string, event: WebSocketEvent, data: T): void {
    const channel = WebSocketChannels.game(gameId)
    transmit.broadcast(channel, JSON.stringify({ event, data, timestamp: Date.now() }))
  }

  /**
   * Broadcast an event to all clients in a room
   */
  static broadcastToRoom<T = any>(roomId: string, event: WebSocketEvent, data: T): void {
    const channel = WebSocketChannels.room(roomId)
    transmit.broadcast(channel, JSON.stringify({ event, data, timestamp: Date.now() }))
  }

  /**
   * Broadcast an event to spectators of a game
   */
  static broadcastToSpectators<T = any>(gameId: string, event: WebSocketEvent, data: T): void {
    const channel = WebSocketChannels.spectator(gameId)
    transmit.broadcast(channel, JSON.stringify({ event, data, timestamp: Date.now() }))
  }

  /**
   * Broadcast player joined event
   */
  static playerJoined(gameId: string, playerData: { id: string; username: string }): void {
    this.broadcastToGame(gameId, WebSocketEvent.PLAYER_JOINED, playerData)
  }

  /**
   * Broadcast player left event
   */
  static playerLeft(gameId: string, playerData: { id: string; username: string }): void {
    this.broadcastToGame(gameId, WebSocketEvent.PLAYER_LEFT, playerData)
  }

  /**
   * Broadcast game started event
   */
  static gameStarted(gameId: string, gameData: { playerCount: number; startTime: number }): void {
    this.broadcastToGame(gameId, WebSocketEvent.GAME_STARTED, gameData)
    this.broadcastToSpectators(gameId, WebSocketEvent.GAME_STARTED, gameData)
  }

  /**
   * Broadcast turn started event
   */
  static turnStarted(
    gameId: string,
    turnData: { turnNumber: number; activePlayer?: string }
  ): void {
    this.broadcastToGame(gameId, WebSocketEvent.TURN_STARTED, turnData)
    this.broadcastToSpectators(gameId, WebSocketEvent.TURN_STARTED, turnData)
  }

  /**
   * Broadcast card played event
   */
  static cardPlayed(
    gameId: string,
    cardData: { playerId: string; cardId?: string; hidden?: boolean }
  ): void {
    this.broadcastToGame(gameId, WebSocketEvent.CARD_PLAYED, cardData)
    this.broadcastToSpectators(gameId, WebSocketEvent.CARD_PLAYED, cardData)
  }

  /**
   * Broadcast turn ended event
   */
  static turnEnded(gameId: string, turnData: { turnNumber: number; results?: any }): void {
    this.broadcastToGame(gameId, WebSocketEvent.TURN_ENDED, turnData)
    this.broadcastToSpectators(gameId, WebSocketEvent.TURN_ENDED, turnData)
  }

  /**
   * Broadcast roulette result event
   */
  static rouletteResult(
    gameId: string,
    rouletteData: { dominantColor: string; weakColor: string; neutrals: string[] }
  ): void {
    this.broadcastToGame(gameId, WebSocketEvent.ROULETTE_RESULT, rouletteData)
    this.broadcastToSpectators(gameId, WebSocketEvent.ROULETTE_RESULT, rouletteData)
  }

  /**
   * Broadcast round ended event
   */
  static roundEnded(gameId: string, roundData: { roundNumber: number; scores?: any }): void {
    this.broadcastToGame(gameId, WebSocketEvent.ROUND_ENDED, roundData)
    this.broadcastToSpectators(gameId, WebSocketEvent.ROUND_ENDED, roundData)
  }

  /**
   * Broadcast game ended event
   */
  static gameEnded(gameId: string, gameData: { winner?: string; finalScores?: any }): void {
    this.broadcastToGame(gameId, WebSocketEvent.GAME_ENDED, gameData)
    this.broadcastToSpectators(gameId, WebSocketEvent.GAME_ENDED, gameData)
  }

  /**
   * Send cards distributed event to a specific user (private)
   */
  static cardsDistributed(userId: string, cardData: { cards: any[]; count: number }): void {
    const channel = WebSocketChannels.user(userId)
    transmit.broadcast(
      channel,
      JSON.stringify({
        event: WebSocketEvent.CARDS_DISTRIBUTED,
        data: cardData,
        timestamp: Date.now(),
      })
    )
  }
}
