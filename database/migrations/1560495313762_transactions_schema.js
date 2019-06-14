'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionsSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()
      table.timestamps()
      table.integer('sender_id').unsigned().notNullable();
      table.integer('receiver_id').unsigned().notNullable();
      table.integer('amount').unsigned().notNullable();
      table.string('token_id');
      table.string('type');
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionsSchema
