import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import firebase from "firebase-admin";

const initialized = getApps().length;

const app = initialized
  ? getApp()
  : initializeApp({
      credential: firebase.credential.cert({
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

if (!initialized) {
  firestore.settings({
    ignoreUndefinedProperties: true,
  });
}

export const firebaseServer = { app, firestore, auth, storage };
