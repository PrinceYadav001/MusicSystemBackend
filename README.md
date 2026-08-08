# 🎵 MusicSystemBackend

A robust REST API backend for a music streaming/management application, built with **Node.js**, **Express**, and **MongoDB**. It supports secure user authentication, role-based access control (listeners vs. artists), music & album management, and media uploads via **ImageKit**.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-black?style=flat&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Requirements](#-requirements)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
  - [Auth Endpoints](#auth-endpoints)
  - [Music Endpoints](#music-endpoints)
- [Authentication Flow](#-authentication-flow)
- [Error Handling](#-error-handling)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧭 Overview

**MusicSystemBackend** powers the server-side logic of a music application — handling everything from user onboarding to artist-exclusive music/album publishing. It follows a clean **MVC-inspired** architecture (routes → controllers → models/services), uses **JWT stored in HTTP-only cookies** for session handling, and offloads media storage to **ImageKit** for fast, CDN-backed delivery.

---

## ✨ Features

- 🔐 Secure user registration & login with **bcrypt** password hashing
- 🍪 JWT-based authentication using **HTTP-only cookies**
- 👥 Role-based access control — distinct permissions for `user` and `artist`
- 🎧 Music upload endpoint with **ImageKit** cloud storage integration
- 💿 Album creation & music listing endpoints
- 🗃️ Well-defined **Mongoose** schemas for users, music, and albums
- ✅ Request validation middleware using **express-validator**
- 📦 Clean, modular project structure for easy scaling

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | `bcryptjs` |
| Cookies | `cookie-parser` |
| Validation | `express-validator` |
| File Uploads | `multer` |
| Media Storage | `@imagekit/nodejs` |
| Config | `dotenv` |

---

## 📁 Project Structure

```
MusicSystemBackend/
├── server.js                    # App bootstrap and database connection
├── src/
│   ├── app.js                   # Express app configuration & route mounting
│   ├── db/
│   │   └── db.js                # MongoDB connection helper
│   ├── routes/                  # Route definitions (auth, music)
│   ├── controllers/             # Request handlers (auth, music)
│   ├── models/                  # Mongoose schemas (User, Music, Album)
│   ├── middlewares/              # Auth & validation middleware
│   └── services/
│       └── storage.service.js   # ImageKit upload helper
├── .gitignore
├── package.json
└── package-lock.json
```

---

## ✅ Requirements

- **Node.js** v18 or higher (recommended)
- A **MongoDB** database (local or Atlas)
- An **ImageKit** account with a valid private key

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrinceYadav001/MusicSystemBackend.git
   cd MusicSystemBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (see below)

4. **Run the server**
   ```bash
   node server.js
   ```
   The server listens on **port 3000** by default.

   For development with auto-restart (if `nodemon` is set up):
   ```bash
   npx nodemon server.js
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=<your-mongo-connection-string>
JWT_SECRET=<your-jwt-secret>
IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWTs |
| `IMAGEKIT_PRIVATE_KEY` | Private key for ImageKit uploads |

> ⚠️ Never commit your `.env` file. It should already be listed in `.gitignore`.

---

## 📡 API Reference

Base URL: `http://localhost:3000/api`

### Auth Endpoints

#### Register User
`POST /api/auth/register`

| Field | Type | Required | Notes |
|---|---|---|---|
| `username` | string | ✅ | |
| `email` | string | ✅ | |
| `password` | string | ✅ | |
| `role` | string | ❌ | `user` or `artist` (defaults to `user`) |

**Response:** User details + auth cookie set.

---

#### Login User
`POST /api/auth/login`

| Field | Type | Required |
|---|---|---|
| `username` or `email` | string | ✅ |
| `password` | string | ✅ |

**Response:** User details + auth cookie set.

---

#### Logout User
`POST /api/auth/logout`

**Response:** Clears the auth cookie.

---

### Music Endpoints

> All music endpoints require the auth cookie (obtained via login) to be sent with the request.

#### Upload Music *(Artist only)*
`POST /api/music/upload`

- **Headers:** Cookie token from login
- **Body:** `multipart/form-data`
  - `music` (file, required)
  - `title` (string, required)
- **Requires role:** `artist`

---

#### Create Album *(Artist only)*
`POST /api/music/album`

- **Headers:** Cookie token from login
- **Body:**
  - `title` (string, required)
  - `musics` (array of Music ObjectIds)
- **Requires role:** `artist`

---

#### Get All Music
`GET /api/music/`

- **Headers:** Cookie token from login
- **Requires role:** `user` or `artist`

---

#### Get All Albums
`GET /api/music/album`

- **Headers:** Cookie token from login
- **Requires role:** `user` or `artist`

---

#### Get Album by ID
`GET /api/music/album/:albumId`

- **Headers:** Cookie token from login
- **Requires role:** `user` or `artist`

---

## 🔄 Authentication Flow

1. User registers or logs in via `/api/auth/register` or `/api/auth/login`.
2. Server validates credentials, hashes/compares passwords with `bcryptjs`.
3. On success, a JWT is signed with `JWT_SECRET` and set as an **HTTP-only cookie**.
4. Subsequent requests automatically include the cookie; middleware verifies the token and attaches the authenticated user (and role) to the request.
5. Role-based middleware restricts artist-only routes (upload music, create album) to users with `role: "artist"`.
6. `/api/auth/logout` clears the cookie, ending the session.

---

## ⚠️ Error Handling

The API returns consistent JSON error responses, for example:

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

Common status codes used:

| Code | Meaning |
|---|---|
| `400` | Validation error / bad request |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient role) |
| `404` | Resource not found |
| `500` | Internal server error |

---

## 🗺 Roadmap

- [ ] Add pagination to music/album listing endpoints
- [ ] Add search & filter support (by artist, genre, title)
- [ ] Add refresh token support
- [ ] Add rate limiting on auth routes
- [ ] Add unit & integration tests
- [ ] API documentation via Swagger/OpenAPI

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is provided **as-is** under the ISC License.

---

<p align="center">Made with ❤️ by <a href="https://github.com/PrinceYadav001">Prince Yadav</a></p>
