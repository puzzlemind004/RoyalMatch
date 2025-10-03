# Tâche 11.3 : IA - Choix des 5 cartes de départ

## Stratégie
- Analyser les objectifs sélectionnés
- Garder les cartes utiles pour les objectifs
- Équilibrer valeurs hautes et basses
- Considérer les effets des cartes

## Implémentation
```typescript
class HardAI extends BaseAI {
  selectStartingHand(allCards: Card[]): Card[] {
    // Scorer chaque carte
    const scoredCards = allCards.map(card => ({
      card,
      score: this.scoreCardForStartingHand(card)
    }))

    // Trier et prendre les 5 meilleures
    scoredCards.sort((a, b) => b.score - a.score)
    return scoredCards.slice(0, 5).map(s => s.card)
  }

  private scoreCardForStartingHand(card: Card): number {
    let score = card.numericValue // Base: valeur de la carte

    // Bonus si la carte aide un objectif
    if (this.helpsObjective(card)) {
      score += 5
    }

    // Bonus pour les effets puissants
    if (card.effect.power > 5) {
      score += 3
    }

    // Bonus si couleur forte
    if (card.suit === this.dominantColor) {
      score += 2
    }

    return score
  }
}
```
