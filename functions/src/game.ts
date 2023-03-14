import * as functions from "firebase-functions";
import {
  CreateGameResponse,
  isCreateGameRequest,
  isDeleteInviteRequest,
  isInvitePlayerRequest,
  isJoinGameRequest,
  isStartGameRequest,
} from "./function-types/types";
import { gameCollection, getRoomsCollection, userCollection } from "./firestore-types/references";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { generateRandomNumbers, generateRandomOperation, getProfilePic } from "./helper";
import { firestoreDB } from "./admin";
import { uid } from "./firestore-types/game";

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

    const players = Object.keys(game.playersPublic);
    const playersLength = players.length;

    if (players.includes(auth.uid)) {
      throw new functions.https.HttpsError("failed-precondition", "You already in the game!");
    }

    if (game.state !== "WAIT") {
      throw new functions.https.HttpsError("failed-precondition", "Game is in session!");
    }

    if (game.inviteOnly && (game.invitees === undefined || !game.invitees.includes(auth.uid))) {
      throw new functions.https.HttpsError("failed-precondition", "You must be invited to join!");
    }

    if (game.capacity === playersLength) {
      throw new functions.https.HttpsError("failed-precondition", "Game has reached capacity!");
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
    const inviteeUserSnapshot = await transaction.get(inviteeDocRef);
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

    if (game.capacity === Object.keys(game.playersPublic).length) {
      throw new functions.https.HttpsError("permission-denied", "Game has reached capacity!");
    }

    // to eliminate spamming someone with invites from the same game
    for (const { gameId } of invitee.invites) {
      if (gameId === data.gameId) {
        throw new functions.https.HttpsError("already-exists", "You already invited this user!");
      }
    }

    transaction.update(gameDocRef, {
      invitees: FieldValue.arrayUnion(data.invitee),
    });

    transaction.update(inviteeDocRef, {
      invites: FieldValue.arrayUnion({ gameId: data.gameId, host: user.nickname, sentAt: Timestamp.now() }),
    });
  });
});

export const deleteInvite = functions.https.onCall(async (data: unknown, context): Promise<void> => {
  const { auth } = context;

  if (auth === undefined) {
    throw new functions.https.HttpsError("unauthenticated", "You are not signed in!");
  }

  // validate data
  if (!isDeleteInviteRequest(data)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid Delete Invite Request!");
  }

  await firestoreDB.runTransaction(async (transaction) => {
    // check if they have a user document
    const userDocRef = userCollection.doc(auth.uid);
    const userSnapshot = await transaction.get(userDocRef);
    const user = userSnapshot.data();

    if (!userSnapshot.exists || user === undefined) {
      throw new functions.https.HttpsError("not-found", "User doesn't exist!");
    }

    // to make it the sentAt property into a timestamp instead of object with properties
    const transformData = {
      ...data,
      sentAt: new Timestamp(data.sentAt.seconds, data.sentAt.nanoseconds),
    };

    transaction.update(userDocRef, {
      invites: FieldValue.arrayRemove(transformData),
    });
  });
});

export const startGame = functions.https.onCall(async (data: unknown, context): Promise<void> => {
  const { auth } = context;

  if (auth === undefined) {
    throw new functions.https.HttpsError("unauthenticated", "You are not signed in!");
  }

  // validate data
  if (!isStartGameRequest(data)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid Start Game Request!");
  }

  await firestoreDB.runTransaction(async (transaction) => {
    const gameDocRef = gameCollection.doc(data.gameId);
    const gameSnapshot = await transaction.get(gameDocRef);
    const game = gameSnapshot.data();

    if (!gameSnapshot.exists || game === undefined) {
      throw new functions.https.HttpsError("not-found", "Game doesn't exist!");
    }


    if (game.playersPublic[auth.uid].host === undefined) {
      throw new functions.https.HttpsError("permission-denied", "Not allowed to invite players!");
    }

    const playerUids: uid[] = Object.keys(game.playersPublic);

    for (const uid of playerUids) {
      const playerRoomDoc = getRoomsCollection(gameDocRef).doc(uid);
      const operation = generateRandomOperation();
      const [numOne, numTwo] = generateRandomNumbers();

      transaction.create(playerRoomDoc, {
        operation,
        numOne,
        numTwo,
      });
    }

    transaction.update(gameDocRef, {
      state: "GAME",
    });
  });
});
