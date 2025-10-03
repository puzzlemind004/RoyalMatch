# Tâche 13.8 : Thème visuel et design

## Palette de couleurs
```scss
$colors: (
  'primary': #6366f1,      // Indigo
  'secondary': #8b5cf6,    // Violet
  'success': #10b981,      // Vert
  'danger': #ef4444,       // Rouge
  'warning': #f59e0b,      // Orange
  'hearts': #ef4444,       // Rouge cœur
  'diamonds': #f59e0b,     // Orange carreau
  'clubs': #1f2937,        // Noir trèfle
  'spades': #374151,       // Gris foncé pique
  'background': #0f172a,   // Bleu nuit
  'surface': #1e293b,      // Bleu foncé
);
```

## Composants de design system
```typescript
// Button component
@Component({
  selector: 'app-button',
  template: `
    <button
      [class]="getButtonClass()"
      [disabled]="disabled()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      @apply px-6 py-3 rounded-lg font-semibold transition-all;
      @apply transform hover:scale-105 active:scale-95;
      @apply disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .btn-primary {
      @apply bg-yellow-500 text-black hover:bg-yellow-600;
      @apply shadow-lg hover:shadow-xl;
    }

    .btn-secondary {
      @apply bg-blue-500 text-white hover:bg-blue-600;
    }

    .btn-danger {
      @apply bg-red-500 text-white hover:bg-red-600;
    }
  `]
})
```

## Typographie
```scss
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', sans-serif;
}

h1 { @apply text-4xl font-bold; }
h2 { @apply text-3xl font-semibold; }
h3 { @apply text-2xl font-semibold; }
h4 { @apply text-xl font-medium; }
```

## Thème sombre (par défaut)
```scss
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --border-color: #334155;
}
```
