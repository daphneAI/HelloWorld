# Blood Pressure Tracker Mobile App

A React Native mobile application for tracking blood pressure readings with advanced features including:
- 📊 Weekly and monthly trend graphs
- 📸 Screenshot analysis using OCR
- 💾 Cloud storage with Firebase
- 📈 Health insights and recommendations
- 🔔 Notifications and reminders

## Features

### Core Functionality
- **Manual BP Entry**: Easily log blood pressure readings with systolic, diastolic, and pulse
- **Screenshot Upload**: Take or upload photos of BP device displays and extract readings automatically
- **Dashboard**: View latest reading, weekly average, and health insights at a glance
- **Analytics**: Interactive charts showing weekly and monthly trends
- **Health Insights**: AI-powered recommendations based on your readings

### Data Visualization
- **Weekly Graph**: Track your BP over 7 days
- **Monthly Graph**: Monitor long-term trends over 30 days
- **Statistics**: View highest, lowest, and average readings
- **Trend Analysis**: Automatic detection of improving or worsening trends

### Health Features
- **BP Categories**: Automatic classification (Normal, Elevated, Stage 1-2 Hypertension)
- **Personalized Recommendations**: Diet, exercise, and stress management tips
- **Risk Assessment**: Cardiovascular risk scoring
- **Doctor Alerts**: Warnings for critically high BP readings

## Project Structure

```
BloodPressureApp/
├── App.js                          # Main app entry and navigation
├── screens/
│   ├── HomeScreen.js              # Dashboard with latest reading and insights
│   ├── InputScreen.js             # Manual BP entry form
│   ├── GraphsScreen.js            # Weekly/monthly charts and statistics
│   ├── ScreenshotScreen.js        # Screenshot upload and OCR
│   └── SettingsScreen.js          # User preferences and settings
├── services/
│   ├── firebaseService.js         # Firebase/Firestore operations
│   ├── ocrService.js              # Image OCR and data extraction
│   └── healthService.js           # Health insights and recommendations
├── package.json                   # Dependencies
├── app.json                       # Expo configuration
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Firebase project
- Google Cloud Vision API key (for OCR)

### Installation

1. **Clone the repository**
   ```bash
   cd BloodPressureApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Firebase and Google API credentials:
   ```
   REACT_APP_FIREBASE_API_KEY=your_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_app_id_here
   REACT_APP_GOOGLE_VISION_API_KEY=your_vision_key_here
   ```

4. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Anonymous)
   - Create a new web app and copy the credentials

5. **Set up Google Vision API**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable Vision API
   - Create an API key with Vision API permissions

### Running the App

**Development Mode:**
```bash
npm start
```

This starts the Expo development server. You can then:
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Press `w` to open in web browser
- Scan QR code with Expo Go app on your phone

**Build for Production:**

iOS:
```bash
expo build:ios
```

Android:
```bash
expo build:android
```

## Architecture

### Screens Overview

#### Home Screen
- Latest BP reading with category indicator
- Weekly average statistics
- Health insights and recommendations
- Quick action buttons

#### Input Screen
- Form fields for systolic, diastolic, and pulse
- Real-time BP category classification
- Optional notes field
- Medical reference guide
- Auto-save to Firebase

#### Graphs Screen
- Toggle between weekly and monthly views
- Interactive line charts showing trends
- Statistics cards (highest, lowest, average)
- Trend analysis with recommendations

#### Screenshot Screen
- Camera/gallery image picker
- OCR-powered data extraction
- Confidence scoring for accuracy
- Manual editing capability
- One-click save to database

#### Settings Screen
- Account management
- Notification preferences
- Theme selection
- Health goals and targets
- Doctor information
- Privacy and terms

### Services

#### Firebase Service
- Authenticate users (anonymous)
- Store readings in Firestore
- Retrieve historical data
- Calculate statistics
- Support for cloud backup

#### OCR Service
- Convert images to base64
- Call Google Vision API
- Parse blood pressure values
- Validate extracted data
- Confidence scoring

#### Health Service
- Generate health insights
- Provide personalized recommendations
- Assess cardiovascular risk
- Analyze trends
- Get category descriptions

## API Integration

### Firebase Firestore Structure
```
bloodPressureReadings/
├── userId (document)
│   ├── systolic: number
│   ├── diastolic: number
│   ├── pulse: number (optional)
│   ├── notes: string
│   ├── imageUrl: string (optional)
│   └── timestamp: datetime
```

### Google Vision API
Used for OCR to extract text from screenshots of BP devices.

## Data Privacy

- All data is stored securely in Firebase
- User authentication is encrypted
- Optional anonymous mode
- HIPAA-compliant infrastructure (when deployed properly)
- Regular data backups

## Customization

### Colors
Edit color references in screen stylesheets:
```javascript
const colors = {
  primary: '#E74C3C',      // Red
  success: '#27AE60',      // Green
  warning: '#F39C12',      // Orange
  danger: '#C0392B',       // Dark Red
  info: '#3498DB',         // Blue
};
```

### BP Categories
Modify thresholds in `healthService.js`:
```javascript
// Normal: < 120/80
// Elevated: 120-129 and < 80
// Stage 1: 130-139 or 80-89
// Stage 2: ≥ 140 or ≥ 90
```

## Performance Optimization

- Images are compressed before upload
- Charts are memoized to prevent unnecessary re-renders
- Firebase queries are indexed for fast retrieval
- Local caching with AsyncStorage

## Troubleshooting

### OCR not working
- Verify Google Vision API is enabled
- Check API key has Vision API permissions
- Ensure image is clear and readable
- Try a clearer photo or screenshot

### Firebase connection issues
- Verify credentials in `.env.local`
- Check Firebase project is active
- Ensure Firestore database is accessible
- Check internet connectivity

### Charts not displaying
- Ensure react-native-chart-kit is installed
- Verify data format is correct
- Check for empty datasets

## Future Enhancements

- [ ] Wearable integration (Apple Watch, Fitbit)
- [ ] Integration with health apps (Apple Health, Google Fit)
- [ ] Doctor collaboration features
- [ ] Advanced analytics with ML predictions
- [ ] Medication tracking
- [ ] Offline mode with sync
- [ ] Multi-language support
- [ ] Dark mode support

## Dependencies

- **React Native**: Core mobile framework
- **Expo**: Development platform
- **Firebase**: Backend and database
- **React Navigation**: App navigation
- **Chart Kit**: Data visualization
- **Async Storage**: Local data persistence
- **Image Picker**: Photo and camera access

## License

MIT License - feel free to use and modify this project.

## Support

For issues, questions, or suggestions:
1. Check the README documentation
2. Review Firebase and Google API documentation
3. Check Expo troubleshooting guides
4. Submit issues or pull requests

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note:** This app is for informational purposes. Always consult with a healthcare professional for medical advice. Not approved for medical use.
