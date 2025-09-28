//@ts-check
if (typeof process.env.ENCRYPTOR_KEY !== "string") {
    throw Error("ERROR: BAD ENVIROMENT. Check enviroment variables")
}

export default {
    ENCRYPTOR_KEY: process.env.ENCRYPTOR_KEY
};
