# Tâche 13.5 : Affichage de la main et du plateau

## Composant PlayerHand
```typescript
@Component({
  selector: 'app-player-hand',
  template: `
    <div class="hand-container flex justify-center gap-2">
      @for (card of hand(); track card.id; let i = $index) {
        <div
          class="card-wrapper transform transition-all"
          [class.selected]="card === selectedCard()"
          [class.-translate-y-4]="card === selectedCard()"
          [style.transform]="getCardTransform(i)"
          (click)="selectCard(card)"
        >
          <app-card
            [card]="card"
            [faceUp]="true"
            [selectable]="true"
          />
        </div>
      }
    </div>
  `,
  styles: [`
    .card-wrapper {
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .card-wrapper:hover {
      transform: translateY(-20px) scale(1.1);
      z-index: 10;
    }
    .card-wrapper.selected {
      transform: translateY(-30px) scale(1.15);
    }
  `]
})
export class PlayerHandComponent {
  hand = input.required<Card[]>()
  selectedCard = input<Card | null>()
  cardSelected = output<Card>()

  getCardTransform(index: number): string {
    const totalCards = this.hand().length
    const spread = 15 // degrés d'écart
    const rotation = (index - (totalCards - 1) / 2) * (spread / totalCards)
    return `rotate(${rotation}deg)`
  }

  selectCard(card: Card) {
    this.cardSelected.emit(card)
  }
}
```

## Composant OpponentDisplay
```typescript
@Component({
  selector: 'app-opponent-display',
  template: `
    <div class="opponent" [class]="getPositionClass()">
      <div class="opponent-info">
        <h4>{{ player().name }}</h4>
        <p>{{ player().totalScore }} pts</p>
        <p>{{ player().handCount }} cartes</p>
      </div>

      <div class="opponent-cards">
        @for (i of cardArray(); track i) {
          <div class="card-back"></div>
        }
      </div>
    </div>
  `,
  styles: [`
    .opponent {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .opponent.top { top: 20px; left: 50%; transform: translateX(-50%); }
    .opponent.top-left { top: 20px; left: 20px; }
    .opponent.top-right { top: 20px; right: 20px; }

    .card-back {
      width: 50px;
      height: 70px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      margin: 2px;
      display: inline-block;
    }
  `]
})
```
