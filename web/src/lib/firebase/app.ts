// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
let firebaseConfig: FirebaseOptions;
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG === "development") {
  firebaseConfig = {
    apiKey: "AIzaSyDUO5xq_DVO0mX6hHAQa2BnivDj0CztTQs",
    authDomain: "relay-dc44e.firebaseapp.com",
    projectId: "relay-dc44e",
    storageBucket: "relay-dc44e.appspot.com",
    messagingSenderId: "330991658176",
    appId: "1:330991658176:web:5401e95790ee7a9da5b925",
    measurementId: "G-B5CRDYV6G4",
  };
} else if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG === "production") {
  firebaseConfig = {
    apiKey: "AIzaSyAJI0zq4FxnYfiHePccRZcgZGy5caOLEu4",
    authDomain: "relay-bfaa1.firebaseapp.com",
    projectId: "relay-bfaa1",
    storageBucket: "relay-bfaa1.appspot.com",
    messagingSenderId: "373269149161",
    appId: "1:373269149161:web:bbc8c2db338bbe75910778",
    measurementId: "G-YN1MR356KQ",
  };
} else {
  throw new Error("Couldn't load Firebase Config");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
// export const analytics = getAnalytics(app);

if (process.env.NEXT_PUBLIC_USE_EMULATORS === "true") {
  connectFirestoreEmulator(firestore, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  // connectFunctionsEmulator(functions, "localhost", 5001);
}
