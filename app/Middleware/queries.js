const videoLikes = "SELECT videos.id,videos.title,videos.description,videos.url,CASE WHEN NOT EXISTS (SELECT * FROM video_likes WHERE videos.id = video_likes.video_id) THEN 0 ELSE COUNT(videos.id) END AS likes FROM videos LEFT JOIN video_likes ON videos.id = video_likes.video_id GROUP BY videos.id;"

const videoLikesUserId = "SELECT videos.id,videos.title,videos.description,videos.url,videos.user_id,CASE WHEN NOT EXISTS (SELECT * FROM video_likes WHERE videos.id = video_likes.video_id) THEN 0 ELSE COUNT(videos.id) END AS likes FROM videos LEFT JOIN video_likes ON videos.id = video_likes.video_id GROUP BY videos.id;"

const videoLikesUsernames = "SELECT vids_liked.id,vids_liked.title,vids_liked.description,vids_liked.url,vids_liked.likes,users.name FROM (" + videoLikesUserId.slice(0,-1) +") AS vids_liked JOIN users ON vids_liked.user_id = users.id;"

const videosAgg = (userId) => "SELECT all_videos.id AS video_id,all_videos.name,all_videos.title,all_videos.description,all_videos.likes,CASE WHEN user_likes.user_likes IS NULL THEN false ELSE true END AS liked,all_videos.url FROM (" + videoLikesUsernames.slice(0,-1) + ") AS all_videos LEFT JOIN (SELECT videos.id,videos.title,COUNT(videos.id) AS user_likes FROM videos JOIN video_likes ON videos.id = video_likes.video_id WHERE video_likes.user_id =" + userId + " GROUP BY videos.id ) AS user_likes ON all_videos.id = user_likes.id ORDER BY all_videos.id;"

const videosAggByUser = (userId) => "SELECT * FROM(SELECT all_videos.id AS video_id,all_videos.title,all_videos.description,all_videos.likes,all_videos.user_id,CASE WHEN user_likes.user_likes IS NULL THEN false ELSE true END AS liked,all_videos.url FROM (SELECT videos.id,videos.title,videos.description,videos.url,videos.user_id, CASE WHEN NOT EXISTS ( SELECT * FROM video_likes WHERE videos.id = video_likes.video_id) THEN 0 ELSE COUNT(videos.id) END AS likes FROM videos LEFT JOIN video_likes ON videos.id = video_likes.video_id GROUP BY videos.id) AS all_videos LEFT JOIN (SELECT videos.id, videos.title, COUNT(videos.id) AS user_likes FROM videos JOIN video_likes ON videos.id = video_likes.video_id WHERE video_likes.user_id =" + userId + " GROUP BY videos.id) AS user_likes ON all_videos.id = user_likes.id ORDER BY all_videos.id) AS all_vids WHERE all_vids.user_id =" + userId + ";"



module.exports = { videosAgg, videosAggByUser }