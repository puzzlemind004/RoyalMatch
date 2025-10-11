import { Injectable, signal, effect, inject } from '@angular/core';
import { Transmit } from '@adonisjs/transmit-client';
import { environment } from '../../../environments/environment';
import {
  ConnectionState,
  WebSocketEvent,
  WebSocketMessage,
  PlayerData,
  GameData,
  TurnData,
  CardData,
  RoundData,
  GameEndData,
  PlayerConnectionData,
  PlayerDisconnectData,
  AITakeoverData,
} from '../../models/websocket.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private authService = inject(AuthService);
  private transmit: Transmit | null = null;
  private reconnectTimeout: any = null;
  private reconnectAttempts = 0;
  private heartbeatInterval: any = null;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 2000;
  private readonly heartbeatDelay = 30000; // 30 seconds

  // Signals for reactive state management
  readonly connectionState = signal<ConnectionState>(ConnectionState.DISCONNECTED);
  readonly latency = signal<number>(0);
  readonly lastError = signal<string | null>(null);
  readonly sessionId = signal<string | null>(null);

  // Connection event signals
  readonly playerConnected = signal<PlayerConnectionData | null>(null);
  readonly playerDisconnected = signal<PlayerDisconnectData | null>(null);
  readonly playerReconnected = signal<PlayerConnectionData | null>(null);
  readonly aiTakeover = signal<AITakeoverData | null>(null);

  // Event signals
  readonly playerJoined = signal<PlayerData | null>(null);
  readonly playerLeft = signal<PlayerData | null>(null);
  readonly gameStarted = signal<GameData | null>(null);
  readonly turnStarted = signal<TurnData | null>(null);
  readonly cardPlayed = signal<CardData | null>(null);
  readonly turnEnded = signal<TurnData | null>(null);
  readonly roundEnded = signal<RoundData | null>(null);
  readonly gameEnded = signal<GameEndData | null>(null);

  constructor() {
    // Auto-cleanup on window unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.disconnect());
    }

    // Auto-connect when user is authenticated
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  /**
   * Connect to WebSocket server with authentication
   */
  connect(): void {
    if (this.connectionState() === ConnectionState.CONNECTED) {
      return;
    }

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.lastError.set('websocket.errors.notAuthenticated');
      return;
    }

    this.connectionState.set(ConnectionState.CONNECTING);

    try {
      // Note: Authentication will be handled by backend middleware
      // The JWT token from AuthService is automatically sent via cookies/headers
      this.transmit = new Transmit({
        baseUrl: environment.wsUrl,
      });

      this.setupEventListeners();
      this.startHeartbeat();
      this.connectionState.set(ConnectionState.CONNECTED);
      this.reconnectAttempts = 0;
      this.lastError.set(null);

      // Subscribe to global channel for connection events
      this.subscribeToGlobal();
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.transmit) {
      this.transmit = null;
    }

    this.connectionState.set(ConnectionState.DISCONNECTED);
    this.sessionId.set(null);
  }

  /**
   * Subscribe to global channel for connection events
   */
  private subscribeToGlobal(): void {
    if (!this.transmit) {
      return;
    }

    const subscription = this.transmit.subscription('global');
    subscription.create();

    subscription.onMessage((rawMessage: string) => {
      try {
        const message: WebSocketMessage = JSON.parse(rawMessage);
        this.handleMessage(message);
      } catch (error) {
        // Silently handle parsing errors
      }
    });
  }

  /**
   * Start heartbeat interval
   * Sends periodic heartbeat to server every 30 seconds
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatDelay);
  }

  /**
   * Send heartbeat to server
   * This is handled automatically by Transmit, but we can track it
   */
  private sendHeartbeat(): void {
    if (!this.transmit || this.connectionState() !== ConnectionState.CONNECTED) {
      return;
    }

    // Transmit handles heartbeat automatically via pingInterval config
    // We just track that we're still connected
  }

  /**
   * Subscribe to a game channel
   */
  subscribeToGame(gameId: string): void {
    if (!this.transmit) {
      throw new Error('WebSocket not connected');
    }

    const channel = `game:${gameId}`;
    const subscription = this.transmit.subscription(channel);
    subscription.create();

    // Listen for messages on this channel
    subscription.onMessage((rawMessage: string) => {
      try {
        const message: WebSocketMessage = JSON.parse(rawMessage);
        this.handleMessage(message);
      } catch (error) {
        // Silently handle parsing errors
      }
    });
  }

  /**
   * Subscribe to a room channel
   */
  subscribeToRoom(roomId: string): void {
    if (!this.transmit) {
      throw new Error('WebSocket not connected');
    }

    const channel = `room:${roomId}`;
    this.transmit.subscription(channel).create();
  }

  /**
   * Subscribe to spectator channel
   */
  subscribeToSpectator(gameId: string): void {
    if (!this.transmit) {
      throw new Error('WebSocket not connected');
    }

    const channel = `spectator:${gameId}`;
    this.transmit.subscription(channel).create();
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channel: string): void {
    if (!this.transmit) {
      return;
    }

    this.transmit.subscription(channel).delete();
  }

  /**
   * Setup event listeners for all WebSocket events
   * Note: Event listeners are set up when subscribing to specific channels
   */
  private setupEventListeners(): void {
    // Event listeners will be configured when subscribing to channels
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(message: WebSocketMessage): void {
    const { event, data, timestamp } = message;

    // Calculate latency
    if (timestamp) {
      this.latency.set(Date.now() - timestamp);
    }

    // Update corresponding signal based on event type
    switch (event) {
      // Connection events
      case WebSocketEvent.PLAYER_CONNECTED:
        this.playerConnected.set(data as PlayerConnectionData);
        break;

      case WebSocketEvent.PLAYER_DISCONNECTED:
        this.playerDisconnected.set(data as PlayerDisconnectData);
        break;

      case WebSocketEvent.PLAYER_RECONNECTED:
        this.playerReconnected.set(data as PlayerConnectionData);
        break;

      case WebSocketEvent.AI_TAKEOVER:
        this.aiTakeover.set(data as AITakeoverData);
        break;

      // Player events
      case WebSocketEvent.PLAYER_JOINED:
        this.playerJoined.set(data as PlayerData);
        break;

      case WebSocketEvent.PLAYER_LEFT:
        this.playerLeft.set(data as PlayerData);
        break;

      // Game events
      case WebSocketEvent.GAME_STARTED:
        this.gameStarted.set(data as GameData);
        break;

      case WebSocketEvent.TURN_STARTED:
        this.turnStarted.set(data as TurnData);
        break;

      case WebSocketEvent.CARD_PLAYED:
        this.cardPlayed.set(data as CardData);
        break;

      case WebSocketEvent.TURN_ENDED:
        this.turnEnded.set(data as TurnData);
        break;

      case WebSocketEvent.ROUND_ENDED:
        this.roundEnded.set(data as RoundData);
        break;

      case WebSocketEvent.GAME_ENDED:
        this.gameEnded.set(data as GameEndData);
        break;

      default:
      // Unknown event type
    }
  }

  /**
   * Handle connection errors and attempt reconnection
   */
  private handleConnectionError(error: any): void {
    this.connectionState.set(ConnectionState.ERROR);
    this.lastError.set(error?.message || 'Connection failed');

    // Attempt reconnection if under max attempts
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.connectionState.set(ConnectionState.RECONNECTING);

      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  /**
   * Get current connection status
   */
  isConnected(): boolean {
    return this.connectionState() === ConnectionState.CONNECTED;
  }

  /**
   * Reset all event signals
   */
  resetEvents(): void {
    this.playerConnected.set(null);
    this.playerDisconnected.set(null);
    this.playerReconnected.set(null);
    this.aiTakeover.set(null);
    this.playerJoined.set(null);
    this.playerLeft.set(null);
    this.gameStarted.set(null);
    this.turnStarted.set(null);
    this.cardPlayed.set(null);
    this.turnEnded.set(null);
    this.roundEnded.set(null);
    this.gameEnded.set(null);
  }

  /**
   * Get list of online players
   * This would need a backend endpoint to fetch the list
   */
  getOnlinePlayers(): any[] {
    // TODO: Implement API call to get online players
    return [];
  }
}
