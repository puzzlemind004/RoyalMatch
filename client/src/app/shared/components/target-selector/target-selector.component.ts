import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Player {
  id: number;
  name: string;
  avatar?: string;
  isCurrentPlayer?: boolean;
}

@Component({
  selector: 'app-target-selector',
  imports: [CommonModule],
  templateUrl: './target-selector.component.html',
  styleUrl: './target-selector.component.css',
  standalone: true,
})
export class TargetSelectorComponent {
  // Inputs
  players = input<Player[]>([]);
  targetType = input<'opponent' | 'all' | 'random'>('opponent');
  selectedTargetId = input<number | null>(null);
  effectName = input<string>('Sélectionnez une cible');

  // Outputs
  targetSelected = output<number>();
  cancelled = output<void>();

  /**
   * Check if a player can be selected as target
   */
  canSelectPlayer(player: Player): boolean {
    const type = this.targetType();

    switch (type) {
      case 'opponent':
        return !player.isCurrentPlayer;
      case 'all':
        return true;
      case 'random':
        return false; // Random target is auto-selected
      default:
        return false;
    }
  }

  /**
   * Handle player selection
   */
  selectPlayer(player: Player): void {
    if (this.canSelectPlayer(player)) {
      this.targetSelected.emit(player.id);
    }
  }

  /**
   * Handle cancel
   */
  cancel(): void {
    this.cancelled.emit();
  }

  /**
   * Get selectable players
   */
  getSelectablePlayers(): Player[] {
    return this.players().filter((p) => this.canSelectPlayer(p));
  }

  /**
   * Check if player is selected
   */
  isPlayerSelected(player: Player): boolean {
    return this.selectedTargetId() === player.id;
  }
}
