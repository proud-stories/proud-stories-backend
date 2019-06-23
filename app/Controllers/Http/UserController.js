'use strict'
const User = use('App/Model/User')
const Database = use('Database')
const randomstring = require("randomstring");

class UserController {
    index({ request, response, params }) {
        const users = yield User.all();
        yield response.send(users); 
    }

    store({ request, response }) {
        const user = yield User.create(request.body)
        yield repsonse.send(user)
    }
}

module.exports = UserController
