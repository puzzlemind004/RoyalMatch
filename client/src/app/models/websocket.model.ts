/**
 * WebSocket connection states
 */
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
}

/**
 * WebSocket event types matching backend
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
  ROUND_ENDED = 'round:ended',

  // Action events
  CARD_PLAYED = 'card:played',
}

/**
 * Base structure for WebSocket messages
 */
export interface WebSocketMessage<T = any> {
  event: WebSocketEvent;
  data: T;
  timestamp: number;
}

/**
 * Player data structure
 */
export interface PlayerData {
  id: string;
  username: string;
}

/**
 * Game data structure
 */
export interface GameData {
  playerCount: number;
  startTime: number;
}

/**
 * Turn data structure
 */
export interface TurnData {
  turnNumber: number;
  activePlayer?: string;
  results?: any;
}

/**
 * Card data structure
 */
export interface CardData {
  playerId: string;
  cardId?: string;
  hidden?: boolean;
}

/**
 * Round data structure
 */
export interface RoundData {
  roundNumber: number;
  scores?: any;
}

/**
 * Game end data structure
 */
export interface GameEndData {
  winner?: string;
  finalScores?: any;
}

/**
 * Player connection data structure
 */
export interface PlayerConnectionData {
  userId: string;
  username: string;
  status?: string;
}

/**
 * Player disconnect data structure
 */
export interface PlayerDisconnectData {
  userId: string;
  username: string;
  temporary: boolean;
  timeout?: number;
}

/**
 * AI takeover data structure
 */
export interface AITakeoverData {
  userId: string;
  username: string;
}
