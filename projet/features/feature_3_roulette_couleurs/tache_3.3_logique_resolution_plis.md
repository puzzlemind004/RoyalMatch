# Tâche 3.3 : Logique de résolution des plis avec couleurs

## Objectif
Implémenter la résolution complète d'un pli en combinant valeurs et hiérarchie de couleurs.

## Hiérarchie complète

### Règle 1 : Valeur prime
Si deux cartes ont des valeurs différentes, la plus haute gagne (2 < 3 < ... < A).

### Règle 2 : Couleur dominante gagne
Si valeurs égales et une carte est de la couleur forte → elle gagne.

### Règle 3 : Couleur faible perd
Si valeurs égales et une carte est de la couleur faible → elle perd.

### Règle 4 : Même couleur que la forte gagne
Si valeurs égales et les deux cartes sont neutres → la couleur du même type (rouge/noir) que la couleur forte gagne.

### Résultat : Aucune égalité possible

## Exemples de résolution

### Exemple 1 : Cœur forte, Pique faible
```
Tour avec 4 joueurs :
- Joueur 1 : 10♥️ (forte)
- Joueur 2 : A♦️ (neutre rouge)
- Joueur 3 : A♣️ (neutre noir)
- Joueur 4 : 2♠️ (faible)

Résolution :
1. A♦️ et A♣️ ont la plus haute valeur (14)
2. Aucun n'est de couleur forte
3. Aucun n'est de couleur faible
4. Les deux sont neutres → A♦️ gagne (rouge > noir)

Gagnant : Joueur 2 avec A♦️
```

### Exemple 2 : Trèfle forte, Carreau faible
```
Tour avec 3 joueurs :
- Joueur 1 : 7♣️ (forte)
- Joueur 2 : 7♥️ (neutre rouge)
- Joueur 3 : 7♠️ (neutre noir)

Résolution :
1. Toutes valeur 7 (égalité)
2. 7♣️ est de la couleur forte → elle gagne

Gagnant : Joueur 1 avec 7♣️
```

### Exemple 3 : Carreau forte, Trèfle faible
```
Tour avec 2 joueurs :
- Joueur 1 : 5♣️ (faible)
- Joueur 2 : 5♠️ (neutre noir)

Résolution :
1. Même valeur (5)
2. Aucune n'est forte
3. 5♣️ est faible → elle perd

Gagnant : Joueur 2 avec 5♠️
```

## Actions à réaliser

### Backend

#### Service TrickResolutionService
```typescript
// app/Services/TrickResolutionService.ts
class TrickResolutionService {
  resolveTrick(
    playedCards: Map<string, { player: Player, card: Card }>,
    dominantColor: CardSuit
  ): TrickResult {
    const weakColor = getOppositeColor(dominantColor)

    // Convertir en tableau pour le tri
    const entries = Array.from(playedCards.entries())

    // Trier par ordre de force décroissante
    entries.sort((a, b) => {
      return this.compareCards(a[1].card, b[1].card, dominantColor, weakColor)
    })

    // Le premier est le gagnant
    const [winnerId, { player, card }] = entries[0]

    return {
      winnerId,
      winningCard: card,
      allCards: playedCards,
      reason: this.getWinningReason(card, entries, dominantColor, weakColor)
    }
  }

  private compareCards(
    card1: Card,
    card2: Card,
    dominantColor: CardSuit,
    weakColor: CardSuit
  ): number {
    // 1. Comparer les valeurs
    if (card1.numericValue !== card2.numericValue) {
      return card2.numericValue - card1.numericValue // Ordre décroissant
    }

    // 2. Couleur forte gagne
    if (card1.suit === dominantColor) return -1
    if (card2.suit === dominantColor) return 1

    // 3. Couleur faible perd
    if (card1.suit === weakColor) return 1
    if (card2.suit === weakColor) return -1

    // 4. Même couleur que la forte gagne
    const isDominantRed = getColorType(dominantColor) === 'red'
    const card1IsRed = getColorType(card1.suit) === 'red'

    // Si couleur forte est rouge, rouge gagne. Si forte est noire, noir gagne
    if (card1IsRed === isDominantRed) return -1
    return 1
  }

  private getWinningReason(
    winningCard: Card,
    allCards: any[],
    dominantColor: CardSuit,
    weakColor: CardSuit
  ): WinningReason {
    const sameValueCards = allCards.filter(
      ([_, { card }]) => card.numericValue === winningCard.numericValue
    )

    // Valeur supérieure
    if (sameValueCards.length === 1) {
      return { type: 'higher_value', value: winningCard.numericValue }
    }

    // Couleur forte
    if (winningCard.suit === dominantColor) {
      return { type: 'dominant_color', suit: dominantColor }
    }

    // Les autres avaient couleur faible
    const hasWeakColor = sameValueCards.some(
      ([_, { card }]) => card.suit === weakColor
    )
    if (hasWeakColor) {
      return { type: 'opponent_weak_color', suit: weakColor }
    }

    // Même couleur que la forte
    return { type: 'same_color_as_dominant' }
  }
}

interface TrickResult {
  winnerId: string
  winningCard: Card
  allCards: Map<string, { player: Player, card: Card }>
  reason: WinningReason
}

type WinningReason =
  | { type: 'higher_value'; value: number }
  | { type: 'dominant_color'; suit: CardSuit }
  | { type: 'opponent_weak_color'; suit: CardSuit }
  | { type: 'same_color_as_dominant' }
```

#### Intégration dans le tour
```typescript
// app/Services/TurnService.ts
async resolveTurn(turnId: string) {
  const turn = await Turn.find(turnId)
  const playedCards = await this.getPlayedCards(turnId)
  const round = await Round.find(turn.roundId)

  // Résoudre le pli
  const trickResolution = new TrickResolutionService()
  const result = trickResolution.resolveTrick(
    playedCards,
    round.dominantColor
  )

  // Enregistrer le gagnant
  turn.winnerPlayerId = result.winnerId
  await turn.save()

  // Notifier via WebSocket
  await this.broadcastTrickResult(turn.roundId, {
    turnNumber: turn.turnNumber,
    winnerId: result.winnerId,
    winningCard: result.winningCard,
    reason: result.reason,
    allCards: result.allCards
  })

  return result
}
```

### Frontend

#### Composant TrickResult
```typescript
// src/app/features/game/components/trick-result/
@Component({
  selector: 'app-trick-result',
  standalone: true,
  template: `
    <div class="trick-result-container">
      <h3>Pli remporté par {{ winner()?.name }}</h3>

      <div class="cards-display grid grid-cols-4 gap-4">
        @for (entry of sortedCards(); track entry.playerId) {
          <app-card
            [card]="entry.card"
            [isWinner]="entry.playerId === winnerId()"
            [class.opacity-50]="entry.playerId !== winnerId()"
          />
        }
      </div>

      <div class="winning-reason mt-4 p-4 bg-blue-100 rounded">
        {{ getReasonText() }}
      </div>
    </div>
  `
})
export class TrickResultComponent {
  result = input.required<TrickResult>()

  winnerId = computed(() => this.result().winnerId)
  winner = computed(() => this.result().winner)

  sortedCards = computed(() => {
    // Trier pour afficher la carte gagnante en premier
    const cards = Array.from(this.result().allCards.entries())
    cards.sort((a, b) => {
      if (a[0] === this.winnerId()) return -1
      if (b[0] === this.winnerId()) return 1
      return 0
    })
    return cards.map(([playerId, data]) => ({ playerId, ...data }))
  })

  getReasonText(): string {
    const reason = this.result().reason

    switch (reason.type) {
      case 'higher_value':
        return `Valeur supérieure (${reason.value})`
      case 'dominant_color':
        return `Couleur forte (${getSuitName(reason.suit)})`
      case 'opponent_weak_color':
        return `Adversaire avec couleur faible`
      case 'same_color_as_dominant':
        return `Même couleur que la forte`
    }
  }
}
```

## Points d'attention
- La logique doit être EXACTEMENT identique front/back
- Tester tous les cas possibles (matrice de test)
- Logs détaillés pour comprendre chaque résolution
- Animation claire montrant pourquoi une carte gagne

## Résultat attendu
- Résolution correcte à 100%
- Aucune égalité jamais possible
- Raison de victoire toujours claire
- Tests exhaustifs (toutes combinaisons)
