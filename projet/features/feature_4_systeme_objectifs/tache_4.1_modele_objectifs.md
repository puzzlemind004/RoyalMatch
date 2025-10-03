# Tâche 4.1 : Modèle de données des objectifs

## Objectif
Créer la structure de données pour les objectifs que les joueurs doivent remplir.

## Types d'objectifs

### Objectifs basés sur les plis
- Gagner exactement X plis (X = 0, 1, 2, 3, 4, 5+)
- Gagner au moins X plis
- Gagner au plus X plis
- Perdre tous les plis
- Gagner le premier et dernier pli
- Gagner X plis consécutifs

### Objectifs basés sur les couleurs
- Ne pas gagner de carte rouge
- Ne pas gagner de carte noire
- Gagner au moins X plis avec la couleur forte
- Ne jamais jouer de couleur faible
- Gagner un pli de chaque couleur

### Objectifs basés sur les valeurs
- Gagner tous les As
- Ne gagner aucune figure (J, Q, K)
- Gagner le pli le plus fort (As)
- Gagner uniquement avec des cartes paires (2, 4, 6, 8, 10, Q)
- Total des valeurs gagnées < ou > X

### Objectifs mixtes/spéciaux
- Finir avec exactement 5 cartes en main
- Activer tous les effets de ses cartes
- Gagner sans jamais activer d'effet
- Être le premier ou le dernier à jouer sa dernière carte

## Structure de données

### Backend
```typescript
// app/Types/Objective.ts
export enum ObjectiveCategory {
  TRICKS = 'tricks',           // Basé sur le nombre de plis
  COLORS = 'colors',           // Basé sur les couleurs
  VALUES = 'values',           // Basé sur les valeurs de cartes
  SPECIAL = 'special'          // Objectifs spéciaux
}

export enum ObjectiveDifficulty {
  EASY = 'easy',               // 1-2 points
  MEDIUM = 'medium',           // 3-4 points
  HARD = 'hard',               // 5-7 points
  VERY_HARD = 'very_hard'      // 8-10 points
}

export interface ObjectiveDefinition {
  id: string
  name: string
  description: string
  category: ObjectiveCategory
  difficulty: ObjectiveDifficulty
  points: number
  checkCompletion: (playerState: PlayerRoundState) => boolean
  getProgress?: (playerState: PlayerRoundState) => string
}

export interface PlayerObjective {
  id: string
  playerId: string
  roundId: string
  objective: ObjectiveDefinition
  isCompleted: boolean
  pointsEarned: number
  progress: any // données de progression
}

export interface PlayerRoundState {
  playerId: string
  tricksWon: number
  cardsWon: Card[]
  cardsPlayed: Card[]
  effectsActivated: number
  remainingCards: number
  // ... autres stats utiles
}
```

### Exemples de définitions
```typescript
// app/Data/objectives.ts
export const OBJECTIVES: ObjectiveDefinition[] = [
  {
    id: 'win_exactly_3',
    name: 'Trio gagnant',
    description: 'Gagnez exactement 3 plis',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 3,
    checkCompletion: (state) => state.tricksWon === 3
  },
  {
    id: 'no_red_cards',
    name: 'Anti-rouge',
    description: 'Ne gagnez aucune carte rouge',
    category: ObjectiveCategory.COLORS,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 4,
    checkCompletion: (state) => {
      return !state.cardsWon.some(card =>
        card.suit === CardSuit.HEARTS || card.suit === CardSuit.DIAMONDS
      )
    }
  },
  {
    id: 'win_all_aces',
    name: 'As de la victoire',
    description: 'Gagnez tous les plis contenant un As',
    category: ObjectiveCategory.VALUES,
    difficulty: ObjectiveDifficulty.HARD,
    points: 6,
    checkCompletion: (state) => {
      const acesWon = state.cardsWon.filter(card => card.value === CardValue.ACE)
      return acesWon.length === 4 // Les 4 As
    }
  },
  {
    id: 'lose_all_tricks',
    name: 'Le fantôme',
    description: 'Ne gagnez aucun pli',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.HARD,
    points: 7,
    checkCompletion: (state) => state.tricksWon === 0
  }
  // ... 30-50 objectifs au total
]
```

## Points d'attention
- Prévoir 30-50 objectifs variés pour la rejouabilité
- Équilibrer la difficulté (certains faciles, d'autres très durs)
- Les points attribués doivent refléter la difficulté
- Certains objectifs sont contradictoires (choix stratégique)
- La fonction checkCompletion doit être performante
- Prévoir un système de progression (voir l'avancement)

## Résultat attendu
- Base de 30-50 objectifs définis
- Structure de données claire et extensible
- Fonction de vérification pour chaque objectif
- Catégorisation et points équilibrés
- Documentation de chaque objectif
