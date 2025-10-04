import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Round from '#models/round'
import GamePlayer from '#models/game_player'
import PlayedCard from '#models/played_card'

export default class Turn extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare roundId: string

  @column()
  declare turnNumber: number

  @column()
  declare winnerPlayerId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Round)
  declare round: BelongsTo<typeof Round>

  @belongsTo(() => GamePlayer, { foreignKey: 'winnerPlayerId' })
  declare winner: BelongsTo<typeof GamePlayer>

  @hasMany(() => PlayedCard)
  declare playedCards: HasMany<typeof PlayedCard>
}
