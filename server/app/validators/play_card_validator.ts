/**
 * Validator for playing a card
 * Validates card structure and optional effect activation
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
 * Play Card Validator
 */
export const playCardValidator = vine.compile(
  vine.object({
    gameId: vine.string().trim(),
    turnId: vine.string().trim().optional(),
    card: cardSchema,
    activateEffect: vine.boolean().optional(),
    effectTargets: vine.array(vine.number()).optional(),
  })
)
