# Tâche 8.1 : Moteur d'exécution des effets

## Architecture
```typescript
class EffectEngine {
  private effectHandlers = new Map<string, EffectHandler>()

  registerEffect(effectType: string, handler: EffectHandler) {
    this.effectHandlers.set(effectType, handler)
  }

  async execute(effect: QueuedEffect, context: GameState): Promise<EffectResult> {
    const handler = this.effectHandlers.get(effect.type)
    if (!handler) throw new Error(`Unknown effect: ${effect.type}`)

    const result = await handler.execute(effect, context)

    await this.logEffect(effect, result)
    await this.broadcastEffect(effect, result)

    return result
  }
}

interface EffectHandler {
  execute(effect: QueuedEffect, context: GameState): Promise<EffectResult>
  validate(effect: QueuedEffect, context: GameState): boolean
}
```

## Résultat attendu
- Système modulaire et extensible
- Gestion des erreurs robuste
- Logs détaillés
- Validation avant exécution
