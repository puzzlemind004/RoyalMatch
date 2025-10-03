# Tâche 11.6 : Niveaux de difficulté IA

## Facile
- Sélection aléatoire des objectifs
- Main de départ aléatoire
- Joue des cartes aléatoires
- Active les effets 30% du temps au hasard
- Temps de réflexion : 2-5 secondes

## Moyen
- Garde les objectifs les plus faciles
- Analyse basique pour la main de départ
- Stratégie simple (gagner si possible)
- Active les effets bénéfiques 60% du temps
- Temps de réflexion : 5-10 secondes

## Difficile
- Analyse approfondie des objectifs
- Optimisation de la main de départ
- Stratégie adaptative complexe
- Décision rationnelle pour les effets
- Anticipe les coups des adversaires
- Temps de réflexion : 10-15 secondes

## Implémentation
```typescript
class AIFactory {
  createAI(difficulty: 'easy' | 'medium' | 'hard'): AIStrategy {
    switch (difficulty) {
      case 'easy':
        return new EasyAI()
      case 'medium':
        return new MediumAI()
      case 'hard':
        return new HardAI()
    }
  }
}

class EasyAI extends BaseAI {
  selectObjectives(offered: ObjectiveDefinition[]): ObjectiveDefinition[] {
    return this.rng.shuffle(offered).slice(0, this.rng.int(1, 3))
  }

  selectCardToPlay(gameState: GameState, hand: Card[]): PlayDecision {
    const card = this.rng.choice(hand)
    const activateEffect = this.rng.boolean(0.3)
    return { card, activateEffect }
  }
}
```
