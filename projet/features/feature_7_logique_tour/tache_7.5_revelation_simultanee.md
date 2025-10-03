# Tâche 7.5 : Révélation simultanée des cartes

## Logique
- Tous les joueurs choisissent leur carte en secret
- Les choix sont envoyés au serveur
- Quand tous ont joué : révélation simultanée
- Animation de retournement des cartes
- Affichage côte à côte des cartes jouées

## Backend
```typescript
class TurnService {
  private playedCards = new Map<string, { card: Card, effect: boolean }>()

  async playCard(playerId: string, turnId: string, card: Card, activateEffect: boolean) {
    this.playedCards.set(playerId, { card, activateEffect })

    if (this.allPlayersPlayed(turnId)) {
      await this.revealAllCards(turnId)
    }
  }

  private async revealAllCards(turnId: string) {
    this.broadcast('cards:revealed', {
      turnId,
      cards: Array.from(this.playedCards.entries())
    })

    await this.determineTrickWinner(turnId)
  }
}
```

## Frontend Animation
```typescript
async revealCards(cards: Map<string, Card>) {
  for (const [playerId, card] of cards) {
    await this.animateCardReveal(playerId, card)
    await this.delay(300) // Stagger l'animation
  }
}
```
