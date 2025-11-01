# New Participation System - API Documentation

## Overview

The participation system has been restructured into three separate systems:

1. **Event Registrations** - Users register/participate in events (free)
2. **Workshop Enrollments** - Users enroll in workshops (may have price/payment)
3. **Club Memberships** - Users join clubs as members

---

## 🎉 Event Registrations

### Register for an Event

```http
POST /api/event-registrations
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventId": "674a1b2c3d4e5f6g7h8i9j0k",
  "fullName": "John Doe",
  "phone": "+213 555 123 456",
  "age": 25
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully registered for event",
  "data": {
    "registration": {
      "_id": "...",
      "userId": "...",
      "eventId": {
        "_id": "...",
        "title": "Hackathon Junior",
        "date": "2025-12-14T10:00:00.000Z",
        "category": "coding"
      },
      "fullName": "John Doe",
      "phone": "+213 555 123 456",
      "age": 25,
      "status": "confirmed",
      "createdAt": "..."
    }
  }
}
```

### Get My Event Registrations

```http
GET /api/event-registrations/my
Authorization: Bearer <token>
```

### Cancel Event Registration

```http
PUT /api/event-registrations/{registrationId}/cancel
Authorization: Bearer <token>
```

### Get All Event Registrations (Admin Only)

```http
GET /api/event-registrations?eventId=...&status=confirmed
Authorization: Bearer <token>
```

### Delete Event Registration (Admin Only)

```http
DELETE /api/event-registrations/{registrationId}
Authorization: Bearer <token>
```

---

## 🎓 Workshop Enrollments

### Enroll in a Workshop

```http
POST /api/workshop-enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "workshopId": "674a1b2c3d4e5f6g7h8i9j0k",
  "fullName": "John Doe",
  "phone": "+213 555 123 456",
  "age": 25
}
```

**Response (Free Workshop):**

```json
{
  "success": true,
  "message": "Successfully enrolled in workshop",
  "data": {
    "enrollment": {
      "_id": "...",
      "userId": "...",
      "workshopId": {
        "_id": "...",
        "title": "Digital Photography Basics",
        "price": 0,
        "date": "2025-12-10T10:00:00.000Z"
      },
      "fullName": "John Doe",
      "phone": "+213 555 123 456",
      "age": 25,
      "paymentStatus": "paid",
      "status": "confirmed",
      "createdAt": "..."
    }
  }
}
```

**Response (Paid Workshop):**

```json
{
  "success": true,
  "message": "Enrollment created. Please complete payment to confirm.",
  "data": {
    "enrollment": {
      "_id": "...",
      "workshopId": {
        "title": "Photography Workshop",
        "price": 1500
      },
      "paymentStatus": "pending",  // ← Payment required
      "status": "pending",  // ← Will be confirmed after payment
      ...
    }
  }
}
```

### Get My Workshop Enrollments

```http
GET /api/workshop-enrollments/my
Authorization: Bearer <token>
```

### Cancel Workshop Enrollment

```http
PUT /api/workshop-enrollments/{enrollmentId}/cancel
Authorization: Bearer <token>
```

### Update Payment Status (Admin Only)

```http
PUT /api/workshop-enrollments/{enrollmentId}/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentStatus": "paid"  // pending | paid | refunded
}
```

### Get All Workshop Enrollments (Admin Only)

```http
GET /api/workshop-enrollments?workshopId=...&paymentStatus=paid
Authorization: Bearer <token>
```

### Delete Workshop Enrollment (Admin Only)

```http
DELETE /api/workshop-enrollments/{enrollmentId}
Authorization: Bearer <token>
```

---

## 🏆 Club Memberships

### Join a Club

```http
POST /api/club-memberships/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "clubId": "674a1b2c3d4e5f6g7h8i9j0k"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully joined club",
  "data": {
    "membership": {
      "_id": "...",
      "userId": "...",
      "clubId": {
        "_id": "...",
        "name": "Coding Club",
        "category": "tech",
        "description": "..."
      },
      "role": "member", // member | moderator | leader
      "status": "active",
      "joinedAt": "2025-11-01T10:00:00.000Z"
    }
  }
}
```

### Leave a Club

```http
DELETE /api/club-memberships/leave/{clubId}
Authorization: Bearer <token>
```

### Get My Club Memberships

```http
GET /api/club-memberships/my
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": {
    "memberships": [
      {
        "_id": "...",
        "clubId": {
          "name": "Coding Club",
          "category": "tech",
          "description": "...",
          "images": ["..."]
        },
        "role": "member",
        "status": "active",
        "joinedAt": "..."
      }
    ]
  }
}
```

### Get Club Members (Public)

```http
GET /api/club-memberships/club/{clubId}/members?status=active
```

### Update Member Role (Admin Only)

```http
PUT /api/club-memberships/{membershipId}/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "moderator"  // member | moderator | leader
}
```

### Update Member Status (Admin Only)

```http
PUT /api/club-memberships/{membershipId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "banned"  // pending | active | inactive | banned
}
```

### Remove Member (Admin Only)

```http
DELETE /api/club-memberships/{membershipId}
Authorization: Bearer <token>
```

### Get All Club Memberships (Admin Only)

```http
GET /api/club-memberships?clubId=...&status=active&role=member
Authorization: Bearer <token>
```

---

## 📊 Data Models

### Event Registration

```typescript
{
  _id: string;
  userId: string; // Reference to User
  eventId: string; // Reference to Event
  fullName: string;
  phone: string;
  age: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### Workshop Enrollment

```typescript
{
  _id: string;
  userId: string; // Reference to User
  workshopId: string; // Reference to Workshop
  fullName: string;
  phone: string;
  age: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### Club Membership

```typescript
{
  _id: string;
  userId: string; // Reference to User
  clubId: string; // Reference to Club
  role: 'member' | 'moderator' | 'leader';
  status: 'pending' | 'active' | 'inactive' | 'banned';
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎯 Frontend Implementation Examples

### React/React Native - Event Registration

```javascript
// Register for an event
const registerForEvent = async (eventId) => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await fetch('http://localhost:3000/api/event-registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId: eventId,
        fullName: user.name, // Or let user edit
        phone: user.phone || '+213 555 000 000',
        age: user.age || 25,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('Registered!', data.data.registration);
      // Show success message
    } else {
      console.error('Failed:', data.message);
      // Show error message
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Get my registrations
const getMyRegistrations = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/api/event-registrations/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.data.registrations;
};

// Cancel registration
const cancelRegistration = async (registrationId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(
    `http://localhost:3000/api/event-registrations/${registrationId}/cancel`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.success;
};
```

### Workshop Enrollment

```javascript
// Enroll in workshop
const enrollInWorkshop = async (workshopId) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const response = await fetch('http://localhost:3000/api/workshop-enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      workshopId: workshopId,
      fullName: user.name,
      phone: user.phone || '+213 555 000 000',
      age: user.age || 25,
    }),
  });

  const data = await response.json();

  if (data.success) {
    const enrollment = data.data.enrollment;

    // Check if payment is required
    if (enrollment.paymentStatus === 'pending') {
      console.log('Payment required:', enrollment.workshopId.price, 'DZD');
      // Navigate to payment screen
    } else {
      console.log('Enrolled successfully!');
    }
  }
};
```

### Club Membership

```javascript
// Join club
const joinClub = async (clubId) => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/api/club-memberships/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ clubId }),
  });

  const data = await response.json();
  return data.success;
};

// Get my clubs
const getMyClubs = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/api/club-memberships/my', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.data.memberships;
};

// Leave club
const leaveClub = async (clubId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:3000/api/club-memberships/leave/${clubId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.success;
};
```

---

## 🔑 Key Differences from Old System

| Feature       | Old (Participation)        | New System                                            |
| ------------- | -------------------------- | ----------------------------------------------------- |
| **Events**    | `/api/participations`      | `/api/event-registrations`                            |
| **Workshops** | `/api/participations`      | `/api/workshop-enrollments`                           |
| **Clubs**     | Manual array in Club model | `/api/club-memberships`                               |
| **Payment**   | No payment tracking        | Workshop enrollments have `paymentStatus`             |
| **Roles**     | No roles                   | Club memberships have roles (member/moderator/leader) |
| **Status**    | Single status field        | Separate status + paymentStatus for workshops         |

---

## ✅ Benefits

1. **Clearer separation** - Each type of participation has its own endpoint
2. **Better payment tracking** - Workshops have dedicated payment status
3. **Club roles** - Members can have different roles (member, moderator, leader)
4. **Simpler queries** - No need to filter by activityType
5. **Type safety** - Frontend can have separate interfaces for each type

---

## 🚀 Migration Notes

The old `/api/participations` endpoint still exists but is **deprecated**. All new code should use:

- `/api/event-registrations` for events
- `/api/workshop-enrollments` for workshops
- `/api/club-memberships` for clubs

Collections in MongoDB:

- `eventregistrations`
- `workshopenrollments`
- `clubmemberships`
