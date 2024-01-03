import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, Link } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "365" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
  const { supabase } = await createSupabaseServerClient({request})
  const { data, error } = await supabase
    .from('behaviors')
    .select()

  return { 
    data: data,
    error: error
  }
}

// https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
// link above was solution needed to deal with typescript errors getting time difference
function getDayOfYear(dateString: Date) {
    const startOfYear = new Date(dateString.getFullYear(), 0, 1);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((dateString.getTime() - startOfYear.getTime()) / millisecondsPerDay) + 1;
}

const createBehaviorList = (data: any) => {
    const listItems = data.map(( day: any ) => {
        return <li key={day.id}>
                {day.created_at}, {day.goal_id}
            </li>        
    })
    return (
        <ul className="mt-8 mx-auto text-left text-lg leading-none border-blue-200 divide-y divide-blue-200">
            {listItems}
        </ul>
    )
  }

export default function Dashboard() {
  const params = useParams();
  const { data, error } = useLoaderData<typeof loader>();
  console.log(data)
  console.log(error)

  const daysBehaviors = data?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.created_at))
    if(String(day_of_year) === params.number){
        return day
    }
  })

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll bg-slate-200">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-7 justify-items-center gap-4"> 
          {createBehaviorList(daysBehaviors)}
        </div>
    </div>
  </main>
  );
}