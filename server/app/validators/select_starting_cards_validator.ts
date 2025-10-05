/**
 * Validator for starting card selection
 * Player must select exactly 5 cards from their dealt 13 cards
 */

import vine from '@vinejs/vine'
import { CardSuit, CardValue } from '#types/card'

/**
 * Card schema for validation
 */
const cardSchema = vine.object({
  value: vine.enum(CardValue),
  suit: vine.enum(CardSuit),
})

/**
 * Select Starting Cards Validator
 */
export const selectStartingCardsValidator = vine.compile(
  vine.object({
    gameId: vine.string().trim(),
    selectedCards: vine.array(cardSchema).minLength(5).maxLength(5),
  })
)
