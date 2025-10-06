/**
 * Card Comparison Service Unit Tests
 * Tests all scenarios of card comparison logic
 *
 * NOTE: compareCards() now uses "color first, then value" logic
 */

import { test } from '@japa/runner'
import CardComparisonService from '#services/card_comparison_service'
import { CardSuit } from '#types/card'
import type { ComparableCard } from '#services/card_comparison_service'

test.group('Card Comparison Service - compareCards()', () => {
  test('should compare cards by color first, then value', ({ assert }) => {
    const card1: ComparableCard = { value: 2, suit: CardSuit.HEARTS } // 2 of dominant
    const card2: ComparableCard = { value: 14, suit: CardSuit.DIAMONDS } // Ace of neutral
    const result = CardComparisonService.compareCards(card1, card2, CardSuit.HEARTS)

    assert.equal(result, 1, 'Dominant color should beat neutral, regardless of value')
  })

  test('should compare by value when same color', ({ assert }) => {
    const aceHearts: ComparableCard = { value: 14, suit: CardSuit.HEARTS }
    const twoHearts: ComparableCard = { value: 2, suit: CardSuit.HEARTS }
    const result = CardComparisonService.compareCards(aceHearts, twoHearts, CardSuit.CLUBS)

    assert.equal(result, 1, 'Ace should beat 2 when same color')
  })

  test('dominant color beats all others with same value', ({ assert }) => {
    const dominantCard: ComparableCard = { value: 10, suit: CardSuit.HEARTS }
    const otherCard: ComparableCard = { value: 10, suit: CardSuit.DIAMONDS }

    const result = CardComparisonService.compareCards(dominantCard, otherCard, CardSuit.HEARTS)

    assert.equal(result, 1, 'Dominant color should win')
  })

  test('weak color loses to all others with same value', ({ assert }) => {
    const weakCard: ComparableCard = { value: 10, suit: CardSuit.SPADES } // Opposite of hearts
    const neutralCard: ComparableCard = { value: 10, suit: CardSuit.DIAMONDS }

    const result = CardComparisonService.compareCards(weakCard, neutralCard, CardSuit.HEARTS)

    assert.equal(result, -1, 'Weak color should lose to neutral')
  })

  test('red neutral beats black neutral when dominant is red', ({ assert }) => {
    const redNeutral: ComparableCard = { value: 10, suit: CardSuit.DIAMONDS }
    const blackNeutral: ComparableCard = { value: 10, suit: CardSuit.CLUBS }

    const result = CardComparisonService.compareCards(redNeutral, blackNeutral, CardSuit.HEARTS)

    assert.equal(result, 1, 'Red neutral should beat black neutral when hearts is dominant')
  })

  test('black neutral beats red neutral when dominant is black', ({ assert }) => {
    const blackNeutral: ComparableCard = { value: 10, suit: CardSuit.SPADES }
    const redNeutral: ComparableCard = { value: 10, suit: CardSuit.HEARTS }

    const result = CardComparisonService.compareCards(blackNeutral, redNeutral, CardSuit.CLUBS)

    assert.equal(result, 1, 'Black neutral should beat red neutral when clubs is dominant')
  })

  test('complete hierarchy with hearts dominant', ({ assert }) => {
    const hearts10: ComparableCard = { value: 10, suit: CardSuit.HEARTS }
    const diamonds10: ComparableCard = { value: 10, suit: CardSuit.DIAMONDS }
    const clubs10: ComparableCard = { value: 10, suit: CardSuit.CLUBS }
    const spades10: ComparableCard = { value: 10, suit: CardSuit.SPADES }

    // Hearts > Diamonds > Clubs > Spades
    assert.equal(CardComparisonService.compareCards(hearts10, diamonds10, CardSuit.HEARTS), 1)
    assert.equal(CardComparisonService.compareCards(hearts10, clubs10, CardSuit.HEARTS), 1)
    assert.equal(CardComparisonService.compareCards(hearts10, spades10, CardSuit.HEARTS), 1)
    assert.equal(CardComparisonService.compareCards(diamonds10, clubs10, CardSuit.HEARTS), 1)
    assert.equal(CardComparisonService.compareCards(diamonds10, spades10, CardSuit.HEARTS), 1)
    assert.equal(CardComparisonService.compareCards(clubs10, spades10, CardSuit.HEARTS), 1)
  })

  test('complete hierarchy with clubs dominant', ({ assert }) => {
    const hearts5: ComparableCard = { value: 5, suit: CardSuit.HEARTS }
    const diamonds5: ComparableCard = { value: 5, suit: CardSuit.DIAMONDS }
    const clubs5: ComparableCard = { value: 5, suit: CardSuit.CLUBS }
    const spades5: ComparableCard = { value: 5, suit: CardSuit.SPADES }

    // Clubs > Spades > Hearts > Diamonds
    assert.equal(CardComparisonService.compareCards(clubs5, spades5, CardSuit.CLUBS), 1)
    assert.equal(CardComparisonService.compareCards(clubs5, hearts5, CardSuit.CLUBS), 1)
    assert.equal(CardComparisonService.compareCards(clubs5, diamonds5, CardSuit.CLUBS), 1)
    assert.equal(CardComparisonService.compareCards(spades5, hearts5, CardSuit.CLUBS), 1)
    assert.equal(CardComparisonService.compareCards(spades5, diamonds5, CardSuit.CLUBS), 1)
    assert.equal(CardComparisonService.compareCards(hearts5, diamonds5, CardSuit.CLUBS), 1)
  })

  test('should find winner among multiple cards (color first)', ({ assert }) => {
    const playedCards = new Map<number, ComparableCard>([
      [1, { value: 10, suit: CardSuit.HEARTS }],
      [2, { value: 10, suit: CardSuit.DIAMONDS }],
      [3, { value: 10, suit: CardSuit.CLUBS }],
      [4, { value: 10, suit: CardSuit.SPADES }],
    ])

    const winner = CardComparisonService.findWinner(playedCards, CardSuit.HEARTS)

    assert.equal(winner, 1, 'Player 1 with hearts (dominant) should win')
  })

  test('should find winner based on color hierarchy, NOT value', ({ assert }) => {
    const playedCards = new Map<number, ComparableCard>([
      [1, { value: 14, suit: CardSuit.SPADES }], // Ace of weak color
      [2, { value: 2, suit: CardSuit.HEARTS }], // 2 of dominant color
      [3, { value: 12, suit: CardSuit.DIAMONDS }], // Queen of neutral color
    ])

    const winner = CardComparisonService.findWinner(playedCards, CardSuit.HEARTS)

    assert.equal(winner, 2, 'Player 2 with dominant color should win, even with value 2')
  })

  test('should never return 0 (no ties)', ({ assert }) => {
    const allSuits: CardSuit[] = [
      CardSuit.HEARTS,
      CardSuit.DIAMONDS,
      CardSuit.CLUBS,
      CardSuit.SPADES,
    ]
    const testValue = 10

    for (const dominantColor of allSuits) {
      for (const suit1 of allSuits) {
        for (const suit2 of allSuits) {
          if (suit1 === suit2) continue // Skip same suit

          const card1: ComparableCard = { value: testValue, suit: suit1 }
          const card2: ComparableCard = { value: testValue, suit: suit2 }

          const result = CardComparisonService.compareCards(card1, card2, dominantColor)

          assert.notEqual(
            result,
            0,
            `No tie should occur: ${suit1} vs ${suit2} (${dominantColor} dominant)`
          )
        }
      }
    }
  })

  test('should get correct opposite colors', ({ assert }) => {
    assert.equal(CardComparisonService.getOppositeColor(CardSuit.HEARTS), CardSuit.SPADES)
    assert.equal(CardComparisonService.getOppositeColor(CardSuit.SPADES), CardSuit.HEARTS)
    assert.equal(CardComparisonService.getOppositeColor(CardSuit.DIAMONDS), CardSuit.CLUBS)
    assert.equal(CardComparisonService.getOppositeColor(CardSuit.CLUBS), CardSuit.DIAMONDS)
  })

  test('should correctly identify red suits', ({ assert }) => {
    assert.isTrue(CardComparisonService.isRedSuit(CardSuit.HEARTS))
    assert.isTrue(CardComparisonService.isRedSuit(CardSuit.DIAMONDS))
    assert.isFalse(CardComparisonService.isRedSuit(CardSuit.CLUBS))
    assert.isFalse(CardComparisonService.isRedSuit(CardSuit.SPADES))
  })

  test('should get correct color hierarchy for hearts dominant', ({ assert }) => {
    const hierarchy = CardComparisonService.getColorHierarchy(CardSuit.HEARTS)

    assert.deepEqual(hierarchy, [
      CardSuit.HEARTS,
      CardSuit.DIAMONDS,
      CardSuit.CLUBS,
      CardSuit.SPADES,
    ])
  })

  test('should get correct color hierarchy for clubs dominant', ({ assert }) => {
    const hierarchy = CardComparisonService.getColorHierarchy(CardSuit.CLUBS)

    assert.deepEqual(hierarchy, [
      CardSuit.CLUBS,
      CardSuit.SPADES,
      CardSuit.HEARTS,
      CardSuit.DIAMONDS,
    ])
  })

  test('should get correct color hierarchy for diamonds dominant', ({ assert }) => {
    const hierarchy = CardComparisonService.getColorHierarchy(CardSuit.DIAMONDS)

    assert.deepEqual(hierarchy, [
      CardSuit.DIAMONDS,
      CardSuit.HEARTS,
      CardSuit.SPADES,
      CardSuit.CLUBS,
    ])
  })

  test('should get correct color hierarchy for spades dominant', ({ assert }) => {
    const hierarchy = CardComparisonService.getColorHierarchy(CardSuit.SPADES)

    assert.deepEqual(hierarchy, [
      CardSuit.SPADES,
      CardSuit.CLUBS,
      CardSuit.DIAMONDS,
      CardSuit.HEARTS,
    ])
  })

  test('should provide comparison explanation for color win', ({ assert }) => {
    const winner: ComparableCard = { value: 2, suit: CardSuit.HEARTS }
    const loser: ComparableCard = { value: 14, suit: CardSuit.DIAMONDS }

    const explanation = CardComparisonService.getComparisonExplanation(
      winner,
      loser,
      CardSuit.HEARTS
    )

    assert.include(explanation, 'Dominant color')
    assert.include(explanation, CardSuit.HEARTS)
  })

  test('should provide comparison explanation for value win (same color)', ({ assert }) => {
    const winner: ComparableCard = { value: 14, suit: CardSuit.HEARTS }
    const loser: ComparableCard = { value: 10, suit: CardSuit.HEARTS }

    const explanation = CardComparisonService.getComparisonExplanation(
      winner,
      loser,
      CardSuit.CLUBS
    )

    assert.include(explanation, 'Higher value')
    assert.include(explanation, '14')
    assert.include(explanation, '10')
  })

  test('should get color relation between same colors', ({ assert }) => {
    const relation = CardComparisonService.getColorRelation(
      CardSuit.HEARTS,
      CardSuit.HEARTS,
      CardSuit.CLUBS
    )

    assert.equal(relation, 'equal')
  })

  test('should get color relation with dominant color', ({ assert }) => {
    const relation = CardComparisonService.getColorRelation(
      CardSuit.HEARTS,
      CardSuit.DIAMONDS,
      CardSuit.HEARTS
    )

    assert.equal(relation, 'stronger')
  })

  test('should throw error when finding winner with no cards', ({ assert }) => {
    const playedCards = new Map<number, ComparableCard>()

    assert.throws(
      () => CardComparisonService.findWinner(playedCards, CardSuit.HEARTS),
      'Cannot find winner with no cards played'
    )
  })

  test('should handle 2 player scenario (color first)', ({ assert }) => {
    const playedCards = new Map<number, ComparableCard>([
      [1, { value: 10, suit: CardSuit.HEARTS }], // Red neutral
      [2, { value: 12, suit: CardSuit.DIAMONDS }], // WEAK (opposite of Clubs)
    ])

    // Clubs is dominant (black) → Diamonds is WEAK (opposite)
    // Hearts is red neutral, Diamonds is weak
    // Neutral beats weak, regardless of value
    const winner = CardComparisonService.findWinner(playedCards, CardSuit.CLUBS)

    assert.equal(winner, 1, 'Player 1 with neutral should win (even with lower value)')
  })

  test('should handle 4 player scenario (color first)', ({ assert }) => {
    const playedCards = new Map<number, ComparableCard>([
      [1, { value: 8, suit: CardSuit.HEARTS }],
      [2, { value: 10, suit: CardSuit.DIAMONDS }], // Dominant!
      [3, { value: 12, suit: CardSuit.CLUBS }],
      [4, { value: 14, suit: CardSuit.HEARTS }],
    ])

    // Diamonds is dominant → Player 2 wins even with value 10
    const winner = CardComparisonService.findWinner(playedCards, CardSuit.DIAMONDS)

    assert.equal(winner, 2, 'Player 2 with dominant color should win (not Player 4 with Ace)')
  })
})
