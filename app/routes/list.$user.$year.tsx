import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, Link } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "365 List" },
    { name: "description", content: "A look at the year's completed behaviors in a list view" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
  const { supabase } = await createSupabaseServerClient({request})
  const { data, error } = await supabase
    .from('behaviors')
    .select(`
      id, goal_id, created_at, user_id,
      goals (
        id, goal, value, category 
      )
    `)
  return { 
    data: data,
    error: error
  }
}

export default function YearlyList() {
  const { data, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('DATA', data)

  const sortedList = data ? data.sort((a, b) => a.id - b.id) : [];

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-1 justify-items-start gap-4"> 
          {sortedList.map((day: any) => {
            return <Link to={`/daily/2024/${day.number}`} key={day.number}>
            <div className={"grid"}>
              {new Date(day.created_at).toISOString().split('T')[0].split('-').slice(1).join('-')}, {day.goals.goal}
            </div>
            </Link>
          })}
        </div>
    </div>
  </main>
  );
}