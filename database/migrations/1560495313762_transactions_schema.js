'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionsSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id_sender').unsigned().notNullable();
      table.integer('user_id_receiver').unsigned().notNullable();
      table.integer('amount').unsigned().notNullable();
      table.string('token_id');
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionsSchema
