import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlw8ELsbfDPk4lm0HExMQRHwbw1COdHq8",
  authDomain: "sdg-bridge.firebaseapp.com",
  projectId: "sdg-bridge",
  storageBucket: "sdg-bridge.firebasestorage.app",
  messagingSenderId: "153006079323",
  appId: "1:153006079323:web:f611bf903b0cfdb32fee7e",
  measurementId: "G-C2YCYBBXGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;