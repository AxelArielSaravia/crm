//@ts-check

export default Object.freeze({
    ALGORITHM: "aes-256-gcm",
    ALGORITHM_EDGE: "AES-GCM",
    ENCRYPTION_FORMAT: "hex",
    KEY_LENGTH_BYTES: 32, // AES-256
    IV_LENGTH_BYTES: 12, // 96-bit IV for GCM
    TAG_LENGTH_BYTES: 16, // 128-bit auth tag (default)
});
