"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class VideosSchema extends Schema {
  up() {
    this.create("videos", (table) => {
      table.increments();
      table
        .integer("user_id")
        .notNullable()
        .unique();
      table.string("url", 150);
      table.string("title", 150);
      table.string("description", 300);
      table.timestamps();
    });
  }

  down() {
    this.drop("videos");
  }
}

module.exports = VideosSchema;
