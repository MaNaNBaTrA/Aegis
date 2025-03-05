import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAB0SNJmjyMNJAkQm9lsTqV1JvGgkYl9Jw",
  authDomain: "aegis-16.firebaseapp.com",
  databaseURL: "https://aegis-16-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aegis-16",
  storageBucket: "aegis-16.firebasestorage.app",
  messagingSenderId: "433148190386",
  appId: "1:433148190386:web:695f91dfd067f9a5c4f3ab",
  measurementId: "G-WKR30HN1WW"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
