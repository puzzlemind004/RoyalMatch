# Tâche 6.3 : Sélection de 5 cartes de départ

## Règles
- Chaque joueur reçoit 13 cartes
- Il doit en choisir exactement 5 pour sa main de départ
- Les 8 restantes forment son deck personnel
- Timer de 60 secondes
- Si timeout : sélection aléatoire

## Frontend
```typescript
@Component({
  selector: 'app-starting-hand-selection',
  template: `
    <div class="card-selection">
      <h2>Choisissez 5 cartes pour votre main de départ</h2>
      <div class="timer">{{ timer() }}s</div>

      <div class="cards-grid">
        @for (card of allCards(); track card.id) {
          <app-card
            [card]="card"
            [selected]="isSelected(card)"
            (click)="toggleCard(card)"
            [disabled]="!canSelect(card)"
          />
        }
      </div>

      <button
        [disabled]="selectedCards().size !== 5"
        (click)="confirmSelection()"
      >
        Confirmer ({{ selectedCards().size }}/5)
      </button>
    </div>
  `
})
```
