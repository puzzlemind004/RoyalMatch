# Tâche 14.2 : Système de bonus/malus

## Bonus
- Tous les objectifs complétés : +5 points
- Perfection (tous les plis) : +10 points
- Aucun pli perdu (si objectif de gagner tous) : +3 points
- Combo (3 objectifs difficiles complétés) : +7 points

## Malus (optionnel)
- Aucun objectif complété : -2 points
- Déconnexion pendant la manche : -5 points

## Implémentation
```typescript
class BonusCalculator {
  calculateBonus(player: Player, round: Round): number {
    let bonus = 0

    if (this.allObjectivesCompleted(player, round)) {
      bonus += 5
    }

    if (this.isPerfectRound(player, round)) {
      bonus += 10
    }

    return bonus
  }
}
```
