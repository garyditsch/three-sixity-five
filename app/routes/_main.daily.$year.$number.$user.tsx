import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams, Link } from "@remix-run/react";
import { getCountsByGoal, groupedByCategory } from "~/utils/data-parsers";
import { getMonthDayYear, getDayOfYear } from "~/utils/date-helper";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";
import localforage from "localforage";

export const meta: MetaFunction = () => {
  return [
    { title: "Daily Log" },
    { name: "description", content: "A look at your daily behavior log" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
  let category = null;
  let goalId = null;
  const { data, error } = await behaviorDataQuery(request, category, Number(goalId));
  return { 
    data: data,
    error: error
  }
}

export async function clientLoader({ params, serverLoader }: ClientLoaderFunctionArgs) {
  let cacheKey = `all-behaviors`
  let cached = await localforage.getItem(cacheKey)
  if (cached) { return { data: cached.data }}

  const { data } = await serverLoader();
  localforage.setItem(cacheKey, { data })
  return { data } 
}

export default function DailyView() {
  const params = useParams();
  const { data, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)

  const behaviorCounts =  getCountsByGoal(data)
  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year)).toString().split(' ').slice(0, 4).join(' ')

  const todaysBehaviors = data?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.activity_date))
    if(String(day_of_year) === params.number){
        return day
    }
    return null;
  })
  const grouped = groupedByCategory(todaysBehaviors)

  return (
    <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
        <div className="mt-4 text-2xl text-gray-800 border-b-2 border-gray-800">{selectedDay}</div>
        {Object.keys(grouped).map((key) => (
          <div key={key} className="py-4">
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
        <div className="py-4">
          <Link className="w-full p-2 bg-gray-800 text-white text-center rounded-md" to={`/daily/2024/${params.number}/${params.user}/edit`}>Add Behavior</Link>
        </div>
    </div>
  );
}