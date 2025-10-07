/**
 * Objective Card Component
 * Displays a single objective with its details and actions
 */

import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import type { ObjectiveDefinition } from '../../../models/objective.model';
import {
  DIFFICULTY_COLORS,
  CATEGORY_ICONS,
  ObjectiveDifficulty,
} from '../../../models/objective.model';

@Component({
  selector: 'app-objective-card',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './objective-card.html',
  styleUrl: './objective-card.css',
})
export class ObjectiveCardComponent {
  // Inputs
  objective = input.required<ObjectiveDefinition>();
  canReject = input<boolean>(false);
  isRejected = input<boolean>(false);
  showActions = input<boolean>(true);

  // Outputs
  reject = output<string>(); // Emits objective ID

  // Constants
  readonly DIFFICULTY_COLORS = DIFFICULTY_COLORS;
  readonly CATEGORY_ICONS = CATEGORY_ICONS;

  constructor(private transloco: TranslocoService) {}

  /**
   * Get translated difficulty label
   */
  getDifficultyLabel = computed((): string => {
    const difficulty = this.objective().difficulty;
    return this.transloco.translate(`objectives.difficulty.${difficulty}`);
  });

  /**
   * Get difficulty color classes
   */
  getDifficultyClasses = computed((): string => {
    return DIFFICULTY_COLORS[this.objective().difficulty];
  });

  /**
   * Get category icon
   */
  getCategoryIcon = computed((): string => {
    return CATEGORY_ICONS[this.objective().category];
  });

  /**
   * Get translated objective name
   */
  getObjectiveName = computed((): string => {
    return this.transloco.translate(this.objective().nameKey);
  });

  /**
   * Get translated objective description
   */
  getObjectiveDescription = computed((): string => {
    return this.transloco.translate(this.objective().descriptionKey);
  });

  /**
   * Handle reject button click
   */
  onReject(): void {
    if (this.canReject() && !this.isRejected()) {
      this.reject.emit(this.objective().id);
    }
  }
}
