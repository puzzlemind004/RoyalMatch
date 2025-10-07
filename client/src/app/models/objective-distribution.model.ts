/**
 * Objective Distribution Models
 * Frontend models for objective distribution system
 */

import type { ObjectiveDefinition } from './objective.model';

/**
 * Player's selection for objective distribution
 */
export interface ObjectiveSelection {
  easy: number;
  medium: number;
  hard: number;
}

/**
 * Available objectives grouped by simplified difficulty
 */
export interface AvailableObjectives {
  easy: ObjectiveDefinition[];
  medium: ObjectiveDefinition[];
  hard: ObjectiveDefinition[]; // Combines HARD + VERY_HARD
}

/**
 * Response from GET /api/objectives/available
 */
export interface AvailableObjectivesResponse {
  success: boolean;
  data: {
    objectives: AvailableObjectives;
    counts: {
      easy: number;
      medium: number;
      hard: number;
    };
    total: number;
  };
}

/**
 * Response from POST /api/objectives/draw
 */
export interface DrawObjectivesResponse {
  success: boolean;
  data: {
    objectives: ObjectiveDefinition[];
    selection: ObjectiveSelection;
    count: number;
  };
}

/**
 * Error response from API
 */
export interface ObjectiveDistributionError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
