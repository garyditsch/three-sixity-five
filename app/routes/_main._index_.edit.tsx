import { useLoaderData, Form, useOutletContext } from "@remix-run/react";
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
    const goal = formData.get("goal")
    const category = formData.get("category")
    const goalValue = formData.get("goalValue")

    // TODO: create record in supabase function  
    const { supabase, headers } = await createSupabaseServerClient({request})
    const { error } = await supabase
      .from('goals')
      .insert({ user_id: userId, goal: goal, category: category, value: goalValue})
    console.log('ERROR', error)
    if(error){
      return json({error: error.message }, { headers, status: 401})
    }

    return redirect(`/`, { headers });
  }

  const createGoalList = (data: any, id: string) => {
    const listItems = data.map(( goal: any ) => {
        return <li key={goal.id}>
                <div className="p-3.5 w-full grid grid-cols-2 items-center text-gray-800">
                    <div>{goal.goal}</div>
                    <div className="grid justify-end">
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

  const categories = [
    {id: 1, category: 'Fitness'},
    {id: 2, category: 'Mental'},
    {id: 3, category: 'Spiritual'},
    {id: 4, category: 'Social'},
    {id: 5, category: 'Purpose'}
  ]

  const goalCategories = categories.map((category) => {
    return <option key={category.id} value={category.category}>{category.category}</option>
  })

export default function Index() {  
  const { data } = useLoaderData()
  const user = useOutletContext() as User;
  const goals = createGoalList(data, String(user.user.id))

  return (
    <>
        <div className="mt-2 w-full z-10">
            <div className="mt-8 text-center font-medium text-xl text-gray-800">Log your activity today.</div>
            {goals}
        </div>
        <div className="mt-8 mb-16 bg-white py-8 px-6 rounded-lg shadow">
            <Form method="post">
                <input type="hidden" name="user_id" value={user.user.id} />
                <label htmlFor="goal" className="my-2 block text-sm font-medium text-gray-800">What is your goal.</label>
                <div className="mt-1">
                    <input type="text" name="goal" id="goal" className="w-full border-gray-400 rounded-lg shadow-sm" />
                </div>
                <label htmlFor="goalValue" className="my-2 block text-sm font-medium text-gray-800">How many times this year will you complete this behavior?</label>
                <div className="mt-1">
                    <input type="text" name="goalValue" id="goalValue" className="w-full border-gray-400 rounded-lg shadow-sm" />
                </div>
                <label htmlFor="category" className="my-2 block text-sm font-medium text-gray-800">Choose the category.</label>
                <div className="mt-1">
                    <select id="category" name="category" className="w-full border-gray-400 rounded-lg shadow-sm">
                        {goalCategories}
                    </select>
                </div>
                <div className="mt-4">
                    <button className="w-full p-2 bg-gray-800 text-white text-center rounded-md" type="submit">Submit</button>
                </div>
            </Form>
        </div>
    </>
  );
}