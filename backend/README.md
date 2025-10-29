# MSJ Hackathon API 🚀

A production-ready Express.js API template with authentication, security, logging, and API documentation built for rapid hackathon development.

## ✨ Features

- **🔐 JWT Authentication**: Secure user registration/login with bcrypt hashing and token-based auth
- **📚 API Documentation**: Auto-generated Swagger/OpenAPI docs at `/api-docs`
- **🛡️ Security**: Helmet, CORS, rate limiting, MongoDB sanitization
- **📝 Logging**: Structured JSON logging with Pino (pretty-print in dev)
- **✅ Validation**: Express-validator for input validation
- **🔄 Hot Reload**: Nodemon for development
- **⚡ Performance**: Compression, optimized MongoDB connection
- **🌍 Production-Ready**: Error handling, graceful shutdown, 12-factor config

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ and npm
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI, JWT_SECRET, etc.
```

### Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The API will be available at:
- **API**: http://localhost:3000/api
- **Docs**: http://localhost:3000/api-docs
- **Health**: http://localhost:3000/api/health

## 📁 Project Structure

```
MSJ/
├── src/
│   ├── config/           # Configuration and setup
│   │   ├── index.js      # Centralized config from env
│   │   ├── database.js   # MongoDB connection
│   │   └── logger.js     # Pino logger setup
│   ├── models/           # Mongoose models
│   │   └── User.js       # User model with auth methods
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── errorHandler.js  # Global error handler
│   │   └── validator.js  # Input validation rules
│   ├── routes/           # API routes
│   │   ├── index.js      # Route aggregator
│   │   ├── auth.js       # Auth endpoints
│   │   └── health.js     # Health check
│   ├── docs/             # API documentation
│   │   └── swagger.js    # Swagger/OpenAPI config
│   ├── ai/               # AI/ML integration placeholder
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout (invalidate tokens) | Yes |

### System

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| GET | `/api-docs` | Interactive API docs | No |

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Profile (Authenticated)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Configuration

All configuration is managed through environment variables (`.env`):

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/msj-hackathon

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Logging
LOG_LEVEL=info
```

## 🗄️ MongoDB Setup

### Local MongoDB
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### MongoDB Atlas (Recommended for Hackathons)

1. Create free M0 cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your IP or use `0.0.0.0/0` for development
3. Create database user
4. Copy connection string to `MONGODB_URI` in `.env`

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/msj-hackathon?retryWrites=true&w=majority
```

## 📝 Adding New Features

### 1. Create a Model

```javascript
// src/models/YourModel.js
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  // ... fields
}, { timestamps: true });

module.exports = mongoose.model('YourModel', schema);
```

### 2. Create Routes

```javascript
// src/routes/yourRoutes.js
const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Your endpoint
 *     tags: [YourTag]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', authenticate, async (req, res) => {
  // Your logic
});

module.exports = router;
```

### 3. Register Routes

```javascript
// src/routes/index.js
const yourRoutes = require('./yourRoutes');
router.use('/your-path', yourRoutes);
```

## 🔒 Security Features

- ✅ Helmet for security headers
- ✅ CORS configured
- ✅ Rate limiting on auth endpoints
- ✅ MongoDB query sanitization
- ✅ Input validation
- ✅ JWT with short expiration (15m)
- ✅ Passwords hashed with bcrypt
- ✅ No secrets in code (env variables)
- ✅ Error messages don't leak sensitive info

## 📚 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS, express-rate-limit, express-mongo-sanitize
- **Logging**: Pino with pino-http
- **Documentation**: Swagger/OpenAPI
- **Dev Tools**: Nodemon, ESLint, Prettier

## 🎯 Hackathon Tips

1. **Start with the template**: Clone this repo and you're ready to build features
2. **Use Swagger docs**: Share `/api-docs` URL with frontend team
3. **Add features incrementally**: Template handles auth, focus on your unique features
4. **Use MongoDB Atlas**: Free tier, no local setup needed
5. **Token in localStorage**: Frontend can store JWT in localStorage/sessionStorage
6. **Check logs**: `npm run dev` shows pretty logs for debugging

## 🔄 Token Refresh (Optional)

The User model includes `tokenVersion` field for refresh token rotation. To implement:

1. Create refresh token endpoint
2. Store refresh token securely (httpOnly cookie)
3. Increment `tokenVersion` on logout to invalidate all tokens
4. See `src/models/User.js` for `incrementTokenVersion()` method

## 🤝 Team Collaboration

### For Backend Developers
- Main logic in `src/routes/`
- Models in `src/models/`
- Use provided middleware for auth
- Add Swagger docs to new endpoints

### For Frontend Developers
1. Get API URL and `/api-docs` link
2. Register user → get token
3. Include token in headers: `Authorization: Bearer <token>`
4. Check Swagger for request/response formats

## 📖 Additional Resources

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [12-Factor App](https://12factor.net/)

## 📄 License

MIT

---

**Good luck at your hackathon! 🎉**

Built with ❤️ for rapid development
