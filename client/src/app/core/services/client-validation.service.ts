import { Injectable, signal, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import type { Card } from '../../models/card.model';

/**
 * Game state for client-side validation
 */
export interface ClientGameState {
  currentPhase: 'selection' | 'playing' | 'ended';
  playerHand: Card[];
  playedCards: Card[];
  currentTurn: number;
  isMyTurn: boolean;
  simultaneousPlay: boolean;
  turnStartTime: Date | null;
  maxTurnDuration: number; // in seconds
}

/**
 * Validation result
 */
export interface ClientValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Client Validation Service
 * UX-focused validation to prevent errors before server call
 * NOT for security - server always validates
 */
@Injectable({
  providedIn: 'root',
})
export class ClientValidationService {
  private transloco = inject(TranslocoService);

  // Validation error signal for UI feedback
  readonly validationError = signal<string | null>(null);

  /**
   * Validate card selection for starting hand (5 from 13)
   */
  validateStartingCardSelection(selectedCards: Card[], dealtCards: Card[]): ClientValidationResult {
    if (selectedCards.length !== 5) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.invalidSelectionCount'),
      };
    }

    // Check for duplicates
    const cardIds = selectedCards.map((c) => `${c.value}-${c.suit}`);
    if (new Set(cardIds).size !== cardIds.length) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.duplicateCards'),
      };
    }

    // Check all cards are from dealt cards
    for (const selected of selectedCards) {
      const found = dealtCards.some(
        (dealt) => dealt.value === selected.value && dealt.suit === selected.suit,
      );
      if (!found) {
        return {
          valid: false,
          reason: this.transloco.translate('game.errors.invalidCardSelected'),
        };
      }
    }

    return { valid: true };
  }

  /**
   * Check if a card can be played
   */
  canPlayCard(card: Card, gameState: ClientGameState): ClientValidationResult {
    // Game must be in playing phase
    if (gameState.currentPhase !== 'playing') {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.gameNotPlaying'),
      };
    }

    // Check if it's player's turn (or simultaneous play)
    if (!gameState.isMyTurn && !gameState.simultaneousPlay) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.notYourTurn'),
      };
    }

    // Check card is in hand
    const hasCard = gameState.playerHand.some(
      (c) => c.value === card.value && c.suit === card.suit,
    );
    if (!hasCard) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.cardNotInHand'),
      };
    }

    // Check card hasn't been played
    const alreadyPlayed = gameState.playedCards.some(
      (c) => c.value === card.value && c.suit === card.suit,
    );
    if (alreadyPlayed) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.cardAlreadyPlayed'),
      };
    }

    // Check timeout
    if (gameState.turnStartTime) {
      const elapsed = (Date.now() - gameState.turnStartTime.getTime()) / 1000;
      if (elapsed > gameState.maxTurnDuration) {
        return {
          valid: false,
          reason: this.transloco.translate('game.errors.turnTimeout'),
        };
      }
    }

    return { valid: true };
  }

  /**
   * Get remaining turn time in seconds
   */
  getRemainingTurnTime(gameState: ClientGameState): number {
    if (!gameState.turnStartTime) return 0;

    const elapsed = (Date.now() - gameState.turnStartTime.getTime()) / 1000;
    const remaining = gameState.maxTurnDuration - elapsed;

    return Math.max(0, Math.floor(remaining));
  }

  /**
   * Check if turn is about to expire (less than 10 seconds)
   */
  isTurnExpiringSoon(gameState: ClientGameState): boolean {
    return this.getRemainingTurnTime(gameState) <= 10;
  }

  /**
   * Validate effect targets selection
   */
  validateEffectTargets(
    targetIds: number[],
    needsTarget: boolean,
    targetType: 'self' | 'opponent' | 'all' | 'random' | 'none',
    playerId: number,
    validPlayerIds: number[],
  ): ClientValidationResult {
    if (!needsTarget && targetIds.length > 0) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.unnecessaryTargets'),
      };
    }

    if (needsTarget && targetIds.length === 0) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.missingTarget'),
      };
    }

    // Validate target exists
    for (const targetId of targetIds) {
      if (!validPlayerIds.includes(targetId)) {
        return {
          valid: false,
          reason: this.transloco.translate('game.errors.invalidTarget'),
        };
      }
    }

    // Validate target type
    if (targetType === 'self' && targetIds.some((id) => id !== playerId)) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.invalidSelfTarget'),
      };
    }

    if (targetType === 'opponent' && targetIds.some((id) => id === playerId)) {
      return {
        valid: false,
        reason: this.transloco.translate('game.errors.invalidOpponentTarget'),
      };
    }

    return { valid: true };
  }

  /**
   * Set validation error for UI display
   */
  setError(message: string | null): void {
    this.validationError.set(message);

    // Auto-clear after 5 seconds
    if (message) {
      setTimeout(() => {
        if (this.validationError() === message) {
          this.validationError.set(null);
        }
      }, 5000);
    }
  }

  /**
   * Clear validation error
   */
  clearError(): void {
    this.validationError.set(null);
  }

  /**
   * Validate and set error if invalid
   * Returns true if valid, false otherwise
   */
  validateWithError(result: ClientValidationResult): boolean {
    if (!result.valid) {
      this.setError(result.reason || this.transloco.translate('game.errors.invalidAction'));
      return false;
    }
    return true;
  }
}
