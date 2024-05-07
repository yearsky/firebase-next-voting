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
  apiKey: "AIzaSyDJ6kYeARzvUwTOg3lrqqgnZEWoDH3lp4A",
  authDomain: "fir-tutor-19431.firebaseapp.com",
  databaseURL: "https://fir-tutor-19431.firebaseio.com",
  projectId: "fir-tutor-19431",
  storageBucket: "fir-tutor-19431.appspot.com",
  messagingSenderId: "1009325914776",
  appId: "1:1009325914776:web:624779cee91c3a21d3aeed",
};

// Initialize Firebase untuk aplikasi pertama
export const app = initializeApp(firebaseConfigSecondary);
// export const database = getFirestore(app);
export const database = initializeFirestore(
  app,
  {
    localCache: persistentLocalCache(
      /*settings*/ { tabManager: persistentMultipleTabManager() }
    ),
  },
  "backup"
);

// // Initialize Firebase untuk aplikasi kedua
// export const appSecondary = initializeApp(firebaseConfigSecondary);
// export const databaseSecondary = getFirestore(appSecondary);
