import crypto from "crypto";

/**
 * Generates a cryptographically secure randomized password of a given length (default: 6).
 * Uses clear alphanumeric characters for readability and security.
 */
export const generateRandomPassword = (length: number = 6): string => {
    const charset = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
    let result = "";
    const randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += charset[randomBytes[i] % charset.length];
    }
    return result;
};
