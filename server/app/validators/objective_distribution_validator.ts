/**
 * Validator for objective distribution requests
 */

import vine from '@vinejs/vine'

/**
 * Validator for drawing objectives
 * Validates the selection of objectives by difficulty
 */
export const drawObjectivesValidator = vine.compile(
  vine.object({
    easy: vine.number().min(0).optional(),
    medium: vine.number().min(0).optional(),
    hard: vine.number().min(0).optional(),
    gameId: vine.string().optional(),
    playerId: vine.string().optional(),
  })
)
