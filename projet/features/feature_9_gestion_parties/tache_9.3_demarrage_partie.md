# Tâche 9.3 : Démarrage de la partie

## Séquence de démarrage
1. Vérifier que tous sont prêts (ou hôte force)
2. Verrouiller la partie (plus de nouveaux joueurs)
3. Initialiser la première manche
4. Transition du lobby vers le jeu

## Backend
```typescript
async startGame(gameId: string, hostId: string) {
  const game = await Game.find(gameId)

  // Vérifications
  if (game.hostId !== hostId) throw new Error('Not host')
  if (game.status !== 'waiting') throw new Error('Already started')

  // Démarrer
  game.status = 'in_progress'
  await game.save()

  // Première manche
  await roundService.startNewRound(gameId)

  this.broadcast('game:started', { gameId })
}
```
