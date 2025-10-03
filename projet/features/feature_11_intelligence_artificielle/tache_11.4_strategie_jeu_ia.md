# Tâche 11.4 : IA - Stratégie de jeu par tour

## Facteurs de décision
1. **Objectifs** : Jouer pour compléter ses objectifs
2. **Valeur du pli** : Gagner ou perdre selon la stratégie
3. **Gestion des ressources** : Garder les bonnes cartes
4. **Position** : Jouer différemment selon l'ordre du tour

## Implémentation
```typescript
class HardAI extends BaseAI {
  selectCardToPlay(gameState: GameState, hand: Card[]): PlayDecision {
    const analysis = this.analyzeGameState(gameState)

    // Déterminer la stratégie du tour
    const strategy = this.determineStrategy(analysis)

    // Sélectionner la meilleure carte selon la stratégie
    const card = this.selectBestCard(hand, strategy, analysis)

    // Décider d'activer l'effet
    const activateEffect = this.shouldActivateEffect(card, analysis)

    return { card, activateEffect }
  }

  private determineStrategy(analysis: GameAnalysis): 'win' | 'lose' | 'neutral' {
    // Si besoin de gagner des plis pour objectif
    if (this.needsToWinTricks(analysis)) {
      return 'win'
    }

    // Si objectif est de perdre tous les plis
    if (this.needsToLoseTricks(analysis)) {
      return 'lose'
    }

    // Si en avance : jouer safe
    if (analysis.isLeading) {
      return 'neutral'
    }

    // Sinon : essayer de gagner
    return 'win'
  }

  private selectBestCard(hand: Card[], strategy: string, analysis: GameAnalysis): Card {
    switch (strategy) {
      case 'win':
        // Jouer la carte la plus forte qui peut gagner
        return this.findStrongestWinningCard(hand, analysis)

      case 'lose':
        // Jouer la carte la plus faible
        return this.findWeakestCard(hand, analysis)

      case 'neutral':
        // Jouer une carte moyenne
        return this.findMiddleCard(hand)
    }
  }

  private findStrongestWinningCard(hand: Card[], analysis: GameAnalysis): Card {
    // Trier par force décroissante
    const sorted = [...hand].sort((a, b) =>
      this.compareStrength(b, a, analysis.dominantColor)
    )

    // Si on joue en premier, jouer une carte forte mais pas la meilleure
    if (analysis.isFirstToPlay) {
      return sorted[1] || sorted[0]
    }

    // Sinon, trouver la carte minimale qui bat les cartes déjà jouées
    const playedCards = analysis.playedThisTurn
    for (const card of sorted) {
      if (this.beatsAll(card, playedCards, analysis.dominantColor)) {
        return card
      }
    }

    // Aucune carte ne gagne : jouer la plus faible
    return sorted[sorted.length - 1]
  }
}
```
