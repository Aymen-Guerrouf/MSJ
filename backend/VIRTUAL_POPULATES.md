# Virtual Populates Implementation

## Overview

Added virtual populate relationships to the Center model to allow fetching a center with all its related data (clubs, events, workshops) in a single query.

## Changes Made

### 1. Center Model (`src/models/center.model.js`)

Added three virtual populate fields:

- **`clubs`**: All clubs belonging to the center
- **`events`**: All events belonging to the center
- **`workshops`**: All workshops belonging to the center

The schema now includes virtuals in JSON/Object conversion:

```javascript
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
```

### 2. Center Controller (`src/controllers/centerController.js`)

Updated both `getAllCenters` and `getCenterById` to support optional population via query parameters.

**Query Parameter: `include`**

- Comma-separated list of relations to include
- Supported values: `clubs`, `events`, `workshops`, `all`
- Example: `?include=clubs,events` or `?include=all`

### 3. Swagger Documentation (`src/routes/center.routes.js`)

Updated API documentation to include the new query parameter with examples.

## API Usage Examples

### Get a center with clubs and events

```
GET /api/centers/:id?include=clubs,events
```

Response includes:

```json
{
  "success": true,
  "data": {
    "center": {
      "_id": "...",
      "name": "Center Name",
      "wilaya": "Algiers",
      // ... other center fields
      "clubs": [
        {
          "_id": "...",
          "name": "Club Name",
          "category": "tech"
          // ... club fields
        }
      ],
      "events": [
        {
          "_id": "...",
          "title": "Event Title",
          "category": "coding"
          // ... event fields
        }
      ]
    }
  }
}
```

### Get all centers with everything

```
GET /api/centers?include=all
```

Includes: clubs, events, and workshops for each center.

### Get only events for a center

```
GET /api/centers/:id?include=events
```

### Get only workshops for a center

```
GET /api/centers/:id?include=workshops
```

### Get center without related data (default)

```
GET /api/centers/:id
```

Returns only the center data with populated adminIds.

## Benefits

1. **Reduced API Calls**: Fetch a center with all related data in one request instead of multiple requests
2. **Flexible**: Choose exactly what data to include
3. **Performance**: Optional population means no overhead when not needed
4. **Separate Collections**: Events and workshops have their own models and collections
5. **Frontend-Friendly**: Makes it easier to build comprehensive center detail pages

## Technical Details

- Uses Mongoose virtual populate feature
- No changes to database schema or indexes required
- Maintains backward compatibility (virtuals are optional)
- Works with existing foreign key relationships (centerId field in Club, Event, Workshop models)
- Events and Workshops are separate models with independent collections

## Testing

To test the implementation:

1. Create a center
2. Create clubs, events, and workshops linked to that center
3. Test different include combinations:
   - `GET /api/centers/:id?include=clubs`
   - `GET /api/centers/:id?include=events`
   - `GET /api/centers/:id?include=workshops`
   - `GET /api/centers/:id?include=events,workshops`
   - `GET /api/centers/:id?include=all`
4. Verify the JSON response includes the populated data
5. Test without include parameter to ensure default behavior works
