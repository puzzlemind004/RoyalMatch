/**
 * Objective Verification Demo Page
 * Demonstrates the objective verification system at end of round
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

interface PlayerVerificationResult {
  playerId: string;
  objectives: ObjectiveVerificationResult[];
  totalPoints: number;
  completedCount: number;
  failedCount: number;
}

interface VerificationResponse {
  roundId: string;
  gameId: string;
  players: Record<string, PlayerVerificationResult>;
  timestamp: string;
}

@Component({
  selector: 'app-objective-verification-demo',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './objective-verification-demo.html',
  styleUrl: './objective-verification-demo.css',
})
export class ObjectiveVerificationDemoComponent implements OnInit {
  // State
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  verificationResult = signal<VerificationResponse | null>(null);

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
          { winner: 'player-2', cards: [{ suit: 'clubs', value: 'J', numericValue: 11 }] },
        ],
        cardsPlayed: [
          { suit: 'hearts', value: 'A', numericValue: 14 },
          { suit: 'hearts', value: 'K', numericValue: 13 },
          { suit: 'diamonds', value: 'Q', numericValue: 12 },
          { suit: 'spades', value: '10', numericValue: 10 },
        ],
        effectsActivated: 2,
        dominantSuit: 'hearts',
      },
    ],
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Optionally load some test objectives
    this.loadMockObjectives();
  }

  /**
   * Load mock objectives for the demo player
   */
  loadMockObjectives(): void {
    // For demo, we'll use the objectives from the distribution demo
    // In a real scenario, these would come from validated objectives
    this.http.get<{ success: boolean; data: { objectives: Record<string, ObjectiveDefinition[]> } }>(
      `${environment.apiUrl}/api/objectives/available`
    ).subscribe({
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
   * Trigger objective verification
   */
  verifyObjectives(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .post<{ success: boolean; data: VerificationResponse }>(
        `${environment.apiUrl}/api/objectives/verify`,
        {
          roundId: this.mockRoundData.roundId,
          mockRoundData: this.mockRoundData,
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.verificationResult.set(response.data);
          } else {
            this.error.set('game.errors.failedToVerifyObjectives');
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'game.errors.failedToVerifyObjectives');
          this.loading.set(false);
        },
      });
  }

  /**
   * Reset the demo
   */
  resetDemo(): void {
    this.verificationResult.set(null);
    this.error.set(null);
    this.loadMockObjectives();
  }

  /**
   * Get player result (for template)
   */
  getPlayerResult(): PlayerVerificationResult | null {
    const result = this.verificationResult();
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
