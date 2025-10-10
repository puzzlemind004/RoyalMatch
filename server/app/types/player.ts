/**
 * Player-related types for RoyalMatch
 */

/**
 * Rank tiers for competitive play
 * Used for visual representation and matchmaking
 */
export type RankTier = 'unranked' | 'iron' | 'bronze' | 'silver' | 'gold' | 'emerald' | 'diamond'

/**
 * Player display information
 * Used to show player info in UI (name, rank icon, etc.)
 */
export interface PlayerDisplayInfo {
  type: 'ai' | 'user'
  name: string
  order: number
  rank: RankTier | null
  elo: number | null
}

/**
 * Player statistics tracked during a game
 * Stores cumulative stats for analytics and progression
 */
export interface PlayerStats {
  /**
   * Total number of tricks won in current game
   */
  tricksWon: number

  /**
   * Total number of cards played in current game
   */
  cardsPlayed: number

  /**
   * Total number of card effects activated
   */
  effectsActivated: number

  /**
   * Total number of objectives completed
   */
  objectivesCompleted: number

  /**
   * Maximum consecutive tricks won in a single round
   */
  maxConsecutiveTricks: number

  /**
   * Total value of all cards won
   */
  totalCardValue: number

  /**
   * Number of rounds played in current game
   */
  roundsPlayed: number
}

/**
 * Default empty stats for a new player
 */
export const DEFAULT_PLAYER_STATS: PlayerStats = {
  tricksWon: 0,
  cardsPlayed: 0,
  effectsActivated: 0,
  objectivesCompleted: 0,
  maxConsecutiveTricks: 0,
  totalCardValue: 0,
  roundsPlayed: 0,
}
