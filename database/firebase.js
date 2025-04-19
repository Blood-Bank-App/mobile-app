import { initializeApp } from 'firebase/app';

var firebaseConfig = {
  apiKey: "AIzaSyC5i50YtpTLeTrNUtWvq-LmA6Xl3kDUua8",
  authDomain: "bloodapp-e82c0.firebaseapp.com",
  projectId: "bloodapp-e82c0",
  storageBucket: "bloodapp-e82c0.appspot.com",
  messagingSenderId: "389683037891",
  appId: "1:389683037891:web:bf95c25274beb318310476",
  measurementId: "G-QET0XWZKWP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const database = getDatabase(app);

export { app, auth, database };