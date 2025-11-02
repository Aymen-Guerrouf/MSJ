# Experience Sharing Feature

## Overview

The Experience Sharing feature allows users to share their personal experiences and learn from others' journeys through sessions and experience cards.

## Backend API

### Experience Sessions

Represents scheduled sessions where people share their experiences.

**Endpoints:**

- `GET /api/experience-sessions` - List all sessions (supports filtering by centerId, tag)
- `GET /api/experience-sessions/:id` - Get single session details
- `POST /api/experience-sessions` - Create new session (Admin only)

**Model Fields:**

- `title` - Session title
- `description` - Session description
- `date` - Session date (YYYY-MM-DD)
- `time` - Session time (HH:MM)
- `tag` - Category tag (e.g., Technology, Career, Education)
- `centerId` - Reference to Center
- `createdBy` - Reference to User who created it

### Experience Cards

Represents archived experiences with lessons learned.

**Endpoints:**

- `GET /api/experience-cards` - List all cards (supports filtering by centerId, tag, sessionId)
- `GET /api/experience-cards/:id` - Get single card details
- `POST /api/experience-cards` - Create new card (Admin only)

**Model Fields:**

- `title` - Experience title
- `summary` - Experience summary (max 800 chars)
- `lessons` - Array of key lessons learned
- `tag` - Category tag
- `centerId` - Reference to Center
- `sessionId` - Optional reference to Experience Session
- `createdBy` - Reference to User who created it

## Frontend Integration

### SharingExperiencesScreen

Located at: `Frontend/msj-app/src/Home/screens/Spaces/SharingExperiencesScreen.jsx`

**Features:**

- Two tabs: "Upcoming" (future sessions) and "Archive" (past experience cards)
- Pull-to-refresh functionality
- Empty states for when no data is available
- Loading states
- Displays sessions with date countdown ("Today", "Tomorrow", "In X days")
- Shows experience cards with lessons count
- Supports Arabic content

**API Endpoints Used:**

- `API_ENDPOINTS.EXPERIENCE.SESSIONS` - Fetches all sessions
- `API_ENDPOINTS.EXPERIENCE.CARDS` - Fetches all experience cards

## Seeding Sample Data

To populate the database with sample experience data (including Arabic content):

```bash
cd backend
node src/scripts/runSeedExperience.js
```

This will create:

- 5 upcoming sessions
- 3 past sessions
- 5 experience cards (some linked to sessions)

Sample data includes bilingual content (English and Arabic) covering topics like:

- Entrepreneurship
- Technology/Programming
- Career Development
- Education/Scholarships
- Personal Growth
- Leadership
- Remote Work

## Tags/Categories

- Technology
- Career
- Education
- Entrepreneurship
- Personal Growth
- Leadership
- Design

## Notes

- Sessions are automatically categorized as "upcoming" or "past" based on their date
- Experience cards can be linked to a session or standalone
- All endpoints require authentication
- Only center admins can create sessions and cards
