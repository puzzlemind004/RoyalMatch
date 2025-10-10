import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankIconComponent } from '../../../../shared/components/rank-icon/rank-icon.component';
import { RankTier } from '../../../../models/rank.model';

interface PlayerExample {
  username: string;
  rank: RankTier;
  elo?: number;
}

@Component({
  selector: 'app-rank-demo',
  standalone: true,
  imports: [CommonModule, RankIconComponent],
  templateUrl: './rank-demo.page.html',
  styleUrl: './rank-demo.page.css',
})
export class RankDemoPage {
  /**
   * Example players showcasing each rank tier
   */
  players: PlayerExample[] = [
    {
      username: 'Non Classé',
      rank: 'unranked',
      elo: undefined,
    },
    {
      username: 'Fer',
      rank: 'iron',
      elo: 850,
    },
    {
      username: 'Bronze',
      rank: 'bronze',
      elo: 1050,
    },
    {
      username: 'Argent',
      rank: 'silver',
      elo: 1250,
    },
    {
      username: 'Or',
      rank: 'gold',
      elo: 1450,
    },
    {
      username: 'Émeraude',
      rank: 'emerald',
      elo: 1650,
    },
    {
      username: 'Diamant',
      rank: 'diamond',
      elo: 1850,
    },
  ];

  /**
   * Rank descriptions for documentation
   */
  rankDescriptions: Record<RankTier, { label: string; percentile: string; eloRange: string }> = {
    unranked: {
      label: 'Non Classé',
      percentile: 'N/A',
      eloRange: 'Aucune partie classée',
    },
    iron: {
      label: 'Fer',
      percentile: 'Top 80-100%',
      eloRange: '< 1000 ELO',
    },
    bronze: {
      label: 'Bronze',
      percentile: 'Top 50-80%',
      eloRange: '1000-1200 ELO',
    },
    silver: {
      label: 'Argent',
      percentile: 'Top 25-50%',
      eloRange: '1200-1400 ELO',
    },
    gold: {
      label: 'Or',
      percentile: 'Top 10-25%',
      eloRange: '1400-1600 ELO',
    },
    emerald: {
      label: 'Émeraude',
      percentile: 'Top 1-10%',
      eloRange: '1600-1800 ELO',
    },
    diamond: {
      label: 'Diamant',
      percentile: 'Top 1%',
      eloRange: '1800+ ELO',
    },
  };
}
