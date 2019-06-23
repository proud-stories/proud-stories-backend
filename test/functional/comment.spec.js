'use strict'
const { test, trait } = use('Test/Suite')('Comments endpoints')
const randomstring = require('randomstring')
const Helpers = use('Helpers')
const User = use('App/Models/User')
const Video = use('App/Models/Video')
const Comment = use('App/Models/Comment')

trait('Test/ApiClient')

test('Should GET comments for a video at /videos/:id/comments', async ({ client, assert }) => {
  //make a fake video object in db
  const fakeData = {
    user_id: 1,
    url: randomstring.generate(10),
    title: randomstring.generate(10),
    description: randomstring.generate(10)
  }
  const fakeVideo = await Video.create(fakeData)
    //remove fake video
    await fakeVideo.delete()
})
