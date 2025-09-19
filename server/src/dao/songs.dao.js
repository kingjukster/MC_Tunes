const oracledb = require('oracledb');
const { getConnection } = require('../db/pool');

exports.list = async ({ q, genreId, moodCode, limit=50, offset=0 }) => {
  const binds = { lo: offset + 1, hi: offset + limit };
  let where = '1=1';
  if (q) { where += ' AND (LOWER(title) LIKE :q OR LOWER(artist) LIKE :q)'; binds.q = `%${q.toLowerCase()}%`; }
  if (genreId) { where += ' AND genre_id = :genreId'; binds.genreId = Number(genreId); }
  if (moodCode) {
    where += ' AND default_mood_id IN (SELECT id FROM moods WHERE code = :moodCode)';
    binds.moodCode = moodCode;
  }

  const sql = `
    SELECT * FROM (
      SELECT v.*, ROW_NUMBER() OVER (ORDER BY NVL(v.rating_avg,0) DESC, v.title ASC) rn
      FROM v_songs_enriched v
      WHERE ${where}
    ) WHERE rn BETWEEN :lo AND :hi
  `;

  const conn = await getConnection();
  try {
    const r = await conn.execute(sql, binds, { outFormat: oracledb.OBJECT });
    return r.rows;
  } finally { await conn.close(); }
};
