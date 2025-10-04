import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EffectService } from '../../../../core/services/effect.service';
import { EffectAnimationComponent } from '../../../../shared/components/effect-animation/effect-animation.component';
import type { EffectDefinition, EffectAnimation } from '../../../../models/effect.model';

@Component({
  selector: 'app-effect-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, EffectAnimationComponent],
  templateUrl: './effect-demo.page.html',
  styleUrl: './effect-demo.page.css',
})
export class EffectDemoPage {
  // All card suits and values
  suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
  values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

  // Selected filters
  selectedSuit = signal<string | null>(null);
  selectedCategory = signal<string | null>(null);
  searchQuery = signal<string>('');

  // Current animation
  currentAnimation = signal<EffectAnimation | null>(null);

  // Mock effect definitions (will be loaded from JSON in real app)
  effects = signal<EffectDefinition[]>(this.loadMockEffects());

  // Filtered effects
  filteredEffects = computed(() => {
    let result = this.effects();

    // Filter by suit
    if (this.selectedSuit()) {
      result = result.filter((e) => e.card.suit === this.selectedSuit());
    }

    // Filter by category
    if (this.selectedCategory()) {
      result = result.filter((e) => e.category === this.selectedCategory());
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.card.value.toLowerCase().includes(query),
      );
    }

    return result;
  });

  constructor(public effectService: EffectService) {}

  /**
   * Load mock effects (in real app, this would fetch from server)
   */
  private loadMockEffects(): EffectDefinition[] {
    const mockEffects: EffectDefinition[] = [];

    // Generate all 52 effects based on JSON structure
    const effectData = {
      hearts: {
        2: { name: 'Petit Bonus', desc: '+1 point si vous gagnez ce pli' },
        3: { name: 'Révélation', desc: "Révélez un objectif d'un adversaire" },
        4: { name: 'Protection', desc: 'Ce pli ne compte pas négativement' },
        5: { name: 'Double Comptage', desc: 'Ce pli compte double pour vos objectifs' },
        6: { name: 'Bonus Conditionnel', desc: '+2 points si 2+ plis gagnés' },
        7: { name: "Copie d'Objectif", desc: 'Copiez un objectif non choisi' },
        8: { name: 'Bouclier', desc: 'Protégez vos plis contre effets négatifs' },
        9: { name: "Changement d'Objectif", desc: 'Défaussez et piochez un objectif' },
        10: { name: 'Espionnage', desc: "Révélez un objectif d'un adversaire" },
        J: { name: 'Tri-Bonus', desc: '+3 points si pli gagné avec couleur dominante' },
        Q: { name: 'Multiplicateur', desc: '2 prochains plis comptent double' },
        K: { name: 'Révélation Totale', desc: "Révélez tous les objectifs d'un adversaire" },
        A: { name: 'Grande Récompense', desc: 'Si tous objectifs remplis : +5 points' },
      },
      diamonds: {
        2: { name: 'Pioche Simple', desc: 'Piochez 1 carte au prochain tour' },
        3: { name: 'Défausse et Pioche', desc: 'Défaussez 1 carte et piochez-en 1' },
        4: { name: 'Vision', desc: 'Regardez les 2 prochaines cartes' },
        5: { name: 'Clairvoyance', desc: 'Regardez les 3 prochaines cartes' },
        6: { name: 'Recyclage', desc: 'Récupérez une carte jouée' },
        7: { name: 'Mélange', desc: 'Mélangez votre deck' },
        8: { name: 'Double Pioche', desc: 'Piochez 2 cartes au prochain tour' },
        9: { name: 'Échange Simple', desc: 'Échangez 1 carte avec votre deck' },
        10: { name: 'Grand Échange', desc: 'Échangez 2 cartes avec votre deck' },
        J: { name: 'Sélection', desc: 'Regardez 4 cartes, piochez-en 1' },
        Q: { name: 'Renouvellement', desc: 'Défaussez votre main et piochez autant' },
        K: { name: 'Triple Pioche', desc: 'Piochez 3 cartes au prochain tour' },
        A: { name: 'Grande Sélection', desc: 'Piochez 3 cartes, défaussez-en 2' },
      },
      clubs: {
        2: { name: 'Chance Simple', desc: '50% chance de piocher 1 carte' },
        3: { name: 'Chaos Mineur', desc: 'Tous les joueurs piochent 1 carte' },
        4: { name: 'Fortune', desc: 'Effet aléatoire : +1 ou +2 points' },
        5: { name: 'Pioche Aléatoire', desc: 'Effet aléatoire : piochez 1 ou 2 cartes' },
        6: { name: 'Distribution', desc: 'Tous défaussent 1 carte au hasard' },
        7: { name: 'Bénédiction', desc: 'Événement aléatoire bénéfique' },
        8: { name: 'Mélange Général', desc: 'Tous mélangent leur deck' },
        9: { name: 'Roulette Temporaire', desc: 'Relancez la roulette pour 1 tour' },
        10: { name: 'Inversion', desc: 'Inversez forte/faible au prochain tour' },
        J: { name: 'Chaos Total', desc: 'Effet aléatoire parmi 3 effets' },
        Q: { name: 'Échange de Mains', desc: 'Échangez votre main avec un adversaire' },
        K: { name: 'Mélange des Mains', desc: 'Mélangez toutes les mains' },
        A: { name: 'Grande Roulette', desc: 'Relancez la roulette pour 1 tour' },
      },
      spades: {
        2: { name: 'Espionnage Léger', desc: "Regardez la main d'un adversaire" },
        3: { name: 'Sabotage', desc: 'Un adversaire défausse 1 carte' },
        4: { name: 'Blocage Faible', desc: 'Bloquez un effet de valeur ≤ 5' },
        5: { name: 'Défausse Forcée', desc: '1 adversaire défausse 1 carte au hasard' },
        6: { name: 'Perturbation', desc: '1 adversaire joue au hasard' },
        7: { name: 'Vol Simple', desc: "Volez 1 carte d'un adversaire" },
        8: { name: 'Annulation de Pli', desc: '1 adversaire ne gagne pas de points' },
        9: { name: 'Blocage Moyen', desc: 'Bloquez un effet de valeur ≤ 10' },
        10: { name: 'Contre', desc: "Annulez l'effet le plus fort ce tour" },
        J: { name: 'Double Défausse', desc: '1 adversaire défausse 2 cartes' },
        Q: { name: 'Blocage Total', desc: "Bloquez n'importe quel effet" },
        K: { name: "Suppression d'Objectif", desc: '1 adversaire perd 1 objectif' },
        A: { name: 'Grand Vol', desc: "Volez 2 cartes d'un adversaire" },
      },
    };

    for (const suit of this.suits) {
      for (const value of this.values) {
        const data = effectData[suit][value as keyof (typeof effectData)[typeof suit]];
        const category =
          suit === 'hearts'
            ? 'objective'
            : suit === 'diamonds'
              ? 'draw'
              : suit === 'clubs'
                ? 'random'
                : 'attack';

        mockEffects.push({
          id: `${value}${suit[0].toUpperCase()}`,
          card: { value, suit },
          name: data.name,
          description: data.desc,
          category,
          targetType: category === 'attack' ? 'opponent' : 'self',
          needsTarget: category === 'attack' || suit === 'hearts',
          timing: 'immediate',
        });
      }
    }

    return mockEffects;
  }

  /**
   * Get suit symbol
   */
  getSuitSymbol(suit: string): string {
    const symbols: Record<string, string> = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠',
    };
    return symbols[suit] || '?';
  }

  /**
   * Get suit color
   */
  getSuitColor(suit: string): string {
    return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
  }

  /**
   * Trigger effect animation
   */
  triggerEffect(effect: EffectDefinition, event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    const animation: EffectAnimation = {
      type:
        effect.category === 'objective'
          ? 'aura'
          : effect.category === 'draw'
            ? 'explosion' // Orange explosion for diamonds
            : effect.category === 'random'
              ? 'tornado' // New tornado animation for clubs
              : 'lightning',
      color: this.effectService.getEffectCategoryColor(effect.category),
      duration: 1500,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
    };

    this.currentAnimation.set(animation);
    setTimeout(() => this.currentAnimation.set(null), 1500);
  }

  /**
   * Clear filters
   */
  clearFilters(): void {
    this.selectedSuit.set(null);
    this.selectedCategory.set(null);
    this.searchQuery.set('');
  }
}
