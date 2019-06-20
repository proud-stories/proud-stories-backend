'use strict'
const { test, trait } = use('Test/Suite')('Video')
const randomstring = require('randomstring')
const Helpers = use('Helpers')
const User = use('App/Models/User')
const Video = use('App/Models/Video')
const Comment = use('App/Models/Comment')

trait('Test/ApiClient')

test('make sure 2 + 2 is 4', async ({ assert }) => {
  assert.equal(2 + 2, 4)
})
