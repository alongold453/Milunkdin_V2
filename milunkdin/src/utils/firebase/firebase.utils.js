// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   signInWithPopup,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signOut
// } from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   getDocs,
//   query,
//   collection,
//   CollectionReference,
//   writeBatch,
// } from "firebase/firestore";

// // Find these options in your Firebase console
// const firebaseConfig = {
//     apiKey: "AIzaSyC-3o-WlFynvm-JAclGGjwmx8BogY16His",
//     authDomain: "miluinkedin.firebaseapp.com",
//     projectId: "miluinkedin",
//     storageBucket: "miluinkedin.appspot.com",
//     messagingSenderId: "569622480688",
//   }
// // const firebaseapp = initializeApp(firebaseConfig);
// // const provider = new GoogleAuthProvider();

// provider.setCustomParameters({
//   prompt: "select_account",
// });

// export const auth = getAuth();
// export const db = getFirestore();

// export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

// export const onAuthStateChangedListner = (callback) => onAuthStateChanged(auth, callback);

// export const signInWithGoogle = async () => {
//   try {
//     await signInWithGooglePopup();
//   } catch (error) {
//     console.log(error);
//   }
// };
// export const SignOutUser = async () => {
//     await signOut(auth);
// };


// export const createUserDocumentFromAuth = async (userAuth, additionalInformation) => {
//     // console.log('userAuth', userAuth)
//     if (!userAuth) return;
//     const userDocRef = doc(db, 'users', userAuth.uid);

//     const userSnapshot = await getDoc(userDocRef);
//     if (!userSnapshot.exists()) {
//         const { displayName, email } = userAuth;
//         const createdAt = new Date();
//         try {
//             await setDoc(userDocRef, {
//                 displayName,
//                 email,
//                 createdAt,
//                 ...additionalInformation
//             })
//         } 
//         catch (err) {
//             console.log(`error creating the user`, err.message);
//         }
//     }
//     return userDocRef;
// };


// // export default function Auth() {
// //   const { currentUser, setCurrentUser } = useContext(UserContext);
// //   useEffect(() => {
// //     return firebase.auth().onAuthStateChanged(async (user) => {
// //       if (user) {
// //         const token = await user.getIdToken();
// //         const idTokenResult = await user.getIdTokenResult();
// //         const hasuraClaim =
// //           idTokenResult.claims["https://hasura.io/jwt/claims"];

// //         if (hasuraClaim) {
// //           setCurrentUser({ status: "in", user, token });
// //           //   setAuthState({ status: "in", user, token });
// //         } else {
// //           // Check if refresh is required.
// //           const metadataRef = firebase
// //             .database()
// //             .ref("metadata/" + user.uid + "/refreshTime");

// //           metadataRef.on("value", async (data) => {
// //             if (!data.exists) return;
// //             // Force refresh to pick up the latest custom claims changes.
// //             const token = await user.getIdToken(true);
// //             setCurrentUser({ status: "in", user, token });
// //           });
// //         }
// //       } else {
// //         setCurrentUser({ status: "out" });
// //       }
// //     });
// //   }, []);
// // }
