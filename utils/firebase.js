// Firebase configuration for Percent to AGI application
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Define firebase config only if all required variables are present
const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} : null;

// Initialize Firebase services
let app, db, auth, storage;

// Check if we're in the browser environment before initializing Firebase
// This prevents errors during SSR (Server-Side Rendering)
if (typeof window !== 'undefined') {
  try {
    // Only initialize Firebase if configuration is available
    if (firebaseConfig) {
      app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      storage = getStorage(app);
    } else {
      console.warn('Firebase configuration is missing. Please check your environment variables.');
    }
  } catch (error) {
    console.error('Firebase initialization error', error);
  }
}

export { app, db, auth, storage }; 