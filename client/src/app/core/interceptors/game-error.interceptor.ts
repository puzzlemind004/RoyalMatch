import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

/**
 * Game Error Interceptor
 * Handles validation errors from the server
 * Provides user-friendly error messages
 */
export const gameErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const transloco = inject(TranslocoService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle different error types
      let userMessage = transloco.translate('game.errors.default');

      if (error.error && typeof error.error === 'object') {
        // AdonisJS validation error
        if (error.error.errors) {
          const firstError = error.error.errors[0];
          userMessage = firstError?.message || userMessage;
        }
        // Custom error message from server (check if it's a translation key)
        else if (error.error.message) {
          userMessage = translateServerMessage(error.error.message, transloco);
        }
        // Validation result from CardValidationService
        else if (error.error.reason) {
          userMessage = translateErrorReason(error.error.code, error.error.reason, transloco);
        }
      }

      // Create user-friendly error
      const friendlyError = {
        ...error,
        userMessage,
        originalError: error.error,
      };

      return throwError(() => friendlyError);
    }),
  );
};

/**
 * Translate server messages that may contain translation keys with parameters
 * Format: "translationKey|param1|param2" or just "translationKey"
 */
function translateServerMessage(message: string, transloco: TranslocoService): string {
  // Check if message looks like a translation key (contains dots or pipe)
  if (message.includes('.') || message.includes('|')) {
    const [key, ...params] = message.split('|');

    // If it's a translation key, translate it
    if (key.startsWith('game.')) {
      // Build params object from array
      const paramsObj: Record<string, string> = {};
      params.forEach((param, index) => {
        // Common param names
        const paramNames = ['count', 'points', 'value', 'target'];
        paramsObj[paramNames[index] || `param${index}`] = param;
      });

      return transloco.translate(key, paramsObj);
    }
  }

  // If not a translation key, return as is
  return message;
}

/**
 * Translate error codes to user-friendly messages
 */
function translateErrorReason(
  code: string | undefined,
  defaultReason: string,
  transloco: TranslocoService,
): string {
  const errorKeyMap: Record<string, string> = {
    INVALID_SELECTION_COUNT: 'invalidSelectionCount',
    DUPLICATE_CARDS: 'duplicateCards',
    CARD_NOT_OWNED: 'cardNotOwned',
    PLAYER_NOT_FOUND: 'playerNotFound',
    CARD_NOT_IN_HAND: 'cardNotInHand',
    CARD_ALREADY_PLAYED: 'cardAlreadyPlayed',
    TURN_NOT_STARTED: 'turnNotStarted',
    TURN_TIMEOUT: 'turnTimeout',
    INVALID_GAME_PHASE: 'invalidGamePhase',
    NOT_PLAYER_TURN: 'notPlayerTurn',
    ALREADY_PLAYED_THIS_TURN: 'alreadyPlayedThisTurn',
    UNNECESSARY_TARGETS: 'unnecessaryTargets',
    MISSING_TARGET: 'missingTarget',
    INVALID_TARGET: 'invalidTarget',
    INVALID_SELF_TARGET: 'invalidSelfTarget',
    INVALID_OPPONENT_TARGET: 'invalidOpponentTarget',
    DECK_NOT_FOUND: 'deckNotFound',
    DECK_EMPTY: 'deckEmpty',
    AUTHENTICATION_REQUIRED: 'authRequired',
    PLAYER_BANNED: 'playerBanned',
    RATE_LIMIT_EXCEEDED: 'rateLimitExceeded',
  };

  if (code && errorKeyMap[code]) {
    return transloco.translate(`game.errors.${errorKeyMap[code]}`);
  }

  // IMPORTANT: Never show raw 'reason' to users (it's in English for server logs)
  // Always fallback to generic error message
  return transloco.translate('game.errors.default');
}
