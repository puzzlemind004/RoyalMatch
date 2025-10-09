/**
 * Objective Distribution Service
 * Handles API calls for objective distribution
 */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AvailableObjectivesResponse,
  DrawObjectivesResponse,
  ObjectiveSelection,
  AvailableObjectives,
} from '../../models/objective-distribution.model';
import type { ObjectiveDefinition } from '../../models/objective.model';

@Injectable({
  providedIn: 'root',
})
export class ObjectiveDistributionService {
  private readonly apiUrl = `${environment.apiUrl}/api/objectives`;

  // Signals for state management
  availableObjectives = signal<AvailableObjectives | null>(null);
  drawnObjectives = signal<ObjectiveDefinition[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Load available objectives from API
   */
  loadAvailableObjectives(): Observable<AvailableObjectivesResponse> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<AvailableObjectivesResponse>(`${this.apiUrl}/available`).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.availableObjectives.set(response.data.objectives);
          }
          this.loading.set(false);
        },
        error: (err) => {
          // Extract translation key from backend response if available
          const errorKey = err.error?.message || 'game.errors.failedToLoadObjectives';
          this.error.set(errorKey);
          this.loading.set(false);
        },
      })
    );
  }

  /**
   * Draw objectives based on player's selection
   */
  drawObjectives(
    selection: ObjectiveSelection,
    gameId: string = 'demo-game',
    playerId: string = 'demo-player'
  ): Observable<DrawObjectivesResponse> {
    this.loading.set(true);
    this.error.set(null);

    const payload = {
      ...selection,
      gameId,
      playerId,
    };

    return this.http.post<DrawObjectivesResponse>(`${this.apiUrl}/draw`, payload).pipe(
      tap({
        next: (response) => {
          if (response.success) {
            this.drawnObjectives.set(response.data.objectives);
          }
          this.loading.set(false);
        },
        error: (err) => {
          // Extract translation key from backend response if available
          const errorKey = err.error?.message || 'game.errors.failedToDrawObjectives';
          this.error.set(errorKey);
          this.loading.set(false);
        },
      })
    );
  }

  /**
   * Reset drawn objectives
   */
  reset(): void {
    this.drawnObjectives.set([]);
    this.error.set(null);
  }

  /**
   * Get total count of drawn objectives
   */
  getDrawnCount(): number {
    return this.drawnObjectives().length;
  }

  /**
   * Calculate total points from drawn objectives
   */
  getTotalPoints(): number {
    return this.drawnObjectives().reduce((sum, obj) => sum + obj.points, 0);
  }
}
