'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VideoCategoriesSchema extends Schema {
  up() {
    this.create('video_categories', (table) => {
      table.integer('videoid').unsigned().notNullable();
      table.integer('catid').unsigned().notNullable();
      table.foreign('videoid').references('videos.id').onDelete();
      table.foreign('catid').references('categories.id').onDelete();
      table.timestamps();
    })
  }

  down() {
    this.drop('video_categories')
  }
}

module.exports = VideoCategoriesSchema
