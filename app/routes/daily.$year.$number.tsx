import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getCountsByGoal, groupedByCategory } from "~/utils/data-parsers";
import { getMonthDayYear, getDayOfYear } from "~/utils/date-helper";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";

export const meta: MetaFunction = () => {
  return [
    { title: "Daily Log" },
    { name: "description", content: "A look at your daily behavior log" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
  let category = null;
  const { data, error } = await behaviorDataQuery(request, category);
  return { 
    data: data,
    error: error
  }
}

export default function DailyView() {
  const params = useParams();
  const { data, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)

  const behaviorCounts =  getCountsByGoal(data)
  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year)).toString().split(' ').slice(0, 4).join(' ')

  const todaysBehaviors = data?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.created_at))
    if(String(day_of_year) === params.number){
        return day
    }
    return null;
  })

  const grouped = groupedByCategory(todaysBehaviors)

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        <div className="w-full h-100 rounded-lg grid grid-cols-1 gap-4"> 
        <div className="text-2xl text-gray-800 border-b-2 border-blue-200">{selectedDay}</div>
        {Object.keys(grouped).map((key) => (
                <div key={key}>
                    <div className="text-2xl font-semibold text-gray-800">{key}</div>
                    <ul className="text-left text-lg text-gray-800 border-blue-200 divide-y divide-blue-200">
                        {grouped[key].map((behavior: any) => (
                            <li key={behavior.id}>
                            {behavior.goals.goal}  <span className="text-xs">(  {behaviorCounts[behavior.goals.goal]} of {behavior.goals.value} )</span>
                        </li>  
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
  </main>
  );
}