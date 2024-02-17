import { useLoaderData, Form } from "@remix-run/react";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import type {  MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { goalDataQuery } from "~/queries/behaviors-filtered";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { readUserSession } from "~/utils/auth";
import localforage from "localforage";
import { SubmitButton } from "~/components/SubmitButton";

export const meta: MetaFunction = () => {
  return [
    { title: "365 | Add Goal" },
    { name: "365", content: "Daily habit tracking" },
  ];
};

// the action here does not need activity date because db defaults to now(), unlike the daily edit logger which requires the date
export async function loader({request}: LoaderFunctionArgs) {
  let user = await readUserSession(request) 
  const { goalData, goalError } = await goalDataQuery(request);

  return json({ 
    user: user,
    goalData: goalData,
    goalError: goalError,
  })
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const goalCached = await localforage.getItem('goalData');
  const userCached = await localforage.getItem('user');
  if (goalCached) {
    return { 
      goalData: goalCached,
      user: userCached
    }
  }

  const serverData = await serverLoader();
  localforage.setItem('goalData', serverData.goalData);
  localforage.setItem('user', serverData.user);
  return {
    goalData: serverData.goalData, 
    user: serverData.user
  };
}

export async function action({ request }: ActionFunctionArgs){
  let user = await readUserSession(request)
  const userId = user.id;

  const formData = await request.formData();
  const goal = formData.get("goal")
  const category = formData.get("category")
  const goalValue = formData.get("goalValue")

  // TODO: create record in supabase function  
  const { supabase, headers } = await createSupabaseServerClient({request})
  const { error } = await supabase
    .from('goals')
    .insert({ user_id: userId, goal: goal, category: category, value: goalValue})
  if(error){
    return json({error: error.message }, { headers, status: 401})
  }

  return redirect(`/successful-update`, { headers });
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
  const { goalData, user } = useLoaderData<typeof loader>()
  const goals = createGoalList(goalData, String(user.id))

  return (
    <>
        <div className="mt-2 w-full z-10">
            <div className="mt-8 text-center font-medium text-xl text-gray-800">Log your activity today.</div>
            {goals}
        </div>
        <div className="mt-8 mb-16 bg-white py-8 px-6 rounded-lg shadow">
            <Form method="post">
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
                <SubmitButton label={"Submit"} width={"w-full" }/>
            </Form>
        </div>
    </>
  );
}