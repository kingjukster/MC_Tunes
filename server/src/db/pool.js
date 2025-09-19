const oracledb = require('oracledb');

let pool;
async function getPool() {
  if (!pool) {
    pool = await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
      poolMin: 1, poolMax: 8, poolIncrement: 1
    });
  }
  return pool;
}

async function getConnection() {
  const p = await getPool();
  return p.getConnection();
}

async function closePool() {
  if (pool) await pool.close(0);
}

module.exports = { getPool, getConnection, closePool };
