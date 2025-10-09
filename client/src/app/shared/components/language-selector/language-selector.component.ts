/**
 * Language Selector Component
 * Reusable component for switching between FR/EN
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';

interface Language {
  code: string;
  flag: string;
  label: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css',
})
export class LanguageSelectorComponent {
  languages: Language[] = [
    { code: 'fr', flag: '', label: 'FR - Français' },
    { code: 'en', flag: '', label: 'EN - English' },
  ];

  constructor(private transloco: TranslocoService) {}

  get currentLocale(): string {
    return this.transloco.getActiveLang();
  }

  get currentLanguage(): Language | undefined {
    return this.languages.find((lang) => lang.code === this.currentLocale);
  }

  switchLocale(locale: string): void {
    this.transloco.setActiveLang(locale);
  }
}
