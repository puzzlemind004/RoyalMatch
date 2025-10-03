# Tâche 7.4 : Interface de sélection de carte + activation effet

## Interface
- Affichage de la main du joueur (5-6 cartes)
- Sélection d'une carte
- Toggle pour activer/désactiver l'effet
- Tooltip avec description de l'effet
- Sélection de cible si nécessaire
- Bouton "Jouer la carte"

## Frontend
```typescript
@Component({
  selector: 'app-play-card',
  template: `
    <div class="hand-display">
      @for (card of hand(); track card.id) {
        <app-card
          [card]="card"
          [selected]="selectedCard() === card"
          (click)="selectCard(card)"
        />
      }
    </div>

    @if (selectedCard()) {
      <div class="effect-toggle">
        <label>
          <input
            type="checkbox"
            [(ngModel)]="activateEffect"
          />
          Activer l'effet : {{ selectedCard()!.effect.description }}
        </label>

        @if (activateEffect && needsTarget()) {
          <app-target-selector
            [targets]="availableTargets()"
            (targetSelected)="onTargetSelected($event)"
          />
        }
      </div>

      <button (click)="playCard()">Jouer cette carte</button>
    }
  `
})
```
