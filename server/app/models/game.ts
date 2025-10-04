import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import GamePlayer from '#models/game_player'
import Round from '#models/round'

type GameStatus = 'waiting' | 'in_progress' | 'finished'

export default class Game extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare targetScore: number

  @column()
  declare maxPlayers: number

  @column()
  declare status: GameStatus

  @column()
  declare currentRound: number

  @column()
  declare winnerId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'winnerId' })
  declare winner: BelongsTo<typeof User>

  @hasMany(() => GamePlayer)
  declare players: HasMany<typeof GamePlayer>

  @hasMany(() => Round)
  declare rounds: HasMany<typeof Round>
}
