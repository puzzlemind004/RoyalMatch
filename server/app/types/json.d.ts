/**
 * Type declarations for JSON imports
 */

declare module '#data/card_effects.json' {
  import type { CardEffect } from '#types/card'

  const value: Record<string, Record<string, CardEffect>>
  export default value
}
