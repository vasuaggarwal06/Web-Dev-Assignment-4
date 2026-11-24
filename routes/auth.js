const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const appEvents = require('../events/appEvents');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    // Roles are never taken from the request body (prevents privilege escalation)
    const role = process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
      ? 'admin'
      : 'user';

    const user = await User.create({ username, email, password: hashed, role });
    appEvents.emit('user:registered', user);

    res.status(201).json({
      message: 'User registered',
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) {
      appEvents.emit('login:failed', { email, ip: req.ip });
      // Same message for both cases so attackers cannot tell which was wrong
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    });
    appEvents.emit('user:loggedIn', user);
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me  (protected)
router.get('/me', authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

module.exports = router;
