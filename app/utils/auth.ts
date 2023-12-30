import { createCookie, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "./supabase.server";


let secret = process.env.COOKIE_SECRET || "default";
if(secret === "default") {
    console.warn("No COOKIE_SECRET set, the app is insecure.");
    secret = "default-secret";
}

export let authCookie = createCookie("auth", {
    httpOnly: true, 
    path: "/",
    sameSite: "lax",
    secrets: [secret],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
});

// export async function creatAccount(
//     email:string, 
//     password:string,
// ) {
//     return { id: 1}
// }

export async function readUserSession(request: Request){
    const { supabase } = await createSupabaseServerClient({request});
    const result = await supabase.auth.getSession();
    const user = result.data.session?.user;

    // if (!user) {
    //     console.log("NO USER!!")
    //     throw redirect("/login")
    // }
    return user;
}