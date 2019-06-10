'use strict'

const { test, trait } = use('Test/Suite')('Video')
const Video = use('App/Models/Video')

trait('Test/ApiClient')

test('get list of videos which includes Uganda Pineapples', async ({ client }) => {
  const response = await client.get('/videos').end()

  response.assertStatus(200)
  response.assertJSONSubset([{
    title: 'Uganda Pineapples',
    url: "https://proud-videos.s3-ap-northeast-1.amazonaws.com/video.mp4"
  }])
})