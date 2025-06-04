import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWNo1qsdfRIpaeXWsIfveYHS96fHEa8Nw",
  authDomain: "react-sample-taskboard.firebaseapp.com",
  projectId: "react-sample-taskboard",
  storageBucket: "react-sample-taskboard.firebasestorage.app",
  messagingSenderId: "748671549039",
  appId: "1:748671549039:web:7549725ecca11bca67579a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const db= getFirestore(app);