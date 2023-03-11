import { Game, Topics, isCapacity, isTopic, uid } from "../firestore-types/game";

export type CreateGameRequest = { topic: Topics; capacity: Game["capacity"]; inviteOnly: boolean };
export type CreateGameResponse = { gameId: string };

export type JoinGameRequest = { gameId: string };

export type InvitePlayerRequest = { gameId: string; invitee: uid };

export function isCreateGameRequest(data: unknown): data is CreateGameRequest {
  if (data === null || data == undefined || typeof data !== "object") {
    return false;
  }

  return (
    "topic" in data &&
    typeof data.topic == "string" &&
    isTopic(data.topic) &&
    "capacity" in data &&
    typeof data.capacity === "number" &&
    isCapacity(data.capacity) &&
    "inviteOnly" in data &&
    typeof data.inviteOnly === "boolean"
  );
}

export function isJoinGameRequest(data: unknown): data is JoinGameRequest {
  if (data === null || data == undefined || typeof data !== "object") {
    return false;
  }

  return "gameId" in data && typeof data.gameId === "string";
}

export function isInvitePlayerRequest(data: unknown): data is InvitePlayerRequest {
  if (data === null || data == undefined || typeof data !== "object") {
    return false;
  }

  return "gameId" in data && typeof data.gameId === "string" && "invitee" in data && typeof data.invitee === "string";
}
