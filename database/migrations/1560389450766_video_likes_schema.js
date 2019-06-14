'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VideoLikesSchema extends Schema {
  up() {
    this.create('video_likes', (table) => {
      table.integer('video_id').unsigned().notNullable();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('video_id').references('videos.id');
      table.foreign('user_id').references('users.id');
      table.timestamps();
    })
  }

  down() {
    this.drop('video_likes')
  }
}

module.exports = VideoLikesSchema
