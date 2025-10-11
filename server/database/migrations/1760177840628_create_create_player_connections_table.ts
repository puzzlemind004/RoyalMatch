import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'player_connections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .enum('status', ['online', 'offline', 'in_game'], {
          useNative: true,
          enumName: 'player_status',
        })
        .notNullable()
        .defaultTo('offline')
      table.uuid('game_id').nullable().references('id').inTable('games').onDelete('SET NULL')
      table.string('session_id').notNullable().unique()
      table.timestamp('last_heartbeat').notNullable()
      table.timestamp('connected_at').notNullable()
      table.timestamp('disconnected_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Indexes for better query performance
      table.index('user_id')
      table.index('status')
      table.index('session_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS player_status')
  }
}