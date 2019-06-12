'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VideoSchema extends Schema {
  up() {
    this.create("videos", (table) => {
      table.increments();
      table
        .integer("user_id")
        .notNullable()
        .references("users.id");
      table.string("url", 150).notNullable().unique();
      table.string("title", 150).notNullable();
      table.string("description", 300);
      table.integer("likes");
      table.timestamps();
    });
  }

  down() {
    this.drop('videos')
  }
}

module.exports = VideoSchema
