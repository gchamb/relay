import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { userCollection } from "./references/firestore";

export const getUserDoc = async (userId: string) => {
  const userDocRef = doc(userCollection, userId);
  const userDoc = await getDoc(userDocRef);

  return { userDoc, userDocRef };
};

export const createUserDoc = async (userId: string, nickname: string) => {
  const userDocRef = doc(userCollection, userId);
  await setDoc(userDocRef, {
    nickname,
    correct: 0,
    incorrect: 0,
    firstPlaces: 0,
    invites: [],
  });
};

export const deleteUserDoc = async (userId: string) => {
  const userDocRef = doc(userCollection, userId);
  await deleteDoc(userDocRef);
};
