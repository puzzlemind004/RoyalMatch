/**
 * Scoring Demo Page
 * Demonstrates the scoring system with objective completion bonus
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import type { ObjectiveDefinition } from '../../../../models/objective.model';

interface ObjectiveVerificationResult {
  objective: ObjectiveDefinition;
  completed: boolean;
  points: number;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
}

interface PlayerScoreResult {
  playerId: string;
  roundPoints: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  bonusApplied: boolean;
  bonusPoints: number;
  totalScore: number;
  details: ObjectiveVerificationResult[];
}

interface ScoringResponse {
  roundId: string;
  gameId: string;
  players: Record<string, PlayerScoreResult>;
  timestamp: string;
}

@Component({
  selector: 'app-scoring-demo',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './scoring-demo.html',
  styleUrl: './scoring-demo.css',
})
export class ScoringDemoComponent implements OnInit {
  // State
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  scoringResult = signal<ScoringResponse | null>(null);
  allObjectivesCompleted = signal<boolean>(false);

  // Mock data for demo
  mockRoundData = {
    roundId: 'demo-round-1',
    gameId: 'demo-game',
    players: [
      {
        playerId: 'player-1',
        objectives: [] as ObjectiveDefinition[],
        tricks: [
          { winner: 'player-1', cards: [{ suit: 'hearts', value: 'A', numericValue: 14 }] },
          { winner: 'player-1', cards: [{ suit: 'hearts', value: 'K', numericValue: 13 }] },
          { winner: 'player-1', cards: [{ suit: 'diamonds', value: 'Q', numericValue: 12 }] },
        ],
        cardsPlayed: [
          { suit: 'hearts', value: 'A', numericValue: 14 },
          { suit: 'hearts', value: 'K', numericValue: 13 },
          { suit: 'diamonds', value: 'Q', numericValue: 12 },
        ],
        effectsActivated: 2,
        dominantSuit: 'hearts',
      },
    ],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMockObjectives();
  }

  /**
   * Load mock objectives for the demo player
   */
  loadMockObjectives(): void {
    this.http
      .get<{
        success: boolean;
        data: { objectives: Record<string, ObjectiveDefinition[]> };
      }>(`${environment.apiUrl}/api/objectives/available`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Take 3 easy objectives for demo
            const easyObjectives = response.data.objectives['easy']?.slice(0, 3) || [];
            this.mockRoundData.players[0].objectives = easyObjectives;
          }
        },
        error: () => {
          // Failed to load mock objectives - using empty array as fallback
        },
      });
  }

  /**
   * Trigger score calculation
   */
  calculateScores(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .post<{ success: boolean; data: ScoringResponse }>(
        `${environment.apiUrl}/api/scoring/calculate`,
        {
          roundId: this.mockRoundData.roundId,
          mockRoundData: this.mockRoundData,
        },
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.scoringResult.set(response.data);

            // Check if all objectives were completed for bonus display
            const playerResult = this.getPlayerResult();
            if (playerResult) {
              this.allObjectivesCompleted.set(playerResult.bonusApplied);
            }
          } else {
            this.error.set('game.errors.failedToCalculateScores');
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'game.errors.failedToCalculateScores');
          this.loading.set(false);
        },
      });
  }

  /**
   * Reset scores
   */
  resetScores(): void {
    this.http.post<{ success: boolean }>(`${environment.apiUrl}/api/scoring/reset`, {}).subscribe({
      next: () => {
        this.scoringResult.set(null);
        this.allObjectivesCompleted.set(false);
        this.error.set(null);
        this.loadMockObjectives();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'game.errors.failedToResetScores');
      },
    });
  }

  /**
   * Get player result (for template)
   */
  getPlayerResult(): PlayerScoreResult | null {
    const result = this.scoringResult();
    if (!result) return null;
    return result.players['player-1'] || null;
  }

  /**
   * Get completion percentage class for styling
   */
  getCompletionClass(completed: number, total: number): string {
    const percentage = (completed / total) * 100;
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  }

  /**
   * Get icon for objective status
   */
  getStatusIcon(completed: boolean): string {
    return completed ? '✅' : '❌';
  }
}
