# Blood Pressure Tracker - Quick Start

## What You're Getting

A complete React Native mobile app with:
- 📊 Weekly and monthly blood pressure graphs
- 📸 Screenshot-based BP reading extraction (OCR)
- 💾 Cloud database with Firebase
- 📈 Smart health insights and recommendations
- 🔔 Notification and reminder system

## Quick Setup (15 minutes)

### 1. Prerequisites
```bash
# Install Node.js from nodejs.org if not already installed
node --version    # Should be v16+
npm --version     # Should be v8+
```

### 2. Install Expo
```bash
npm install -g expo-cli
```

### 3. Get Firebase Credentials
1. Go to https://console.firebase.google.com
2. Create new project "Blood Pressure Tracker"
3. Enable Firestore Database (production mode)
4. Enable Anonymous Authentication
5. Copy your web app credentials

### 4. Get Google Vision API Key
1. Go to https://console.cloud.google.com
2. Enable "Cloud Vision API"
3. Create an API key

### 5. Configure App
```bash
cd BloodPressureApp
cp .env.example .env.local
```

Edit `.env.local` and paste your credentials

### 6. Install & Run
```bash
npm install
npm start
```

Then press:
- `a` for Android
- `i` for iOS  
- `w` for Web
- Scan QR code for physical device with Expo Go app

## App Features Explained

### Dashboard (Home Tab)
- Shows your latest blood pressure reading
- Weekly average with health status
- Personalized health insights
- Quick action buttons

### Input (Add Reading Tab)
- Easy form to manually enter BP readings
- Supports Systolic, Diastolic, Pulse
- Optional notes field
- Real-time category classification
- Automatic Firebase save

### Analytics (Graphs Tab)
- **Weekly View**: Last 7 days of readings
- **Monthly View**: Last 30 days of readings
- Interactive line charts
- Statistics (highest, lowest, average)
- Trend analysis
- Health recommendations

### Screenshot Upload Tab
- Take photo or select from gallery
- Automatic OCR extracts numbers
- Shows confidence score
- One-click save to database
- Manual editing if needed

### Settings Tab
- Account management
- Notification preferences
- Health goals
- Doctor information
- Privacy & data management

## Blood Pressure Categories

| Category | Systolic | Diastolic | Action |
|----------|----------|-----------|--------|
| Normal | < 120 | < 80 | Maintain lifestyle |
| Elevated | 120-129 | < 80 | Monitor & prevent |
| Stage 1 | 130-139 | 80-89 | Consult doctor |
| Stage 2 | ≥ 140 | ≥ 90 | Seek immediate care |

## File Structure

```
BloodPressureApp/
├── App.js                    # Main entry point
├── screens/                  # App screens
│   ├── HomeScreen.js         # Dashboard
│   ├── InputScreen.js        # Manual entry form
│   ├── GraphsScreen.js       # Charts & analytics
│   ├── ScreenshotScreen.js   # OCR upload
│   └── SettingsScreen.js     # Settings
├── services/                 # Business logic
│   ├── firebaseService.js    # Firebase operations
│   ├── ocrService.js         # Image text extraction
│   └── healthService.js      # Health insights
├── package.json              # Dependencies
├── app.json                  # Expo config
├── .env.example              # Environment template
├── README.md                 # Full documentation
└── SETUP.md                  # Detailed setup guide
```

## Keyboard Shortcuts in Dev Server

```
a - Open on Android emulator
i - Open on iOS simulator
w - Open web version
r - Reload app
j - Open debugger
m - Toggle menu
q - Quit
```

## Common Tasks

### Add More Readings
1. Click "Add Reading" tab
2. Enter systolic & diastolic values
3. Optionally add pulse and notes
4. Click "Save Reading"

### View Trends
1. Click "Analytics" tab
2. Switch between Weekly/Monthly
3. See your BP trend line
4. Read trend analysis

### Upload BP Screenshot
1. Click "Upload" tab
2. "Take Photo" or "Choose from Gallery"
3. App extracts BP numbers automatically
4. Verify and click "Save Reading"

### Check Health Insights
1. Go to Dashboard
2. Scroll down to "Health Insights" card
3. Read personalized recommendations
4. Follow suggested health actions

## Troubleshooting

### App Won't Start
```bash
# Clear cache and reinstall
expo r -c
rm -rf node_modules package-lock.json
npm install
npm start
```

### Firebase Not Working
- Check `.env.local` credentials are correct
- Verify Firestore database is enabled
- Check internet connection
- Verify security rules allow access

### OCR Not Extracting Data
- Ensure image is clear and readable
- Verify Google Vision API is enabled
- Check API key is correct
- Make sure numbers are visible in image

### Permission Denied Errors
- Grant camera access when prompted
- Grant photo library access when prompted
- Check phone settings allow app permissions

## Next Steps

1. **Customize the App**
   - Change colors in screen stylesheets
   - Update app name in `app.json`
   - Add company logo

2. **Deploy to Stores**
   - Build APK/IPA with Expo
   - Submit to Google Play Store
   - Submit to Apple App Store

3. **Enhance Features**
   - Add medication tracking
   - Implement doctor notes
   - Add health app integration

4. **Production Setup**
   - Set up error monitoring (Sentry)
   - Configure analytics (Firebase Analytics)
   - Set up push notifications
   - Enable offline mode

## Support Resources

- **Expo**: https://docs.expo.dev
- **Firebase**: https://firebase.google.com/docs
- **React Native**: https://reactnative.dev
- **Google Cloud**: https://cloud.google.com/docs

## Key Features Summary

✅ Manual BP entry with instant feedback
✅ Screenshot analysis with OCR
✅ Beautiful weekly/monthly charts
✅ Cloud backup with Firebase
✅ Offline data storage
✅ Smart health recommendations
✅ Customizable alerts & reminders
✅ Multi-platform (iOS, Android, Web)

---

**Ready to start?** Run `npm start` and select your platform!

For detailed setup instructions, see [SETUP.md](SETUP.md)
For full documentation, see [README.md](README.md)
