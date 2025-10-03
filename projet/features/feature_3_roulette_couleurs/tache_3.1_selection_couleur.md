# Tâche 3.1 : Algorithme de sélection aléatoire de la couleur forte

## Objectif

Implémenter la roulette qui désigne aléatoirement la couleur dominante au début de chaque manche.

## Fonctionnement

### Sélection aléatoire

- 4 couleurs possibles : ♥️ Cœur, ♦️ Carreau, ♣️ Trèfle, ♠️ Pique
- Probabilité égale : 25% pour chaque couleur
- Génération cryptographiquement sûre (éviter la prédictibilité)

### Conséquences de la sélection

- **Couleur forte** : celle sélectionnée par la roulette
- **Couleur faible** : automatiquement la couleur opposée
- **Couleurs neutres** : les deux autres couleurs

## Actions à réaliser

### Backend

#### Service ColorRouletteService

```typescript
// app/Services/ColorRouletteService.ts
import crypto from "crypto";

class ColorRouletteService {
  // Sélectionne une couleur forte aléatoire
  spinRoulette(): CardSuit {
    const suits = [
      CardSuit.HEARTS,
      CardSuit.DIAMONDS,
      CardSuit.CLUBS,
      CardSuit.SPADES,
    ];
    const randomIndex = crypto.randomInt(0, 4);
    return suits[randomIndex];
  }

  // Retourne la couleur faible (opposée)
  getWeakColor(dominantColor: CardSuit): CardSuit {
    const opposites = {
      [CardSuit.HEARTS]: CardSuit.SPADES,
      [CardSuit.CLUBS]: CardSuit.DIAMONDS,
      [CardSuit.DIAMONDS]: CardSuit.CLUBS,
      [CardSuit.SPADES]: CardSuit.HEARTS,
    };
    return opposites[dominantColor];
  }

  // Retourne les deux couleurs neutres
  getNeutralColors(dominantColor: CardSuit): CardSuit[] {
    const weakColor = this.getWeakColor(dominantColor);
    const allSuits = [
      CardSuit.HEARTS,
      CardSuit.DIAMONDS,
      CardSuit.CLUBS,
      CardSuit.SPADES,
    ];
    return allSuits.filter(
      (suit) => suit !== dominantColor && suit !== weakColor
    );
  }

  // Retourne un résumé complet de la hiérarchie
  getColorHierarchy(dominantColor: CardSuit) {
    return {
      dominant: dominantColor,
      weak: this.getWeakColor(dominantColor),
      neutrals: this.getNeutralColors(dominantColor),
    };
  }
}
```

#### Intégration dans la manche

```typescript
// app/Services/RoundService.ts
async startNewRound(gameId: string) {
  const colorRoulette = new ColorRouletteService()
  const dominantColor = colorRoulette.spinRoulette()
  const weakColor = colorRoulette.getWeakColor(dominantColor)

  // Sauvegarder dans la BDD
  const round = await Round.create({
    gameId,
    roundNumber: currentRound + 1,
    dominantColor,
    weakColor,
    status: 'in_progress'
  })

  // Notifier tous les joueurs via WebSocket
  this.broadcastRouletteResult(gameId, {
    dominantColor,
    weakColor,
    neutrals: colorRoulette.getNeutralColors(dominantColor)
  })

  return round
}
```

#### Tests de distribution

```typescript
// tests/unit/ColorRoulette.spec.ts
test("La roulette a une distribution équitable", () => {
  const results = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
  const iterations = 10000;

  for (let i = 0; i < iterations; i++) {
    const result = colorRouletteService.spinRoulette();
    results[result]++;
  }

  // Vérifier que chaque couleur apparaît environ 25% du temps
  // Avec une marge d'erreur acceptable (23-27%)
  Object.values(results).forEach((count) => {
    expect(count).toBeGreaterThan(2300);
    expect(count).toBeLessThan(2700);
  });
});
```

### Frontend

#### Service ColorRouletteService

```typescript
// src/app/core/services/color-roulette.service.ts
import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ColorRouletteService {
  // Signals pour la couleur actuelle
  dominantColor = signal<CardSuit | null>(null);
  weakColor = signal<CardSuit | null>(null);
  neutralColors = signal<CardSuit[]>([]);

  // Mise à jour depuis le WebSocket
  updateFromServer(result: RouletteResult) {
    this.dominantColor.set(result.dominantColor);
    this.weakColor.set(result.weakColor);
    this.neutralColors.set(result.neutrals);
  }

  // Helpers pour l'affichage
  getColorLabel(suit: CardSuit): string {
    const labels = {
      hearts: "Cœur (Forte)",
      diamonds: "Carreau",
      clubs: "Trèfle",
      spades: "Pique (Faible)",
    };
    return labels[suit];
  }

  getColorClass(suit: CardSuit): string {
    if (suit === this.dominantColor()) return "text-yellow-500 font-bold";
    if (suit === this.weakColor()) return "text-gray-400 line-through";
    return "text-blue-500";
  }
}
```

#### Composant RouletteAnimation

```typescript
// src/app/features/game/components/roulette-animation/
@Component({
  selector: "app-roulette-animation",
  standalone: true,
  template: `
    <div class="roulette-container">
      <div class="roulette-wheel" [class.spinning]="isSpinning()">
        @for (suit of suits; track suit) {
        <div class="suit-section" [class.selected]="suit === selectedSuit()">
          <span [innerHTML]="getSuitIcon(suit)"></span>
        </div>
        }
      </div>

      @if (selectedSuit()) {
      <div class="result-display">
        <h3>Couleur forte : {{ getSuitName(selectedSuit()!) }}</h3>
        <h4>Couleur faible : {{ getSuitName(weakSuit()!) }}</h4>
      </div>
      }
    </div>
  `,
})
export class RouletteAnimationComponent {
  isSpinning = signal(false);
  selectedSuit = signal<CardSuit | null>(null);
  weakSuit = signal<CardSuit | null>(null);

  suits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];

  // Animation de la roulette
  async animateRoulette(finalSuit: CardSuit, weakSuit: CardSuit) {
    this.isSpinning.set(true);

    // Animation de rotation (2 secondes)
    await this.delay(2000);

    this.isSpinning.set(false);
    this.selectedSuit.set(finalSuit);
    this.weakSuit.set(weakSuit);
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

#### CSS pour l'animation

```css
/* Roulette en rotation */
.roulette-wheel.spinning {
  animation: spin 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(1800deg); /* 5 tours */
  }
}

.suit-section.selected {
  @apply scale-125 bg-yellow-400 rounded-full;
  animation: pulse 1s ease-in-out infinite;
}
```

## Points d'attention

- Utiliser `crypto.randomInt()` et non `Math.random()` (plus sûr)
- Sauvegarder le résultat en BDD pour traçabilité
- L'animation côté client est purement visuelle (résultat déjà décidé)
- Tous les clients doivent voir le même résultat (synchronisation WebSocket)
- Logger chaque roulette pour statistiques (vérifier équité sur le long terme)

## Résultat attendu

- Sélection aléatoire équitable et sécurisée
- Animation de roulette fluide et engageante
- Affichage clair de la hiérarchie des couleurs
- Tests statistiques validant l'équité
- Synchronisation parfaite entre tous les joueurs
