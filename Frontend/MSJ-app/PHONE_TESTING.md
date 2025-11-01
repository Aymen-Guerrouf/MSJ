# Testing on Physical Phone

## Backend Setup ✅ DONE

The backend is now configured to accept connections from your physical phone.

**Backend is running on:** `http://192.168.56.1:3000`

## Frontend Setup ✅ DONE

The app automatically detects the platform:

- **Web (localhost:8081)**: Uses `http://localhost:3000`
- **Physical Device**: Uses `http://192.168.56.1:3000`

## Steps to Test on Your Phone

### 1. Make Sure Both Devices Are on the Same Network

- Your computer and phone must be connected to the **same WiFi network**
- If you're using a VPN on your computer, disconnect it temporarily

### 2. Check Windows Firewall (Important!)

Your Windows Firewall might block the connection. Allow Node.js through the firewall:

**Option A: Quick Test (Temporary)**

```powershell
# Run this in PowerShell as Administrator
New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

**Option B: Manual Setup**

1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Find "Node.js" or click "Allow another app"
4. Add Node.js and allow it on **Private networks**

### 3. Verify Your Computer's IP Address

Your current IP is: **192.168.56.1**

To verify or if it changes, run:

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"} | Select-Object IPAddress
```

### 4. Update Frontend If IP Changes

If your IP address is different from `192.168.56.1`, update:

**File:** `src/config/api.js`

Change the IP on line 14:

```javascript
return "http://YOUR_ACTUAL_IP:3000";
```

### 5. Start Expo on Your Phone

```bash
npm start
```

Then:

- Scan the QR code with Expo Go app (iOS/Android)
- Or press `a` for Android / `i` for iOS

### 6. Test the Connection

- Open the SignUp screen on your phone
- Try to create an account
- The app should connect to your computer's backend at `http://192.168.56.1:3000`

## Troubleshooting

### "Network request failed"

- ✅ Check if backend is running: Open browser on your phone and go to `http://192.168.56.1:3000`
- ✅ Verify both devices are on the same WiFi
- ✅ Disable VPN on your computer
- ✅ Allow Node.js through Windows Firewall (see step 2)

### "CORS error"

- ✅ Backend is already configured to allow all origins in development
- ✅ Restart the backend server: `npm run dev` in backend folder

### Wrong IP Address

- ✅ Get your actual IP with the PowerShell command in step 3
- ✅ Update `src/config/api.js` with the correct IP
- ✅ Restart Expo dev server

## Current Configuration

**Backend:**

- Port: 3000
- Host: 0.0.0.0 (accepts connections from network)
- CORS: Allows all origins in development

**Frontend:**

- Web: http://localhost:3000
- Mobile: http://192.168.56.1:3000
- Config file: `src/config/api.js`

## Quick Commands

**Start Backend:**

```bash
cd backend
npm run dev
```

**Start Frontend:**

```bash
cd Frontend/MSJ-app
npm start
```

**Check if backend is accessible:**
Open in your phone's browser: `http://192.168.56.1:3000`
