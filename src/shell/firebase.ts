import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { enableIndexedDbPersistence, getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Lazy initialize analytics only when needed
let analyticsInstance: any = null;
export const getAnalyticsLazy = () => {
  if (!analyticsInstance && typeof window !== 'undefined') {
    analyticsInstance = getAnalytics(app);
  }
  return analyticsInstance;
};

// Initialize Firestore with optimizations
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: false,
  experimentalAutoDetectLongPolling: true
});

const storage = getStorage(app);

// Enable offline cache asynchronously
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((error) => {
    // Persistence not critical for initial load
  });
}

export { app, db, storage };
export const analytics = analyticsInstance;
