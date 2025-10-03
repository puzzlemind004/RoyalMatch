# Tâche 8.2 : Effets Cœur (objectifs, positif)

## Exemples d'implémentation
```typescript
// 2♥ : +1 point si vous gagnez ce pli
const twoOfHearts: EffectHandler = {
  execute: async (effect, context) => {
    const trickWinner = context.currentTrick.winnerId
    if (trickWinner === effect.casterId) {
      await scoringService.addBonus(effect.casterId, 1)
      return { success: true, message: '+1 point bonus' }
    }
    return { success: false, message: 'Pli perdu' }
  }
}

// 5♥ : Ce pli compte double pour vos objectifs
const fiveOfHearts: EffectHandler = {
  execute: async (effect, context) => {
    await context.setTrickMultiplier(effect.casterId, 2)
    return { success: true, message: 'Pli compte double' }
  }
}

// 10♥ : Révélez un objectif d'un adversaire
const tenOfHearts: EffectHandler = {
  execute: async (effect, context) => {
    const target = effect.targets[0]
    const objective = await objectiveService.revealObjective(target)
    return { success: true, data: { objective } }
  }
}

// A♥ : Si tous objectifs remplis, +5 points
const aceOfHearts: EffectHandler = {
  execute: async (effect, context) => {
    const allCompleted = await objectiveService.checkAllCompleted(effect.casterId)
    if (allCompleted) {
      await scoringService.addBonus(effect.casterId, 5)
      return { success: true, message: '+5 points (tous objectifs)' }
    }
    return { success: false, message: 'Objectifs non complétés' }
  }
}
```
