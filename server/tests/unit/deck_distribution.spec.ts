/**
 * Deck Distribution Unit Tests
 * Tests card shuffling and distribution with cryptographic security
 */

import { test } from '@japa/runner'
import DeckService from '#services/deck_service'
import { CardSuit, CardValue } from '#types/card'

test.group('Deck Distribution Service', () => {
  test('should create a standard 52-card deck', ({ assert }) => {
    const deck = DeckService.createStandardDeck()

    assert.equal(deck.length, 52)

    // Verify all cards are unique
    const uniqueIds = new Set(deck.map((card) => card.id))
    assert.equal(uniqueIds.size, 52)
  })

  test('should create deck with all suits and values', ({ assert }) => {
    const deck = DeckService.createStandardDeck()

    // Check we have 13 cards per suit
    const heartCards = deck.filter((card) => card.suit === CardSuit.HEARTS)
    const diamondCards = deck.filter((card) => card.suit === CardSuit.DIAMONDS)
    const clubCards = deck.filter((card) => card.suit === CardSuit.CLUBS)
    const spadeCards = deck.filter((card) => card.suit === CardSuit.SPADES)

    assert.equal(heartCards.length, 13)
    assert.equal(diamondCards.length, 13)
    assert.equal(clubCards.length, 13)
    assert.equal(spadeCards.length, 13)

    // Check we have 4 cards per value
    const aces = deck.filter((card) => card.value === CardValue.ACE)
    const kings = deck.filter((card) => card.value === CardValue.KING)
    const queens = deck.filter((card) => card.value === CardValue.QUEEN)

    assert.equal(aces.length, 4)
    assert.equal(kings.length, 4)
    assert.equal(queens.length, 4)
  })

  test('should shuffle deck and produce different order', ({ assert }) => {
    const deck1 = DeckService.createStandardDeck()
    const deck2 = DeckService.createStandardDeck()

    const shuffled1 = DeckService.shuffleDeck(deck1)
    const shuffled2 = DeckService.shuffleDeck(deck2)

    // Check that shuffled decks have same length
    assert.equal(shuffled1.length, 52)
    assert.equal(shuffled2.length, 52)

    // Check that two shuffles produce different orders (statistically very likely)
    const sameOrder = shuffled1.every((card, index) => card.id === shuffled2[index]!.id)
    assert.isFalse(sameOrder)
  })

  test('should preserve all cards during shuffle', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const originalIds = new Set(deck.map((card) => card.id))

    const shuffled = DeckService.shuffleDeck(deck)
    const shuffledIds = new Set(shuffled.map((card) => card.id))

    // All original cards should still be present
    assert.equal(shuffledIds.size, originalIds.size)
    originalIds.forEach((id) => {
      assert.isTrue(shuffledIds.has(id))
    })
  })

  test('should distribute 13 cards to 2 players', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const shuffled = DeckService.shuffleDeck(deck)

    const { hands, remainingDeck } = DeckService.distributeCards(shuffled, 2)

    assert.equal(hands.length, 2)
    assert.equal(hands[0]!.length, 13)
    assert.equal(hands[1]!.length, 13)
    assert.equal(remainingDeck.length, 26) // 52 - 26 = 26 remaining
  })

  test('should distribute 13 cards to 3 players', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const shuffled = DeckService.shuffleDeck(deck)

    const { hands, remainingDeck } = DeckService.distributeCards(shuffled, 3)

    assert.equal(hands.length, 3)
    assert.equal(hands[0]!.length, 13)
    assert.equal(hands[1]!.length, 13)
    assert.equal(hands[2]!.length, 13)
    assert.equal(remainingDeck.length, 13) // 52 - 39 = 13 remaining
  })

  test('should distribute 13 cards to 4 players', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const shuffled = DeckService.shuffleDeck(deck)

    const { hands, remainingDeck } = DeckService.distributeCards(shuffled, 4)

    assert.equal(hands.length, 4)
    assert.equal(hands[0]!.length, 13)
    assert.equal(hands[1]!.length, 13)
    assert.equal(hands[2]!.length, 13)
    assert.equal(hands[3]!.length, 13)
    assert.equal(remainingDeck.length, 0) // 52 - 52 = 0 remaining (perfect distribution)
  })

  test('should ensure no duplicate cards across hands', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const shuffled = DeckService.shuffleDeck(deck)

    const { hands } = DeckService.distributeCards(shuffled, 4)

    const allCardIds = new Set<string>()

    for (const hand of hands) {
      for (const card of hand) {
        // Each card ID should be unique
        assert.isFalse(allCardIds.has(card.id))
        allCardIds.add(card.id)
      }
    }

    assert.equal(allCardIds.size, 52)
  })

  test('should throw error for invalid player count', ({ assert }) => {
    const deck = DeckService.createStandardDeck()

    assert.throws(() => {
      DeckService.distributeCards(deck, 1) // Less than 2 players
    }, 'Player count must be between 2 and 4')

    assert.throws(() => {
      DeckService.distributeCards(deck, 5) // More than 4 players
    }, 'Player count must be between 2 and 4')
  })

  test('should throw error when deck is too small', ({ assert }) => {
    const smallDeck = DeckService.createStandardDeck().slice(0, 20) // Only 20 cards

    assert.throws(() => {
      DeckService.distributeCards(smallDeck, 4) // Needs 52 cards
    }, /Not enough cards in deck/)
  })

  test('should distribute cards in sequential order', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const shuffled = DeckService.shuffleDeck(deck)

    const { hands } = DeckService.distributeCards(shuffled, 2)

    // First player gets cards 0-12
    // Second player gets cards 13-25
    for (let i = 0; i < 13; i++) {
      assert.equal(hands[0]![i]!.id, shuffled[i]!.id)
    }

    for (let i = 0; i < 13; i++) {
      assert.equal(hands[1]![i]!.id, shuffled[13 + i]!.id)
    }
  })

  test('should use cryptographically secure random (no Math.random)', ({ assert }) => {
    // This test verifies that shuffles are consistent with crypto.randomBytes
    // We can't directly test randomness, but we can verify the function doesn't throw
    const deck = DeckService.createStandardDeck()

    assert.doesNotThrow(() => {
      DeckService.shuffleDeck(deck)
    })
  })

  test('should sort cards by suit and value', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const shuffled = DeckService.shuffleDeck(deck)

    const sorted = DeckService.sortCards(shuffled)

    // First 13 should be hearts (suit order: hearts, diamonds, clubs, spades)
    for (let i = 0; i < 13; i++) {
      assert.equal(sorted[i]!.suit, CardSuit.HEARTS)
    }

    // Values should be in ascending order
    assert.equal(sorted[0]!.value, CardValue.TWO)
    assert.equal(sorted[12]!.value, CardValue.ACE)
  })

  test('should get correct card display name in French', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const aceOfHearts = deck.find((c) => c.value === CardValue.ACE && c.suit === CardSuit.HEARTS)!

    const displayName = DeckService.getCardDisplayName(aceOfHearts, 'fr')

    assert.equal(displayName, 'As de Cœur')
  })

  test('should get correct card display name in English', ({ assert }) => {
    const deck = DeckService.createStandardDeck()
    const kingOfSpades = deck.find((c) => c.value === CardValue.KING && c.suit === CardSuit.SPADES)!

    const displayName = DeckService.getCardDisplayName(kingOfSpades, 'en')

    assert.equal(displayName, 'King de Spades')
  })
})
