import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-layout',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './demo-layout.component.html',
  styleUrl: './demo-layout.component.css',
})
export class DemoLayoutComponent {
  demoLinks = [
    { path: '/demo/cards', label: 'Cartes', icon: '🎴' },
    { path: '/demo/effects', label: 'Effets', icon: '✨' },
    { path: '/demo/roulette', label: 'Roulette', icon: '🎡' },
    { path: '/demo/hierarchy', label: 'Hiérarchie', icon: '🎯' },
    { path: '/demo/trick-resolution', label: 'Plis', icon: '🃏' },
    // Future demos will be added here
    // { path: '/demo/game', label: 'Partie', icon: '🎮' },
    // { path: '/demo/players', label: 'Joueurs', icon: '👥' },
  ];
}
