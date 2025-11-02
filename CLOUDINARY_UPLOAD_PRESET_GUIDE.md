# Cloudinary Upload Preset Setup Guide

## What is an Upload Preset?

An upload preset is a predefined set of upload options that allows **unsigned uploads** from your mobile app directly to Cloudinary without exposing your API secret.

## 🔧 Setup Steps

### Step 1: Go to Cloudinary Settings

1. Log in to [Cloudinary Console](https://cloudinary.com/console)
2. Click the **Settings** icon (⚙️) in the top navigation
3. Navigate to the **Upload** tab

### Step 2: Enable Unsigned Uploading

1. Scroll to the **Upload presets** section
2. Look for **"Enable unsigned uploading"**
3. Click **"Enable"** if it's not already enabled

### Step 3: Create/Edit an Upload Preset

You have two options:

#### Option A: Use Default Preset (ml_default)

1. Look for the preset named **"ml_default"**
2. This is automatically created and works out of the box
3. **No action needed** - your app is already configured to use this!

#### Option B: Create Custom Preset (Recommended)

1. Click **"Add upload preset"** button
2. Fill in the details:

   - **Preset name**: `msj_videos` (or any name you prefer)
   - **Signing mode**: Select **"Unsigned"** ⚠️ IMPORTANT
   - **Folder**: `msj-educational-videos` (optional, for organization)
   - **Format**: Leave empty or set to `mp4`
   - **Resource type**: `Auto`

3. **Additional Settings** (Optional but recommended):
   - **Overwrite**: Enable (allows replacing files)
   - **Unique filename**: Enable (prevents name conflicts)
   - **Use filename**: Enable (keeps original filename)
4. Click **"Save"**

### Step 4: Update Your App Config

If you created a custom preset, update your app:

**In `AdminPanel.jsx`**, change this line:

```javascript
const CLOUDINARY_UPLOAD_PRESET = "ml_default";
```

To your custom preset:

```javascript
const CLOUDINARY_UPLOAD_PRESET = "msj_videos"; // Your custom preset name
```

## ✅ Verification

To test if it's working:

1. Open your app
2. Sign in as admin
3. Try selecting and uploading a video
4. Check Cloudinary Media Library - the video should appear!

## 🔒 Security Notes

### Why Unsigned Upload is Safe:

1. **Upload presets limit what can be uploaded**

   - You can restrict file types (only videos)
   - You can set max file size
   - You can specify allowed formats

2. **No API secret exposed**

   - Only the cloud name and preset name are in your app
   - API secret stays secure on your backend

3. **Cloudinary handles the processing**
   - Automatic video optimization
   - Automatic format conversion
   - CDN delivery

### Recommended Restrictions:

In your upload preset settings, add these for security:

```
Max file size: 100 MB
Allowed formats: mp4, mov, avi
Resource type: video, image
```

## 📋 Upload Preset Configuration Example

Here's a recommended configuration:

```yaml
Upload Preset Name: msj_videos
Signing Mode: Unsigned ✅
Folder: msj-educational-videos
Format: mp4
Resource Type: Auto

Advanced Options:
  - Overwrite: Yes
  - Unique Filename: Yes
  - Use Filename: Yes
  - Max File Size: 100 MB
  - Allowed Formats: mp4, mov, avi, jpeg, jpg, png
  - Auto Tagging: educational, msj
```

## 🎯 How It Works

```
Your App (AdminPanel)
        ↓
   Pick Video File
        ↓
   Upload to Cloudinary API
   (using upload preset)
        ↓
Cloudinary Processes & Stores Video
        ↓
   Returns Secure URL
        ↓
Your App Saves URL to Database
        ↓
   Users Can Watch! 🎬
```

## 🐛 Troubleshooting

### "Upload preset must be unsigned"

- Go to Settings → Upload → Find your preset
- Change "Signing mode" to **"Unsigned"**

### "Upload failed"

- Check internet connection
- Verify cloud name is correct: `dvfsmezpi`
- Verify preset name matches exactly
- Check file size (must be under limit)

### "Invalid credentials"

- Double-check the cloud name in AdminPanel.jsx
- Make sure it matches your Cloudinary account

### Videos not appearing in Cloudinary

- Check the folder setting in your preset
- Look in Media Library → All folders

## 📱 New Upload Flow for Users

### As Admin:

1. Open app → Sign in as admin
2. **Tap "Select Video"** → Choose from device
3. (Optional) **Tap "Select Thumbnail"** → Choose image
4. Fill in:
   - Title
   - Category
   - Description (optional)
   - Duration will be auto-detected!
5. **Tap "Upload Video"**
6. Watch progress: "Uploading... 30%" → "90%" → "Success! 🎉"
7. Done! Video is on Cloudinary and in your app database

### What You'll See:

- ✅ File selection with filename and size
- ✅ Upload progress indicator
- ✅ Success confirmation
- ✅ Automatic Cloudinary URL generation
- ✅ Automatic video duration detection

## 🎉 Benefits of Direct Upload

✅ **No manual URL copying** - app handles it automatically
✅ **Progress tracking** - see upload status in real-time
✅ **Better UX** - one-step process instead of two
✅ **Automatic duration** - Cloudinary detects video length
✅ **Mobile-friendly** - upload from phone camera or gallery
✅ **Faster workflow** - upload and save in one go

## 📚 Additional Resources

- [Cloudinary Upload Presets Docs](https://cloudinary.com/documentation/upload_presets)
- [Unsigned Upload Guide](https://cloudinary.com/documentation/upload_images#unsigned_upload)
- [Mobile Upload Best Practices](https://cloudinary.com/documentation/react_native_integration)

---

**You're all set!** 🚀 Your app can now upload videos directly to Cloudinary without manual URL copying!
