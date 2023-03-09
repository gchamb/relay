import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

initializeApp();

export const firestoreDB = getFirestore();
export const storage = getStorage();
export const bucket = storage.bucket();
