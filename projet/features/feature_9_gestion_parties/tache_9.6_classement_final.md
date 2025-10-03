# Tâche 9.6 : Classement final et statistiques

## Écran de fin
- Classement par score
- Statistiques détaillées :
  - Plis gagnés
  - Objectifs complétés
  - Effets utilisés
  - MVP (meilleur joueur)
- Bouton "Revanche" (nouvelle partie avec mêmes paramètres)
- Bouton "Retour au menu"

## Frontend
```typescript
@Component({
  template: `
    <div class="game-over-screen">
      <h1>🏆 Partie terminée !</h1>

      <div class="podium">
        @for (player of ranking(); track player.id; let i = $index) {
          <div class="rank-{{ i + 1 }}">
            <div class="medal">{{ getMedal(i) }}</div>
            <h2>{{ player.name }}</h2>
            <p class="score">{{ player.totalScore }} points</p>
          </div>
        }
      </div>

      <div class="stats-table">
        <table>
          <thead>
            <tr>
              <th>Joueur</th>
              <th>Plis gagnés</th>
              <th>Objectifs</th>
              <th>Effets</th>
            </tr>
          </thead>
          <tbody>
            @for (player of ranking(); track player.id) {
              <tr>
                <td>{{ player.name }}</td>
                <td>{{ player.stats.tricksWon }}</td>
                <td>{{ player.stats.objectivesCompleted }}</td>
                <td>{{ player.stats.effectsUsed }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="actions">
        <button (click)="rematch()">Revanche</button>
        <button (click)="backToMenu()">Menu principal</button>
      </div>
    </div>
  `
})
```
