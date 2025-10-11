import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslocoModule],
  templateUrl: './login.page.html',
})
export class LoginPage {
  readonly uid = signal('');
  readonly password = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private transloco: TranslocoService
  ) {}

  async onSubmit(): Promise<void> {
    if (!this.uid() || !this.password()) {
      this.error.set(this.transloco.translate('auth.errors.fillAllFields'));
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const loginData: LoginRequest = {
      uid: this.uid(),
      password: this.password(),
    };

    const response = await this.authService.login(loginData);

    if (response.success) {
      this.router.navigate(['/']);
    } else {
      this.error.set(this.transloco.translate(response.message));
    }

    this.loading.set(false);
  }

  updateUid(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.uid.set(value);
  }

  updatePassword(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.password.set(value);
  }
}
