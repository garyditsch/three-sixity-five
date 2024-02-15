import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useParams, useLoaderData, Form  } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import { getMonthDayYear, getMonthDayYearTime, getDayOfYear } from "~/utils/date-helper";
import { groupedByCategory } from "~/utils/data-parsers";
import { behaviorDataQuery, goalDataQuery } from "~/queries/behaviors-filtered";

export const meta: MetaFunction = () => {
  return [
    { title: "Edit" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// the action here has to take in the activity date so it can log it on the correct day (unlike the daily logger)
export async function action({ request, params }: ActionFunctionArgs){
  const formData = await request.formData();
  const selected_goal = formData.get("goal")
  const today = getMonthDayYearTime(Number(params.number), Number(params.year))

  const { supabase, headers } = await createSupabaseServerClient({request})
  const { error } = await supabase
    .from('behaviors')
    .insert({ user_id: params.user, goal_id: selected_goal, activity_date: today})
  
  if(error){
    return json({error: error.message }, { headers, status: 401})
  }

  return redirect(`/successful-update`, { headers });
}

export async function loader({request}: LoaderFunctionArgs) {
  const { behaviorData, error } = await behaviorDataQuery(request);
  const { goalData, errorMsg } = await goalDataQuery(request);

  return {
    goalData: goalData,
    errorMsg: errorMsg, 
    data: behaviorData,
    error: error
  }
}

export default function DailyEdit() {
  const { data, error, goalData, errorMsg } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('ERROR MSG', errorMsg)
  let params = useParams()

  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year)).toString().split(' ').slice(0, 4).join(' ')

  const todaysBehaviors = data?.filter((day) => {
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
            <div className="mt-4">
              <button className="w-full p-2 bg-gray-800 text-white text-center rounded-md" type="submit">Submit</button>
            </div>
          </Form>
        </div>
    </div>
  );
}