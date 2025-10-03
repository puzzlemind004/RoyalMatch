# Tâche 11.7 : Mode IA vs IA pour tests

## Utilité
- Tester l'équilibrage du jeu
- Valider les règles
- Détecter les stratégies dominantes
- Générer des statistiques

## Implémentation
```typescript
class AITestingService {
  async runAIBattle(config: AIBattleConfig): Promise<AIBattleResult> {
    const game = await this.createAIGame(config)

    // Accélérer le jeu (pas d'attente)
    game.turnDuration = 0

    const result = await this.runGame(game)

    return this.analyzeResult(result)
  }

  async runMultipleGames(count: number): Promise<AIStatistics> {
    const results = []

    for (let i = 0; i < count; i++) {
      const result = await this.runAIBattle({
        players: [
          { difficulty: 'easy' },
          { difficulty: 'medium' },
          { difficulty: 'hard' },
          { difficulty: 'hard' }
        ]
      })
      results.push(result)
    }

    return this.aggregateStatistics(results)
  }

  private aggregateStatistics(results: AIBattleResult[]): AIStatistics {
    return {
      gamesPlayed: results.length,
      winsByDifficulty: {
        easy: results.filter(r => r.winner.difficulty === 'easy').length,
        medium: results.filter(r => r.winner.difficulty === 'medium').length,
        hard: results.filter(r => r.winner.difficulty === 'hard').length
      },
      averageScore: this.calculateAverageScore(results),
      averageGameDuration: this.calculateAverageDuration(results)
    }
  }
}
```

## Interface de test
```typescript
@Component({
  template: `
    <div class="ai-testing-panel">
      <h2>Tests IA vs IA</h2>

      <button (click)="runSingleGame()">Lancer 1 partie</button>
      <button (click)="runBatch(100)">Lancer 100 parties</button>

      @if (results()) {
        <div class="results">
          <h3>Résultats ({{ results().gamesPlayed }} parties)</h3>
          <p>Facile: {{ results().winsByDifficulty.easy }} victoires</p>
          <p>Moyen: {{ results().winsByDifficulty.medium }} victoires</p>
          <p>Difficile: {{ results().winsByDifficulty.hard }} victoires</p>
        </div>
      }
    </div>
  `
})
```
