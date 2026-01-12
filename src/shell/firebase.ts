import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { enableIndexedDbPersistence, getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config - these are public values, safe to commit
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC3GFSa254AYMNjNNUF-SGu557TQxOZ0t0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sspirial-systems.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sspirial-systems",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sspirial-systems.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "188344302008",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:188344302008:web:08a623de849a39d3efb74d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MTFMSB66F6"
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
