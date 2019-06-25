'use strict'
const { test, trait } = use('Test/Suite')('Comments endpoints')
const randomstring = require('randomstring')
const Helpers = use('Helpers')
const User = use('App/Models/User')
const Video = use('App/Models/Video')
const Comment = use('App/Models/Comment')
const _ = require('lodash')

trait('Test/ApiClient')

test('Should GET comments for a video at /videos/:id/comments', async ({ client, assert }) => {
  const fakeData2 = { name: randomstring.generate(30), auth_id: randomstring.generate(30) }
  const fakeUser = await User.create(fakeData2)
  
  const fakeData = {
    user_id: fakeUser.id,
    url: randomstring.generate(10),
    title: randomstring.generate(10),
    description: randomstring.generate(10)
  }
  const fakeVideo = await Video.create(fakeData)
  
  const fakeData3 = {
    "video_id": fakeVideo.id,
    "user_id": fakeUser.id,
    "comment": "First",
  }
  
  const fakeComment = await Comment.create(fakeData3)

  const endpoint = "/videos/" + String(fakeVideo.id) + "/comments";
  const response = await client.get(endpoint).end()
  response.assertStatus(200);
  response.assertJSONSubset([{comment: "First"}])

  await fakeComment.delete()
  await fakeVideo.delete()
  await fakeUser.delete()
})

test('Should POST a comment to a video at /videos/:video_id/comments', async ({ client, assert }) => {
  const fakeData2 = { name: randomstring.generate(30), auth_id: randomstring.generate(30) }
  const fakeUser = await User.create(fakeData2)
  
  const fakeData = {
    user_id: fakeUser.id,
    url: randomstring.generate(10),
    title: randomstring.generate(10),
    description: randomstring.generate(10)
  }
  const fakeVideo = await Video.create(fakeData)

  const fakeData3 = {
    "video_id": fakeVideo.id,
    "auth_id": fakeUser.auth_id,
    "comment": "First",
  }

  const fakeData4 = {
    "video_id": fakeVideo.id,
    "user_id": fakeUser.id,
    "comment": "First",
  }

  const response = await client.post("/videos/" + String(fakeVideo.id) + "/comments").send(fakeData3).end()

  const foundComment = await Comment.findByOrFail(fakeData4)

  await foundComment.delete()
  await fakeVideo.delete()
  await fakeUser.delete()
})



