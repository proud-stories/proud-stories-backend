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

    async video_feed({ response, params }) {
        const user = await User.findBy('auth_id', params.id)
        const videos = await user.allVideos(user.id)
        response.status(200).send(videos.rows)
    }

    async my_videos({ response, params }) {
        const user = await User.findBy('auth_id', params.id)
        const videos = await user.myVideos(user.id)
        response.status(200).send(videos)
    }
}

module.exports = UserController
