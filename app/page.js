//@ts-check
/**
 * @fileoverview Root page - redirects to dashboard or login
 */

import Link from "next/link";
import LoginPage from "./_ui/LoginPage.js";

export default async function Page() {
    return (
        <main>
            <LoginPage/>
            <Link href="/signup">Signup</Link>
        </main>
    );
}
