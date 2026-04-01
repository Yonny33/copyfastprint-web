// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6GpnfuM9aJpH1-TEA5bWZWVA-x2jDnrE",
  authDomain: "copyfast-control-v2.firebaseapp.com",
  projectId: "copyfast-control-v2",
  storageBucket: "copyfast-control-v2.firebasestorage.app",
  messagingSenderId: "331896837052",
  appId: "1:331896837052:web:375bab6095e0e39cd651b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export the services for use in other parts of the app
export { app, auth, db };
