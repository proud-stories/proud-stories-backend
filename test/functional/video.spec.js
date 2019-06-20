'use strict'
const { test, trait } = use('Test/Suite')('Videos endpoints')
const randomstring = require('randomstring')
const Helpers = use('Helpers')
const User = use('App/Models/User')
const Video = use('App/Models/Video')
const _ = require('lodash')

trait('Test/ApiClient')

test('Should GET all videos at /videos (no aggregates)', async ({ client, assert }) => {
  //make a fake video object in db
  const fakeData = {
    user_id: 1,
    url: randomstring.generate(10),
    title: randomstring.generate(10),
    description: randomstring.generate(10)
  }
  const fakeVideo = await Video.create(fakeData)

  //make GET request, assert the fake video is present
  const response = await client.get('/videos').end()
  response.assertStatus(200);
  response.assertJSONSubset([fakeData])

  //remove fake video
  await fakeVideo.delete()
})

test('Should GET video by id at /videos/:id (no aggregates)', async ({ client, assert }) => {
  //make a fake video object in db
  const fakeData = {
    user_id: 1,
    url: randomstring.generate(10),
    title: randomstring.generate(10),
    description: randomstring.generate(10)
  }
  const fakeVideo = await Video.create(fakeData)
  const endpoint = '/videos/' + String(fakeVideo.id)
  //make GET request, assert the fake video is present
  const response = await client.get(endpoint).end()
  response.assertStatus(200);
  response.assertJSONSubset(fakeData)

  //remove fake video
  await fakeVideo.delete()
})

test('Should PATCH video at /videos/:id', async ({ client, assert }) => {
  //make a fake video object in db
  const fakeData = {
    user_id: 1,
    url: randomstring.generate(10),
    title: randomstring.generate(10),
    description: randomstring.generate(10)
  }
  const fakeVideo = await Video.create(fakeData)
  const endpoint = '/videos/' + String(fakeVideo.id)
  
  //make data for a patch request
  const title = randomstring.generate(10)
  const description = randomstring.generate(10)
  const patchData = { title, description }

  //test patch endpoint
  const response = await client.patch(endpoint).send(patchData).end()
  
  //assert we receive an appropriate response
  response.assertStatus(200);
  // response.assertJSONSubset(fakeData)

  //find the fake video, assert its patched
  const patchedVideo = await Video.find(fakeVideo.id)
  assert.equal(_.isMatch(fakeVideo, fakeData), true)
  assert.equal(_.isMatch(patchedVideo, fakeData), false)
  assert.equal(_.isMatch(patchedVideo, patchData), true)

  //remove fake video
  await fakeVideo.delete()
})

test('Should DELETE video at /videos/:id', async ({ client, assert }) => {
  //make a fake video object in db
  const fakeData = {
    user_id: 1,
    url: randomstring.generate(10),
    title: randomstring.generate(10),
    description: randomstring.generate(10)
  }
  const fakeVideo = await Video.create(fakeData)
  const endpoint = '/videos/' + String(fakeVideo.id)

  //test patch endpoint
  const response = await client.delete(endpoint).end()

  //assert reasonable response
  response.assertStatus(200);
  // response.assertJSONSubset(fakeData)

  //assert video has been deleted
  const deletedVideo = await Video.find(fakeVideo.id)
  assert.equal(deletedVideo, null)
})

// test('Should POST a new video at /videos ', async ({ client }) => {
//     //make POST request for a fakeVideo
//     const fakeData = {
//       user_id: 1,
//       // url: randomstring.generate(10),
//       title: randomstring.generate(10),
//       description: randomstring.generate(10)
//     }
//     // const fakeVideo = await Video.create(fakeData)
//     const response = await client
//       .post('/videos/')
//       .field('user_id', 1)
//       .field('title', fakeData.title)
//       .field('description', fakeData.description)
//       .attach('video', Helpers.resourcesPath('waits.mp4'))
//       // .send(fakeData)
//       .end()
  
//     //find posted Video, fail if not found
//     const foundVideo = await Video.findByOrFail(fakeData);
//     // console.log(foundUser['$attributes'])
  
//     //remove fake user using Adonis
//     await foundVideo.delete()  
// })