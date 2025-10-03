# Tâche 11.1 : Architecture de base de l'IA

## Structure
```typescript
interface AIPlayer {
  id: string
  difficulty: 'easy' | 'medium' | 'hard'
  name: string
  strategy: AIStrategy
}

interface AIStrategy {
  selectObjectives(offered: ObjectiveDefinition[]): ObjectiveDefinition[]
  selectStartingHand(cards: Card[]): Card[]
  selectCardToPlay(gameState: GameState, hand: Card[]): { card: Card, activateEffect: boolean }
  selectEffectTarget(effect: CardEffect, gameState: GameState): string[]
}

abstract class BaseAI implements AIStrategy {
  protected rng: RandomNumberGenerator

  constructor(protected difficulty: string) {
    this.rng = new RandomNumberGenerator()
  }

  abstract selectObjectives(offered: ObjectiveDefinition[]): ObjectiveDefinition[]
  abstract selectStartingHand(cards: Card[]): Card[]
  abstract selectCardToPlay(gameState: GameState, hand: Card[]): PlayDecision
  abstract selectEffectTarget(effect: CardEffect, gameState: GameState): string[]

  protected calculateCardValue(card: Card, gameState: GameState): number {
    // Logique de base commune
  }
}
```
