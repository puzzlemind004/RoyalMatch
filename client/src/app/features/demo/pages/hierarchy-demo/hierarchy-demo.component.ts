/**
 * Color Hierarchy Demo Page
 *
 * Demonstrates the color hierarchy system with interactive controls
 */

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardSuit } from '../../../../models/card.model';
import { ColorHierarchyComponent } from '../../../game/components/color-hierarchy/color-hierarchy.component';

@Component({
  selector: 'app-hierarchy-demo',
  standalone: true,
  imports: [CommonModule, RouterLink, ColorHierarchyComponent],
  templateUrl: './hierarchy-demo.component.html',
  styleUrls: ['./hierarchy-demo.component.css'],
})
export class HierarchyDemoComponent {
  /**
   * Current dominant color (signal for reactivity)
   */
  dominantColor = signal<CardSuit>(CardSuit.HEARTS);

  /**
   * All available suits
   */
  allSuits: CardSuit[] = [CardSuit.HEARTS, CardSuit.DIAMONDS, CardSuit.CLUBS, CardSuit.SPADES];

  /**
   * Suit display names
   */
  suitNames: Record<CardSuit, string> = {
    [CardSuit.HEARTS]: 'Cœur ♥',
    [CardSuit.DIAMONDS]: 'Carreau ♦',
    [CardSuit.CLUBS]: 'Trèfle ♣',
    [CardSuit.SPADES]: 'Pique ♠',
  };

  /**
   * Change the dominant color
   */
  setDominantColor(suit: CardSuit): void {
    this.dominantColor.set(suit);
  }

  /**
   * Get button classes based on selection
   */
  getButtonClass(suit: CardSuit): string {
    const baseClasses =
      'px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base';
    const isSelected = this.dominantColor() === suit;

    if (isSelected) {
      return `${baseClasses} bg-yellow-500 text-black border-2 border-yellow-600 shadow-lg`;
    }

    return `${baseClasses} bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400`;
  }
}
