import { getSupabaseServerClient } from "~/utils/supabase.server";

// interact with supabase to see if account already exists

export async function accountExists(email: string){
    // let account = // check database to see if account exists

    // return Boolean(account)
    return false;
}

// interact with supabase to create account

export async function creatAccount(
    email: string, 
    password: string,
) {
    
}