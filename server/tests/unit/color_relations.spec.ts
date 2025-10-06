/**
 * Color Relations Unit Tests
 *
 * Tests for color opposition and relationship logic
 */

import { test } from '@japa/runner'
import { CardSuit } from '#types/card'
import {
  getOppositeColor,
  areOpposites,
  getColorType,
  COLOR_OPPOSITES,
  COLOR_TYPE,
} from '#constants/color_relations'

test.group('Color Relations - Oppositions', () => {
  test('Les oppositions sont cohérentes', ({ assert }) => {
    assert.equal(getOppositeColor(CardSuit.HEARTS), CardSuit.SPADES)
    assert.equal(getOppositeColor(CardSuit.CLUBS), CardSuit.DIAMONDS)
    assert.equal(getOppositeColor(CardSuit.DIAMONDS), CardSuit.CLUBS)
    assert.equal(getOppositeColor(CardSuit.SPADES), CardSuit.HEARTS)
  })

  test('Les oppositions sont symétriques', ({ assert }) => {
    // Hearts ↔ Spades
    assert.equal(getOppositeColor(CardSuit.HEARTS), CardSuit.SPADES)
    assert.equal(getOppositeColor(CardSuit.SPADES), CardSuit.HEARTS)

    // Diamonds ↔ Clubs
    assert.equal(getOppositeColor(CardSuit.DIAMONDS), CardSuit.CLUBS)
    assert.equal(getOppositeColor(CardSuit.CLUBS), CardSuit.DIAMONDS)
  })

  test('Les opposées sont de couleur différente (rouge/noir)', ({ assert }) => {
    // Hearts (red) vs Spades (black)
    assert.equal(getColorType(CardSuit.HEARTS), 'red')
    assert.equal(getColorType(getOppositeColor(CardSuit.HEARTS)), 'black')

    // Diamonds (red) vs Clubs (black)
    assert.equal(getColorType(CardSuit.DIAMONDS), 'red')
    assert.equal(getColorType(getOppositeColor(CardSuit.DIAMONDS)), 'black')

    // Clubs (black) vs Diamonds (red)
    assert.equal(getColorType(CardSuit.CLUBS), 'black')
    assert.equal(getColorType(getOppositeColor(CardSuit.CLUBS)), 'red')

    // Spades (black) vs Hearts (red)
    assert.equal(getColorType(CardSuit.SPADES), 'black')
    assert.equal(getColorType(getOppositeColor(CardSuit.SPADES)), 'red')
  })

  test('areOpposites retourne true pour les paires opposées', ({ assert }) => {
    assert.isTrue(areOpposites(CardSuit.HEARTS, CardSuit.SPADES))
    assert.isTrue(areOpposites(CardSuit.SPADES, CardSuit.HEARTS))
    assert.isTrue(areOpposites(CardSuit.DIAMONDS, CardSuit.CLUBS))
    assert.isTrue(areOpposites(CardSuit.CLUBS, CardSuit.DIAMONDS))
  })

  test('areOpposites retourne false pour les paires non opposées', ({ assert }) => {
    assert.isFalse(areOpposites(CardSuit.HEARTS, CardSuit.DIAMONDS))
    assert.isFalse(areOpposites(CardSuit.HEARTS, CardSuit.CLUBS))
    assert.isFalse(areOpposites(CardSuit.SPADES, CardSuit.CLUBS))
    assert.isFalse(areOpposites(CardSuit.SPADES, CardSuit.DIAMONDS))
  })

  test('areOpposites retourne false pour une couleur avec elle-même', ({ assert }) => {
    assert.isFalse(areOpposites(CardSuit.HEARTS, CardSuit.HEARTS))
    assert.isFalse(areOpposites(CardSuit.DIAMONDS, CardSuit.DIAMONDS))
    assert.isFalse(areOpposites(CardSuit.CLUBS, CardSuit.CLUBS))
    assert.isFalse(areOpposites(CardSuit.SPADES, CardSuit.SPADES))
  })
})

test.group('Color Relations - Color Types', () => {
  test('Les couleurs rouges sont correctement identifiées', ({ assert }) => {
    assert.equal(getColorType(CardSuit.HEARTS), 'red')
    assert.equal(getColorType(CardSuit.DIAMONDS), 'red')
  })

  test('Les couleurs noires sont correctement identifiées', ({ assert }) => {
    assert.equal(getColorType(CardSuit.CLUBS), 'black')
    assert.equal(getColorType(CardSuit.SPADES), 'black')
  })

  test('Toutes les couleurs ont un type défini', ({ assert }) => {
    const allSuits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES]

    for (const suit of allSuits) {
      const colorType = getColorType(suit)
      assert.oneOf(colorType, ['red', 'black'])
    }
  })

  test('Il y a exactement 2 couleurs rouges et 2 couleurs noires', ({ assert }) => {
    const redSuits = Object.entries(COLOR_TYPE).filter(([_, type]) => type === 'red')
    const blackSuits = Object.entries(COLOR_TYPE).filter(([_, type]) => type === 'black')

    assert.equal(redSuits.length, 2)
    assert.equal(blackSuits.length, 2)
  })
})

test.group('Color Relations - Constants Integrity', () => {
  test('COLOR_OPPOSITES contient toutes les couleurs', ({ assert }) => {
    const allSuits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES]

    for (const suit of allSuits) {
      assert.property(COLOR_OPPOSITES, suit)
    }
  })

  test('COLOR_TYPE contient toutes les couleurs', ({ assert }) => {
    const allSuits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES]

    for (const suit of allSuits) {
      assert.property(COLOR_TYPE, suit)
    }
  })

  test('Les oppositions forment des paires bidirectionnelles', ({ assert }) => {
    // Si A est l'opposé de B, alors B doit être l'opposé de A
    for (const [suit, opposite] of Object.entries(COLOR_OPPOSITES)) {
      const oppositeOfOpposite = COLOR_OPPOSITES[opposite as CardSuit]
      assert.equal(oppositeOfOpposite, suit)
    }
  })

  test("Aucune couleur n'est son propre opposé", ({ assert }) => {
    for (const [suit, opposite] of Object.entries(COLOR_OPPOSITES)) {
      assert.notEqual(suit, opposite)
    }
  })
})
