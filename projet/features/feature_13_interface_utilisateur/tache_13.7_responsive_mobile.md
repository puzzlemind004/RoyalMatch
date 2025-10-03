# Tâche 13.7 : Interface mobile responsive

## Adaptations mobiles
- Layout vertical sur mobile
- Cartes plus petites mais touchables (44x44px min)
- Gestures tactiles (swipe pour sélectionner)
- Menu burger
- Simplification de l'interface

## TailwindCSS responsive
```html
<div class="game-board
  flex flex-col
  lg:flex-row
">
  <!-- Main du joueur : en bas sur mobile, à gauche sur desktop -->
  <div class="player-hand
    order-last
    lg:order-first
    w-full
    lg:w-1/4
    p-2
    lg:p-4
  ">
    <app-player-hand />
  </div>

  <!-- Plateau : prend toute la largeur sur mobile -->
  <div class="game-area
    flex-1
    h-64
    lg:h-auto
  ">
    <!-- ... -->
  </div>
</div>
```

## Détection tactile
```typescript
@HostListener('touchstart', ['$event'])
onTouchStart(event: TouchEvent) {
  this.touchStartX = event.touches[0].clientX
}

@HostListener('touchend', ['$event'])
onTouchEnd(event: TouchEvent) {
  const touchEndX = event.changedTouches[0].clientX
  const diff = touchEndX - this.touchStartX

  if (Math.abs(diff) > 50) {
    // Swipe détecté
    if (diff > 0) {
      this.selectPreviousCard()
    } else {
      this.selectNextCard()
    }
  }
}
```

## Media queries
```scss
// Desktop first
.game-board {
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
}

.card-size {
  width: 120px;
  height: 168px;

  @media (max-width: 768px) {
    width: 80px;
    height: 112px;
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 84px;
  }
}
```
