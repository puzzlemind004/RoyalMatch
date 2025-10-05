/**
 * Card Validation Service
 * Server-side validation for all card-related actions
 * Critical for preventing cheating and ensuring game integrity
 */

import type { CardSuit, CardValue } from '#types/card'

/**
 * Card representation for validation
 */
export interface ValidatableCard {
  value: CardValue
  suit: CardSuit
}

/**
 * Player's card history (played cards)
 */
export interface PlayedCard {
  card: ValidatableCard
  turnNumber: number
  playedAt: Date
}

/**
 * Game state for validation context
 */
export interface GameStateForValidation {
  currentTurn: number
  currentPhase: 'selection' | 'playing' | 'ended'
  simultaneousPlay: boolean
  playerHands: Map<number, ValidatableCard[]>
  playedCards: Map<number, PlayedCard[]>
  deckSizes: Map<number, number>
  turnStartTime: Date | null
  maxTurnDuration: number // in seconds
}

/**
 * Effect context for validation
 */
export interface EffectValidationContext {
  casterId: number
  targetIds: number[]
  gameState: GameStateForValidation
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  reason?: string
  code?: string // Error code for logging
}

/**
 * Card Validation Service
 * Never trust the client - all critical validations happen here
 */
export class CardValidationService {
  /**
   * Validate starting card selection (5 cards from 13 dealt)
   */
  validateStartingCardSelection(
    _playerId: number,
    selectedCards: ValidatableCard[],
    dealtCards: ValidatableCard[]
  ): ValidationResult {
    // Must select exactly 5 cards
    if (selectedCards.length !== 5) {
      return {
        valid: false,
        reason: 'You must select exactly 5 cards',
        code: 'INVALID_SELECTION_COUNT',
      }
    }

    // Check for duplicates in selection
    const cardKeys = selectedCards.map((c) => `${c.value}-${c.suit}`)
    if (new Set(cardKeys).size !== cardKeys.length) {
      return {
        valid: false,
        reason: 'Duplicate cards in selection',
        code: 'DUPLICATE_CARDS',
      }
    }

    // Verify all selected cards are from dealt cards
    for (const selectedCard of selectedCards) {
      const found = dealtCards.some(
        (dealt) => dealt.value === selectedCard.value && dealt.suit === selectedCard.suit
      )
      if (!found) {
        return {
          valid: false,
          reason: 'Selected card was not dealt to you',
          code: 'CARD_NOT_OWNED',
        }
      }
    }

    return { valid: true }
  }

  /**
   * Validate card ownership
   * Critical: player must actually have the card in their hand
   */
  validateCardOwnership(
    playerId: number,
    card: ValidatableCard,
    gameState: GameStateForValidation
  ): ValidationResult {
    const playerHand = gameState.playerHands.get(playerId)

    if (!playerHand) {
      return {
        valid: false,
        reason: 'Player not found in game',
        code: 'PLAYER_NOT_FOUND',
      }
    }

    const hasCard = playerHand.some((c) => c.value === card.value && c.suit === card.suit)

    if (!hasCard) {
      return {
        valid: false,
        reason: 'You do not have this card',
        code: 'CARD_NOT_IN_HAND',
      }
    }

    return { valid: true }
  }

  /**
   * Validate that a card has not been played before
   */
  validateCardNotPlayed(
    playerId: number,
    card: ValidatableCard,
    gameState: GameStateForValidation
  ): ValidationResult {
    const playerHistory = gameState.playedCards.get(playerId) || []

    const alreadyPlayed = playerHistory.some(
      (played) => played.card.value === card.value && played.card.suit === card.suit
    )

    if (alreadyPlayed) {
      return {
        valid: false,
        reason: 'Card already played in a previous turn',
        code: 'CARD_ALREADY_PLAYED',
      }
    }

    return { valid: true }
  }

  /**
   * Validate turn timeout
   * Prevents stalling and ensures game flow
   */
  validateTurnTimeout(gameState: GameStateForValidation, currentTime: Date): ValidationResult {
    if (!gameState.turnStartTime) {
      return {
        valid: false,
        reason: 'Turn not started',
        code: 'TURN_NOT_STARTED',
      }
    }

    const elapsedSeconds =
      (currentTime.getTime() - gameState.turnStartTime.getTime()) / 1000

    if (elapsedSeconds > gameState.maxTurnDuration) {
      return {
        valid: false,
        reason: 'Turn timeout exceeded',
        code: 'TURN_TIMEOUT',
      }
    }

    return { valid: true }
  }

  /**
   * Validate that player can play this turn
   * Checks if it's their turn or if simultaneous play is enabled
   */
  validatePlayerCanPlay(
    playerId: number,
    currentPlayerId: number | null,
    gameState: GameStateForValidation
  ): ValidationResult {
    // Game must be in playing phase
    if (gameState.currentPhase !== 'playing') {
      return {
        valid: false,
        reason: 'Game is not in playing phase',
        code: 'INVALID_GAME_PHASE',
      }
    }

    // Check if simultaneous play
    if (gameState.simultaneousPlay) {
      return { valid: true }
    }

    // Check if it's the player's turn
    if (currentPlayerId !== playerId) {
      return {
        valid: false,
        reason: 'Not your turn',
        code: 'NOT_PLAYER_TURN',
      }
    }

    return { valid: true }
  }

  /**
   * Validate that player hasn't played this turn already
   */
  validatePlayerHasNotPlayedThisTurn(
    playerId: number,
    gameState: GameStateForValidation
  ): ValidationResult {
    const playerHistory = gameState.playedCards.get(playerId) || []
    const playedThisTurn = playerHistory.some(
      (played) => played.turnNumber === gameState.currentTurn
    )

    if (playedThisTurn) {
      return {
        valid: false,
        reason: 'You have already played this turn',
        code: 'ALREADY_PLAYED_THIS_TURN',
      }
    }

    return { valid: true }
  }

  /**
   * Validate effect targets
   * Ensures targets exist and are valid for the effect
   */
  validateEffectTargets(
    targetIds: number[],
    validPlayerIds: number[],
    needsTarget: boolean,
    targetType: 'self' | 'opponent' | 'all' | 'random' | 'none',
    casterId: number
  ): ValidationResult {
    // If no target needed, should have empty array
    if (!needsTarget && targetIds.length > 0) {
      return {
        valid: false,
        reason: 'This effect does not need targets',
        code: 'UNNECESSARY_TARGETS',
      }
    }

    // If target needed, must provide at least one
    if (needsTarget && targetIds.length === 0) {
      return {
        valid: false,
        reason: 'This effect requires a target',
        code: 'MISSING_TARGET',
      }
    }

    // Validate all targets exist
    for (const targetId of targetIds) {
      if (!validPlayerIds.includes(targetId)) {
        return {
          valid: false,
          reason: 'Invalid target player',
          code: 'INVALID_TARGET',
        }
      }
    }

    // Validate target type constraints
    if (targetType === 'self' && targetIds.some((id) => id !== casterId)) {
      return {
        valid: false,
        reason: 'Can only target yourself',
        code: 'INVALID_SELF_TARGET',
      }
    }

    if (targetType === 'opponent' && targetIds.some((id) => id === casterId)) {
      return {
        valid: false,
        reason: 'Cannot target yourself',
        code: 'INVALID_OPPONENT_TARGET',
      }
    }

    return { valid: true }
  }

  /**
   * Validate draw action
   */
  validateDraw(playerId: number, gameState: GameStateForValidation): ValidationResult {
    const deckSize = gameState.deckSizes.get(playerId)

    if (deckSize === undefined) {
      return {
        valid: false,
        reason: 'Player deck not found',
        code: 'DECK_NOT_FOUND',
      }
    }

    if (deckSize === 0) {
      return {
        valid: false,
        reason: 'Your deck is empty',
        code: 'DECK_EMPTY',
      }
    }

    return { valid: true }
  }

  /**
   * Comprehensive card play validation
   * Combines all relevant checks
   */
  validateCardPlay(
    playerId: number,
    card: ValidatableCard,
    currentPlayerId: number | null,
    gameState: GameStateForValidation,
    currentTime: Date = new Date()
  ): ValidationResult {
    // 1. Check game phase
    const phaseCheck = this.validatePlayerCanPlay(playerId, currentPlayerId, gameState)
    if (!phaseCheck.valid) return phaseCheck

    // 2. Check ownership
    const ownershipCheck = this.validateCardOwnership(playerId, card, gameState)
    if (!ownershipCheck.valid) return ownershipCheck

    // 3. Check not already played
    const playedCheck = this.validateCardNotPlayed(playerId, card, gameState)
    if (!playedCheck.valid) return playedCheck

    // 4. Check player hasn't played this turn
    const turnCheck = this.validatePlayerHasNotPlayedThisTurn(playerId, gameState)
    if (!turnCheck.valid) return turnCheck

    // 5. Check timeout
    const timeoutCheck = this.validateTurnTimeout(gameState, currentTime)
    if (!timeoutCheck.valid) return timeoutCheck

    return { valid: true }
  }

  /**
   * Validate complete card action (play + optional effect)
   */
  validateCompleteCardAction(
    playerId: number,
    card: ValidatableCard,
    activateEffect: boolean,
    effectTargets: number[],
    effectNeedsTarget: boolean,
    effectTargetType: 'self' | 'opponent' | 'all' | 'random' | 'none',
    currentPlayerId: number | null,
    validPlayerIds: number[],
    gameState: GameStateForValidation
  ): ValidationResult {
    // Validate card play
    const playCheck = this.validateCardPlay(playerId, card, currentPlayerId, gameState)
    if (!playCheck.valid) return playCheck

    // If effect is activated, validate targets
    if (activateEffect) {
      const targetCheck = this.validateEffectTargets(
        effectTargets,
        validPlayerIds,
        effectNeedsTarget,
        effectTargetType,
        playerId
      )
      if (!targetCheck.valid) return targetCheck
    }

    return { valid: true }
  }
}

// Export singleton instance
export default new CardValidationService()
