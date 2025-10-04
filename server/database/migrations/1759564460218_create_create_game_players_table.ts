import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_players'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE')
      table.uuid('user_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.boolean('is_ai').notNullable().defaultTo(false)
      table.integer('player_order').notNullable()
      table.integer('total_score').notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()

      table.index(['game_id'])
      table.index(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
