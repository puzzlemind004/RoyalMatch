# Tâche 4.4 : Interface de choix et validation des objectifs

## Objectif
Après la pioche, permettre au joueur de valider ses objectifs piochés aléatoirement.

## Règles
- Le joueur a choisi combien d'objectifs piocher par niveau (tâche 4.3)
- Les objectifs sont piochés aléatoirement selon son choix
- Il voit les objectifs piochés et peut les valider
- Possibilité de re-piocher une fois (optionnel)
- Timer de 45 secondes pour valider
- Si timeout : validation automatique

## Frontend
```typescript
// src/app/features/game/components/objective-validation/
@Component({
  selector: 'app-objective-validation',
  template: `
    <div class="objective-validation-panel">
      <h2>Vos objectifs piochés</h2>
      <p class="text-sm">{{ objectives().length }} objectif(s)</p>

      <div class="timer">{{ remainingTime() }}s</div>

      @for (objective of objectives(); track objective.id) {
        <div class="objective-card">
          <span class="difficulty-badge">
            {{ getDifficultyLabel(objective.difficulty) }}
          </span>
          <h3>{{ objective.name }}</h3>
          <p>{{ objective.description }}</p>
          <span class="points">{{ objective.points }} pts</span>
        </div>
      }

      <div class="actions">
        @if (canRedraw()) {
          <button
            class="btn-secondary"
            (click)="redraw()"
          >
            Re-piocher (1 fois)
          </button>
        }

        <button
          class="btn-primary"
          (click)="confirmObjectives()"
        >
          Valider ces objectifs
        </button>
      </div>
    </div>
  `
})
export class ObjectiveValidationComponent {
  objectives = input.required<ObjectiveDefinition[]>()
  hasRedrawn = signal(false)
  remainingTime = signal(45)

  canRedraw(): boolean {
    return !this.hasRedrawn()
  }

  getDifficultyLabel(difficulty: string): string {
    const labels = {
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile'
    }
    return labels[difficulty] || difficulty
  }

  async redraw() {
    this.hasRedrawn.set(true)
    // Demander au serveur de re-piocher avec la même répartition
    await this.objectiveService.redrawObjectives()
  }
}
```

## Résultat attendu
- Interface claire et intuitive
- Timer visible
- Validation côté client et serveur
- Gestion du timeout
