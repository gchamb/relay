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

export function fileValidator(file: File): { valid: true } | { valid: false; reason: string } {

    const mimetype = file.type.split("/")[0];
    const LIMIT = 1_000_000 * 5;

    if (mimetype !== "image") {
        return { valid: false, reason: "File is not an image" }
    }


    if (file.size > LIMIT) {
        return { valid: false, reason: "File is too large" }
    }


    return { valid: true }
}