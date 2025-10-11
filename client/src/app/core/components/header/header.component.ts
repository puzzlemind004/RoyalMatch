import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly menuOpen = signal(false);
  readonly currentLang = signal('fr');

  readonly demoLinks = [
    { path: '/demo/cards', label: 'Cartes', icon: '🎴' },
    { path: '/demo/effects', label: 'Effets', icon: '✨' },
    { path: '/demo/roulette', label: 'Roulette', icon: '🎡' },
    { path: '/demo/hierarchy', label: 'Hiérarchie', icon: '🎯' },
    { path: '/demo/trick-resolution', label: 'Plis', icon: '🃏' },
    { path: '/demo/objective-validation', label: 'Objectifs', icon: '🎯' },
    { path: '/demo/objective-verification', label: 'Vérification', icon: '✅' },
    { path: '/demo/scoring', label: 'Scores', icon: '🏆' },
    { path: '/demo/ranks', label: 'Rangs', icon: '💎' },
    { path: '/demo/auth', label: 'Auth', icon: '🔐' },
  ];

  constructor(
    private transloco: TranslocoService,
    protected authService: AuthService
  ) {
    this.currentLang.set(this.transloco.getActiveLang());
  }

  get user() {
    return this.authService.user();
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'fr' ? 'en' : 'fr';
    this.transloco.setActiveLang(newLang);
    this.currentLang.set(newLang);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.closeMenu();
  }
}
