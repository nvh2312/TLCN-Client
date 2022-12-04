// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABEv_uDYkb7RBqkTb5B-9qD117WTup9c8",
  authDomain: "sign-in-a2a59.firebaseapp.com",
  projectId: "sign-in-a2a59",
  storageBucket: "sign-in-a2a59.appspot.com",
  messagingSenderId: "982383966074",
  appId: "1:982383966074:web:d13f2164f3c2b17d2648c3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
