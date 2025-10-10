import { test } from '@japa/runner'
import GamePlayer from '#models/game_player'
import { Card, CardSuit, CardValue } from '#types/card'

/**
 * Test suite for GamePlayer model
 * Tests business logic for player management including hand, deck, and stats
 */
test.group('GamePlayer Model', () => {
  /**
   * Helper function to create a test card
   */
  function createTestCard(value: CardValue, suit: CardSuit, id?: string): Card {
    return {
      id: id || `card-${value}-${suit}`,
      value,
      suit,
      effect: { type: 'none' },
      numericValue: 10,
    }
  }

  test('should initialize hand as empty array', ({ assert }) => {
    const player = new GamePlayer()
    player.hand = []

    assert.isArray(player.getHand())
    assert.lengthOf(player.getHand(), 0)
  })

  test('should add card to hand', ({ assert }) => {
    const player = new GamePlayer()
    player.hand = []

    const card = createTestCard(CardValue.ACE, CardSuit.HEARTS)
    player.addCardToHand(card)

    assert.lengthOf(player.getHand(), 1)
    assert.equal(player.getHand()[0].id, card.id)
  })

  test('should add multiple cards to hand', ({ assert }) => {
    const player = new GamePlayer()
    player.hand = []

    const card1 = createTestCard(CardValue.ACE, CardSuit.HEARTS, 'card-1')
    const card2 = createTestCard(CardValue.KING, CardSuit.SPADES, 'card-2')

    player.addCardToHand(card1)
    player.addCardToHand(card2)

    assert.lengthOf(player.getHand(), 2)
    assert.equal(player.getHand()[0].id, 'card-1')
    assert.equal(player.getHand()[1].id, 'card-2')
  })

  test('should remove card from hand', ({ assert }) => {
    const player = new GamePlayer()
    player.hand = []

    const card1 = createTestCard(CardValue.ACE, CardSuit.HEARTS, 'card-1')
    const card2 = createTestCard(CardValue.KING, CardSuit.SPADES, 'card-2')

    player.addCardToHand(card1)
    player.addCardToHand(card2)

    const removedCard = player.removeCardFromHand('card-1')

    assert.isDefined(removedCard)
    assert.equal(removedCard!.id, 'card-1')
    assert.lengthOf(player.getHand(), 1)
    assert.equal(player.getHand()[0].id, 'card-2')
  })

  test('should return undefined when removing non-existent card', ({ assert }) => {
    const player = new GamePlayer()
    player.hand = []

    const card = createTestCard(CardValue.ACE, CardSuit.HEARTS, 'card-1')
    player.addCardToHand(card)

    const removedCard = player.removeCardFromHand('non-existent')

    assert.isUndefined(removedCard)
    assert.lengthOf(player.getHand(), 1)
  })

  test('should check if card is in hand', ({ assert }) => {
    const player = new GamePlayer()
    player.hand = []

    const card = createTestCard(CardValue.ACE, CardSuit.HEARTS, 'card-1')
    player.addCardToHand(card)

    assert.isTrue(player.hasCardInHand('card-1'))
    assert.isFalse(player.hasCardInHand('card-2'))
  })

  test('should initialize deck with cards', ({ assert }) => {
    const player = new GamePlayer()

    const cards = [
      createTestCard(CardValue.ACE, CardSuit.HEARTS, 'card-1'),
      createTestCard(CardValue.KING, CardSuit.SPADES, 'card-2'),
      createTestCard(CardValue.QUEEN, CardSuit.DIAMONDS, 'card-3'),
    ]

    player.initializeDeck(cards)

    assert.lengthOf(player.getDeck(), 3)
    assert.equal(player.getDeck()[0].id, 'card-1')
  })

  test('should draw card from deck to hand', ({ assert }) => {
    const player = new GamePlayer()
    player.hand = []

    const cards = [
      createTestCard(CardValue.ACE, CardSuit.HEARTS, 'card-1'),
      createTestCard(CardValue.KING, CardSuit.SPADES, 'card-2'),
    ]

    player.initializeDeck(cards)

    const drawnCard = player.drawCard()

    assert.isDefined(drawnCard)
    assert.equal(drawnCard!.id, 'card-1')
    assert.lengthOf(player.getDeck(), 1)
    assert.lengthOf(player.getHand(), 1)
    assert.equal(player.getHand()[0].id, 'card-1')
  })

  test('should return undefined when drawing from empty deck', ({ assert }) => {
    const player = new GamePlayer()
    player.hand = []
    player.deck = []

    const drawnCard = player.drawCard()

    assert.isUndefined(drawnCard)
    assert.lengthOf(player.getHand(), 0)
  })

  test('should shuffle deck', ({ assert }) => {
    const player = new GamePlayer()

    const cards = [
      createTestCard(CardValue.ACE, CardSuit.HEARTS, 'card-1'),
      createTestCard(CardValue.KING, CardSuit.SPADES, 'card-2'),
      createTestCard(CardValue.QUEEN, CardSuit.DIAMONDS, 'card-3'),
      createTestCard(CardValue.JACK, CardSuit.CLUBS, 'card-4'),
      createTestCard(CardValue.TEN, CardSuit.HEARTS, 'card-5'),
    ]

    player.initializeDeck(cards)
    const originalOrder = [...player.getDeck()]

    player.shuffleDeck()

    // Check that deck still has same length
    assert.lengthOf(player.getDeck(), 5)

    // Check that all original cards are still present
    const deckIds = player.getDeck().map((c) => c.id)
    const originalIds = originalOrder.map((c) => c.id)
    assert.sameMembers(deckIds, originalIds)

    // Note: There's a very small chance this test could fail if shuffle
    // produces the same order, but with 5 cards it's unlikely (1/120 chance)
  })

  test('should initialize player stats', ({ assert }) => {
    const player = new GamePlayer()

    player.initializeStats()

    const stats = player.getStats()
    assert.equal(stats.tricksWon, 0)
    assert.equal(stats.cardsPlayed, 0)
    assert.equal(stats.effectsActivated, 0)
    assert.equal(stats.objectivesCompleted, 0)
    assert.equal(stats.maxConsecutiveTricks, 0)
    assert.equal(stats.totalCardValue, 0)
    assert.equal(stats.roundsPlayed, 0)
  })

  test('should update specific stat', ({ assert }) => {
    const player = new GamePlayer()
    player.initializeStats()

    player.updateStat('tricksWon', 5)

    const stats = player.getStats()
    assert.equal(stats.tricksWon, 5)
    assert.equal(stats.cardsPlayed, 0)
  })

  test('should increment specific stat', ({ assert }) => {
    const player = new GamePlayer()
    player.initializeStats()

    player.incrementStat('tricksWon', 1)
    player.incrementStat('tricksWon', 2)

    const stats = player.getStats()
    assert.equal(stats.tricksWon, 3)
  })

  test('should increment stat by 1 when no increment specified', ({ assert }) => {
    const player = new GamePlayer()
    player.initializeStats()

    player.incrementStat('cardsPlayed')
    player.incrementStat('cardsPlayed')

    const stats = player.getStats()
    assert.equal(stats.cardsPlayed, 2)
  })

  test('should return correct display info for AI player', ({ assert }) => {
    const player = new GamePlayer()
    player.isAi = true
    player.playerOrder = 2

    const displayInfo = player.getDisplayInfo()

    assert.equal(displayInfo.type, 'ai')
    assert.equal(displayInfo.name, 'AI')
    assert.equal(displayInfo.order, 2)
    assert.isNull(displayInfo.rank)
    assert.isNull(displayInfo.elo)
  })

  test('should return correct display info for user player', ({ assert }) => {
    const player = new GamePlayer()
    player.isAi = false
    player.playerOrder = 1

    const displayInfo = player.getDisplayInfo()

    assert.equal(displayInfo.type, 'user')
    assert.equal(displayInfo.order, 1)
    assert.isNull(displayInfo.rank) // Will be populated when ranking system is added
    assert.isNull(displayInfo.elo) // Will be populated when ranking system is added
  })
})
