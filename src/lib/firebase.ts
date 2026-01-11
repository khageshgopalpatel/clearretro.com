import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID
};

import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

// ... existing imports ...

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with persistent cache, or get existing instance if already initialized (HMR)
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache()
  });
} catch (e) {
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;
export const provider = new GoogleAuthProvider();
export let analytics: Analytics;

if (typeof window !== "undefined") {
    // Initialize Performance Monitoring
    getPerformance(app);
    // Initialize Analytics
    analytics = getAnalytics(app);
}
