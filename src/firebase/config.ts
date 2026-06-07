import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

// Optional attempt to load dynamic config if provisioned, else use a placeholder or null
let firebaseConfig: any = {};
try {
  // @ts-ignore - config might not exist 
  firebaseConfig = require('../../firebase-applet-config.json');
} catch (e) {
  console.warn("Firebase config not found. Running in mock/preview mode.");
}

// In standard development or fallback, initialize conditionally
export const app: FirebaseApp | null = Object.keys(firebaseConfig).length ? initializeApp(firebaseConfig) : null;
export const db: Firestore | null = app ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;
