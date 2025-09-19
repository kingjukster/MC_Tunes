const router = require('express').Router();
const songs = require('../dao/songs.dao');

router.get('/', async (req, res) => {
  try {
    const { q, genreId, moodCode, limit, offset } = req.query;
    const data = await songs.list({
      q,
      genreId,
      moodCode,
      limit: limit ? Number(limit) : 50,
      offset: offset ? Number(offset) : 0
    });
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to list songs' });
  }
});

module.exports = router;
