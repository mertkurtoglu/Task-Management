# Backend API

This is the backend server for the project, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Encrypted password handling with bcryptjs
- RESTful API structure with MVC pattern
- Middleware support
- Environment variable configuration with dotenv
- Cross-origin requests enabled via CORS

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- nodemon (for development)

## Folder Structure

```
backend/
│
├── controllers/        # Request handlers
├── middlewares/        # Custom middlewares
├── models/             # Mongoose models
├── routes/             # API route definitions
├── node_modules/       # Installed dependencies
├── .env                # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
└── server.js           # Entry point of the application
```

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Run the Server

```bash
npm run dev
```

The server should start on `http://localhost:5000` or the port you specify.

## ☁️ Deployment

The project was deployed to Render.
(https://task-management-m6ud.onrender.com/)

```

```
