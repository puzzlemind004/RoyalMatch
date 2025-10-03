# Tâche 12.2 : Flux de données spectateur

## Ce que voit le spectateur
- Cartes révélées (pas les mains cachées)
- Scores en temps réel
- Objectifs (sans savoir lesquels sont gardés par qui)
- Couleur dominante
- Résultat des plis
- Effets activés

## Ce qu'il NE voit PAS
- Mains des joueurs
- Cartes non révélées
- Choix d'objectifs avant révélation

## Backend
```typescript
getSpectatorGameState(gameId: string) {
  return {
    players: players.map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
      handCount: p.hand.length,
      // PAS la main elle-même
    })),
    currentTurn: {
      playedCards: revealedCards, // Seulement après révélation
      winner: winner
    },
    dominantColor: round.dominantColor
  }
}
```
