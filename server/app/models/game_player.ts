import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Game from '#models/game'
import User from '#models/user'
import PlayerObjective from '#models/player_objective'
import PlayedCard from '#models/played_card'

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
}
