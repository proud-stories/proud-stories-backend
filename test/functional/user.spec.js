'use strict'
const { test, trait } = use('Test/Suite')('Users endpoints')
const randomstring = require('randomstring')
const User = use('App/Models/User')



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

test('Should GET all a users videos at /users/:id/videos ', async ({ client }) => {
  //insert a fake user using Adonis
  const fakeData = {name: randomstring.generate(30)}
  const fakeUser = await User.create(fakeData)
  
  //make GET request, assert the fake user is present
  const response = await client.get('/users').end()
  // response.assertStatus(200);
  // response.assertJSONSubset([fakeData])

  //remove fake user using Adonis
  await fakeUser.delete()
})