# Tâche 8.4 : Effets Trèfle (hasard, chance)

## Exemples d'implémentation
```typescript
// 2♣ : 50% chance de piocher 1 carte
const twoOfClubs: EffectHandler = {
  execute: async (effect, context) => {
    if (Math.random() < 0.5) {
      const card = await deckService.drawCard(effect.casterId)
      return { success: true, message: 'Chance ! Carte piochée' }
    }
    return { success: false, message: 'Pas de chance' }
  }
}

// 5♣ : Effet aléatoire (piochez 1 ou 2 cartes)
const fiveOfClubs: EffectHandler = {
  execute: async (effect, context) => {
    const count = Math.random() < 0.5 ? 1 : 2
    await deckService.drawMultiple(effect.casterId, count)
    return { success: true, message: `${count} carte(s) piochée(s)` }
  }
}

// 10♣ : Au prochain tour, inversez forte/faible
const tenOfClubs: EffectHandler = {
  execute: async (effect, context) => {
    await context.setTemporaryColorInversion(1) // 1 tour
    return { success: true, message: 'Couleurs inversées pour 1 tour' }
  }
}

// A♣ : Relancez la roulette (nouvelle couleur pour 1 tour)
const aceOfClubs: EffectHandler = {
  execute: async (effect, context) => {
    const newColor = colorRouletteService.spinRoulette()
    await context.setTemporaryDominantColor(newColor, 1)
    return { success: true, message: `Nouvelle couleur forte: ${newColor}` }
  }
}
```
