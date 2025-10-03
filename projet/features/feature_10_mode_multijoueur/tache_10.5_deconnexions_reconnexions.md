# Tâche 10.5 : Gestion des déconnexions/reconnexions

## Stratégie
1. **Déconnexion courte (< 2min)** : Pause de la partie, attente du joueur
2. **Déconnexion longue (> 2min)** : IA prend le relais automatiquement
3. **Reconnexion** : Le joueur récupère son état exact

## Backend
```typescript
class DisconnectionManager {
  private disconnectedPlayers = new Map<string, DisconnectionInfo>()

  async onPlayerDisconnect(playerId: string, gameId: string) {
    const disconnectTime = new Date()

    this.disconnectedPlayers.set(playerId, {
      playerId,
      gameId,
      disconnectedAt: disconnectTime,
      timeout: setTimeout(() => this.replaceWithAI(playerId, gameId), 120000) // 2min
    })

    // Pause la partie
    await this.pauseGame(gameId)

    this.broadcast(gameId, 'player:disconnected', { playerId, waitTime: 120 })
  }

  async onPlayerReconnect(playerId: string, gameId: string) {
    const info = this.disconnectedPlayers.get(playerId)
    if (!info) return

    // Annuler le timeout
    clearTimeout(info.timeout)
    this.disconnectedPlayers.delete(playerId)

    // Resynchroniser
    await this.syncGameState(playerId, gameId)

    // Reprendre la partie
    await this.resumeGame(gameId)

    this.broadcast(gameId, 'player:reconnected', { playerId })
  }

  private async replaceWithAI(playerId: string, gameId: string) {
    const ai = await this.createAI('medium')
    await this.transferPlayerToAI(playerId, ai.id, gameId)

    this.broadcast(gameId, 'player:replaced_by_ai', { playerId })

    // Reprendre la partie
    await this.resumeGame(gameId)
  }
}
```

## Frontend
```typescript
@Injectable()
export class ReconnectionService {
  constructor(private wsService: WebSocketService) {
    this.setupReconnection()
  }

  private setupReconnection() {
    this.wsService.onDisconnect().subscribe(() => {
      this.attemptReconnection()
    })
  }

  private async attemptReconnection() {
    let attempts = 0
    const maxAttempts = 5

    while (attempts < maxAttempts) {
      try {
        await this.wsService.connect()
        await this.requestStateSync()
        return
      } catch (e) {
        attempts++
        await this.delay(2000 * attempts) // Backoff exponentiel
      }
    }

    // Échec de reconnexion
    this.showError('Impossible de se reconnecter')
  }
}
```
