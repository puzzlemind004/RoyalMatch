import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Round from '#models/round'
import GamePlayer from '#models/game_player'

export default class PlayerObjective extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare roundId: string

  @column()
  declare gamePlayerId: string

  @column()
  declare objectiveType: string

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare objectiveData: Record<string, any>

  @column()
  declare isCompleted: boolean

  @column()
  declare pointsEarned: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Round)
  declare round: BelongsTo<typeof Round>

  @belongsTo(() => GamePlayer)
  declare gamePlayer: BelongsTo<typeof GamePlayer>
}
