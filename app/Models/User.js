'use strict'
// import '../Middleware/queries.js'

const { videosAggByUser } = require('../Middleware/queries')
const Database = use('Database')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
    
    async allVideos (id) {
        const videos = await Database.raw(videosAgg(id))
        return videos
    }

    async myVideos (id) {
        const videos = await Database.raw(videosAggByUser(id))
        return videos
    }
}

module.exports = User
