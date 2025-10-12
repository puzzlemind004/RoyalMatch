import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_players'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('hand').nullable().comment('Current hand of cards (array of Card objects)')
      table.jsonb('deck').nullable().comment('Personal deck of cards (array of Card objects)')
      table.jsonb('stats').nullable().comment('Player statistics for the game (PlayerStats object)')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('hand')
      table.dropColumn('deck')
      table.dropColumn('stats')
    })
  }
}
