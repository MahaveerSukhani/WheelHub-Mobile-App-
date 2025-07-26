// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
// import {
//   initializeAuth,
//   getAuth,
//   GoogleAuthProvider,
//   FacebookAuthProvider,
//   getReactNativePersistence,
//   signOut as firebaseSignOut,
// } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyD3kPhElyy_seFbsvIRci-tgcYuF1iOeq4",
//   authDomain: "wheel-hub.firebaseapp.com",
//   projectId: "wheel-hub",
//   storageBucket: "wheel-hub.appspot.com",
//   messagingSenderId: "458366935407",
//   appId: "1:458366935407:android:d95263820bb1be8a25089a",
// };

// const app = initializeApp(firebaseConfig);

// const db = getFirestore(app);

// let auth = getAuth();
// if (!auth?.app) {
//   auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//   });
// }

// const fetchUsersAndMechanics = async () => {
//   try {
//     const usersSnapshot = await getDocs(collection(db, 'users'));
//     const users = usersSnapshot.docs.map((doc) => doc.data());

//     const mechanicsSnapshot = await getDocs(collection(db, 'mechanics'));
//     const mechanics = mechanicsSnapshot.docs.map((doc) => doc.data());

//     return { users, mechanics };
//   } catch (error) {
//     console.error("Error fetching users and mechanics: ", error);
//     return { users: [], mechanics: [] }; 
//   }
// };

// // Function to send a message
// const sendMessage = async (message, senderEmail, recipientEmail) => {
//   try {
//     await addDoc(collection(db, 'messages'), {
//       text: message,
//       senderEmail,
//       recipientEmail,
//       timestamp: new Date(),
//     });
//   } catch (error) {
//     console.error("Error sending message: ", error);
//   }
// };

// const signOut = async () => {
//   try {
//     await firebaseSignOut(auth); 
//     console.log("User signed out successfully.");
//   } catch (error) {
//     console.error("Error signing out: ", error);
//   }
// };

// const googleProvider = new GoogleAuthProvider();
// const facebookProvider = new FacebookAuthProvider();

// export { auth, googleProvider, facebookProvider, db, fetchUsersAndMechanics, sendMessage, signOut };


import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD3kPhElyy_seFbsvIRci-tgcYuF1iOeq4",
  authDomain: "wheel-hub.firebaseapp.com",
  projectId: "wheel-hub",
  storageBucket: "wheel-hub.appspot.com",
  messagingSenderId: "458366935407",
  appId: "1:458366935407:android:d95263820bb1be8a25089a",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const fetchUsersAndMechanics = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map((doc) => doc.data());

    const mechanicsSnapshot = await getDocs(collection(db, 'mechanics'));
    const mechanics = mechanicsSnapshot.docs.map((doc) => doc.data());

    return { users, mechanics };
  } catch (error) {
    console.error("Error fetching users and mechanics: ", error);
    return { users: [], mechanics: [] };
  }
};

const sendMessage = async (message, senderEmail, recipientEmail) => {
  try {
    await addDoc(collection(db, 'messages'), {
      text: message,
      senderEmail,
      recipientEmail,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};

const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export { auth, db, fetchUsersAndMechanics, sendMessage, signOut };
