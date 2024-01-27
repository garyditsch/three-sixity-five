import { createSupabaseServerClient } from "~/utils/supabase.server";

export const behaviorDataQuery = async (request: Request, category: string | null, goalId: number | null) => {
    const { supabase } = await createSupabaseServerClient({request})
    let query = supabase
        .from('behaviors')
        .select(`
        id, goal_id, created_at, user_id, activity_date,
        goals!inner (
            id, goal, value, category
        )
        `)
    if (category) {
        query = query
        .eq('goals.category', category)
    }
    if (goalId) { 
        query = query
        .eq('goals.id', goalId)
    }
    const { data, error } = await query;
    return { 
        data: data,
        error: error
    }
}

export const goalDataQuery = async (request: Request) => {
    const { supabase } = await createSupabaseServerClient({request})
    let query = supabase
        .from('goals')
        .select()

    const { data, error } = await query;
    return { 
        goalData: data,
        errorMsg: error
    }
}