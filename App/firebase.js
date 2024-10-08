// firebase.js
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCv7SGIwDa8uEZuMiNqvIZAURanYXjy_gY",
  authDomain: "testapp-8fad4.firebaseapp.com",
  projectId: "testapp-8fad4",
  storageBucket: "testapp-8fad4.appspot.com",
  messagingSenderId: "929893510176",
  appId: "1:929893510176:web:c87f724b5696bbd5ed2045",
  measurementId: "G-YLPVEXNPLS",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
