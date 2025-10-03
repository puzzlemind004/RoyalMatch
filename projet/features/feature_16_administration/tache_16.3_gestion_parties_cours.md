# Tâche 16.3 : Gestion des parties en cours

## Dashboard admin
```typescript
@Component({
  template: `
    <div class="games-dashboard">
      <h2>Parties en cours ({{ activeGames().length }})</h2>

      @for (game of activeGames(); track game.id) {
        <div class="game-card">
          <h3>{{ game.name }}</h3>
          <p>Joueurs: {{ game.playerCount }} / {{ game.maxPlayers }}</p>
          <p>Manche: {{ game.currentRound }}</p>
          <p>Durée: {{ game.duration | duration }}</p>

          <div class="actions">
            <button (click)="viewGame(game.id)">Voir</button>
            <button (click)="endGame(game.id)" class="danger">
              Terminer la partie
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class GamesDashboardComponent {
  private adminService = inject(AdminService)

  activeGames = signal<Game[]>([])

  ngOnInit() {
    this.loadActiveGames()
    this.setupAutoRefresh()
  }

  async loadActiveGames() {
    const games = await this.adminService.getActiveGames()
    this.activeGames.set(games)
  }

  async endGame(gameId: string) {
    if (confirm('Êtes-vous sûr de vouloir terminer cette partie ?')) {
      await this.adminService.forceEndGame(gameId)
      this.loadActiveGames()
    }
  }
}
```
