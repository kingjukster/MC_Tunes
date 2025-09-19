const { getConnection } = require('../db/pool');

exports.upsert = async ({ userId, songId, ratingValue }) => {
  const conn = await getConnection();
  try {
    await conn.execute(
      `MERGE INTO ratings r
         USING (SELECT :userId user_id, :songId song_id, :val rating_value FROM dual) s
         ON (r.user_id = s.user_id AND r.song_id = s.song_id)
       WHEN MATCHED THEN UPDATE SET r.rating_value = s.rating_value, r.rated_at = SYSTIMESTAMP
       WHEN NOT MATCHED THEN INSERT (user_id, song_id, rating_value) VALUES (s.user_id, s.song_id, s.rating_value)`,
      { userId: Number(userId), songId: Number(songId), val: Number(ratingValue) },
      { autoCommit: true }
    );
  } finally { await conn.close(); }
};
