/**
 * Circular Timer Component
 * Reusable circular progress timer with color transitions
 */

import { Component, input, computed, signal, output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-circular-timer',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './circular-timer.html',
  styleUrl: './circular-timer.css',
})
export class CircularTimerComponent implements OnDestroy {
  // Inputs
  totalTime = input.required<number>(); // Total duration in seconds
  size = input<number>(160); // Size in pixels (default 160px)
  updateInterval = input<number>(100); // Update interval in ms for smooth animation (default 100ms)

  // Outputs
  timerComplete = output<void>(); // Emitted when timer reaches 0

  // Internal state
  remainingTime = signal<number>(0); // Current remaining time
  private timerInterval?: ReturnType<typeof setInterval>;
  private startTime: number = 0;
  private pausedTime: number = 0;

  // Expose Math for template
  readonly Math = Math;

  // Computed values
  percentage = computed(() => {
    const remaining = this.remainingTime();
    const total = this.totalTime();
    return total > 0 ? (remaining / total) * 100 : 0;
  });

  // SVG circle properties (radius proportional to size)
  radius = computed(() => (this.size() / 2) - 10); // 10px padding for stroke
  circumference = computed(() => 2 * Math.PI * this.radius());
  strokeDashoffset = computed(() => {
    const circ = this.circumference();
    const pct = this.percentage();
    // SVG stroke-dashoffset behavior:
    // - offset = 0 → circle fully visible (drawn)
    // - offset = circumference → circle fully hidden (not drawn)
    //
    // We want:
    // - 100% time remaining → offset = 0 (full circle visible)
    // - 0% time remaining → offset = circ (circle hidden)
    //
    // Formula: offset = circ * (1 - percentage/100)
    return circ * (1 - pct / 100);
  });

  // Color classes based on remaining percentage
  getStrokeColorClass = computed((): string => {
    const pct = this.percentage();
    if (pct <= 22) return 'stroke-red-500'; // Below 22% (10s on 45s)
    if (pct <= 44) return 'stroke-orange-500'; // Below 44% (20s on 45s)
    return 'stroke-green-500'; // Above 44%
  });

  getTextColorClass = computed((): string => {
    const pct = this.percentage();
    if (pct <= 22) return 'text-red-600 font-bold animate-pulse';
    if (pct <= 44) return 'text-orange-600 font-semibold';
    return 'text-gray-800 font-semibold';
  });

  // Background ring color (lighter version)
  getBackgroundColorClass = computed((): string => {
    const pct = this.percentage();
    if (pct <= 22) return 'stroke-red-100';
    if (pct <= 44) return 'stroke-orange-100';
    return 'stroke-green-100';
  });

  /**
   * Start the timer countdown
   */
  start(): void {
    // Stop any existing timer
    this.stop();

    // Initialize
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.remainingTime.set(this.totalTime());

    // Use interval for smooth updates
    this.timerInterval = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000; // Convert to seconds
      const newTime = this.totalTime() - elapsed;

      if (newTime <= 0) {
        this.remainingTime.set(0);
        this.stop();
        this.timerComplete.emit();
      } else {
        this.remainingTime.set(newTime);
      }
    }, this.updateInterval());
  }

  /**
   * Stop the timer
   */
  stop(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  /**
   * Pause the timer
   */
  pause(): void {
    if (this.timerInterval) {
      this.pausedTime = Date.now() - this.startTime;
      this.stop();
    }
  }

  /**
   * Resume the timer from paused state
   */
  resume(): void {
    if (this.pausedTime > 0) {
      this.startTime = Date.now() - this.pausedTime;
      this.start();
    }
  }

  /**
   * Reset the timer to initial state
   */
  reset(): void {
    this.stop();
    this.remainingTime.set(this.totalTime());
    this.pausedTime = 0;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
