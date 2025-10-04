import { randomUUID } from 'node:crypto'
import {
  type Card,
  type CardEffect,
  CardSuit,
  CardValue,
  ALL_SUITS,
  ALL_VALUES,
  CARD_VALUE_TO_NUMERIC,
} from '#types/card'
import cardEffectsData from '#data/card_effects.json'

/**
 * Service for managing card decks
 */
export default class DeckService {
  /**
   * Card effects data loaded from JSON
   */
  private static cardEffects: Record<string, Record<string, CardEffect>> = cardEffectsData

  /**
   * Create a standard 52-card deck with effects
   */
  static createStandardDeck(): Card[] {
    const deck: Card[] = []

    for (const suit of ALL_SUITS) {
      for (const value of ALL_VALUES) {
        const effect = this.getEffectForCard(suit, value)

        deck.push({
          id: randomUUID(),
          value,
          suit,
          effect,
          numericValue: CARD_VALUE_TO_NUMERIC[value],
        })
      }
    }

    return deck
  }

  /**
   * Get the effect for a specific card
   */
  private static getEffectForCard(suit: CardSuit, value: CardValue): CardEffect {
    const effectData = this.cardEffects[suit]?.[value]

    if (!effectData) {
      throw new Error(`No effect defined for ${value} of ${suit}`)
    }

    return effectData
  }

  /**
   * Shuffle a deck using Fisher-Yates algorithm
   */
  static shuffleDeck(cards: Card[]): Card[] {
    const shuffled = [...cards]

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
    }

    return shuffled
  }

  /**
   * Distribute cards to players
   * @param deck - The deck to distribute from
   * @param playerCount - Number of players (2-4)
   * @param cardsPerPlayer - Number of cards per player (default: 13)
   * @returns Object with hands for each player and remaining deck
   */
  static distributeCards(
    deck: Card[],
    playerCount: number,
    cardsPerPlayer: number = 13
  ): {
    hands: Card[][]
    remainingDeck: Card[]
  } {
    if (playerCount < 2 || playerCount > 4) {
      throw new Error('Player count must be between 2 and 4')
    }

    const totalCardsNeeded = playerCount * cardsPerPlayer

    if (deck.length < totalCardsNeeded) {
      throw new Error(`Not enough cards in deck. Need ${totalCardsNeeded}, have ${deck.length}`)
    }

    const hands: Card[][] = []
    let currentIndex = 0

    for (let i = 0; i < playerCount; i++) {
      hands.push(deck.slice(currentIndex, currentIndex + cardsPerPlayer))
      currentIndex += cardsPerPlayer
    }

    return {
      hands,
      remainingDeck: deck.slice(currentIndex),
    }
  }

  /**
   * Deal a specific number of cards from the deck
   */
  static dealCards(deck: Card[], count: number): { dealt: Card[]; remaining: Card[] } {
    if (count > deck.length) {
      throw new Error(`Cannot deal ${count} cards from deck of ${deck.length}`)
    }

    return {
      dealt: deck.slice(0, count),
      remaining: deck.slice(count),
    }
  }

  /**
   * Get card display name
   */
  static getCardDisplayName(card: Card, locale: string = 'fr'): string {
    const valueNames: Record<string, Record<CardValue, string>> = {
      fr: {
        [CardValue.TWO]: '2',
        [CardValue.THREE]: '3',
        [CardValue.FOUR]: '4',
        [CardValue.FIVE]: '5',
        [CardValue.SIX]: '6',
        [CardValue.SEVEN]: '7',
        [CardValue.EIGHT]: '8',
        [CardValue.NINE]: '9',
        [CardValue.TEN]: '10',
        [CardValue.JACK]: 'Valet',
        [CardValue.QUEEN]: 'Dame',
        [CardValue.KING]: 'Roi',
        [CardValue.ACE]: 'As',
      },
      en: {
        [CardValue.TWO]: '2',
        [CardValue.THREE]: '3',
        [CardValue.FOUR]: '4',
        [CardValue.FIVE]: '5',
        [CardValue.SIX]: '6',
        [CardValue.SEVEN]: '7',
        [CardValue.EIGHT]: '8',
        [CardValue.NINE]: '9',
        [CardValue.TEN]: '10',
        [CardValue.JACK]: 'Jack',
        [CardValue.QUEEN]: 'Queen',
        [CardValue.KING]: 'King',
        [CardValue.ACE]: 'Ace',
      },
    }

    const suitNames: Record<string, Record<CardSuit, string>> = {
      fr: {
        [CardSuit.HEARTS]: 'Cœur',
        [CardSuit.DIAMONDS]: 'Carreau',
        [CardSuit.CLUBS]: 'Trèfle',
        [CardSuit.SPADES]: 'Pique',
      },
      en: {
        [CardSuit.HEARTS]: 'Hearts',
        [CardSuit.DIAMONDS]: 'Diamonds',
        [CardSuit.CLUBS]: 'Clubs',
        [CardSuit.SPADES]: 'Spades',
      },
    }

    const valueName = valueNames[locale]?.[card.value] || card.value
    const suitName = suitNames[locale]?.[card.suit] || card.suit

    return `${valueName} de ${suitName}`
  }

  /**
   * Sort cards by suit and value
   */
  static sortCards(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => {
      const suitOrder = ALL_SUITS.indexOf(a.suit) - ALL_SUITS.indexOf(b.suit)
      if (suitOrder !== 0) return suitOrder

      return a.numericValue - b.numericValue
    })
  }
}
