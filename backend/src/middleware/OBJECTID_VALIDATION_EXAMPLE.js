// EXAMPLE: How to use the new ObjectId validation middleware

import { validateObjectId, validateObjectIds } from '../middleware/security.middleware.js';

// Example 1: Validate single ObjectId in URL params
router.get('/events/:id', validateObjectId(), getEventById);
router.put('/events/:id', authenticate, isCenterAdmin, validateObjectId(), updateEvent);
router.delete('/events/:id', authenticate, isCenterAdmin, validateObjectId(), deleteEvent);

// Example 2: Validate ObjectIds in request body
router.post(
  '/events',
  authenticate,
  isCenterAdmin,
  validateObjectIds('centerId', 'createdBy'), // Validates multiple fields
  createEvent
);

// Example 3: Custom param name
router.get('/centers/:centerId/events', validateObjectId('centerId'), getCenterEvents);

// The middleware will automatically return 400 Bad Request if ObjectId is invalid:
// {
//   "success": false,
//   "message": "Invalid ID format"
// }
