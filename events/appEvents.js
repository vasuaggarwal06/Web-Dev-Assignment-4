// Event-driven features using Node.js EventEmitter.
// Routes / sockets emit events; listeners below react to them independently.
const EventEmitter = require('events');

class AppEvents extends EventEmitter {}
const appEvents = new AppEvents();

appEvents.on('user:registered', (user) => {
  console.log(`[event] user:registered -> ${user.username} <${user.email}> (${user.role})`);
});

appEvents.on('user:loggedIn', (user) => {
  console.log(`[event] user:loggedIn -> ${user.email} at ${new Date().toISOString()}`);
});

appEvents.on('login:failed', ({ email, ip }) => {
  console.warn(`[event] login:failed -> ${email} from ${ip}`);
});

appEvents.on('note:created', (note) => {
  console.log(`[event] note:created -> "${note.title}" by user ${note.owner}`);
});

appEvents.on('note:updated', (note) => {
  console.log(`[event] note:updated -> "${note.title}" (${note._id})`);
});

appEvents.on('note:deleted', (note) => {
  console.log(`[event] note:deleted -> "${note.title}" (${note._id})`);
});

appEvents.on('chat:message', ({ room, username, text }) => {
  console.log(`[${room}] ${username}: ${text}`);
});

module.exports = appEvents;
