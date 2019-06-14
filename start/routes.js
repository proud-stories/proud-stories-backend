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
const Database = use('Database');
const Env = use("Env");
const secret_key = Env.get("STRIPE_SECRET_KEY")
const stripe = require('stripe')(secret_key);

Route.get("/videos", async ({response}) => {
  const videos = await Video.all();
  response.send(videos);
});


Route.get("/users", async ({response}) => {
  const users = await User.all();
  response.send(users);
});

Route.get("videos/:id/edit", async ({params}) => {
  const video = await Video.find(params.id);
  return video; 
})

Route.patch("videos/:id", async ({params, request}) => {
  const body = request.post()

  const video = await Database
  .table('videos')
  .where('id', params.id)
  .update({ title: body.title, description: body.description })

  return video; 
})

Route.delete('/videos/:id', async ({params, response}) => {
  const video = await Database
  .table('videos')
  .where('id', params.id)
  .delete()
  response.send(`Video was successfuly deleted`)
})

Route.get("users/:id", async ({params}) => {
  const user = await user.find(params.id);
  return user;
});

Route.get("users/:id/videos", async ({params}) => {
  const user = await user.find(params.id);
  const videos = await Video.where("user_id", user.id);
  return videos;
});

Route.post("users", async ({request, response}) => {
  const body = request.post();

  const user = new User();
  user.name = body.name;
  await user.save()
  response.send(user.id)
})

Route.post('upload', async ({request,response}) => {

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

Route.post('/api/doPayment/', async ({request, response}) => {
  const body = request.post();

  return stripe.charges
    .create({
      amount: body.amount, 
      currency: 'jpy',
      source: body.tokenId,
      description: 'Test payment',
    })
    .then(result => response.status(200).json(result));
});