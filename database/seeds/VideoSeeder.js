'use strict'

/*
|--------------------------------------------------------------------------
| VideoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class VideoSeeder {
  async run () {
    const videos = await Database.table('videos').insert([{
      url: 'https://proud-videos.s3-ap-northeast-1.amazonaws.com/video.mp4',
      title: 'Uganda Pineapples',
      description: 'Uganda pineapples are very special.',
      user_id: 1,
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      title: "Tom Waits",
      description: "Tom Waits sings a beautiful song.",
      url: "https://proud-videos.s3-ap-northeast-1.amazonaws.com/waits.mp4",
      user_id: 2,
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    }])
  }
}

module.exports = VideoSeeder
