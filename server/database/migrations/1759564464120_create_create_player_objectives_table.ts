import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'player_objectives'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('round_id').notNullable().references('id').inTable('rounds').onDelete('CASCADE')
      table
        .uuid('game_player_id')
        .notNullable()
        .references('id')
        .inTable('game_players')
        .onDelete('CASCADE')
      table.string('objective_type').notNullable()
      table.jsonb('objective_data').notNullable()
      table.boolean('is_completed').notNullable().defaultTo(false)
      table.integer('points_earned').notNullable().defaultTo(0)

      table.timestamp('created_at').notNullable()

      table.index(['round_id'])
      table.index(['game_player_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
