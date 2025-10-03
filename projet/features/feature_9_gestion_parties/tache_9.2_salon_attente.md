# Tâche 9.2 : Salon d'attente

## Fonctionnalités
- Liste des joueurs connectés
- Chat du salon
- Bouton "Prêt"
- Démarrage quand tous sont prêts (ou que l'hôte force)
- Possibilité de quitter
- Kick player (hôte uniquement)

## WebSocket
```typescript
// Événements salon
'lobby:player_joined'
'lobby:player_left'
'lobby:player_ready'
'lobby:chat_message'
'lobby:game_starting'
```

## Frontend
```typescript
@Component({
  template: `
    <div class="lobby">
      <h2>{{ game().name }}</h2>
      <p>{{ players().length }} / {{ game().maxPlayers }} joueurs</p>

      <div class="players-list">
        @for (player of players(); track player.id) {
          <div class="player-card">
            <span>{{ player.name }}</span>
            @if (player.isReady) {
              <span class="badge">✓ Prêt</span>
            }
            @if (isHost() && player.id !== currentUser().id) {
              <button (click)="kickPlayer(player)">Expulser</button>
            }
          </div>
        }
      </div>

      <button
        [disabled]="!canStart()"
        (click)="startGame()"
      >
        {{ isHost() ? 'Démarrer' : 'Prêt' }}
      </button>
    </div>
  `
})
```
