import { bucket } from "./admin";

export function getProfilePic(userId: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(`profile-pics/${userId}`)}`;
}
