import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Daily Log" },
    { name: "description", content: "A look at your daily behavior log" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
  const { supabase } = await createSupabaseServerClient({request})
  const { data, error } = await supabase
    .from('behaviors')
    .select(`
      id, goal_id, created_at, user_id,
      goals (
        id, goal, value, category 
      )
    `)
  return { 
    data: data,
    error: error
  }
}

// https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
// link above was solution needed to deal with typescript errors getting time difference
function getDayOfYear(dateString: Date) {
  const startOfYear = new Date(dateString.getFullYear(), 0, 1);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((dateString.getTime() - startOfYear.getTime()) / millisecondsPerDay) + 1;
}

const groupedByCategory = (data: any) => {
  const x = data.reduce((acc, day) => {
    (acc[day.goals.category] = acc[day.goals.category] || []).push(day);
    return acc;
  }, {});
  return x;
}

const getCountsByGoal = (data: any) => {
  let groupedAndCounts: { [key: string]: number } = {}
  for(let i = 0; i < data.length; i++) {
    const goal = data[i].goals.goal
    if(groupedAndCounts[goal]) {
      groupedAndCounts[goal] = groupedAndCounts[goal] + 1
    } else {
      groupedAndCounts[goal] = 1
    }
  }
  return groupedAndCounts
}

const getCountsByCategory = (data: any) => {
  let groupedAndCounts: { [key: string]: number } = {}
  for(let i = 0; i < data.length; i++) {
    const category = data[i].goals.category
    if(groupedAndCounts[category]) {
      groupedAndCounts[category] = groupedAndCounts[category] + 1
    } else {
      groupedAndCounts[category] = 1
    }
  }
  return groupedAndCounts
}

const getUniqueGoalList = (data: any) => {
  const uniqueGoalList = new Map();
  return data.filter(item => {
    return uniqueGoalList.has(item.goal_id) ? false : uniqueGoalList.set(item.goal_id, true);
  });
};

export default function Dashboard() {
  const { data, error } = useLoaderData<typeof loader>();
  console.log('DATA', data)
  console.log('ERROR', error)

  const behaviorCountsByGoal =  getCountsByGoal(data)
  const behaviorCountsByCategory =  getCountsByCategory(data)

  console.log('BEHAVIOR COUNTS', behaviorCountsByCategory)

  const grouped = groupedByCategory(data)

  Object.keys((grouped)).forEach((key) => {
    grouped[key] = getUniqueGoalList(grouped[key])
  });

  console.log('GROUPED', grouped)

   // get today 
   const today = getDayOfYear(new Date());
   console.log('today', today)


  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-1 gap-4"> 
        {Object.keys(grouped).map((key) => (
                <div key={key} className="mt-4">
                    <div className="flex flex-col bg-white border rounded-md overflow-hidden shadow">
                        <div className="text-left text-xl text-white p-4 bg-gray-800">
                          {key}
                        </div>
                        <div className="flex">
                          <div className="py-2 px-4 text-gray-700">
                              <h3 className="text-sm tracking-wider">Success</h3>
                              <p className="text-3xl">{behaviorCountsByCategory[key]}</p>
                          </div>
                          <div className="py-2 px-4 text-gray-700">
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
                                <span className="text-sm font-medium text-blue-700">{behaviorCountsByGoal[behavior.goals.goal]} days ({((behaviorCountsByGoal[behavior.goals.goal] / behavior.goals.value) * 100).toFixed(0)}%)</span>
                                <span className="text-sm font-medium text-blue-700">{behavior.goals.value} days</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${(behaviorCountsByGoal[behavior.goals.goal] / behavior.goals.value) * 100}%`}}></div>
                              </div>    
                            </div>                            
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  </main>
  );
}