// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdSdMc8zW_bJx-A_BS-Q5EBNS1w5jwLiE",
  authDomain: "kcmcweb.firebaseapp.com",
  projectId: "kcmcweb",
  storageBucket: "kcmcweb.firebasestorage.app",
  messagingSenderId: "750718804555",
  appId: "1:750718804555:web:c36e5dc2d95df98a0f23ce",
  measurementId: "G-74Q7EDSWZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);