import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Form, useParams, Link } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "365 List" },
    { name: "description", content: "A look at the year's completed behaviors in a list view" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const { supabase } = await createSupabaseServerClient({request})
  const q = url.searchParams.get("q");
  console.log('Q', q)
  let query = supabase
    .from('behaviors')
    .select(`
      id, goal_id, created_at, user_id,
      goals!inner (
        id, goal, value, category
      )
    `)
  if (q) {
    query = query
      .eq('goals.category', q)
  }

  const { data, error } = await query;

  return json({ 
    data: data,
    q: q,
    error: error
  })
}

export default function YearlyList() {
  const { data, q, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('DATA', data)
  console.log('Q', q)

  useEffect(() => {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);

  const sortedList = data ? data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) : [];

  // data?.map((day: any) => {
  //   console.log(new Date(day.created_at).toString().split(' ').slice(0, 4).join(' '))
  // })

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-1 divide-y divide-slate-200 justify-items-start"> 
          <div>Fitness | Spiritual</div>
          <div>Filtering</div>
          <div className="py-8">
              {/* <Form id="Fitness">
                  <input 
                    defaultValue={q || ""}
                    type="hidden" 
                    name="q" 
                    value="Fitness"
                    id="q"
                  />
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Fitness</button>
              </Form> */}
              <Form id="search-form" role="search">
                <input
                  aria-label="Search contacts"
                  defaultValue={q || ""}
                  id="q"
                  name="q"
                  placeholder="Search"
                  type="search"
                />
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