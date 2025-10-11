import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class UserStatistic extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  // Parties jouées
  @column()
  declare gamesPlayed: number

  @column()
  declare gamesWon: number

  @column()
  declare gamesLost: number

  // Taux de victoire
  @column()
  declare winRate: number

  // Objectifs
  @column()
  declare objectivesCompleted: number

  @column()
  declare objectivesTotal: number

  // Effets
  @column()
  declare effectsActivated: number

  // Plis
  @column()
  declare tricksWonTotal: number

  @column()
  declare tricksWonAverage: number

  // Scores
  @column()
  declare bestScore: number

  @column()
  declare totalPoints: number

  @column()
  declare averageScore: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}