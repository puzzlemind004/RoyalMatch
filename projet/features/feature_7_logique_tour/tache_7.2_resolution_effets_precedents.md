# Tâche 7.2 : Résolution des effets du tour précédent

## Logique
- Les effets activés au tour N s'appliquent au début du tour N+1
- File d'attente des effets programmés
- Résolution dans l'ordre chronologique
- Gestion des conflits (plusieurs effets sur la même cible)
- Animation visuelle de chaque effet

## Backend
```typescript
async resolveQueuedEffects(turnId: string) {
  const queuedEffects = await this.getQueuedEffects(turnId)

  for (const effect of queuedEffects) {
    const result = await effectEngine.execute(effect)
    await this.broadcastEffectResult(effect, result)
  }

  await this.clearQueue(turnId)
}
```
