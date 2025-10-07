/**
 * Objective Distribution Demo Page
 * Standalone demo page to showcase objective distribution functionality
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ObjectiveDistributionComponent } from '../../../shared/components/objective-distribution/objective-distribution.component';

@Component({
  selector: 'app-objective-distribution-demo',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ObjectiveDistributionComponent],
  templateUrl: './objective-distribution-demo.component.html',
  styleUrl: './objective-distribution-demo.component.css',
})
export class ObjectiveDistributionDemoComponent {}
