/**
 * Objective Verification Service
 * Handles automatic verification of objectives at the end of a round
 *
 * Responsibilities:
 * - Verify all objectives for all players in a round
 * - Build PlayerRoundState from round data
 * - Calculate points earned for each objective
 * - Return detailed results for each player
 *
 * @TODO: Once Round and Trick models are implemented, replace mock data
 * @TODO: Once authentication is implemented, remove gameId/playerId from payloads
 */

import type { Card, CardSuit } from '../types/card.js'
import type { ObjectiveDefinition, PlayerRoundState } from '../types/objective.js'
import logger from '@adonisjs/core/services/logger'

/**
 * Result of verifying a single objective
 */
export interface ObjectiveVerificationResult {
  objective: ObjectiveDefinition
  completed: boolean
  points: number
  progress?: {
    current: number
    target: number
    percentage: number
  }
}

/**
 * Result of verifying all objectives for a player
 */
export interface PlayerVerificationResult {
  playerId: string
  objectives: ObjectiveVerificationResult[]
  totalPoints: number
  completedCount: number
  failedCount: number
}

/**
 * Complete verification result for a round
 */
export interface RoundVerificationResult {
  roundId: string
  gameId: string
  players: Map<string, PlayerVerificationResult>
  timestamp: Date
}

/**
 * Mock data structure for demo purposes
 * @TODO: Replace with actual database queries once models are ready
 */
interface MockRoundData {
  roundId: string
  gameId: string
  players: Array<{
    playerId: string
    objectives: ObjectiveDefinition[]
    tricks: Array<{
      winner: string
      cards: Card[]
    }>
    cardsPlayed: Card[]
    effectsActivated: number
    dominantSuit: CardSuit
  }>
}

/**
 * Objective Verification Service
 * Uses Strategy Pattern via ObjectiveVerifier implementations
 */
export default class ObjectiveVerificationService {
  /**
   * Verify all objectives for all players in a round
   *
   * @param roundId - The round to verify
   * @returns Complete verification results
   */
  async verifyRound(roundId: string, mockData?: MockRoundData): Promise<RoundVerificationResult> {
    logger.info(`Starting objective verification for round ${roundId}`)

    // @TODO: Replace with actual database queries
    // const round = await Round.find(roundId)
    // const players = await this.getPlayersWithObjectives(roundId)

    // For now, use mock data if provided, otherwise create default
    const roundData = mockData || this.createMockRoundData(roundId)

    const results = new Map<string, PlayerVerificationResult>()

    // Verify objectives for each player
    for (const playerData of roundData.players) {
      const playerState = this.buildPlayerState(playerData, roundData)
      const verificationResult = this.verifyPlayerObjectives(
        playerData.playerId,
        playerData.objectives,
        playerState
      )

      results.set(playerData.playerId, verificationResult)

      logger.info(
        `Player ${playerData.playerId}: ${verificationResult.completedCount}/${verificationResult.objectives.length} objectives completed, ${verificationResult.totalPoints} points`
      )
    }

    return {
      roundId: roundData.roundId,
      gameId: roundData.gameId,
      players: results,
      timestamp: new Date(),
    }
  }

  /**
   * Verify objectives for a single player
   *
   * @param playerId - The player
   * @param objectives - Player's objectives
   * @param state - Player's round state
   * @returns Verification result for this player
   */
  private verifyPlayerObjectives(
    playerId: string,
    objectives: ObjectiveDefinition[],
    state: PlayerRoundState
  ): PlayerVerificationResult {
    const objectiveResults: ObjectiveVerificationResult[] = []
    let totalPoints = 0
    let completedCount = 0
    let failedCount = 0

    for (const objective of objectives) {
      // Use the verifier's checkCompletion method (Strategy Pattern)
      const completed = objective.verifier.checkCompletion(state)
      const points = completed ? objective.points : 0
      const progress = objective.verifier.getProgress?.(state)

      if (completed) {
        completedCount++
      } else {
        failedCount++
      }

      totalPoints += points

      objectiveResults.push({
        objective,
        completed,
        points,
        progress,
      })

      logger.debug(`Objective ${objective.id}: ${completed ? 'COMPLETED' : 'FAILED'}`)
    }

    return {
      playerId,
      objectives: objectiveResults,
      totalPoints,
      completedCount,
      failedCount,
    }
  }

  /**
   * Build PlayerRoundState from round data
   *
   * @param playerData - Player's data for the round
   * @param _roundData - Complete round data (unused for now)
   * @returns Immutable PlayerRoundState
   */
  private buildPlayerState(
    playerData: MockRoundData['players'][0],
    _roundData: MockRoundData
  ): PlayerRoundState {
    // Calculate tricks won by this player
    const tricksWon = playerData.tricks.filter((t) => t.winner === playerData.playerId).length

    // Collect all cards won in tricks
    const cardsWon = playerData.tricks
      .filter((t) => t.winner === playerData.playerId)
      .flatMap((t) => t.cards)

    // Cards played by this player
    const cardsPlayed = playerData.cardsPlayed

    // Remaining cards (13 total cards per player in a standard round)
    const totalCards = 13
    const remainingCards = totalCards - cardsPlayed.length

    // First and last trick detection
    const firstTrickWon =
      playerData.tricks.length > 0 && playerData.tricks[0].winner === playerData.playerId
    const lastTrickWon =
      playerData.tricks.length > 0 &&
      playerData.tricks[playerData.tricks.length - 1].winner === playerData.playerId

    // Calculate max consecutive tricks won
    const consecutiveTricksWon = this.calculateConsecutiveTricks(
      playerData.playerId,
      playerData.tricks
    )

    return {
      playerId: playerData.playerId,
      tricksWon,
      cardsWon,
      cardsPlayed,
      effectsActivated: playerData.effectsActivated,
      remainingCards,
      firstTrickWon,
      lastTrickWon,
      consecutiveTricksWon,
      dominantSuit: playerData.dominantSuit,
    }
  }

  /**
   * Calculate maximum consecutive tricks won
   *
   * @param playerId - The player
   * @param tricks - All tricks in order
   * @returns Max consecutive tricks won
   */
  private calculateConsecutiveTricks(playerId: string, tricks: Array<{ winner: string }>): number {
    let maxConsecutive = 0
    let currentConsecutive = 0

    for (const trick of tricks) {
      if (trick.winner === playerId) {
        currentConsecutive++
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive)
      } else {
        currentConsecutive = 0
      }
    }

    return maxConsecutive
  }

  /**
   * Create mock round data for testing
   * @TODO: Remove once actual Round model is implemented
   */
  private createMockRoundData(_roundId: string): MockRoundData {
    return {
      roundId: _roundId,
      gameId: 'demo-game',
      players: [
        {
          playerId: 'player-1',
          objectives: [],
          tricks: [],
          cardsPlayed: [],
          effectsActivated: 0,
          dominantSuit: 'hearts' as CardSuit,
        },
      ],
    }
  }

  /**
   * @TODO: Future methods to implement when database models are ready
   */

  // private async getPlayersWithObjectives(roundId: string) {
  //   return await Player.query()
  //     .whereHas('playerObjectives', (query) => {
  //       query.where('round_id', roundId)
  //     })
  //     .preload('playerObjectives', (query) => {
  //       query.where('round_id', roundId).preload('objective')
  //     })
  // }

  // private async getPlayerTricks(playerId: string, roundId: string) {
  //   return await Trick.query()
  //     .where('round_id', roundId)
  //     .where('winner_id', playerId)
  //     .preload('cards')
  // }

  // private async getCardsWon(playerId: string, roundId: string) {
  //   const tricks = await this.getPlayerTricks(playerId, roundId)
  //   return tricks.flatMap((trick) => trick.cards)
  // }

  // private async getCardsPlayed(playerId: string, roundId: string) {
  //   return await CardPlayed.query()
  //     .where('round_id', roundId)
  //     .where('player_id', playerId)
  //     .preload('card')
  //     .then((plays) => plays.map((p) => p.card))
  // }
}
