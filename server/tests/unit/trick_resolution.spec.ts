/**
 * Trick Resolution Unit Tests
 * Tests the "color first, then value" logic for trick resolution
 *
 * New algorithm:
 * 1. Look at all cards in the trick
 * 2. Identify the strongest color present
 * 3. Keep ONLY cards of that color
 * 4. Compare by value (highest wins)
 */

import { test } from '@japa/runner'
import CardComparisonService from '#services/card_comparison_service'
import { CardSuit } from '#types/card'
import type { PlayedCard } from '#services/card_comparison_service'

test.group('Trick Resolution - Color First', () => {
  // Helper to create played cards
  const createPlayedCard = (
    playerId: number,
    value: number,
    suit: CardSuit
  ): PlayedCard => ({
    playerId,
    value,
    suit,
  })

  test('Exemple 1: La forte gagne même avec une petite valeur', ({ assert }) => {
    // Couleur forte : Cœur ♥️
    // Couleur faible : Pique ♠️
    const cards: PlayedCard[] = [
      createPlayedCard(1, 2, CardSuit.HEARTS), // 2♥️ (forte)
      createPlayedCard(2, 14, CardSuit.DIAMONDS), // A♦️ (neutre rouge)
      createPlayedCard(3, 13, CardSuit.CLUBS), // K♣️ (neutre noir)
      createPlayedCard(4, 12, CardSuit.SPADES), // Q♠️ (faible)
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.winnerCard.playerId, 1, 'Joueur 1 devrait gagner')
    assert.equal(result.winnerCard.suit, CardSuit.HEARTS, 'Carte forte devrait gagner')
    assert.equal(result.winnerCard.value, 2, 'Valeur 2 devrait gagner (seule carte forte)')
  })

  test('Exemple 2: Départage par valeur entre cartes fortes', ({ assert }) => {
    // Couleur forte : Trèfle ♣️
    // Couleur faible : Carreau ♦️
    const cards: PlayedCard[] = [
      createPlayedCard(1, 7, CardSuit.CLUBS), // 7♣️ (forte)
      createPlayedCard(2, 13, CardSuit.CLUBS), // K♣️ (forte)
      createPlayedCard(3, 14, CardSuit.HEARTS), // A♥️ (neutre rouge)
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.CLUBS)

    assert.equal(result.winnerCard.playerId, 2, 'Joueur 2 devrait gagner')
    assert.equal(result.winnerCard.value, 13, 'K (13) devrait battre 7')
    assert.equal(
      result.reason.type,
      'highest_value_among_dominant',
      'Raison: valeur la plus haute parmi les cartes fortes'
    )
  })

  test('Exemple 3: Aucune forte, neutres s\'affrontent', ({ assert }) => {
    // Couleur forte : Cœur ♥️ (rouge)
    // Couleur faible : Pique ♠️
    const cards: PlayedCard[] = [
      createPlayedCard(1, 10, CardSuit.DIAMONDS), // 10♦️ (neutre rouge)
      createPlayedCard(2, 14, CardSuit.DIAMONDS), // A♦️ (neutre rouge)
      createPlayedCard(3, 13, CardSuit.CLUBS), // K♣️ (neutre noir)
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.winnerCard.playerId, 2, 'Joueur 2 devrait gagner')
    assert.equal(result.winnerCard.suit, CardSuit.DIAMONDS, 'Neutre rouge devrait gagner')
    assert.equal(result.winnerCard.value, 14, 'As (14) devrait battre 10')
  })

  test('Exemple 4: Seule la faible présente', ({ assert }) => {
    // Couleur forte : Carreau ♦️
    // Couleur faible : Trèfle ♣️
    const cards: PlayedCard[] = [
      createPlayedCard(1, 5, CardSuit.CLUBS), // 5♣️ (faible)
      createPlayedCard(2, 9, CardSuit.CLUBS), // 9♣️ (faible)
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.DIAMONDS)

    assert.equal(result.winnerCard.playerId, 2, 'Joueur 2 devrait gagner')
    assert.equal(result.winnerCard.value, 9, '9 devrait battre 5')
  })

  test('Exemple 5: Une seule carte', ({ assert }) => {
    const cards: PlayedCard[] = [createPlayedCard(1, 8, CardSuit.SPADES)]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.winnerCard.playerId, 1, 'Seul joueur devrait gagner')
    assert.equal(result.reason.type, 'only_card_played', 'Raison: seule carte jouée')
  })

  test('Petite carte forte bat gros As neutre', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 2, CardSuit.HEARTS), // 2♥️ (forte)
      createPlayedCard(2, 14, CardSuit.DIAMONDS), // A♦️ (neutre)
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.winnerCard.value, 2, '2 forte devrait battre As neutre')
    assert.equal(result.winnerCard.suit, CardSuit.HEARTS)
  })

  test('Neutre rouge bat neutre noir quand forte est rouge', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 10, CardSuit.DIAMONDS), // Neutre rouge
      createPlayedCard(2, 13, CardSuit.CLUBS), // Neutre noir (valeur plus haute!)
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    // Même si le K (13) a une valeur plus haute, le 10♦️ gagne car c'est le neutre rouge
    assert.equal(result.winnerCard.suit, CardSuit.DIAMONDS, 'Neutre rouge devrait gagner')
  })

  test('Neutre noir bat neutre rouge quand forte est noire', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 14, CardSuit.HEARTS), // Neutre rouge (As!)
      createPlayedCard(2, 2, CardSuit.SPADES), // Neutre noir (2!)
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.CLUBS)

    // Même avec As vs 2, le neutre noir gagne car la forte est noire
    assert.equal(result.winnerCard.suit, CardSuit.SPADES, 'Neutre noir devrait gagner')
  })

  test('Plusieurs cartes fortes, la plus haute gagne', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 2, CardSuit.HEARTS),
      createPlayedCard(2, 5, CardSuit.HEARTS),
      createPlayedCard(3, 3, CardSuit.HEARTS),
      createPlayedCard(4, 14, CardSuit.DIAMONDS), // As neutre ne gagne pas
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.winnerCard.value, 5, '5♥️ devrait gagner (plus haute carte forte)')
    assert.equal(result.winnerCard.playerId, 2)
  })

  test('Forte absente, neutre rouge avec plus haute valeur gagne', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 7, CardSuit.DIAMONDS), // Neutre rouge
      createPlayedCard(2, 14, CardSuit.DIAMONDS), // Neutre rouge (As)
      createPlayedCard(3, 10, CardSuit.CLUBS), // Neutre noir
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.winnerCard.value, 14, 'As devrait gagner')
    assert.equal(result.winnerCard.suit, CardSuit.DIAMONDS)
  })

  test('Toutes les couleurs présentes', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 2, CardSuit.HEARTS), // Forte
      createPlayedCard(2, 14, CardSuit.DIAMONDS), // Neutre rouge
      createPlayedCard(3, 14, CardSuit.CLUBS), // Neutre noir
      createPlayedCard(4, 14, CardSuit.SPADES), // Faible
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    // Seule la carte forte compte, même si c'est un 2
    assert.equal(result.winnerCard.value, 2)
    assert.equal(result.winnerCard.suit, CardSuit.HEARTS)
  })

  test('Aucune carte jouée lève une erreur', ({ assert }) => {
    assert.throws(
      () => CardComparisonService.findTrickWinner([], CardSuit.HEARTS),
      'No cards played'
    )
  })

  test('Reason: only_dominant_color', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 5, CardSuit.HEARTS),
      createPlayedCard(2, 10, CardSuit.DIAMONDS),
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.reason.type, 'only_dominant_color')
    if (result.reason.type === 'only_dominant_color') {
      assert.equal(result.reason.suit, CardSuit.HEARTS)
    }
  })

  test('Reason: only_card_of_strongest_color', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 10, CardSuit.DIAMONDS), // Seule neutre rouge
      createPlayedCard(2, 14, CardSuit.CLUBS), // Neutre noir
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.reason.type, 'only_card_of_strongest_color')
  })

  test('Reason: highest_value_among_color', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 7, CardSuit.DIAMONDS),
      createPlayedCard(2, 12, CardSuit.DIAMONDS),
      createPlayedCard(3, 14, CardSuit.CLUBS),
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    assert.equal(result.reason.type, 'highest_value_among_color')
    if (result.reason.type === 'highest_value_among_color') {
      assert.equal(result.reason.suit, CardSuit.DIAMONDS)
      assert.equal(result.reason.value, 12)
    }
  })

  test('Cas complexe: 4 joueurs, mix de couleurs et valeurs', ({ assert }) => {
    const cards: PlayedCard[] = [
      createPlayedCard(1, 10, CardSuit.HEARTS), // Forte
      createPlayedCard(2, 14, CardSuit.HEARTS), // Forte (As)
      createPlayedCard(3, 14, CardSuit.DIAMONDS), // Neutre rouge (As)
      createPlayedCard(4, 14, CardSuit.SPADES), // Faible (As)
    ]

    const result = CardComparisonService.findTrickWinner(cards, CardSuit.HEARTS)

    // L'As forte bat toutes les autres
    assert.equal(result.winnerCard.playerId, 2)
    assert.equal(result.winnerCard.value, 14)
    assert.equal(result.winnerCard.suit, CardSuit.HEARTS)
  })
})
