# Tâche 2.2 : Système d'effets des cartes

## Objectif
Implémenter le moteur d'effets pour gérer l'activation et l'exécution des pouvoirs des cartes.

## Catégories d'effets

### ♥️ Cœur - Objectifs et positif
**Effets possibles :**
- Compter double un pli gagné pour un objectif
- Révéler un objectif adverse
- Copier un objectif non choisi
- Changer un objectif (piocher un nouveau)
- Gagner des points bonus si objectif rempli
- Protéger un pli de compter négativement

**Exemples par carte :**
- 2♥️ : +1 point si vous gagnez ce pli
- 5♥️ : Ce pli compte double pour vos objectifs
- 10♥️ : Révélez un objectif d'un adversaire
- A♥️ : Si vous remplissez tous vos objectifs, +5 points

### ♦️ Carreau - Pioche et gestion
**Effets possibles :**
- Piocher des cartes supplémentaires
- Regarder les prochaines cartes du deck
- Échanger des cartes main/deck
- Défausser et piocher
- Recycler une carte jouée
- Mélanger son deck

**Exemples par carte :**
- 2♦️ : Piochez 1 carte supplémentaire au prochain tour
- 5♦️ : Regardez les 3 prochaines cartes de votre deck
- 10♦️ : Échangez 2 cartes de votre main avec votre deck
- A♦️ : Piochez 3 cartes, défaussez-en 2

### ♣️ Trèfle - Hasard et chance
**Effets possibles :**
- Relancer la roulette des couleurs (mini)
- Effet aléatoire parmi plusieurs
- Inverser la couleur forte/faible temporairement
- Tous les joueurs piochent/défaussent
- Mélanger les mains de tous
- Événement aléatoire bénéfique

**Exemples par carte :**
- 2♣️ : 50% chance de piocher 1 carte
- 5♣️ : Effet aléatoire : piochez 1 ou 2 cartes
- 10♣️ : Au prochain tour, inversez forte/faible
- A♣️ : Relancez la roulette, la nouvelle couleur s'applique 1 tour

### ♠️ Pique - Agressif et perturbation
**Effets possibles :**
- Forcer un adversaire à défausser
- Voler une carte de la main adverse
- Voir la main d'un adversaire
- Bloquer l'effet d'une carte adverse
- Forcer un adversaire à jouer aléatoirement
- Annuler un pli pour un adversaire

**Exemples par carte :**
- 2♠️ : Regardez la main d'un adversaire
- 5♠️ : Un adversaire défausse 1 carte au hasard
- 10♠️ : Annulez l'effet de la carte adverse la plus forte ce tour
- A♠️ : Volez 2 cartes aléatoires d'un adversaire

## Actions à réaliser

### Backend

#### Interface d'effet
```typescript
// app/Types/Effect.ts
interface EffectDefinition {
  id: string
  card: { value: CardValue, suit: CardSuit }
  name: string
  description: string
  category: 'objective' | 'draw' | 'random' | 'attack'
  power: number
  targetType: 'self' | 'opponent' | 'all' | 'random' | 'none'
  needsTarget: boolean
  execute: (context: EffectContext) => EffectResult
}

interface EffectContext {
  gameState: GameState
  caster: Player
  targets?: Player[]
  roundState: RoundState
}

interface EffectResult {
  success: boolean
  message: string
  modifications: StateModification[]
}
```

#### Service EffectEngine
```typescript
// app/Services/EffectEngine.ts
- registerEffect(definition: EffectDefinition)
- queueEffect(effect: QueuedEffect) // met en file d'attente
- executeQueuedEffects(gameState: GameState) // exécute au début du tour
- resolveConflicts(effects: QueuedEffect[]) // ordre de résolution
- validateTarget(effect, target) // vérifie que la cible est valide
```

#### Base de données des effets
```typescript
// app/Data/effects.json
- Fichier JSON avec les 52 définitions d'effets
- Chargé au démarrage du serveur
- Validé par un schéma TypeScript
```

### Frontend

#### Service EffectService
```typescript
// src/app/core/services/effect.service.ts
- getEffectDescription(card: Card): string
- canActivateEffect(card: Card, gameState): boolean
- needsTargetSelection(card: Card): boolean
- signals pour les effets actifs en cours
```

#### Composant EffectAnimation
```typescript
// src/app/shared/components/effect-animation/
- Animations visuelles pour chaque type d'effet
- Particules, éclairs, auras selon la couleur
- Son d'activation (optionnel)
```

#### Composant TargetSelector
```typescript
// src/app/shared/components/target-selector/
- Interface pour sélectionner une cible (adversaire, carte)
- Affichage uniquement si l'effet nécessite une cible
- Validation côté client avant envoi
```

## Points d'attention
- Les effets sont optionnels : le joueur choisit de les activer ou non
- Les effets s'exécutent au DÉBUT du tour SUIVANT
- Gérer l'ordre de résolution si plusieurs effets simultanés
- Valider côté serveur TOUTES les actions (anti-triche)
- Les effets ne peuvent pas créer d'égalité dans les plis
- Prévoir des logs détaillés pour le debug
- Certains effets nécessitent une interaction (choix de cible)

## Résultat attendu
- 52 effets uniques définis et documentés
- Moteur d'exécution des effets fonctionnel
- File d'attente des effets programmés
- Interface de sélection de cible
- Animations visuelles pour les effets
- Tests unitaires pour chaque effet
