import { Component, signal, computed, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { CardComponent } from '../../../../shared/components/card/card';
import type { Card } from '../../../../models/card.model';
import { CardSuit, CardValue } from '../../../../models/card.model';
import { CircularTimerComponent } from '../../../../shared/components/circular-timer/circular-timer';

@Component({
  selector: 'app-mulligan-demo',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslocoModule, CircularTimerComponent],
  templateUrl: './mulligan-demo.page.html',
  styleUrl: './mulligan-demo.page.css',
})
export class MulliganDemoPage implements OnDestroy {
  // Expose CardSuit enum to template
  CardSuit = CardSuit;

  // Timer component reference
  @ViewChild(CircularTimerComponent) timerComponent?: CircularTimerComponent;

  // État du mulligan
  allCards = signal<Card[]>([]); // Les 13 cartes initiales
  currentHand = signal<Card[]>([]);
  deck = signal<Card[]>([]);
  selectedCards = signal<Set<string>>(new Set());
  isLoading = signal<boolean>(false);
  phase = signal<'initial' | 'distribution' | 'selecting' | 'completed'>('initial');

  // Computed
  selectedCount = computed(() => this.selectedCards().size);
  canConfirm = computed(() => this.selectedCount() > 0 && !this.isLoading());
  hasStarted = computed(() => this.phase() !== 'initial');

  ngOnDestroy(): void {
    this.timerComponent?.stop();
  }

  /**
   * Étape 1 : Distribution initiale de 13 cartes
   */
  startMulligan(): void {
    // Créer un deck complet et le mélanger
    const fullDeck = this.shuffleDeck(this.createDeck());

    // Prendre les 13 premières cartes (maintenant bien mélangées)
    const thirteenCards = fullDeck.slice(0, 13);

    this.allCards.set(thirteenCards);
    this.phase.set('distribution');
  }

  /**
   * Étape 2 : Pioche initiale de 5 cartes (début du mulligan)
   */
  startMulliganPhase(): void {
    const thirteenCards = this.allCards();

    // Pioche initiale : 5 cartes
    const hand = thirteenCards.slice(0, 5);
    const deckCards = thirteenCards.slice(5);

    this.currentHand.set(hand);
    this.deck.set(deckCards);
    this.phase.set('selecting');
    this.selectedCards.set(new Set());

    // Démarrer le timer
    setTimeout(() => {
      this.timerComponent?.start();
    }, 100);
  }

  /**
   * Toggle la sélection d'une carte
   */
  toggleCard(card: Card): void {
    if (this.phase() !== 'selecting') return;

    const selected = new Set(this.selectedCards());
    if (selected.has(card.id)) {
      selected.delete(card.id);
    } else {
      selected.add(card.id);
    }
    this.selectedCards.set(selected);
  }

  /**
   * Vérifie si une carte est sélectionnée
   */
  isSelected(card: Card): boolean {
    return this.selectedCards().has(card.id);
  }

  /**
   * Confirme le mulligan
   */
  confirmMulligan(): void {
    if (!this.canConfirm()) return;

    this.isLoading.set(true);
    this.timerComponent?.stop();

    // Simuler un délai réseau
    setTimeout(() => {
      const cardIds = Array.from(this.selectedCards());
      const result = this.performMulligan(this.currentHand(), this.deck(), cardIds);

      this.currentHand.set(result.newHand);
      this.deck.set(result.deck);
      this.selectedCards.set(new Set());
      this.phase.set('completed');
      this.isLoading.set(false);
    }, 500);
  }

  /**
   * Skip le mulligan (garder la main actuelle)
   */
  skipMulligan(): void {
    this.isLoading.set(true);
    this.timerComponent?.stop();

    // Simuler un délai réseau
    setTimeout(() => {
      this.selectedCards.set(new Set());
      this.phase.set('completed');
      this.isLoading.set(false);
    }, 300);
  }

  /**
   * Gère le timeout du timer
   */
  onTimerComplete(): void {
    if (this.phase() === 'selecting') {
      this.skipMulligan();
    }
  }

  /**
   * Réinitialiser la démo
   */
  reset(): void {
    this.timerComponent?.reset();
    this.allCards.set([]);
    this.currentHand.set([]);
    this.deck.set([]);
    this.selectedCards.set(new Set());
    this.phase.set('initial');
    this.isLoading.set(false);
  }

  /**
   * Retourne la classe Tailwind pour la couleur du ring de sélection
   */
  getSelectionRingColor(suit: CardSuit): string {
    const colorMap: Record<CardSuit, string> = {
      [CardSuit.HEARTS]: 'ring-rose-600',
      [CardSuit.DIAMONDS]: 'ring-orange-600',
      [CardSuit.CLUBS]: 'ring-emerald-600',
      [CardSuit.SPADES]: 'ring-purple-600',
    };
    return colorMap[suit];
  }

  /**
   * Effectue le mulligan (logique client-side pour la démo)
   */
  private performMulligan(
    currentHand: Card[],
    deck: Card[],
    cardsToReplace: string[],
  ): { newHand: Card[]; deck: Card[]; replacedCount: number } {
    // Cartes à garder
    const keptCards = currentHand.filter((c) => !cardsToReplace.includes(c.id));

    // Cartes à renvoyer dans le deck
    const returnedCards = currentHand.filter((c) => cardsToReplace.includes(c.id));

    // Nouveau deck : ancien deck + cartes renvoyées
    const newDeck = [...deck, ...returnedCards];

    // Mélange du deck
    const shuffledDeck = this.shuffleDeck(newDeck);

    // Pioche de nouvelles cartes
    const drawnCards = shuffledDeck.slice(0, cardsToReplace.length);
    const remainingDeck = shuffledDeck.slice(cardsToReplace.length);

    // Nouvelle main
    const newHand = [...keptCards, ...drawnCards];

    return {
      newHand,
      deck: remainingDeck,
      replacedCount: cardsToReplace.length,
    };
  }

  /**
   * Crée un deck standard de 52 cartes
   */
  private createDeck(): Card[] {
    const suits = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];
    const values = [
      { value: CardValue.TWO, numeric: 2 },
      { value: CardValue.THREE, numeric: 3 },
      { value: CardValue.FOUR, numeric: 4 },
      { value: CardValue.FIVE, numeric: 5 },
      { value: CardValue.SIX, numeric: 6 },
      { value: CardValue.SEVEN, numeric: 7 },
      { value: CardValue.EIGHT, numeric: 8 },
      { value: CardValue.NINE, numeric: 9 },
      { value: CardValue.TEN, numeric: 10 },
      { value: CardValue.JACK, numeric: 11 },
      { value: CardValue.QUEEN, numeric: 12 },
      { value: CardValue.KING, numeric: 13 },
      { value: CardValue.ACE, numeric: 14 },
    ];

    const deck: Card[] = [];
    let id = 1;

    for (const suit of suits) {
      for (const { value, numeric } of values) {
        deck.push({
          id: String(id++),
          value,
          suit,
          numericValue: numeric,
          effect: { type: 'none', target: 'self' },
        });
      }
    }

    return deck;
  }

  /**
   * Mélange le deck (client-side pour démo)
   * Note: Le vrai jeu utilise crypto.randomBytes côté serveur
   */
  private shuffleDeck(cards: Card[]): Card[] {
    const shuffled = [...cards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }

    return shuffled;
  }

  /**
   * Obtient l'emoji de la couleur
   */
  getSuitEmoji(suit: CardSuit): string {
    const emojiMap: Record<CardSuit, string> = {
      [CardSuit.HEARTS]: '♥️',
      [CardSuit.DIAMONDS]: '♦️',
      [CardSuit.CLUBS]: '♣️',
      [CardSuit.SPADES]: '♠️',
    };

    return emojiMap[suit];
  }
}
