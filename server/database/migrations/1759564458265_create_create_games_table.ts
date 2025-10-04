import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'games'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.integer('target_score').notNullable().defaultTo(100)
      table.integer('max_players').notNullable().defaultTo(4)
      table
        .enum('status', ['waiting', 'in_progress', 'finished'])
        .notNullable()
        .defaultTo('waiting')
      table.integer('current_round').notNullable().defaultTo(0)
      table.uuid('winner_id').nullable().references('id').inTable('users').onDelete('SET NULL')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
