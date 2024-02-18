import { createSupabaseServerClient } from "./supabase.server";
import { redirect } from "@remix-run/node";

// checks and reads user from stored cookie
export async function readUserSession(request: Request){
    const { supabase } = await createSupabaseServerClient({request});
    const result = await supabase.auth.getSession();
    const user = result.data.session?.user;
    console.log('user---', user)
    if(!user){
        throw redirect('/login')
    }
    return user;
}