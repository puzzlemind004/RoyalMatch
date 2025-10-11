import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register_validator'
import { loginValidator } from '#validators/login_validator'

/**
 * AuthController handles user authentication operations
 * - Registration: Creates new user accounts
 * - Login: Authenticates users and issues access tokens
 * - Logout: Revokes access tokens
 * - Me: Returns current authenticated user info
 */
export default class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)

      // Create user (password is automatically hashed by User model)
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: data.password,
      })

      // Generate access token
      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 days',
      })

      return response.created({
        success: true,
        message: 'auth.success.register',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          token: {
            type: 'bearer',
            value: token.value!.release(),
            expiresAt: token.expiresAt?.toISOString(),
          },
        },
      })
    } catch (error) {
      if (error.messages) {
        // Validation errors
        return response.badRequest({
          success: false,
          message: 'auth.errors.validationFailed',
          errors: error.messages,
        })
      }

      return response.internalServerError({
        success: false,
        message: 'auth.errors.registerFailed',
      })
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login({ request, response }: HttpContext) {
    try {
      const { uid, password } = await request.validateUsing(loginValidator)

      // Verify credentials (uid can be email or username)
      const user = await User.verifyCredentials(uid, password)

      // Generate access token
      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 days',
      })

      return response.ok({
        success: true,
        message: 'auth.success.login',
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
          token: {
            type: 'bearer',
            value: token.value!.release(),
            expiresAt: token.expiresAt?.toISOString(),
          },
        },
      })
    } catch (error) {
      if (error.messages) {
        // Validation errors
        return response.badRequest({
          success: false,
          message: 'auth.errors.validationFailed',
          errors: error.messages,
        })
      }

      // Invalid credentials
      return response.unauthorized({
        success: false,
        message: 'auth.errors.invalidCredentials',
      })
    }
  }

  /**
   * Logout user (revoke current token)
   * POST /api/auth/logout
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const token = auth.user?.currentAccessToken

      if (token) {
        await User.accessTokens.delete(user, token.identifier)
      }

      return response.ok({
        success: true,
        message: 'auth.success.logout',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: 'auth.errors.logoutFailed',
      })
    }
  }

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      return response.ok({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt.toISO(),
          },
        },
      })
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: 'auth.errors.notAuthenticated',
      })
    }
  }
}
