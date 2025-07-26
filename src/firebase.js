// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// PASTE THE CONFIG OBJECT YOU COPIED FROM THE FIREBASE WEBSITE HERE
const firebaseConfig = {
  apiKey: "AIzaSyDvriJ-F84cFSnsjPeTo6bZwLhN4nQqQH0",
  authDomain: "pulseai-blr.firebaseapp.com",
  projectId: "pulseai-blr",
  storageBucket: "pulseai-blr.firebasestorage.app",
  messagingSenderId: "667492565745",
  appId: "1:667492565745:web:72e3dbdda197de1c299f50",
  measurementId: "G-8DDLBR7QWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firestore
export const db = getFirestore(app);