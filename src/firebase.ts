import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBseBGHmL5Jsg202oEscJGbx-kZsSGoW08",
  authDomain: "temporary-ba1ff.firebaseapp.com",
  projectId: "temporary-ba1ff",
  storageBucket: "temporary-ba1ff.firebasestorage.app",
  messagingSenderId: "256616725111",
  appId: "1:256616725111:web:180c18fb18cfba2b9be472",
  measurementId: "G-HB46WFV8JY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);