const router = require('express').Router();
const ratings = require('../dao/ratings.dao');

router.post('/', async (req, res) => {
  try {
    const { userId, songId, ratingValue } = req.body || {};
    if (!userId || !songId || !ratingValue) return res.status(400).json({ error: 'Missing userId, songId, ratingValue' });
    await ratings.upsert({ userId, songId, ratingValue });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

module.exports = router;
