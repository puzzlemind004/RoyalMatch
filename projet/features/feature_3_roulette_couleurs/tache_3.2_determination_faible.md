# Tâche 3.2 : Détermination de la couleur faible (opposée)

## Objectif

Définir et implémenter les règles d'opposition entre les couleurs.

## Relations d'opposition

### Paires opposées

- ♥️ **Cœur** ↔ ♣️ **Pique** (Rouge ↔ Noir)
- ♦️ **Carreau** ↔ ♠️ **Trèfle** (Rouge ↔ Noir)

### Logique

- Les opposées sont toujours de couleur différente (rouge/noir)
- Si Cœur est forte → Pique est faible
- Si Carreau est forte → Trèfle est faible
- Et vice-versa

## Actions à réaliser

### Backend

#### Constantes de mapping

```typescript
// app/Constants/ColorRelations.ts
export const COLOR_OPPOSITES: Record<CardSuit, CardSuit> = {
  [CardSuit.HEARTS]: CardSuit.SPADES,
  [CardSuit.CLUBS]: CardSuit.DIAMONDS,
  [CardSuit.DIAMONDS]: CardSuit.CLUBS,
  [CardSuit.SPADES]: CardSuit.HEARTS,
};

export const COLOR_TYPE: Record<CardSuit, "red" | "black"> = {
  [CardSuit.HEARTS]: "red",
  [CardSuit.DIAMONDS]: "red",
  [CardSuit.CLUBS]: "black",
  [CardSuit.SPADES]: "black",
};

export function getOppositeColor(suit: CardSuit): CardSuit {
  return COLOR_OPPOSITES[suit];
}

export function areOpposites(suit1: CardSuit, suit2: CardSuit): boolean {
  return COLOR_OPPOSITES[suit1] === suit2;
}

export function getColorType(suit: CardSuit): "red" | "black" {
  return COLOR_TYPE[suit];
}
```

#### Tests

```typescript
// tests/unit/ColorRelations.spec.ts
test("Les oppositions sont cohérentes", () => {
  expect(getOppositeColor(CardSuit.HEARTS)).toBe(CardSuit.SPADES);
  expect(getOppositeColor(CardSuit.CLUBS)).toBe(CardSuit.DIAMONDS);
  expect(getOppositeColor(CardSuit.DIAMONDS)).toBe(CardSuit.CLUBS);
  expect(getOppositeColor(CardSuit.SPADES)).toBe(CardSuit.HEARTS);
});

test("Les opposées sont de couleur différente", () => {
  expect(getColorType(CardSuit.HEARTS)).toBe("red");
  expect(getColorType(getOppositeColor(CardSuit.HEARTS))).toBe("black");

  expect(getColorType(CardSuit.DIAMONDS)).toBe("red");
  expect(getColorType(getOppositeColor(CardSuit.DIAMONDS))).toBe("black");
});
```

### Frontend

#### Helpers visuels

```typescript
// src/app/core/utils/color-relations.ts
export function getColorBadge(
  suit: CardSuit,
  dominantColor: CardSuit
): "dominant" | "weak" | "neutral" {
  if (suit === dominantColor) return "dominant";
  if (suit === getOppositeColor(dominantColor)) return "weak";
  return "neutral";
}

export function getColorBadgeClass(
  badge: "dominant" | "weak" | "neutral"
): string {
  const classes = {
    dominant: "bg-yellow-500 text-black font-bold",
    weak: "bg-gray-400 text-white opacity-50",
    neutral: "bg-blue-500 text-white",
  };
  return classes[badge];
}
```

#### Composant ColorHierarchy

```typescript
// src/app/features/game/components/color-hierarchy/
@Component({
  selector: "app-color-hierarchy",
  standalone: true,
  template: `
    <div class="flex gap-4 justify-center p-4">
      @for (suit of allSuits; track suit) {
      <div class="flex flex-col items-center">
        <span class="text-4xl" [innerHTML]="getSuitIcon(suit)"></span>
        <span [class]="getBadgeClass(suit)">
          {{ getBadgeText(suit) }}
        </span>
      </div>
      }
    </div>

    <div class="text-center mt-4 text-sm text-gray-600">
      Forte bat tout • Neutre bat Faible • Même couleur que forte gagne entre neutres
    </div>
  `,
})
export class ColorHierarchyComponent {
  dominantColor = input.required<CardSuit>();
  weakColor = computed(() => getOppositeColor(this.dominantColor()));

  allSuits = [
    CardSuit.HEARTS,
    CardSuit.DIAMONDS,
    CardSuit.CLUBS,
    CardSuit.SPADES,
  ];

  getBadgeText(suit: CardSuit): string {
    if (suit === this.dominantColor()) return "FORTE";
    if (suit === this.weakColor()) return "FAIBLE";
    return "Neutre";
  }

  getBadgeClass(suit: CardSuit): string {
    const badge = getColorBadge(suit, this.dominantColor());
    return getColorBadgeClass(badge);
  }
}
```

## Points d'attention

- Les relations sont fixes et ne changent jamais
- Utiliser des constantes pour éviter les erreurs
- Tester exhaustivement (seulement 4 couleurs, facile à couvrir)
- L'affichage visuel doit être immédiatement compréhensible

## Résultat attendu

- Relations d'opposition claires et testées
- Affichage visuel de la hiérarchie
- Pas d'ambiguïté possible
- 100% de couverture de tests
