/**
 * Objectives database for RoyalMatch
 *
 * Strategy:
 * - Define 20 unique objective templates
 * - Each objective is unique (no duplication)
 * - Total: 20 objectives available for selection
 */

import type { ObjectiveDefinition, ObjectiveVerifier } from '../types/objective.js'
import { ObjectiveCategory, ObjectiveDifficulty } from '../types/objective.js'
import {
  WinExactlyXTricksVerifier,
  WinAtLeastXTricksVerifier,
  WinAtMostXTricksVerifier,
  LoseAllTricksVerifier,
  WinFirstAndLastTrickVerifier,
  WinConsecutiveTricksVerifier,
  NoRedCardsVerifier,
  NoBlackCardsVerifier,
  WinXTricksWithDominantSuitVerifier,
  WinAllSuitsVerifier,
  WinAllAcesVerifier,
  NoFaceCardsVerifier,
  OnlyEvenCardsVerifier,
  TotalValueLessThanVerifier,
  TotalValueGreaterThanVerifier,
  ActivateAllEffectsVerifier,
  NeverActivateEffectsVerifier,
} from '../services/objective_verifiers.js'

/**
 * Objective template for factory pattern
 */
interface ObjectiveTemplate {
  baseId: string
  nameKey: string
  descriptionKey: string
  category: ObjectiveCategory
  difficulty: ObjectiveDifficulty
  points: number
  createVerifier: () => ObjectiveVerifier // Factory function for verifier with strict typing
}

/**
 * Base objective templates (unique objectives)
 */
const OBJECTIVE_TEMPLATES: ObjectiveTemplate[] = [
  // ========================================
  // TRICKS-BASED OBJECTIVES
  // ========================================
  {
    baseId: 'lose_all_tricks',
    nameKey: 'objectives.lose_all_tricks.name',
    descriptionKey: 'objectives.lose_all_tricks.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.VERY_HARD,
    points: 8,
    createVerifier: () => new LoseAllTricksVerifier(),
  },
  {
    baseId: 'win_exactly_0',
    nameKey: 'objectives.win_exactly_0.name',
    descriptionKey: 'objectives.win_exactly_0.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.HARD,
    points: 7,
    createVerifier: () => new WinExactlyXTricksVerifier(0),
  },
  {
    baseId: 'win_exactly_1',
    nameKey: 'objectives.win_exactly_1.name',
    descriptionKey: 'objectives.win_exactly_1.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 3,
    createVerifier: () => new WinExactlyXTricksVerifier(1),
  },
  {
    baseId: 'win_exactly_2',
    nameKey: 'objectives.win_exactly_2.name',
    descriptionKey: 'objectives.win_exactly_2.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.EASY,
    points: 2,
    createVerifier: () => new WinExactlyXTricksVerifier(2),
  },
  {
    baseId: 'win_exactly_3',
    nameKey: 'objectives.win_exactly_3.name',
    descriptionKey: 'objectives.win_exactly_3.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 3,
    createVerifier: () => new WinExactlyXTricksVerifier(3),
  },
  {
    baseId: 'win_exactly_4',
    nameKey: 'objectives.win_exactly_4.name',
    descriptionKey: 'objectives.win_exactly_4.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.HARD,
    points: 6,
    createVerifier: () => new WinExactlyXTricksVerifier(4),
  },
  {
    baseId: 'win_at_least_3',
    nameKey: 'objectives.win_at_least_3.name',
    descriptionKey: 'objectives.win_at_least_3.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 4,
    createVerifier: () => new WinAtLeastXTricksVerifier(3),
  },
  {
    baseId: 'win_at_most_1',
    nameKey: 'objectives.win_at_most_1.name',
    descriptionKey: 'objectives.win_at_most_1.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.HARD,
    points: 5,
    createVerifier: () => new WinAtMostXTricksVerifier(1),
  },
  {
    baseId: 'win_first_and_last',
    nameKey: 'objectives.win_first_and_last.name',
    descriptionKey: 'objectives.win_first_and_last.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.HARD,
    points: 6,
    createVerifier: () => new WinFirstAndLastTrickVerifier(),
  },
  {
    baseId: 'win_3_consecutive',
    nameKey: 'objectives.win_3_consecutive.name',
    descriptionKey: 'objectives.win_3_consecutive.description',
    category: ObjectiveCategory.TRICKS,
    difficulty: ObjectiveDifficulty.HARD,
    points: 7,
    createVerifier: () => new WinConsecutiveTricksVerifier(3),
  },

  // ========================================
  // COLOR-BASED OBJECTIVES
  // ========================================
  {
    baseId: 'no_red_cards',
    nameKey: 'objectives.no_red_cards.name',
    descriptionKey: 'objectives.no_red_cards.description',
    category: ObjectiveCategory.COLORS,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 4,
    createVerifier: () => new NoRedCardsVerifier(),
  },
  {
    baseId: 'no_black_cards',
    nameKey: 'objectives.no_black_cards.name',
    descriptionKey: 'objectives.no_black_cards.description',
    category: ObjectiveCategory.COLORS,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 4,
    createVerifier: () => new NoBlackCardsVerifier(),
  },
  {
    baseId: 'win_2_dominant_suit',
    nameKey: 'objectives.win_2_dominant_suit.name',
    descriptionKey: 'objectives.win_2_dominant_suit.description',
    category: ObjectiveCategory.COLORS,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 3,
    createVerifier: () => new WinXTricksWithDominantSuitVerifier(2),
  },
  {
    baseId: 'win_all_suits',
    nameKey: 'objectives.win_all_suits.name',
    descriptionKey: 'objectives.win_all_suits.description',
    category: ObjectiveCategory.COLORS,
    difficulty: ObjectiveDifficulty.VERY_HARD,
    points: 8,
    createVerifier: () => new WinAllSuitsVerifier(),
  },

  // ========================================
  // VALUE-BASED OBJECTIVES
  // ========================================
  {
    baseId: 'win_all_aces',
    nameKey: 'objectives.win_all_aces.name',
    descriptionKey: 'objectives.win_all_aces.description',
    category: ObjectiveCategory.VALUES,
    difficulty: ObjectiveDifficulty.VERY_HARD,
    points: 9,
    createVerifier: () => new WinAllAcesVerifier(),
  },
  {
    baseId: 'no_face_cards',
    nameKey: 'objectives.no_face_cards.name',
    descriptionKey: 'objectives.no_face_cards.description',
    category: ObjectiveCategory.VALUES,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 4,
    createVerifier: () => new NoFaceCardsVerifier(),
  },
  {
    baseId: 'only_even_cards',
    nameKey: 'objectives.only_even_cards.name',
    descriptionKey: 'objectives.only_even_cards.description',
    category: ObjectiveCategory.VALUES,
    difficulty: ObjectiveDifficulty.HARD,
    points: 6,
    createVerifier: () => new OnlyEvenCardsVerifier(),
  },
  {
    baseId: 'total_value_less_30',
    nameKey: 'objectives.total_value_less_30.name',
    descriptionKey: 'objectives.total_value_less_30.description',
    category: ObjectiveCategory.VALUES,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 3,
    createVerifier: () => new TotalValueLessThanVerifier(30),
  },
  {
    baseId: 'total_value_greater_50',
    nameKey: 'objectives.total_value_greater_50.name',
    descriptionKey: 'objectives.total_value_greater_50.description',
    category: ObjectiveCategory.VALUES,
    difficulty: ObjectiveDifficulty.HARD,
    points: 5,
    createVerifier: () => new TotalValueGreaterThanVerifier(50),
  },

  // ========================================
  // SPECIAL OBJECTIVES
  // ========================================
  {
    baseId: 'activate_all_effects',
    nameKey: 'objectives.activate_all_effects.name',
    descriptionKey: 'objectives.activate_all_effects.description',
    category: ObjectiveCategory.SPECIAL,
    difficulty: ObjectiveDifficulty.HARD,
    points: 7,
    createVerifier: () => new ActivateAllEffectsVerifier(),
  },
  {
    baseId: 'never_activate_effects',
    nameKey: 'objectives.never_activate_effects.name',
    descriptionKey: 'objectives.never_activate_effects.description',
    category: ObjectiveCategory.SPECIAL,
    difficulty: ObjectiveDifficulty.MEDIUM,
    points: 4,
    createVerifier: () => new NeverActivateEffectsVerifier(),
  },
]

/**
 * Factory function to create objective instances
 * Each objective is now unique (no more multiplication)
 */
function createObjectiveInstances(): ObjectiveDefinition[] {
  const objectives: ObjectiveDefinition[] = []

  for (const template of OBJECTIVE_TEMPLATES) {
    objectives.push({
      id: template.baseId,
      baseId: template.baseId,
      instanceNumber: 1,
      nameKey: template.nameKey,
      descriptionKey: template.descriptionKey,
      category: template.category,
      difficulty: template.difficulty,
      points: template.points,
      verifier: template.createVerifier(),
    })
  }

  return objectives
}

/**
 * All available objectives (20 unique objectives)
 * Exported as readonly to prevent modifications
 */
export const ALL_OBJECTIVES: readonly ObjectiveDefinition[] = Object.freeze(
  createObjectiveInstances()
)

/**
 * Get objectives by category
 */
export function getObjectivesByCategory(
  category: ObjectiveCategory
): readonly ObjectiveDefinition[] {
  return ALL_OBJECTIVES.filter((obj) => obj.category === category)
}

/**
 * Get objectives by difficulty
 */
export function getObjectivesByDifficulty(
  difficulty: ObjectiveDifficulty
): readonly ObjectiveDefinition[] {
  return ALL_OBJECTIVES.filter((obj) => obj.difficulty === difficulty)
}

/**
 * Get objective by ID
 */
export function getObjectiveById(id: string): ObjectiveDefinition | undefined {
  return ALL_OBJECTIVES.find((obj) => obj.id === id)
}

/**
 * Get random objectives (for game initialization)
 * @param count - Number of objectives to select
 * @returns Array of random unique objectives
 */
export function getRandomObjectives(count: number): ObjectiveDefinition[] {
  const shuffled = [...ALL_OBJECTIVES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Statistics about objectives
 */
export const OBJECTIVE_STATS = {
  total: ALL_OBJECTIVES.length,
  uniqueTemplates: OBJECTIVE_TEMPLATES.length,
  byCategory: {
    [ObjectiveCategory.TRICKS]: getObjectivesByCategory(ObjectiveCategory.TRICKS).length,
    [ObjectiveCategory.COLORS]: getObjectivesByCategory(ObjectiveCategory.COLORS).length,
    [ObjectiveCategory.VALUES]: getObjectivesByCategory(ObjectiveCategory.VALUES).length,
    [ObjectiveCategory.SPECIAL]: getObjectivesByCategory(ObjectiveCategory.SPECIAL).length,
  },
  byDifficulty: {
    [ObjectiveDifficulty.EASY]: getObjectivesByDifficulty(ObjectiveDifficulty.EASY).length,
    [ObjectiveDifficulty.MEDIUM]: getObjectivesByDifficulty(ObjectiveDifficulty.MEDIUM).length,
    [ObjectiveDifficulty.HARD]: getObjectivesByDifficulty(ObjectiveDifficulty.HARD).length,
    [ObjectiveDifficulty.VERY_HARD]: getObjectivesByDifficulty(ObjectiveDifficulty.VERY_HARD)
      .length,
  },
} as const
