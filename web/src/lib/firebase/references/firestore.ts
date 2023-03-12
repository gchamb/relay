import { CollectionReference, collection } from "firebase/firestore";
import { firestore } from "../app";
import { User } from "../firestore-types/users";
import { Game } from "../firestore-types/game";

export const userCollection = collection(firestore, "users") as CollectionReference<User>;

export const gamesCollection = collection(firestore, "games") as CollectionReference<Game>;
