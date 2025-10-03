# Tâche 7.6 : Détermination du gagnant du pli

## Utilisation du service de comparaison
- Appeler CardComparisonService.findWinner()
- Tenir compte de la couleur dominante
- Enregistrer le gagnant en BDD
- Attribuer le pli au gagnant
- Mettre à jour les stats (tricks won)
- Notifier tous les joueurs

## Backend
```typescript
async determineTrickWinner(turnId: string) {
  const turn = await Turn.find(turnId)
  const round = await Round.find(turn.roundId)
  const playedCards = await this.getPlayedCards(turnId)

  const result = cardComparisonService.resolveTrick(
    playedCards,
    round.dominantColor
  )

  turn.winnerId = result.winnerId
  await turn.save()

  this.broadcast('trick:won', {
    turnId,
    winnerId: result.winnerId,
    winningCard: result.winningCard,
    reason: result.reason
  })
}
```
