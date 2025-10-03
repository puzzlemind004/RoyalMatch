# Tâche 16.4 : Configuration des paramètres du jeu

## Paramètres ajustables
```typescript
interface GameConfig {
  // Durée
  turnDuration: number // Secondes
  objectiveSelectionDuration: number
  handSelectionDuration: number

  // Points
  targetScoreOptions: number[]
  objectiveBonusMultiplier: number

  // Limites
  maxPlayersPerGame: number
  maxSpectators: number

  // Features
  chatEnabled: boolean
  spectatorModeEnabled: boolean
  aiEnabled: boolean
}

// Table config en BDD
class ConfigService {
  private cache = new Map<string, any>()

  async get(key: string): Promise<any> {
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    const config = await Config.findBy('key', key)
    this.cache.set(key, config.value)
    return config.value
  }

  async set(key: string, value: any) {
    await Config.updateOrCreate({ key }, { value })
    this.cache.set(key, value)
  }
}
```

## Interface admin
```typescript
@Component({
  template: `
    <form [formGroup]="configForm" (submit)="save()">
      <h3>Durées</h3>
      <label>
        Durée d'un tour (secondes)
        <input type="number" formControlName="turnDuration">
      </label>

      <h3>Points</h3>
      <label>
        Multiplicateur de bonus
        <input type="number" step="0.1" formControlName="objectiveBonusMultiplier">
      </label>

      <h3>Fonctionnalités</h3>
      <label>
        <input type="checkbox" formControlName="chatEnabled">
        Activer le chat
      </label>

      <button type="submit">Sauvegarder</button>
    </form>
  `
})
```
