import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaqU8nvPaDAHxTmFUAp_VQCHYSs8vFYSQ",
  authDomain: "foodlink-75c96.firebaseapp.com",
  projectId: "foodlink-75c96",
  storageBucket: "foodlink-75c96.firebasestorage.app",
  messagingSenderId: "36717379365",
  appId: "1:36717379365:web:716f6267b87a8af156a4cc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;