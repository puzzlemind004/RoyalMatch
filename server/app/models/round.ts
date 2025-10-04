import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'
import Turn from '#models/turn'
import PlayerObjective from '#models/player_objective'

type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
type RoundStatus = 'in_progress' | 'finished'

export default class Round extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare gameId: string

  @column()
  declare roundNumber: number

  @column()
  declare dominantColor: CardSuit

  @column()
  declare weakColor: CardSuit

  @column()
  declare status: RoundStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Game)
  declare game: BelongsTo<typeof Game>

  @hasMany(() => Turn)
  declare turns: HasMany<typeof Turn>

  @hasMany(() => PlayerObjective)
  declare objectives: HasMany<typeof PlayerObjective>
}
