# How to Fetch Centers with Clubs, Events, and Workshops

## The API is Working! ✅

Your center model **already has** virtual populates for clubs, events, and workshops. You just need to use the `include` query parameter when fetching centers.

## API Endpoints

### Fetch All Centers with Everything

```bash
GET http://localhost:3030/api/centers?include=all
```

This will return centers with:

- `clubs[]` - Array of clubs at this center
- `events[]` - Array of events at this center
- `workshops[]` - Array of workshops at this center

### Fetch Centers with Specific Relations

```bash
# Only clubs and events
GET http://localhost:3030/api/centers?include=clubs,events

# Only workshops
GET http://localhost:3030/api/centers?include=workshops

# Clubs and workshops
GET http://localhost:3030/api/centers?include=clubs,workshops
```

## Example Response Structure

```json
{
  "success": true,
  "data": {
    "centers": [
      {
        "_id": "69062ac3ce522c921c984ec4",
        "name": "Maison de Jeunes Alger Centre",
        "wilaya": "Alger",
        "latitude": 36.7732,
        "longitude": 3.0587,
        "address": "Rue Didouche Mourad, Alger",
        "phone": "+213 21 00 00 00",
        "clubs": [
          {
            "_id": "69062ac3ce522c921c984ec7",
            "name": "Coding Club",
            "category": "tech",
            "description": "Learn programming and build amazing projects together",
            "images": ["https://..."]
          },
          {
            "_id": "69062ac3ce522c921c984eca",
            "name": "Music Band",
            "category": "arts",
            "description": "Express yourself through music and perform together",
            "images": ["https://..."]
          }
        ],
        "events": [
          {
            "_id": "69062ea9909dd78f2eec4625",
            "title": "Hackathon Junior",
            "description": "A 24-hour coding competition for young developers",
            "date": "2025-12-14T09:00:00.000Z",
            "category": "coding",
            "seats": 50,
            "bookedCount": 0,
            "status": "open"
          },
          {
            "_id": "69062ea9909dd78f2eec4628",
            "title": "Open Mic Night",
            "description": "Showcase your talent in front of a live audience",
            "date": "2025-12-20T18:00:00.000Z",
            "category": "music",
            "seats": 100,
            "bookedCount": 0,
            "status": "open"
          }
        ],
        "workshops": []
      }
    ]
  }
}
```

## Current Database Status

✅ **3 Centers** in the database:

1. Maison de Jeunes Alger Centre (36.7732, 3.0587)
2. Annexe Bab El Oued (36.7928, 3.0479)
3. Annexe Kouba (36.7206, 3.081)

✅ **6 Clubs** (2 per center):

- Coding Club (tech)
- Music Band (arts)

✅ **6 Events** (2 per center):

- Hackathon Junior (Dec 14, 2025)
- Open Mic Night (Dec 20, 2025)

✅ **0 Workshops** (you can create some!)

## Frontend Usage

In your Frontend code (React Native), you can fetch like this:

```javascript
// src/config/api.js or wherever you make API calls
const API_URL = 'http://localhost:3030/api';

// Fetch all centers with clubs and events
export const getCentersWithData = async () => {
  try {
    const response = await fetch(`${API_URL}/centers?include=all`);
    const data = await response.json();
    return data.data.centers;
  } catch (error) {
    console.error('Error fetching centers:', error);
    throw error;
  }
};
```

## Testing with curl

```bash
# Pretty print with Python
curl -s "http://localhost:3030/api/centers?include=all" | python3 -m json.tool

# Or with jq (if installed)
curl -s "http://localhost:3030/api/centers?include=all" | jq '.'

# Save to file
curl -s "http://localhost:3030/api/centers?include=all" > centers_data.json
```

## Notes

- The `include` parameter is **optional** - if you don't provide it, you'll just get the center data without related entities
- Virtual populates are defined in `/backend/src/models/center.model.js`
- The controller that handles this is `/backend/src/controllers/centerController.js` (getAllCenters function)
- All clubs, events, and workshops have a `centerId` field that references their parent center
- Events can also have an optional `clubId` field (for club-organized events)
