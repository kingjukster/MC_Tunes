const router = require('express').Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const users = require('../dao/users.dao');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_only';

router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Missing email/password' });
    const exists = await users.findByEmail(email);
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const hash = await argon2.hash(password);
    const id = await users.create({ email, passwordHash: hash, displayName });
    res.json({ id, email, displayName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const u = await users.findByEmail(email);
    if (!u) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await argon2.verify(u.PASSWORD_HASH || u.password_hash, password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: u.ID || u.id, email: u.EMAIL || u.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: u.ID || u.id, email: u.EMAIL || u.email, displayName: u.DISPLAY_NAME || u.display_name } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
