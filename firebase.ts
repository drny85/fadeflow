import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// import { getFunctions} from 'firebase/functions';

const firebaseConfig = {
   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

const storage = getStorage(app);

// const functions = getFunctions(app, 'us-central1');

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export { auth, db, storage, app };
