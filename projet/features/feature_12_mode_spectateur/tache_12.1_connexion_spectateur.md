# Tâche 12.1 : Système de connexion spectateur

## Fonctionnalités
- Rejoindre une partie en cours en tant que spectateur
- Pas de limite de spectateurs
- Possibilité de quitter à tout moment
- Liste des parties observables

## Backend
```typescript
class SpectatorService {
  async joinAsSpectator(userId: string, gameId: string) {
    const game = await Game.find(gameId)
    if (game.status !== 'in_progress') {
      throw new Error('Game not in progress')
    }

    await Spectator.create({ userId, gameId })

    // Ajouter à la room spectateur
    socket.join(`spectator:${gameId}`)

    // Envoyer l'état actuel
    await this.sendCurrentState(userId, gameId)
  }
}
```
