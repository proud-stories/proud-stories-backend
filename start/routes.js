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
const User = use("App/Models/User");
const Drive = use('Drive');

Route.get("/videos", async ({ response }) => {
  const videos = await Video.all();
  response.send(videos);
});

Route.get("/users", async ({ response }) => {
  const users = await User.all();
  response.send(users);
});

Route.get("videos/:id", async ({ params }) => {
  const video = await Video.find(params.id);
  return video;
});

Route.get("users/:id", async ({ params }) => {
  const user = await user.find(params.id);
  return user;
});

Route.get("users/:id/videos", async ({ params }) => {
  const user = await user.find(params.id);
  const videos = await Video.where("user_id", user.id);
  return videos;
});

Route.post("users", async ({request}) => {
  const body = request.post();

  const user = new User();
  user.name = body.name;
  user.nickname = body.nickname;
  user.picture = body.picture;
  
  await user.save()
})

Route.post('upload', async ({ request, response }) => {
  const body = request.post()

  const Database = use('Database')
  const trx = await Database.beginTransaction()

  request.multipart.file('video', {}, async (file) => {
    await Drive.disk('s3').put(file.clientName, file.stream)
  })

  await request.multipart.process()

  const video = new Video();
  video.user_id = body.user_id;
  video.title = body.title;
  video.description = body.description;
  video.url = body.url;
  
  await video.save(trx)
  trx.commit()
})