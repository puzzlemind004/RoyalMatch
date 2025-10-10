/**
 * Rank system types for RoyalMatch
 * Defines player ranking tiers based on ELO percentiles
 */

export type RankTier = 'unranked' | 'iron' | 'bronze' | 'silver' | 'gold' | 'emerald' | 'diamond';

/**
 * Rank colors for visual representation
 */
export const RANK_COLORS: Record<Exclude<RankTier, 'unranked'>, string> = {
  diamond: '#B9F2FF',   // Diamant bleuté éclatant
  emerald: '#50C878',   // Émeraude vert profond
  gold: '#FFD700',      // Or classique
  silver: '#C0C0C0',    // Argent métallique
  bronze: '#CD7F32',    // Bronze chaud
  iron: '#71717A',      // Gris fer sombre
};

/**
 * SVG icons for each rank tier
 * Progressive complexity: Square (4) → Pentagon (5) → Hexagon (6) → Star → Gem → Diamond emoji
 */
export const RANK_SVG: Record<Exclude<RankTier, 'unranked'>, string> = {
  // Iron: Simple square (4 sides)
  iron: `<svg viewBox="0 0 24 24" width="20" height="20">
    <rect x="6" y="6" width="12" height="12"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="1.5"/>
  </svg>`,

  // Bronze: Pentagon (5 sides)
  bronze: `<svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M12 3 L20 10 L17 20 L7 20 L4 10 Z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"/>
  </svg>`,

  // Silver: Hexagon (6 sides)
  silver: `<svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M12 2 L19 6 L19 14 L12 18 L5 14 L5 6 Z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="1.5"/>
  </svg>`,

  // Gold: Large star (bold and striking)
  gold: `<svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18.5 L6 22 L7 15 L2 10 L9 9 Z"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="1"
          stroke-linejoin="round"/>
  </svg>`,

  // Emerald: Multi-faceted gem (keep current design)
  emerald: `<svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M12 2 L18 8 L12 14 L6 8 Z"
          stroke="currentColor"
          stroke-width="1.5"
          fill="currentColor"
          opacity="0.7"/>
    <path d="M18 8 L12 14 L12 22 L18 16 Z"
          stroke="currentColor"
          stroke-width="1.5"
          fill="currentColor"
          opacity="0.85"/>
    <path d="M6 8 L12 14 L12 22 L6 16 Z"
          stroke="currentColor"
          stroke-width="1.5"
          fill="currentColor"
          opacity="0.85"/>
    <circle cx="12" cy="8" r="2" fill="currentColor"/>
  </svg>`,

  // Diamond: Emoji (simple and elegant)
  diamond: `💎`,
};

/**
 * Get rank display information
 * Returns null for unranked players (no icon to display)
 */
export function getRankDisplayInfo(rank: RankTier | null | undefined): {
  tier: Exclude<RankTier, 'unranked'>;
  color: string;
  svg: string;
} | null {
  if (!rank || rank === 'unranked') {
    return null;
  }

  return {
    tier: rank,
    color: RANK_COLORS[rank],
    svg: RANK_SVG[rank],
  };
}
