# Tâche 8.6 : Système de file d'attente des effets

## Structure
```typescript
interface QueuedEffect {
  id: string
  turnId: string
  casterId: string
  effectType: string
  targets: string[]
  metadata: any
  priority: number
  executedAt: Date | null
  cancelled: boolean
}

class EffectQueueService {
  async enqueue(effect: Omit<QueuedEffect, 'id'>): Promise<void>
  async dequeue(turnId: string): Promise<QueuedEffect[]>
  async cancel(effectId: string): Promise<void>
  async executeQueue(turnId: string): Promise<EffectResult[]>
}
```

## Ordre d'exécution
1. Effets de priorité haute (défense, annulation)
2. Effets de priorité moyenne (pioche, manipulation)
3. Effets de priorité basse (bonus, stats)
