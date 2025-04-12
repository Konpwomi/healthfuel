import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCs1KyJdiyk1viFeuEH-0xJ29aQYNq_6fY",
  authDomain: "health-fuel.firebaseapp.com",
  projectId: "health-fuel",
  storageBucket: "health-fuel.firebasestorage.app",
  messagingSenderId: "226494762000",
  appId: "1:226494762000:web:d7121e3564c655e2484e95"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Use standard auth without explicit persistence
// AsyncStorage will still be used by default in React Native
export const auth = getAuth(app);