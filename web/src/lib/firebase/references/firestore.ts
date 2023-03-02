import { CollectionReference, collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../app";
import { User } from "../firestore-types/users";

export const userCollection = collection(firestore, "/users") as CollectionReference<User>;
