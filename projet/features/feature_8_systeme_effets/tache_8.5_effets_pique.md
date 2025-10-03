# Tâche 8.5 : Effets Pique (agressif, adversaires)

## Exemples d'implémentation
```typescript
// 2♠ : Regardez la main d'un adversaire
const twoOfSpades: EffectHandler = {
  execute: async (effect, context) => {
    const target = effect.targets[0]
    const hand = await handService.getHand(target)
    return { success: true, data: { hand }, private: true }
  }
}

// 5♠ : Un adversaire défausse 1 carte au hasard
const fiveOfSpades: EffectHandler = {
  execute: async (effect, context) => {
    const target = effect.targets[0]
    const hand = await handService.getHand(target)
    const randomCard = hand[Math.floor(Math.random() * hand.length)]
    await handService.discard(target, randomCard)
    return { success: true, message: 'Carte défaussée' }
  }
}

// 10♠ : Annulez l'effet de la carte adverse la plus forte ce tour
const tenOfSpades: EffectHandler = {
  execute: async (effect, context) => {
    const strongestOpponent = context.getStrongestOpponentCard()
    await effectQueueService.cancelEffect(strongestOpponent)
    return { success: true, message: 'Effet adverse annulé' }
  }
}

// A♠ : Volez 2 cartes aléatoires d'un adversaire
const aceOfSpades: EffectHandler = {
  execute: async (effect, context) => {
    const target = effect.targets[0]
    const hand = await handService.getHand(target)
    const stolen = hand.slice(0, 2)

    await handService.removeCards(target, stolen)
    await handService.addCards(effect.casterId, stolen)

    return { success: true, message: '2 cartes volées' }
  }
}
```
