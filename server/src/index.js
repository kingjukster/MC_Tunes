require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPool, closePool } = require('./db/pool');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/songs', require('./routes/songs.routes'));
app.use('/ratings', require('./routes/ratings.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/meta', require('./routes/meta.routes'));
app.use('/recs', require('./routes/recs.routes'));


const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await getPool();
  console.log(`API listening on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => { await closePool(); process.exit(0); });
process.on('SIGTERM', async () => { await closePool(); process.exit(0); });
