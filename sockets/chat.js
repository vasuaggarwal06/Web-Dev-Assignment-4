const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const appEvents = require('../events/appEvents');
const { parseCookies } = require('../middleware/auth');

module.exports = function initChat(io) {
  // Authenticate every socket connection using the same JWT as the REST API
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      parseCookies(socket.handshake.headers.cookie).token;
    if (!token) return next(new Error('No token provided'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { id: decoded.id, username: decoded.username, role: decoded.role };
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', async (room = 'general') => {
      socket.join(room);
      console.log(`${socket.id} joined room ${room}`);
      socket.to(room).emit('notification', `${socket.user.username} joined ${room}`);

      // Send the last 20 messages as history
      const history = await Message.find({ room }).sort({ createdAt: -1 }).limit(20);
      socket.emit('history', history.reverse());
    });

    socket.on('leaveRoom', (room) => {
      socket.leave(room);
      socket.to(room).emit('notification', `${socket.user.username} left ${room}`);
    });

    socket.on('chatMessage', async ({ room = 'general', text } = {}) => {
      if (!text || !String(text).trim() || !socket.rooms.has(room)) return;
      const msg = await Message.create({
        room,
        sender: socket.user.id,
        username: socket.user.username,
        text: String(text).trim(),
      });
      appEvents.emit('chat:message', msg);
      io.to(room).emit('message', {
        room,
        username: msg.username,
        text: msg.text,
        createdAt: msg.createdAt,
      });
    });

    socket.on('typing', (room = 'general') => {
      socket.to(room).emit('typing', socket.user.username);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
