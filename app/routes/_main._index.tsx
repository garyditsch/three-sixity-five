import { useLoaderData, Form, useOutletContext, Link } from "@remix-run/react";
import type {  MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { getDayOfYear } from "~/utils/date-helper";

import type { User } from "~/utils/types";

export const meta: MetaFunction = () => {
  return [
    { title: "365 | Home" },
    { name: "365", content: "Daily habit tracking" },
  ];
};


// the action here does not need activity date because db defaults to now(), unlike the daily edit logger which requires the date
export async function loader({request, params}: LoaderFunctionArgs) {
    const { supabase } = await createSupabaseServerClient({request})

    const { data: goalData, error: goalError } = await supabase
      .from('goals')
      .select(`
        id, goal, value, category,
        behaviors (
          id, created_at, user_id, goal_id, activity_date
        )
      `)

    return { 
      data: goalData,
      error: goalError, 
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

    return redirect(`/calendar/2024/${userId}`, { headers });
  }

  const loggedToday = (data: any) => {
    const today = new Date()
    let selectedDay = getDayOfYear(today)
    
    const x = data.filter((day: any) => {
        let loggedDate = new Date(day.activity_date)
        let updatedLoggedDate = getDayOfYear(loggedDate)
        return updatedLoggedDate === selectedDay
    })
    return x
  }


  const isNotComplete = (data: any) => {
    const happenedToday = loggedToday(data)
    return happenedToday.length === 0
  }

  const createGoalList = (data: any, id: string) => {
    const listItems = data.map(( goal: any ) => {
        return <li key={goal.id}>
                <div className="p-3.5 w-full grid grid-cols-2 items-center text-gray-800">
                    <div>{goal.goal}</div>
                    <div className="grid justify-end">
                        {isNotComplete(goal.behaviors) ? <Form method="post">
                            <input type="hidden" name="goal_id" value={goal.id} />
                            <input type="hidden" name="user_id" value={id} />
                            <button className="bg-gray-800 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded" type="submit">Log Activity</button>
                        </Form>: 'Already logged'}
                    </div>
                    <div className="text-sm text-gray-800">{goal.category}</div><div></div>
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
  const user = useOutletContext() as User;
  console.log('ID IN INDEX', user);
  const goals = createGoalList(data, String(user.user.id))

  return (
    <>
      <div className="mt-2 w-full z-10">
        <div className="mt-8 text-center font-medium text-xl text-gray-800">Log your activity today.</div>
        {goals}
      </div>
      <div className="py-8">
          <Link className="w-full p-2 bg-gray-800 text-white text-center rounded-md" to="/edit">Add Goal</Link>
        </div>
    </>
  );
}