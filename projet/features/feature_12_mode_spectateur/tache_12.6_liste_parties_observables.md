# Tâche 12.6 : Liste des parties observables

## Interface
- Liste de toutes les parties en cours
- Filtres (nombre de joueurs, IA ou non)
- Nombre de spectateurs actuels
- Clic pour rejoindre

## Backend
```typescript
async getObservableGames(): Promise<GameListing[]> {
  const games = await Game.query()
    .where('status', 'in_progress')
    .where('is_private', false)
    .preload('players')
    .preload('spectators')

  return games.map(game => ({
    id: game.id,
    name: game.name,
    playerCount: game.players.length,
    spectatorCount: game.spectators.length,
    currentRound: game.currentRound,
    leadingPlayer: this.getLeadingPlayer(game)
  }))
}
```

## Frontend
```typescript
@Component({
  template: `
    <div class="spectator-lobby">
      <h2>Parties en cours</h2>

      @for (game of games(); track game.id) {
        <div class="game-card" (click)="spectate(game.id)">
          <h3>{{ game.name }}</h3>
          <p>{{ game.playerCount }} joueurs</p>
          <p>👁️ {{ game.spectatorCount }} spectateurs</p>
          <p>Manche {{ game.currentRound }}</p>
          <p>En tête: {{ game.leadingPlayer }}</p>
        </div>
      }
    </div>
  `
})
```
