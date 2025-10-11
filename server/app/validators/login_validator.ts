import vine from '@vinejs/vine'

/**
 * Validator for user login
 * Validates username/email and password fields
 */
export const loginValidator = vine.compile(
  vine.object({
    uid: vine.string().trim(),
    password: vine.string().minLength(1),
  })
)
