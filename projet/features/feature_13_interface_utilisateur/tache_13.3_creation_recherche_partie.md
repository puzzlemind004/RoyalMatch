# Tâche 13.3 : Écran de création/recherche de partie

## Deux modes
1. **Créer une partie** : Formulaire de config
2. **Rejoindre une partie** : Liste des parties disponibles

## Frontend
```typescript
@Component({
  template: `
    <div class="lobby-screen p-8">
      <div class="tabs mb-8">
        <button
          [class.active]="activeTab() === 'create'"
          (click)="activeTab.set('create')"
        >
          Créer une partie
        </button>
        <button
          [class.active]="activeTab() === 'join'"
          (click)="activeTab.set('join')"
        >
          Rejoindre une partie
        </button>
      </div>

      @if (activeTab() === 'create') {
        <app-create-game-form (gameCreated)="onGameCreated($event)" />
      } @else {
        <app-available-games-list (gameJoined)="onGameJoined($event)" />
      }
    </div>
  `
})
```

## Composant CreateGameForm
```typescript
@Component({
  template: `
    <form [formGroup]="form" (submit)="submit()" class="max-w-md mx-auto">
      <div class="mb-4">
        <label>Nom de la partie</label>
        <input
          formControlName="name"
          class="input-field"
          placeholder="Ma super partie"
        />
      </div>

      <div class="mb-4">
        <label>Nombre de joueurs</label>
        <select formControlName="maxPlayers" class="input-field">
          @for (n of [2,3,4]; track n) {
            <option [value]="n">{{ n }} joueurs</option>
          }
        </select>
      </div>

      <div class="mb-4">
        <label>Score cible</label>
        <select formControlName="targetScore" class="input-field">
          @for (score of [50, 100, 150]; track score) {
            <option [value]="score">{{ score }} points</option>
          }
        </select>
      </div>

      <div class="mb-4">
        <label>Nombre d'IA</label>
        <input
          type="number"
          formControlName="aiCount"
          min="0"
          [max]="maxPlayers() - 1"
          class="input-field"
        />
      </div>

      <button type="submit" class="btn-primary w-full">
        Créer la partie
      </button>
    </form>
  `
})
```
