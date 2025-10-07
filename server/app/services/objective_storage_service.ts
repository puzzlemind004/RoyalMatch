/**
 * Objective Storage Service (Temporary In-Memory Storage)
 *
 * TODO: REMOVE THIS SERVICE WHEN AUTHENTICATION IS IMPLEMENTED
 *
 * This service is a temporary solution for storing player objectives in memory
 * during the demo/development phase. In production, this data should be:
 *
 * 1. Stored in the database (Game and PlayerObjective models)
 * 2. Associated with authenticated users (via session/JWT)
 * 3. Retrieved using the authenticated user's ID, not from payload
 *
 * Current implementation uses gameId/playerId from request payload,
 * which is INSECURE and only acceptable for demo purposes.
 *
 * When implementing authentication:
 * - Remove gameId/playerId from request payloads
 * - Use auth.user.id to identify the player
 * - Store objectives in database with proper foreign keys
 * - Add proper authorization checks (player can only access their own objectives)
 */

import type { ObjectiveDefinition } from '../types/objective.js'

class ObjectiveStorageService {
  // In-memory storage: Map<playerKey, objectives[]>
  // playerKey format: "gameId-playerId"
  private storage = new Map<string, ObjectiveDefinition[]>()

  /**
   * Store objectives for a player
   * @param gameId - Game identifier (TODO: remove when auth implemented)
   * @param playerId - Player identifier (TODO: remove when auth implemented)
   * @param objectives - Array of objectives to store
   */
  store(gameId: string, playerId: string, objectives: ObjectiveDefinition[]): void {
    const key = this.makeKey(gameId, playerId)
    this.storage.set(key, objectives)
  }

  /**
   * Retrieve objectives for a player
   * @param gameId - Game identifier (TODO: remove when auth implemented)
   * @param playerId - Player identifier (TODO: remove when auth implemented)
   * @returns Array of objectives, or empty array if none found
   */
  retrieve(gameId: string, playerId: string): ObjectiveDefinition[] {
    const key = this.makeKey(gameId, playerId)
    return this.storage.get(key) || []
  }

  /**
   * Check if player has stored objectives
   * @param gameId - Game identifier (TODO: remove when auth implemented)
   * @param playerId - Player identifier (TODO: remove when auth implemented)
   * @returns True if objectives exist, false otherwise
   */
  has(gameId: string, playerId: string): boolean {
    const key = this.makeKey(gameId, playerId)
    return this.storage.has(key)
  }

  /**
   * Clear objectives for a player
   * @param gameId - Game identifier (TODO: remove when auth implemented)
   * @param playerId - Player identifier (TODO: remove when auth implemented)
   */
  clear(gameId: string, playerId: string): void {
    const key = this.makeKey(gameId, playerId)
    this.storage.delete(key)
  }

  /**
   * Clear all stored objectives (for testing purposes)
   */
  clearAll(): void {
    this.storage.clear()
  }

  /**
   * Create a storage key from gameId and playerId
   * @private
   */
  private makeKey(gameId: string, playerId: string): string {
    return `${gameId}-${playerId}`
  }
}

// Export singleton instance
export default new ObjectiveStorageService()
