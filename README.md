# Secure Connect and Communication Platform

Lab 4 - Web Dev III

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Create a `.env` file (see `.env.example`)
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/secure_connect
   JWT_SECRET=your_secret_here
   JWT_EXPIRES_IN=1h
   ADMIN_EMAIL=admin@example.com
   ```
3. Start MongoDB, then run the server
   ```bash
   node server.js
   ```
   Server runs at `http://localhost:5000`.

## API Endpoints

| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/signup | Public | Register a user |
| POST | /api/auth/login | Public | Login and get JWT |
| GET | /api/notes | JWT | Get my notes |
| POST | /api/notes | JWT | Create a note |
| GET | /api/notes/:id | JWT | Get a note |
| PUT | /api/notes/:id | JWT | Update a note |
| DELETE | /api/notes/:id | JWT | Delete a note |
| GET | /api/admin/users | Admin | List all users |

Requests without a token return `403 No token provided`.

## Real-Time Chat

Open `http://localhost:5000` in two browser windows, log in with different users, and chat in the `general` room.

## Screenshots

### Signup and Login
<img width="1396" height="897" alt="Screenshot 2026-11-24 091411" src="https://github.com/user-attachments/assets/9d55101e-46d3-4ab6-bf9b-5fd457c701ee" />
<img width="1377" height="890" alt="Screenshot 2026-11-24 091441" src="https://github.com/user-attachments/assets/adb8fb9c-74a9-4fd1-9d1a-bef92dc69374" />

### Notes API
<img width="1408" height="937" alt="Screenshot 2026-11-24 092417" src="https://github.com/user-attachments/assets/987f4b7b-09e1-4ff6-9e12-3a6da2532e09" />
<img width="1390" height="917" alt="Screenshot 2026-11-24 092524" src="https://github.com/user-attachments/assets/3b5aebef-70c1-40ec-9b6f-9ee7dca3ea01" />
<img width="1395" height="900" alt="Screenshot 2026-11-24 092650" src="https://github.com/user-attachments/assets/2ac0b5ca-5106-454a-895a-9966e0381cc0" />

### Real-Time Chat
<img width="1917" height="972" alt="Screenshot 2026-11-24 093621" src="https://github.com/user-attachments/assets/93c62257-fea4-49df-a4df-63a5f66212cc" />
