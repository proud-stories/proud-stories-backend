'use strict'

const { test, trait } = use('Test/Suite')('Transaction')
const randomstring = require('randomstring')
const Transaction = use('App/Models/Transaction')
trait('Test/ApiClient')

test('Should GET transactions at /users/:id/transactions', async ({ client, assert }) => {
  
})
