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

test('Should GET an array of users at /users', async ({ client, assert }) => {
  const fakeName = randomstring.generate(30);
  await User.create({
    name: fakeName
  })
  
  const response = await client.get('/users').end()
  response.assertStatus(200);
  response.assertJSONSubset([{name: fakeName}])
  
  // client.delete('/users').send({name: fakeName});
  // await axios.get('http://localhost:3333/users').then(res => {
  //   const users = res.data;
  //   // console.log(users)
  //   assert.
  //   assert.equal(users.length > 0, true);
  //   // assert.equal(users.length > 0, true)
  // })
})