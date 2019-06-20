SELECT * FROM
    (
    SELECT
        all_videos.id AS video_id,
        all_videos.title,
        all_videos.description,
        all_videos.likes,
        all_videos.user_id,
        CASE WHEN user_likes.user_likes IS NULL THEN false ELSE true END AS liked,
        all_videos.url
    FROM
        (
        SELECT
            videos.id,
            videos.title,
            videos.description,
            videos.url,
            videos.user_id,
            CASE WHEN NOT EXISTS (
                SELECT * FROM
                    video_likes
                WHERE
                    videos.id = video_likes.video_id
            ) THEN 0 ELSE COUNT(videos.id) END AS likes
        FROM
            videos
        LEFT JOIN
            video_likes
        ON
            videos.id = video_likes.video_id
        GROUP BY
            videos.id)
        AS
            all_videos
        LEFT JOIN 
            (
            SELECT
                videos.id,
                videos.title,
                COUNT(videos.id) AS user_likes
            FROM
                videos
            JOIN
                video_likes
            ON
                videos.id = video_likes.video_id
            WHERE
                video_likes.user_id = 1
            GROUP BY
                videos.id
            )
            AS
                user_likes
        ON
            all_videos.id = user_likes.id
        ORDER BY
            all_videos.id
    ) AS all_vids
WHERE
    all_vids.user_id = 1
;