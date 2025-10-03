# Tâche 4.3 : Distribution semi-aléatoire des objectifs

## Objectif
Permettre aux joueurs de choisir le nombre d'objectifs à piocher par niveau de difficulté, puis piocher aléatoirement dans chaque catégorie.

## Logique de distribution

### Système semi-aléatoire
Le joueur décide combien d'objectifs il veut piocher dans chaque niveau :
- **Facile** : 0 à 3 objectifs
- **Moyen** : 0 à 3 objectifs
- **Difficile** : 0 à 3 objectifs
- **Total** : Minimum 1 objectif, maximum 3 objectifs

Exemples de choix valides :
- 3 faciles, 0 moyen, 0 difficile
- 1 facile, 1 moyen, 1 difficile
- 0 facile, 2 moyens, 1 difficile
- 2 difficiles, 0 facile, 0 moyen

## Backend
```typescript
// app/Services/ObjectiveDistributionService.ts
class ObjectiveDistributionService {
  async offerObjectives(playerId: string, roundId: string) {
    // Envoyer la liste complète des objectifs par niveau
    return {
      easy: this.getObjectivesByDifficulty('easy'),
      medium: this.getObjectivesByDifficulty('medium'),
      hard: this.getObjectivesByDifficulty('hard')
    }
  }

  async drawObjectives(
    playerId: string,
    roundId: string,
    selection: { easy: number, medium: number, hard: number }
  ): Promise<ObjectiveDefinition[]> {
    // Valider la sélection
    const total = selection.easy + selection.medium + selection.hard
    if (total < 1 || total > 3) {
      throw new Error('Vous devez piocher entre 1 et 3 objectifs')
    }

    const objectives: ObjectiveDefinition[] = []

    // Piocher aléatoirement dans chaque catégorie
    if (selection.easy > 0) {
      const easyObjectives = this.getObjectivesByDifficulty('easy')
      objectives.push(...this.drawRandom(easyObjectives, selection.easy))
    }

    if (selection.medium > 0) {
      const mediumObjectives = this.getObjectivesByDifficulty('medium')
      objectives.push(...this.drawRandom(mediumObjectives, selection.medium))
    }

    if (selection.hard > 0) {
      const hardObjectives = this.getObjectivesByDifficulty('hard')
      objectives.push(...this.drawRandom(hardObjectives, selection.hard))
    }

    return objectives
  }

  private drawRandom(pool: ObjectiveDefinition[], count: number): ObjectiveDefinition[] {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }
}
```

## Frontend
```typescript
@Component({
  template: `
    <div class="objective-distribution">
      <h2>Choisissez vos objectifs (1 à 3 au total)</h2>

      <div class="difficulty-selector">
        <div class="difficulty-group">
          <h3>Faciles (1-2 points)</h3>
          <input
            type="number"
            [(ngModel)]="selection.easy"
            min="0"
            max="3"
            (change)="validateSelection()"
          />
        </div>

        <div class="difficulty-group">
          <h3>Moyens (3-4 points)</h3>
          <input
            type="number"
            [(ngModel)]="selection.medium"
            min="0"
            max="3"
            (change)="validateSelection()"
          />
        </div>

        <div class="difficulty-group">
          <h3>Difficiles (5-10 points)</h3>
          <input
            type="number"
            [(ngModel)]="selection.hard"
            min="0"
            max="3"
            (change)="validateSelection()"
          />
        </div>
      </div>

      <p>Total : {{ getTotal() }} / 3</p>

      <button
        [disabled]="!isValidSelection()"
        (click)="drawObjectives()"
      >
        Piocher mes objectifs
      </button>
    </div>
  `
})
export class ObjectiveDistributionComponent {
  selection = { easy: 1, medium: 1, hard: 1 }

  getTotal(): number {
    return this.selection.easy + this.selection.medium + this.selection.hard
  }

  isValidSelection(): boolean {
    const total = this.getTotal()
    return total >= 1 && total <= 3
  }

  validateSelection() {
    // Ajuster automatiquement si dépasse 3
    const total = this.getTotal()
    if (total > 3) {
      // Réduire le dernier modifié
      // Logique à implémenter selon UX souhaitée
    }
  }
}
```

## Résultat attendu
- Interface permettant au joueur de choisir la répartition
- Pioche aléatoire dans chaque catégorie choisie
- Total entre 1 et 3 objectifs
- Validation côté client et serveur
- Sauvegarde en BDD
