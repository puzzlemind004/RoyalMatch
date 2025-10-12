import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CardComponent } from '../../../../shared/components/card/card';
import type { Card } from '../../../../models/card.model';
import { CardSuit, CardValue } from '../../../../models/card.model';

interface PlayerHand {
  playerNumber: number;
  cards: Card[];
}

@Component({
  selector: 'app-card-distribution-demo',
  imports: [CommonModule, CardComponent, TranslocoModule],
  templateUrl: './card-distribution-demo.page.html',
  styleUrl: './card-distribution-demo.page.css',
})
export class CardDistributionDemoPage {
  constructor(private transloco: TranslocoService) {}

  // Expose CardSuit enum to template
  CardSuit = CardSuit;

  // Number of players (2-4)
  playerCount = signal<number>(4);

  // Player hands after distribution
  playerHands = signal<PlayerHand[]>([]);

  // Full deck
  deck = signal<Card[]>([]);

  // Show distribution animation
  isDistributing = signal<boolean>(false);

  // Number of cards distributed
  cardsDistributed = computed(() => {
    return this.playerHands().reduce((sum, hand) => sum + hand.cards.length, 0);
  });

  /**
   * Create a standard 52-card deck
   */
  createDeck(): Card[] {
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
          effect: { type: 'none', target: 'self' }, // Dummy effect for demo
        });
      }
    }

    return deck;
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   * Note: This is client-side shuffle for demo purposes only.
   * Real game uses server-side crypto.randomBytes for security.
   */
  shuffleDeck(cards: Card[]): Card[] {
    const shuffled = [...cards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }

    return shuffled;
  }

  /**
   * Distribute 13 cards to each player
   */
  distributeCards(): void {
    this.isDistributing.set(true);

    // Create and shuffle deck
    const newDeck = this.createDeck();
    const shuffled = this.shuffleDeck(newDeck);
    this.deck.set(shuffled);

    // Distribute cards
    const hands: PlayerHand[] = [];
    const cardsPerPlayer = 13;
    let currentIndex = 0;

    for (let i = 0; i < this.playerCount(); i++) {
      const playerCards = shuffled.slice(currentIndex, currentIndex + cardsPerPlayer);
      hands.push({
        playerNumber: i + 1,
        cards: playerCards,
      });
      currentIndex += cardsPerPlayer;
    }

    // Simulate distribution animation
    setTimeout(() => {
      this.playerHands.set(hands);
      this.isDistributing.set(false);
    }, 500);
  }

  /**
   * Reset the distribution
   */
  resetDistribution(): void {
    this.playerHands.set([]);
    this.deck.set([]);
  }

  /**
   * Change player count
   */
  setPlayerCount(count: number): void {
    if (count >= 2 && count <= 4) {
      this.playerCount.set(count);
      this.resetDistribution();
    }
  }

  /**
   * Get card count per suit for a player
   */
  getCardCountBySuit(playerHand: PlayerHand): Record<CardSuit, number> {
    return playerHand.cards.reduce(
      (acc, card) => {
        acc[card.suit]++;
        return acc;
      },
      {
        [CardSuit.HEARTS]: 0,
        [CardSuit.DIAMONDS]: 0,
        [CardSuit.CLUBS]: 0,
        [CardSuit.SPADES]: 0,
      } as Record<CardSuit, number>,
    );
  }

  /**
   * Get translated suit name
   */
  getSuitName(suit: CardSuit): string {
    const suitKeys: Record<CardSuit, string> = {
      [CardSuit.HEARTS]: 'game.suits.hearts',
      [CardSuit.DIAMONDS]: 'game.suits.diamonds',
      [CardSuit.CLUBS]: 'game.suits.clubs',
      [CardSuit.SPADES]: 'game.suits.spades',
    };

    return this.transloco.translate(suitKeys[suit]);
  }

  /**
   * Get suit emoji
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
