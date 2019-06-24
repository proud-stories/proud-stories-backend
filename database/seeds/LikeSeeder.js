'use strict'

/*
|--------------------------------------------------------------------------
| LikeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class LikeSeeder {
  async run () {
    const likes = await Database.table('video_likes').insert(
      [{
        video_id:1,
        user_id:2,
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        video_id:2,
        user_id:2,
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        video_id: 1,
        user_id: 3,
        "created_at": Database.fn.now(),
        "updated_at": Database.fn.now()
      },
      {
        video_id: 1,
        user_id: 1
      }]
    )
  }
}

module.exports = LikeSeeder
