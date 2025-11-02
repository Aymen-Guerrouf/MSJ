# Video Playback Troubleshooting Guide

## ✅ What We Fixed

### Issue: Videos uploaded successfully but won't play

**Error**: `AVPlayerItem failed with error code -1100` or "Asset is not playable"

### Root Cause:

The video format/codec uploaded to Cloudinary wasn't compatible with iOS/Android native video players.

### Solution Implemented:

#### 1. **Automatic Video Transformation** (AdminPanel.jsx)

When uploading videos, we now automatically transform them to mobile-compatible format:

```javascript
// Transformations added to Cloudinary URL:
- f_mp4      → Force MP4 container format
- vc_h264    → H.264 video codec (universally supported)
- ac_aac     → AAC audio codec (universally supported)
- q_auto     → Automatic quality optimization
```

**Example URL transformation:**

```
Before: https://res.cloudinary.com/dvfsmezpi/video/upload/v123/my-video.mp4
After:  https://res.cloudinary.com/dvfsmezpi/video/upload/f_mp4,vc_h264,ac_aac,q_auto/v123/my-video.mp4
```

#### 2. **Mobile-Compatible URL Checker** (VideoPlayerScreen.jsx)

Added a function to ensure all video URLs have proper transformations before playback.

#### 3. **Better Error Handling**

Added user-friendly error messages when video fails to load.

## 🎯 How to Fix Existing Videos

If you already uploaded videos that won't play:

### Option A: Re-upload (Recommended)

1. Delete the non-working video from your app
2. Upload it again using the updated Admin Panel
3. The new transformations will be applied automatically ✅

### Option B: Manually Fix URLs in Database

If you have videos already in the database, you can fix their URLs:

1. Go to MongoDB
2. Find the video document
3. Update the `videoUrl` field:

**Add these transformations to the URL:**

```
/upload/  →  /upload/f_mp4,vc_h264,ac_aac,q_auto/
```

**Example MongoDB update:**

```javascript
db.virtualschoolvideos.updateOne(
  { _id: ObjectId("your-video-id") },
  {
    $set: {
      videoUrl:
        "https://res.cloudinary.com/dvfsmezpi/video/upload/f_mp4,vc_h264,ac_aac,q_auto/v123/video.mp4",
    },
  }
);
```

## 📱 Testing Video Compatibility

### Before Uploading:

Check your video format on your computer:

- **Best format**: MP4 with H.264 video and AAC audio
- **Tools to convert**: HandBrake (free), VLC, FFmpeg

### After Uploading:

1. Go to Cloudinary Media Library
2. Click on the uploaded video
3. Check the URL includes: `f_mp4,vc_h264,ac_aac`
4. Test playback in your app

## 🔧 Supported Video Formats

### ✅ Fully Supported (Will play on all devices):

- MP4 with H.264 video + AAC audio
- MOV with H.264 video + AAC audio (will be converted)

### ⚠️ May Need Conversion:

- AVI (will be converted to MP4)
- MKV (will be converted to MP4)
- WebM (will be converted to MP4)

### ❌ Not Recommended:

- HEVC/H.265 (limited device support)
- VP9 codec (limited support)
- Proprietary codecs

## 🎬 Cloudinary Upload Preset Configuration

For best results, configure your Cloudinary upload preset:

1. Go to Settings → Upload → Your preset (`mja-hackothon`)
2. Add these settings:

```yaml
Video Settings:
  - Format: mp4
  - Video Codec: h264
  - Audio Codec: aac
  - Quality: auto
  - Streaming Profile: full_hd (or hd)
```

## 📊 What Happens During Upload

```
1. User selects video file
       ↓
2. Upload to Cloudinary
       ↓
3. Cloudinary receives video
       ↓
4. Transform to MP4 + H.264 + AAC
       ↓
5. Return transformed URL
       ↓
6. Save to database
       ↓
7. Video plays on all devices! ✅
```

## 🐛 Common Issues & Solutions

### Issue: "Video uploaded but still won't play"

**Solution**:

- Check the video URL in database
- Verify it has transformations: `f_mp4,vc_h264,ac_aac`
- If missing, re-upload the video

### Issue: "Video takes forever to load"

**Solution**:

- Video file size too large (>100MB)
- Compress video before uploading
- Use quality: `q_auto` for automatic optimization

### Issue: "Audio plays but no video" or vice versa

**Solution**:

- Original video has codec issues
- Re-encode video using HandBrake or FFmpeg
- Use H.264 + AAC preset

### Issue: "Black screen when playing"

**Solution**:

- Video dimensions too large (>1920x1080)
- Add transformation: `w_1280,h_720` to URL
- Re-upload with lower resolution

## 🔍 Debugging Steps

1. **Check the URL in console logs**

   - Look for: `console.log("Video URL:", videoUrl)`
   - Verify transformations are present

2. **Test URL in browser**

   - Copy the video URL
   - Open in browser
   - Should download and play

3. **Check Cloudinary Media Library**

   - Find the video
   - Click "Preview"
   - Should play in browser

4. **Check video details**
   - Format: Should be MP4
   - Video codec: Should be H.264
   - Audio codec: Should be AAC

## ✨ Best Practices

### For Admins Uploading Videos:

1. **Use MP4 format when possible**

   - Pre-convert videos to MP4 before uploading
   - Ensures fastest processing

2. **Keep file sizes reasonable**

   - Under 50MB for best performance
   - Under 100MB maximum

3. **Test on actual device**

   - Upload → View in app → Verify playback
   - Don't just rely on Cloudinary preview

4. **Use consistent quality settings**
   - 720p for mobile (1280x720)
   - 1080p max (1920x1080)

### For Developers:

1. **Always add transformations**

   - Never use raw Cloudinary URLs
   - Always include `f_mp4,vc_h264,ac_aac`

2. **Handle errors gracefully**

   - Show user-friendly messages
   - Log errors for debugging

3. **Test on both iOS and Android**
   - Format support can vary
   - H.264 + AAC works on both

## 📚 Resources

- [Cloudinary Video Transformations](https://cloudinary.com/documentation/video_transformation_reference)
- [H.264 Codec Info](https://en.wikipedia.org/wiki/Advanced_Video_Coding)
- [AAC Audio Codec](https://en.wikipedia.org/wiki/Advanced_Audio_Coding)
- [HandBrake (Free Video Converter)](https://handbrake.fr/)
- [Expo Video Documentation](https://docs.expo.dev/versions/latest/sdk/video/)

## 🎉 Summary

- ✅ All new uploads automatically get mobile-compatible transformations
- ✅ Video player checks URLs and adds transformations if missing
- ✅ Better error messages help identify issues
- ✅ Re-upload old videos to fix playback issues

**Your videos should now play perfectly on all devices!** 🎬
