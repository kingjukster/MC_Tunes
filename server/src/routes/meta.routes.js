const router = require('express').Router();
const meta = require('../dao/meta.dao');

router.get('/genres', async (_req, res) => {
  try { res.json({ data: await meta.listGenres() }); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch genres' }); }
});

router.get('/moods', async (_req, res) => {
  try { res.json({ data: await meta.listMoods() }); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch moods' }); }
});

router.get('/activities', async (_req, res) => {
  try { res.json({ data: await meta.listActivities() }); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch activities' }); }
});

/** Simple context endpoints (no auth middleware yet) */
router.get('/context/:userId', async (req, res) => {
  try { res.json({ data: await meta.getUserContext(req.params.userId) }); }
  catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch user context' }); }
});

router.put('/context/:userId', async (req, res) => {
  try {
    const { moodCode, activityId } = req.body || {};
    await meta.setUserContext({ userId: req.params.userId, moodCode, activityId });
    res.json({ ok: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to save user context' }); }
});

module.exports = router;
