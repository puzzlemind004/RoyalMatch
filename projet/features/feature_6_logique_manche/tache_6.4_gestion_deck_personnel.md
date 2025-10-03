# Tâche 6.4 : Gestion du deck personnel

## Fonctionnalités
- Stocker les 8 cartes restantes dans le deck du joueur
- Pioche automatique au début de chaque tour
- Mélanger le deck (certains effets)
- Regarder les prochaines cartes (certains effets)
- État du deck (nombre de cartes restantes)

## Backend
```typescript
class PlayerDeckService {
  async drawCard(playerId: string, roundId: string): Promise<Card | null> {
    const deck = await this.getPlayerDeck(playerId, roundId)
    if (deck.length === 0) return null

    const card = deck.shift()
    await this.updatePlayerDeck(playerId, roundId, deck)

    return card
  }

  async shuffleDeck(playerId: string, roundId: string) {
    const deck = await this.getPlayerDeck(playerId, roundId)
    this.shuffle(deck)
    await this.updatePlayerDeck(playerId, roundId, deck)
  }
}
```
