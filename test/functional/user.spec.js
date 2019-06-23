'use strict'
const { test, trait } = use('Test/Suite')('Users endpoints')
const randomstring = require('randomstring')
const User = use('App/Models/User')
const Video = use('App/Models/Video')
const _ = require('lodash')

trait('Test/ApiClient')

test('Should GET users at /users', async ({ client, assert }) => {
  //insert a fake user using Adonis
  const fakeData = { name: randomstring.generate(30), auth_id: randomstring.generate(30) }
  const fakeUser = await User.create(fakeData)
  
  //make GET request, assert the fake user is present
  const response = await client.get('/users').end()
  response.assertStatus(200);
  response.assertJSONSubset([{ name: fakeUser.name }])

  //remove fake user using Adonis
  await fakeUser.delete()
})

test('Should POST users at /users/', async ({ client }) => {
  //make POST request for a fakeUser
  const fakeData = {name: randomstring.generate(30), auth_id: randomstring.generate(30)}
  const response = await client.post('/users/').send(fakeData).end()

  //find posted User, fail if not found
  const foundUser = await User.findByOrFail(fakeData);
  // console.log(foundUser['$attributes'])

  //remove fake user using Adonis
  await foundUser.delete()  
})

test('Should GET user by id at /users/:id', async ({ client }) => {
    //insert a fake user using Adonis
    const fakeData = { name: randomstring.generate(30), auth_id: randomstring.generate(30) }
    const fakeUser = await User.create(fakeData)

    //make GET request, assert the fake user is present
    const endpoint = '/users/' + String(fakeUser.auth_id);
    const response = await client.get(endpoint).end()
    response.assertStatus(200);
    response.assertJSONSubset(fakeData)

    //remove fake user using Adonis
    await fakeUser.delete()  
})

test('Should GET all of a users videos at /users/:id/videos ', async ({ client }) => {
  //insert a fake user using Adonis
  const fakeData = {name: randomstring.generate(30), auth_id: randomstring.generate(30)}
  const fakeUser = await User.create(fakeData)
  
  //make GET request, assert the fake user is present
  const endpoint = '/users/' + String(fakeUser.auth_id) + '/videos';
  const response = await client.get(endpoint).end()
  response.assertStatus(200);
  // response.assertJSONSubset([_.pick(fakeData, 'name')])

  //remove fake user using Adonis
  await fakeUser.delete()
})

test('Should GET a users videofeed at /users/:id/feed ', async ({ client }) => {
  //insert a fake user using Adonis
  const fakeData = {name: randomstring.generate(30), auth_id: randomstring.generate(30)}
  const fakeUser = await User.create(fakeData)
  const userId = fakeUser.id

  //insert a fake video, uploaded by that user
  const fakeVideo = {url: randomstring.generate(30), title: randomstring.generate(30), description: randomstring.generate(30), user_id: userId }
  const video = await Video.create(fakeVideo)
  const videoResponse = _.pick(fakeVideo, 'url', 'title', 'description')
  //make GET request for videofeed, assert the video is there
  const endpoint = '/users/' + String(fakeUser.auth_id) + '/feed';
  const response = await client.get(endpoint).end()
  response.assertStatus(200);
  response.assertJSONSubset([videoResponse])

  //remove fake user using Adonis
  await fakeUser.delete()
})