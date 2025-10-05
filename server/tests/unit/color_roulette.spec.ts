/**
 * Color Roulette Service Unit Tests
 * Tests random color selection and hierarchy determination
 */

import { test } from '@japa/runner'
import ColorRouletteService from '#services/color_roulette_service'
import { CardSuit } from '#types/card'

test.group('Color Roulette Service', (group) => {
  let service: ColorRouletteService

  group.each.setup(() => {
    service = new ColorRouletteService()
  })

  test('should select a valid card suit', ({ assert }) => {
    const result = service.spinRoulette()

    assert.oneOf(result, [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES])
  })

  test('should have fair distribution over many spins', ({ assert }) => {
    const results = {
      [CardSuit.HEARTS]: 0,
      [CardSuit.DIAMONDS]: 0,
      [CardSuit.CLUBS]: 0,
      [CardSuit.SPADES]: 0,
    }

    const iterations = 10000

    for (let i = 0; i < iterations; i++) {
      const result = service.spinRoulette()
      results[result]++
    }

    // Each color should appear approximately 25% of the time
    // With acceptable margin of error (23-27%)
    const minExpected = iterations * 0.23
    const maxExpected = iterations * 0.27

    assert.isAtLeast(results[CardSuit.HEARTS], minExpected)
    assert.isAtMost(results[CardSuit.HEARTS], maxExpected)

    assert.isAtLeast(results[CardSuit.DIAMONDS], minExpected)
    assert.isAtMost(results[CardSuit.DIAMONDS], maxExpected)

    assert.isAtLeast(results[CardSuit.CLUBS], minExpected)
    assert.isAtMost(results[CardSuit.CLUBS], maxExpected)

    assert.isAtLeast(results[CardSuit.SPADES], minExpected)
    assert.isAtMost(results[CardSuit.SPADES], maxExpected)
  })

  test('should return correct weak color for hearts', ({ assert }) => {
    const weakColor = service.getWeakColor(CardSuit.HEARTS)
    assert.equal(weakColor, CardSuit.SPADES)
  })

  test('should return correct weak color for spades', ({ assert }) => {
    const weakColor = service.getWeakColor(CardSuit.SPADES)
    assert.equal(weakColor, CardSuit.HEARTS)
  })

  test('should return correct weak color for diamonds', ({ assert }) => {
    const weakColor = service.getWeakColor(CardSuit.DIAMONDS)
    assert.equal(weakColor, CardSuit.CLUBS)
  })

  test('should return correct weak color for clubs', ({ assert }) => {
    const weakColor = service.getWeakColor(CardSuit.CLUBS)
    assert.equal(weakColor, CardSuit.DIAMONDS)
  })

  test('should return correct neutral colors for hearts', ({ assert }) => {
    const neutralColors = service.getNeutralColors(CardSuit.HEARTS)
    assert.lengthOf(neutralColors, 2)
    assert.includeMembers(neutralColors, [CardSuit.DIAMONDS, CardSuit.CLUBS])
  })

  test('should return correct neutral colors for diamonds', ({ assert }) => {
    const neutralColors = service.getNeutralColors(CardSuit.DIAMONDS)
    assert.lengthOf(neutralColors, 2)
    assert.includeMembers(neutralColors, [CardSuit.HEARTS, CardSuit.SPADES])
  })

  test('should return complete color hierarchy', ({ assert }) => {
    const hierarchy = service.getColorHierarchy(CardSuit.HEARTS)

    assert.equal(hierarchy.dominant, CardSuit.HEARTS)
    assert.equal(hierarchy.weak, CardSuit.SPADES)
    assert.lengthOf(hierarchy.neutrals, 2)
    assert.includeMembers(hierarchy.neutrals, [CardSuit.DIAMONDS, CardSuit.CLUBS])
  })

  test('should not include dominant or weak in neutrals', ({ assert }) => {
    const dominantColor = CardSuit.CLUBS
    const weakColor = service.getWeakColor(dominantColor)
    const neutralColors = service.getNeutralColors(dominantColor)

    assert.notInclude(neutralColors, dominantColor)
    assert.notInclude(neutralColors, weakColor)
  })

  test('should generate different results on multiple spins', ({ assert }) => {
    const results = new Set<CardSuit>()

    // Run 100 times to be almost certain we get at least 2 different results
    for (let i = 0; i < 100; i++) {
      results.add(service.spinRoulette())
    }

    // With 100 random selections, we should get at least 2 different colors
    assert.isAtLeast(results.size, 2)
  })
})
