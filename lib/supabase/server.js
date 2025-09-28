//@ts-check
/**
 * @typedef {import("@supabase/supabase-js").SupabaseClient} SupabaseClient
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import env from "./env.js";

/**@type {() => Promise<SupabaseClient>}*/
const createClient = async function () {
    const cookieStore = await cookies();
    return createServerClient(
        env.PUBLIC_SUPABASE_URL,
        env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        for (const cookie of cookiesToSet) {
                            cookieStore.set(
                                cookie.name,
                                cookie.value,
                                cookie.options
                            );
                        }
                    } catch {}
                },
            },
        }
    )
};
export default createClient;
