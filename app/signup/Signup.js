//@ts-check
"use client"

import Form from "next/form";
import { authSignup } from "../(auth)/actions.js";

export default function SignupPage() {
    return (
        <Form action={authSignup}>
            <div>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required/>
            </div>
            <button type="submit">Sign Up</button>
        </Form>
    );
};
