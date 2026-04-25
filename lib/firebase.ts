import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCwmEBt-Aij0NwTuqqCp5gzz9R3O8VvjnQ",
  authDomain: "studypal-companion-app.firebaseapp.com",
  projectId: "studypal-companion-app",
  storageBucket: "studypal-companion-app.appspot.com",
  messagingSenderId: "849198329344",
  appId: "1:849198329344:web:7f610e20e8a75d5e56e875",
};

// Prevent re-initialization in Next.js hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
