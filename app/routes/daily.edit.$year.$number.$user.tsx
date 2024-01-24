import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useParams, useLoaderData, Form, useOutletContext } from "@remix-run/react";
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

    return redirect(`/calendar/2024/${params.user}`, { headers });
}

export async function loader({request}: LoaderFunctionArgs) {
  let category = null;
  const { data, error } = await behaviorDataQuery(request, category);
  const { goalData, errorMsg } = await goalDataQuery(request);

  return {
    goalData: goalData,
    errorMsg: errorMsg, 
    data: data,
    error: error
  }
}

export default function DailyEdit() {
  const { data, error, goalData, errorMsg } = useLoaderData<typeof loader>();
  const id  = useOutletContext()
  console.log('ERROR', error)
  console.log('ERROR MSG', errorMsg)
  let params = useParams()

  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year)).toString().split(' ').slice(0, 4).join(' ')

  const todaysBehaviors = data?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.created_at))
    if(String(day_of_year) === params.number){
        return day
    }
    return null;
  })

  const grouped = groupedByCategory(todaysBehaviors)

  const goalOptions = goalData?.map((goal) => {
    console.log(goal)
    return <option key={goal.id} value={goal.id}>{goal.goal}</option>
  })

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden bg-slate-100">
      <div className="bg-yellow-500 w-full">
      <div className="text-2xl text-gray-800 border-b-2 border-blue-200">{selectedDay}</div>       
        {Object.keys(grouped).map((key) => (
            <div key={key}>
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
        <div className="mt-8">
          <div className="text-2xl text-gray-800">Log another behavior on this day.</div>
          <Form method="post">
            <select id="goal" name="goal">
              {goalOptions}
            </select>
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        </div>
      </div>
  </main>
  );
}