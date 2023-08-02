const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { createClient, gql } = require('@urql/core');
const Lokkaa = require('lokka').Lokka
const Transport = require('lokka-transport-http').Transport

admin.initializeApp(functions.config().firebase);

// On sign up.

exports.processSignUp = functions.auth.user().onCreate(async user => {
  const customClaims = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user", "test", "mador_manager", "mador_member"],
      "x-hasura-user-id": user.uid
    }
  };

  return admin
    .auth()
    .setCustomUserClaims(user.uid, customClaims)
    .then(() => {

      // register the users to the database

      const client = new Lokkaa({
        transport: new Transport(`https://innocent-lemming-13.hasura.app/v1/graphql`, { headers: {
          "x-hasura-admin-secret": "zmqjascyz7YrkFric7zip7QHF0ZQaeODUkm6N1vpLi3ckPvKfuO64j3QOM0uhPbh"
        }}),
      })
      functions.logger.debug(      
      {
        email: user.email,
        name: user.displayName,
        user_id: user.uid
      } )
      const mutationQuery = `($email: String!, $name: String!, $user_id: String!){
        createUser: insert_users_one(object: { email: $email, name: $name, user_id: $user_id }) {
          email
          name
          user_id
        }
      }`;
      const variables =  {
        email: user.email,
        name: user.displayName,
        user_id: user.uid
      };

      client.mutate(mutationQuery, variables).then(resp => {
        functions.logger.debug(`resp: ${resp}`)
      }).catch(err => {
        functions.logger.err(`myerror: ${err}`)
      })
    
      // Update real-time database to notify client to force refresh.
      const metadataRef = admin.database().ref("metadata/" + user.uid);
      // Set the refresh time to the current UTC timestamp.
      // This will be captured on the client to force a token refresh.
      return metadataRef.set({ refreshTime: new Date().getTime() });
    })
    .catch(error => {
      console.log(error);
    });
});
