// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjjV7kKu76YQoOISrFxgmGUDRD9E2Hhu8",
  authDomain: "nextjs-voting.firebaseapp.com",
  databaseURL: "https://nextjs-voting-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nextjs-voting",
  storageBucket: "nextjs-voting.appspot.com",
  messagingSenderId: "909153346392",
  appId: "1:909153346392:web:136fcc6c40f317a5667b2d",
  measurementId: "G-01WWQK735C"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app)