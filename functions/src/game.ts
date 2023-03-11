import * as functions from "firebase-functions";
import {
  CreateGameResponse,
  isCreateGameRequest,
  isInvitePlayerRequest,
  isJoinGameRequest,
} from "./function-types/types";
import { gameCollection, userCollection } from "./firestore-types/references";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getProfilePic } from "./helper";
import { firestoreDB } from "./admin";

export const createGame = functions.https.onCall(async (data: unknown, context): Promise<CreateGameResponse> => {
  const { auth } = context;

  if (auth === undefined) {
    throw new functions.https.HttpsError("unauthenticated", "You are not signed in!");
  }

  // validate data
  if (!isCreateGameRequest(data)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid Create Game Request!");
  }

  // check if they have a user document
  const userDocRef = userCollection.doc(auth.uid);
  const userSnapshot = await userDocRef.get();
  const user = userSnapshot.data();

  if (!userSnapshot.exists || user === undefined) {
    throw new functions.https.HttpsError("not-found", "User doesn't exist!");
  }

  // get their profile pic
  const profilePic = getProfilePic(auth.uid);

  try {
    // create the game
    const gameDocRef = await gameCollection.add({
      topic: data.topic,
      capacity: data.capacity,
      state: "WAIT",
      inviteOnly: data.inviteOnly,
      playersPublic: {
        [auth.uid]: {
          nickname: user.nickname,
          score: 0,
          host: true,
          profilePic,
        },
      },
      end: Timestamp.now(),
    });

    return { gameId: gameDocRef.id };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Cannot create document");
  }
});

export const joinGame = functions.https.onCall(async (data: unknown, context): Promise<void> => {
  const { auth } = context;

  if (auth === undefined) {
    throw new functions.https.HttpsError("unauthenticated", "You are not signed in!");
  }

  // validate data
  if (!isJoinGameRequest(data)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid Join Game Request!");
  }

  // check if they have a user document
  const userDocRef = userCollection.doc(auth.uid);
  const userSnapshot = await userDocRef.get();
  const user = userSnapshot.data();
  const profilePic = getProfilePic(auth.uid);

  if (!userSnapshot.exists || user === undefined) {
    throw new functions.https.HttpsError("not-found", "User doesn't exist!");
  }

  await firestoreDB.runTransaction(async (transaction) => {
    const gameDocRef = gameCollection.doc(data.gameId);
    const gameSnapshot = await transaction.get(gameDocRef);
    const game = gameSnapshot.data();

    if (!gameSnapshot.exists || game === undefined) {
      throw new functions.https.HttpsError("not-found", "Game doesn't exist!");
    }

    const playersLength = Object.keys(game.playersPublic).length;

    if (game.capacity === playersLength) {
      throw new functions.https.HttpsError("failed-precondition", "Game has reached capacity!");
    }

    if (game.state !== "WAIT") {
      throw new functions.https.HttpsError("failed-precondition", "Game is in session!");
    }

    // join the game
    transaction.update(gameDocRef, {
      playersPublic: {
        ...game.playersPublic,
        [auth.uid]: {
          nickname: user.nickname,
          score: 0,
          profilePic,
        },
      },
    });
  });
});

export const invitePlayer = functions.https.onCall(async (data: unknown, context): Promise<void> => {
  const { auth } = context;

  if (auth === undefined) {
    throw new functions.https.HttpsError("unauthenticated", "You are not signed in!");
  }

  // validate data
  if (!isInvitePlayerRequest(data)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid Invite Player Request!");
  }

  // check if they have a user document
  const userDocRef = userCollection.doc(auth.uid);
  const userSnapshot = await userDocRef.get();
  const user = userSnapshot.data();

  if (!userSnapshot.exists || user === undefined) {
    throw new functions.https.HttpsError("not-found", "User doesn't exist!");
  }

  await firestoreDB.runTransaction(async (transaction) => {
    const gameDocRef = gameCollection.doc(data.gameId);
    const gameSnapshot = await transaction.get(gameDocRef);
    const game = gameSnapshot.data();

    const inviteeDocRef = userCollection.doc(data.invitee);
    const inviteeUserSnapshot = await transaction.get(gameDocRef);
    const invitee = inviteeUserSnapshot.data();

    if (!gameSnapshot.exists || game === undefined) {
      throw new functions.https.HttpsError("not-found", "Game doesn't exist!");
    }

    if (!inviteeUserSnapshot.exists || invitee === undefined) {
      throw new functions.https.HttpsError("not-found", "User doesn't exist!");
    }

    if (game.playersPublic[auth.uid].host === undefined) {
      throw new functions.https.HttpsError("permission-denied", "Not allowed to invite players!");
    }

    transaction.update(gameDocRef, {
      invitees: FieldValue.arrayUnion(data.invitee),
    });

    transaction.update(inviteeDocRef, {
      invites: FieldValue.arrayUnion({ gameId: data.gameId, host: user.nickname, sentAt: Timestamp.now() }),
    });
  });
});
