import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'played_cards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('turn_id').notNullable().references('id').inTable('turns').onDelete('CASCADE')
      table
        .uuid('game_player_id')
        .notNullable()
        .references('id')
        .inTable('game_players')
        .onDelete('CASCADE')
      table.string('card_value').notNullable()
      table.enum('card_suit', ['hearts', 'diamonds', 'clubs', 'spades']).notNullable()
      table.boolean('effect_activated').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()

      table.index(['turn_id'])
      table.index(['game_player_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
