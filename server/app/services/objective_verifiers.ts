/**
 * Concrete implementations of ObjectiveVerifier
 * Using Strategy Pattern for clean, performant objective checking
 *
 * Performance optimizations:
 * - Pure functions (no side effects)
 * - Early returns for fast-fail scenarios
 * - Minimal iterations over arrays
 * - Cached calculations where possible
 */

import type {
  ObjectiveVerifier,
  ObjectiveProgress,
  PlayerRoundState,
} from '../types/objective.js'
import {
  isRedCard,
  isBlackCard,
  isFaceCard,
  isEvenCard,
  calculateTotalValue,
} from '../types/objective.js'

/**
 * ========================================
 * TRICKS-BASED VERIFIERS
 * ========================================
 */

/**
 * Win exactly X tricks
 */
export class WinExactlyXTricksVerifier implements ObjectiveVerifier {
  constructor(private readonly target: number) {}

  checkCompletion(state: PlayerRoundState): boolean {
    return state.tricksWon === this.target
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    return {
      current: state.tricksWon,
      target: this.target,
      percentage: Math.min(100, (state.tricksWon / this.target) * 100),
    }
  }
}

/**
 * Win at least X tricks
 */
export class WinAtLeastXTricksVerifier implements ObjectiveVerifier {
  constructor(private readonly target: number) {}

  checkCompletion(state: PlayerRoundState): boolean {
    return state.tricksWon >= this.target
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    return {
      current: state.tricksWon,
      target: this.target,
      percentage: Math.min(100, (state.tricksWon / this.target) * 100),
    }
  }
}

/**
 * Win at most X tricks
 */
export class WinAtMostXTricksVerifier implements ObjectiveVerifier {
  constructor(private readonly target: number) {}

  checkCompletion(state: PlayerRoundState): boolean {
    // Can only verify completion at end of round
    return state.remainingCards === 0 && state.tricksWon <= this.target
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const current = state.tricksWon
    // Progress is inverse: fewer tricks = better
    const percentage =
      state.remainingCards === 0 && current <= this.target
        ? 100
        : Math.max(0, ((this.target - current) / this.target) * 100)

    return {
      current,
      target: this.target,
      percentage,
    }
  }
}

/**
 * Lose all tricks (win zero)
 */
export class LoseAllTricksVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    // Must complete round with 0 tricks
    return state.remainingCards === 0 && state.tricksWon === 0
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const isCompleted = state.remainingCards === 0 && state.tricksWon === 0
    return {
      current: state.tricksWon,
      target: 0,
      percentage: isCompleted ? 100 : state.tricksWon > 0 ? 0 : 50, // 50% if still in progress
    }
  }
}

/**
 * Win first and last trick
 */
export class WinFirstAndLastTrickVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    // Must complete round and have won both
    return state.remainingCards === 0 && state.firstTrickWon && state.lastTrickWon
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const current = (state.firstTrickWon ? 1 : 0) + (state.lastTrickWon ? 1 : 0)
    return {
      current,
      target: 2,
      percentage: (current / 2) * 100,
    }
  }
}

/**
 * Win X consecutive tricks
 */
export class WinConsecutiveTricksVerifier implements ObjectiveVerifier {
  constructor(private readonly target: number) {}

  checkCompletion(state: PlayerRoundState): boolean {
    return state.consecutiveTricksWon >= this.target
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    return {
      current: state.consecutiveTricksWon,
      target: this.target,
      percentage: Math.min(100, (state.consecutiveTricksWon / this.target) * 100),
    }
  }
}

/**
 * ========================================
 * COLOR-BASED VERIFIERS
 * ========================================
 */

/**
 * Win no red cards
 */
export class NoRedCardsVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    // Early return: if any red card found, objective failed
    return state.remainingCards === 0 && !state.cardsWon.some(isRedCard)
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const redCardsWon = state.cardsWon.filter(isRedCard).length
    const isCompleted = state.remainingCards === 0 && redCardsWon === 0
    return {
      current: redCardsWon,
      target: 0,
      percentage: isCompleted ? 100 : redCardsWon > 0 ? 0 : 50,
    }
  }
}

/**
 * Win no black cards
 */
export class NoBlackCardsVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    return state.remainingCards === 0 && !state.cardsWon.some(isBlackCard)
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const blackCardsWon = state.cardsWon.filter(isBlackCard).length
    const isCompleted = state.remainingCards === 0 && blackCardsWon === 0
    return {
      current: blackCardsWon,
      target: 0,
      percentage: isCompleted ? 100 : blackCardsWon > 0 ? 0 : 50,
    }
  }
}

/**
 * Win at least X tricks with dominant suit
 */
export class WinXTricksWithDominantSuitVerifier implements ObjectiveVerifier {
  constructor(private readonly target: number) {}

  checkCompletion(state: PlayerRoundState): boolean {
    // Count tricks where at least one dominant suit card was won
    // This requires grouping cards by trick, which we don't have in current state
    // For now, we'll count dominant suit cards and estimate
    const dominantCards = state.cardsWon.filter((card) => card.suit === state.dominantSuit)
    return dominantCards.length >= this.target
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const dominantCards = state.cardsWon.filter((card) => card.suit === state.dominantSuit)
    return {
      current: dominantCards.length,
      target: this.target,
      percentage: Math.min(100, (dominantCards.length / this.target) * 100),
    }
  }
}

/**
 * Win a trick of each suit
 * (Simplified: win at least one card of each suit)
 */
export class WinAllSuitsVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    const suits = new Set(state.cardsWon.map((card) => card.suit))
    return suits.size === 4 // All 4 suits
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const suits = new Set(state.cardsWon.map((card) => card.suit))
    return {
      current: suits.size,
      target: 4,
      percentage: (suits.size / 4) * 100,
    }
  }
}

/**
 * ========================================
 * VALUE-BASED VERIFIERS
 * ========================================
 */

/**
 * Win all Aces
 */
export class WinAllAcesVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    const acesWon = state.cardsWon.filter((card) => card.value === 'A')
    return acesWon.length === 4 // All 4 Aces
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const acesWon = state.cardsWon.filter((card) => card.value === 'A')
    return {
      current: acesWon.length,
      target: 4,
      percentage: (acesWon.length / 4) * 100,
    }
  }
}

/**
 * Win no face cards (J, Q, K)
 */
export class NoFaceCardsVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    return state.remainingCards === 0 && !state.cardsWon.some(isFaceCard)
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const faceCardsWon = state.cardsWon.filter(isFaceCard).length
    const isCompleted = state.remainingCards === 0 && faceCardsWon === 0
    return {
      current: faceCardsWon,
      target: 0,
      percentage: isCompleted ? 100 : faceCardsWon > 0 ? 0 : 50,
    }
  }
}

/**
 * Win only even-value cards
 */
export class OnlyEvenCardsVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    // Must have won cards AND all must be even
    return state.cardsWon.length > 0 && state.cardsWon.every(isEvenCard)
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    if (state.cardsWon.length === 0) {
      return { current: 0, target: 1, percentage: 0 }
    }
    const evenCards = state.cardsWon.filter(isEvenCard).length
    const percentage = (evenCards / state.cardsWon.length) * 100
    return {
      current: evenCards,
      target: state.cardsWon.length,
      percentage,
    }
  }
}

/**
 * Total card values less than X
 */
export class TotalValueLessThanVerifier implements ObjectiveVerifier {
  constructor(private readonly threshold: number) {}

  checkCompletion(state: PlayerRoundState): boolean {
    return state.remainingCards === 0 && calculateTotalValue(state.cardsWon) < this.threshold
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const current = calculateTotalValue(state.cardsWon)
    const percentage =
      state.remainingCards === 0 && current < this.threshold
        ? 100
        : Math.max(0, ((this.threshold - current) / this.threshold) * 100)
    return {
      current,
      target: this.threshold,
      percentage,
    }
  }
}

/**
 * Total card values greater than X
 */
export class TotalValueGreaterThanVerifier implements ObjectiveVerifier {
  constructor(private readonly threshold: number) {}

  checkCompletion(state: PlayerRoundState): boolean {
    return calculateTotalValue(state.cardsWon) > this.threshold
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const current = calculateTotalValue(state.cardsWon)
    return {
      current,
      target: this.threshold,
      percentage: Math.min(100, (current / this.threshold) * 100),
    }
  }
}

/**
 * ========================================
 * SPECIAL VERIFIERS
 * ========================================
 */

/**
 * Activate all card effects
 */
export class ActivateAllEffectsVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    // Must have played all cards and activated all effects
    const totalCardsPlayed = state.cardsPlayed.length
    return state.remainingCards === 0 && state.effectsActivated === totalCardsPlayed
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const totalCardsPlayed = state.cardsPlayed.length
    if (totalCardsPlayed === 0) {
      return { current: 0, target: 1, percentage: 0 }
    }
    return {
      current: state.effectsActivated,
      target: totalCardsPlayed,
      percentage: (state.effectsActivated / totalCardsPlayed) * 100,
    }
  }
}

/**
 * Never activate effects
 */
export class NeverActivateEffectsVerifier implements ObjectiveVerifier {
  checkCompletion(state: PlayerRoundState): boolean {
    return state.remainingCards === 0 && state.effectsActivated === 0
  }

  getProgress(state: PlayerRoundState): ObjectiveProgress {
    const isCompleted = state.remainingCards === 0 && state.effectsActivated === 0
    return {
      current: state.effectsActivated,
      target: 0,
      percentage: isCompleted ? 100 : state.effectsActivated > 0 ? 0 : 50,
    }
  }
}
