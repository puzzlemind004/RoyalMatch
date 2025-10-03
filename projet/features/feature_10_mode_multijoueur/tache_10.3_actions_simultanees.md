# Tâche 10.3 : Gestion des actions simultanées

## Challenge
Tous les joueurs choisissent leur carte en même temps sans voir les choix des autres.

## Solution
```typescript
class SimultaneousActionManager {
  private pendingActions = new Map<string, PlayerAction>()

  async submitAction(playerId: string, action: PlayerAction) {
    this.pendingActions.set(playerId, action)

    if (this.allPlayersSubmitted()) {
      await this.resolveSimultaneously()
    }
  }

  private async resolveSimultaneously() {
    const actions = Array.from(this.pendingActions.entries())

    // Enregistrer TOUTES les actions avec le même timestamp
    const timestamp = new Date()
    await Promise.all(
      actions.map(([playerId, action]) =>
        this.recordAction(playerId, action, timestamp)
      )
    )

    // Révéler simultanément
    this.broadcast('actions:revealed', actions)

    this.pendingActions.clear()
  }
}
```
