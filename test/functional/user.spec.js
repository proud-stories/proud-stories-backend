'use strict'
const { test, trait } = use('Test/Suite')('User')
const randomstring = require('randomstring')
const Helpers = use('Helpers')
const User = use('App/Models/User')
const Video = use('App/Models/Video')


trait('Test/ApiClient')

test('Should GET users at /users', async ({ client, assert }) => {
  //insert a fake user using Adonis
  const fakeData = {name: randomstring.generate(30)}
  const fakeUser = await User.create(fakeData)
  
  //make GET request, assert the fake user is present
  const response = await client.get('/users').end()
  response.assertStatus(200);
  response.assertJSONSubset([fakeData])

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
    const fakeData = {name: randomstring.generate(30)}
    const fakeUser = await User.create(fakeData)

    //make GET request, assert the fake user is present
    const endpoint = '/users/' + String(fakeUser.id);
    const response = await client.get(endpoint).end()
    response.assertStatus(200);
    response.assertJSONSubset(fakeData)

    //remove fake user using Adonis
    await fakeUser.delete()  
})


test('Should GET all a users videos at users/:id/videos ', async ({ client }) => {
  //insert a fake user using Adonis
  const fakeData = {name: randomstring.generate(30)}
  const fakeUser = await User.create(fakeData)
  
  //make GET request, assert the fake user is present
  const response = await client.get('/users').end()
  response.assertStatus(200);
  response.assertJSONSubset([fakeData])

  //remove fake user using Adonis
  await fakeUser.delete()
})


test('Should GET all videos at /videos (no aggregates)', async ({ client, assert }) => {
    //make GET request for a fakeUser
    const fakeData = {
      user_id: 1,
      url: randomstring.generate(10),
      title: randomstring.generate(10),
      description: randomstring.generate(10)
    }
    const fakeVideo = await Video.create(fakeData)
  
  //make GET request, assert the fake user is present
  const response = await client.get('/videos').end()
  response.assertStatus(200);
  response.assertJSONSubset([fakeData])

  //remove fake user using Adonis
  await fakeVideo.delete()
})

// test('Should POST a new video at /videos ', async ({ client }) => {
//     console.log("Hello!")
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