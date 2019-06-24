'use strict'
const _ = require('lodash')
const Video = use('App/Models/Video')

class VideoController {
    async index({ response }) {
        const videos = await Video.all()
        response.status(200).send(videos)
    }

    async select({ response, params }) {
        const video = await Video.find(params.id);
        const videoResponse = {url: video.url, title: video.title, description: video.description}
        response.status(200).send(videoResponse)
    }
}

module.exports = VideoController
