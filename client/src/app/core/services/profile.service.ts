import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  UserStatistics,
  GameHistoryEntry,
  StatisticsResponse,
  GameHistoryResponse,
  LeaderboardResponse,
} from '../../models/statistics.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiUrl}/api/statistics`;

  // Signals for reactive state management
  private readonly currentUserStatistics = signal<UserStatistics | null>(null);
  private readonly gameHistory = signal<GameHistoryEntry[]>([]);
  private readonly leaderboard = signal<UserStatistics[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Get current user statistics
   */
  async getMyStatistics(): Promise<UserStatistics | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<StatisticsResponse>(`${this.apiUrl}/me`)
      );

      if (response.success && response.data) {
        this.currentUserStatistics.set(response.data);
        return response.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get statistics for a specific user
   */
  async getUserStatistics(userId: string): Promise<UserStatistics | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<StatisticsResponse>(`${this.apiUrl}/${userId}`)
      );

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current user game history
   */
  async getMyGameHistory(limit: number = 10): Promise<GameHistoryEntry[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<GameHistoryResponse>(`${this.apiUrl}/me/history?limit=${limit}`)
      );

      if (response.success && response.data) {
        this.gameHistory.set(response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get game history for a specific user
   */
  async getUserGameHistory(userId: string, limit: number = 10): Promise<GameHistoryEntry[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<GameHistoryResponse>(`${this.apiUrl}/${userId}/history?limit=${limit}`)
      );

      if (response.success && response.data) {
        return response.data;
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10): Promise<UserStatistics[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<LeaderboardResponse>(`${this.apiUrl}/leaderboard?limit=${limit}`)
      );

      if (response.success && response.data) {
        this.leaderboard.set(response.data);
        return response.data;
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Reset current user statistics (for testing)
   */
  async resetMyStatistics(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.delete<{ success: boolean }>(`${this.apiUrl}/me/reset`)
      );

      if (response.success) {
        this.currentUserStatistics.set(null);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user statistics signal (reactive)
   */
  getCurrentUserStatistics() {
    return this.currentUserStatistics();
  }

  /**
   * Get game history signal (reactive)
   */
  getGameHistorySignal() {
    return this.gameHistory();
  }

  /**
   * Get leaderboard signal (reactive)
   */
  getLeaderboardSignal() {
    return this.leaderboard();
  }
}
