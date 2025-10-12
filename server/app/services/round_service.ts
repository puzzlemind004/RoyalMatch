import Round from '#models/round'
import Game from '#models/game'
import GamePlayer from '#models/game_player'
import ColorRouletteService from '#services/color_roulette_service'
import DeckService from '#services/deck_service'
import { WebSocketService } from '#services/websocket_service'
import { CardSuit } from '#types/card'

/**
 * Service responsible for round management
 */
export default class RoundService {
  private colorRouletteService: ColorRouletteService

  constructor() {
    this.colorRouletteService = new ColorRouletteService()
  }

  /**
   * Starts a new round for a game
   * Spins the color roulette, distributes cards, and broadcasts the result
   * @param {string} gameId - The game ID
   * @returns {Promise<Round>} The created round
   */
  async startNewRound(gameId: string): Promise<Round> {
    // Get current game state with players
    const game = await Game.query().where('id', gameId).preload('players').firstOrFail()

    // Spin the roulette to determine dominant color
    const dominantColor = this.colorRouletteService.spinRoulette()
    const weakColor = this.colorRouletteService.getWeakColor(dominantColor)
    const hierarchy = this.colorRouletteService.getColorHierarchy(dominantColor)

    // Create and shuffle the deck
    const deck = DeckService.createStandardDeck()
    const shuffledDeck = DeckService.shuffleDeck(deck)

    // Distribute cards to all players
    const { hands } = DeckService.distributeCards(shuffledDeck, game.players.length)

    // Save cards to each player's hand
    for (let i = 0; i < game.players.length; i++) {
      const player = game.players[i]!
      player.hand = hands[i]!
      await player.save()
    }

    // Create new round in database
    const round = await Round.create({
      gameId,
      roundNumber: game.currentRound + 1,
      dominantColor,
      weakColor,
      status: 'in_progress',
    })

    // Broadcast roulette result to all players
    this.broadcastRouletteResult(gameId, hierarchy)

    // Broadcast card distribution to each player (private event)
    this.broadcastCardDistribution(game.players)

    return round
  }

  /**
   * Broadcasts card distribution to each player privately
   * @param {GamePlayer[]} players - Array of game players
   */
  private broadcastCardDistribution(players: GamePlayer[]): void {
    for (const player of players) {
      // Send cards only to the specific player (private channel)
      if (player.userId) {
        WebSocketService.cardsDistributed(player.userId, {
          cards: player.hand,
          count: player.hand.length,
        })
      }
    }
  }

  /**
   * Broadcasts roulette result to all players in a game
   * @param {string} gameId - The game ID
   * @param {object} hierarchy - Color hierarchy with dominant, weak, and neutral colors
   */
  private broadcastRouletteResult(
    gameId: string,
    hierarchy: { dominant: CardSuit; weak: CardSuit; neutrals: CardSuit[] }
  ): void {
    WebSocketService.rouletteResult(gameId, {
      dominantColor: hierarchy.dominant,
      weakColor: hierarchy.weak,
      neutrals: hierarchy.neutrals,
    })
  }

  /**
   * Ends the current round
   * @param {string} roundId - The round ID
   */
  async endRound(roundId: string): Promise<void> {
    const round = await Round.findOrFail(roundId)
    round.status = 'finished'
    await round.save()

    WebSocketService.roundEnded(round.gameId, {
      roundNumber: round.roundNumber,
    })
  }
}
