import { createSupabaseServerClient } from "~/utils/supabase.server";

export const behaviorDataQuery = async (request: Request) => {
    const { supabase } = await createSupabaseServerClient({request})
    let query = supabase
        .from('behaviors')
        .select(`
        id, goal_id, created_at, user_id, activity_date,
        goals!inner (
            id, goal, value, category
        )
        `)
        
    console.log("Making a query to the database for behaviors.")
    const { data, error } = await query;
    return { 
        behaviorData: data,
        error: error
    }
}

export const goalDataQuery = async (request: Request) => {
    const { supabase } = await createSupabaseServerClient({request})
    let query = supabase
        .from('goals')
        .select(`
            id, goal, value, category,
            behaviors (
                id, created_at, user_id, goal_id, activity_date
            )
        `)

    console.log("Making a query to the database for goals.")

    const { data, error } = await query;
    return { 
        goalData: data,
        goalError: error
    }
}