# Tâche 9.1 : Création de partie

## Configuration
- Nombre de joueurs (2-4)
- Score cible (50, 100, 150 points)
- Nombre d'IA (0 à nombre_joueurs-1)
- Difficulté IA (facile, moyen, difficile)
- Nom de la partie
- Partie privée/publique

## Backend
```typescript
async createGame(config: GameConfig): Promise<Game> {
  const game = await Game.create({
    hostId: config.hostId,
    name: config.name,
    maxPlayers: config.maxPlayers,
    targetScore: config.targetScore,
    isPrivate: config.isPrivate,
    status: 'waiting'
  })

  // Ajouter le host comme premier joueur
  await GamePlayer.create({ gameId: game.id, userId: config.hostId })

  // Ajouter les IA si configurées
  if (config.aiCount > 0) {
    await this.addAIPlayers(game.id, config.aiCount, config.aiDifficulty)
  }

  return game
}
```

## Frontend
```typescript
@Component({
  template: `
    <form [formGroup]="gameForm" (submit)="createGame()">
      <input formControlName="name" placeholder="Nom de la partie">

      <select formControlName="maxPlayers">
        <option value="2">2 joueurs</option>
        <option value="3">3 joueurs</option>
        <option value="4">4 joueurs</option>
      </select>

      <select formControlName="targetScore">
        <option value="50">50 points</option>
        <option value="100">100 points</option>
        <option value="150">150 points</option>
      </select>

      <input type="number" formControlName="aiCount" min="0" max="5">

      <button type="submit">Créer la partie</button>
    </form>
  `
})
```
