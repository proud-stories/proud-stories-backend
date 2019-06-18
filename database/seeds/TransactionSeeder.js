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
      [{
        sender_id: 1, receiver_id: 2, amount: 10, type: 'like'
      },
      {
        sender_id: 1, receiver_id: 3, amount: 10, type: 'like'
      },
      {
        sender_id: 3, receiver_id: 1, amount: 10, type: 'like'
      },
      {
        sender_id: 2, receiver_id: 3, amount: 10, type: 'like'
      },
      {
        sender_id: 1, receiver_id: 2, amount: 10, type: 'like'
      },
      {
        sender_id: 1, receiver_id: 1, amount: 500, type: 'deposit'
      }])
  }
}

module.exports = TransactionSeeder
