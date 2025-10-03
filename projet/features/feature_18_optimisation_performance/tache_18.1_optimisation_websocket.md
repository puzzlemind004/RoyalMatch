# Tâche 18.1 : Optimisation WebSocket

## Compression des messages
```typescript
// AdonisJS Transmit avec compression
import { Transmit } from '@adonisjs/transmit'

transmit.use((ctx, next) => {
  // Activer la compression gzip
  if (ctx.request.headers['accept-encoding']?.includes('gzip')) {
    ctx.response.compress = true
  }
  return next()
})
```

## Batching des événements
```typescript
class WebSocketOptimizer {
  private eventQueue: any[] = []
  private batchInterval = 50 // ms

  constructor() {
    setInterval(() => this.flush(), this.batchInterval)
  }

  queue(event: string, data: any) {
    this.eventQueue.push({ event, data, timestamp: Date.now() })
  }

  private flush() {
    if (this.eventQueue.length === 0) return

    // Envoyer tous les événements en un seul message
    this.broadcast('batch:events', {
      events: this.eventQueue
    })

    this.eventQueue = []
  }
}
```

## Réduction de la taille des payloads
```typescript
// Au lieu d'envoyer des objets complets
{
  player: {
    id: 'uuid',
    username: 'Player1',
    email: 'player@example.com',
    createdAt: '2024-01-01',
    // ... beaucoup de données inutiles
  }
}

// Envoyer uniquement les données nécessaires
{
  p: { i: 'uuid', n: 'Player1' } // id et name seulement
}
```

## Throttling
```typescript
// Limiter la fréquence des mises à jour
import { throttle } from 'lodash'

const sendPositionUpdate = throttle((position) => {
  socket.emit('position:update', position)
}, 100) // Max 10 fois par seconde
```
