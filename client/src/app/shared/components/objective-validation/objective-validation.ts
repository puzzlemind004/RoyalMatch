/**
 * Objective Validation Component
 * Main component for validating objectives with timer, redraw, and reject functionality
 */

import { Component, OnInit, OnDestroy, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ObjectiveValidationService } from '../../../core/services/objective-validation.service';
import { ObjectiveCardComponent } from '../objective-card/objective-card';
import { CircularTimerComponent } from '../circular-timer/circular-timer';
import type { ObjectiveDefinition } from '../../../models/objective.model';
import { VALIDATION_CONSTANTS } from '../../../models/objective-validation.model';

@Component({
  selector: 'app-objective-validation',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ObjectiveCardComponent, CircularTimerComponent],
  templateUrl: './objective-validation.html',
  styleUrl: './objective-validation.css',
})
export class ObjectiveValidationComponent implements OnInit, OnDestroy {
  // Inputs
  initialObjectives = input.required<ObjectiveDefinition[]>();
  gameId = input<string>('demo-game');
  playerId = input<string>('demo-player');
  autoStart = input<boolean>(true);

  // Outputs
  validated = output<ObjectiveDefinition[]>(); // Emitted when objectives are validated
  timeout = output<void>(); // Emitted when timer reaches 0

  // Service
  private service = inject(ObjectiveValidationService);
  private transloco = inject(TranslocoService);

  // Expose service signals
  objectives = this.service.objectives;
  hasRedrawn = this.service.hasRedrawn;
  remainingTime = this.service.remainingTime;
  isValidated = this.service.isValidated;
  loading = this.service.loading;
  error = this.service.error;
  rejectedIds = this.service.rejectedIds;

  // Timer interval ID
  private timerInterval?: ReturnType<typeof setInterval>;

  // Constants
  readonly MAX_REJECTS = VALIDATION_CONSTANTS.MAX_REJECTS;

  // Computed properties
  canRedraw = computed(() => !this.hasRedrawn() && !this.isValidated() && this.rejectedCount() === 0);
  canReject = computed(() => this.service.canReject() && !this.isValidated() && !this.hasRedrawn());
  canValidate = computed(() => !this.isValidated() && this.objectives().length > 0);
  totalPoints = computed(() => this.service.getTotalPoints());
  rejectedCount = computed(() => this.service.getRejectedCount());

  ngOnInit(): void {
    // Initialize with objectives
    this.service.setObjectives(this.initialObjectives());

    // Start timer if autoStart
    if (this.autoStart()) {
      this.startTimer();
    }
  }

  ngOnDestroy(): void {
    // Clean up timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  /**
   * Start the countdown timer
   */
  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.service.remainingTime.update((time) => {
        const newTime = time - 1;
        if (newTime <= 0) {
          this.handleTimeout();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }

  /**
   * Handle timeout - auto-validate objectives
   */
  handleTimeout(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    if (!this.isValidated()) {
      this.validateObjectives();
      this.timeout.emit();
    }
  }

  /**
   * Redraw all objectives
   */
  redrawObjectives(): void {
    if (!this.canRedraw()) return;

    this.service.redrawObjectives(this.gameId(), this.playerId()).subscribe({
      next: (response) => {
        if (response.success) {
          // Reset timer when redrawing
          this.service.remainingTime.set(VALIDATION_CONSTANTS.TIMER_DURATION);
        }
      },
    });
  }

  /**
   * Reject an objective
   */
  rejectObjective(objectiveId: string): void {
    if (!this.canReject()) return;
    this.service.rejectObjective(objectiveId);
  }

  /**
   * Check if an objective is rejected
   */
  isObjectiveRejected(objectiveId: string): boolean {
    return this.rejectedIds().includes(objectiveId);
  }

  /**
   * Validate the current objectives
   */
  validateObjectives(): void {
    if (!this.canValidate()) return;

    this.service.validateObjectives(this.gameId(), this.playerId()).subscribe({
      next: (response) => {
        if (response.success) {
          this.validated.emit(response.data.validatedObjectives);
          // Stop timer
          if (this.timerInterval) {
            clearInterval(this.timerInterval);
          }
        }
      },
    });
  }

  // Constants for circular timer
  readonly TIMER_TOTAL_DURATION = VALIDATION_CONSTANTS.TIMER_DURATION;
}
