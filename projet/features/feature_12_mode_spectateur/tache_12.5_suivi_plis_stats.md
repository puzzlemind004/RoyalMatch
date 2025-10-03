# Tâche 12.5 : Suivi des plis et statistiques live

## Statistiques affichées
- Plis gagnés par joueur
- Derniers gagnants de plis
- Graphique d'évolution des scores
- Cartes fortes restantes
- Prédiction du gagnant (ML optionnel)

## Frontend
```typescript
@Component({
  template: `
    <div class="spectator-stats">
      <h3>Statistiques Live</h3>

      <table>
        <tr>
          <th>Joueur</th>
          <th>Score</th>
          <th>Plis</th>
          <th>Dernier pli</th>
        </tr>
        @for (player of stats(); track player.id) {
          <tr>
            <td>{{ player.name }}</td>
            <td>{{ player.score }}</td>
            <td>{{ player.tricksWon }}</td>
            <td>{{ player.lastTrick }}</td>
          </tr>
        }
      </table>

      <div class="score-chart">
        <app-score-chart [data]="scoreHistory()" />
      </div>
    </div>
  `
})
```
