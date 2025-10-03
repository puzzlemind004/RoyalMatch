# Tâche 14.3 : Historique des scores par manche

## Stockage
```typescript
interface RoundScore {
  roundNumber: number
  playerScores: Map<string, {
    roundPoints: number
    totalScore: number
    objectivesCompleted: number
  }>
}

class ScoreHistoryService {
  async getRoundHistory(gameId: string): Promise<RoundScore[]> {
    const rounds = await Round.query()
      .where('game_id', gameId)
      .orderBy('round_number', 'asc')

    return rounds.map(round => this.buildRoundScore(round))
  }
}
```

## Frontend
```typescript
@Component({
  template: `
    <div class="score-history">
      <table>
        <thead>
          <tr>
            <th>Manche</th>
            @for (player of players(); track player.id) {
              <th>{{ player.name }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (round of history(); track round.roundNumber) {
            <tr>
              <td>{{ round.roundNumber }}</td>
              @for (player of players(); track player.id) {
                <td>
                  +{{ round.playerScores.get(player.id)?.roundPoints }}
                  ({{ round.playerScores.get(player.id)?.totalScore }})
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
```
