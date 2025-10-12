import type { HttpContext } from '@adonisjs/core/http'
import GamePlayer from '#models/game_player'
import { MulliganService } from '#services/mulligan_service'

/**
 * Contrôleur pour la gestion du système de mulligan
 */
export default class MulliganController {
  /**
   * Pioche initiale de 5 cartes (début du mulligan)
   * POST /api/games/:gameId/mulligan/draw
   */
  async drawInitialHand({ params, auth, response }: HttpContext) {
    const player = await GamePlayer.query()
      .where('gameId', params.gameId)
      .where('userId', auth.user!.id)
      .firstOrFail()

    // Vérifier que le joueur a bien 13 cartes et pas encore de main
    if (player.hand.length !== 13) {
      return response.badRequest({
        message: 'game.errors.invalidCardCount',
      })
    }

    if (player.deck.length > 0) {
      return response.badRequest({
        message: 'game.errors.mulliganAlreadyDone',
      })
    }

    // Pioche initiale
    const { hand, deck } = MulliganService.drawInitialHand(player.hand)

    // Sauvegarde temporaire (avant confirmation du mulligan)
    player.hand = hand
    player.deck = deck
    await player.save()

    return response.ok({
      hand,
      message: 'game.mulligan.initialHandDrawn',
    })
  }

  /**
   * Effectue le mulligan
   * POST /api/games/:gameId/mulligan/perform
   * Body: { cardsToReplace: string[] }
   */
  async performMulligan({ params, auth, request, response }: HttpContext) {
    const player = await GamePlayer.query()
      .where('gameId', params.gameId)
      .where('userId', auth.user!.id)
      .firstOrFail()

    const { cardsToReplace } = request.only(['cardsToReplace'])

    // Validation : cardsToReplace doit être un tableau
    if (!Array.isArray(cardsToReplace)) {
      return response.badRequest({
        message: 'game.errors.invalidRequest',
      })
    }

    // Effectuer le mulligan
    const result = MulliganService.performMulligan(player.hand, player.deck, cardsToReplace)

    // Sauvegarder la nouvelle main + deck
    player.hand = result.newHand
    player.deck = result.deck
    await player.save()

    return response.ok({
      hand: result.newHand,
      replacedCount: result.replacedCount,
      message: 'game.mulligan.completed',
    })
  }

  /**
   * Skip le mulligan (garder la main actuelle)
   * POST /api/games/:gameId/mulligan/skip
   */
  async skipMulligan({ params, auth, response }: HttpContext) {
    const player = await GamePlayer.query()
      .where('gameId', params.gameId)
      .where('userId', auth.user!.id)
      .firstOrFail()

    // Rien à faire, la main est déjà bonne
    return response.ok({
      hand: player.hand,
      message: 'game.mulligan.skipped',
    })
  }
}
