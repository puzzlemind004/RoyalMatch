import vine from '@vinejs/vine'

/**
 * Validator for getting user statistics
 */
export const getStatisticsValidator = vine.compile(
  vine.object({
    params: vine.object({
      userId: vine.string().uuid(),
    }),
  })
)

/**
 * Validator for getting game history
 */
export const getGameHistoryValidator = vine.compile(
  vine.object({
    params: vine.object({
      userId: vine.string().uuid(),
    }),
    qs: vine.object({
      limit: vine.number().optional(),
    }),
  })
)

/**
 * Validator for getting leaderboard
 */
export const getLeaderboardValidator = vine.compile(
  vine.object({
    qs: vine.object({
      limit: vine.number().optional(),
    }),
  })
)