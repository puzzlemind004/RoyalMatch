# Tâche 12.3 : Interface spectateur temps réel

## Layout
- Vue d'ensemble de la table
- Tous les joueurs visibles
- Cartes jouées au centre
- Tableau des scores
- Timeline des événements
- Badge "SPECTATEUR" visible

## Frontend
```typescript
@Component({
  selector: 'app-spectator-view',
  template: `
    <div class="spectator-mode">
      <div class="spectator-badge">👁️ Mode Spectateur</div>

      <div class="game-table">
        @for (player of players(); track player.id) {
          <div class="player-spot">
            <h3>{{ player.name }}</h3>
            <p>Score: {{ player.score }}</p>
            <p>{{ player.handCount }} cartes</p>
          </div>
        }

        <div class="center-area">
          @if (currentTurn()) {
            @for (card of currentTurn().playedCards; track card.id) {
              <app-card [card]="card" [faceUp]="true" />
            }
          }
        </div>
      </div>

      <div class="event-log">
        @for (event of events(); track event.id) {
          <div class="event">{{ event.message }}</div>
        }
      </div>
    </div>
  `
})
```
