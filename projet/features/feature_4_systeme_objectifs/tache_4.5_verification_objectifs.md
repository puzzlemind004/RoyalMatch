# Tâche 4.5 : Système de vérification des objectifs en fin de manche

## Objectif
Vérifier automatiquement quels objectifs ont été remplis et calculer les scores.

## Backend
```typescript
// app/Services/ObjectiveVerificationService.ts
class ObjectiveVerificationService {
  async verifyObjectives(roundId: string): Promise<Map<string, ObjectiveResult[]>> {
    const round = await Round.find(roundId)
    const players = await this.getPlayersWithObjectives(roundId)
    const results = new Map()

    for (const player of players) {
      const playerState = await this.buildPlayerState(player, roundId)
      const objectiveResults = player.objectives.map(objective => ({
        objective,
        completed: objective.checkCompletion(playerState),
        points: objective.checkCompletion(playerState) ? objective.points : 0
      }))

      results.set(player.id, objectiveResults)
    }

    return results
  }

  private async buildPlayerState(player: Player, roundId: string): PlayerRoundState {
    const tricks = await this.getPlayerTricks(player.id, roundId)
    const cardsWon = await this.getCardsWon(player.id, roundId)
    const cardsPlayed = await this.getCardsPlayed(player.id, roundId)

    return {
      playerId: player.id,
      tricksWon: tricks.length,
      cardsWon,
      cardsPlayed,
      // ... autres stats
    }
  }
}
```

## Résultat attendu
- Vérification automatique et précise
- Logs détaillés pour debug
- Attribution des points correcte
