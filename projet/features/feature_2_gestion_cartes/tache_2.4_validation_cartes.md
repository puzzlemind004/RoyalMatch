# Tâche 2.4 : Validation des cartes

## Objectif
Implémenter la validation côté serveur de toutes les actions liées aux cartes pour éviter la triche.

## Validations nécessaires

### Validation de la sélection de carte initiale (5 cartes de départ)
- Le joueur a bien reçu 13 cartes
- Le joueur sélectionne exactement 5 cartes
- Les 5 cartes font partie de ses 13 cartes distribuées
- Pas de doublon dans la sélection
- Timeout : 60 secondes max

### Validation du jeu d'une carte
- C'est bien le tour du joueur (ou révélation simultanée)
- La carte est dans la main du joueur
- Le joueur n'a pas déjà joué ce tour
- La carte n'a pas déjà été jouée dans un tour précédent
- Timeout : temps de réflexion respecté

### Validation de l'activation d'effet
- L'effet correspond bien à la carte jouée
- L'effet peut être activé dans ce contexte
- Les cibles de l'effet sont valides
- Le joueur a le droit d'activer cet effet

### Validation de la pioche
- Le joueur a le droit de piocher (début de tour)
- Le deck du joueur n'est pas vide
- Pas de pioche multiple au même tour (sauf effet spécial)

## Actions à réaliser

### Backend

#### Validators AdonisJS
```typescript
// app/Validators/SelectStartingCardsValidator.ts
export default class SelectStartingCardsValidator {
  schema = schema.create({
    gameId: schema.string({ trim: true }, [rules.uuid()]),
    selectedCards: schema.array([rules.minLength(5), rules.maxLength(5)]).members(
      schema.object().members({
        value: schema.enum(Object.values(CardValue)),
        suit: schema.enum(Object.values(CardSuit))
      })
    )
  })
}

// app/Validators/PlayCardValidator.ts
export default class PlayCardValidator {
  schema = schema.create({
    gameId: schema.string({ trim: true }, [rules.uuid()]),
    turnId: schema.string({ trim: true }, [rules.uuid()]),
    card: schema.object().members({
      value: schema.enum(Object.values(CardValue)),
      suit: schema.enum(Object.values(CardSuit))
    }),
    activateEffect: schema.boolean(),
    effectTargets: schema.array.optional().members(
      schema.string({ trim: true }, [rules.uuid()])
    )
  })
}
```

#### Service de validation métier
```typescript
// app/Services/CardValidationService.ts
class CardValidationService {
  // Vérifie que le joueur possède la carte
  validateCardOwnership(
    playerId: string,
    card: Card,
    gameState: GameState
  ): boolean

  // Vérifie qu'une carte n'a pas déjà été jouée
  validateCardNotPlayed(
    card: Card,
    playerHistory: PlayedCard[]
  ): boolean

  // Vérifie le timing (timeout)
  validateTurnTimeout(
    turnStartTime: Date,
    currentTime: Date,
    maxDuration: number
  ): boolean

  // Vérifie qu'un joueur peut jouer (son tour ou simultané)
  validatePlayerCanPlay(
    playerId: string,
    gameState: GameState
  ): boolean

  // Vérifie la validité d'un effet
  validateEffect(
    effect: CardEffect,
    card: Card,
    context: EffectContext
  ): boolean

  // Vérifie les cibles d'un effet
  validateEffectTargets(
    effect: CardEffect,
    targets: string[],
    gameState: GameState
  ): boolean
}
```

#### Middleware de vérification anti-triche
```typescript
// app/Middleware/AntiCheatMiddleware.ts
- Vérifier que le joueur est bien connecté à cette partie
- Vérifier que la partie est en cours
- Logger toutes les actions suspectes
- Détecter les patterns de triche (action trop rapide, impossible)
- Bannir temporairement en cas de triche détectée
```

#### Système de logs
```typescript
// app/Services/GameLogService.ts
- Logger chaque action avec timestamp
- Logger les validations échouées
- Tracer l'historique complet d'une partie
- Permettre la relecture d'une partie pour debug
```

### Frontend

#### Validation côté client (UX)
```typescript
// src/app/core/services/client-validation.service.ts
- Désactiver les cartes non jouables visuellement
- Afficher un message si action invalide
- Timer visuel pour le timeout
- Pré-validation avant envoi au serveur (éviter erreurs)
```

#### Gestion des erreurs
```typescript
// src/app/core/interceptors/game-error.interceptor.ts
- Intercepter les erreurs de validation du serveur
- Afficher des messages clairs à l'utilisateur
- Restaurer l'état du jeu en cas d'erreur
- Logger les erreurs pour analyse
```

## Points d'attention
- **JAMAIS** faire confiance au client : toute validation critique côté serveur
- Double validation : client (UX) + serveur (sécurité)
- Logs détaillés pour détecter et prouver la triche
- Gestion des edge cases (déconnexion pendant le jeu, etc.)
- Performance : les validations ne doivent pas ralentir le jeu
- Messages d'erreur clairs mais sans révéler d'informations sensibles

## Cas de triche à détecter

### Triche type 1 : Jouer une carte non possédée
- Détection : vérifier la main du joueur côté serveur
- Réponse : rejeter l'action, logger, avertir

### Triche type 2 : Modifier les données de la carte
- Détection : valider que la carte existe dans le jeu
- Réponse : rejeter, considérer comme tentative de triche grave

### Triche type 3 : Jouer hors du temps imparti
- Détection : timestamp côté serveur
- Réponse : carte jouée aléatoirement ou défausse automatique

### Triche type 4 : Jouer plusieurs fois au même tour
- Détection : flag hasPlayed dans la BDD
- Réponse : rejeter la deuxième tentative

### Triche type 5 : Voir les cartes des adversaires
- Détection : ne jamais envoyer les cartes cachées au client
- Réponse : architecture zero-trust

## Résultat attendu
- Aucune action invalide ne peut être exécutée
- Toutes les tentatives de triche sont loggées
- Messages d'erreur clairs côté client
- Performance maintenue malgré les validations
- Tests unitaires et d'intégration complets
- Documentation des validations pour chaque action
