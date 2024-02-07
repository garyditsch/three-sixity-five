import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDayOfYear } from "~/utils/date-helper";
import { getUniqueGoalList, getCountsByGoal, getCountsByCategory, groupedByCategory } from "~/utils/data-parsers";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "A look at your behavior dashboard" },
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  let category = null;
  let goalId = null;
  const { data, error } = await behaviorDataQuery(request, category, Number(goalId));

  return { 
    data: data,
    error: error
  }
}

export default function Dashboard() {
  const { data, error } = useLoaderData<typeof loader>();
  console.log('DATA', data)
  console.log('ERROR', error)

  const behaviorCountsByGoal =  getCountsByGoal(data)
  const behaviorCountsByCategory =  getCountsByCategory(data)
  const grouped = groupedByCategory(data)

  Object.keys((grouped)).forEach((key) => {
    grouped[key] = getUniqueGoalList(grouped[key])
  });

  // get today
  const today = getDayOfYear(new Date());

  return (
    <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
        <div className="w-full h-100 rounded-lg grid grid-cols-1 gap-4 pb-8"> 
        {Object.keys(grouped).map((key) => (
                <div key={key} className="mt-4">
                    <div className="flex flex-col bg-white border rounded-md overflow-hidden shadow">
                        <div className="text-left text-xl text-white p-4 bg-gray-800">
                          {key}
                        </div>
                        <div className="flex">
                          <div className="py-2 px-4 text-gray-800">
                              <h3 className="text-sm tracking-wider">Success</h3>
                              <p className="text-3xl">{behaviorCountsByCategory[key]}</p>
                          </div>
                          <div className="py-2 px-4 text-gray-800">
                              <h3 className="text-sm tracking-wider">Missed</h3>
                              <p className="text-3xl">{today - behaviorCountsByCategory[key]}</p>
                          </div>
                          <div className="flex w-full justify-end items-end p-2">
                            <div className="text-xs text-right items-end">There are {366 - today} days left in 2024.</div>
                          </div>
                        </div>
                    </div>
                    <div className="text-left text-lg text-gray-800">
                        {grouped[key].map((behavior: any, index: number) => (
                            <div className="mt-8" key={behavior.id}>
                              <div>{behavior.goals.goal}</div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-800">{behaviorCountsByGoal[behavior.goals.goal]} days ({((behaviorCountsByGoal[behavior.goals.goal] / behavior.goals.value) * 100).toFixed(0)}%)</span>
                                <span className="text-sm font-medium text-gray-800">{behavior.goals.value} days</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-gray-800 h-2.5 rounded-full" style={{width: `${(behaviorCountsByGoal[behavior.goals.goal] / behavior.goals.value) * 100}%`}}></div>
                              </div>    
                            </div>                            
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}