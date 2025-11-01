# MSJ Hackathon API 🚀

A production-ready mobile backend with **6-digit code** email verification, authentication, and comprehensive security features.

## ✨ Features

### 🔐 Authentication System

- **6-Digit Email Verification**: Mobile-friendly codes instead of long tokens
- **JWT Authentication**: Secure token-based auth (15-min expiry)
- **Password Security**: bcrypt hashing, validation, secure updates
- **6-Digit Password Reset**: Reset codes expire in 10 minutes
- **Token Invalidation**: Logout invalidates all existing sessions
- **Rate Limiting**: 5 auth requests per 15 minutes (brute-force protection)

### 📧 Email System

- **Gmail SMTP**: Reliable email delivery
- **Beautiful HTML Templates**: Mobile-optimized with gradient design
- **Security Warnings**: Users notified about security events
- **Code Management**: Auto-expiry, one-time use, SHA-256 hashing

### 🛡️ Security

- **No Unverified Users**: Users only created after email verification
- **Pending Registrations**: In-memory storage (24h expiry)
- **Security Headers**: Helmet.js configured
- **CORS**: Configurable origins
- **Input Validation**: Express-validator on all endpoints
- **NoSQL Injection Prevention**: MongoDB sanitization

### 📚 API Documentation

- **Swagger UI**: Interactive docs at `/api-docs`
- **Complete Specs**: All endpoints documented with examples

### 📝 Logging & Monitoring

- **Structured Logging**: Pino with pretty-print in dev
- **Request Tracking**: Request ID, response time, error tracking
- **Production Ready**: Graceful shutdown, error handling

### 📦 Modern Stack

- **ES6 Modules**: `import/export` syntax
- **MVC Architecture**: Clean separation of concerns
- **MongoDB**: NoSQL database with Mongoose ODM

## 🚀 Quick Start

### Prerequisites

- Node.js v22.16.0+
- MongoDB 7.0+
- Gmail account with App Password

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure .env with your settings
```

### Environment Configuration

```env
# Server
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/msj-hackathon

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=15m

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# CORS
CORS_ORIGIN=*  # Change in production
```

### Running the Server

```bash
# Development
node src/server.js

# Or with Nodemon (if added)
npm run dev

# Production
NODE_ENV=production node src/server.js
```

The API will be available at:

- **API**: http://localhost:3001/api
- **Docs**: http://localhost:3001/api-docs
- **Health**: http://localhost:3001/api/health

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/                      # Configuration
│   │   ├── index.js                 # Environment config
│   │   ├── database.config.js       # MongoDB connection
│   │   ├── logger.config.js         # Pino logger
│   │   └── email.service.js         # Gmail SMTP service
│   ├── controllers/                 # Business logic
│   │   └── authController.js        # Authentication logic
│   ├── models/                      # Database models
│   │   └── user.model.js            # User schema
│   ├── middleware/                  # Express middleware
│   │   ├── auth.middleware.js       # JWT verification
│   │   ├── errorHandler.middleware.js  # Error handling
│   │   └── validator.middleware.js  # Input validation
│   ├── routes/                      # API routes
│   │   ├── index.js                 # Route aggregator
│   │   ├── auth.routes.js           # Auth endpoints
│   │   └── health.routes.js         # Health check
│   ├── docs/                        # API documentation
│   │   └── swagger.config.js        # Swagger/OpenAPI
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server entry point
├── .env                             # Environment variables
├── .env.example                     # Template
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication Flow

**Registration & Verification:**

1. `POST /api/auth/register` → Sends 6-digit code to email
2. `POST /api/auth/verify-email` → Verifies code, creates account
3. `POST /api/auth/login` → Login with credentials

**Password Reset:**

1. `POST /api/auth/forgot-password` → Sends 6-digit reset code
2. `POST /api/auth/reset-password` → Resets password with code

### Complete Endpoint List

| Method | Endpoint                        | Description              | Auth | Body                                              |
| ------ | ------------------------------- | ------------------------ | ---- | ------------------------------------------------- |
| POST   | `/api/auth/register`            | Send verification code   | No   | `{name, email, password}`                         |
| POST   | `/api/auth/verify-email`        | Verify & create account  | No   | `{email, code}`                                   |
| POST   | `/api/auth/resend-verification` | Resend verification code | No   | `{email}`                                         |
| POST   | `/api/auth/login`               | Login user               | No   | `{email, password}`                               |
| GET    | `/api/auth/me`                  | Get current user         | Yes  | -                                                 |
| POST   | `/api/auth/logout`              | Invalidate all tokens    | Yes  | -                                                 |
| PUT    | `/api/auth/update-password`     | Update password          | Yes  | `{currentPassword, newPassword, confirmPassword}` |
| POST   | `/api/auth/forgot-password`     | Send reset code          | No   | `{email}`                                         |
| POST   | `/api/auth/reset-password`      | Reset with code          | No   | `{code, password}`                                |
| GET    | `/api/health`                   | Health check             | No   | -                                                 |

### Example Requests

#### 1. Register (Sends 6-digit code to email)

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Response:
# {
#   "success": true,
#   "message": "Verification code sent! Please check your email..."
# }
```

#### 2. Verify Email (With 6-digit code from email)

```bash
curl -X POST http://localhost:3001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "code": "123456"
  }'

# Response:
# {
#   "success": true,
#   "message": "Email verified successfully! Your account has been created.",
#   "data": {
#     "user": {...},
#     "token": "eyJhbGc...",
#     "expiresIn": "15m"
#   }
# }
```

#### 3. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### 4. Get Profile (Authenticated)

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 5. Forgot Password (Sends 6-digit reset code)

```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

#### 6. Reset Password (With code from email)

```bash
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "code": "654321",
    "password": "NewSecurePass123"
  }'
```

## 🔧 Configuration

Key environment variables:

```env
# Server
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/msj-hackathon

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=15m

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# CORS (comma-separated)
CORS_ORIGIN=*

# Rate Limiting
AUTH_RATE_LIMIT_MAX_REQUESTS=5  # Auth endpoints
RATE_LIMIT_MAX_REQUESTS=100     # Other endpoints

# Logging
LOG_LEVEL=info
```

### � Gmail Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Go to App Passwords
   - Select "Mail" and device
   - Copy 16-character password
4. Add to `.env`:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
   ```

## 🗄️ Database Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Update .env
MONGODB_URI=mongodb://localhost:27017/msj-hackathon
```

### Option 2: MongoDB Atlas (Cloud)

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist IP: `0.0.0.0/0` (for development)
3. Create database user
4. Copy connection string to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/msj-hackathon
   ```

## � Security Best Practices

### ✅ Implemented

- **Helmet.js**: Security headers configured
- **CORS**: Properly configured (change `*` in production)
- **Rate Limiting**:
  - Auth endpoints: 5 requests/15min
  - Other endpoints: 100 requests/15min
- **Input Validation**: Express-validator on all inputs
- **NoSQL Injection Prevention**: MongoDB sanitization
- **Password Security**: bcrypt hashing (10 salt rounds)
- **JWT**: Short expiration (15min), token versioning
- **Email Verification**: Required before account creation
- **Code Security**: SHA-256 hashed, one-time use, auto-expiry
- **No Secrets in Code**: All config via environment variables

### 🚀 Production Checklist

- [ ] Change `CORS_ORIGIN` from `*` to specific domains
- [ ] Use strong `JWT_SECRET` (32+ characters, random)
- [ ] Use MongoDB Atlas instead of local database
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Regular security updates: `npm audit fix`
- [ ] Add database indexes for performance
- [ ] Replace in-memory Map with Redis for pending registrations
- [ ] Set up automated backups

## 📚 Tech Stack

- **Runtime**: Node.js v22.16.0
- **Framework**: Express.js
- **Database**: MongoDB 7.0+ with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer with Gmail SMTP
- **Validation**: Express-validator
- **Logging**: Pino
- **Security**: Helmet, CORS, express-rate-limit
- **Documentation**: Swagger/OpenAPI
- **Module System**: ES6 Modules (import/export)

## 🧪 Testing

```bash
# Test registration endpoint
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test1234"}'

# Check health
curl http://localhost:3001/api/health

# View API docs
open http://localhost:3001/api-docs
```

## 🐛 Troubleshooting

### Server won't start

```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

### MongoDB connection error

- Check MongoDB is running: `mongosh` or check Docker
- Verify `MONGODB_URI` in `.env`
- Check network/firewall settings

### Email not sending

- Verify Gmail credentials in `.env`
- Check App Password (not regular password)
- Enable 2FA on Google Account first
- Check spam folder

### JWT errors

- Token expired: Login again
- Invalid token: Check `JWT_SECRET` matches
- Token invalidated: User logged out or changed password

## 📖 Documentation

- **API Docs**: http://localhost:3001/api-docs (Swagger UI)
- **Health Check**: http://localhost:3001/api/health
- **Code Comments**: Comprehensive JSDoc comments throughout

## 🤝 Contributing

For hackathon teammates:

1. Pull latest: `git pull origin main`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Test locally: `npm run lint` (if available)
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/your-feature`
6. Create PR on GitHub

## � License

MIT License - See LICENSE file

---

**Built for MSJ Hackathon 2025** 🚀

For questions or issues, check the Swagger docs at `/api-docs` or contact the team.
