# Tâche 6.1 : Initialisation de la manche

## Étapes
1. Lancer la roulette des couleurs
2. Créer le round en BDD
3. Distribuer les objectifs (3 par joueur)
4. Créer et mélanger le deck (52 cartes)
5. Distribuer 13 cartes par joueur
6. Attendre la sélection des 5 cartes de départ
7. Démarrer le premier tour

## Backend
```typescript
async startNewRound(gameId: string) {
  // 1. Roulette
  const dominantColor = colorRouletteService.spinRoulette()

  // 2. Créer round
  const round = await Round.create({ gameId, dominantColor, ... })

  // 3. Objectifs
  await objectiveService.distributeObjectives(round.id)

  // 4-5. Cartes
  const deck = deckService.createAndShuffle()
  await deckService.distributeCards(round.id, deck)

  // 6. Notifier les joueurs
  this.broadcast('round:started', { round, dominantColor })
}
```
