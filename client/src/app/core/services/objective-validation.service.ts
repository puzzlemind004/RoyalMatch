/**
 * Objective Validation Service
 * Handles API calls for objective validation, redrawing, and rejection
 */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  RedrawObjectivesRequest,
  RedrawObjectivesResponse,
  RejectObjectivesRequest,
  RejectObjectivesResponse,
  ValidateObjectivesRequest,
  ValidateObjectivesResponse,
  VALIDATION_CONSTANTS,
} from '../../models/objective-validation.model';
import type { ObjectiveDefinition } from '../../models/objective.model';

@Injectable({
  providedIn: 'root',
})
export class ObjectiveValidationService {
  private readonly apiUrl = `${environment.apiUrl}/api/objectives`;

  // Signals for state management
  objectives = signal<ObjectiveDefinition[]>([]);
  hasRedrawn = signal<boolean>(false);
  rejectedIds = signal<string[]>([]);
  isValidated = signal<boolean>(false);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Set initial objectives to validate
   */
  setObjectives(objectives: ObjectiveDefinition[]): void {
    this.objectives.set(objectives);
    this.hasRedrawn.set(false);
    this.rejectedIds.set([]);
    this.isValidated.set(false);
    this.error.set(null);
  }

  /**
   * Redraw all objectives (can only be done once)
   * Replaces all objectives with new ones of the same difficulty
   */
  redrawObjectives(gameId: string, playerId: string): Observable<RedrawObjectivesResponse> {
    this.loading.set(true);
    this.error.set(null);

    const request: RedrawObjectivesRequest = { gameId, playerId };

    return this.http.post<RedrawObjectivesResponse>(`${this.apiUrl}/redraw`, request).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.objectives.set(response.data.objectives);
            this.hasRedrawn.set(true);
            // Reset rejected IDs since we have new objectives
            this.rejectedIds.set([]);
          }
          this.loading.set(false);
        },
        error: (err) => {
          const errorKey = err.error?.message || 'game.errors.failedToDrawObjectives';
          this.error.set(errorKey);
          this.loading.set(false);
        },
      })
    );
  }

  /**
   * Reject specific objectives (max 2)
   * Marks objectives for rejection and removes them from the list
   */
  rejectObjective(objectiveId: string): void {
    const currentRejected = this.rejectedIds();
    const MAX_REJECTS = 2; // VALIDATION_CONSTANTS.MAX_REJECTS

    // Check if we can reject more
    if (currentRejected.length >= MAX_REJECTS) {
      this.error.set('game.errors.maxRejectsReached');
      return;
    }

    // Check if already rejected
    if (currentRejected.includes(objectiveId)) {
      return;
    }

    // Add to rejected list
    this.rejectedIds.update((ids) => [...ids, objectiveId]);

    // Remove from objectives list
    this.objectives.update((objs) => objs.filter((obj) => obj.id !== objectiveId));
  }

  /**
   * Un-reject an objective (before validation)
   */
  unrejectObjective(objectiveId: string): void {
    this.rejectedIds.update((ids) => ids.filter((id) => id !== objectiveId));
    // Note: We can't restore the objective since we don't have it anymore
    // In a real implementation, we would need to keep a copy of rejected objectives
  }

  /**
   * Validate (confirm) the current objectives
   * Sends the final selection to the server
   */
  validateObjectives(
    gameId: string,
    playerId: string
  ): Observable<ValidateObjectivesResponse> {
    this.loading.set(true);
    this.error.set(null);

    const request: ValidateObjectivesRequest = {
      gameId,
      playerId,
      rejectedIds: this.rejectedIds().length > 0 ? this.rejectedIds() : undefined,
    };

    return this.http.post<ValidateObjectivesResponse>(`${this.apiUrl}/validate`, request).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.objectives.set(response.data.validatedObjectives);
            this.isValidated.set(true);
          }
          this.loading.set(false);
        },
        error: (err) => {
          const errorKey = err.error?.message || 'game.errors.failedToValidateObjectives';
          this.error.set(errorKey);
          this.loading.set(false);
        },
      })
    );
  }

  /**
   * Reset the validation state
   */
  reset(): void {
    this.objectives.set([]);
    this.hasRedrawn.set(false);
    this.rejectedIds.set([]);
    this.isValidated.set(false);
    this.error.set(null);
  }

  /**
   * Get count of rejected objectives
   */
  getRejectedCount(): number {
    return this.rejectedIds().length;
  }

  /**
   * Check if can reject more objectives
   */
  canReject(): boolean {
    return this.rejectedIds().length < 2; // VALIDATION_CONSTANTS.MAX_REJECTS
  }

  /**
   * Calculate total points from current objectives
   */
  getTotalPoints(): number {
    return this.objectives().reduce((sum, obj) => sum + obj.points, 0);
  }
}
