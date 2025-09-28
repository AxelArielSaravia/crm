//@ts-check
/**
 * @typedef {import("@supabase/supabase-js").SupabaseClient} SupabaseClient
 */

import { createBrowserClient } from "@supabase/ssr";

import env from "./env.js";

/**@type {() => SupabaseClient}*/
const createClient = function() {
  return createBrowserClient(
    env.PUBLIC_SUPABASE_URL,
    env.PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
};

export default createClient;
