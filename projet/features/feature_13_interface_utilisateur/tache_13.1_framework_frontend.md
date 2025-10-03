# Tâche 13.1 : Framework frontend (Angular + TailwindCSS)

## Configuration Angular 18+
```bash
ng new royal-match-client --standalone --routing --style=scss
cd royal-match-client
ng add @angular/signals
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

## Structure
```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── features/
│   │   ├── auth/
│   │   ├── lobby/
│   │   ├── game/
│   │   └── spectator/
│   ├── shared/
│   │   ├── components/
│   │   ├── pipes/
│   │   └── directives/
│   └── models/
├── assets/
└── styles/
```

## TailwindCSS config
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        hearts: '#ef4444',
        diamonds: '#f59e0b',
        clubs: '#000000',
        spades: '#6b7280'
      }
    }
  }
}
```
