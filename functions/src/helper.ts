import { bucket } from "./admin";

export function getProfilePic(userId: string) {
  // get the profile pic in development mode
  if (process.env.FUNCTIONS_EMULATOR === "true") {
    return bucket.file(`profile-pics/${userId}`).publicUrl();
  }

  // get the profile pic in production mode
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(`profile-pics/${userId}`)}`;
}
