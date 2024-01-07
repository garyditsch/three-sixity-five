import { useLoaderData, Form, useOutletContext } from "@remix-run/react";
import type {  MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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
      .select(`
        id, goal, value, category,
        behaviors (
          id, created_at, user_id, goal_id
        )
      `)
  
    return { 
      data: data,
      error: error
    }
  }

  export async function action({ request }: ActionFunctionArgs){
    const formData = await request.formData();
    const userId = formData.get("user_id")
    const goalId = formData.get("goal_id")

    // TODO: create record in supabase function  
    const { supabase, headers } = await createSupabaseServerClient({request})
    const { error } = await supabase
      .from('behaviors')
      .insert({ user_id: userId, goal_id: goalId })
    
    if(error){
      return json({error: error.message }, { headers, status: 401})
    }

    return redirect(`/dashboard/${userId}`, { headers });
  }

  // does not account for timezones
  const loggedToday = (data: any) => {
    const today = new Date()
    const todayString = today.toISOString().slice(0, 10)
    console.log('todayString', todayString)
    const x = data.filter((day: any) => {
      const dayString = day.created_at.slice(0, 10)
      console.log('dayString', dayString)
      return dayString === todayString
    })
    return x
  }

  const isNotComplete = (data: any) => {
    const happenedToday = loggedToday(data)
    // console.log('happenedToday', happenedToday)
    // console.log('happenedToday length', happenedToday.length === 0)
    return happenedToday.length === 0
  }

  const createGoalList = (data: any, id: string) => {
    const listItems = data.map(( goal: any ) => {
        return <li key={goal.id}>
                <div className="p-3.5 w-full grid grid-cols-2 items-center text-blue-500 hover:text-blue-700">
                    {goal.goal}, {goal.value}
                    <div className="grid justify-end">
                        {isNotComplete(goal.behaviors) ? <Form method="post">
                            <input type="hidden" name="goal_id" value={goal.id} />
                            <input type="hidden" name="user_id" value={id} />
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Log Activity</button>
                        </Form>: 'Already logged'}
                    </div>
                </div>
            </li>        
    })
    return (
        <ul className="mt-8 mx-auto text-left text-lg leading-none border-blue-200 divide-y divide-blue-200">
            {listItems}
        </ul>
    )
  }


export default function Index() {  
  const { data } = useLoaderData()
  console.log('data', data)
  const id = useOutletContext()
  const goals = createGoalList(data, String(id))

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden bg-slate-100">
      <div className="mt-2 w-full z-10">
        <div className="mt-8 pl-8 mx-auto text-left font-medium text-xl text-blue-500 hover:text-blue-700 hover:bg-blue-50">Log Today</div>
        {goals}
    </div>
  </main>
  );
}