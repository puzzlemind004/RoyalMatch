# Tâche 4.6 : Attribution des points selon objectifs remplis

## Objectif
Calculer et attribuer les points en fin de manche selon les objectifs remplis.

## Logique
- Chaque objectif rempli = points indiqués
- Bonus si tous les objectifs sont remplis (+5 points)
- Mise à jour du score total du joueur
- Vérification de la condition de victoire

## Backend
```typescript
// app/Services/ScoringService.ts
class ScoringService {
  async calculateRoundScore(playerId: string, roundId: string): Promise<ScoreResult> {
    const objectiveResults = await this.verifyPlayerObjectives(playerId, roundId)

    let totalPoints = 0
    const completedCount = objectiveResults.filter(r => r.completed).length

    // Points des objectifs
    totalPoints = objectiveResults.reduce((sum, r) => sum + r.points, 0)

    // Bonus si tous complétés
    if (completedCount === objectiveResults.length && completedCount > 0) {
      totalPoints += 5
    }

    // Mettre à jour le score total
    await this.updatePlayerScore(playerId, totalPoints)

    return {
      roundPoints: totalPoints,
      objectivesCompleted: completedCount,
      bonusApplied: completedCount === objectiveResults.length,
      details: objectiveResults
    }
  }
}
```

## Résultat attendu
- Calcul précis des scores
- Attribution correcte des bonus
- Mise à jour en base de données
- Notification aux joueurs
