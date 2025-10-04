/**
 * Card types and interfaces for RoyalMatch
 */

/**
 * Card suits enumeration
 */
export enum CardSuit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades',
}

/**
 * Card values enumeration
 */
export enum CardValue {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

/**
 * Effect target types
 */
export type EffectTarget = 'self' | 'opponent' | 'all' | 'random'

/**
 * Card effect interface
 */
export interface CardEffect {
  type: string // Used as translation key
  target?: EffectTarget
}

/**
 * Card interface representing a playing card
 */
export interface Card {
  id: string
  value: CardValue
  suit: CardSuit
  effect: CardEffect
  numericValue: number
}

/**
 * Card suit relationships
 */
export const OPPOSITE_SUITS: Record<CardSuit, CardSuit> = {
  [CardSuit.HEARTS]: CardSuit.SPADES,
  [CardSuit.SPADES]: CardSuit.HEARTS,
  [CardSuit.DIAMONDS]: CardSuit.CLUBS,
  [CardSuit.CLUBS]: CardSuit.DIAMONDS,
}

/**
 * Card value to numeric conversion
 */
export const CARD_VALUE_TO_NUMERIC: Record<CardValue, number> = {
  [CardValue.TWO]: 2,
  [CardValue.THREE]: 3,
  [CardValue.FOUR]: 4,
  [CardValue.FIVE]: 5,
  [CardValue.SIX]: 6,
  [CardValue.SEVEN]: 7,
  [CardValue.EIGHT]: 8,
  [CardValue.NINE]: 9,
  [CardValue.TEN]: 10,
  [CardValue.JACK]: 11,
  [CardValue.QUEEN]: 12,
  [CardValue.KING]: 13,
  [CardValue.ACE]: 14,
}

/**
 * All card suits
 */
export const ALL_SUITS: CardSuit[] = [
  CardSuit.HEARTS,
  CardSuit.DIAMONDS,
  CardSuit.CLUBS,
  CardSuit.SPADES,
]

/**
 * All card values
 */
export const ALL_VALUES: CardValue[] = [
  CardValue.TWO,
  CardValue.THREE,
  CardValue.FOUR,
  CardValue.FIVE,
  CardValue.SIX,
  CardValue.SEVEN,
  CardValue.EIGHT,
  CardValue.NINE,
  CardValue.TEN,
  CardValue.JACK,
  CardValue.QUEEN,
  CardValue.KING,
  CardValue.ACE,
]
