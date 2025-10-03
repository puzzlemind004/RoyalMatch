# Tâche 10.4 : Système anti-triche (validation serveur)

## Principes Zero-Trust
1. Le client ne sait JAMAIS ce qu'il ne devrait pas savoir
2. Toutes les actions sont validées côté serveur
3. Les données sensibles ne transitent jamais par le client

## Implémentation
```typescript
class AntiCheatService {
  // Ne jamais envoyer les cartes des autres au client
  async getVisibleGameState(playerId: string, gameId: string) {
    const state = await this.getGameState(gameId)

    return {
      ...state,
      players: state.players.map(p => ({
        id: p.id,
        name: p.name,
        score: p.score,
        handCount: p.hand.length, // Juste le nombre, pas les cartes
        deckCount: p.deck.length,
        // PAS p.hand ni p.deck pour les adversaires
        ...(p.id === playerId ? { hand: p.hand, deck: p.deck } : {})
      }))
    }
  }

  // Valider chaque action
  async validateAction(playerId: string, action: PlayerAction): Promise<boolean> {
    // Le joueur possède-t-il cette carte ?
    const hasCard = await this.playerHasCard(playerId, action.card)
    if (!hasCard) {
      await this.logCheatAttempt(playerId, 'card_not_owned')
      return false
    }

    // Est-ce son tour ?
    const isTurn = await this.isPlayerTurn(playerId)
    if (!isTurn) {
      await this.logCheatAttempt(playerId, 'not_turn')
      return false
    }

    return true
  }
}
```
