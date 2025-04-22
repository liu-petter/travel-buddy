import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "wsuzprtravelbuddy.firebaseapp.com",
  projectId: "wsuzprtravelbuddy",
  storageBucket: "wsuzprtravelbuddy.firebasestorage.app",
  messagingSenderId: "507500331509",
  appId: "1:507500331509:web:3bb80d9d5ff25c7ea3e0bc",
  measurementId: "G-DLE62DLFWG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
