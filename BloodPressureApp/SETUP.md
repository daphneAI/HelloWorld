# Blood Pressure Tracker - Setup Guide

This guide will walk you through setting up the Blood Pressure Tracker app from scratch.

## Step 1: Prerequisites

Make sure you have installed:
- Node.js (v16+) - [Download](https://nodejs.org/)
- npm or yarn
- Git

Verify installation:
```bash
node --version
npm --version
```

## Step 2: Expo Setup

Install Expo CLI globally:
```bash
npm install -g expo-cli
```

Verify Expo installation:
```bash
expo --version
```

## Step 3: Firebase Project Setup

### 3.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Name your project: "Blood Pressure Tracker"
4. Accept the terms and click "Create project"
5. Wait for project initialization

### 3.2 Set Up Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Select **Start in production mode**
4. Choose your region (e.g., us-central1)
5. Click "Create"

### 3.3 Set Firestore Security Rules
In Firestore, go to **Rules** and replace with:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bloodPressureReadings/{document=**} {
      allow read, write: if request.auth != null || request.auth == null;
    }
  }
}
```

### 3.4 Enable Anonymous Authentication
1. Go to **Authentication** tab
2. Click **Get Started**
3. Enable **Anonymous** sign-in method
4. Save

### 3.5 Get Firebase Credentials
1. Go to **Project Settings** (gear icon)
2. Under "Your apps", click the web app
3. Copy the Firebase config object:
```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 4: Google Cloud Setup (for OCR)

### 4.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project named "Blood Pressure Tracker"
3. Wait for creation

### 4.2 Enable Vision API
1. Go to **APIs & Services** > **Library**
2. Search for "Cloud Vision API"
3. Click on it and press **Enable**

### 4.3 Create API Key
1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** > **API Key**
3. Copy your API key
4. (Optional) Restrict the key to Cloud Vision API only

## Step 5: Environment Configuration

### 5.1 Create .env File
In the `BloodPressureApp` directory, create a file named `.env.local`:

```bash
cd BloodPressureApp
cp .env.example .env.local
```

### 5.2 Fill in Environment Variables
Edit `.env.local` with your credentials:

```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=yourproject
REACT_APP_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_GOOGLE_VISION_API_KEY=YOUR_VISION_API_KEY
```

## Step 6: Install Dependencies

```bash
cd BloodPressureApp
npm install
```

Or if you use yarn:
```bash
yarn install
```

Wait for all dependencies to be installed (this may take a few minutes).

## Step 7: Start Development Server

```bash
npm start
```

This will start the Expo development server. You should see output like:

```
Starting Expo server...
Successfully started Expo server
Local:   exp://192.168.x.x:19000
```

## Step 8: Run on Simulator/Device

### Option A: iOS Simulator (Mac only)
```bash
i
```

### Option B: Android Emulator
```bash
a
```

### Option C: Web Browser
```bash
w
```

### Option D: Physical Device
1. Install Expo Go app from App Store or Google Play
2. Scan the QR code shown in the terminal with your phone camera (iOS) or Expo Go app (Android)

## Step 9: Test the App

Once the app is running:

1. **Test Manual Entry**
   - Go to "Add Reading" tab
   - Enter test values: Systolic 120, Diastolic 80
   - Save and verify in dashboard

2. **Test Screenshot Upload**
   - Go to "Upload" tab
   - Take a photo or upload an image with numbers
   - Verify extraction works

3. **Test Graphs**
   - Go to "Analytics" tab
   - Add multiple readings over several days
   - Check weekly and monthly views

4. **Test Settings**
   - Go to "Settings" tab
   - Verify all options are accessible

## Step 10: Build for Production

### iOS Build
```bash
eas build --platform ios
```

### Android Build
```bash
eas build --platform android
```

Note: You'll need to create an Expo account first:
```bash
expo register
```

## Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 19000
# Windows:
netstat -ano | findstr :19000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :19000
kill -9 <PID>
```

### Firebase Connection Failed
- Verify `.env.local` credentials are correct
- Check internet connection
- Verify Firestore database is enabled
- Check Firestore rules allow read/write

### OCR Not Working
- Verify Google Vision API is enabled
- Check API key has permissions
- Ensure image contains clear numbers
- Check API usage quotas in Google Cloud Console

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### App Won't Start
- Clear cache: `expo r -c`
- Reinstall packages: `npm install`
- Check for syntax errors: `npm run lint`

## Next Steps

1. **Customize Branding**
   - Update app name in `app.json`
   - Replace splash screen and icons in `assets/`

2. **Add More Features**
   - Medication tracking
   - Doctor notes
   - Integration with health apps

3. **Deploy**
   - Submit to App Store (iOS)
   - Submit to Google Play (Android)
   - Deploy web version

4. **Maintenance**
   - Monitor Firebase usage
   - Update dependencies regularly
   - Gather user feedback

## Getting Help

- **Expo Docs**: https://docs.expo.dev
- **Firebase Docs**: https://firebase.google.com/docs
- **Google Vision API**: https://cloud.google.com/vision/docs
- **React Native Docs**: https://reactnative.dev

---

**You're all set!** Your Blood Pressure Tracker app is ready to use. 🎉
