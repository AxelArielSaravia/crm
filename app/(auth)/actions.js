
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import createSupabaseClient from "../../lib/supabase/server";

/**@type{(formData: FormData) => Promise<undefined>}*/
export const authLogin = async function (formData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    if (data.email === null || data.password === null) {
        return;
    }

    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
        redirect(`/?error=SIGNIN&name=${error.name}`);
    }
    revalidatePath("/", "layout");
    redirect("/");
};

/**@type{(formData: FormData) => Promise<undefined>}*/
export const authSignup = async function (formData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };
    if (data.email === null || data.password === null) {
        return;
    }

    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.signUp(data)
    if (error) {
        redirect(`/?error=SIGNUP&name=${error.name}`);
    }
    revalidatePath("/", "layout");
    redirect("/");
};
