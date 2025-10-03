# Tâche 13.4 : Interface de jeu principale

## Layout complet
```typescript
@Component({
  selector: 'app-game-board',
  template: `
    <div class="game-board h-screen flex flex-col">
      <!-- Header -->
      <div class="game-header bg-gray-800 text-white p-4 flex justify-between">
        <div class="game-info">
          <h2>{{ game().name }}</h2>
          <p>Manche {{ currentRound() }} / Score cible: {{ game().targetScore }}</p>
        </div>

        <div class="color-hierarchy">
          <app-color-hierarchy [dominantColor]="dominantColor()" />
        </div>

        <div class="timer">
          <app-turn-timer [remaining]="timeRemaining()" />
        </div>
      </div>

      <!-- Scores -->
      <div class="scores-bar bg-gray-700 text-white p-2 flex justify-around">
        @for (player of players(); track player.id) {
          <div class="player-score" [class.current]="player.id === currentPlayerId()">
            <span class="name">{{ player.name }}</span>
            <span class="score">{{ player.totalScore }} pts</span>
            <span class="tricks">{{ player.tricksWon }} plis</span>
          </div>
        }
      </div>

      <!-- Plateau de jeu -->
      <div class="game-area flex-1 relative">
        <!-- Adversaires -->
        <div class="opponents-area">
          @for (opponent of opponents(); track opponent.id) {
            <app-opponent-display
              [player]="opponent"
              [position]="getPosition(opponent)"
            />
          }
        </div>

        <!-- Zone centrale (cartes jouées) -->
        <div class="center-area absolute inset-0 flex items-center justify-center">
          @if (currentTurn()) {
            <app-played-cards [cards]="currentTurn()!.playedCards" />
          }
        </div>

        <!-- Main du joueur -->
        <div class="player-hand absolute bottom-0 left-0 right-0 p-4">
          <app-player-hand
            [hand]="playerHand()"
            [selectedCard]="selectedCard()"
            (cardSelected)="onCardSelected($event)"
          />
        </div>
      </div>

      <!-- Sidebar (objectifs, effets) -->
      <div class="sidebar absolute right-0 top-0 bottom-0 w-64 bg-gray-800 p-4">
        <app-objectives-panel [objectives]="playerObjectives()" />
        <app-effects-queue [effects]="queuedEffects()" />
      </div>

      <!-- Actions -->
      <div class="actions-bar bg-gray-800 p-4 flex justify-between items-center">
        @if (selectedCard()) {
          <div class="effect-toggle">
            <label class="text-white">
              <input
                type="checkbox"
                [(ngModel)]="activateEffect"
              />
              Activer l'effet
            </label>
          </div>

          <button
            class="btn-primary"
            (click)="playCard()"
          >
            Jouer cette carte
          </button>
        }
      </div>
    </div>
  `
})
```
