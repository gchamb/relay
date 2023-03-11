import { Game, Topics } from "./game";

export function nicknameValidator(nickname: string): { valid: true } | { valid: false; reason: string } {
  if (nickname === "") {
    return { valid: false, reason: "Nickname must not be empty" };
  }
  if (nickname.length < 3) {
    return {
      valid: false,
      reason: "Nickname must be at least 3 characters long",
    };
  }

  if (nickname.length > 8) {
    return {
      valid: false,
      reason: "Nickname must be at most 8 characters long",
    };
  }

  if (nickname !== nickname.trim()) {
    return {
      valid: false,
      reason: "Nickname must not contain leading or trailing whitespace",
    };
  }

  if (nickname.search(/[^A-Za-z0-9-_ ]+/) >= 0) {
    return {
      valid: false,
      reason: "Nickname must not have special characters",
    };
  }

  return { valid: true };
}

function isSquareDimens(file: File): Promise<boolean> {
  const createImageUrl = URL.createObjectURL(file);

  const tempImage = new Image();
  tempImage.src = createImageUrl;

  return new Promise((resolve, reject) => {
    tempImage.onload = () => {
      if (tempImage.width !== tempImage.height) {
        resolve(false);
      } else {
        resolve(true);
      }

      tempImage.onerror = reject;
    };
  });
}

export async function fileValidator(file: File): Promise<{ valid: true } | { valid: false; reason: string }> {
  const mimetype = file.type.split("/")[0];
  const LIMIT = 1_000_000 * 5;

  if (mimetype !== "image") {
    return { valid: false, reason: "File is not an image" };
  }

  if (file.size > LIMIT) {
    return { valid: false, reason: "File is too large" };
  }

  const isSquare = await isSquareDimens(file);

  if (!isSquare) {
    return { valid: false, reason: "File must have square dimensions" };
  }

  return { valid: true };
}

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
