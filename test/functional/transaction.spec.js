'use strict'

const { test, trait } = use('Test/Suite')('Transactions endpoints')
const randomstring = require('randomstring')
const Transaction = use('App/Models/Transaction')
trait('Test/ApiClient')

test('make sure 2 + 2 is 4', async ({ assert }) => {
  assert.equal(2 + 2, 4)
})

test('Should GET transactions at /users/:id/transactions', async ({ client, assert }) => {
  console.log('Write transactions test -- no content')
})
