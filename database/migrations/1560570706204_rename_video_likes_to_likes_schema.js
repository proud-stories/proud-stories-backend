'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RenameVideoLikesToLikesSchema extends Schema {
  up () {
    this.rename('video_likes', 'likes');
  }

  down () {
    this.rename('likes', 'video_likes');
  }
}

module.exports = RenameVideoLikesToLikesSchema
