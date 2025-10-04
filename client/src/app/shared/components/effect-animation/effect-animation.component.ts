import { Component, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { EffectAnimation } from '../../../models/effect.model';

@Component({
  selector: 'app-effect-animation',
  imports: [CommonModule],
  templateUrl: './effect-animation.component.html',
  styleUrl: './effect-animation.component.css',
  standalone: true,
})
export class EffectAnimationComponent {
  // Input signal for animation data
  animation = input<EffectAnimation | null>(null);

  // Track if animation is playing
  isPlaying = false;

  constructor() {
    // Watch for animation changes
    effect(() => {
      const anim = this.animation();
      if (anim) {
        this.playAnimation(anim);
      }
    });
  }

  /**
   * Play the animation
   */
  private playAnimation(anim: EffectAnimation): void {
    this.isPlaying = true;

    // Auto-stop after duration
    setTimeout(() => {
      this.isPlaying = false;
    }, anim.duration);
  }

  /**
   * Get animation class based on type
   */
  getAnimationClass(): string {
    const anim = this.animation();
    if (!anim || !this.isPlaying) return '';

    const baseClass = 'effect-animation';
    return `${baseClass} ${baseClass}--${anim.type} ${baseClass}--active`;
  }

  /**
   * Get animation styles
   */
  getAnimationStyles(): Record<string, string> {
    const anim = this.animation();
    if (!anim) return {};

    return {
      '--effect-color': anim.color,
      '--effect-duration': `${anim.duration}ms`,
      ...(anim.position
        ? {
            '--effect-x': `${anim.position.x}px`,
            '--effect-y': `${anim.position.y}px`,
          }
        : {}),
    };
  }
}
