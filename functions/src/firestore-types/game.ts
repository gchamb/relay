import type { Timestamp } from "firebase-admin/firestore";

export const topics = ["MATH"] as const;
export type Topics = (typeof topics)[number];

export const gameState = ["WAIT", "GAME", "END"] as const;
export type GameState = (typeof gameState)[number];

export type uid = string;

export type PlayerPublic = {
  nickname: string;
  score: number;
  profilePic: string;
};

/**
 * the type of documents `/games/{gameId}/players/{uid}`
 */
export type Player = {
  question?: string;
  corrects: number;
  incorrects: number;
};

/**
 * the type of documents `/games/{gameId}`
 */
export type Game = {
  /**
   * the topic that the questions will be on
   */
  topic: Topics;

  /**
   * the state of the game
   */
  state: GameState;

  /**
   * the amount of people that can participate in a lobby
   */
  capacity: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * the players in the lobby that has info that is public
   */
  playersPublic: { [uid: uid]: PlayerPublic };

  /**
   * a minute timestamp in the future
   */
  end: Timestamp;

  /**
   * list of uids in order of their standing
   * @note uid[i] = i+1 place
   * @note only applies if the lobby's capacity is greater than 1
   */
  standings?: uid[];
};


export function isTopic(value: string): value is Topics {
  if (value === "MATH") {
    return true;
  }

  return false;
}

export function isCapacity(value: number): value is Game["capacity"] {
  if (value < 1) {
    return false;
  }
  if (value > 6) {
    return false;
  }

  return true;
}
