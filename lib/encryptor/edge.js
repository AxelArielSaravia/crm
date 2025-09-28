//@ts-check

import env from "./env.js";
import global from "./global.js";


const IV_ARRAY = new Uint8Array(global.IV_LENGTH_BYTES);

const masterKeyRaw = Buffer.from(env.ENCRYPTOR_KEY, global.ENCRYPTION_FORMAT);
if (masterKeyRaw.length !== global.KEY_LENGTH_BYTES) {
    throw new Error("ENCRYPTION ERROR: Invalid master key length. Must be 32 bytes");
}

// Import the raw key once (reusable across calls)
/**@type{CryptoKey}*/
let cryptoKey;

(async () => {
    try {
        cryptoKey = await crypto.subtle.importKey(
            "raw",
            masterKeyRaw,
            { name: global.ALGORITHM_EDGE, length: 256 },
            false, // Not extractable for security
            ["encrypt", "decrypt"]
        );
    } catch (error) {
        throw new Error("ENCRYPTION ERROR: Failed to import master key");
    }
})();

/**
 * hex must be EVEN
 * @returns the bites fills
 * @type{(hex: string, arr: Uint8Array, start: number) => number}
 */
function hexToUint8Array(hex, arr, start = 0) {
    if (arr.length * 2 < hex.length) {
        throw new Error("ENCRYPTION ERROR: arr is shorter than hex");
    }
    let c = 0;
    for (let i = 0; i < hex.length; i += 2) {
        arr[(i / 2) + start] = Number.parseInt(hex.slice(i, i+2), 16);
        c += 1;
    }
    return c;
}

export const Encryptor = {
    /**
     * Encrypts plaintext using AES-256-GCM.
     * Returns hex-encoded string: iv:authTag:ciphertext
     * @type {(text: string) => Promise<string>}
     */
    async encrypt(text) {
        if (typeof text !== "string" || text.length === 0) {
            throw new Error("Invalid input: text must be a non-empty string");
        }

        if (!cryptoKey) {
            throw new Error("ENCRYPTION ERROR: Master key not ready");
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        const iv = crypto.getRandomValues(IV_ARRAY);

        const encryptedBuffer = await crypto.subtle.encrypt(
            {
                name: ALGORITHM_EDGE,
                iv: iv,
                tagLength: TAG_LENGTH_BYTES * 8, // 128 bits
            },
            cryptoKey,
            data
        );

        const encryptedArray = new Uint8Array(encryptedBuffer);

        let res = "";
        for (let v of iv) {
            res += v.toString(16).padStart(2, "0");
        }
        res += ":";

        const authStart = encryptedArray.length - global.TAG_LENGTH_BYTES;
        for (let i = authStart; i < encryptedArray.length; i += 1) {
            res += encryptedArray[i]?.toString(16).padStart(2, "0");
        }
        res += ":";
        for (let i = 0; i < authStart; i += 1) {
            res += encryptedArray[i]?.toString(16).padStart(2, "0");
        }

        //ivHex:authTagHex:ciphertextHex
        return res;
    },

    /**
     * Decrypts hex-encoded string using AES-256-GCM.
     * Expects format: iv:authTag:ciphertext
     * @type {(encryptedText: string) => Promise<string>}
     */
    async decrypt(encryptedText) {
        if (typeof encryptedText !== "string" || encryptedText.length === 0) {
            throw new Error("Invalid input: encryptedText must be a non-empty string");
        }

        if (!cryptoKey) {
            throw new Error("ENCRYPTION ERROR: Master key not ready");
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

        hexToUint8Array(ivHex, IV_ARRAY, 0);

        //Because 2 characters represent 1 bites
        const fullData = new Uint8Array((encryptedText.length - authtagStart - 1) / 2);
        let fcCipher = hexToUint8Array(cipherTextHex, fullData, 0);
        let fcAuth = hexToUint8Array(authTagHex, fullData, fcCipher);

        //unrechable
        if (fcCipher + fcAuth !== fullData.length) {
            throw Error ("DECRYPT ERROR");
        }
        try {
            const decryptedBuffer = await crypto.subtle.decrypt(
                {
                    name: global.ALGORITHM_EDGE,
                    iv: IV_ARRAY,
                    tagLength: global.TAG_LENGTH_BYTES * 8, // 128 bits
                },
                cryptoKey,
                fullData
            );

            const decoder = new TextDecoder();
            let res = decoder.decode(decryptedBuffer);
            IV_ARRAY.fill(0);

            return res;
        } catch (error) {
            throw new Error("Decryption failed: Invalid or tampered data");
        }
    }
};


export default Encryptor;
