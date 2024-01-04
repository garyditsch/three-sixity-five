import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, Link } from "@remix-run/react";
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

// https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
// link above was solution needed to deal with typescript errors getting time difference
function getDayOfYear(dateString: Date) {
  const startOfYear = new Date(dateString.getFullYear(), 0, 1);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((dateString.getTime() - startOfYear.getTime()) / millisecondsPerDay) + 1;
}

// function flattens the goal list and logged behavior list, 
// it also sets up the returned object with the needed data and data types for further processing
const getBehaviorList = (data: Array<any> | null) => {
  const transformedArray = data.reduce((acc, obj) => {
    // Map each item in the nested array to a new object, including additional properties
    const newObjects = obj.behaviors.map(behavior => ({
      ...obj, // Spread operator to include all properties of the original object
      created_at: new Date(behavior.created_at),
      day_of_year: getDayOfYear(new Date(behavior.created_at)),
      goal_id: behavior.goal_id,
      id: behavior.id,
      user: behavior.user_id,
      behaviors: undefined 
    }));
    // Combine these new objects with the accumulator
    return acc.concat(newObjects);
  }, []);
  return transformedArray;
}

// gets at unique arrary that filters out any repeating days of year for a logged behavior 
// not double dipping on logged behaviors!
const getUniqueDayList = (list: Array<any>) => {
  const uniqueDaysList = list.filter((function(){
    const loggedDays = new Set();
    return function(day){
      if (!loggedDays.has(day.day_of_year)){
        loggedDays.add(day.day_of_year)
        return true;
      }
      return false;
    };
  })());

  return uniqueDaysList
}


const createYearlyCalendar = (list: Array<any>) => {
  const year: object[] = [];
  const noDays = 366;

  for(let i = 1; i < noDays; i++){
    if(list.includes(i)){
      year.push({
        "number": i,
        "future": false,
        "complete": true
      })
    } else {
      year.push({
        "number": i,
        "future": false,
        "complete": false,
      })
    }
  }
  return year;
};



export default function Dashboard() {
  const params = useParams();
  const { data, error } = useLoaderData<typeof loader>();
  console.log(error)

  const list = getBehaviorList(data)
  // sorts list based on date object
  const sortedList = list.sort((a, b) => a.created_at - b.created_at);
  const completedDayObjectList = getUniqueDayList(sortedList)
  const completedDayOfYearList = completedDayObjectList.map(day => day.day_of_year)
  const yearlyCalendar = createYearlyCalendar(completedDayOfYearList)
  console.log(yearlyCalendar)

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll bg-slate-200">
        {/* <!-- Container --> */}
        <div className="w-full h-1/6 rounded-lg flex items-center justify-center flex-shrink-0 flex-grow bg-gray-400">
          <p>{params.user}: {completedDayOfYearList.length}</p>
        </div>
        <div className="w-full h-100 rounded-lg grid grid-cols-7 justify-items-center gap-4"> 
          {yearlyCalendar.map((day: any) => {
            return <Link to={`/daily/2024/${day.number}`} key={day.number}>
            <div className={`w-10 h-10 flex items-center justify-center 
              ${day.future ? 'bg-gray-200' : !day.future && day.complete ? 'bg-green-300' : 'bg-red-300'}`}>
              {day.number}
            </div>
            </Link>
          })}
        </div>
    </div>
  </main>
  );
}