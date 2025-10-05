# 🎴 RÈGLES DÉFINITIVES DES COULEURS - RoyalMatch

## 🔑 Règle fondamentale

**Entre deux couleurs neutres de même valeur, c'est la couleur du MÊME TYPE (rouge/noir) que la couleur forte qui gagne.**

## 📊 Les 4 configurations possibles

### Configuration 1 : ♥️ Cœur forte → ♠️ Pique faible

**Hiérarchie** :
1. ♥️ Cœur (forte) - bat TOUT
2. ♦️ Carreau (neutre ROUGE) - bat ♣️ et ♠️
3. ♣️ Trèfle (neutre NOIR) - bat ♠️ uniquement
4. ♠️ Pique (faible) - perd contre TOUT

**Exemple avec valeur égale (7)** :
- 7♥️ vs 7♦️ → ♥️ gagne (forte bat neutre)
- 7♥️ vs 7♣️ → ♥️ gagne (forte bat neutre)
- 7♥️ vs 7♠️ → ♥️ gagne (forte bat faible)
- 7♦️ vs 7♣️ → ♦️ gagne (rouge neutre car forte est rouge)
- 7♦️ vs 7♠️ → ♦️ gagne (neutre bat faible)
- 7♣️ vs 7♠️ → ♣️ gagne (neutre bat faible)

---

### Configuration 2 : ♦️ Carreau forte → ♣️ Trèfle faible

**Hiérarchie** :
1. ♦️ Carreau (forte) - bat TOUT
2. ♥️ Cœur (neutre ROUGE) - bat ♠️ et ♣️
3. ♠️ Pique (neutre NOIR) - bat ♣️ uniquement
4. ♣️ Trèfle (faible) - perd contre TOUT

**Exemple avec valeur égale (10)** :
- 10♦️ vs 10♥️ → ♦️ gagne (forte bat neutre)
- 10♦️ vs 10♠️ → ♦️ gagne (forte bat neutre)
- 10♦️ vs 10♣️ → ♦️ gagne (forte bat faible)
- 10♥️ vs 10♠️ → ♥️ gagne (rouge neutre car forte est rouge)
- 10♥️ vs 10♣️ → ♥️ gagne (neutre bat faible)
- 10♠️ vs 10♣️ → ♠️ gagne (neutre bat faible)

---

### Configuration 3 : ♣️ Trèfle forte → ♦️ Carreau faible

**Hiérarchie** :
1. ♣️ Trèfle (forte) - bat TOUT
2. ♠️ Pique (neutre NOIR) - bat ♥️ et ♦️
3. ♥️ Cœur (neutre ROUGE) - bat ♦️ uniquement
4. ♦️ Carreau (faible) - perd contre TOUT

**Exemple avec valeur égale (5)** :
- 5♣️ vs 5♠️ → ♣️ gagne (forte bat neutre)
- 5♣️ vs 5♥️ → ♣️ gagne (forte bat neutre)
- 5♣️ vs 5♦️ → ♣️ gagne (forte bat faible)
- 5♠️ vs 5♥️ → ♠️ gagne (noir neutre car forte est noire)
- 5♠️ vs 5♦️ → ♠️ gagne (neutre bat faible)
- 5♥️ vs 5♦️ → ♥️ gagne (neutre bat faible)

---

### Configuration 4 : ♠️ Pique forte → ♥️ Cœur faible

**Hiérarchie** :
1. ♠️ Pique (forte) - bat TOUT
2. ♣️ Trèfle (neutre NOIR) - bat ♦️ et ♥️
3. ♦️ Carreau (neutre ROUGE) - bat ♥️ uniquement
4. ♥️ Cœur (faible) - perd contre TOUT

**Exemple avec valeur égale (A)** :
- A♠️ vs A♣️ → ♠️ gagne (forte bat neutre)
- A♠️ vs A♦️ → ♠️ gagne (forte bat neutre)
- A♠️ vs A♥️ → ♠️ gagne (forte bat faible)
- A♣️ vs A♦️ → ♣️ gagne (noir neutre car forte est noire)
- A♣️ vs A♥️ → ♣️ gagne (neutre bat faible)
- A♦️ vs A♥️ → ♦️ gagne (neutre bat faible)

---

## 💻 Implémentation

### Code TypeScript

```typescript
function compareNeutralColors(
  card1: Card,
  card2: Card,
  dominantColor: CardSuit
): number {
  // Les deux cartes sont neutres (ni forte ni faible)
  const isDominantRed = isRedSuit(dominantColor)
  const isCard1Red = isRedSuit(card1.suit)

  // Si couleur forte est rouge → rouge gagne
  // Si couleur forte est noire → noir gagne
  if (isCard1Red === isDominantRed) {
    return 1 // card1 gagne
  } else {
    return -1 // card2 gagne
  }
}
```

### Fonction complète de comparaison

```typescript
function compareCards(card1: Card, card2: Card, dominantColor: CardSuit): number {
  // 1. Comparer les valeurs
  if (card1.numericValue !== card2.numericValue) {
    return card1.numericValue > card2.numericValue ? 1 : -1
  }

  // 2. Couleur forte bat tout
  const weakColor = getOppositeColor(dominantColor)
  if (card1.suit === dominantColor) return 1
  if (card2.suit === dominantColor) return -1

  // 3. Couleur faible perd contre tout
  if (card1.suit === weakColor) return -1
  if (card2.suit === weakColor) return 1

  // 4. Les deux sont neutres → même couleur que forte gagne
  const isDominantRed = isRedSuit(dominantColor)
  const isCard1Red = isRedSuit(card1.suit)

  return (isCard1Red === isDominantRed) ? 1 : -1
}
```

---

## ✅ Tests de validation

### Test 1 : Vérifier toutes les combinaisons

```typescript
test('Hiérarchie Cœur forte', () => {
  const dominantColor = CardSuit.HEARTS

  // Neutre vs Neutre
  expect(compareCards(
    { suit: CardSuit.DIAMONDS, value: 7 }, // rouge neutre
    { suit: CardSuit.CLUBS, value: 7 },    // noir neutre
    dominantColor
  )).toBe(1) // Carreau (rouge) gagne car Cœur (rouge) est forte
})

test('Hiérarchie Trèfle forte', () => {
  const dominantColor = CardSuit.CLUBS

  // Neutre vs Neutre
  expect(compareCards(
    { suit: CardSuit.SPADES, value: 7 },   // noir neutre
    { suit: CardSuit.HEARTS, value: 7 },   // rouge neutre
    dominantColor
  )).toBe(1) // Pique (noir) gagne car Trèfle (noir) est forte
})
```

### Test 2 : Matrice complète

Pour chaque couleur forte, tester les 6 combinaisons possibles de paires :
- Forte vs Neutre1
- Forte vs Neutre2
- Forte vs Faible
- Neutre1 vs Neutre2 ⭐ (le test critique)
- Neutre1 vs Faible
- Neutre2 vs Faible

---

## 🎯 Résumé ultra-simple

> **"La couleur neutre qui a la même couleur (rouge/noir) que la forte, bat l'autre neutre"**

- Forte ROUGE → neutre ROUGE gagne
- Forte NOIRE → neutre NOIRE gagne

---

*Document de référence final - 2025-01-03*
