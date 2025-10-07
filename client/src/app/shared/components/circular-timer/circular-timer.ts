/**
 * Circular Timer Component
 * Reusable circular progress timer with color transitions
 */

import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circular-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circular-timer.html',
  styleUrl: './circular-timer.css',
})
export class CircularTimerComponent {
  // Inputs
  remainingTime = input.required<number>(); // Remaining time in seconds
  totalTime = input.required<number>(); // Total duration in seconds
  size = input<number>(160); // Size in pixels (default 160px)

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
    return circ - (pct / 100) * circ;
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
}
