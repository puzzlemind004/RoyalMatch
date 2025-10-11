import vine from '@vinejs/vine'

/**
 * Validator for user registration
 * Validates username, email and password fields
 */
export const registerValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(50)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .unique(async (db, value) => {
        const user = await db.from('users').where('username', value).first()
        return !user
      }),

    email: vine
      .string()
      .trim()
      .email()
      .normalizeEmail()
      .maxLength(254)
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),

    password: vine
      .string()
      .minLength(8)
      .maxLength(255)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .confirmed(),
  })
)
