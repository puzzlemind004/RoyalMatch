# Tâche 7.7 : Programmation des effets pour le prochain tour

## Logique
- Les effets activés ce tour sont mis en file d'attente
- Ils s'exécuteront au début du tour suivant
- Stockage en BDD avec metadata (caster, targets, etc.)
- Ordre d'exécution défini

## Backend
```typescript
async queueEffects(turnId: string) {
  const playedCards = await this.getPlayedCardsWithEffects(turnId)

  for (const [playerId, { card, activateEffect, targets }] of playedCards) {
    if (activateEffect) {
      await EffectQueue.create({
        turnId: turnId + 1, // S'exécute au prochain tour
        casterId: playerId,
        effect: card.effect,
        targets: targets,
        executedAt: null
      })
    }
  }
}
```
