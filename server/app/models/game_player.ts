import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'
import User from '#models/user'
import PlayerObjective from '#models/player_objective'
import PlayedCard from '#models/played_card'
import type { Card } from '#types/card'
import type { PlayerStats, PlayerDisplayInfo } from '#types/player'
import { DEFAULT_PLAYER_STATS } from '#types/player'

export default class GamePlayer extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare gameId: string

  @column()
  declare userId: string | null

  @column()
  declare isAi: boolean

  @column()
  declare playerOrder: number

  @column()
  declare totalScore: number

  @column({
    prepare: (value: Card[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : []),
  })
  declare hand: Card[]

  @column({
    prepare: (value: Card[] | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : []),
  })
  declare deck: Card[]

  @column({
    prepare: (value: PlayerStats | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : DEFAULT_PLAYER_STATS),
  })
  declare stats: PlayerStats

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Game)
  declare game: BelongsTo<typeof Game>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => PlayerObjective)
  declare objectives: HasMany<typeof PlayerObjective>

  @hasMany(() => PlayedCard)
  declare playedCards: HasMany<typeof PlayedCard>

  /**
   * Get the player's current hand
   */
  getHand(): Card[] {
    return this.hand || []
  }

  /**
   * Add a card to the player's hand
   */
  addCardToHand(card: Card): void {
    if (!this.hand) {
      this.hand = []
    }
    this.hand.push(card)
  }

  /**
   * Remove a card from the player's hand
   * @returns The removed card or undefined if not found
   */
  removeCardFromHand(cardId: string): Card | undefined {
    if (!this.hand) {
      return undefined
    }

    const index = this.hand.findIndex((c) => c.id === cardId)
    if (index === -1) {
      return undefined
    }

    const [removedCard] = this.hand.splice(index, 1)
    return removedCard
  }

  /**
   * Check if player has a specific card in hand
   */
  hasCardInHand(cardId: string): boolean {
    return this.hand?.some((c) => c.id === cardId) ?? false
  }

  /**
   * Get the player's deck
   */
  getDeck(): Card[] {
    return this.deck || []
  }

  /**
   * Draw a card from the deck to the hand
   * @returns The drawn card or undefined if deck is empty
   */
  drawCard(): Card | undefined {
    if (!this.deck || this.deck.length === 0) {
      return undefined
    }

    const drawnCard = this.deck.shift()
    if (drawnCard) {
      this.addCardToHand(drawnCard)
    }
    return drawnCard
  }

  /**
   * Initialize the player's deck
   */
  initializeDeck(cards: Card[]): void {
    this.deck = [...cards]
  }

  /**
   * Shuffle the player's deck
   */
  shuffleDeck(): void {
    if (!this.deck) {
      return
    }

    // Fisher-Yates shuffle algorithm
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]]
    }
  }

  /**
   * Get player statistics
   */
  getStats(): PlayerStats {
    return this.stats || DEFAULT_PLAYER_STATS
  }

  /**
   * Initialize player statistics
   */
  initializeStats(): void {
    this.stats = { ...DEFAULT_PLAYER_STATS }
  }

  /**
   * Update a specific stat
   */
  updateStat(statKey: keyof PlayerStats, value: number): void {
    if (!this.stats) {
      this.initializeStats()
    }
    this.stats[statKey] = value
  }

  /**
   * Increment a specific stat
   */
  incrementStat(statKey: keyof PlayerStats, increment: number = 1): void {
    if (!this.stats) {
      this.initializeStats()
    }
    this.stats[statKey] = (this.stats[statKey] || 0) + increment
  }

  /**
   * Check if player has completed a specific objective
   * Note: Requires objectives to be preloaded
   */
  hasCompletedObjective(objectiveType: string): boolean {
    return this.objectives?.some((obj) => obj.objectiveType === objectiveType && obj.isCompleted) ?? false
  }

  /**
   * Get number of completed objectives
   * Note: Requires objectives to be preloaded
   */
  getCompletedObjectivesCount(): number {
    return this.objectives?.filter((obj) => obj.isCompleted).length ?? 0
  }

  /**
   * Get display information for the player
   * Returns structured data for UI rendering (supports i18n)
   * Note: For human players, requires user relation to be preloaded.
   * Note: rank and elo will be null until the ranking system is implemented
   */
  getDisplayInfo(): PlayerDisplayInfo {
    if (this.isAi) {
      return {
        type: 'ai',
        name: this.user?.username || 'AI', // AI name (will be customizable later)
        order: this.playerOrder,
        rank: null, // AIs don't have ranks
        elo: null, // AIs don't have ELO
      }
    }

    return {
      type: 'user',
      name: this.user?.username || '', // Empty string if not loaded
      order: this.playerOrder,
      rank: null, // TODO: Will be populated when User model has rank column
      elo: null, // TODO: Will be populated when User model has elo column
    }
  }
}
