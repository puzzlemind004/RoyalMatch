import type { HttpContext } from '@adonisjs/core/http'
import Player from '#models/player'
import { CardSuit, CardValue } from '#types/card'

/**
 * Controller for testing Player model functionality
 * This is a temporary controller for demonstration purposes
 */
export default class PlayerTestsController {
  /**
   * Test Player model methods
   * GET /api/test/player
   */
  async test({ response }: HttpContext) {
    const testResults = {
      handManagement: false,
      deckManagement: false,
      statsManagement: false,
      displayName: false,
    }

    try {
      // Create a test player
      const player = new Player()
      player.isAi = false
      player.playerOrder = 1
      player.totalScore = 0
      player.hand = []
      player.deck = []

      // Test 1: Hand management
      const testCard1 = {
        id: 'test-card-1',
        value: CardValue.ACE,
        suit: CardSuit.HEARTS,
        effect: { type: 'none' },
        numericValue: 14,
      }

      player.addCardToHand(testCard1)
      const hasCard = player.hasCardInHand('test-card-1')
      const removedCard = player.removeCardFromHand('test-card-1')

      testResults.handManagement =
        hasCard === true && removedCard?.id === 'test-card-1' && player.getHand().length === 0

      // Test 2: Deck management
      const testCards = [
        {
          id: 'deck-1',
          value: CardValue.KING,
          suit: CardSuit.SPADES,
          effect: { type: 'none' },
          numericValue: 13,
        },
        {
          id: 'deck-2',
          value: CardValue.QUEEN,
          suit: CardSuit.DIAMONDS,
          effect: { type: 'none' },
          numericValue: 12,
        },
      ]

      player.initializeDeck(testCards)
      player.shuffleDeck()
      const drawnCard = player.drawCard()

      testResults.deckManagement =
        drawnCard !== undefined &&
        player.getDeck().length === 1 &&
        player.getHand().length === 1

      // Test 3: Stats management
      player.initializeStats()
      player.updateStat('tricksWon', 3)
      player.incrementStat('cardsPlayed', 2)

      const stats = player.getStats()
      testResults.statsManagement = stats.tricksWon === 3 && stats.cardsPlayed === 2

      // Test 4: Display name
      const displayName = player.getDisplayName()
      testResults.displayName = displayName === 'Player 1'

      return response.ok({
        success: true,
        message: 'Player model tests completed',
        results: testResults,
        allTestsPassed: Object.values(testResults).every((result) => result === true),
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: 'Player model tests failed',
        error: error.message,
        results: testResults,
      })
    }
  }
}