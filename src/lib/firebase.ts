// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "mood-bloom-34ebg",
  "appId": "1:125934430235:web:441445275ebe95d43b70be",
  "storageBucket": "mood-bloom-34ebg.firebasestorage.app",
  "apiKey": "AIzaSyDb83vpAfsHGMRDySAkoX4heQi7r8wrbqk",
  "authDomain": "mood-bloom-34ebg.firebaseapp.com",
  "messagingSenderId": "125934430235"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
