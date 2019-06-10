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
    const videos = await Database.table('videos').insert({
      url: 'https://proud-videos.s3-ap-northeast-1.amazonaws.com/video.mp4',
      title: 'Uganda Pineapples',
      description: 'Uganda pineapples are very special.',
      likes: 1000,
      user_id: 1
    })
  }
}

module.exports = VideoSeeder
