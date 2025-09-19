const oracledb = require('oracledb');
const { getConnection } = require('../db/pool');

exports.findByEmail = async (email) => {
  const conn = await getConnection();
  try {
    const r = await conn.execute(
      `SELECT id, email, password_hash, display_name, is_active FROM users WHERE email = :email`,
      { email },
      { outFormat: oracledb.OBJECT }
    );
    return r.rows[0] || null;
  } finally { await conn.close(); }
};

exports.create = async ({ email, passwordHash, displayName }) => {
  const conn = await getConnection();
  try {
    const r = await conn.execute(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES (:email, :ph, :dn)
       RETURNING id INTO :id`,
      { email, ph: passwordHash, dn: displayName || null, id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
      { autoCommit: true }
    );
    return r.outBinds.id[0];
  } finally { await conn.close(); }
};
