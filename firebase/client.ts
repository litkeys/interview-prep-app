// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDscskQBMxWIsGT16Yq8qXECp7s8iLAmnA",
	authDomain: "prepwise-269f9.firebaseapp.com",
	projectId: "prepwise-269f9",
	storageBucket: "prepwise-269f9.firebasestorage.app",
	messagingSenderId: "1041831010409",
	appId: "1:1041831010409:web:267ec4de1240d372a1c2f8",
	measurementId: "G-3YCFPHKFHQ",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
