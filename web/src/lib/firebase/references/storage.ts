import { ref } from "firebase/storage";
import { storage } from "../app";

export const storageRef = ref(storage);

export const profilePicsRef = ref(storage, 'profile-pics')

export const getProfilePicRef = (userId: string) => {
    return ref(profilePicsRef, userId);
}