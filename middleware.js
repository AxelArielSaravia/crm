/**
 * @fileoverview Next.js middleware for authentication
 * @type-check
 */

import { updateSession } from "./lib/supabase/middleware.js"

/**
 * Middleware function to handle authentication
 * @param {import('next/server').NextRequest} request - Next.js request object
 * @returns {Promise<import('next/server').NextResponse>} Next.js response
 */
export async function middleware(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
