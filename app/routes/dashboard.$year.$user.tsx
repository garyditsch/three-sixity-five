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
                <div key={key}>
                    <div className="text-2xl font-semibold text-gray-800">{key}</div>
                    <div className="text-lg font-semibold text-gray-800">Total Count is {behaviorCountsByCategory[key]}</div>
                    <div className="text-lg font-semibold">Today is day {today} of the year.</div>
                    <div className="text-lg font-semibold">You have missed {today - behaviorCountsByCategory[key]} days this year.</div>
                    <ul className="text-left text-lg text-gray-800 border-blue-200 divide-y divide-blue-200">
                        {grouped[key].map((behavior: any, index: number) => (                                
                            <li key={behavior.id}>
                              {behaviorCountsByGoal[behavior.goals.goal]} of {behavior.goals.value} <span className="text-xs">(  {behavior.goals.goal}   )</span>
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