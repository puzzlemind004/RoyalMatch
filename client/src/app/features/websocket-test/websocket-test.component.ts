import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../core/services/websocket.service';
import { ConnectionState } from '../../models/websocket.model';

@Component({
  selector: 'app-websocket-test',
  imports: [CommonModule],
  templateUrl: './websocket-test.component.html',
})
export class WebSocketTestComponent implements OnInit, OnDestroy {
  events: Array<{ id: number; type: string; data: any; time: string }> = [];
  private eventIdCounter = 0;

  constructor(public wsService: WebSocketService) {
    // Setup effects to listen to WebSocket events
    effect(() => {
      const playerJoined = this.wsService.playerJoined();
      if (playerJoined) {
        this.addEvent('PLAYER_JOINED', playerJoined);
      }
    });

    effect(() => {
      const playerLeft = this.wsService.playerLeft();
      if (playerLeft) {
        this.addEvent('PLAYER_LEFT', playerLeft);
      }
    });

    effect(() => {
      const gameStarted = this.wsService.gameStarted();
      if (gameStarted) {
        this.addEvent('GAME_STARTED', gameStarted);
      }
    });

    effect(() => {
      const turnStarted = this.wsService.turnStarted();
      if (turnStarted) {
        this.addEvent('TURN_STARTED', turnStarted);
      }
    });

    effect(() => {
      const cardPlayed = this.wsService.cardPlayed();
      if (cardPlayed) {
        this.addEvent('CARD_PLAYED', cardPlayed);
      }
    });

    effect(() => {
      const turnEnded = this.wsService.turnEnded();
      if (turnEnded) {
        this.addEvent('TURN_ENDED', turnEnded);
      }
    });

    effect(() => {
      const roundEnded = this.wsService.roundEnded();
      if (roundEnded) {
        this.addEvent('ROUND_ENDED', roundEnded);
      }
    });

    effect(() => {
      const gameEnded = this.wsService.gameEnded();
      if (gameEnded) {
        this.addEvent('GAME_ENDED', gameEnded);
      }
    });
  }

  ngOnInit(): void {
    // Auto-connect on component init
    this.connect();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  connect(): void {
    this.wsService.connect();
  }

  disconnect(): void {
    this.wsService.disconnect();
  }

  subscribeToTestGame(): void {
    this.wsService.subscribeToGame('test-game-123');
    this.addEvent('SYSTEM', { message: 'Subscribed to game:test-game-123' });
  }

  private addEvent(type: string, data: any): void {
    this.events.unshift({
      id: this.eventIdCounter++,
      type,
      data,
      time: new Date().toLocaleTimeString(),
    });

    // Keep only last 50 events
    if (this.events.length > 50) {
      this.events = this.events.slice(0, 50);
    }
  }

  clearEvents(): void {
    this.events = [];
    this.wsService.resetEvents();
  }
}
