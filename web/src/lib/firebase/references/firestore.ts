import { CollectionReference, DocumentReference, collection, doc } from "firebase/firestore";
import { firestore } from "../app";
import { User } from "../firestore-types/users";
import { Game, Room, uid } from "../firestore-types/game";

export const userCollection = collection(firestore, "users") as CollectionReference<User>;

export const gamesCollection = collection(firestore, "games") as CollectionReference<Game>;

export function getGameDoc(gameId: string): DocumentReference<Game> {
    return doc(gamesCollection, gameId) as DocumentReference<Game>
}

export function getPlayerRoom(gameId: string, userId: uid): DocumentReference<Room> {
    return doc(getGameDoc(gameId), `/rooms/${userId}`) as DocumentReference<Room>;
}
