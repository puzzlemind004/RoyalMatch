import type { Card } from '#types/card'
import DeckService from '#services/deck_service'

export interface MulliganResult {
  newHand: Card[]
  deck: Card[]
  replacedCount: number
}

/**
 * Service de gestion du système de mulligan (sélection de la main de départ)
 * Inspiré du système Hearthstone (mulligan sélectif)
 */
export class MulliganService {
  /**
   * Effectue le mulligan pour un joueur
   * @param currentHand - Main actuelle de 5 cartes
   * @param deck - Deck de 8 cartes restantes
   * @param cardsToReplace - IDs des cartes à remplacer
   * @returns Nouvelle main + deck mis à jour
   */
  static performMulligan(
    currentHand: Card[],
    deck: Card[],
    cardsToReplace: string[]
  ): MulliganResult {
    // Validation : la main doit contenir exactement 5 cartes
    if (currentHand.length !== 5) {
      throw new Error('game.errors.invalidHandSize')
    }

    // Validation : impossible de remplacer plus de 5 cartes
    if (cardsToReplace.length > 5) {
      throw new Error('game.errors.tooManyCardsToReplace')
    }

    // Validation : toutes les cartes à remplacer sont bien dans la main
    const handIds = new Set(currentHand.map((c) => c.id))
    for (const cardId of cardsToReplace) {
      if (!handIds.has(cardId)) {
        throw new Error('game.errors.cardNotInHand')
      }
    }

    // Cartes à garder
    const keptCards = currentHand.filter((c) => !cardsToReplace.includes(c.id))

    // Cartes à renvoyer dans le deck
    const returnedCards = currentHand.filter((c) => cardsToReplace.includes(c.id))

    // Nouveau deck : ancien deck + cartes renvoyées
    const newDeck = [...deck, ...returnedCards]

    // Mélange du deck avec shuffle cryptographique
    const shuffledDeck = DeckService.shuffleDeck(newDeck)

    // Pioche de nouvelles cartes
    const drawnCards = shuffledDeck.slice(0, cardsToReplace.length)
    const remainingDeck = shuffledDeck.slice(cardsToReplace.length)

    // Nouvelle main : cartes gardées + cartes piochées
    const newHand = [...keptCards, ...drawnCards]

    return {
      newHand,
      deck: remainingDeck,
      replacedCount: cardsToReplace.length,
    }
  }

  /**
   * Pioche initiale de 5 cartes depuis les 13 cartes mélangées
   * @param allCards - Les 13 cartes du joueur (déjà mélangées)
   * @returns Main de 5 cartes + deck de 8 cartes
   */
  static drawInitialHand(allCards: Card[]): { hand: Card[]; deck: Card[] } {
    // Validation : le joueur doit avoir exactement 13 cartes
    if (allCards.length !== 13) {
      throw new Error('game.errors.invalidDeckSize')
    }

    // Mélange des 13 cartes avec shuffle cryptographique
    const shuffled = DeckService.shuffleDeck(allCards)

    return {
      hand: shuffled.slice(0, 5),
      deck: shuffled.slice(5),
    }
  }
}
