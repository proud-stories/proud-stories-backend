'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      table.string('picture')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('picture')
    })
  }
}

module.exports = UserSchema
