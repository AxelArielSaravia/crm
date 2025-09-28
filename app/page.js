/**
 * @fileoverview Root page - redirects to dashboard or login
 * @type-check
 */

import { redirect } from "next/navigation"
import { createClient } from "../lib/supabase/server.js"

/**
 * Root page component
 * @returns {Promise<never>} Always redirects
 */
export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  } else {
    redirect("/auth/login")
  }
}
