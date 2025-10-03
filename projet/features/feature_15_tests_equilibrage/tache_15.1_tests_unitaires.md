# Tâche 15.1 : Tests unitaires (cartes, effets, règles)

## Tests des cartes
```typescript
// tests/unit/CardComparison.spec.ts
describe('CardComparison', () => {
  it('should compare cards by value', () => {
    const ace = { value: 'A', numericValue: 14, suit: 'hearts' }
    const two = { value: '2', numericValue: 2, suit: 'hearts' }

    expect(compareCards(ace, two, 'spades')).toBe(1)
  })

  it('should respect dominant color', () => {
    const sevenHearts = { value: '7', numericValue: 7, suit: 'hearts' }
    const sevenDiamonds = { value: '7', numericValue: 7, suit: 'diamonds' }

    expect(compareCards(sevenHearts, sevenDiamonds, 'hearts')).toBe(1)
  })

  it('should never have ties', () => {
    const allCards = generateAllPossibleCards()
    const dominantColors = ['hearts', 'diamonds', 'clubs', 'spades']

    for (const dominant of dominantColors) {
      for (let i = 0; i < allCards.length; i++) {
        for (let j = i + 1; j < allCards.length; j++) {
          const result = compareCards(allCards[i], allCards[j], dominant)
          expect(result).not.toBe(0)
        }
      }
    }
  })
})
```

## Tests des effets
```typescript
describe('EffectEngine', () => {
  it('should execute draw effect', async () => {
    const effect = { type: 'draw', power: 1 }
    const beforeCount = player.hand.length

    await effectEngine.execute(effect, player)

    expect(player.hand.length).toBe(beforeCount + 1)
  })

  it('should queue effects for next turn', async () => {
    const effect = { type: 'delayed', ...  }

    await effectEngine.queueEffect(effect, turn.id + 1)

    const queue = await effectEngine.getQueue(turn.id + 1)
    expect(queue).toContainEqual(effect)
  })
})
```

## Tests des objectifs
```typescript
describe('ObjectiveVerification', () => {
  it('should verify win exactly 3 tricks', () => {
    const objective = objectives.find(o => o.id === 'win_exactly_3')
    const playerState = { tricksWon: 3, ... }

    expect(objective.checkCompletion(playerState)).toBe(true)
  })

  it('should reject if not exact', () => {
    const objective = objectives.find(o => o.id === 'win_exactly_3')
    const playerState = { tricksWon: 4, ... }

    expect(objective.checkCompletion(playerState)).toBe(false)
  })
})
```
