'use strict'
const User = use('App/Models/User')

class UserController {
    async index({ response }) {
        const users = await User.all();
        response.status(200).send(users)
    }

    async find({ response, params }) {
        const user = await User.findBy('auth_id', params.id);
        response.status(200).send(user)
    }

    async store({ response }) {
        const user = await User.create(request.body)
        response.status(200).send(user)
    }

    async my_videos({ response, params }) {
        const user = await User.findBy('auth_id', params.id)
        const videos = user.myVideos(user.id)
        response.status(200).send(videos)
    }
}

module.exports = UserController
