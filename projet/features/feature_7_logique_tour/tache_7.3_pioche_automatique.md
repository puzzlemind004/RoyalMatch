# Tâche 7.3 : Pioche automatique d'1 carte

## Fonctionnement
- Au début du tour, chaque joueur pioche 1 carte de son deck
- Si deck vide : pas de pioche
- Animation de pioche
- Mise à jour de la main du joueur
- Notification WebSocket

## Backend
```typescript
async drawPhase(turnId: string) {
  const players = await this.getActivePlayers(turnId)

  for (const player of players) {
    const card = await deckService.drawCard(player.id)

    if (card) {
      await this.addToHand(player.id, card)
      this.sendToPlayer(player.id, 'card:drawn', { card })
    }
  }
}
```
