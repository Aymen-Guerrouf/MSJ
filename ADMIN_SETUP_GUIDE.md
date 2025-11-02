# Admin Setup Guide

This guide explains how to create a super admin user and use the admin panel to upload videos.

## Step 1: Create Super Admin User

Run the script to create a super admin user in the database:

```bash
cd backend
node src/scripts/createSuperAdmin.js
```

This will create a super admin user with the following credentials:

- **Email**: `admin@msj.com`
- **Password**: `Admin@123456`

### Default Super Admin Details

- Role: `super_admin`
- Email Verified: `true`
- Name: `Super Admin`

**⚠️ Important**: Change the password after first login!

## Step 2: Sign In as Admin

1. Open your app
2. Use the credentials:
   - Email: `admin@msj.com`
   - Password: `Admin@123456`
3. The app will automatically detect the admin role and navigate to the Admin Panel

## Step 3: Upload Videos

### In the Admin Panel:

1. **Upload to Cloudinary First**

   - Go to [Cloudinary Console](https://cloudinary.com/console)
   - Navigate to Media Library
   - Upload your video
   - Copy the secure URL (e.g., `https://res.cloudinary.com/xxx/video/upload/v123/video.mp4`)

2. **Fill the Form**

   - **Title** (required): Enter a descriptive title
   - **Category** (required): Select from available categories
   - **Description** (optional): Provide details about the video
   - **Cloudinary Video URL** (required): Paste the URL from step 1
   - **Thumbnail URL** (optional): Paste Cloudinary thumbnail URL
   - **Duration** (optional): Enter video duration in seconds

3. **Submit**
   - Click "Upload Video"
   - Wait for confirmation
   - Video will appear in the app immediately!

## User Role Navigation Logic

The app checks user role on sign-in:

```javascript
if (role === "super_admin" || role === "center_admin") {
  // Navigate to Admin Panel
} else {
  // Navigate to regular Home
}
```

### Available Roles

- `user` - Regular user (navigates to HomeTab)
- `center_admin` - Center administrator (navigates to AdminPanel)
- `super_admin` - Super administrator (navigates to AdminPanel)

## Creating Additional Admin Users

### Option 1: Using MongoDB directly

```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "center_admin" } }
);
```

### Option 2: Modify the script

Edit `src/scripts/createSuperAdmin.js` and change the email/password, then run it again.

### Option 3: Via API (requires super_admin token)

```bash
curl -X PUT http://localhost:3001/api/users/:userId \
  -H "Authorization: Bearer SUPER_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "center_admin"}'
```

## Admin Panel Features

### Current Features

- ✅ Upload videos with Cloudinary URLs
- ✅ Select video category
- ✅ Add title and description
- ✅ Optional thumbnail upload
- ✅ Duration tracking
- ✅ Logout functionality

### Coming Soon

- Video list management
- Edit existing videos
- Delete videos
- View analytics
- Bulk upload

## Cloudinary Video URL Format

Valid Cloudinary URLs look like:

```
https://res.cloudinary.com/{cloud_name}/video/upload/v{version}/{video_id}.mp4
```

Example:

```
https://res.cloudinary.com/demo/video/upload/v1234567890/sample-video.mp4
```

## Troubleshooting

### "Navigation error: AdminPanel not found"

- Make sure you've added AdminPanel to App.js navigation
- Restart the Expo app

### "Failed to create video"

- Check that you're using a valid Cloudinary URL
- Verify your admin token is valid
- Check backend logs for errors

### "Unauthorized"

- Your token may have expired
- Sign out and sign in again
- Verify your user role is `super_admin` or `center_admin`

### Video not appearing in app

- Check the API response for errors
- Verify the video was created in the database
- Make sure users are authenticated when viewing videos

## File Locations

- **Backend Script**: `backend/src/scripts/createSuperAdmin.js`
- **Admin Panel**: `Frontend/msj-app/src/admin/AdminPanel.jsx`
- **SignIn Update**: `Frontend/msj-app/src/auth/SignIn.jsx`
- **Navigation**: `Frontend/msj-app/App.js`

## Security Notes

1. **Change default password**: The default password `Admin@123456` should be changed immediately
2. **Use environment variables**: Store admin credentials securely
3. **Token expiration**: JWT tokens expire after 15 minutes by default
4. **HTTPS only**: Always use HTTPS in production for Cloudinary URLs

## Next Steps

1. Run the script to create super admin
2. Sign in with admin credentials
3. Upload your first video!
4. Test the video in the app
5. Change the admin password

For more details, see `CLOUDINARY_VIDEO_UPLOAD_GUIDE.md`
