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
const Comment = use("App/Models/Comment")
const Reply = use("App/Models/Reply")
const Drive = use("Drive");
const Database = use("Database");
const Env = use("Env");
const stripe_secret_key = Env.get("STRIPE_SECRET_KEY");
const stripe = require("stripe")(stripe_secret_key);
const randomstring = require("randomstring");

//Organization of endpoints in this file:
//Users, Videos, Likes, Transactions, Stripe


Route.get('users', 'UserController.index') //GET all users
Route.get('users/:id', 'UserController.find') //GET user by ID
// Route.post('users', 'UserController.store') //POST user
Route.post("users", async ({ request, response }) => {
  const { name, auth_id, picture } = request.post()
  const user = await User.create({ name, auth_id, picture })
  response.send(user);
});
Route.get('videos', 'VideoController.index')//GET all videos
//GET all videos filtered by category
Route.post("/video_filters", async ({ request, response }) => {
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
Route.get('videos/:id', 'VideoController.select') //GET video by VIDEO ID
Route.get('users/:id/videos', 'UserController.my_videos') //GET all videos uploaded by a user
Route.get('users/:id/feed', 'UserController.video_feed')
//GET comments by video id
Route.get("videos/:id/comments", async ({params}) => {
  const comments = await Database.table('comments').where('video_id', params.id)
  return comments;
})
//POST comments with video id
Route.post("videos/:video_id/comments", async ({request, params}) => {
  const { comment, auth_id } = request.post()
  const user = await User.findBy('auth_id', auth_id);
  const user_id = user.id;
  const { video_id } = params
  const commentData = { comment, user_id, video_id }
  const mycomment = await Comment.create(commentData)
  response.send(mycomment);
})
//GET replies by VIDEO ID with COMMENTS
Route.get("videos/:video_id/comments/:comment_id/replies", async ({response, params}) => {
  const replies = await Database.table('replies').where('comment_id', params.comment_id)
  response.send(replies);
})
//POST video by VIDEO ID with COMMENTS
Route.post("videos/:video_id/comments/:comment_id/replies", async ({request, response, params}) => {
  const { reply } = request.post()
  const { comment_id } = params;
  const replyData = { reply, comment_id }
  const myreply = await Reply.create(replyData);
  response.send(myreply);
})
//PATCH video by ID
Route.patch("videos/:id", async ({ params, request, response }) => {
  //todo: add authorization
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
  //todo: add authorization and implicitend
  response.implicitEnd = false
  const video = await Database.raw(
    "delete from videos CASCADE where id = ?",
    params.id
  )
    .then((video) => {
      response.status(200).json(video);
    })
    .catch((error) => {
      response.status(500).json({
        status: 500,
        error: "An error has occurred"
      });
    });
});

//POST video and save to S3
Route.post("upload", async ({ request, response }) => {

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
//GET all likes
Route.get("videos/:id/likes", async ({ request, response, params }) => {
  const likes = await Database.table("video_likes").where(
    "video_id",
    params.id
  );
  response.send(likes);
});
//POST likes, only one per day allowed
Route.post("videos/:id/likes", async ({ request, response, params }) => {
  const { auth_id } = request.post();
  const user = await User.findBy('auth_id', auth_id);
  const userId = user.id;
  const videoId = params.id;
  const video = await Video.find(videoId)
  const likes = await Database.raw(
    `SELECT users.id, COUNT(users.id) FROM users LEFT JOIN video_likes ON users.id = video_likes.user_id WHERE user_id = ? AND video_likes.created_at::TIMESTAMP::DATE = current_date GROUP BY users.id`,
    userId
  );
  //check one per day
  if (likes.rows.length > 0) {
    response.status(500).json({
      status: 500,
      error: "You reached your daily like limit"
    });
    return;
  }
  await Database.table("video_likes")
    .insert({
      video_id: videoId,
      user_id: userId,
      created_at: Database.fn.now(),
      updated_at: Database.fn.now()
    })
    .then( () => {
      //the like was created, now add a transaction
      Transaction.create({sender_id: userId, receiver_id: video.user_id, amount: 10, type: 'like'})

      response.status(200).json({
        status: 200
      });

      //todo: use a ".then()" to check if transaction successfully inserted.
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
Route.get("users/:id/transactions", async ({ params }) => {
  const user = await User.findBy('auth_id', params.id);
  const userId = user.id;
  const transactions = await Database.table("transactions")
    .where("receiver_id", userId)
    .orWhere("sender_id", userId);
  return transactions;
});
//POST transactions
Route.post("transactions", async ({ request, response }) => {
  const { auth_id, video_id, amount, type } = request.post();
  const user = await User.findBy('auth_id', params.id);
  const video = await Video.find(video_id)
  const transactionData = {
    sender_id: user.id,
    receiver_id: video.user_id,
    amount, type
  }
  const transaction = Transaction.create(transactionData);
  response.send({ amount, type });
});
//GET balance by USER
Route.get("users/:id/balance", async ({ params }) => {
  const user = await User.findBy('auth_id', params.id)
  const userId = user.id;
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
  return { balance };
});
//POST stripe payment
Route.post("/api/doPayment/", async ({ request, response }) => {
  const body = request.post();

  return stripe.charges
    .create({
      amount: body.amount,
      currency: "JPY",
      source: body.tokenId,
      description: "Charge"
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
