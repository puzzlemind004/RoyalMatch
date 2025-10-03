# Tâche 10.2 : Synchronisation temps réel (WebSocket)

## Événements critiques
- `turn:started` - Nouveau tour
- `card:played` - Carte jouée (masquée aux autres)
- `cards:revealed` - Révélation simultanée
- `trick:won` - Résultat du pli
- `effect:triggered` - Effet activé
- `round:ended` - Fin de manche
- `game:ended` - Fin de partie

## Gestion de la latence
- Horodatage serveur pour toutes les actions
- Compensation côté client
- Buffer de synchronisation
- Détection de désync et resync automatique

## Backend
```typescript
class SyncService {
  async syncGameState(playerId: string, gameId: string) {
    const state = await this.buildGameState(gameId, playerId)
    this.sendToPlayer(playerId, 'state:sync', state)
  }

  private async buildGameState(gameId: string, playerId: string) {
    return {
      game: await Game.find(gameId),
      currentRound: await this.getCurrentRound(gameId),
      playerHand: await this.getPlayerHand(playerId),
      playerDeck: await this.getPlayerDeckCount(playerId),
      scores: await this.getScores(gameId),
      currentTurn: await this.getCurrentTurn(gameId)
    }
  }
}
```
