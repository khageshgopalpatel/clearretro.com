import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import { getAnalytics, type Analytics, logEvent as firebaseLogEvent } from "firebase/analytics";

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

// Connect to emulators if in test mode
if (import.meta.env.PUBLIC_USE_EMULATORS) {

  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

export const provider = new GoogleAuthProvider();
export let analytics: Analytics;

if (typeof window !== "undefined") {
    // Only initialize analytics/performance if NOT using emulators
    if (!import.meta.env.PUBLIC_USE_EMULATORS) {
        // Initialize Performance Monitoring
        getPerformance(app);
        // Initialize Analytics
        analytics = getAnalytics(app);
    } else {

    }
}

/**
 * Custom logEvent wrapper that respects the 'exclude_analytics' flag in localStorage.
 * This allows us to exclude specific users (like developers) from tracking.
 */
export const logEvent = (analyticsInstance: Analytics, eventName: string, eventParams?: { [key: string]: any }) => {
  if (typeof window !== "undefined" && localStorage.getItem("exclude_analytics") === "true") {
    // Excluded from analytics
    return;
  }
  if (analyticsInstance) {
    firebaseLogEvent(analyticsInstance, eventName, eventParams);
  }
};
