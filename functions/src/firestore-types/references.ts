import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { firestoreDB } from "../admin";
import type { User } from "./users";
import type { Game, Player } from "./game";

export const userCollection = firestoreDB.collection("users") as CollectionReference<User>;

export const gameCollection = firestoreDB.collection("games") as CollectionReference<Game>;

export function getGamePlayersCollection(gameDocRef: DocumentReference<Game>): CollectionReference<Player> {
  return gameDocRef.collection("players") as CollectionReference<Player>;
}
