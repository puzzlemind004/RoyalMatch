import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'turns'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('round_id').notNullable().references('id').inTable('rounds').onDelete('CASCADE')
      table.integer('turn_number').notNullable()
      table
        .uuid('winner_player_id')
        .nullable()
        .references('id')
        .inTable('game_players')
        .onDelete('SET NULL')

      table.timestamp('created_at').notNullable()

      table.index(['round_id'])
      table.unique(['round_id', 'turn_number'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
