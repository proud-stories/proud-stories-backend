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
const Transaction = use("App/Models/Transaction");
const Drive = use("Drive");
const Database = use("Database");
const Env = use("Env");
const stripe_secret_key = Env.get("STRIPE_SECRET_KEY");
const stripe = require("stripe")(stripe_secret_key);
const randomstring = require("randomstring");

//Organization of endpoints in this file:
//Users, Videos, Likes, Transactions, Stripe

//GET all users
Route.get("/users", async ({ response }) => {
  const users = await User.all();
  response.send(users);
});
//GET user by ID
Route.get("users/:id", async ({ params }) => {
  const user = await User.find(params.id);
  return user;
});
//POST user
Route.post("users", async ({ request, response }) => {
  const body = request.post();
  const user = new User();
  user.name = body.name;
  await user.save();
  response.send(user);
});
//GET all videos from videos database
Route.get("/videos", async ({ request, response }) => {
  const body = request.post();
  const videos = await Database.table("videos");
  response.send(videos);
});
//GET all videos filtered by category
Route.post("/videos/filters", async ({ request, response }) => {
  const body = request.post();
  const videos = await Database.raw(
    `SELECT videos.id, videos.user_id, videos.url, videos.title, videos.description, videos.created_at, COUNT(videos.id) FROM videos LEFT JOIN video_likes ON videos.id = video_likes.video_id GROUP BY videos.id`
  );
  for (let i of videos.rows) {
    i.didLike = await Database.count("user_id")
      .table("video_likes")
      .where("user_id", i.user_id)
      .where("video_id", i.id);
    i.didLike = i.didLike[0].count > 0 ? true : false;
    i.categories = await Database.select("*")
      .table("video_categories")
      .where("video_id", i.id);
  }

  videos.rows = videos.rows.filter((item) => {
    for (let i of body.categories) {
      for (let cat of item.categories) {
        if (cat.cat_id === i.id) return true;
      }
    }
    return false;
  });
  response.send(videos.rows);
});
//GET video by VIDEO ID
Route.get("videos/:id", async ({ params }) => {
  const video = await Video.find(params.id);
  return video;
});

//GET videos by USER ID
Route.get("users/:id/videos", async ({ params }) => {
  let videos = await Database.raw(
    `SELECT videos.id, videos.user_id, videos.url, videos.title, videos.description, videos.created_at, COUNT(videos.id) FROM videos LEFT JOIN video_likes ON videos.id = video_likes.video_id WHERE videos.user_id = ? GROUP BY videos.id ORDER BY videos.id DESC`,
    params.id
  );
  for (let i of videos.rows) {
    i.didLike = await Database.count("user_id")
      .table("video_likes")
      .where("user_id", i.user_id)
      .where("video_id", i.id);
    i.didLike = i.didLike[0].count > 0 ? true : false;
  }
  return videos.rows;
});
//PATCH video by ID
Route.patch("videos/:id", async ({ params, request, response }) => {
  const body = request.post();
  const video = await Database.table("videos")
    .where("id", params.id)
    .update({ title: body.title, description: body.description })
    .then((video) => {
      response.status(200).json({
        status: 200
      });
    })
    .catch((error) => {
      response.status(500).json({
        status: 500,
        error: "An error has occurred"
      });
    });
});
//DELETE video by ID
Route.delete("/videos/:id", async ({ params, response }) => {
  const video = await Database.raw(
    "delete from videos CASCADE where id = ?",
    params.id
  )
    .then(() => {
      response.status(200).json({
        status: 200
      });
    })
    .catch((error) => {
      response.status(500).json({
        status: 500,
        error: "An error has occurred"
      });
    });
});
//POST video and save to S3
Route.post("videos", async ({ request, response }) => {
  const video = new Video();

  //store video on S3
  request.multipart.field((name, value) => {
    video[name] = value;
  });
  request.multipart.file("video", {}, async (file) => {
    const newFile = randomstring.generate() + ".mp4";
    await Drive.disk("s3").put(newFile, file.stream);
    video.url = Drive.disk("s3").getUrl(newFile);
  });
  await request.multipart.process();

  const categories = [...JSON.parse(video["$attributes"].categories)];
  delete video["$attributes"].categories;
  const videoId = await Database.table("videos")
    .insert({
      ...video["$attributes"],
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
    .returning("id")
    .catch(() => {
      response.status(500).json({
        status: 500,
        error: "An error occurred saving the video"
      });
      return;
    });

  categories.forEach((category) => {
    Database.insert({
      video_id: videoId[0],
      cat_id: category.id,
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
      .into("video_categories")
      .then(() => {
        response.status(200).json({
          status: 200
        });
        return;
      })
      .catch(() => {
        response.status(500).json({
          status: 500,
          error: "An error has occurred trying to save the tags."
        });
        return;
      });
  });
});
//GET videos with AGGREGATES total likes and USER likes
Route.get("/users/:user_id/videofeed", async ({ params }) => {
  const userId = params.user_id;
  const videos = await Database.raw(`SELECT
              all_videos.id AS video_id,
              all_videos.title,
              all_videos.description,
              all_videos.total_likes,
              CASE WHEN user_likes.user_likes is NULL THEN 0 ELSE 1 END AS user_likes,
              all_videos.url
          FROM
              (
                  SELECT
                      videos.id,
                      videos.title,
                      videos.description,
                      videos.url,
                      COUNT(videos.id) AS total_likes
                  FROM
                      videos JOIN video_likes ON videos.id = video_likes.video_id
                  GROUP BY
                      videos.id
              ) AS all_videos
              LEFT JOIN
              (
                  SELECT
                      videos.id,
                      videos.title,
                      COUNT(videos.id) AS user_likes
                  FROM
                      videos JOIN video_likes ON videos.id = video_likes.video_id
                  WHERE
                      video_likes.user_id = ${userId}
                  GROUP BY
                      videos.id
              ) AS user_likes
              ON all_videos.id = user_likes.id
              ORDER BY all_videos.id
          ;`);
  return videos.rows;
});
//GET all likes
Route.get("videos/likes", async ({ request, response }) => {
  const likes = await Database.table("video_likes");
  response.send(likes.rows);
});
//POST likes, only one per day allowed
Route.post("videos/likes", async ({ request, response }) => {
  const body = request.post();
  const likes = await Database.raw(
    `SELECT users.id, COUNT(users.id) FROM users LEFT JOIN video_likes ON users.id = video_likes.user_id WHERE user_id = ? AND video_likes.created_at::TIMESTAMP::DATE = current_date GROUP BY users.id`,
    body.user_id
  );
  //check one per day
  if (likes.rows.length > 0) {
    response.status(500).json({
      status: 500,
      error: "You reached your daily like limit"
    });
    return;
  }
  Database.table("video_likes")
    .insert({
      video_id: body.video_id,
      user_id: body.user_id,
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
    .then(() => {
      response.status(200).json({
        status: 200
      });
    })
    .catch((error) => {
      response.status(500).json({
        status: 500,
        error
      });
    });
});
//GET all transactions
Route.get("transactions", async ({ params }) => {
  const transactions = await Database.table("transactions");
  return transactions;
});
//GET transactions by USER
Route.get("users/:user_id/transactions", async ({ params }) => {
  const userId = params.user_id;
  const transactions = await Database.table("transactions")
    .where("receiver_id", userId)
    .orWhere("sender_id", userId);
  return { user_id: userId, transactions };
});
//POST transactions
Route.post("transactions", async ({ request, response }) => {
  const body = request.post();
  const transaction = new Transaction();
  transaction.sender_id = body.sender_id;
  transaction.receiver_id = body.receiver_id;
  transaction.amount = body.amount;
  transaction.type = body.type;
  await transaction.save();
  response.send(transaction);
});
//GET balance by USER
Route.get("users/:user_id/balance", async ({ params }) => {
  const userId = params.user_id;
  const transactions = await Database.table("transactions")
    .where("receiver_id", userId)
    .orWhere("sender_id", userId);

  let balance = 0;
  transactions.forEach((item) => {
    if (item.type === "like" && item.sender_id === userId) {
      balance -= item.amount;
    } else if (item.type === "deposit" || item.receiver_id === userId) {
      balance += item.amount;
    }
  });
  return { balance, user_id: userId };
});
//Payment endpoint for stripe
Route.post("/api/doPayment/", async ({ request, response }) => {
  const body = request.post();

  return stripe.charges
    .create({
      amount: body.amount,
      currency: "jpy",
      source: body.tokenId,
      description: "Test payment"
    })
    .then((result) => response.status(200).json(result));
});

Route.get("categories", async ({ params, response }) => {
  let categories = await Database.select("*")
    .table("categories")
    .then((categories) => {
      response.status(200).json({
        status: 200,
        categories
      });
    })
    .catch((error) => {
      response.status(500).json({
        status: 500,
        error
      });
    });
});
