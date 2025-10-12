import { test } from '@japa/runner'
import { MulliganService } from '#services/mulligan_service'
import DeckService from '#services/deck_service'

test.group('Mulligan Service', () => {
  test('should draw initial hand of 5 cards from 13 cards', ({ assert }) => {
    const allCards = DeckService.createStandardDeck().slice(0, 13)
    const { hand, deck } = MulliganService.drawInitialHand(allCards)

    assert.lengthOf(hand, 5)
    assert.lengthOf(deck, 8)
    assert.lengthOf([...hand, ...deck], 13)
  })

  test('should replace selected cards with new ones from deck', ({ assert }) => {
    const hand = DeckService.createStandardDeck().slice(0, 5)
    const deck = DeckService.createStandardDeck().slice(5, 13)
    const cardsToReplace = [hand[0]!.id, hand[2]!.id]

    const result = MulliganService.performMulligan(hand, deck, cardsToReplace)

    assert.lengthOf(result.newHand, 5)
    assert.equal(result.replacedCount, 2)
    assert.lengthOf(result.deck, 8)
  })

  test('should keep cards that are not selected for replacement', ({ assert }) => {
    const hand = DeckService.createStandardDeck().slice(0, 5)
    const deck = DeckService.createStandardDeck().slice(5, 13)
    const cardsToReplace = [hand[0]!.id]
    const keptCardIds = [hand[1]!.id, hand[2]!.id, hand[3]!.id, hand[4]!.id]

    const result = MulliganService.performMulligan(hand, deck, cardsToReplace)

    // Vérifier que les cartes non sélectionnées sont toujours dans la main
    for (const keptId of keptCardIds) {
      assert.isTrue(result.newHand.some((card) => card.id === keptId))
    }
  })

  test('should handle replacing all 5 cards', ({ assert }) => {
    const hand = DeckService.createStandardDeck().slice(0, 5)
    const deck = DeckService.createStandardDeck().slice(5, 13)
    const cardsToReplace = hand.map((card) => card.id)

    const result = MulliganService.performMulligan(hand, deck, cardsToReplace)

    assert.lengthOf(result.newHand, 5)
    assert.equal(result.replacedCount, 5)

    // Vérifier qu'aucune carte de la main originale n'est dans la nouvelle main
    const originalIds = new Set(hand.map((card) => card.id))
    for (const card of result.newHand) {
      assert.isFalse(originalIds.has(card.id))
    }
  })

  test('should handle replacing 0 cards (skip mulligan)', ({ assert }) => {
    const hand = DeckService.createStandardDeck().slice(0, 5)
    const deck = DeckService.createStandardDeck().slice(5, 13)
    const cardsToReplace: string[] = []

    const result = MulliganService.performMulligan(hand, deck, cardsToReplace)

    assert.lengthOf(result.newHand, 5)
    assert.equal(result.replacedCount, 0)
    assert.deepEqual(result.newHand, hand)
  })

  test('should throw error if trying to replace more than 5 cards', ({ assert }) => {
    const hand = DeckService.createStandardDeck().slice(0, 5)
    const deck = DeckService.createStandardDeck().slice(5, 13)
    const cardsToReplace = ['1', '2', '3', '4', '5', '6']

    assert.throws(
      () => MulliganService.performMulligan(hand, deck, cardsToReplace),
      'Impossible de remplacer plus de 5 cartes'
    )
  })

  test('should throw error if card to replace is not in hand', ({ assert }) => {
    const hand = DeckService.createStandardDeck().slice(0, 5)
    const deck = DeckService.createStandardDeck().slice(5, 13)
    const cardsToReplace = ['invalid-id']

    assert.throws(
      () => MulliganService.performMulligan(hand, deck, cardsToReplace),
      /non trouvée dans la main/
    )
  })

  test('should throw error if hand does not have exactly 5 cards', ({ assert }) => {
    const hand = DeckService.createStandardDeck().slice(0, 3)
    const deck = DeckService.createStandardDeck().slice(3, 13)

    assert.throws(
      () => MulliganService.performMulligan(hand, deck, []),
      'La main doit contenir exactement 5 cartes'
    )
  })

  test('should throw error if initial draw does not have 13 cards', ({ assert }) => {
    const allCards = DeckService.createStandardDeck().slice(0, 10)

    assert.throws(
      () => MulliganService.drawInitialHand(allCards),
      'Le joueur doit avoir exactement 13 cartes'
    )
  })
})
