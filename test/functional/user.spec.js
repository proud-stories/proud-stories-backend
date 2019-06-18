'use strict'
const { test, trait } = use('Test/Suite')('User')
const randomstring = require('randomstring')
const User = use('App/Models/User')

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
