# Tâche 6.2 : Distribution de 13 cartes par joueur

## Logique
- Créer un deck de 52 cartes
- Mélanger avec crypto.randomBytes (sécurisé)
- Distribuer 13 cartes à chaque joueur (2-4 joueurs max)
- Sauvegarder l'attribution en BDD

## Backend
```typescript
distributeCards(players: Player[]): Map<string, Card[]> {
  const deck = this.createStandardDeck()
  this.shuffleDeck(deck)

  const distribution = new Map()
  let index = 0

  for (const player of players) {
    const playerCards = deck.slice(index, index + 13)
    distribution.set(player.id, playerCards)
    index += 13
  }

  return distribution
}
```
