# Tâche 3.4 : Interface de visualisation de la roulette

## Objectif
Créer une interface visuelle attrayante pour la roulette des couleurs en début de manche.

## Design de l'interface

### Animation de la roulette
- Roue avec les 4 couleurs (segments égaux)
- Animation de rotation (2-3 secondes)
- Ralentissement progressif (ease-out)
- Arrêt sur la couleur sélectionnée
- Effet visuel de sélection (lueur, pulsation)

### Affichage du résultat
- Couleur forte mise en avant (grande, brillante)
- Couleur faible grisée/barrée
- Couleurs neutres avec indicateur visuel
- Légende explicative

## Actions à réaliser

### Frontend

#### Composant RouletteWheel
```typescript
// src/app/features/game/components/roulette-wheel/roulette-wheel.component.ts
@Component({
  selector: 'app-roulette-wheel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="roulette-container">
      <!-- Indicateur de sélection (flèche) -->
      <div class="selector-arrow">▼</div>

      <!-- Roue -->
      <div
        class="roulette-wheel"
        [class.spinning]="isSpinning()"
        [style.transform]="getRotation()"
      >
        @for (suit of suits; track suit; let i = $index) {
          <div
            class="wheel-segment"
            [class]="getSegmentClass(suit)"
            [style.transform]="'rotate(' + (i * 90) + 'deg)'"
          >
            <div class="segment-content" [innerHTML]="getSuitIcon(suit)"></div>
          </div>
        }
      </div>

      <!-- Résultat -->
      @if (selectedSuit() && !isSpinning()) {
        <div class="result-panel" @fadeIn>
          <h2 class="text-2xl font-bold mb-4">Hiérarchie des couleurs</h2>

          <div class="hierarchy-display grid grid-cols-2 gap-4">
            <!-- Couleur forte -->
            <div class="dominant-card">
              <span [innerHTML]="getSuitIcon(selectedSuit()!)" class="text-6xl"></span>
              <span class="badge bg-yellow-500">FORTE</span>
              <p class="text-sm">Bat toutes les autres</p>
            </div>

            <!-- Couleur faible -->
            <div class="weak-card opacity-50">
              <span [innerHTML]="getSuitIcon(weakSuit()!)" class="text-6xl"></span>
              <span class="badge bg-gray-400">FAIBLE</span>
              <p class="text-sm">Perd contre toutes</p>
            </div>

            <!-- Couleurs neutres -->
            @for (suit of neutralSuits(); track suit) {
              <div class="neutral-card">
                <span [innerHTML]="getSuitIcon(suit)" class="text-4xl"></span>
                <span class="badge bg-blue-500">Neutre</span>
                <p class="text-sm">{{ getColorType(suit) === 'red' ? 'Rouge' : 'Noir' }}</p>
              </div>
            }
          </div>

          <div class="info-box mt-4">
            <p class="text-sm text-gray-600">
              En cas de valeurs égales : Forte > Neutre > Faible<br>
              Entre neutres : Rouge bat Noir
            </p>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .roulette-container {
      @apply relative flex flex-col items-center gap-8 p-8;
    }

    .selector-arrow {
      @apply text-4xl text-yellow-500 animate-bounce;
    }

    .roulette-wheel {
      @apply relative w-64 h-64 rounded-full border-4 border-gray-800;
      transition: transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    }

    .roulette-wheel.spinning {
      animation: spin 3s cubic-bezier(0.17, 0.67, 0.12, 0.99);
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(1800deg); }
    }

    .wheel-segment {
      @apply absolute w-full h-full;
      clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%);
    }

    .wheel-segment:nth-child(1) { @apply bg-red-500; }
    .wheel-segment:nth-child(2) { @apply bg-red-600; }
    .wheel-segment:nth-child(3) { @apply bg-black; }
    .wheel-segment:nth-child(4) { @apply bg-gray-800; }

    .segment-content {
      @apply text-6xl flex items-center justify-center h-full;
      transform: rotate(-45deg) translateY(-50%);
    }

    .result-panel {
      @apply w-full max-w-2xl bg-white rounded-lg shadow-lg p-6;
    }

    .dominant-card {
      @apply flex flex-col items-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-500;
      animation: pulse 2s ease-in-out infinite;
    }

    .weak-card {
      @apply flex flex-col items-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300;
    }

    .neutral-card {
      @apply flex flex-col items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300;
    }

    .badge {
      @apply px-3 py-1 rounded-full text-white font-bold text-sm mt-2;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RouletteWheelComponent {
  isSpinning = signal(false)
  selectedSuit = signal<CardSuit | null>(null)
  weakSuit = signal<CardSuit | null>(null)
  neutralSuits = signal<CardSuit[]>([])

  suits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES]

  rotation = signal(0)

  async spin(result: RouletteResult) {
    this.isSpinning.set(true)

    // Calculer l'angle final
    const suitIndex = this.suits.indexOf(result.dominantColor)
    const targetAngle = 1800 + (suitIndex * 90) // 5 tours + position finale

    this.rotation.set(targetAngle)

    // Attendre la fin de l'animation
    await this.delay(3000)

    this.isSpinning.set(false)
    this.selectedSuit.set(result.dominantColor)
    this.weakSuit.set(result.weakColor)
    this.neutralSuits.set(result.neutrals)
  }

  getRotation(): string {
    return `rotate(${this.rotation()}deg)`
  }

  getSegmentClass(suit: CardSuit): string {
    if (!this.selectedSuit()) return ''
    return suit === this.selectedSuit() ? 'ring-4 ring-yellow-400' : ''
  }

  getSuitIcon(suit: CardSuit): string {
    const icons = {
      [CardSuit.HEARTS]: '♥️',
      [CardSuit.DIAMONDS]: '♦️',
      [CardSuit.CLUBS]: '♣️',
      [CardSuit.SPADES]: '♠️'
    }
    return icons[suit]
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

#### Intégration dans le flow de jeu
```typescript
// src/app/features/game/game.component.ts
export class GameComponent {
  private wsService = inject(WebSocketService)
  private rouletteService = inject(ColorRouletteService)

  @ViewChild(RouletteWheelComponent) rouletteWheel!: RouletteWheelComponent

  ngOnInit() {
    // Écouter l'événement de nouvelle manche
    this.wsService.on<RouletteResult>('round:started').subscribe(async result => {
      // Lancer l'animation de la roulette
      await this.rouletteWheel.spin(result)

      // Mettre à jour le service
      this.rouletteService.updateFromServer(result)

      // Continuer avec la distribution des objectifs
      this.startObjectiveSelection()
    })
  }
}
```

#### Effets sonores (optionnel)
```typescript
// src/app/core/services/sound.service.ts
@Injectable({ providedIn: 'root' })
export class SoundService {
  private rouletteSpin = new Audio('assets/sounds/roulette-spin.mp3')
  private rouletteStop = new Audio('assets/sounds/roulette-stop.mp3')

  playRouletteSpin() {
    this.rouletteSpin.currentTime = 0
    this.rouletteSpin.play()
  }

  playRouletteStop() {
    this.rouletteStop.currentTime = 0
    this.rouletteStop.play()
  }
}
```

## Points d'attention
- L'animation doit être fluide (60fps)
- Le résultat est déjà connu côté serveur (animation purement visuelle)
- Support mobile : tactile, performances
- Accessibilité : pouvoir skip l'animation
- Thème responsive : s'adapter aux petits écrans

## Résultat attendu
- Animation de roulette fluide et attractive
- Affichage clair de la hiérarchie
- Interface intuitive et compréhensible
- Performance optimale (pas de lag)
- Possibilité de passer l'animation (bouton "Passer")
