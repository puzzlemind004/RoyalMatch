import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

/**
 * Player connection states
 */
export enum PlayerStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  IN_GAME = 'in_game',
}

/**
 * PlayerConnection model
 * Tracks player connection state and session information
 */
export default class PlayerConnection extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare status: PlayerStatus

  @column()
  declare gameId: string | null

  @column()
  declare sessionId: string

  @column.dateTime()
  declare lastHeartbeat: DateTime

  @column.dateTime()
  declare connectedAt: DateTime

  @column.dateTime()
  declare disconnectedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}