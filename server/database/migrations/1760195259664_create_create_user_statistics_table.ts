import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_statistics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable().unique().references('id').inTable('users').onDelete('CASCADE')

      // Parties jouées
      table.integer('games_played').notNullable().defaultTo(0)
      table.integer('games_won').notNullable().defaultTo(0)
      table.integer('games_lost').notNullable().defaultTo(0)

      // Taux de victoire (calculé)
      table.decimal('win_rate', 5, 2).notNullable().defaultTo(0.00) // ex: 45.67%

      // Objectifs complétés
      table.integer('objectives_completed').notNullable().defaultTo(0)
      table.integer('objectives_total').notNullable().defaultTo(0)

      // Effets activés
      table.integer('effects_activated').notNullable().defaultTo(0)

      // Plis gagnés
      table.integer('tricks_won_total').notNullable().defaultTo(0)
      table.decimal('tricks_won_average', 5, 2).notNullable().defaultTo(0.00)

      // Scores
      table.integer('best_score').notNullable().defaultTo(0)
      table.integer('total_points').notNullable().defaultTo(0)
      table.decimal('average_score', 8, 2).notNullable().defaultTo(0.00)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}