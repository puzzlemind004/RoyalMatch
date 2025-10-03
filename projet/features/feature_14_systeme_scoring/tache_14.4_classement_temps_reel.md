# Tâche 14.4 : Classement en temps réel

## Signal réactif
```typescript
@Injectable()
export class LeaderboardService {
  private playersSignal = signal<Player[]>([])

  rankings = computed(() => {
    return [...this.playersSignal()]
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((player, index) => ({
        rank: index + 1,
        player,
        badge: this.getBadge(index)
      }))
  })

  private getBadge(rank: number): string {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `#${rank + 1}`
  }
}
```

## Composant
```typescript
@Component({
  template: `
    <div class="leaderboard">
      @for (entry of rankings(); track entry.player.id) {
        <div class="rank-entry" [class.highlight]="entry.player.id === currentPlayerId()">
          <span class="badge">{{ entry.badge }}</span>
          <span class="name">{{ entry.player.name }}</span>
          <span class="score">{{ entry.player.totalScore }}</span>
        </div>
      }
    </div>
  `
})
```
