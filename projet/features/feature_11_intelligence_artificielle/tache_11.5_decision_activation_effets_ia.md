# Tâche 11.5 : IA - Décision d'activation des effets

## Logique de décision
```typescript
private shouldActivateEffect(card: Card, analysis: GameAnalysis): boolean {
  const effect = card.effect

  // Facile : 30% de chance d'activer
  if (this.difficulty === 'easy') {
    return Math.random() < 0.3
  }

  // Moyen : 60% si effet bénéfique
  if (this.difficulty === 'medium') {
    return this.isEffectBeneficial(effect, analysis) && Math.random() < 0.6
  }

  // Difficile : analyse approfondie
  return this.evaluateEffectUtility(effect, analysis) > 0.5
}

private evaluateEffectUtility(effect: CardEffect, analysis: GameAnalysis): number {
  let utility = 0

  // Évaluer selon le type d'effet
  switch (effect.category) {
    case 'objective':
      utility = this.helpsCurrentObjectives(effect) ? 0.8 : 0.2
      break

    case 'draw':
      utility = this.needsMoreCards() ? 0.7 : 0.3
      break

    case 'attack':
      utility = this.isLeading(analysis) ? 0.3 : 0.9 // Attaquer si en retard
      break

    case 'random':
      utility = 0.5 // Neutre
      break
  }

  // Modifier selon la situation
  if (analysis.isLosingBadly) {
    utility += 0.2 // Plus agressif si en retard
  }

  return Math.min(utility, 1.0)
}
```
