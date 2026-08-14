import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize anonymous authentication
signInAnonymously(auth).catch((error) => {
  console.error('Auth Error:', error);
});

export const firebaseService = {
  // Add blood pressure reading
  addBloodPressureReading: async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'bloodPressureReadings'), {
        userId: user.uid,
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse || null,
        notes: data.notes || '',
        imageUrl: data.imageUrl || null,
        timestamp: data.timestamp || new Date(),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding reading:', error);
      throw error;
    }
  },

  // Get latest reading
  getLatestReading: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const q = query(
        collection(db, 'bloodPressureReadings'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      return querySnapshot.docs[0].data();
    } catch (error) {
      console.error('Error fetching latest reading:', error);
      throw error;
    }
  },

  // Get weekly average
  getWeeklyAverage: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const q = query(
        collection(db, 'bloodPressureReadings'),
        where('userId', '==', user.uid),
        where('timestamp', '>=', weekAgo),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      let systolicSum = 0;
      let diastolicSum = 0;
      const count = querySnapshot.size;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        systolicSum += data.systolic;
        diastolicSum += data.diastolic;
      });

      return {
        systolic: Math.round(systolicSum / count),
        diastolic: Math.round(diastolicSum / count),
        readings: count,
      };
    } catch (error) {
      console.error('Error fetching weekly average:', error);
      throw error;
    }
  },

  // Get weekly data for chart
  getWeeklyData: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const q = query(
        collection(db, 'bloodPressureReadings'),
        where('userId', '==', user.uid),
        where('timestamp', '>=', weekAgo),
        orderBy('timestamp', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const labels = [];
      const systolic = [];
      const diastolic = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.timestamp.seconds * 1000);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        systolic.push(data.systolic);
        diastolic.push(data.diastolic);
      });

      return { labels, systolic, diastolic };
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      throw error;
    }
  },

  // Get monthly data for chart
  getMonthlyData: async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const q = query(
        collection(db, 'bloodPressureReadings'),
        where('userId', '==', user.uid),
        where('timestamp', '>=', monthAgo),
        orderBy('timestamp', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const labels = [];
      const systolic = [];
      const diastolic = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = new Date(data.timestamp.seconds * 1000);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        systolic.push(data.systolic);
        diastolic.push(data.diastolic);
      });

      return { labels, systolic, diastolic };
    } catch (error) {
      console.error('Error fetching monthly data:', error);
      throw error;
    }
  },

  // Get statistics
  getStats: async (period = 'weekly') => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const timeAgo = new Date();
      if (period === 'weekly') {
        timeAgo.setDate(timeAgo.getDate() - 7);
      } else {
        timeAgo.setMonth(timeAgo.getMonth() - 1);
      }

      const q = query(
        collection(db, 'bloodPressureReadings'),
        where('userId', '==', user.uid),
        where('timestamp', '>=', timeAgo),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      let highestSystolic = 0;
      let highestDiastolic = 0;
      let lowestSystolic = 300;
      let lowestDiastolic = 300;
      let systolicSum = 0;
      let diastolicSum = 0;
      let firstReading = null;
      let lastReading = null;

      querySnapshot.forEach((doc, index) => {
        const data = doc.data();
        
        if (index === querySnapshot.size - 1) firstReading = data;
        if (index === 0) lastReading = data;

        systolicSum += data.systolic;
        diastolicSum += data.diastolic;

        if (data.systolic > highestSystolic) highestSystolic = data.systolic;
        if (data.diastolic > highestDiastolic) highestDiastolic = data.diastolic;
        if (data.systolic < lowestSystolic) lowestSystolic = data.systolic;
        if (data.diastolic < lowestDiastolic) lowestDiastolic = data.diastolic;
      });

      const count = querySnapshot.size;
      const avgSystolic = Math.round(systolicSum / count);
      const avgDiastolic = Math.round(diastolicSum / count);

      // Determine trend
      let trend = null;
      if (firstReading && lastReading) {
        if (lastReading.systolic > firstReading.systolic) {
          trend = {
            direction: 'up',
            message: '📈 BP is trending up. Consider consulting your doctor.',
          };
        } else {
          trend = {
            direction: 'down',
            message: '📉 Great! Your BP is improving. Keep up the good work!',
          };
        }
      }

      return {
        highest: { systolic: highestSystolic, diastolic: highestDiastolic },
        lowest: { systolic: lowestSystolic, diastolic: lowestDiastolic },
        average: { systolic: avgSystolic, diastolic: avgDiastolic },
        count,
        trend,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};
