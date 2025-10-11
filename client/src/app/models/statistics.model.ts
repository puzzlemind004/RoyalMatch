/**
 * User Statistics Model
 * Matches backend UserStatisticsData interface
 */
export interface UserStatistics {
  userId: string
  username: string
  gamesPlayed: number
  gamesWon: number
  gamesLost: number
  winRate: number
  objectivesCompleted: number
  objectivesTotal: number
  effectsActivated: number
  tricksWonTotal: number
  tricksWonAverage: number
  bestScore: number
  totalPoints: number
  averageScore: number
  createdAt: string
  updatedAt: string
}

/**
 * Game History Entry
 */
export interface GameHistoryEntry {
  gameId: string
  status: string
  won: boolean
  score: number
  playerCount: number
  playedAt: string
}

/**
 * API Response for statistics
 */
export interface StatisticsResponse {
  success: boolean
  data: UserStatistics
}

/**
 * API Response for game history
 */
export interface GameHistoryResponse {
  success: boolean
  data: GameHistoryEntry[]
}

/**
 * API Response for leaderboard
 */
export interface LeaderboardResponse {
  success: boolean
  data: UserStatistics[]
}
