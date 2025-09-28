//@ts-check

if (typeof process.env.NEXT_PUBLIC_SUPABASE_URL !== "string"
    || typeof process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== "string"
) {
    throw Error("ERROR: BAD ENVIROMENT. Check enviroment variables")
}

export default {
    PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
};
