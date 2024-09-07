// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-1f587.firebaseapp.com",
  projectId: "mern-blog-1f587",
  storageBucket: "mern-blog-1f587.appspot.com",
  messagingSenderId: "297025301388",
  appId: "1:297025301388:web:c310ac2faf0670027904a9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
