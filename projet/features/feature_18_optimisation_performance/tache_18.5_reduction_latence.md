# Tâche 18.5 : Réduction de la latence

## CDN pour les assets statiques
```typescript
// Configuration Angular pour CDN
// angular.json
{
  "deployUrl": "https://cdn.votre-domaine.com/"
}
```

## Prédiction côté client
```typescript
// Prédire l'action avant la confirmation serveur
class OptimisticUpdateService {
  playCard(card: Card) {
    // 1. Mettre à jour l'UI immédiatement
    this.removeCardFromHand(card)
    this.addCardToPlayed(card)

    // 2. Envoyer au serveur
    this.ws.emit('card:play', card)
      .catch(() => {
        // 3. Rollback si erreur
        this.addCardToHand(card)
        this.removeCardFromPlayed(card)
      })
  }
}
```

## Prefetching
```typescript
// Précharger les données dont on aura besoin
@Component({
  template: `
    <a [routerLink]="['/game']" (mouseenter)="prefetchGameData()">
      Jouer
    </a>
  `
})
export class NavigationComponent {
  async prefetchGameData() {
    // Charger les données en arrière-plan
    this.gameService.preloadAssets()
  }
}
```

## Connexion persistante
```typescript
// Réutiliser la connexion WebSocket
class WebSocketService {
  private connection: Socket | null = null

  connect() {
    if (this.connection?.connected) {
      return this.connection
    }

    this.connection = io('wss://votre-domaine.com', {
      transports: ['websocket'], // Éviter le polling
      upgrade: false
    })

    return this.connection
  }
}
```

## Service Worker pour le cache
```typescript
// ngsw-config.json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(eot|svg|cur|jpg|png|webp|gif|otf|ttf|woff|woff2|ani)"
        ]
      }
    }
  ]
}
```
