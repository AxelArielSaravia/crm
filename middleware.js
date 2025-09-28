//@ts-check

/**
 * @typedef {import("next/server").NextRequest} NextRequest
 * @typedef {import("next/server").NextResponse} NextResponse
 */

import updateSession from "./lib/supabase/middleware.js"

/**@type{(request: NextRequest) => Promise<NextResponse>}*/
export async function middleware(request) {
  return await updateSession(request);
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
