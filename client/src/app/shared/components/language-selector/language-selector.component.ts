/**
 * Language Selector Component
 * Reusable component for switching between FR/EN
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css',
})
export class LanguageSelectorComponent {
  constructor(private transloco: TranslocoService) {}

  get currentLocale(): string {
    return this.transloco.getActiveLang();
  }

  switchLocale(locale: string): void {
    this.transloco.setActiveLang(locale);
  }
}
