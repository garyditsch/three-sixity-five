import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useParams, Link } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "365 List" },
    { name: "description", content: "A look at the year's completed behaviors in a list view" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const { supabase } = await createSupabaseServerClient({request})
  const category = url.searchParams.get("category");
  console.log('CATEGORY', category)
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

  return json({ 
    data: data,
    category: category,
    error: error
  })
}

export default function YearlyList() {
  const { data, q, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('DATA', data)
  console.log('Q', q)

  const id = useParams().user;
  console.log('ID', id )

  const sortedList = data ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : [];

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-1 divide-y divide-slate-200 justify-items-start"> 
          <div className="w-full py-8">
             <Form className="flex justify-between">
              <Link to={`/list/${id}/2024`} className="w-1/4 mx-2 rounded-full text-xs font-bold text-white bg-gray-800 py-1 px-2 text-center">All</Link>
              <button className="w-1/4 mx-2 rounded-full text-xs font-bold text-white bg-gray-800 py-1 px-2" name="category" value="Fitness">Fitness</button>
              <button className="w-1/4 mx-2 rounded-full text-xs font-bold text-white bg-gray-800 py-1 px-2" name="category" value="Spiritual">Spiritual</button>
             </Form>
          </div>
          {sortedList.map((day: any) => {
            return <div className={"w-full grid grid-cols-1 py-4"} key={day.id}>
              <div className="text-sm text-gray-800 font-semibold">
                {new Date(day.created_at).toString().split(' ').slice(1, 4).join(' ')}
              </div>
              <div className="text-md text-gray-800">{day.goals.goal}</div>
            </div>
          })}
        </div>
    </div>
  </main>
  );
}