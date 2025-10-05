/**
 * Validator for drawing a card
 * Simple validation for draw action
 */

import vine from '@vinejs/vine'

/**
 * Draw Card Validator
 */
export const drawCardValidator = vine.compile(
  vine.object({
    gameId: vine.string().trim(),
  })
)
