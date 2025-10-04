import { Injectable, signal } from '@angular/core';

export type SupportedLocale = 'fr' | 'en';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private currentLocale = signal<SupportedLocale>('fr');

  getCurrentLocale(): SupportedLocale {
    return this.currentLocale();
  }

  setLocale(locale: SupportedLocale): void {
    this.currentLocale.set(locale);
  }

  // Détecte la langue du navigateur au démarrage
  detectBrowserLocale(): void {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'fr' || browserLang === 'en') {
      this.setLocale(browserLang as SupportedLocale);
    }
  }
}
