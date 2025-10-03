# Tâche 2.3 : Logique de comparaison des cartes

## Objectif

Implémenter la logique de comparaison des cartes pour déterminer le gagnant d'un pli, en tenant compte de la roulette des couleurs.

## Règles de comparaison

### Priorité 1 : Valeur numérique

- As (14) > Roi (13) > Dame (12) > Valet (11) > 10 > 9 > ... > 2
- Si deux cartes ont des valeurs différentes, la plus haute gagne

### Priorité 2 : Couleur dominante/faible (en cas d'égalité de valeur)

- **Couleur forte** (désignée par la roulette) : bat toutes les autres
- **Couleur faible** (opposée à la forte) : perd contre toutes
- **Couleurs neutres** (les 2 autres) : se départagent par la couleur (rouge/noir) de la couleur forte

### Relations de couleurs

- **Opposées** : Cœur ↔ Pique, Carreau ↔ Trèfle

### Hiérarchie complète (exemple : Cœur = forte)

1. Cœur (forte) - bat tout
2. Carreau (rouge neutre) - bat Trèfle et Pique
3. Trèfle (noir neutre) - bat Pique
4. Pique (faible) - perd contre tout

### Hiérarchie complète (exemple : Trèfle = forte)

1. Trèfle (forte) - bat tout
2. Pique (noir neutre) - bat Cœur (car Trèfle noire est forte)
3. Cœur (rouge neutre) - bat Carreau
4. Carreau (faible) - perd contre tout

### Principe : AUCUNE égalité possible

Il existe TOUJOURS un gagnant grâce au système forte/faible/rouge/noir.

## Actions à réaliser

### Backend

#### Service CardComparison

```typescript
// app/Services/CardComparisonService.ts

class CardComparisonService {
  // Détermine quelle carte est la plus forte
  compareCards(card1: Card, card2: Card, dominantColor: CardSuit): -1 | 0 | 1;

  // Trouve le gagnant parmi plusieurs cartes
  findWinner(
    playedCards: Map<PlayerId, Card>,
    dominantColor: CardSuit
  ): PlayerId;

  // Vérifie la relation de couleurs
  private getColorRelation(
    color1: CardSuit,
    color2: CardSuit,
    dominantColor: CardSuit
  ): "stronger" | "weaker" | "equal";

  // Retourne la couleur opposée
  getOppositeColor(color: CardSuit): CardSuit;

  // Vérifie si une couleur est rouge
  isRedSuit(color: CardSuit): boolean;
}
```

#### Algorithme de comparaison

```typescript
function compareCards(card1, card2, dominantColor) {
  // 1. Comparer les valeurs numériques
  if (card1.numericValue !== card2.numericValue) {
    return card1.numericValue > card2.numericValue ? 1 : -1;
  }

  // 2. Valeurs égales → comparer les couleurs
  const weakColor = getOppositeColor(dominantColor);

  // Si une des deux est forte
  if (card1.suit === dominantColor) return 1;
  if (card2.suit === dominantColor) return -1;

  // Si une des deux est faible
  if (card1.suit === weakColor) return -1;
  if (card2.suit === weakColor) return 1;

  // Les deux sont neutres → la couleur du même type que la forte gagne
  const isDominantRed = isRedSuit(dominantColor);
  const isCard1Red = isRedSuit(card1.suit);

  // Si couleur forte est rouge, rouge gagne. Si forte est noire, noir gagne
  return (isCard1Red === isDominantRed) ? 1 : -1;
}
```

#### Tests unitaires

```typescript
// tests/unit/CardComparison.spec.ts
- Tester toutes les combinaisons de couleurs
- Tester avec différentes couleurs dominantes
- Vérifier qu'il n'y a jamais d'égalité
- Tester avec 2, 3, 4, 5, 6 joueurs
```

### Frontend

#### Service de comparaison

```typescript
// src/app/core/services/card-comparison.service.ts
- Même logique que le backend
- Utilisé pour l'affichage prédictif (avant révélation)
- Animation de la carte gagnante
```

#### Composant TrickWinner

```typescript
// src/app/shared/components/trick-winner/
- Affiche visuellement quelle carte a gagné
- Animation de la carte gagnante qui "prend" les autres
- Effet visuel selon la raison (valeur > couleur forte > rouge/noir)
```

#### Indicateurs visuels

- Badge "Forte" sur les cartes de la couleur dominante
- Badge "Faible" sur les cartes de la couleur opposée
- Code couleur pour faciliter la lecture

## Points d'attention

- La logique doit être IDENTIQUE front/back (éviter désynchronisation)
- Prévoir des logs détaillés pour comprendre qui gagne et pourquoi
- Optimiser les performances (cette fonction est appelée très souvent)
- Gérer le cas de plusieurs cartes identiques (impossible en jeu normal, mais à gérer)
- Documentation claire de l'algorithme avec exemples

## Cas de test à valider

### Exemple 1 : Cœur = forte, Pique = faible

- 10♥️ vs 10♦️ → 10♥️ gagne (couleur forte)
- 10♦️ vs 10♣️ → 10♦️ gagne (coeur fort => rouge > noir)
- 10♠️ vs 10♣️ → 10♣️ gagne (neutre > faible)
- A♣️ vs 2♥️ → A♣️ gagne (valeur prime sur couleur : 14 > 2)

### Exemple 2 : Pique = forte, Coeur = faible

- 5♠️ vs 5♣️ → 5♠️ gagne (couleur forte)
- 5♦️ vs 5♣️ → 5♣️ gagne (pique fort => noir > rouge)
- 5♥️ vs 5♦️ → 5♦️ gagne (faible < neutre)

## Résultat attendu

- Service de comparaison fonctionnel et testé
- Aucune égalité possible
- Performance optimale (< 1ms par comparaison)
- Interface visuelle claire du gagnant
- 100% de couverture de tests sur cette logique critique
