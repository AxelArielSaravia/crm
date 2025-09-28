//@ts-check

/**
 * @typedef {import("next/server").NextRequest} NextRequest
 * @typedef {import("next/server").NextResponse} NextResponse
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

import env from "./env.js";

/**@type{(request: NextRequest) => Promise<NextResponse>}*/
const updateSession = async function (request) {
    let supabaseResponse = NextResponse.next({request});

    const supabase = createServerClient(
        env.PUBLIC_SUPABASE_URL,
        env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    supabaseResponse = NextResponse.next({request});
                    for (const cookie of cookiesToSet) {
                        request.cookies.set(cookie.name, cookie.value);
                        supabaseResponse.cookie.set(
                            cookie.name,
                            cookie.value,
                            cookie.options
                        );
                    }
                },
            },
        }
    );

    // Get user session
    const { data, error } = await supabase.auth.getUser();
    console.info({data,error, request_url: request.url});

    if ((error || !data.user)
        && !request.nextUrl.pathname.startsWith("/signup")
        && request.nextUrl.pathname !== "/"
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        if (error) {
            url.search = "?error=auth-faild";
        }
        return NextResponse.redirect(url);
    }

    if (data.user && (
        request.nextUrl.pathname.startsWith("/signup")
        || request.nextUrl.pathname === "/"
    )) {
        const url = request.nextUrl.clone();
        url.pathname = "/home";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export default updateSession;
