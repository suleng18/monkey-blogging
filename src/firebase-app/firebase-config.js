import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDOxu9ynS4JYRf4_GY2rvTpmeulST8DuC0',
  authDomain: 'monkey-blogging-ec241.firebaseapp.com',
  projectId: 'monkey-blogging-ec241',
  storageBucket: 'monkey-blogging-ec241.appspot.com',
  messagingSenderId: '78908552808',
  appId: '1:78908552808:web:1a560e4c408ae2484b2ddd',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
