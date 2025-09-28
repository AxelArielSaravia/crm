/**
 * @fileoverview Supabase client for browser-side operations
 * @type-check
 */

import { createBrowserClient } from "@supabase/ssr"

/**
 * Creates a Supabase client for browser-side operations
 * @returns {import('@supabase/supabase-js').SupabaseClient} Supabase client instance
 */
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
