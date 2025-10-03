# Tâche 13.2 : Page d'accueil et menu principal

## Layout
- Logo du jeu
- Menu principal :
  - Jouer (créer/rejoindre partie)
  - Solo vs IA
  - Spectateur
  - Profil
  - Paramètres
  - Déconnexion

## Frontend
```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-container min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
      <div class="flex flex-col items-center justify-center h-full">
        <h1 class="text-6xl font-bold text-white mb-8">
          👑 Royal Match
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <button
            class="btn-primary"
            (click)="navigateToLobby()"
          >
            🎮 Jouer en ligne
          </button>

          <button
            class="btn-secondary"
            (click)="navigateToSolo()"
          >
            🤖 Jouer vs IA
          </button>

          <button
            class="btn-secondary"
            (click)="navigateToSpectator()"
          >
            👁️ Mode Spectateur
          </button>

          <button
            class="btn-secondary"
            (click)="navigateToProfile()"
          >
            👤 Profil
          </button>
        </div>

        @if (user()) {
          <p class="mt-8 text-white">
            Connecté en tant que {{ user()!.username }}
          </p>
        }
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105;
    }
    .btn-secondary {
      @apply bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105;
    }
  `]
})
export class HomeComponent {
  user = inject(AuthService).currentUser

  navigateToLobby() { /* ... */ }
  navigateToSolo() { /* ... */ }
  navigateToSpectator() { /* ... */ }
  navigateToProfile() { /* ... */ }
}
```
