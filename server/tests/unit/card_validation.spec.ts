/**
 * Card Validation Service Unit Tests
 * Tests all validation scenarios for card actions
 */

import { test } from '@japa/runner'
import CardValidationService from '#services/card_validation_service'
import { CardSuit, CardValue } from '#types/card'
import type {
  ValidatableCard,
  GameStateForValidation,
  PlayedCard,
} from '#services/card_validation_service'

test.group('Card Validation Service', () => {
  // Helper function to create a card
  const createCard = (value: CardValue, suit: CardSuit): ValidatableCard => ({ value, suit })

  // Helper function to create game state
  const createGameState = (
    overrides?: Partial<GameStateForValidation>
  ): GameStateForValidation => ({
    currentTurn: 1,
    currentPhase: 'playing',
    simultaneousPlay: false,
    playerHands: new Map(),
    playedCards: new Map(),
    deckSizes: new Map(),
    turnStartTime: new Date(),
    maxTurnDuration: 60,
    ...overrides,
  })

  test('should validate correct starting card selection', ({ assert }) => {
    const dealtCards = [
      createCard(CardValue.TWO, CardSuit.HEARTS),
      createCard(CardValue.THREE, CardSuit.HEARTS),
      createCard(CardValue.FOUR, CardSuit.HEARTS),
      createCard(CardValue.FIVE, CardSuit.HEARTS),
      createCard(CardValue.SIX, CardSuit.HEARTS),
      createCard(CardValue.SEVEN, CardSuit.HEARTS),
    ]

    const selectedCards = dealtCards.slice(0, 5)

    const result = CardValidationService.validateStartingCardSelection(1, selectedCards, dealtCards)

    assert.isTrue(result.valid)
  })

  test('should reject selection with wrong count', ({ assert }) => {
    const dealtCards = [createCard(CardValue.TWO, CardSuit.HEARTS)]
    const selectedCards = dealtCards.slice(0, 3) // Only 3 cards

    const result = CardValidationService.validateStartingCardSelection(1, selectedCards, dealtCards)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'INVALID_SELECTION_COUNT')
  })

  test('should reject selection with duplicates', ({ assert }) => {
    const card = createCard(CardValue.TWO, CardSuit.HEARTS)
    const dealtCards = [card, createCard(CardValue.THREE, CardSuit.HEARTS)]
    const selectedCards = [card, card, card, card, card] // Duplicate

    const result = CardValidationService.validateStartingCardSelection(1, selectedCards, dealtCards)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'DUPLICATE_CARDS')
  })

  test('should reject selection with card not dealt', ({ assert }) => {
    const dealtCards = [
      createCard(CardValue.TWO, CardSuit.HEARTS),
      createCard(CardValue.THREE, CardSuit.HEARTS),
    ]

    const selectedCards = [
      ...dealtCards,
      createCard(CardValue.FOUR, CardSuit.HEARTS), // Not dealt
      createCard(CardValue.FIVE, CardSuit.HEARTS),
      createCard(CardValue.SIX, CardSuit.HEARTS),
    ]

    const result = CardValidationService.validateStartingCardSelection(1, selectedCards, dealtCards)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'CARD_NOT_OWNED')
  })

  test('should validate card ownership', ({ assert }) => {
    const card = createCard(CardValue.ACE, CardSuit.HEARTS)
    const playerHand = [card, createCard(CardValue.KING, CardSuit.SPADES)]

    const gameState = createGameState({
      playerHands: new Map([[1, playerHand]]),
    })

    const result = CardValidationService.validateCardOwnership(1, card, gameState)

    assert.isTrue(result.valid)
  })

  test('should reject card not in hand', ({ assert }) => {
    const card = createCard(CardValue.ACE, CardSuit.HEARTS)
    const playerHand = [createCard(CardValue.KING, CardSuit.SPADES)]

    const gameState = createGameState({
      playerHands: new Map([[1, playerHand]]),
    })

    const result = CardValidationService.validateCardOwnership(1, card, gameState)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'CARD_NOT_IN_HAND')
  })

  test('should validate card not played before', ({ assert }) => {
    const card = createCard(CardValue.ACE, CardSuit.HEARTS)
    const gameState = createGameState({
      playedCards: new Map([[1, []]]),
    })

    const result = CardValidationService.validateCardNotPlayed(1, card, gameState)

    assert.isTrue(result.valid)
  })

  test('should reject already played card', ({ assert }) => {
    const card = createCard(CardValue.ACE, CardSuit.HEARTS)
    const playedCard: PlayedCard = {
      card,
      turnNumber: 1,
      playedAt: new Date(),
    }

    const gameState = createGameState({
      playedCards: new Map([[1, [playedCard]]]),
    })

    const result = CardValidationService.validateCardNotPlayed(1, card, gameState)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'CARD_ALREADY_PLAYED')
  })

  test('should validate turn timeout', ({ assert }) => {
    const turnStartTime = new Date(Date.now() - 30000) // 30 seconds ago
    const gameState = createGameState({
      turnStartTime,
      maxTurnDuration: 60,
    })

    const result = CardValidationService.validateTurnTimeout(gameState, new Date())

    assert.isTrue(result.valid)
  })

  test('should reject expired turn', ({ assert }) => {
    const turnStartTime = new Date(Date.now() - 70000) // 70 seconds ago
    const gameState = createGameState({
      turnStartTime,
      maxTurnDuration: 60,
    })

    const result = CardValidationService.validateTurnTimeout(gameState, new Date())

    assert.isFalse(result.valid)
    assert.equal(result.code, 'TURN_TIMEOUT')
  })

  test('should validate player can play on their turn', ({ assert }) => {
    const gameState = createGameState()

    const result = CardValidationService.validatePlayerCanPlay(1, 1, gameState)

    assert.isTrue(result.valid)
  })

  test('should validate player can play in simultaneous mode', ({ assert }) => {
    const gameState = createGameState({
      simultaneousPlay: true,
    })

    const result = CardValidationService.validatePlayerCanPlay(1, 2, gameState)

    assert.isTrue(result.valid)
  })

  test('should reject playing out of turn', ({ assert }) => {
    const gameState = createGameState()

    const result = CardValidationService.validatePlayerCanPlay(1, 2, gameState)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'NOT_PLAYER_TURN')
  })

  test('should reject playing in wrong phase', ({ assert }) => {
    const gameState = createGameState({
      currentPhase: 'ended',
    })

    const result = CardValidationService.validatePlayerCanPlay(1, 1, gameState)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'INVALID_GAME_PHASE')
  })

  test('should validate player has not played this turn', ({ assert }) => {
    const gameState = createGameState({
      currentTurn: 2,
      playedCards: new Map([
        [
          1,
          [
            {
              card: createCard(CardValue.TWO, CardSuit.HEARTS),
              turnNumber: 1, // Played in turn 1, now it's turn 2
              playedAt: new Date(),
            },
          ],
        ],
      ]),
    })

    const result = CardValidationService.validatePlayerHasNotPlayedThisTurn(1, gameState)

    assert.isTrue(result.valid)
  })

  test('should reject playing twice in same turn', ({ assert }) => {
    const gameState = createGameState({
      currentTurn: 1,
      playedCards: new Map([
        [
          1,
          [
            {
              card: createCard(CardValue.TWO, CardSuit.HEARTS),
              turnNumber: 1, // Already played this turn
              playedAt: new Date(),
            },
          ],
        ],
      ]),
    })

    const result = CardValidationService.validatePlayerHasNotPlayedThisTurn(1, gameState)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'ALREADY_PLAYED_THIS_TURN')
  })

  test('should validate effect targets for self-target effect', ({ assert }) => {
    const result = CardValidationService.validateEffectTargets([1], [1, 2, 3], true, 'self', 1)

    assert.isTrue(result.valid)
  })

  test('should reject self-targeting in opponent-only effect', ({ assert }) => {
    const result = CardValidationService.validateEffectTargets([1], [1, 2, 3], true, 'opponent', 1)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'INVALID_OPPONENT_TARGET')
  })

  test('should reject missing target when needed', ({ assert }) => {
    const result = CardValidationService.validateEffectTargets([], [1, 2, 3], true, 'opponent', 1)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'MISSING_TARGET')
  })

  test('should validate draw action', ({ assert }) => {
    const gameState = createGameState({
      deckSizes: new Map([[1, 5]]),
    })

    const result = CardValidationService.validateDraw(1, gameState)

    assert.isTrue(result.valid)
  })

  test('should reject draw from empty deck', ({ assert }) => {
    const gameState = createGameState({
      deckSizes: new Map([[1, 0]]),
    })

    const result = CardValidationService.validateDraw(1, gameState)

    assert.isFalse(result.valid)
    assert.equal(result.code, 'DECK_EMPTY')
  })

  test('should validate complete card play action', ({ assert }) => {
    const card = createCard(CardValue.ACE, CardSuit.HEARTS)
    const gameState = createGameState({
      playerHands: new Map([[1, [card]]]),
      playedCards: new Map([[1, []]]),
      turnStartTime: new Date(),
    })

    const result = CardValidationService.validateCardPlay(1, card, 1, gameState)

    assert.isTrue(result.valid)
  })
})
