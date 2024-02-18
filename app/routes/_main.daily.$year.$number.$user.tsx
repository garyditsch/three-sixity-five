import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import { getCountsByGoal, groupedByCategory } from "~/utils/data-parsers";
import { getMonthDayYear, getDayOfYear } from "~/utils/date-helper";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";
import localforage from "localforage";
import { LinkButton } from "~/components/LinkButton";
import { readUserSession } from "~/utils/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Daily Log" },
    { name: "description", content: "A look at your daily behavior log" },
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  let user = await readUserSession(request);
  const { behaviorData, error } = await behaviorDataQuery(request);

  return json({ 
    user: user,
    behaviorData: behaviorData,
    error: error
  });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const behaviorCached = await localforage.getItem('behaviorData');
  const userCached = await localforage.getItem('user');
  if (behaviorCached) {
    return { 
      behaviorData: behaviorCached, 
      user: userCached
    }
  }

  const serverData = await serverLoader();
  localforage.setItem('behaviorData', serverData.behaviorData);
  localforage.setItem('user', serverData.user);
  return {
    behaviorData: serverData.behaviorData,
    user: serverData.user
  };
}

export default function DailyView() {
  const params = useParams();
  const { behaviorData, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)

  const behaviorCounts =  getCountsByGoal(behaviorData)
  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year)).toString().split(' ').slice(0, 4).join(' ')

  const todaysBehaviors = behaviorData?.filter((day) => {
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
        <LinkButton label={'Add Behavior'} width={'w-2/4'} to={`/daily/2024/${params.number}/${params.user}/edit`} />
    </div>
  );
}