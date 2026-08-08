# MusicSystemBackend

MusicSystemBackend is a REST API backend for a music application built with Node.js, Express, and MongoDB. It supports user registration, login, JWT authentication, artist-only music and album creation, secure cookie session handling, and media uploads to ImageKit.

## Features

- User registration and login with hashed passwords
- JWT-based authentication using cookies
- Role-based access control for users and artists
- Music upload endpoint with ImageKit storage integration
- Album creation and music listing endpoints
- MongoDB models for users, music, and albums
- Validation middleware for user registration

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- `bcryptjs` for password hashing
- `cookie-parser` for cookie handling
- `express-validator` for request validation
- `multer` for file upload handling
- `@imagekit/nodejs` for media storage
- `dotenv` for environment configuration

## Project Structure

- `server.js` — app bootstrap and database connection
- `src/app.js` — Express app configuration and route mounting
- `src/db/db.js` — MongoDB connection helper
- `src/routes/` — route definitions for auth and music APIs
- `src/controllers/` — request handlers for auth and music operations
- `src/models/` — Mongoose schemas for users, music, and albums
- `src/middlewares/` — authentication and validation middleware
- `src/services/storage.service.js` — ImageKit upload helper

## Requirements

- Node.js 18+ (recommended)
- MongoDB database
- ImageKit account with a private key

## Environment Variables

Create a `.env` file in the project root with these variables:

```env
MONGO_URI=<your-mongo-connection-string>
JWT_SECRET=<your-jwt-secret>
IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
```

## Installation

```bash
cd C:\MYBlock\BackendLearning\Backend
npm install
```

## Run Locally

```bash
node server.js
```

The server listens on port `3000` by default.

## API Endpoints

### Auth Endpoints

#### Register User

- URL: `POST /api/auth/register`
- Body:
  - `username` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `role` (string, optional, `user` or `artist`)
- Response: user details and cookie token

#### Login User

- URL: `POST /api/auth/login`
- Body:
  - `username` or `email`
  - `password`
- Response: user details and cookie token

#### Logout User

- URL: `POST /api/auth/logout`
- Response: clears auth cookie

### Music Endpoints

#### Upload Music (Artist only)

- URL: `POST /api/music/upload`
- Headers: cookie token from login
- Body: multipart form data
  - `music` (file)
  - `title` (string)
- Requires role: `artist`

#### Create Album (Artist only)

- URL: `POST /api/music/album`
- Headers: cookie token from login
- Body:
  - `title` (string, required)
  - `musics` (array of music object IDs)
- Requires role: `artist`

#### Get All Music

- URL: `GET /api/music/`
- Headers: cookie token from login
- Requires role: `user` or `artist`

#### Get All Albums

- URL: `GET /api/music/album`
- Headers: cookie token from login
- Requires role: `user` or `artist`

#### Get Album by ID

- URL: `GET /api/music/album/:albumId`
- Headers: cookie token from login
- Requires role: `user` or `artist`

## Notes

- The app uses cookies to store JWT tokens; enable cookies in your HTTP client.
- The upload route sends files to ImageKit and stores the returned URL in MongoDB.
- Make sure your `MONGO_URI` and `IMAGEKIT_PRIVATE_KEY` are valid before running.

## License

This project is provided as-is.
