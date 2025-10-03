# Tâche 2.1 : Modèle de données des cartes

## Objectif

Créer la structure de données pour représenter les cartes du jeu avec leurs valeurs, couleurs et effets.

## Structure des cartes

### Énumération des valeurs

- 2, 3, 4, 5, 6, 7, 8, 9, 10, Valet (J), Dame (Q), Roi (K), As (A)
- Ordre de force : 2 < 3 < 4 < 5 < 6 < 7 < 8 < 9 < 10 < J < Q < K < A

### Énumération des couleurs

- ♥️ Cœur (Hearts) - Rouge
- ♦️ Carreau (Diamonds) - Rouge
- ♣️ Trèfle (Clubs) - Noir
- ♠️ Pique (Spades) - Noir

### Relations de couleurs

- Cœur ↔ Pique (opposées)
- Carreau ↔ Trèfle (opposées)

## Actions à réaliser

### Backend (AdonisJS)

#### Types TypeScript

```typescript
// app/Types/Card.ts
export enum CardSuit {
  HEARTS = "hearts",
  DIAMONDS = "diamonds",
  CLUBS = "clubs",
  SPADES = "spades",
}

export enum CardValue {
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  TEN = "10",
  JACK = "J",
  QUEEN = "Q",
  KING = "K",
  ACE = "A",
}

export interface CardEffect {
  type: string;
  power: number;
  description: string;
  target?: "self" | "opponent" | "all" | "random";
}

export interface Card {
  id: string;
  value: CardValue;
  suit: CardSuit;
  effect: CardEffect;
  numericValue: number; // pour comparaisons (2-14)
}
```

#### Service de création du deck

```typescript
// app/Services/DeckService.ts
- Méthode createStandardDeck() : retourne 52 cartes
- Méthode shuffleDeck(cards: Card[]) : mélange un deck
- Méthode distributeCards(deck: Card[], playerCount: number) : distribue 13 cartes par joueur
```

### Frontend (Angular)

#### Interfaces TypeScript

```typescript
// src/app/models/card.model.ts
- Reprendre les mêmes interfaces que le backend
- Ajouter des propriétés d'affichage (imageUrl, displayName)
```

#### Composant Card

```typescript
// src/app/shared/components/card/card.component.ts
- Input : card: Card
- Input : faceUp: boolean
- Input : selectable: boolean
- Output : cardSelected: EventEmitter<Card>
- Affichage avec TailwindCSS
- Animations de retournement
```

### Données des effets

Créer un fichier JSON avec les 52 effets (un par carte) :

- Effets Cœur : bonus objectifs, protection
- Effets Carreau : pioche, manipulation deck
- Effets Trèfle : aléatoire, chance
- Effets Pique : attaque, perturbation adversaires

Puissance des effets :

- 2-5 : effets faibles
- 6-9 : effets moyens
- 10-K : effets forts
- As : effets très puissants

## Points d'attention

- Les cartes sont immuables une fois créées
- Prévoir un système de cache pour les images des cartes
- Les effets doivent être sérialisables (JSON) pour la BDD
- Utiliser des constantes pour éviter les magic strings
- Prévoir la localisation (FR/EN) des noms et descriptions

## Résultat attendu

- 52 cartes complètes avec leurs effets définis
- Service de création et manipulation de deck fonctionnel
- Composant d'affichage de carte réutilisable
- Types TypeScript partagés entre front et back
- Documentation des effets de chaque carte
