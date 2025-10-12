/**
 * Objective Validation Demo Page
 * Demonstrates the objective validation functionality with timer, redraw, and reject
 */

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ObjectiveValidationComponent } from '../../../../shared/components/objective-validation/objective-validation';
import { ObjectiveDistributionComponent } from '../../../../shared/components/objective-distribution/objective-distribution.component';
import { ObjectiveDistributionService } from '../../../../core/services/objective-distribution.service';
import type { ObjectiveDefinition } from '../../../../models/objective.model';

@Component({
  selector: 'app-objective-validation-demo',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ObjectiveValidationComponent,
    ObjectiveDistributionComponent,
  ],
  templateUrl: './objective-validation-demo.html',
  styleUrl: './objective-validation-demo.css',
})
export class ObjectiveValidationDemoComponent implements OnInit {
  // State: are we drawing or validating?
  phase = signal<'draw' | 'validate' | 'completed'>('draw');

  // Drawn objectives ready for validation
  drawnObjectives = signal<ObjectiveDefinition[]>([]);

  // Validated objectives
  validatedObjectives = signal<ObjectiveDefinition[]>([]);

  // Expose drawnObjectives from service
  hasDrawnObjectives = computed(
    () => this.objectiveDistributionService.drawnObjectives().length > 0,
  );

  constructor(private objectiveDistributionService: ObjectiveDistributionService) {}

  ngOnInit(): void {
    // Subscribe to drawn objectives from the distribution component
    this.objectiveDistributionService.drawnObjectives.set([]);
  }

  /**
   * Handle when objectives are drawn from distribution component
   */
  onObjectivesDrawn(): void {
    const objectives = this.objectiveDistributionService.drawnObjectives();
    if (objectives.length > 0) {
      this.drawnObjectives.set(objectives);
      this.phase.set('validate');
    }
  }

  /**
   * Handle when objectives are validated
   */
  onObjectivesValidated(objectives: ObjectiveDefinition[]): void {
    this.validatedObjectives.set(objectives);
    this.phase.set('completed');
  }

  /**
   * Handle validation timeout
   */
  onValidationTimeout(): void {
    // Timeout handled - objectives auto-validated
  }

  /**
   * Reset the demo
   */
  resetDemo(): void {
    this.phase.set('draw');
    this.drawnObjectives.set([]);
    this.validatedObjectives.set([]);
    this.objectiveDistributionService.reset();
  }
}
