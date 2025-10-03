# Tâche 18.4 : Optimisation du rendu frontend

## Lazy loading des composants
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'game',
    loadComponent: () => import('./features/game/game.component').then(m => m.GameComponent)
  },
  {
    path: 'spectator',
    loadComponent: () => import('./features/spectator/spectator.component').then(m => m.SpectatorComponent)
  }
]
```

## OnPush Change Detection
```typescript
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class CardComponent {
  // Utiliser des signals pour la réactivité optimale
  card = input.required<Card>()
  selected = input<boolean>(false)
}
```

## TrackBy pour les listes
```typescript
@Component({
  template: `
    @for (card of cards(); track card.id) {
      <app-card [card]="card" />
    }
  `
})
```

## Virtual scrolling (si grandes listes)
```typescript
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling'

@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="100" class="h-screen">
      @for (item of items(); track item.id) {
        <div class="item">{{ item.name }}</div>
      }
    </cdk-virtual-scroll-viewport>
  `
})
```

## Web Workers pour calculs lourds
```typescript
// game-calculations.worker.ts
addEventListener('message', ({ data }) => {
  const result = calculateOptimalMove(data.gameState)
  postMessage(result)
})

// Utilisation
const worker = new Worker(new URL('./game-calculations.worker', import.meta.url))
worker.postMessage({ gameState })
worker.onmessage = ({ data }) => {
  console.log('Result:', data)
}
```
