import { AuthErrorCodes } from "firebase/auth";
import { getDocs, query, where } from "firebase/firestore";
import { userCollection } from "./references/firestore";

export function transformError(errorCode: string): { method: "GOOGLE" | "EMAIL"; error: string } {
  switch (errorCode) {
    // createUserWithEmailAndPassword and signInWithEmailAndPassword errors
    case AuthErrorCodes.EMAIL_EXISTS:
      return { method: "EMAIL", error: "Email already exists!" };
    case AuthErrorCodes.INVALID_EMAIL:
      return { method: "EMAIL", error: "Invalid Email!" };
    case AuthErrorCodes.WEAK_PASSWORD:
      return { method: "EMAIL", error: "Password must at least 6 characters!" };
    case AuthErrorCodes.USER_DELETED:
      return { method: "EMAIL", error: "User doesn't exist!" };
    case AuthErrorCodes.INVALID_PASSWORD:
      return { method: "EMAIL", error: "Wrong Password!" };
    // signUpWithPopUp errors
    case AuthErrorCodes.POPUP_CLOSED_BY_USER:
      return { method: "GOOGLE", error: "Closed Popup prematurely" };
    default:
      return { method: "EMAIL", error: errorCode };
  }
}

export async function isUniqueNickname(nickname: string): Promise<boolean> {
  const q = query(userCollection, where("nickname", "==", nickname));

  const userSnapshot = await getDocs(q);

  return userSnapshot.empty;
}
