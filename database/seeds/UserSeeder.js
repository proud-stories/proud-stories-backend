'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class UserSeeder {
  async run () {
    const users = await Database.table('users')
    .insert([
      { name: "Ben", auth_id: 'ben_secret_id' },
      { name: "Ania", auth_id: 'ania_secret_id' },
      { name: "Konst", auth_id: 'konst_secret_id'}
    ])
  }
}

module.exports = UserSeeder
