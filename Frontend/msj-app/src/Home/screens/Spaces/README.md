# Spaces Feature 🚀

## Overview

The Spaces feature provides three distinct areas within the youth center application, each designed to engage and educate youth through different mediums.

---

## 📚 The Three Spaces

### 1. **Sharing Experiences**

A platform for youth to attend seances and learn from others' experiences.

**Features:**

- **Upcoming Seances Tab**

  - View scheduled sessions with speaker details
  - See available spots and register
  - Filter by topic and date
  - Speaker profiles with bio and image
  - Location and duration information

- **Archive Tab**
  - Browse past seances with recordings
  - View summaries and key takeaways
  - Search by tags and topics
  - See view counts and popularity

**Mock Data Fields:**

- Title, description, speaker info
- Scheduled date, duration, location
- Max attendees, current registration count
- Tags, topic categories
- Recording URLs (for archived content)

---

### 2. **Virtual School**

Short educational videos curated by center admins on useful topics.

**Features:**

- **Video Library**

  - Scroll through educational content
  - Category filtering (Technology, Life Skills, Business, Arts, Health, etc.)
  - Search functionality
  - Difficulty levels (Beginner, Intermediate, Advanced)
  - View counts and likes

- **Video Cards Display**
  - Thumbnail previews
  - Duration badges
  - Category and difficulty tags
  - Engagement metrics

**Mock Data Fields:**

- Title, description, video URL
- Thumbnail, duration
- Category, difficulty level
- Views, likes
- Upload date and uploader info
- Tags for searchability

---

### 3. **Startup Hub**

Resources and opportunities for aspiring entrepreneurs.

**Features:**

- **Resource Types**

  - Guides and articles
  - Funding opportunities
  - Templates and tools
  - Case studies
  - Competitions
  - Mentorship info

- **Filtering & Search**
  - Filter by resource type
  - Search by keywords
  - Category organization
  - Difficulty levels
  - Save/bookmark resources

**Mock Data Fields:**

- Title, description, content URL
- Resource type, category
- Difficulty, estimated time
- Views and saves count
- Tags for discovery
- Thumbnail images

---

## 🎨 UI/UX Highlights

### Design System

- **Color Scheme:**

  - Sharing Experiences: Purple/Indigo gradient
  - Virtual School: Pink/Rose gradient
  - Startup Hub: Orange/Red gradient

- **Components:**
  - Gradient cards with icons
  - Clean, modern typography
  - Consistent spacing and shadows
  - Interactive elements with feedback
  - Responsive grid layouts

### Navigation Flow

```
SpacesScreen (Main Hub)
    ├── SharingExperiencesScreen
    │   ├── Upcoming Tab
    │   └── Archive Tab
    ├── VirtualSchoolScreen
    │   ├── Search & Filter
    │   └── Video Grid
    └── StartupHubScreen
        ├── Search & Filter
        └── Resource Cards
```

---

## 📁 File Structure

```
Frontend/msj-app/src/
├── data/
│   └── mockSpacesData.json          # All mock data
└── Home/screens/Spaces/
    ├── index.js                      # Exports
    ├── SpacesScreen.jsx              # Main spaces hub
    ├── SharingExperiencesScreen.jsx  # Seances & archive
    ├── VirtualSchoolScreen.jsx       # Video lessons
    └── StartupHubScreen.jsx          # Startup resources
```

---

## 🔧 Technical Details

### Dependencies Used

- React Native core components
- Expo Linear Gradient (for gradient backgrounds)
- Ionicons (for icons)
- React Navigation (for screen transitions - to be added)

### Data Management

- Currently using JSON mock data
- Easy to swap with API calls later
- Structured for scalability

### State Management

- Local state with React hooks
- Tab switching
- Search queries
- Filter selections

---

## 🚀 Next Steps

### Backend Integration (Later)

1. Replace mock data with API calls
2. Implement registration system for seances
3. Add video player integration
4. Create resource download/linking
5. User authentication for saves/likes

### Enhanced Features

1. **Sharing Experiences:**

   - Calendar view for seances
   - Reminder notifications
   - Rating/feedback system
   - Live streaming for ongoing seances

2. **Virtual School:**

   - Progress tracking
   - Certificates of completion
   - Quiz integration
   - Playlists/learning paths

3. **Startup Hub:**
   - Application submission forms
   - Mentorship matching
   - Success story submissions
   - Community forum

---

## 💡 Usage

### For Development

```javascript
import {
  SpacesScreen,
  SharingExperiencesScreen,
  VirtualSchoolScreen,
  StartupHubScreen,
} from "./src/Home/screens/Spaces";

// Add to your navigation stack
```

### Mock Data Access

```javascript
import mockData from "./src/data/mockSpacesData.json";

const { sharingExperiences, virtualSchool, startupHub } = mockData;
```

---

## 🎯 Key Features Summary

✅ Three distinct space types with unique purposes  
✅ Beautiful, modern UI with gradients and animations  
✅ Complete mock data for testing  
✅ Search and filter functionality  
✅ Responsive card layouts  
✅ Tab navigation where needed  
✅ Engagement metrics (views, likes, saves)  
✅ Category and difficulty filtering  
✅ Ready for backend integration

---

**Built with ❤️ for the MSJ Hackathon**
