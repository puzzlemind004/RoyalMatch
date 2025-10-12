import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  User,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  MeResponse,
  LogoutResponse,
} from '../../models/auth.model';
import { firstValueFrom } from 'rxjs';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  // Signals for reactive state management
  private readonly currentUser = signal<User | null>(this.getUserFromStorage());
  private readonly token = signal<string | null>(this.getTokenFromStorage());

  // Computed signals
  readonly user = computed(() => this.currentUser());
  readonly isAuthenticated = computed(() => !!this.token());

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/register`, data),
      );

      if (response.success && response.data) {
        this.handleAuthSuccess(response.data.user, response.data.token.value);
      }

      return response;
    } catch (error: any) {
      // If backend returns structured error response (validation errors, etc.)
      if (error.error && typeof error.error === 'object') {
        return {
          success: false,
          message: error.error.message || 'auth.errors.registerFailed',
          errors: error.error.errors,
        };
      }

      // Network or unknown errors
      return {
        success: false,
        message: 'auth.errors.registerFailed',
      };
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, data),
      );

      if (response.success && response.data) {
        this.handleAuthSuccess(response.data.user, response.data.token.value);
      }

      return response;
    } catch (error: any) {
      // If backend returns structured error response (validation errors, etc.)
      if (error.error && typeof error.error === 'object') {
        return {
          success: false,
          message: error.error.message || 'auth.errors.loginFailed',
          errors: error.error.errors,
        };
      }

      // Network or unknown errors
      return {
        success: false,
        message: 'auth.errors.loginFailed',
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      if (this.token()) {
        await firstValueFrom(this.http.post<LogoutResponse>(`${this.apiUrl}/logout`, {}));
      }
    } catch (error) {
      // Silently handle logout errors
    } finally {
      this.clearAuth();
      this.router.navigate(['/login']);
    }
  }

  /**
   * Get current authenticated user from server
   */
  async me(): Promise<User | null> {
    try {
      const response = await firstValueFrom(this.http.get<MeResponse>(`${this.apiUrl}/me`));

      if (response.success && response.data) {
        this.currentUser.set(response.data.user);
        this.saveUserToStorage(response.data.user);
        return response.data.user;
      }

      return null;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  /**
   * Get auth token for HTTP requests
   */
  getToken(): string | null {
    return this.token();
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.user();
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(user: User, token: string): void {
    this.currentUser.set(user);
    this.token.set(token);
    this.saveToStorage(user, token);
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    this.currentUser.set(null);
    this.token.set(null);
    this.clearStorage();
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(user: User, token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Save user to localStorage
   */
  private saveUserToStorage(user: User): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Get token from localStorage
   */
  private getTokenFromStorage(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Clear localStorage
   */
  private clearStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
}
