import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAX2G2RDI_McsHdxcYyMGzbChDczMZhbc4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tournament-6a1d2.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tournament-6a1d2',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tournament-6a1d2.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1092341192676',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1092341192676:web:8d8d444dfd8e231e58d9f1'
}

export const isFirebaseConfigured = true

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const db = getFirestore(app)
export default app
