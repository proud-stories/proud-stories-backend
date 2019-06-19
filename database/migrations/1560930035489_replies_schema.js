'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RepliesSchema extends Schema {
  up () {
    this.create('replies', (table) => {
      table.increments()
      table.integer('comment_id')
      table.integer('user_id')
      table.string('reply')
      table.timestamps()
    })
  }

  down () {
    this.drop('replies')
  }
}

module.exports = RepliesSchema
