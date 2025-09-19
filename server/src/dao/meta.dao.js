const oracledb = require('oracledb');
const { getConnection } = require('../db/pool');

exports.listGenres = async () => {
  const conn = await getConnection();
  try {
    const r = await conn.execute(`SELECT id, name FROM genres ORDER BY name`, [], { outFormat: oracledb.OBJECT });
    return r.rows;
  } finally { await conn.close(); }
};

exports.listMoods = async () => {
  const conn = await getConnection();
  try {
    const r = await conn.execute(`SELECT id, code, display_name FROM moods ORDER BY display_name`, [], { outFormat: oracledb.OBJECT });
    return r.rows;
  } finally { await conn.close(); }
};

exports.listActivities = async () => {
  const conn = await getConnection();
  try {
    const r = await conn.execute(
      `SELECT id, name, description, is_default FROM activities ORDER BY name`,
      [], { outFormat: oracledb.OBJECT }
    );
    return r.rows;
  } finally { await conn.close(); }
};

exports.getUserContext = async (userId) => {
  const conn = await getConnection();
  try {
    const r = await conn.execute(
      `SELECT uc.user_id, uc.mood_id, uc.activity_id,
              (SELECT code FROM moods m WHERE m.id = uc.mood_id) AS mood_code
       FROM user_context uc
       WHERE uc.user_id = :uid`,
      { uid: Number(userId) }, { outFormat: oracledb.OBJECT }
    );
    return r.rows[0] || null;
  } finally { await conn.close(); }
};

exports.setUserContext = async ({ userId, moodCode, activityId }) => {
  const conn = await getConnection();
  try {
    await conn.execute(
      `MERGE INTO user_context uc
         USING (SELECT :uid AS user_id,
                       (SELECT id FROM moods WHERE code = :mcode) AS mood_id,
                       :actid AS activity_id
                  FROM dual) x
            ON (uc.user_id = x.user_id)
       WHEN MATCHED THEN UPDATE SET uc.mood_id = x.mood_id, uc.activity_id = x.activity_id, uc.updated_at = SYSTIMESTAMP
       WHEN NOT MATCHED THEN INSERT (user_id, mood_id, activity_id) VALUES (x.user_id, x.mood_id, x.activity_id)`,
      { uid: Number(userId), mcode: moodCode || null, actid: activityId ? Number(activityId) : null },
      { autoCommit: true }
    );
  } finally { await conn.close(); }
};
