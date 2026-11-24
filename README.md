<<<<<<< HEAD
# Secure Connect and Communication Platform (Lab 4, Web Dev III)

Node.js + Express backend with JWT auth, bcrypt password hashing, RBAC, a protected Notes API,
real-time chat over Socket.IO, and EventEmitter-driven logging. Only the libraries allowed by the lab are used
(express, jsonwebtoken, bcrypt, dotenv, socket.io, plus mongoose for MongoDB).

## Setup

```bash
npm install
cp .env.example .env     # then edit JWT_SECRET
# make sure MongoDB is running locally (mongodb://127.0.0.1:27017)
node server.js
```

Expected console output:

```
[db] MongoDB connected
[server] listening on http://localhost:5000
```

## Project structure

```
server.js              entry point: Express + Socket.IO + DB
config/db.js           MongoDB connection
models/                User, Note, Message
middleware/auth.js     authenticate (JWT) and authorize (RBAC)
routes/                auth.js, notes.js, admin.js
sockets/chat.js        authenticated real-time chat
events/appEvents.js    EventEmitter + listeners
public/index.html      small chat test page
```

## API

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | no | Register (password stored as bcrypt hash) |
| POST | /api/auth/login | no | Returns JWT and sets `token` cookie |
| POST | /api/auth/logout | no | Clears cookie |
| GET | /api/auth/me | JWT | Current user |
| POST | /api/notes | JWT | Create note |
| GET | /api/notes | JWT | List my notes |
| GET | /api/notes/:id | JWT | Get one of my notes |
| PUT | /api/notes/:id | JWT | Update my note |
| DELETE | /api/notes/:id | JWT | Delete my note |
| GET | /api/admin/users | JWT + admin | List all users |
| GET | /api/admin/notes | JWT + admin | List all notes |

Send the token either as the `token` cookie (Postman keeps it automatically after login) or as
`Authorization: Bearer <token>`. Without a token the API returns `403 {"message":"No token provided"}`.

## Postman test order (matches the lab screenshots)

1. POST `/api/auth/signup` body `{"username":"victor","email":"victor@example.com","password":"123456"}` -> 201 User registered
2. POST `/api/auth/login` body `{"email":"victor@example.com","password":"123456"}` -> 200 Login successful + token
3. GET `/api/notes` with no token -> 403 No token provided
4. POST `/api/notes` with token -> 201; GET `/api/notes` with token -> 200 list

## Chat

Open http://localhost:5000 in two browser windows, log in with two different users, and chat in room `general`.
The server console logs:

```
User connected: <socketId>
<socketId> joined room general
[general] Aditi: Hey team, backend is ready
```

Socket events: `joinRoom`, `leaveRoom`, `chatMessage`, `typing` (client -> server);
`message`, `history`, `notification`, `typing` (server -> client). Sockets require the same JWT (`auth: { token }`).

## Admin (RBAC)

Whoever signs up with the email set as `ADMIN_EMAIL` in `.env` gets the `admin` role.
Normal users receive `403 Forbidden` on `/api/admin/*`. Roles are never read from the signup request.

## Security notes

- Passwords hashed with bcrypt (10 salt rounds), never returned in responses
- Secrets in `.env` (git-ignored), `.env.example` provided
- JWT expiry (default 1h), httpOnly + sameSite cookie
- Generic login error message to avoid user enumeration
- Notes are filtered by `owner`, so users cannot read or edit each other's notes
=======
# Web-Dev-Assignment-4
>>>>>>> 03b9b6c181cb810783df4b822b19b71467ddccef
