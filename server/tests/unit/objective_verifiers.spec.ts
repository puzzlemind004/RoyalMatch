/**
 * Objective Verifiers Unit Tests
 * Comprehensive tests for all 17 objective verifier implementations
 */

import { test } from '@japa/runner'
import { CardSuit, CardValue } from '#types/card'
import type { Card } from '#types/card'
import type { PlayerRoundState } from '#types/objective'
import {
  WinExactlyXTricksVerifier,
  WinAtLeastXTricksVerifier,
  WinAtMostXTricksVerifier,
  LoseAllTricksVerifier,
  WinFirstAndLastTrickVerifier,
  WinConsecutiveTricksVerifier,
  NoRedCardsVerifier,
  NoBlackCardsVerifier,
  WinXTricksWithDominantSuitVerifier,
  WinAllSuitsVerifier,
  WinAllAcesVerifier,
  NoFaceCardsVerifier,
  OnlyEvenCardsVerifier,
  TotalValueLessThanVerifier,
  TotalValueGreaterThanVerifier,
  ActivateAllEffectsVerifier,
  NeverActivateEffectsVerifier,
} from '#services/objective_verifiers'

test.group('Objective Verifiers - Tricks-Based', () => {
  // Helper to create a card
  const createCard = (value: CardValue, suit: CardSuit): Card => ({
    id: `${suit}-${value}`,
    value,
    suit,
    effect: { type: 'none' },
    numericValue: getNumericValue(value),
  })

  // Helper to get numeric value
  function getNumericValue(value: CardValue): number {
    const map: Record<CardValue, number> = {
      [CardValue.TWO]: 2,
      [CardValue.THREE]: 3,
      [CardValue.FOUR]: 4,
      [CardValue.FIVE]: 5,
      [CardValue.SIX]: 6,
      [CardValue.SEVEN]: 7,
      [CardValue.EIGHT]: 8,
      [CardValue.NINE]: 9,
      [CardValue.TEN]: 10,
      [CardValue.JACK]: 11,
      [CardValue.QUEEN]: 12,
      [CardValue.KING]: 13,
      [CardValue.ACE]: 14,
    }
    return map[value]
  }

  // Helper to create player state
  const createPlayerState = (overrides?: Partial<PlayerRoundState>): PlayerRoundState => ({
    playerId: 'player1',
    tricksWon: 0,
    cardsWon: [],
    cardsPlayed: [],
    effectsActivated: 0,
    remainingCards: 0,
    firstTrickWon: false,
    lastTrickWon: false,
    consecutiveTricksWon: 0,
    dominantSuit: CardSuit.HEARTS,
    ...overrides,
  })

  test('WinExactlyXTricksVerifier - should complete when exact match', ({ assert }) => {
    const verifier = new WinExactlyXTricksVerifier(3)
    const state = createPlayerState({ tricksWon: 3 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinExactlyXTricksVerifier - should not complete when below target', ({ assert }) => {
    const verifier = new WinExactlyXTricksVerifier(3)
    const state = createPlayerState({ tricksWon: 2 })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('WinExactlyXTricksVerifier - should not complete when above target', ({ assert }) => {
    const verifier = new WinExactlyXTricksVerifier(3)
    const state = createPlayerState({ tricksWon: 4 })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('WinExactlyXTricksVerifier - should track progress correctly', ({ assert }) => {
    const verifier = new WinExactlyXTricksVerifier(4)
    const state = createPlayerState({ tricksWon: 2 })
    const progress = verifier.getProgress!(state)

    assert.equal(progress.current, 2)
    assert.equal(progress.target, 4)
    assert.equal(progress.percentage, 50)
  })

  test('WinAtLeastXTricksVerifier - should complete when at target', ({ assert }) => {
    const verifier = new WinAtLeastXTricksVerifier(3)
    const state = createPlayerState({ tricksWon: 3 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinAtLeastXTricksVerifier - should complete when above target', ({ assert }) => {
    const verifier = new WinAtLeastXTricksVerifier(3)
    const state = createPlayerState({ tricksWon: 5 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinAtMostXTricksVerifier - should complete when at target and round ended', ({
    assert,
  }) => {
    const verifier = new WinAtMostXTricksVerifier(2)
    const state = createPlayerState({ tricksWon: 2, remainingCards: 0 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinAtMostXTricksVerifier - should not complete when round not ended', ({ assert }) => {
    const verifier = new WinAtMostXTricksVerifier(2)
    const state = createPlayerState({ tricksWon: 2, remainingCards: 3 })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('LoseAllTricksVerifier - should complete when zero tricks at end', ({ assert }) => {
    const verifier = new LoseAllTricksVerifier()
    const state = createPlayerState({ tricksWon: 0, remainingCards: 0 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('LoseAllTricksVerifier - should fail when any trick won', ({ assert }) => {
    const verifier = new LoseAllTricksVerifier()
    const state = createPlayerState({ tricksWon: 1, remainingCards: 0 })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('WinFirstAndLastTrickVerifier - should complete when both won', ({ assert }) => {
    const verifier = new WinFirstAndLastTrickVerifier()
    const state = createPlayerState({
      firstTrickWon: true,
      lastTrickWon: true,
      remainingCards: 0,
    })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinFirstAndLastTrickVerifier - should fail when only first won', ({ assert }) => {
    const verifier = new WinFirstAndLastTrickVerifier()
    const state = createPlayerState({
      firstTrickWon: true,
      lastTrickWon: false,
      remainingCards: 0,
    })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('WinConsecutiveTricksVerifier - should complete when target reached', ({ assert }) => {
    const verifier = new WinConsecutiveTricksVerifier(3)
    const state = createPlayerState({ consecutiveTricksWon: 3 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinConsecutiveTricksVerifier - should track progress', ({ assert }) => {
    const verifier = new WinConsecutiveTricksVerifier(4)
    const state = createPlayerState({ consecutiveTricksWon: 2 })
    const progress = verifier.getProgress!(state)

    assert.equal(progress.current, 2)
    assert.equal(progress.target, 4)
    assert.equal(progress.percentage, 50)
  })
})

test.group('Objective Verifiers - Color-Based', () => {
  const createCard = (value: CardValue, suit: CardSuit): Card => ({
    id: `${suit}-${value}`,
    value,
    suit,
    effect: { type: 'none' },
    numericValue: getNumericValue(value),
  })

  function getNumericValue(value: CardValue): number {
    const map: Record<CardValue, number> = {
      [CardValue.TWO]: 2,
      [CardValue.THREE]: 3,
      [CardValue.FOUR]: 4,
      [CardValue.FIVE]: 5,
      [CardValue.SIX]: 6,
      [CardValue.SEVEN]: 7,
      [CardValue.EIGHT]: 8,
      [CardValue.NINE]: 9,
      [CardValue.TEN]: 10,
      [CardValue.JACK]: 11,
      [CardValue.QUEEN]: 12,
      [CardValue.KING]: 13,
      [CardValue.ACE]: 14,
    }
    return map[value]
  }

  const createPlayerState = (overrides?: Partial<PlayerRoundState>): PlayerRoundState => ({
    playerId: 'player1',
    tricksWon: 0,
    cardsWon: [],
    cardsPlayed: [],
    effectsActivated: 0,
    remainingCards: 0,
    firstTrickWon: false,
    lastTrickWon: false,
    consecutiveTricksWon: 0,
    dominantSuit: CardSuit.HEARTS,
    ...overrides,
  })

  test('NoRedCardsVerifier - should complete when no red cards won', ({ assert }) => {
    const verifier = new NoRedCardsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.SPADES),
      createCard(CardValue.KING, CardSuit.CLUBS),
    ]
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('NoRedCardsVerifier - should fail when any red card won', ({ assert }) => {
    const verifier = new NoRedCardsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.SPADES),
      createCard(CardValue.KING, CardSuit.HEARTS), // Red card!
    ]
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('NoBlackCardsVerifier - should complete when no black cards won', ({ assert }) => {
    const verifier = new NoBlackCardsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.DIAMONDS),
    ]
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('NoBlackCardsVerifier - should fail when any black card won', ({ assert }) => {
    const verifier = new NoBlackCardsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.CLUBS), // Black card!
    ]
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('WinXTricksWithDominantSuitVerifier - should complete when enough dominant cards', ({
    assert,
  }) => {
    const verifier = new WinXTricksWithDominantSuitVerifier(2)
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.HEARTS),
      createCard(CardValue.QUEEN, CardSuit.SPADES),
    ]
    const state = createPlayerState({ cardsWon, dominantSuit: CardSuit.HEARTS })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinAllSuitsVerifier - should complete when all 4 suits won', ({ assert }) => {
    const verifier = new WinAllSuitsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.DIAMONDS),
      createCard(CardValue.QUEEN, CardSuit.CLUBS),
      createCard(CardValue.JACK, CardSuit.SPADES),
    ]
    const state = createPlayerState({ cardsWon })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinAllSuitsVerifier - should fail when missing a suit', ({ assert }) => {
    const verifier = new WinAllSuitsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.HEARTS),
      createCard(CardValue.QUEEN, CardSuit.CLUBS),
    ]
    const state = createPlayerState({ cardsWon })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('WinAllSuitsVerifier - should track progress correctly', ({ assert }) => {
    const verifier = new WinAllSuitsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.DIAMONDS),
    ]
    const state = createPlayerState({ cardsWon })
    const progress = verifier.getProgress!(state)

    assert.equal(progress.current, 2)
    assert.equal(progress.target, 4)
    assert.equal(progress.percentage, 50)
  })
})

test.group('Objective Verifiers - Value-Based', () => {
  const createCard = (value: CardValue, suit: CardSuit): Card => ({
    id: `${suit}-${value}`,
    value,
    suit,
    effect: { type: 'none' },
    numericValue: getNumericValue(value),
  })

  function getNumericValue(value: CardValue): number {
    const map: Record<CardValue, number> = {
      [CardValue.TWO]: 2,
      [CardValue.THREE]: 3,
      [CardValue.FOUR]: 4,
      [CardValue.FIVE]: 5,
      [CardValue.SIX]: 6,
      [CardValue.SEVEN]: 7,
      [CardValue.EIGHT]: 8,
      [CardValue.NINE]: 9,
      [CardValue.TEN]: 10,
      [CardValue.JACK]: 11,
      [CardValue.QUEEN]: 12,
      [CardValue.KING]: 13,
      [CardValue.ACE]: 14,
    }
    return map[value]
  }

  const createPlayerState = (overrides?: Partial<PlayerRoundState>): PlayerRoundState => ({
    playerId: 'player1',
    tricksWon: 0,
    cardsWon: [],
    cardsPlayed: [],
    effectsActivated: 0,
    remainingCards: 0,
    firstTrickWon: false,
    lastTrickWon: false,
    consecutiveTricksWon: 0,
    dominantSuit: CardSuit.HEARTS,
    ...overrides,
  })

  test('WinAllAcesVerifier - should complete when all 4 Aces won', ({ assert }) => {
    const verifier = new WinAllAcesVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.ACE, CardSuit.DIAMONDS),
      createCard(CardValue.ACE, CardSuit.CLUBS),
      createCard(CardValue.ACE, CardSuit.SPADES),
    ]
    const state = createPlayerState({ cardsWon })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinAllAcesVerifier - should fail when missing an Ace', ({ assert }) => {
    const verifier = new WinAllAcesVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.ACE, CardSuit.DIAMONDS),
      createCard(CardValue.KING, CardSuit.CLUBS),
    ]
    const state = createPlayerState({ cardsWon })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('WinAllAcesVerifier - should track progress', ({ assert }) => {
    const verifier = new WinAllAcesVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.ACE, CardSuit.DIAMONDS),
    ]
    const state = createPlayerState({ cardsWon })
    const progress = verifier.getProgress!(state)

    assert.equal(progress.current, 2)
    assert.equal(progress.target, 4)
    assert.equal(progress.percentage, 50)
  })

  test('NoFaceCardsVerifier - should complete when no face cards won', ({ assert }) => {
    const verifier = new NoFaceCardsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.TEN, CardSuit.DIAMONDS),
      createCard(CardValue.TWO, CardSuit.CLUBS),
    ]
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('NoFaceCardsVerifier - should fail when any face card won', ({ assert }) => {
    const verifier = new NoFaceCardsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.JACK, CardSuit.DIAMONDS), // Face card!
    ]
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('OnlyEvenCardsVerifier - should complete when only even cards won', ({ assert }) => {
    const verifier = new OnlyEvenCardsVerifier()
    const cardsWon = [
      createCard(CardValue.TWO, CardSuit.HEARTS),
      createCard(CardValue.FOUR, CardSuit.DIAMONDS),
      createCard(CardValue.QUEEN, CardSuit.CLUBS),
    ]
    const state = createPlayerState({ cardsWon })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('OnlyEvenCardsVerifier - should fail when any odd card won', ({ assert }) => {
    const verifier = new OnlyEvenCardsVerifier()
    const cardsWon = [
      createCard(CardValue.TWO, CardSuit.HEARTS),
      createCard(CardValue.THREE, CardSuit.DIAMONDS), // Odd card!
    ]
    const state = createPlayerState({ cardsWon })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('TotalValueLessThanVerifier - should complete when below threshold', ({ assert }) => {
    const verifier = new TotalValueLessThanVerifier(30)
    const cardsWon = [
      createCard(CardValue.TWO, CardSuit.HEARTS), // 2
      createCard(CardValue.THREE, CardSuit.DIAMONDS), // 3
      createCard(CardValue.FOUR, CardSuit.CLUBS), // 4
    ] // Total: 9
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('TotalValueLessThanVerifier - should fail when at or above threshold', ({ assert }) => {
    const verifier = new TotalValueLessThanVerifier(30)
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS), // 14
      createCard(CardValue.KING, CardSuit.DIAMONDS), // 13
      createCard(CardValue.QUEEN, CardSuit.CLUBS), // 12
    ] // Total: 39
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('TotalValueGreaterThanVerifier - should complete when above threshold', ({ assert }) => {
    const verifier = new TotalValueGreaterThanVerifier(50)
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS), // 14
      createCard(CardValue.ACE, CardSuit.DIAMONDS), // 14
      createCard(CardValue.ACE, CardSuit.CLUBS), // 14
      createCard(CardValue.ACE, CardSuit.SPADES), // 14
    ] // Total: 56
    const state = createPlayerState({ cardsWon })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('TotalValueGreaterThanVerifier - should fail when at or below threshold', ({ assert }) => {
    const verifier = new TotalValueGreaterThanVerifier(50)
    const cardsWon = [
      createCard(CardValue.TWO, CardSuit.HEARTS), // 2
      createCard(CardValue.THREE, CardSuit.DIAMONDS), // 3
    ] // Total: 5
    const state = createPlayerState({ cardsWon })

    assert.isFalse(verifier.checkCompletion(state))
  })
})

test.group('Objective Verifiers - Special', () => {
  const createCard = (value: CardValue, suit: CardSuit): Card => ({
    id: `${suit}-${value}`,
    value,
    suit,
    effect: { type: 'none' },
    numericValue: getNumericValue(value),
  })

  function getNumericValue(value: CardValue): number {
    const map: Record<CardValue, number> = {
      [CardValue.TWO]: 2,
      [CardValue.THREE]: 3,
      [CardValue.FOUR]: 4,
      [CardValue.FIVE]: 5,
      [CardValue.SIX]: 6,
      [CardValue.SEVEN]: 7,
      [CardValue.EIGHT]: 8,
      [CardValue.NINE]: 9,
      [CardValue.TEN]: 10,
      [CardValue.JACK]: 11,
      [CardValue.QUEEN]: 12,
      [CardValue.KING]: 13,
      [CardValue.ACE]: 14,
    }
    return map[value]
  }

  const createPlayerState = (overrides?: Partial<PlayerRoundState>): PlayerRoundState => ({
    playerId: 'player1',
    tricksWon: 0,
    cardsWon: [],
    cardsPlayed: [],
    effectsActivated: 0,
    remainingCards: 0,
    firstTrickWon: false,
    lastTrickWon: false,
    consecutiveTricksWon: 0,
    dominantSuit: CardSuit.HEARTS,
    ...overrides,
  })

  test('ActivateAllEffectsVerifier - should complete when all cards had effects activated', ({
    assert,
  }) => {
    const verifier = new ActivateAllEffectsVerifier()
    const cardsPlayed = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.DIAMONDS),
      createCard(CardValue.QUEEN, CardSuit.CLUBS),
    ]
    const state = createPlayerState({
      cardsPlayed,
      effectsActivated: 3,
      remainingCards: 0,
    })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('ActivateAllEffectsVerifier - should fail when some effects not activated', ({ assert }) => {
    const verifier = new ActivateAllEffectsVerifier()
    const cardsPlayed = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.DIAMONDS),
      createCard(CardValue.QUEEN, CardSuit.CLUBS),
    ]
    const state = createPlayerState({
      cardsPlayed,
      effectsActivated: 2, // Only 2 out of 3
      remainingCards: 0,
    })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('ActivateAllEffectsVerifier - should track progress', ({ assert }) => {
    const verifier = new ActivateAllEffectsVerifier()
    const cardsPlayed = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.DIAMONDS),
      createCard(CardValue.QUEEN, CardSuit.CLUBS),
      createCard(CardValue.JACK, CardSuit.SPADES),
    ]
    const state = createPlayerState({ cardsPlayed, effectsActivated: 2 })
    const progress = verifier.getProgress!(state)

    assert.equal(progress.current, 2)
    assert.equal(progress.target, 4)
    assert.equal(progress.percentage, 50)
  })

  test('NeverActivateEffectsVerifier - should complete when no effects activated', ({ assert }) => {
    const verifier = new NeverActivateEffectsVerifier()
    const state = createPlayerState({ effectsActivated: 0, remainingCards: 0 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('NeverActivateEffectsVerifier - should fail when any effect activated', ({ assert }) => {
    const verifier = new NeverActivateEffectsVerifier()
    const state = createPlayerState({ effectsActivated: 1, remainingCards: 0 })

    assert.isFalse(verifier.checkCompletion(state))
  })
})

test.group('Objective Verifiers - Edge Cases', () => {
  const createCard = (value: CardValue, suit: CardSuit): Card => ({
    id: `${suit}-${value}`,
    value,
    suit,
    effect: { type: 'none' },
    numericValue: getNumericValue(value),
  })

  function getNumericValue(value: CardValue): number {
    const map: Record<CardValue, number> = {
      [CardValue.TWO]: 2,
      [CardValue.THREE]: 3,
      [CardValue.FOUR]: 4,
      [CardValue.FIVE]: 5,
      [CardValue.SIX]: 6,
      [CardValue.SEVEN]: 7,
      [CardValue.EIGHT]: 8,
      [CardValue.NINE]: 9,
      [CardValue.TEN]: 10,
      [CardValue.JACK]: 11,
      [CardValue.QUEEN]: 12,
      [CardValue.KING]: 13,
      [CardValue.ACE]: 14,
    }
    return map[value]
  }

  const createPlayerState = (overrides?: Partial<PlayerRoundState>): PlayerRoundState => ({
    playerId: 'player1',
    tricksWon: 0,
    cardsWon: [],
    cardsPlayed: [],
    effectsActivated: 0,
    remainingCards: 0,
    firstTrickWon: false,
    lastTrickWon: false,
    consecutiveTricksWon: 0,
    dominantSuit: CardSuit.HEARTS,
    ...overrides,
  })

  test('OnlyEvenCardsVerifier - should fail when no cards won', ({ assert }) => {
    const verifier = new OnlyEvenCardsVerifier()
    const state = createPlayerState({ cardsWon: [] })

    assert.isFalse(verifier.checkCompletion(state))
  })

  test('WinExactlyXTricksVerifier - should handle zero target', ({ assert }) => {
    const verifier = new WinExactlyXTricksVerifier(0)
    const state = createPlayerState({ tricksWon: 0 })

    assert.isTrue(verifier.checkCompletion(state))
  })

  test('WinExactlyXTricksVerifier - should cap progress at 100%', ({ assert }) => {
    const verifier = new WinExactlyXTricksVerifier(3)
    const state = createPlayerState({ tricksWon: 5 })
    const progress = verifier.getProgress!(state)

    assert.equal(progress.percentage, 100)
  })

  test('TotalValueLessThanVerifier - should handle division correctly', ({ assert }) => {
    const verifier = new TotalValueLessThanVerifier(0)
    const cardsWon = [createCard(CardValue.TWO, CardSuit.HEARTS)]
    const state = createPlayerState({ cardsWon, remainingCards: 0 })

    // Should not throw on division
    assert.isFalse(verifier.checkCompletion(state))
  })

  test('ActivateAllEffectsVerifier - should handle no cards played', ({ assert }) => {
    const verifier = new ActivateAllEffectsVerifier()
    const state = createPlayerState({ cardsPlayed: [], effectsActivated: 0, remainingCards: 0 })
    const progress = verifier.getProgress!(state)

    assert.equal(progress.current, 0)
    assert.equal(progress.target, 1)
    assert.equal(progress.percentage, 0)
  })

  test('WinAllSuitsVerifier - should handle duplicate suits', ({ assert }) => {
    const verifier = new WinAllSuitsVerifier()
    const cardsWon = [
      createCard(CardValue.ACE, CardSuit.HEARTS),
      createCard(CardValue.KING, CardSuit.HEARTS),
      createCard(CardValue.QUEEN, CardSuit.HEARTS),
    ]
    const state = createPlayerState({ cardsWon })

    assert.isFalse(verifier.checkCompletion(state))
  })
})
