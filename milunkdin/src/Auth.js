import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database'
import React, { useState, useEffect, useContext } from "react";
import App from "./App";
import { makeVar } from '@apollo/client'
import { UserContext } from './context/user.context';
import { Button } from '@mui/material';
// import { getFirestore } from '@firebase/firestore';

// Find these options in your Firebase console
firebase.initializeApp({
  // databaseURL: "miluinkedin.eur3.firebasedatabase.app",
  apiKey: "AIzaSyC-3o-WlFynvm-JAclGGjwmx8BogY16His",
  authDomain: "miluinkedin.firebaseapp.com",
  projectId: "miluinkedin",
  storageBucket: "miluinkedin.appspot.com",
  messagingSenderId: "569622480688",

});

const provider = new firebase.auth.GoogleAuthProvider();

export default function Auth() {
  const [authState, setAuthState] = useState({ status: "loading" });
  const [userData, setUserData] = useContext(UserContext)
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();

        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];
        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
          setUserData(
            {
              user_id: user.uid,
              displayName: user.displayName,
              email: user.email,
              roles: []
            })
          
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref("metadata/" + user.uid + "/refreshTime");
          metadataRef.on("value", async data => {
            if (!data.exists) {
              return;
            }     
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
            makeVar(authState)
          });
        }    
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = async () => {
    try {
      setAuthState({ status: "loading" });
      await firebase.auth().signOut();
      setAuthState({ status: "out" });
    } catch (error) {
      console.log(error);
    }
  };

  let content;
  if (authState.status === "loading") {
    content = null;
  } else {
    content = (
      <>
        <div>
          {authState.status === "in" ? (
            <div>
              <h2>שלום, {authState.user.displayName}</h2>
              <Button variant='contained' onClick={signOut}>התנתק</Button>
            </div>
          ) : (
            <Button id='login' variant='contained' onClick={signInWithGoogle}>התחבר או הירשם באמצעות Google</Button>
          )}
        </div>

        <App authState={authState} />
      </>
    );
  }

  return <div className="auth">{content}</div>;
}
