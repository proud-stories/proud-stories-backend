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
const randomstring = require('randomstring')

Route.get("/videos", async ({
  request,
  response
}) => {
  const body = request.post();
  3
  const videos = await Database
    // .raw(`SELECT videos.id, videos.user_id, videos.url, videos.title, videos.description, videos.created_at, COUNT(videos.id) FROM videos LEFT JOIN video_likes ON videos.id = video_likes."videoId" GROUP BY videos.id`)
    // .raw(`SELECT a.id, count(b."videoId"), (SELECT count("videoId") FROM video_likes WHERE video_likes."videoId" = 2) from videos a, video_likes b, users c WHERE c.id = b."userId" AND b."videoId" = a.id AND c.id = 1 GROUP BY 1`)
    // .raw(`SELECT c.id, a.id, count(b."videoId"), (SELECT count(d."videoId") FROM video_likes d WHERE d."videoId" = b."videoId") from videos a, video_likes b, users c
    // WHERE c.id = b."userId" AND b."videoId" = a.id AND c.id = 1 GROUP BY c.id, a.id, b."videoId"`)
    .raw(`SELECT videos.id, videos.user_id, videos.url, videos.title, videos.description, videos.created_at, COUNT(videos.id) FROM videos LEFT JOIN video_likes ON videos.id = video_likes."videoId" GROUP BY videos.id`)
  for (let i of videos.rows) {
    i.didLike = await Database.count('userId').table('video_likes').where('userId', i.user_id).where('videoId', i.id);
    i.didLike = i.didLike[0].count > 0 ? true : false;
  }
  response.send(videos.rows);
});

Route.post("/videos/filters", async ({
  request,
  response
}) => {
  const body = request.post()
  const videos = await Database
    .raw(`SELECT videos.id, videos.user_id, videos.url, videos.title, videos.description, videos.created_at, COUNT(videos.id) FROM videos LEFT JOIN video_likes ON videos.id = video_likes."videoId" GROUP BY videos.id`)
  for (let i of videos.rows) {
    i.didLike = await Database.count('userId').table('video_likes').where('userId', i.user_id).where('videoId', i.id);
    i.didLike = i.didLike[0].count > 0 ? true : false;
    i.categories = await Database.select('*').table('video_categories').where('videoid', i.id);
  }

  videos.rows = videos.rows.filter((item) => {
    for (let i of body.categories) {
      for (let cat of item.categories) {
        if (cat.catid === i.id)
          return true;
      }
    }
    return false;
  })
  response.send(videos.rows);
});


Route.get("/users", async ({
  response
}) => {
  const users = await User.all();
  response.send(users);
});

Route.get("videos/:id/edit", async ({
  params
}) => {
  const video = await Video.find(params.id);
  return video;
})

Route.patch("videos/:id", async ({
  params,
  request,
  response
}) => {
  const body = request.post()

  const video = await Database
    .table('videos')
    .where('id', params.id)
    .update({
      title: body.title,
      description: body.description
    }).then(() => {
      response.status(200).json({
        status: 200
      })
    }).catch((error) => {
      response.status(500).json({
        status: 500,
        error: "An error has occoured"
      })
    })
})

Route.delete('/videos/:id', async ({
  params,
  response
}) => {
  const video = await Database
    .raw('delete from videos CASCADE where id = ?', params.id)
    .then(() => {
      response.status(200).json({
        status: 200
      })
    }).catch((error) => {
      response.status(500).json({
        status: 500,
        error: "An error has occoured"
      })
    })
})


Route.get("users/:id", async ({
  params
}) => {
  const user = await User.find(params.id);
  return user;
});

Route.get("users/:id/videos", async ({
  params
}) => {
  let videos = await Database.raw(`SELECT videos.id, videos.user_id, videos.url, videos.title, videos.description, videos.created_at, COUNT(videos.id) FROM videos LEFT JOIN video_likes ON videos.id = video_likes."videoId" WHERE videos.user_id = ? GROUP BY videos.id ORDER BY videos.id DESC`, params.id)
  for (let i of videos.rows) {
    i.didLike = await Database.count('userId').table('video_likes').where('userId', i.user_id).where('videoId', i.id);
    i.didLike = i.didLike[0].count > 0 ? true : false;
  }
  return videos.rows;
});

Route.post("users", async ({
  request,
  response
}) => {
  const body = request.post();

  const user = new User();
  user.name = body.name;
  await user.save()
  response.send(user.id)
})

Route.post('upload', async ({
  request,
  response
}) => {
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

  const categories = [
    ...JSON.parse(video['$attributes'].categories)
  ]
  delete video['$attributes'].categories;
  const videoId = await Database
    .table('videos')
    .insert({
      ...video['$attributes'],
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
    .returning('id').catch(() => {
      response.status(500).json({
        status: 500,
        error: "An error occoured saving the video"
      });
      return;
    })

  categories.forEach((category) => {
    Database.insert({
        videoid: videoId[0],
        catid: category.id,
        created_at: Database.fn.now(),
        updated_at: Database.fn.now()
      })
      .into('video_categories')
      .then(() => {
        response.status(200).json({
          status: 200
        });
        return;
      })
      .catch(() => {
        response.status(500).json({
          status: 500,
          error: "An error has occoured trying to save the tags."
        });
        return;
      })
  })

})


Route.post('videos/likes', async ({
  request,
  response
}) => {
  const body = request.post()

  const userId = await Database
    .raw(`SELECT users.id, COUNT(users.id) FROM users LEFT JOIN video_likes ON users.id = video_likes."userId" WHERE "userId" = ? AND video_likes.created_at::TIMESTAMP::DATE = current_date GROUP BY users.id`, body.userId);

  if (userId.rows.length > 0) {
    response.status(500).json({
      status: 500,
      error: "You reached your daily like limit"
    });
    return;
  }


  Database
    .table('video_likes')
    .insert({
      videoId: body.videoId,
      userId: body.userId,
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    }).then(() => {
      response.status(200).json({
        status: 200
      })
    }).catch((error) => {
      response.status(500).json({
        status: 500,
        error
      });
    })
})

Route.post('/api/doPayment/', async ({
  request,
  response
}) => {
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

Route.get("categories", async ({
  params,
  response
}) => {
  let categories = await Database
    .select('*')
    .table('categories').then((categories) => {
      response.status(200).json({
        status: 200,
        categories
      });
    }).catch((error) => {
      response.status(500).json({
        status: 500,
        error
      });
    })

});
