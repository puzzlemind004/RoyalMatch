import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RankTier, getRankDisplayInfo } from '../../../models/rank.model';

/**
 * Rank icon component
 * Displays a colored SVG icon or emoji based on the player's rank tier
 *
 * Usage:
 * <app-rank-icon [rank]="'diamond'" />
 * <app-rank-icon [rank]="'unranked'" /> // Shows nothing
 */
@Component({
  selector: 'app-rank-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (rankInfo) {
      @if (isEmoji) {
        <!-- Emoji display (for diamond) -->
        <span
          class="inline-flex items-center justify-center text-lg"
          [title]="rankInfo.tier"
        >{{ rankInfo.svg }}</span>
      } @else {
        <!-- SVG display -->
        <span
          class="inline-flex items-center justify-center"
          [style.color]="rankInfo.color"
          [innerHTML]="sanitizedSvg"
          [title]="rankInfo.tier"
        ></span>
      }
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class RankIconComponent implements OnInit {
  @Input() rank: RankTier | null = null;

  rankInfo: { tier: string; color: string; svg: string } | null = null;
  sanitizedSvg: SafeHtml = '';
  isEmoji = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.rankInfo = getRankDisplayInfo(this.rank);
    if (this.rankInfo) {
      // Check if it's an emoji (doesn't start with <svg)
      this.isEmoji = !this.rankInfo.svg.startsWith('<svg');

      if (!this.isEmoji) {
        this.sanitizedSvg = this.sanitizer.bypassSecurityTrustHtml(this.rankInfo.svg);
      }
    }
  }
}
