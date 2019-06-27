'use strict'

/*
|--------------------------------------------------------------------------
| TransactionSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class TransactionSeeder {
  async run () {
    const transactions = await Database.table('transactions').insert(
      [])
  }
}

module.exports = TransactionSeeder
