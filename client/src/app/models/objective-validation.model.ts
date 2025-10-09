/**
 * Objective Validation Models
 * Models for objective validation phase
 */

import type { ObjectiveDefinition } from './objective.model';

/**
 * Request to redraw objectives
 */
export interface RedrawObjectivesRequest {
  gameId: string;
  playerId: string;
}

/**
 * Request to reject specific objectives
 */
export interface RejectObjectivesRequest {
  gameId: string;
  playerId: string;
  objectiveIds: string[]; // IDs of objectives to reject (max 2)
}

/**
 * Request to validate (confirm) objectives
 */
export interface ValidateObjectivesRequest {
  gameId: string;
  playerId: string;
  rejectedIds?: string[]; // Optional: IDs of rejected objectives
}

/**
 * Response after redrawing objectives
 */
export interface RedrawObjectivesResponse {
  success: boolean;
  data: {
    objectives: ObjectiveDefinition[];
  };
  message?: string;
}

/**
 * Response after rejecting objectives
 */
export interface RejectObjectivesResponse {
  success: boolean;
  data: {
    remainingObjectives: ObjectiveDefinition[];
  };
  message?: string;
}

/**
 * Response after validating objectives
 */
export interface ValidateObjectivesResponse {
  success: boolean;
  data: {
    validatedObjectives: ObjectiveDefinition[];
  };
  message?: string;
}

/**
 * State of the validation phase
 */
export interface ObjectiveValidationState {
  objectives: ObjectiveDefinition[];
  hasRedrawn: boolean;
  rejectedCount: number;
  remainingTime: number;
  isValidated: boolean;
}

/**
 * Constants for validation phase
 */
export const VALIDATION_CONSTANTS = {
  TIMER_DURATION: 45, // 45 seconds
  MAX_REJECTS: 2, // Maximum 2 objectives can be rejected
  REDRAW_LIMIT: 1, // Can only redraw once
} as const;
