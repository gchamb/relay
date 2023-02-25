/**
 * the type of documents `/users/{uid}`
 */
export type User = {
  /**
   * the name that will be displayed in lobbies and settings
   */
  username: string;

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
};

export function usernameValidator(username: string): { valid: true } | { valid: false; reason: string } {
  if (username === "") {
    return { valid: false, reason: "Username must not be empty" };
  }
  if (username.length < 3) {
    return {
      valid: false,
      reason: "Username must be at least 3 characters long",
    };
  }

  if (username.length > 8) {
    return {
      valid: false,
      reason: "Username must be at most 8 characters long",
    };
  }

  if (username !== username.trim()) {
    return {
      valid: false,
      reason: "Username must not contain leading or trailing whitespace",
    };
  }

  if (username.search(/[^A-Za-z0-9-_ ]+/) >= 0) {
    return {
      valid: false,
      reason: "Username must not have special characters",
    };
  }

  return { valid: true };
}
