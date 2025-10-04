import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Turn from '#models/turn'
import GamePlayer from '#models/game_player'

type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades'

export default class PlayedCard extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare turnId: string

  @column()
  declare gamePlayerId: string

  @column()
  declare cardValue: string

  @column()
  declare cardSuit: CardSuit

  @column()
  declare effectActivated: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Turn)
  declare turn: BelongsTo<typeof Turn>

  @belongsTo(() => GamePlayer)
  declare gamePlayer: BelongsTo<typeof GamePlayer>
}
