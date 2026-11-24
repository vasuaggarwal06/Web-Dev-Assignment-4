const express = require('express');
const User = require('../models/User');
const Note = require('../models/Note');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, authorize('admin')); // RBAC: admins only

// GET /api/admin/users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// GET /api/admin/notes  (all notes from all users)
router.get('/notes', async (req, res) => {
  const notes = await Note.find().populate('owner', 'username email');
  res.json(notes);
});

module.exports = router;
