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
    console.info("[updateSession]", request.nextUrl);
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        env.PUBLIC_SUPABASE_URL,
        env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    for (const cookie of cookiesToSet) {
                        supabaseResponse.cookies.set(cookie.name, cookie.value, cookie.options);
                    }
                },
            },
        }
    );

    const {
        data: {user},
        error,
    } = await supabase.auth.getUser();
    console.info("[updateSession]", {user, error});

    if (!user
        && !request.nextUrl.pathname.startsWith("/signup")
        && request.nextUrl.pathname !== "/"
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    if (user
        && (
            request.nextUrl.pathname.startsWith("/signup")
            || request.nextUrl.pathname === "/"
        )
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/home";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export default updateSession;
