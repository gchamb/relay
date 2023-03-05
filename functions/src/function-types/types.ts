import { Game, Topics, isCapacity, isTopic } from "../firestore-types/game";

export type CreateGameRequest = { topic: Topics; capacity: Game["capacity"] };
export type CreateGameResponse = { gameId: string };

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
    isCapacity(data.capacity)
  );
}
