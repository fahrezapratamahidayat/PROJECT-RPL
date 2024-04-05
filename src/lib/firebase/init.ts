// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export default app

// const firestore = getFirestore(app);

// export { app, firestore };

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDGszsrvbieGYaGpAqNPZ3k4_6uy5z3Tf8",
  authDomain: "project-rpl-e8b62.firebaseapp.com",
  databaseURL: "https://project-rpl-e8b62-default-rtdb.firebaseio.com",
  projectId: "project-rpl-e8b62",
  storageBucket: "project-rpl-e8b62.appspot.com",
  messagingSenderId: "206872008268",
  appId: "1:206872008268:web:1b441033685d2c062006e9"
};
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // if already initialized, use that one
}

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const realtime = getDatabase(app);
