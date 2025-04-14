
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6SKA1y8b_wuZej-o0jKuSZPWB3NHgy4g",
  authDomain: "theweddingmatchph.firebaseapp.com",
  projectId: "theweddingmatchph",
  storageBucket: "theweddingmatchph.appspot.com", // Corrected from .firebasestorage.app
  messagingSenderId: "875030223852",
  appId: "1:875030223852:web:889a84eb7256674c09bec9",
  measurementId: "G-VGG0MZMC72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics conditionally
const initializeAnalytics = async () => {
  try {
    if (await isSupported()) {
      return getAnalytics(app);
    }
    return null;
  } catch (error) {
    console.error("Firebase Analytics not supported in this environment:", error);
    return null;
  }
};

// Initialize analytics in the background
initializeAnalytics();

export { app, auth, db, storage };
