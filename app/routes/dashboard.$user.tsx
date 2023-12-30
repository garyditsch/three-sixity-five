import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "365" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};



export async function loader({request, params}: LoaderFunctionArgs) {
  const { supabase } = await createSupabaseServerClient({request})
  const { data, error } = await supabase
    .from('goals')
    .select(`
      id, goal, value,
      behaviors (
        id, created_at, user_id, goal_id
      )
    `)

  return { 
    data: data,
    error: error
  }
}


const year: object[] = [];
const noDays = 365;

for(let i = 0; i < noDays; i++){
  year.push({
    "number": i,
    "future": false,
    "complete": true,
  })
}

function getDayOfYear(dateString) {
  const date = new Date(dateString);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  
  return Math.floor((date - startOfYear) / millisecondsPerDay) + 1;
}

const getBehaviorList = (data: Array<any> | null) => {
  const transformedArray = data.reduce((acc, obj) => {
    // Map each item in the nested array to a new object, including additional properties
    const newObjects = obj.behaviors.map(behavior => ({
      ...obj, // Spread operator to include all properties of the original object
      created_at: behavior.created_at,
      day_of_year: getDayOfYear(behavior.created_at),
      goal_id: behavior.goal_id,
      id: behavior.id,
      user: behavior.user_id,
      behaviors: undefined // Optionally remove the original 'items' array
    }));
  
    // Combine these new objects with the accumulator
    return acc.concat(newObjects);
  }, []);
  return transformedArray;
}

export default function Dashboard() {
  const params = useParams();

  const { data, error } = useLoaderData<typeof loader>();
  console.log('data', data)  
  console.log(error)

  const list = getBehaviorList(data)
  console.log('my list', list)
  const dateType = list[0].created_at
  console.log(typeof(dateType))

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll bg-slate-200">
        {/* <!-- Container --> */}
        <div className="w-full h-1/6 rounded-lg flex items-center justify-center flex-shrink-0 flex-grow bg-gray-400">
          <p>{params.user}</p>
        </div>
        <div className="w-full h-100 rounded-lg grid grid-cols-7 justify-items-center gap-4"> 
          {year.map((day: any) => {
            return <div className={`w-10 h-10 flex items-center justify-center 
              ${day.future ? 'bg-gray-200' : !day.future && day.complete ? 'bg-green-300' : 'bg-red-300'}`} key={day.number}>{day.number + 1}
            </div>
          })}
        </div>
    </div>
  </main>
  );
}