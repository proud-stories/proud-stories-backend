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
    const comments = Database.table('comments').insert(
      [{
        "video_id":1,
        "user_id": 1,
        "comment": "Absolutely love this!"
      },
      {
        "video_id":2,
        "user_id": 3,
        "comment": "Ew"
      },
      {
        "video_id":2,
        "user_id": 2,
        "comment": "Get a hair cut"
      },
      {
        "video_id":1,
        "user_id": 2,
        "comment": "Just why"
      },
      {
        "video_id":2,
        "user_id": 1,
        "comment": "Watching this in 2019"
      },
      {
        "video_id":1,
        "user_id": 3,
        "comment": "Niiiiiiiice."
      }]
    )
  }
}

module.exports = CommentSeeder
