# Tâche 13.6 : Animations des cartes et effets

## Angular Animations
```typescript
import { trigger, transition, style, animate } from '@angular/animations'

export const cardAnimations = {
  cardFlip: trigger('cardFlip', [
    transition(':enter', [
      style({ transform: 'rotateY(90deg)' }),
      animate('300ms ease-out', style({ transform: 'rotateY(0deg)' }))
    ])
  ]),

  cardMove: trigger('cardMove', [
    transition('* => center', [
      animate('500ms ease-out', style({
        transform: 'translate({{ x }}px, {{ y }}px)'
      }))
    ])
  ]),

  effectTrigger: trigger('effectTrigger', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.5)' }),
      animate('300ms ease-out', style({
        opacity: 1,
        transform: 'scale(1.2)'
      })),
      animate('200ms ease-in', style({
        transform: 'scale(1)'
      }))
    ])
  ])
}
```

## Animations CSS personnalisées
```scss
// Effet de lueur pour la carte gagnante
@keyframes card-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 1); }
}

.winning-card {
  animation: card-glow 1s ease-in-out infinite;
}

// Animation de distribution
@keyframes deal-card {
  from {
    transform: translate(-50vw, -50vh) rotate(0deg);
    opacity: 0;
  }
  to {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
}

.card-dealing {
  animation: deal-card 0.5s ease-out forwards;
}

// Particules pour les effets
@keyframes particle-float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
}
```

## Composant EffectAnimation
```typescript
@Component({
  selector: 'app-effect-animation',
  template: `
    <div class="effect-container" [@effectTrigger]>
      @switch (effect().category) {
        @case ('objective') {
          <div class="hearts-particles">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="particle heart"></div>
            }
          </div>
        }
        @case ('draw') {
          <div class="diamond-particles">
            @for (i of [1,2,3]; track i) {
              <div class="particle diamond"></div>
            }
          </div>
        }
        @case ('attack') {
          <div class="spade-particles">
            <div class="lightning-bolt"></div>
          </div>
        }
      }
    </div>
  `,
  animations: [cardAnimations.effectTrigger]
})
```
