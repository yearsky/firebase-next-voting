// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Konfigurasi Firebase untuk aplikasi web pertama
const firebaseConfig = {
  apiKey: "AIzaSyArttKVzGg7XtZGFACvKqLaw68mmRJLG3c",
  authDomain: "secondary-db-ae5a8.firebaseapp.com",
  databaseURL:
    "https://secondary-db-ae5a8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "secondary-db-ae5a8",
  storageBucket: "secondary-db-ae5a8.appspot.com",
  messagingSenderId: "204528471659",
  appId: "1:204528471659:web:722687f66a1bb1ed1ceb2e",
  measurementId: "G-PNLQTL398E",
};

// Konfigurasi Firebase untuk aplikasi web kedua
const firebaseConfigSecondary = {
  apiKey: "AIzaSyBjjV7kKu76YQoOISrFxgmGUDRD9E2Hhu8",
  authDomain: "nextjs-voting.firebaseapp.com",
  databaseURL:
    "https://nextjs-voting-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nextjs-voting",
  storageBucket: "nextjs-voting.appspot.com",
  messagingSenderId: "909153346392",
  appId: "1:909153346392:web:136fcc6c40f317a5667b2d",
  measurementId: "G-01WWQK735C",
};

// Initialize Firebase untuk aplikasi pertama
export const app = initializeApp(firebaseConfig);
// export const database = getFirestore(app);
export const database = initializeFirestore(app, {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
});

// // Initialize Firebase untuk aplikasi kedua
// export const appSecondary = initializeApp(firebaseConfigSecondary);
// export const databaseSecondary = getFirestore(appSecondary);
