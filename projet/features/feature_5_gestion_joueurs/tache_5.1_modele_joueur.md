# Tâche 5.1 : Modèle de données joueur

## Structure
```typescript
interface Player {
  id: string
  username: string
  email: string
  totalScore: number
  hand: Card[]
  deck: Card[]
  objectives: ObjectiveDefinition[]
  stats: PlayerStats
}
```

## Actions
- Créer le modèle Lucid Player
- Méthodes pour gérer main et deck
- Relations avec games et rounds
