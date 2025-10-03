# Tâche 14.5 : Statistiques de partie

## Données trackées
```typescript
interface GameStatistics {
  totalRounds: number
  totalTurns: number
  duration: number
  perPlayer: Map<string, PlayerStatistics>
}

interface PlayerStatistics {
  tricksWon: number
  tricksLost: number
  objectivesCompleted: number
  objectivesTotal: number
  effectsActivated: number
  cardsPlayed: number
  averageCardValue: number
  strongestCard: Card
  mvpRounds: number // Manches où le joueur a marqué le plus
}
```

## Calcul MVP
```typescript
calculateMVP(game: Game): Player {
  const stats = this.getGameStatistics(game)

  let mvp = null
  let maxScore = -Infinity

  for (const [playerId, playerStats] of stats.perPlayer) {
    const score = this.calculateMVPScore(playerStats)
    if (score > maxScore) {
      maxScore = score
      mvp = playerId
    }
  }

  return mvp
}

private calculateMVPScore(stats: PlayerStatistics): number {
  return (
    stats.objectivesCompleted * 10 +
    stats.tricksWon * 2 +
    stats.effectsActivated * 1 +
    stats.mvpRounds * 5
  )
}
```
