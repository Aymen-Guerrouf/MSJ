<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

# MSJ Platform

<em>Empowering Youth Innovation & Accelerating Impact Globally</em>

<!-- BADGES -->
<img src="https://img.shields.io/github/last-commit/Aymen-Guerrouf/MSJ?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/Aymen-Guerrouf/MSJ?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/Aymen-Guerrouf/MSJ?style=flat&color=0080ff" alt="repo-language-count">

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=MongoDB&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/Mongoose-F04D35.svg?style=flat&logo=Mongoose&logoColor=white" alt="Mongoose">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/React%20Native-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React Native">
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/JWT-000000.svg?style=flat&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
<br>
<img src="https://img.shields.io/badge/Cloudinary-3448C5.svg?style=flat&logo=Cloudinary&logoColor=white" alt="Cloudinary">
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Expo-000020.svg?style=flat&logo=Expo&logoColor=white" alt="Expo">
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4.svg?style=flat&logo=Tailwind-CSS&logoColor=white" alt="TailwindCSS">
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black" alt="Prettier">

</div>
<br>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [User Model - Technical Specification](#user-model---technical-specification)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 Overview

**MSJ** is a comprehensive youth innovation and mentorship platform that connects aspiring entrepreneurs, mentors, and supervisors. The platform facilitates startup ideation, mentorship programs, community engagement through clubs/events, and provides AI-powered recommendations for personalized experiences.

### 🌟 Why MSJ?

- 🚀 **Youth Empowerment:** Connect young innovators with experienced mentors and supervisors
- 💡 **Startup Ecosystem:** Share ideas, find co-founders, and get expert guidance
- 🤝 **Mentorship System:** Dual-track mentorship for both personal development and startup supervision
- 🏢 **Youth Centers:** Multi-tenant system supporting multiple youth centers
- 📊 **AI-Powered:** Personalized recommendations using Recombee
- 🎓 **Learning Hub:** Clubs, workshops, and events for skill development
- 🔐 **Enterprise-Grade Security:** JWT authentication, role-based access, email verification

---

## 🚀 Core Features

### 👥 User Management System

#### **Three User Roles:**

1. **Standard Users**
   - Join clubs, events, and workshops
   - Submit startup ideas
   - Request mentorship
   - Become mentors or supervisors

2. **Center Admins**
   - Manage a specific youth center
   - Create and moderate activities (clubs, events, workshops)
   - Review and approve memberships

3. **Super Admins**
   - Full platform access
   - Manage all centers
   - System-wide configurations

### 🎓 Dual Mentorship System

#### **Personal Mentorship**
- **17 Expertise Areas:** Football, Basketball, Chess, Coding, Arts, Music, Tech, Entrepreneurship, and more
- **Mentor Profiles:** Bio, expertise, and availability
- **Request System:** Send and manage mentorship requests
- **Matching Algorithm:** AI-powered mentor recommendations

#### **Startup Supervision**
- **26 Business Domains:** Software Development, AI/ML, Business Development, Fundraising, Marketing, Product Management, and more
- **Supervisor Profiles:** Professional title, bio, and expertise
- **Project Requests:** Connect entrepreneurs with experienced supervisors
- **Domain-Specific Guidance:** Industry-specific expertise matching

### 🏢 Youth Centers & Activities

- **Multi-Center Support:** Platform supports multiple youth centers
- **Clubs:** Recurring interest-based communities with membership management
- **Events:** One-time activities with registration system
- **Workshops:** Skill-building sessions with enrollment tracking
- **Resource Management:** Schedules, capacities, and prerequisites

### 🤖 AI & Recommendations

- **Recombee Integration:** Personalized activity recommendations
- **User Behavior Tracking:** Interaction-based suggestions
- **Interest Matching:** Connect users with relevant content
- **Smart Discovery:** Find mentors, supervisors, and activities

### 🔐 Security Features

- **JWT Authentication:** Access & refresh token system with rotation
- **Email Verification:** 6-digit code with 24-hour expiry
- **Password Reset:** Secure 6-digit code with 10-minute expiry
- **Token Versioning:** Instant revocation of all user tokens
- **Role-Based Access Control (RBAC)**
- **Data Sanitization:** Protection against NoSQL injection
- **Rate Limiting:** API abuse prevention

---

## 🏗️ Architecture

### Backend Stack

```
Backend (Node.js + Express)
├── Authentication & Authorization (JWT)
├── MongoDB + Mongoose ODM
├── RESTful API with Swagger Documentation
├── AI Services (Recombee, Hugging Face)
├── Media Management (Cloudinary)
├── Email Service (Nodemailer)
└── Logging (Pino)
```

### Frontend Stack

```
Frontend
├── Web App (React + Vite + TypeScript)
│   ├── TailwindCSS
│   ├── Material-UI (MUI)
│   └── React Hook Form
└── Mobile App (React Native + Expo)
    ├── TypeScript
    ├── React Navigation
    └── Expo modules
```

### Database Schema Overview

```
Collections:
├── Users (Authentication, Roles, Profiles)
├── Centers (Youth Center Management)
├── Clubs (Recurring Activities)
├── Events (One-time Activities)
├── Workshops (Skill-building Sessions)
├── StartupIdeas (Innovation Projects)
├── MentorshipRequests (Personal Mentorship)
├── ProjectRequests (Startup Supervision)
├── ClubMemberships
├── EventRegistrations
└── WorkshopEnrollments
```

---

## 👤 User Model - Technical Specification

### 📊 Schema Overview

The User model is the central schema managing all user types: standard users, mentors, supervisors, center admins, and super admins.

### 🔑 Core Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | String | ✅ | Unique, lowercase, validated email |
| `password` | String | ✅ | Min 6 chars, bcrypt hashed (salt: 10) |
| `name` | String | ✅ | Full name |
| `phone` | String | ❌ | Contact number |
| `age` | Number | ✅* | Age 13-120 (*Not required for admins) |
| `interests` | String[] | ❌ | User interests (17 options) |
| `role` | String | ✅ | `user` \| `center_admin` \| `super_admin` |

### 🎓 Mentorship Fields

| Field | Type | Description |
|-------|------|-------------|
| `isMentor` | Boolean | Enables mentor status |
| `mentorBio` | String | Max 500 characters |
| `mentorExpertise` | String[] | 17 expertise areas |

**Mentor Expertise Options:**
```javascript
[
  'football', 'basketball', 'volleyball', 'chess',
  'arts', 'music', 'theatre', 'coding', 'gaming',
  'education', 'volunteering', 'culture', 'tech',
  'health', 'entrepreneurship', 'design', 'marketing', 'other'
]
```

### 🚀 Supervision Fields (Startup Projects)

| Field | Type | Description |
|-------|------|-------------|
| `isSupervisor` | Boolean | Enables supervisor status |
| `supervisorTitle` | String | Professional title (e.g., "CEO at StartupX") |
| `supervisorBio` | String | Max 500 characters |
| `supervisorExpertise` | String[] | 26 business/tech domains |

**Supervisor Expertise Categories:**

**Business & Strategy:**
- Business Development, Strategic Planning, Operations Management, Legal & Compliance, Entrepreneurship

**Technology:**
- Software Development, AI & ML, Data Science, Hardware & IoT, Cybersecurity, Cloud Computing

**Finance:**
- Finance & Accounting, Fundraising & VC, Fintech

**Marketing & Sales:**
- Digital Marketing, Sales Strategy, Branding & PR

**Product & Design:**
- Product Management, UI/UX Design, Industrial Design

**Industry-Specific:**
- E-commerce, Healthtech, EdTech, Greentech, AgriTech

**People:**
- Human Resources, Other

### 🔐 Security Fields

| Field | Type | Description |
|-------|------|-------------|
| `tokenVersion` | Number | Increment to invalidate all tokens |
| `isEmailVerified` | Boolean | Email verification status |
| `emailVerificationCode` | String | SHA256 hashed 6-digit code (24h expiry) |
| `resetPasswordCode` | String | SHA256 hashed 6-digit code (10min expiry) |

### 🔗 Virtual Relationships

```javascript
// Activities
user.myClubs           // ClubMembership[]
user.myEvents          // EventRegistration[]
user.myWorkshops       // WorkshopEnrollment[]

// Startups
user.myStartupIdeas    // StartupIdea[] (as owner)
user.supervisedProjects // StartupIdea[] (as supervisor)

// Mentorship
user.mentorshipRequests    // MentorshipRequest[] (received as mentor)
user.myMentorshipRequests  // MentorshipRequest[] (sent as mentee)

// Supervision
user.projectRequests       // ProjectRequest[] (received as supervisor)
user.myProjectRequests     // ProjectRequest[] (sent as entrepreneur)
```

### 🛠️ Instance Methods

#### `comparePassword(candidatePassword)`
```javascript
const isValid = await user.comparePassword('password123');
```

#### `incrementTokenVersion()`
```javascript
// Revokes all active JWT tokens
await user.incrementTokenVersion();
```

#### `createPasswordResetCode()`
```javascript
const resetCode = user.createPasswordResetCode();
await user.save();
// Send resetCode via email (6-digit, 10min expiry)
```

#### `createEmailVerificationCode()`
```javascript
const verificationCode = user.createEmailVerificationCode();
await user.save();
// Send verificationCode via email (6-digit, 24h expiry)
```

#### `toJSON()`
```javascript
// Automatically removes sensitive fields
const safeUser = user.toJSON();
// Removed: password, tokenVersion, verification codes, __v
```

### 📝 Usage Examples

#### Create Standard User
```javascript
const user = new User({
  email: 'john@example.com',
  password: 'securePass123',
  name: 'John Doe',
  age: 25,
  interests: ['coding', 'gaming', 'tech']
});
await user.save();
```

#### Create Mentor
```javascript
const mentor = new User({
  email: 'mentor@example.com',
  password: 'securePass123',
  name: 'Jane Smith',
  age: 30,
  isMentor: true,
  mentorBio: 'Experienced software engineer with 10 years in the industry',
  mentorExpertise: ['coding', 'tech', 'entrepreneurship']
});
await mentor.save();
```

#### Create Supervisor
```javascript
const supervisor = new User({
  email: 'supervisor@example.com',
  password: 'securePass123',
  name: 'Alex Johnson',
  age: 35,
  isSupervisor: true,
  supervisorTitle: 'CEO at TechStartup',
  supervisorBio: 'Serial entrepreneur with 3 successful exits',
  supervisorExpertise: ['Business Development', 'Fundraising & VC', 'Product Management']
});
await supervisor.save();
```

#### Verify Password & Login
```javascript
const user = await User.findOne({ email: 'john@example.com' }).select('+password');
const isValid = await user.comparePassword('securePass123');
if (isValid) {
  // Generate JWT tokens
}
```

#### Password Reset Flow
```javascript
const user = await User.findOne({ email: 'john@example.com' });
const resetCode = user.createPasswordResetCode();
await user.save();
// Email resetCode to user (expires in 10 minutes)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v18+ (v22.16.0 recommended)
- **MongoDB:** v5.0+
- **Package Manager:** npm or yarn
- **Cloudinary Account** (for media uploads)
- **SMTP Service** (Gmail recommended for emails)

### Environment Variables

Create `.env` files in both `backend/` and `Frontend/msj-app/`:

#### Backend `.env`
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/msj

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=noreply@msjplatform.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Recombee (AI Recommendations)
RECOMBEE_DATABASE_ID=your_database_id
RECOMBEE_PRIVATE_TOKEN=your_private_token

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Aymen-Guerrouf/MSJ
cd MSJ
```

2. **Install Backend Dependencies:**
```bash
cd backend
npm install
```

3. **Install Web Frontend Dependencies:**
```bash
cd ../web/my-vite-app
npm install
```

4. **Install Mobile App Dependencies:**
```bash
cd ../../Frontend/msj-app
npm install
```

### Running the Application

#### Start Backend Server
```bash
cd backend
npm run dev  # Development with nodemon
# or
npm start    # Production
```
Server runs on: `http://localhost:3000`

#### Start Web App
```bash
cd web/my-vite-app
npm run dev
```
Web app runs on: `http://localhost:5173`

#### Start Mobile App
```bash
cd Frontend/msj-app
npm start
```
Follow Expo CLI instructions to run on iOS/Android

### Database Setup

#### Create Admin User (via MongoDB shell)
```javascript
db.users.insertOne({
  email: "admin@msj.com",
  password: "$2b$10$hashedPasswordHere", // Hash with bcrypt
  name: "Super Admin",
  role: "super_admin",
  isEmailVerified: true,
  createdAt: new Date()
});
```

---

## 📚 API Documentation

### API Endpoints Overview

#### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with code

#### **Users**
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/mentors` - Get all mentors
- `GET /api/users/supervisors` - Get all supervisors

#### **Centers**
- `GET /api/centers` - Get all centers
- `POST /api/centers` - Create center (super_admin)
- `GET /api/centers/:id` - Get center details
- `PUT /api/centers/:id` - Update center (admin)

#### **Clubs**
- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create club (admin)
- `GET /api/clubs/:id` - Get club details
- `POST /api/clubs/:id/join` - Join club
- `DELETE /api/clubs/:id/leave` - Leave club

#### **Events**
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/unregister` - Cancel registration

#### **Workshops**
- `GET /api/workshops` - Get all workshops
- `POST /api/workshops` - Create workshop (admin)
- `POST /api/workshops/:id/enroll` - Enroll in workshop

#### **Startup Ideas**
- `GET /api/startups` - Get all ideas
- `POST /api/startups` - Submit idea
- `GET /api/startups/:id` - Get idea details
- `PUT /api/startups/:id` - Update idea (owner)

#### **Mentorship**
- `POST /api/mentorship/request` - Send mentorship request
- `GET /api/mentorship/requests` - Get my requests
- `PUT /api/mentorship/requests/:id` - Accept/reject request

#### **Supervision**
- `POST /api/supervision/request` - Request supervisor
- `GET /api/supervision/requests` - Get my requests
- `PUT /api/supervision/requests/:id` - Accept/reject request

### Swagger Documentation

Full interactive API documentation available at:
```
http://localhost:3000/api-docs
```

---

## 📁 Project Structure

```
MSJ/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── services/          # Business logic (email, AI, etc.)
│   │   ├── config/            # Configuration files
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Express app setup
│   ├── package.json
│   └── .env
│
├── web/
│   └── my-vite-app/
│       ├── src/
│       │   ├── components/    # Reusable React components
│       │   ├── pages/         # Page components
│       │   ├── hooks/         # Custom React hooks
│       │   ├── services/      # API calls
│       │   ├── context/       # React Context
│       │   └── App.tsx        # Main app component
│       ├── package.json
│       └── vite.config.ts
│
├── Frontend/
│   └── msj-app/
│       ├── src/
│       │   ├── components/    # React Native components
│       │   ├── screens/       # App screens
│       │   ├── navigation/    # Navigation setup
│       │   ├── services/      # API integration
│       │   └── App.tsx
│       ├── package.json
│       └── app.json
│
└── LICENSE
```

---

## 🔒 Security

### Authentication Flow

```
1. User Registration
   ↓
2. Email Verification (6-digit code, 24h expiry)
   ↓
3. Login (email + password)
   ↓
4. JWT Token Pair
   - Access Token (15min, stored in memory)
   - Refresh Token (7 days, httpOnly cookie)
   ↓
5. Token Refresh (before expiry)
   ↓
6. Logout (invalidate refresh token)
```

### Security Features

- ✅ **bcrypt Password Hashing** (10 salt rounds)
- ✅ **JWT Token Rotation** (short-lived access tokens)
- ✅ **Token Versioning** (instant revocation)
- ✅ **Email Verification** (SHA256 hashed codes)
- ✅ **Rate Limiting** (prevent brute force)
- ✅ **NoSQL Injection Protection** (express-mongo-sanitize)
- ✅ **XSS Protection** (Helmet middleware)
- ✅ **CORS Configuration** (whitelist origins)
- ✅ **Secure Cookies** (httpOnly, secure, sameSite)

### Role-Based Access Control

```javascript
// Example: Only admins can create clubs
router.post('/clubs', 
  authenticate,              // Verify JWT
  authorize('center_admin', 'super_admin'), // Check role
  validateClubData,          // Validate input
  createClub                 // Controller
);
```

---

## 🛠️ Development

### Code Quality Tools

- **ESLint:** Code linting with recommended rules
- **Prettier:** Code formatting (.prettierrc configured)
- **TypeScript:** Type safety in frontend
- **Nodemon:** Auto-restart on backend changes
- **Vite:** Fast frontend builds with HMR

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention

```
feat: New feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
test: Adding tests
chore: Maintenance tasks
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd web/my-vite-app
npm test

# Mobile app tests
cd Frontend/msj-app
npm test
```

---

## 🗺️ Roadmap

### Phase 1: Core Platform ✅
- [x] User authentication & authorization
- [x] User profiles (mentors & supervisors)
- [x] Centers, clubs, events, workshops
- [x] Startup ideas submission
- [x] Mentorship request system
- [x] Project supervision system

### Phase 2: AI & Recommendations 🚧
- [x] Recombee integration
- [ ] Advanced recommendation algorithms
- [ ] Mentor/supervisor matching AI
- [ ] Content personalization

### Phase 3: Enhanced Features 📋
- [ ] Real-time chat (Socket.io)
- [ ] Video conferencing integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app push notifications
- [ ] Payment integration for premium features
- [ ] Gamification (badges, points, leaderboards)

### Phase 4: Scalability 🔮
- [ ] Microservices architecture
- [ ] Redis caching layer
- [ ] GraphQL API
- [ ] Multi-language support (i18n)
- [ ] Advanced reporting & exports

---

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, or documentation improvements.

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click 'Fork' on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MSJ
   cd MSJ
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

5. **Commit Your Changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Describe your changes in detail

### Contribution Guidelines

- ✅ Follow the existing code style
- ✅ Write meaningful commit messages
- ✅ Add tests for new features
- ✅ Update documentation
- ✅ Keep PRs focused and small
- ✅ Be respectful and collaborative

### Code Review Process

1. Automated checks (linting, tests)
2. Manual code review by maintainers
3. Feedback and requested changes
4. Approval and merge

---

## 📞 Support & Community

- **💬 [Discussions](https://github.com/Aymen-Guerrouf/MSJ/discussions)**: Ask questions, share ideas
- **🐛 [Issues](https://github.com/Aymen-Guerrouf/MSJ/issues)**: Report bugs, request features
- **📧 Email:** support@msjplatform.com
- **📖 [Wiki](https://github.com/Aymen-Guerrouf/MSJ/wiki)**: Detailed guides and tutorials

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## � Core Team

### Development Team

- **Aymen Guerrouf** - Backend Developer
  - Core backend architecture and API development
  - Database design and optimization
  - Authentication & security implementation

- **Chaker Lousra** - Frontend Developer
  - React web application development
  - React Native mobile app development
  - UI implementation and user experience

- **Ilyes Mekhalfa** - AI Engineer
  - AI integration and recommendations system
  - Machine learning model implementation
  - Data analysis and optimization

- **Kosy Metlouf** - UI/UX Designer
  - User interface design
  - User experience research
  - Design system and branding

---

## �🙏 Acknowledgments

- **MongoDB** for the robust database
- **Express.js** for the excellent web framework
- **React & React Native** for the powerful UI libraries
- **Cloudinary** for media management
- **Recombee** for AI-powered recommendations
- **All Contributors** for making this project better

---

## 📊 Project Statistics

- **Total Lines of Code:** 50,000+
- **API Endpoints:** 80+
- **Database Collections:** 15+
- **Supported Expertise Areas:** 43
- **Active Contributors:** Growing

---

<div align="center">

**Made with ❤️ by the MSJ Team**

[⬆ Back to Top](#top)

</div>
