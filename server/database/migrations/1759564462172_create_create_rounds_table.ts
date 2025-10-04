import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rounds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE')
      table.integer('round_number').notNullable()
      table.enum('dominant_color', ['hearts', 'diamonds', 'clubs', 'spades']).notNullable()
      table.enum('weak_color', ['hearts', 'diamonds', 'clubs', 'spades']).notNullable()
      table.enum('status', ['in_progress', 'finished']).notNullable().defaultTo('in_progress')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['game_id'])
      table.unique(['game_id', 'round_number'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
