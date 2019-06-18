'use strict'
const axios = require('axios');
const randomstring = require('randomstring')

//Note axios needs the http:// prefix. Fetch API is not compatible(?) says undefined.

const { test, trait } = use('Test/Suite')('User')
const User = use('App/Models/User')

trait('Test/ApiClient')

// test('make sure 2 + 2 is 4', async ({ assert }) => {
//   assert.equal(2 + 2, 4)
// })

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