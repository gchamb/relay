import * as functions from "firebase-functions";
import { CreateGameResponse, isCreateGameRequest } from "./function-types/types";
import { gameCollection, getGamePlayersCollection, userCollection } from "./firestore-types/references";
import { Timestamp } from "firebase-admin/firestore";

export const createGame = functions.https.onCall(async (data: unknown, context): Promise<CreateGameResponse> => {
  const { auth } = context;

  if (auth === undefined) {
    throw new functions.https.HttpsError("unauthenticated", "You are not signed in!");
  }

  // check if they have a user document
  const userDocRef = userCollection.doc(auth.uid);
  const userSnapshot = await userDocRef.get();
  const user = userSnapshot.data();

  if (!userSnapshot.exists || user === undefined) {
    throw new functions.https.HttpsError("not-found", "You are not signed in!");
  }

  // validate data
  if (!isCreateGameRequest(data)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid Create Game Request!");
  }

  try {
    // create the game
    const gameDocRef = await gameCollection.add({
      topic: data.topic,
      capacity: data.capacity,
      state: "WAIT",
      playersPublic: {
        [auth.uid]: {
          nickname: user.nickname,
          score: 0,
          profilePic: "hello world", //TODO: remove this eventually
        },
      },
      end: Timestamp.now(),
    });

    // add player to the subcollection
    const playersCollection = getGamePlayersCollection(gameDocRef);

    await playersCollection.doc(auth.uid).create({
      corrects: 0,
      incorrects: 0,
    });

    return { gameId: gameDocRef.id };
  } catch (error) {
    throw new functions.https.HttpsError("internal", "Cannot create document");
  }
});
