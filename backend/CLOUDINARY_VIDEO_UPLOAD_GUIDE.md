# Cloudinary Video Upload Guide for Admins

This guide explains how admins can upload videos to Cloudinary and add them to the Virtual School system.

## Step 1: Upload Videos to Cloudinary

### Option A: Using Cloudinary Dashboard (Recommended)

1. **Log in to Cloudinary Console**
   - Go to [https://cloudinary.com/console](https://cloudinary.com/console)
   - Log in with your Cloudinary account

2. **Upload Video**
   - Click on "Media Library" in the left sidebar
   - Click the "Upload" button
   - Select your video file(s)
   - Wait for the upload to complete

3. **Get Video URL**
   - After upload, click on the video thumbnail
   - Copy the **Secure URL** (it looks like: `https://res.cloudinary.com/your-cloud-name/video/upload/v123456789/video-name.mp4`)
   - Optionally, copy the thumbnail URL too (similar format but with `/image/` instead of `/video/`)

### Option B: Using Cloudinary Upload Widget (for web interface)

If you build an admin panel, you can use the Cloudinary Upload Widget:

```javascript
cloudinary.openUploadWidget(
  {
    cloudName: 'your-cloud-name',
    uploadPreset: 'your-upload-preset',
    resourceType: 'video',
    sources: ['local', 'url', 'camera'],
    multiple: false,
    maxFileSize: 100000000, // 100MB
  },
  (error, result) => {
    if (!error && result && result.event === 'success') {
      console.log('Video URL:', result.info.secure_url);
      console.log('Thumbnail URL:', result.info.thumbnail_url);
    }
  }
);
```

## Step 2: Add Video to Database

Once you have the Cloudinary video URL, use the API to create a video entry:

### API Endpoint

```
POST /api/virtual-school
```

### Required Headers

```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

### Request Body

```json
{
  "title": "Introduction to JavaScript",
  "category": "coding",
  "description": "Learn the basics of JavaScript programming",
  "videoUrl": "https://res.cloudinary.com/your-cloud-name/video/upload/v123456789/intro-js.mp4",
  "thumbnailUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v123456789/intro-js.jpg",
  "duration": 600,
  "centerId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

### Field Descriptions

| Field          | Type   | Required | Description                    | Allowed Values                                                                               |
| -------------- | ------ | -------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `title`        | String | ✅       | Video title                    | Any string                                                                                   |
| `category`     | String | ✅       | Video category                 | `coding`, `language`, `career`, `health`, `entrepreneurship`, `design`, `marketing`, `other` |
| `description`  | String | ❌       | Video description              | Any string                                                                                   |
| `videoUrl`     | String | ✅       | Cloudinary video URL           | Cloudinary video URL                                                                         |
| `thumbnailUrl` | String | ❌       | Cloudinary thumbnail URL       | Cloudinary image URL                                                                         |
| `duration`     | Number | ❌       | Video duration in seconds      | Any positive number                                                                          |
| `centerId`     | String | ✅       | MongoDB ObjectId of the center | Valid ObjectId                                                                               |

### Example using cURL

```bash
curl -X POST http://localhost:3001/api/virtual-school \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction to JavaScript",
    "category": "coding",
    "description": "Learn the basics of JavaScript programming",
    "videoUrl": "https://res.cloudinary.com/demo/video/upload/v1234567890/intro-js.mp4",
    "thumbnailUrl": "https://res.cloudinary.com/demo/image/upload/v1234567890/intro-js.jpg",
    "duration": 600,
    "centerId": "60f7b3b3b3b3b3b3b3b3b3b3"
  }'
```

### Example using JavaScript/Fetch

```javascript
const createVideo = async () => {
  const response = await fetch('http://localhost:3001/api/virtual-school', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Introduction to JavaScript',
      category: 'coding',
      description: 'Learn the basics of JavaScript programming',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1234567890/intro-js.mp4',
      thumbnailUrl: 'https://res.cloudinary.com/demo/image/upload/v1234567890/intro-js.jpg',
      duration: 600,
      centerId: '60f7b3b3b3b3b3b3b3b3b3b3',
    }),
  });

  const data = await response.json();
  console.log(data);
};
```

## Step 3: Video Appears in App

Once the video is added via the API:

1. The app will automatically fetch it when users open the Virtual School screen
2. Users can filter by category
3. Users can search by title/description
4. Users can watch the video using the native video player

## Tips for Best Results

### Video Optimization

- **Format**: Upload MP4 files for best compatibility
- **Resolution**: 720p or 1080p recommended
- **File Size**: Keep videos under 100MB for faster loading
- **Duration**: Videos between 3-15 minutes work best for mobile

### Thumbnail Best Practices

- Cloudinary can auto-generate thumbnails from your video
- For custom thumbnails, use 16:9 aspect ratio (e.g., 1280x720)
- Upload as JPG or PNG
- File size should be small (< 200KB)

### Video Transformation (Optional)

Cloudinary allows you to transform videos on-the-fly:

```
https://res.cloudinary.com/your-cloud-name/video/upload/q_auto,f_auto/v123456789/video-name.mp4
```

- `q_auto` - Automatic quality adjustment
- `f_auto` - Automatic format selection

## Troubleshooting

### Video not playing in app

- ✅ Ensure the `videoUrl` is a direct Cloudinary video URL
- ✅ Check that the URL starts with `https://res.cloudinary.com/`
- ✅ Verify the video file is accessible (not private)
- ✅ Test the URL in a browser first

### Thumbnail not showing

- ✅ Use Cloudinary image URLs for thumbnails
- ✅ If no thumbnail provided, app will show placeholder
- ✅ Check the thumbnail URL in a browser

### Permission errors

- ✅ Ensure you're logged in as `center_admin` or higher
- ✅ Check that the `centerId` matches your managed center
- ✅ Verify your JWT token is valid

## Available API Endpoints

### List all videos

```
GET /api/virtual-school
GET /api/virtual-school?category=coding
GET /api/virtual-school?centerId=60f7b3b3b3b3b3b3b3b3b3b3
```

### Get single video

```
GET /api/virtual-school/:id
```

### Update video

```
PUT /api/virtual-school/:id
```

### Delete video

```
DELETE /api/virtual-school/:id
```

## Need Help?

Contact the development team or check the Swagger documentation at:

```
http://localhost:3001/api-docs
```
