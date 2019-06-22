'use strict'
const User = use('App/Models/User')

class UserController {
    async index({ request, response }) {
        const users = await User.all();
        response.status(200).send(users)
        // response.body = 'hello'
        // return response
    }

    store({ request, response }) {
        const user = User.create(request.body)
        reponse.send(user)
    }
}

module.exports = UserController
