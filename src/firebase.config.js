// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNF-s1Ow9NDOuu7emkBPyiWHKCGImXwu4",
  authDomain: "house-marketplace-app-a197f.firebaseapp.com",
  projectId: "house-marketplace-app-a197f",
  storageBucket: "house-marketplace-app-a197f.appspot.com",
  messagingSenderId: "823581890865",
  appId: "1:823581890865:web:1f9f395e99a8d5c2b1b810"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();