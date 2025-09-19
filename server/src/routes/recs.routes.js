const router = require('express').Router();
const oracledb = require('oracledb');
const { getConnection } = require('../db/pool');

router.get('/:userId', async (req, res) => {
  const uid = Number(req.params.userId);
  const limit = Number(req.query.limit || 20);
  const sql = `
    WITH ctx AS (
      SELECT uc.mood_id, uc.activity_id FROM user_context uc WHERE uc.user_id = :uid
    )
    SELECT v.*
    FROM v_songs_enriched v
    LEFT JOIN ctx ON 1=1
    WHERE (ctx.mood_id IS NULL OR v.default_mood_id = ctx.mood_id)
    ORDER BY NVL(v.rating_avg,0) DESC, v.title ASC
    FETCH FIRST :lim ROWS ONLY
  `;
  try {
    const conn = await getConnection();
    const r = await conn.execute(sql, { uid, lim: limit }, { outFormat: oracledb.OBJECT });
    await conn.close();
    res.json({ data: r.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to get recs' });
  }
});

module.exports = router;
