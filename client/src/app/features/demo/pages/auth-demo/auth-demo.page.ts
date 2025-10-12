import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../models/auth.model';

@Component({
  selector: 'app-auth-demo',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoModule],
  templateUrl: './auth-demo.page.html',
})
export class AuthDemoPage implements OnInit {
  readonly user = signal<User | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private transloco: TranslocoService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadCurrentUser();
  }

  async loadCurrentUser(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const user = await this.authService.me();
      this.user.set(user);
    } catch (err: any) {
      this.error.set(this.transloco.translate('auth.errors.notAuthenticated'));
    } finally {
      this.loading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.logout();
      // Redirection handled by service
    } catch (err: any) {
      this.error.set(this.transloco.translate('auth.errors.logoutFailed'));
      this.loading.set(false);
    }
  }
}
