"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const Video = use("App/Models/Video");
const Drive = use('Drive');
const randomstring = require("randomstring");

Route.get("/videos", async ({
  response
}) => {
  const videos = await Video.all();
  response.send(videos);
});

Route.get("videos/:id", async ({
  params
}) => {
  const video = await Video.find(params.id);
  return video;
});

Route.get("users/:id", async ({
  params
}) => {
  const user = await user.find(params.id);
  return user;
});

Route.get("users/:id/videos", async ({
  params
}) => {
  const user = await user.find(params.id);
  const videos = await Video.where("user_id", user.id);
  return videos;
});

Route.post('upload', async ({
  request,
  response
}) => {
  const body = request.post()

  const video = new Video();
  request.multipart.field((name, value) => {
    video[name] = value;
  })

  request.multipart.file('video', {}, async (file) => {
    const newFile = randomstring.generate() + ".mp4";
    await Drive.disk('s3').put(newFile, file.stream);
    video.url = Drive.disk('s3').getUrl(newFile);
  })
  await request.multipart.process()

  const Database = use('Database')
  const trx = await Database.beginTransaction()

  await video.save(trx)
  trx.commit();
})
