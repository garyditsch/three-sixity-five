import { Link, useLoaderData } from "@remix-run/react";
import type {  MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "365 | Home" },
    { name: "365", content: "Daily habit tracking" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
    const { supabase } = await createSupabaseServerClient({request})
    const { data, error } = await supabase
      .from('goals')
      .select()
  
    return { 
      data: data,
      error: error
    }
  }

  const createGoalList = (data) => {
    const listItems = data.map(( goal: any ) => {
        return <li key={goal.id}>
                <Link to="#" className="py-3.5 w-full flex items-center text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                    <span className="ml-5 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
                    {goal.goal}, {goal.value}
                </Link>
            </li>        
    })
    return (
        <ul className="mt-8 mx-auto text-left font-medium text-lg leading-none border-blue-200 divide-y divide-blue-200">
            {listItems}
        </ul>
    )
  }


export default function Index() {  
  const { data } = useLoaderData()
  console.log(data)

  const goals = createGoalList(data)

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden bg-slate-100">
      <div className="mt-2 w-full z-10">
        <div className="mt-8 pl-8 mx-auto text-left font-medium text-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50">Log Today</div>
        {goals}
    </div>
  </main>
  );
}