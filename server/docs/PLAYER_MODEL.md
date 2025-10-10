# Player Model Documentation

## Vue d'ensemble

Le modèle `Player` (alias de `GamePlayer`) représente un joueur dans une partie de RoyalMatch. Il gère :
- La main du joueur (cartes actuellement en main)
- Le deck personnel du joueur
- Les statistiques de jeu
- Les relations avec les objectifs et les cartes jouées

## Structure des données

### Colonnes principales

```typescript
interface GamePlayer {
  id: string
  gameId: string
  userId: string | null  // null pour les joueurs IA
  isAi: boolean
  playerOrder: number
  totalScore: number
  hand: Card[]           // Main actuelle (JSONB)
  deck: Card[]           // Deck personnel (JSONB)
  stats: PlayerStats     // Statistiques (JSONB)
  createdAt: DateTime
}
```

### Interface PlayerStats

```typescript
interface PlayerStats {
  tricksWon: number              // Nombre de plis remportés
  cardsPlayed: number            // Nombre de cartes jouées
  effectsActivated: number       // Nombre d'effets activés
  objectivesCompleted: number    // Nombre d'objectifs complétés
  maxConsecutiveTricks: number   // Maximum de plis consécutifs
  totalCardValue: number         // Valeur totale des cartes gagnées
  roundsPlayed: number           // Nombre de manches jouées
}
```

## Méthodes disponibles

### Gestion de la main

```typescript
// Récupérer la main
const hand = player.getHand()

// Ajouter une carte à la main
player.addCardToHand(card)

// Retirer une carte de la main
const removedCard = player.removeCardFromHand(cardId)

// Vérifier si une carte est en main
const hasCard = player.hasCardInHand(cardId)
```

### Gestion du deck

```typescript
// Initialiser le deck
player.initializeDeck(cards)

// Mélanger le deck
player.shuffleDeck()

// Piocher une carte (du deck vers la main)
const drawnCard = player.drawCard()

// Récupérer le deck
const deck = player.getDeck()
```

### Gestion des statistiques

```typescript
// Initialiser les stats
player.initializeStats()

// Récupérer les stats
const stats = player.getStats()

// Mettre à jour une stat spécifique
player.updateStat('tricksWon', 5)

// Incrémenter une stat
player.incrementStat('tricksWon')        // +1
player.incrementStat('cardsPlayed', 3)   // +3
```

### Gestion des objectifs

```typescript
// Vérifier si un objectif est complété
const isCompleted = player.hasCompletedObjective('win_exactly_3_tricks')

// Compter les objectifs complétés
const count = player.getCompletedObjectivesCount()
```

### Utilitaires

```typescript
// Obtenir le nom d'affichage
const displayName = player.getDisplayName()
// Retourne: "username" pour les humains, "AI Player X" pour les IA
```

## Relations

```typescript
// Charger les relations
await player.load('game')
await player.load('user')
await player.load('objectives')
await player.load('playedCards')

// Accéder aux relations
const game = player.game
const user = player.user
const objectives = player.objectives
const playedCards = player.playedCards
```

## Exemples d'utilisation

### Créer un nouveau joueur

```typescript
import Player from '#models/player'

const player = await Player.create({
  gameId: game.id,
  userId: user.id,
  isAi: false,
  playerOrder: 1,
  totalScore: 0,
  hand: [],
  deck: [],
  stats: DEFAULT_PLAYER_STATS
})
```

### Distribuer des cartes

```typescript
// Initialiser le deck du joueur
const fullDeck = deckService.generateDeck()
player.initializeDeck(fullDeck)
player.shuffleDeck()

// Piocher 7 cartes de départ
for (let i = 0; i < 7; i++) {
  player.drawCard()
}

await player.save()
```

### Jouer une carte

```typescript
// Retirer la carte de la main
const playedCard = player.removeCardFromHand(cardId)

if (playedCard) {
  // Mettre à jour les stats
  player.incrementStat('cardsPlayed')

  if (playedCard.effect.type !== 'none') {
    player.incrementStat('effectsActivated')
  }

  await player.save()
}
```

### Gagner un pli

```typescript
// Incrémenter le nombre de plis gagnés
player.incrementStat('tricksWon')

// Mettre à jour le score du tour
player.totalScore += trickPoints

// Calculer la valeur des cartes gagnées
const cardValues = trickCards.reduce((sum, card) => sum + card.numericValue, 0)
player.incrementStat('totalCardValue', cardValues)

await player.save()
```

## Tests

Les tests unitaires se trouvent dans `tests/unit/game_player.spec.ts` et couvrent :
- ✅ Gestion de la main (ajout, retrait, vérification)
- ✅ Gestion du deck (initialisation, pioche, mélange)
- ✅ Gestion des statistiques (initialisation, mise à jour, incrémentation)

## Notes importantes

1. **Persistance** : Les méthodes de modification (addCardToHand, drawCard, etc.) ne sauvegardent PAS automatiquement en base. Il faut appeler `player.save()` après les modifications.

2. **Relations** : Les méthodes qui utilisent les relations (hasCompletedObjective, getDisplayName) nécessitent que les relations soient préchargées avec `load()` ou en eager loading.

3. **Immutabilité du deck** : Quand vous appelez `initializeDeck()`, une copie du tableau est créée pour éviter les modifications accidentelles du tableau original.

4. **Sérialization JSONB** : Les champs `hand`, `deck` et `stats` sont automatiquement sérialisés/désérialisés en JSON grâce aux decorateurs `@column()`.
