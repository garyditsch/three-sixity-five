import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useParams, useLoaderData, Form  } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { getMonthDayYear, getMonthDayYearTime, getDayOfYear } from "~/utils/date-helper";
import { groupedByCategory } from "~/utils/data-parsers";
import { behaviorDataQuery, goalDataQuery } from "~/queries/behaviors-filtered";
import { SubmitButton } from "~/components/SubmitButton";
import { readUserSession } from "~/utils/auth";
import localforage from "localforage";


export const meta: MetaFunction = () => {
  return [
    { title: "Edit" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  let user = await readUserSession(request);
  const { behaviorData, error } = await behaviorDataQuery(request);
  const { goalData, goalError } = await goalDataQuery(request);

  return json({
    user: user,
    behaviorData: behaviorData,
    error: error,
    goalData: goalData,
    goalError: goalError
  });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const behaviorCached = await localforage.getItem('behaviorData');
  const goalCached = await localforage.getItem('goalData');
  const userCached = await localforage.getItem('user');
  if (behaviorCached && goalCached) {
    return { 
      behaviorData: behaviorCached, 
      goalData: goalCached,
      user: userCached
    }
  }

  const serverData = await serverLoader();
  localforage.setItem('behaviorData', serverData.behaviorData);
  localforage.setItem('goalData', serverData.goalData);
  localforage.setItem('user', serverData.user);
  return {
    behaviorData: serverData.behaviorData,
    goalData: serverData.goalData,
    user: serverData.user
  };
}

// the action here has to take in the activity date so it can log it on the correct day (unlike the daily logger)
export async function action({ request, params }: ActionFunctionArgs){
  let user = await readUserSession(request);
  const user_id = user.id
  const formData = await request.formData();
  const selected_goal = formData.get("goal")
  const today = getMonthDayYearTime(Number(params.number), Number(params.year))

  const { supabase, headers } = await createSupabaseServerClient({request})
  const { error } = await supabase
    .from('behaviors')
    .insert({ user_id: user_id, goal_id: selected_goal, activity_date: today})
  
  if(error){
    return json({error: error.message }, { headers, status: 401})
  }

  return redirect(`/successful-update`, { headers });
}

export default function DailyEdit() {
  const { behaviorData, error, goalData, goalError, user } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('ERROR MSG', goalError)
  let params = useParams()

  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year)).toString().split(' ').slice(0, 4).join(' ')

  const todaysBehaviors = behaviorData?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.activity_date))
    if(String(day_of_year) === params.number){
        return day
    }
    return null;
  })

  const grouped = groupedByCategory(todaysBehaviors)

  const goalOptions = goalData?.map((goal) => {
    return <option key={goal.id} value={goal.id}>{goal.goal}</option>
  })

  return (
    <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
      <div className="mt-4 text-2xl text-gray-800 border-b-2 border-gray-800">{selectedDay}</div>
        {Object.keys(grouped).map((key) => (
            <div key={key} className="py-4">
                <div className="text-2xl font-semibold text-gray-800">{key}</div>
                <ul className="text-left text-lg text-gray-800 border-blue-200 divide-y divide-blue-200">
                    {grouped[key].map((behavior: any) => (
                        <li key={behavior.id}>
                        {behavior.goals.goal}  <span className="text-xs">( {behavior.goals.value} )</span>
                    </li>  
                    ))}
                </ul>
            </div>
        ))}
        <div className="mt-8 bg-white py-8 px-6 rounded-lg shadow">
          <Form method="post">
            <label htmlFor="goal" className="mb-2 block text-sm font-medium text-gray-800">Log a new behavior for this day</label>
            <div className="mt-1">
              <select id="goal" name="goal" className="w-full border-gray-400 rounded-lg shadow-sm">
                {goalOptions}
              </select>
            </div>
            <SubmitButton label={"Submit"} width={"w-full" }/>
          </Form>
        </div>
    </div>
  );
}