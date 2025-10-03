# Tâche 11.2 : IA - Sélection des objectifs

## Stratégies par difficulté

### Facile
- Choix aléatoire de la répartition (ex: 2 faciles + 1 moyen)

### Moyen
- Préfère les objectifs faciles/moyens
- Ratio 2 faciles/moyens pour 1 difficile

### Difficile
- Analyse approfondie du ratio points/probabilité
- Peut prendre plusieurs objectifs difficiles si profitable
- Optimise le score espéré

## Implémentation
```typescript
class HardAI extends BaseAI {
  selectObjectiveDistribution(): { easy: number, medium: number, hard: number } {
    // Évaluer quelle répartition maximise le score espéré
    const strategies = [
      { easy: 3, medium: 0, hard: 0, expectedScore: 6 },
      { easy: 2, medium: 1, hard: 0, expectedScore: 7 },
      { easy: 1, medium: 1, hard: 1, expectedScore: 9 },
      { easy: 0, medium: 2, hard: 1, expectedScore: 11 },
      { easy: 0, medium: 1, hard: 2, expectedScore: 14 },
      { easy: 0, medium: 0, hard: 3, expectedScore: 18 }
    ]

    // Ajuster selon le niveau de l'IA et l'état de la partie
    const adjusted = strategies.map(s => ({
      ...s,
      expectedScore: s.expectedScore * this.getCompletionProbability(s)
    }))

    // Choisir la meilleure stratégie
    const best = adjusted.sort((a, b) => b.expectedScore - a.expectedScore)[0]

    return { easy: best.easy, medium: best.medium, hard: best.hard }
  }

  private evaluateObjective(obj: ObjectiveDefinition): number {
    const completionProbability = this.estimateCompletionChance(obj)
    const pointValue = obj.points

    // Score = valeur * probabilité
    return pointValue * completionProbability
  }

  private estimateCompletionChance(obj: ObjectiveDefinition): number {
    // Logique basée sur la catégorie et la difficulté
    switch (obj.category) {
      case 'tricks':
        return this.estimateTrickObjective(obj)
      case 'colors':
        return 0.6
      case 'values':
        return 0.5
      case 'special':
        return 0.3
    }
  }
}
```
