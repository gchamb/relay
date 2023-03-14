import { bucket } from "./admin";
import { operations } from "./firestore-types/game";

export function getProfilePic(userId: string) {
  // get the profile pic in development mode
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return bucket.file(`profile-pics/${userId}`).publicUrl();
  }

  // get the profile pic in production mode
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    `profile-pics/${userId}`
  )}?alt=media`;
}

export function generateRandomOperation() {
  return operations[Math.floor(Math.random() * operations.length)];
}

export function generateRandomNumbers(): [number, number] {
  const numOne = Math.floor(Math.random() * 100);
  const numTwo = Math.floor(Math.random() * 100);
  return [numOne, numTwo];
}
