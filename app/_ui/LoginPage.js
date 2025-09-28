//@ts-check
//
"use client";

/**
 * @typedef {import("react").ReactNode} ReactNode
 */

import Form from "next/form";
import { authLogin } from "../(auth)/actions.js";

/**@type{() => ReactNode}*/
export default function LoginPage() {
    return (
        <Form action={authLogin}>
            <div>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required/>
            </div>
            <button type="submit">Log in</button>
        </Form>
    );
}
