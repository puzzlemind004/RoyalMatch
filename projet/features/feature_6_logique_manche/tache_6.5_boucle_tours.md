# Tâche 6.5 : Boucle de tours jusqu'à épuisement

## Logique
- Une manche = 13 tours (si 13 cartes distribuées)
- Chaque tour : tous les joueurs jouent 1 carte
- Entre les tours : résolution des effets, pioche
- Fin quand tous les joueurs ont épuisé main + deck

## Backend
```typescript
async runRoundLoop(roundId: string) {
  const round = await Round.find(roundId)
  const turnCount = 13

  for (let i = 1; i <= turnCount; i++) {
    const turn = await this.startTurn(roundId, i)
    await this.waitForAllPlayers(turn.id)
    await this.resolveTurn(turn.id)
    await this.applyEffects(turn.id)
  }

  await this.endRound(roundId)
}
```
