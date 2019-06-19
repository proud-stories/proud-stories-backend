'use strict'

/*
|--------------------------------------------------------------------------
| CommentSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class CommentSeeder {
  async run () {
    const comments = await Database.table('comments').insert(
      [{
        "video_id":1,
        "user_id": 1,
        "comment": "Absolutely love this!",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "video_id":2,
        "user_id": 3,
        "comment": "Ew",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "video_id":2,
        "user_id": 2,
        "comment": "Get a hair cut",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "video_id":1,
        "user_id": 2,
        "comment": "Just why",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "video_id":2,
        "user_id": 1,
        "comment": "Seriously? Who uses constructors in 2019?",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "video_id":1,
        "user_id": 3,
        "comment": "Niiiiiiiice.",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      }]
    )
  }
}

module.exports = CommentSeeder
