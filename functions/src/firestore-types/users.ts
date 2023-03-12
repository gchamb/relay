import { Timestamp } from "firebase-admin/firestore";

export type Invite = {
  gameId: string;
  host: string;
  sentAt: Timestamp;
};

/**
 * the type of documents `/users/{uid}`
 */
export type User = {
  /**
   * the name that will be displayed in lobbies and settings
   */
  nickname: string;

  /**
   * the amount of correct answers total
   */
  correct: number;

  /**
   * the amount of incorrect answers total
   */
  incorrect: number;

  /**
   * the amount of first place finishes total
   */
  firstPlaces: number;

  /**
   * list of invites to games
   */
  invites: Invite[];
};
