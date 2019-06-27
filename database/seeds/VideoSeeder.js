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
      title: "Uganda Pineapples",
      description: "We are making delicious pineapple wine!",
      url: "htts://proud-videos.s3-ap-northeast-1.amazonaws.com/pineapples.mp4",
      user_id: 4,
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      url: 'https://proud-videos.s3-ap-northeast-1.amazonaws.com/ug.mp4',
      title: 'My best friend',
      description: 'How I helped my best friend',
      user_id: 1,
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      title: "Youth Leader",
      description: "Being Youth Leader in my school",
      url: "https://proud-videos.s3-ap-northeast-1.amazonaws.com/phil1.mp4",
      user_id: 6,
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      title: "Tom Waits",
      description: "Making Georgia cleaner two bottles at a time",
      url: "https://proud-videos.s3-ap-northeast-1.amazonaws.com/grg.mp4",
      user_id: 5,
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    },
    {
      title: "Big Hero",
      description: "Promoting young Philippines artists",
      url: "https://proud-videos.s3-ap-northeast-1.amazonaws.com/phil2.mp4",
      user_id: 3,
      "created_at": Database.fn.now(),
      "updated_at": Database.fn.now()
    }])
  }
}

module.exports = VideoSeeder
