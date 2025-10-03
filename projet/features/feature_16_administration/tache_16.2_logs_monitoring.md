# Tâche 16.2 : Logs et monitoring

## Système de logs
```typescript
// app/Services/LogService.ts
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
})

export class LogService {
  info(message: string, data?: any) {
    logger.info(data, message)
  }

  error(message: string, error: Error, data?: any) {
    logger.error({ err: error, ...data }, message)
  }

  warn(message: string, data?: any) {
    logger.warn(data, message)
  }

  // Logs spécifiques au jeu
  logGameAction(action: string, gameId: string, playerId: string, data?: any) {
    logger.info({
      type: 'game_action',
      action,
      gameId,
      playerId,
      ...data
    }, `Game action: ${action}`)
  }

  logCheatAttempt(playerId: string, cheatType: string, data?: any) {
    logger.warn({
      type: 'cheat_attempt',
      playerId,
      cheatType,
      ...data
    }, `Cheat attempt detected: ${cheatType}`)
  }
}
```

## Monitoring avec Prometheus
```typescript
// app/Services/MetricsService.ts
import { Registry, Counter, Histogram } from 'prom-client'

const register = new Registry()

const gameCounter = new Counter({
  name: 'games_total',
  help: 'Total number of games',
  labelNames: ['status'],
  registers: [register]
})

const turnDuration = new Histogram({
  name: 'turn_duration_seconds',
  help: 'Duration of turns in seconds',
  buckets: [1, 5, 10, 15, 30],
  registers: [register]
})

export class MetricsService {
  incrementGames(status: string) {
    gameCounter.inc({ status })
  }

  recordTurnDuration(duration: number) {
    turnDuration.observe(duration)
  }

  async getMetrics() {
    return register.metrics()
  }
}
```
