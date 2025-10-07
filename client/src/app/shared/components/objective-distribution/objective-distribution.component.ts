/**
 * Objective Distribution Component
 * UI for selecting and drawing objectives by difficulty
 */

import { Component, OnInit, computed, signal, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ObjectiveDistributionService } from '../../../core/services/objective-distribution.service';
import type { ObjectiveSelection } from '../../../models/objective-distribution.model';
import { DIFFICULTY_COLORS, CATEGORY_ICONS } from '../../../models/objective.model';

@Component({
  selector: 'app-objective-distribution',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './objective-distribution.component.html',
  styleUrl: './objective-distribution.component.css',
})
export class ObjectiveDistributionComponent implements OnInit {
  // Inputs
  gameId = input<string>('demo-game');
  playerId = input<string>('demo-player');

  // Inject service
  public service = inject(ObjectiveDistributionService);

  // Selection signals
  easyCount = signal<number>(0);
  mediumCount = signal<number>(0);
  hardCount = signal<number>(0);

  // Computed total
  totalCount = computed(() => this.easyCount() + this.mediumCount() + this.hardCount());

  // Check if can draw (minimum 3 objectives)
  canDraw = computed(() => this.totalCount() >= 3);

  // Expose service signals
  availableObjectives = this.service.availableObjectives;
  drawnObjectives = this.service.drawnObjectives;
  loading = this.service.loading;
  error = this.service.error;

  // UI constants
  readonly DIFFICULTY_COLORS = DIFFICULTY_COLORS;
  readonly CATEGORY_ICONS = CATEGORY_ICONS;

  ngOnInit(): void {
    // Load available objectives on init
    this.service.loadAvailableObjectives().subscribe();
  }

  /**
   * Increment difficulty counter
   */
  increment(difficulty: 'easy' | 'medium' | 'hard'): void {
    const available = this.availableObjectives();
    if (!available) return;

    const maxCount = available[difficulty].length;

    if (difficulty === 'easy' && this.easyCount() < maxCount) {
      this.easyCount.update((v) => v + 1);
    } else if (difficulty === 'medium' && this.mediumCount() < maxCount) {
      this.mediumCount.update((v) => v + 1);
    } else if (difficulty === 'hard' && this.hardCount() < maxCount) {
      this.hardCount.update((v) => v + 1);
    }
  }

  /**
   * Decrement difficulty counter
   */
  decrement(difficulty: 'easy' | 'medium' | 'hard'): void {
    if (difficulty === 'easy' && this.easyCount() > 0) {
      this.easyCount.update((v) => v - 1);
    } else if (difficulty === 'medium' && this.mediumCount() > 0) {
      this.mediumCount.update((v) => v - 1);
    } else if (difficulty === 'hard' && this.hardCount() > 0) {
      this.hardCount.update((v) => v - 1);
    }
  }

  /**
   * Check if can increment a difficulty
   */
  canIncrement(difficulty: 'easy' | 'medium' | 'hard'): boolean {
    const available = this.availableObjectives();
    if (!available) return false;

    const maxCount = available[difficulty].length;

    if (difficulty === 'easy') return this.easyCount() < maxCount;
    if (difficulty === 'medium') return this.mediumCount() < maxCount;
    if (difficulty === 'hard') return this.hardCount() < maxCount;

    return false;
  }

  /**
   * Draw objectives with current selection
   */
  drawObjectives(): void {
    const selection: ObjectiveSelection = {
      easy: this.easyCount(),
      medium: this.mediumCount(),
      hard: this.hardCount(),
    };

    this.service.drawObjectives(selection, this.gameId(), this.playerId()).subscribe();
  }

  /**
   * Reset selection and drawn objectives
   */
  reset(): void {
    this.easyCount.set(0);
    this.mediumCount.set(0);
    this.hardCount.set(0);
    this.service.reset();
  }

  /**
   * Get available count for a difficulty
   */
  getAvailableCount(difficulty: 'easy' | 'medium' | 'hard'): number {
    const available = this.availableObjectives();
    return available ? available[difficulty].length : 0;
  }
}
