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
    const replies = await Database.table('replies').insert(
      [{
        "comment_id":1,
        "user_id": 2,
        "reply": "Yeah! So cool!",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "comment_id":2,
        "user_id": 1,
        "reply": "EW",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "comment_id":2,
        "user_id": 2,
        "reply": "Get a hair cut",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "comment_id":2,
        "user_id": 3,
        "reply": "smh",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "comment_id":2,
        "user_id": 1,
        "reply": "Wow",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "comment_id":1,
        "user_id": 3,
        "reply": "Niiiiiiiiiiiiiiiiiiiiiiiiiice.",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "comment_id":1,
        "user_id": 3,
        "reply": ":)",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      }]
    )
  }
}

module.exports = ReplySeeder
