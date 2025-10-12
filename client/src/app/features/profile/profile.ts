import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ProfileService } from '../../core/services/profile.service';
import { UserStatistics, GameHistoryEntry } from '../../models/statistics.model';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  statistics = signal<UserStatistics | null>(null);
  gameHistory = signal<GameHistoryEntry[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private profileService: ProfileService,
    private transloco: TranslocoService,
  ) {}

  async ngOnInit() {
    await this.loadProfile();
  }

  async loadProfile() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const stats = await this.profileService.getMyStatistics();
      const history = await this.profileService.getMyGameHistory(10);

      this.statistics.set(stats);
      this.gameHistory.set(history);
    } catch (err) {
      this.error.set('profile.errors.loadFailed');
    } finally {
      this.loading.set(false);
    }
  }

  async resetStatistics() {
    const confirmMessage = this.transloco.translate('profile.confirm.reset');
    if (confirm(confirmMessage)) {
      const success = await this.profileService.resetMyStatistics();
      if (success) {
        await this.loadProfile();
      }
    }
  }

  getWinRateColor(winRate: number): string {
    if (winRate >= 60) return 'text-success';
    if (winRate >= 40) return 'text-warning';
    return 'text-danger';
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const currentLang = this.transloco.getActiveLang();
    const locale = currentLang === 'fr' ? 'fr-FR' : 'en-US';

    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
