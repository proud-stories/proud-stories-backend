'use strict'

/*
|--------------------------------------------------------------------------
| ReplySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class ReplySeeder {
  async run () {
    [{
      "comment_id":1,
      "user_id": 2,
      "comment": "Yeah! So cool!",
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      "comment_id":2,
      "user_id": 1,
      "comment": "EW",
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      "comment_id":2,
      "user_id": 2,
      "comment": "Get a hair cut",
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      "comment_id":2,
      "user_id": 3,
      "comment": "smh",
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      "comment_id":2,
      "user_id": 1,
      "comment": "Wow",
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      "comment_id":1,
      "user_id": 3,
      "comment": "Niiiiiiiiiiiiiiiiiiiiiiiiiice.",
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      "comment_id":1,
      "user_id": 3,
      "comment": ":)",
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    }]
  }
}

module.exports = ReplySeeder
