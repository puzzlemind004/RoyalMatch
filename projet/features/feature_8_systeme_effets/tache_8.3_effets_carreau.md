# Tâche 8.3 : Effets Carreau (pioche, gestion main/deck)

## Exemples d'implémentation
```typescript
// 2♦ : Piochez 1 carte supplémentaire au prochain tour
const twoOfDiamonds: EffectHandler = {
  execute: async (effect, context) => {
    const card = await deckService.drawCard(effect.casterId)
    if (card) {
      await handService.addCard(effect.casterId, card)
      return { success: true, message: 'Carte piochée' }
    }
    return { success: false, message: 'Deck vide' }
  }
}

// 5♦ : Regardez les 3 prochaines cartes de votre deck
const fiveOfDiamonds: EffectHandler = {
  execute: async (effect, context) => {
    const cards = await deckService.peek(effect.casterId, 3)
    return { success: true, data: { cards }, private: true }
  }
}

// 10♦ : Échangez 2 cartes de votre main avec votre deck
const tenOfDiamonds: EffectHandler = {
  execute: async (effect, context) => {
    // Nécessite interaction joueur
    await context.requestCardExchange(effect.casterId, 2)
    return { success: true, message: 'En attente de sélection' }
  }
}

// A♦ : Piochez 3 cartes, défaussez-en 2
const aceOfDiamonds: EffectHandler = {
  execute: async (effect, context) => {
    const drawn = await deckService.drawMultiple(effect.casterId, 3)
    await context.requestDiscard(effect.casterId, 2)
    return { success: true, message: '3 cartes piochées' }
  }
}
```
