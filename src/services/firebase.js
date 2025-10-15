// File ini untuk konfigurasi Firebase di frontend React
// install Firebase SDK: npm install firebase

import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: "kang-buah-application.firebaseapp.com",
        projectId: "kang-buah-application",
        storageBucket: "kang-buah-application.firebasestorage.app",
        messagingSenderId: "685035005081",
        appId: "1:685035005081:web:a9d6c093db1769813c8408",
        measurementId: "G-VTFWE0LBBN",
    };


// Init Firebase App
const app = initializeApp(firebaseConfig)

// Firebase Auth & Google Provider
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export default app
