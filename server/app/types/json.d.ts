/**
 * Type declarations for JSON imports
 */

declare module '#data/card_effects.json' {
  import type { CardEffect } from '#types/card'

  const value: Record<string, Record<string, CardEffect>>
  export default value
}

declare module '#data/effects.json' {
  import type { EffectDefinition } from '#types/effect'

  const value: {
    effects: EffectDefinition[]
  }
  export default value
}
