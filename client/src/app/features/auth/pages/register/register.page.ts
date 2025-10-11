import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslocoModule],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  readonly username = signal('');
  readonly email = signal('');
  readonly password = signal('');
  readonly passwordConfirmation = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly validationErrors = signal<Record<string, string[]>>({});

  constructor(
    private authService: AuthService,
    private router: Router,
    private transloco: TranslocoService
  ) {}

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.validationErrors.set({});

    const registerData: RegisterRequest = {
      username: this.username(),
      email: this.email(),
      password: this.password(),
      password_confirmation: this.passwordConfirmation(),
    };

    const response = await this.authService.register(registerData);

    if (response.success) {
      this.router.navigate(['/']);
    } else {
      // Handle validation errors
      if (response.errors) {
        this.validationErrors.set(response.errors);
      }
      // Show general error message
      this.error.set(this.transloco.translate(response.message));
    }

    this.loading.set(false);
  }

  private validateForm(): boolean {
    if (!this.username() || !this.email() || !this.password() || !this.passwordConfirmation()) {
      this.error.set(this.transloco.translate('auth.errors.fillAllFields'));
      return false;
    }

    if (this.password() !== this.passwordConfirmation()) {
      this.error.set(this.transloco.translate('auth.errors.passwordMismatch'));
      return false;
    }

    if (this.password().length < 8) {
      this.error.set(this.transloco.translate('auth.errors.passwordTooShort'));
      return false;
    }

    return true;
  }

  updateUsername(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.username.set(value);
  }

  updateEmail(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.email.set(value);
  }

  updatePassword(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.password.set(value);
  }

  updatePasswordConfirmation(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.passwordConfirmation.set(value);
  }
}
