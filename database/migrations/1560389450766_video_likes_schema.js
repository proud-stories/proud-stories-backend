'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VideoLikesSchema extends Schema {
  up() {
    this.create('video_likes', (table) => {
      table.integer('videoId').unsigned().notNullable();
      table.integer('userId').unsigned().notNullable();
      table.foreign('videoId').references('videos.id');
      table.foreign('userId').references('users.id');
      table.timestamps();
    })
  }

  down() {
    this.drop('video_likes')
  }
}

module.exports = VideoLikesSchema
