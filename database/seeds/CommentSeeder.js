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
        "user_id": 3,
        "comment": "I wish I could drink that wine right now!",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "video_id":1,
        "user_id": 4,
        "comment": "I'm allergic to pineapples :/ looks delicious!",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "video_id":1,
        "user_id": 5,
        "comment": "Is it organic?",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        "video_id":2,
        "user_id": 5,
        "comment": "I'm moved :,)",
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
    ]
    )
  }
}

module.exports = CommentSeeder
