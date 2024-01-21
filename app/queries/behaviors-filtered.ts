import { createSupabaseServerClient } from "~/utils/supabase.server";

export const behaviorDataQuery = async (request: Request, category: string | null) => {
    const { supabase } = await createSupabaseServerClient({request})
    let query = supabase
        .from('behaviors')
        .select(`
        id, goal_id, created_at, user_id,
        goals!inner (
            id, goal, value, category
        )
        `)
    if (category) {
        query = query
        .eq('goals.category', category)
    }
    const { data, error } = await query;
    return { 
        data: data,
        error: error
    }
}