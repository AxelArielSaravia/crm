//@ts-check

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

import env from "./env.js";
import global from "./global.js";

const masterKey = Buffer.from(env.ENCRYPTOR_KEY, global.ENCRYPTION_FORMAT);
if (masterKey.length !== global.KEY_LENGTH_BYTES) {
    throw new Error("ENCRYPTION ERROR: Invalid master key length. Must be 32 bytes");
}

export const Encryptor = {
    /** @type{(text: string) => string}*/
    encrypt(text) {
        if (typeof text !== "string" || text.length === 0) {
            throw new Error("Invalid input: text must be a non-empty string");
        }
        const iv = randomBytes(global.IV_LENGTH_BYTES); // 96-bit IV for GCM
        const cipher = createCipheriv(global.ALGORITHM, masterKey, iv);
        let encrypted = cipher.update(text, "utf8", global.ENCRYPTION_FORMAT);
        encrypted += cipher.final(global.ENCRYPTION_FORMAT);
        const authTag = cipher.getAuthTag().toString(global.ENCRYPTION_FORMAT);
        return `${iv.toString(global.ENCRYPTION_FORMAT)}:${authTag}:${encrypted}`;
    },
    /** @type{(encryptedText: string) => string} */
    decrypt(encryptedText) {
        if (typeof encryptedText !== "string" || encryptedText.length === 0) {
            throw new Error("Invalid input: encryptedText must be a non-empty string");
        }

        let ivEnd = -1;
        let authtagStart = -1;
        let authtagEnd = -1;
        let ciphertextStart = -1;
        let found = 0;
        let i = 0;
        for (let s of encryptedText) {
            if (found === 2) {
                break;
            }
            if (s === ":") {
                if (found === 0) {
                    ivEnd = i;
                } else {
                    authtagEnd = i;
                }
                if (encryptedText[i+1] !== undefined) {
                    if (found === 0) {
                        authtagStart = i+1;
                    } else {
                        ciphertextStart = i+1;
                    }
                }
                found += 1;
            }
            i += 1;
        }

        if (ivEnd === -1 || authtagStart === -1 || ciphertextStart === -1) {
            throw new Error("Invalid encrypted data format");
        }


        if (ivEnd !== global.IV_LENGTH_BYTES * 2
            || authtagEnd - authtagStart  !== global.TAG_LENGTH_BYTES * 2
        ) {
            throw new Error("Invalid encrypted data lengths");
        }

        const ivHex = encryptedText.slice(0, ivEnd);
        const authTagHex = encryptedText.slice(authtagStart, authtagEnd);
        const cipherTextHex = encryptedText.slice(ciphertextStart);

        const iv = Buffer.from(ivHex, global.ENCRYPTION_FORMAT);
        const authTag = Buffer.from(authTagHex, global.ENCRYPTION_FORMAT);
        const decipher = createDecipheriv(global.ALGORITHM, masterKey, iv);
        decipher.setAuthTag(authTag);

        try {
            let decrypted = decipher.update(
                cipherTextHex,
                global.ENCRYPTION_FORMAT,
                "utf8"
            );
            decrypted += decipher.final("utf8");
            return decrypted;
        } catch (error) {
            throw new Error("Decryption failed: Invalid or tampered data");
        }
    }
};

export default Encryptor;
