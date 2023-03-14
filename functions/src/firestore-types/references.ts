import { CollectionReference, DocumentReference } from "firebase-admin/firestore";
import { firestoreDB } from "../admin";
import type { User } from "./users";
import type { Game, Room } from "./game";

export const userCollection = firestoreDB.collection("users") as CollectionReference<User>;

export const gameCollection = firestoreDB.collection("games") as CollectionReference<Game>;

export function getRoomsCollection(gameDocRef: DocumentReference<Game>): CollectionReference<Room> {
  return gameDocRef.collection("rooms") as CollectionReference<Room>;
}
