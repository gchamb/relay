import type { Timestamp } from "firebase-admin/firestore";

export type uid = string;

export type PlayerPublic = {
  username: string;
  score: number;
};

/**
 * th type of documents `/lobbies/{code}/players/{uid}`
 */
export type Player = {
  question: string;
  corrects: number;
  incorrects: number;
};

/**
 * the type of documents `/lobbies/{code}`
 */
export type Lobby = {
  /**
   * the topic that the questions will be on
   */
  topic: "MATH" | "GEOGRAPHY" | "SCIENCE";

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
