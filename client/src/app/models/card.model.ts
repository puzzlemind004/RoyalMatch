/**
 * Card models for RoyalMatch frontend
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
export type EffectTarget = 'self' | 'opponent' | 'all' | 'random';

/**
 * Card effect interface
 */
export interface CardEffect {
  type: string; // Used as translation key
  target?: EffectTarget;
}

/**
 * Card interface representing a playing card
 */
export interface Card {
  id: string;
  value: CardValue;
  suit: CardSuit;
  effect: CardEffect;
  numericValue: number;
}

/**
 * Extended card interface with display properties
 */
export interface DisplayCard extends Card {
  displayName: string;
  imageUrl: string;
  suitSymbol: string;
  suitColor: 'red' | 'black';
}

/**
 * Card suit symbols
 */
export const SUIT_SYMBOLS: Record<CardSuit, string> = {
  [CardSuit.HEARTS]: '♥',
  [CardSuit.DIAMONDS]: '♦',
  [CardSuit.CLUBS]: '♣',
  [CardSuit.SPADES]: '♠',
};

/**
 * Card suit colors
 */
export const SUIT_COLORS: Record<CardSuit, 'red' | 'black'> = {
  [CardSuit.HEARTS]: 'red',
  [CardSuit.DIAMONDS]: 'red',
  [CardSuit.CLUBS]: 'black',
  [CardSuit.SPADES]: 'black',
};

/**
 * Card value display names (French)
 */
export const VALUE_DISPLAY_NAMES: Record<CardValue, string> = {
  [CardValue.TWO]: '2',
  [CardValue.THREE]: '3',
  [CardValue.FOUR]: '4',
  [CardValue.FIVE]: '5',
  [CardValue.SIX]: '6',
  [CardValue.SEVEN]: '7',
  [CardValue.EIGHT]: '8',
  [CardValue.NINE]: '9',
  [CardValue.TEN]: '10',
  [CardValue.JACK]: 'V',
  [CardValue.QUEEN]: 'D',
  [CardValue.KING]: 'R',
  [CardValue.ACE]: 'A',
};

/**
 * Card suit relationships
 */
export const OPPOSITE_SUITS: Record<CardSuit, CardSuit> = {
  [CardSuit.HEARTS]: CardSuit.SPADES,
  [CardSuit.SPADES]: CardSuit.HEARTS,
  [CardSuit.DIAMONDS]: CardSuit.CLUBS,
  [CardSuit.CLUBS]: CardSuit.DIAMONDS,
};
