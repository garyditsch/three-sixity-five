import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";

import { createSupabaseServerClient } from "~/utils/supabase.server";


export async function action({ request }: ActionFunctionArgs) {
    const {supabase, headers} = createSupabaseServerClient({request})

    const { error } = await supabase.auth.signOut()


    if(error){
        return json({error: error.message }, { headers, status: 401})
    }

    return redirect("/logout-success", { headers });
}