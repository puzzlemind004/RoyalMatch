# Tâche 6.6 : Calcul des scores en fin de manche

## Étapes
1. Vérifier les objectifs de chaque joueur
2. Calculer les points par objectif rempli
3. Appliquer les bonus (tous objectifs remplis = +5 pts)
4. Mettre à jour le score total de chaque joueur
5. Vérifier si un joueur a atteint le score cible
6. Afficher le classement de la manche
7. Soit nouvelle manche, soit fin de partie

## Backend
```typescript
async endRound(roundId: string) {
  const scores = await scoringService.calculateAllScores(roundId)

  for (const [playerId, score] of scores) {
    await this.updatePlayerTotalScore(playerId, score)
  }

  const winner = await this.checkVictoryCondition(roundId)

  if (winner) {
    await this.endGame(roundId, winner)
  } else {
    await this.prepareNextRound(roundId)
  }
}
```
