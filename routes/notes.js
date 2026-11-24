const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/Note');
const appEvents = require('../events/appEvents');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate); // every notes route is protected

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid note id' });
  }
  next();
};

// POST /api/notes
router.post('/', async (req, res) => {
  const { title, content } = req.body || {};
  if (!title || !content) return res.status(400).json({ message: 'title and content are required' });
  const note = await Note.create({ title, content, owner: req.user.id });
  appEvents.emit('note:created', note);
  res.status(201).json(note);
});

// GET /api/notes  (only the caller's own notes)
router.get('/', async (req, res) => {
  const notes = await Note.find({ owner: req.user.id }).sort({ createdAt: 1 });
  res.json(notes);
});

// GET /api/notes/:id
router.get('/:id', validId, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user.id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// PUT /api/notes/:id
router.put('/:id', validId, async (req, res) => {
  const { title, content } = req.body || {};
  const update = {};
  if (title) update.title = title;
  if (content) update.content = content;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    update,
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  appEvents.emit('note:updated', note);
  res.json(note);
});

// DELETE /api/notes/:id
router.delete('/:id', validId, async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  appEvents.emit('note:deleted', note);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
