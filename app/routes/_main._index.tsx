import { useLoaderData, Form } from "@remix-run/react";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import type {  MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { getDayOfYear } from "~/utils/date-helper";
import { LinkButton } from "~/components/LinkButton";
import { goalDataQuery, behaviorDataQuery } from "~/queries/behaviors-filtered";
import { getCountsByGoal } from "~/utils/data-parsers";
import { readUserSession } from "~/utils/auth";
import localforage from "localforage";

export const meta: MetaFunction = () => {
  return [
    { title: "365 | Home" },
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
    const userId = user.id
    const formData = await request.formData();
    const goalId = formData.get("goal_id")

    // TODO: create record in supabase function  
    const { supabase, headers } = await createSupabaseServerClient({request})
    const { error } = await supabase
      .from('behaviors')
      .insert({ user_id: userId, goal_id: goalId })
    
    if(error){
      return json({error: error.message }, { headers, status: 401})
    }

    return redirect(`/successful-update`, { headers });
  }

  const loggedToday = (data: any) => {
    const today = new Date()
    let selectedDay = getDayOfYear(today)
    
    const x = data.filter((day: any) => {
        let loggedDate = new Date(day.activity_date)
        let updatedLoggedDate = getDayOfYear(loggedDate)
        return updatedLoggedDate === selectedDay
    })
    // console.log('x', x)
    return x
  }

  const isNotComplete = (data: any) => {
    const goalCategory = data.category
    const happenedToday = loggedToday(data.behaviors)
    const todayCheck = happenedToday.length === 0
    return {
      todayCheck: todayCheck,
      goalCategory: goalCategory
    }
  }

  const createGoalList = (data: any, id: string) => {
    const listItems = data.map(( goal: any ) => {
       console.log('goal', goal)
        let complete = isNotComplete(goal)
        console.log('complete', complete)
        return <li key={goal.id}>
                <div className={"w-full grid grid-rows-3 grid-flow-col py-8 border-b-2 border-gray-300"} >
                    <div className={complete.todayCheck ? 'col-span-2 text-md text-gray-800 font-semibold' : 'col-span-2 text-md text-green-600 font-semibold'}>{goal.goal}</div>
                    <div className={complete.todayCheck ? 'col-span-2 text-sm text-gray-800' : 'col-span-2 text-sm text-green-600 font-semibold'}>{goal.category}</div>
                    <div className={complete.todayCheck ? 'col-span-2 text-sm text-gray-800' : 'col-span-2 text-sm text-green-600 font-semibold'}>{goal.behaviors.length} of {goal.value}</div>
                    <div className="grid row-span-3 content-center justify-end">
                        {complete.todayCheck ? 
                          <Form method="post">
                              <input type="hidden" name="goal_id" value={goal.id} />
                              <button className="bg-gray-800 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded" type="submit">Log</button>
                          </Form>: 
                          <div className="text-green-600 font-bold text-xl">Success</div>
                        }
                    </div>
                </div>
            </li>        
    })
    return (
        <ul className="mt-8 mx-auto text-left text-lg leading-none border-gray-300 divide-y divide-gray-300">
            {listItems}
        </ul>
    )
  }


export default function Index() {  
  const { goalData, user } = useLoaderData<typeof loader>()
  const goals = createGoalList(goalData, String(user.id))

  return (
    <>
      <div className="mt-2 w-full z-10">
        <div className="mt-8 text-center font-medium text-xl text-gray-800">Log your activity today.</div>
        {goals}
      </div>
      <LinkButton label={'Add New Goal'} width={'w-2/4'} to={'/edit'} />
    </>
  );
}