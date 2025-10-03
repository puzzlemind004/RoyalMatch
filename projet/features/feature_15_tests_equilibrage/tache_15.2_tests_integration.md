# Tâche 15.2 : Tests d'intégration (tours, manches, parties)

## Test d'un tour complet
```typescript
describe('Turn Flow', () => {
  it('should complete a full turn', async () => {
    const game = await createTestGame(4)
    const turn = await turnService.startTurn(game.id, 1)

    // Tous les joueurs jouent une carte
    await Promise.all(game.players.map(p =>
      turnService.playCard(p.id, turn.id, p.hand[0], false)
    ))

    // Vérifier la révélation
    const revealed = await turnService.revealCards(turn.id)
    expect(revealed.cards.size).toBe(4)

    // Vérifier le gagnant
    const result = await turnService.determineTrickWinner(turn.id)
    expect(result.winnerId).toBeDefined()
  })
})
```

## Test d'une manche complète
```typescript
describe('Round Flow', () => {
  it('should complete a full round', async () => {
    const game = await createTestGame(2)
    const round = await roundService.startRound(game.id)

    // Simuler 13 tours
    for (let i = 1; i <= 13; i++) {
      await playCompleteTurn(round.id, i)
    }

    // Vérifier le calcul des scores
    const scores = await scoringService.calculateRoundScores(round.id)
    expect(scores.size).toBe(2)
  })
})
```

## Test d'une partie complète
```typescript
describe('Game Flow', () => {
  it('should complete a full game', async () => {
    const game = await gameService.createGame({
      targetScore: 50,
      maxPlayers: 2
    })

    // Jouer jusqu'à victoire
    let winner = null
    let safetyCounter = 0

    while (!winner && safetyCounter++ < 100) {
      await roundService.playRound(game.id)
      winner = await gameService.checkVictory(game.id)
    }

    expect(winner).toBeDefined()
    expect(winner.totalScore).toBeGreaterThanOrEqual(50)
  })
})
```
