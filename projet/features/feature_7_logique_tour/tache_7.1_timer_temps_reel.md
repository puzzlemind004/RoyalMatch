# Tâche 7.1 : Système de timer temps réel par tour

## Configuration
- Temps de réflexion : 30 secondes par défaut (configurable)
- Timer synchronisé entre tous les joueurs
- Compte à rebours visible
- Son/alerte à 5 secondes restantes
- Action automatique si timeout (carte aléatoire jouée)

## Backend WebSocket
```typescript
async startTurn(roundId: string, turnNumber: number) {
  const turn = await Turn.create({ roundId, turnNumber, startedAt: new Date() })

  this.broadcast('turn:started', {
    turnId: turn.id,
    turnNumber,
    timeLimit: 30
  })

  // Auto-resolve après 30s
  setTimeout(() => this.autoResolveTimeout(turn.id), 30000)
}
```

## Frontend
```typescript
@Component({
  template: `
    <div class="timer-display">
      <div class="countdown" [class.warning]="timeRemaining() <= 5">
        {{ timeRemaining() }}s
      </div>
    </div>
  `
})
```
