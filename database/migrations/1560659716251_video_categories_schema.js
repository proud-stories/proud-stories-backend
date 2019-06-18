"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class VideoCategoriesSchema extends Schema {
  up() {
    this.create("video_categories", (table) => {
      table
        .integer("video_id")
        .unsigned()
        .notNullable();
      table
        .integer("cat_id")
        .unsigned()
        .notNullable();
      table
        .foreign("video_id")
        .references("videos.id")
        .onDelete();
      table
        .foreign("cat_id")
        .references("categories.id")
        .onDelete();
      table.timestamps();
    });
  }

  down() {
    this.drop("video_categories");
  }
}

module.exports = VideoCategoriesSchema;
