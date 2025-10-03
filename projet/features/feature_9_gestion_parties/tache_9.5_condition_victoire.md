# Tâche 9.5 : Condition de victoire

## Règle
- Premier joueur à atteindre le score cible gagne
- Vérification à la fin de chaque manche
- Si égalité : manche supplémentaire (sudden death)

## Backend
```typescript
async checkVictoryCondition(gameId: string) {
  const game = await Game.find(gameId)
  const players = await GamePlayer.query()
    .where('game_id', gameId)
    .orderBy('total_score', 'desc')

  const topScore = players[0].totalScore

  if (topScore >= game.targetScore) {
    // Vérifier égalité
    const winners = players.filter(p => p.totalScore === topScore)

    if (winners.length === 1) {
      return winners[0]
    } else {
      // Sudden death
      await this.startSuddenDeathRound(gameId, winners)
      return null
    }
  }

  return null
}
```
