// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXFmWgTcrMJjlU09irnY_3ljMPhmiTW5w",
  authDomain: "malexe-1224a.firebaseapp.com",
  projectId: "malexe-1224a",
  storageBucket: "malexe-1224a.firebasestorage.app",
  messagingSenderId: "119613785691",
  appId: "1:119613785691:web:cd49b1cf13f9eb04fde17e",
  measurementId: "G-Q1E5VC08MC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);