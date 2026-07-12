import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getStorage, type Storage } from 'firebase-admin/storage';

// Initialize Firebase Admin only once
let app: App;
if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "posko-ukm-jasuda",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@posko-ukm-jasuda.iam.gserviceaccount.com",
        // Format the private key to handle line breaks correctly if it comes from env
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "posko-ukm-jasuda.firebasestorage.app",
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
    app = getApps()[0];
  }
} else {
  app = getApps()[0];
}

const adminDb: Firestore = getFirestore();
const adminAuth: Auth = getAuth();
const adminStorage: Storage = getStorage();

export { adminDb, adminAuth, adminStorage, app as adminApp };
