import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, Link, Form } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "365" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({request, params}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const { supabase } = await createSupabaseServerClient({request})
  let query = supabase
    .from('behaviors')
    .select(`
      id, goal_id, created_at, user_id,
      goals!inner (
        id, goal, value, category
      )
    `)
  if (category) {
    query = query
      .eq('goals.category', category)
  }

  const { data, error } = await query;

  return json({ 
    data: data,
    category: category,
    error: error
  })
}

// https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
// link above was solution needed to deal with typescript errors getting time difference
function getDayOfYear(dateString: Date) {
  const startOfYear = new Date(dateString.getFullYear(), 0, 1);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((dateString.getTime() - startOfYear.getTime()) / millisecondsPerDay) + 1;
}

const getBehaviorList = (data: Array<any> | null) => {
  const fullList = data?.map((day) => {
    return {
      created_at: new Date(day.created_at),
      day_of_year: getDayOfYear(new Date(day.created_at)),
      goal_id: day.goals.id,
      category: day.goals.category,
      id: day.id,
      user: day.user_id,
    }
  })
  return fullList;
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
  console.log('DATA', data)
  console.log('ERROR', error)

  const list = getBehaviorList(data)
  console.log('LIST', list)
  
  // sorts list based on date object
  const sortedList = list ? list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : [];

  const completedDayObjectList = getUniqueDayList(sortedList)
  const completedDayOfYearList = completedDayObjectList.map(day => day.day_of_year)
  const yearlyCalendar = createYearlyCalendar(completedDayOfYearList)

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        <div className="w-full py-8">
             <Form className="flex justify-between">
              <Link to={`/list/${params.id}/2024`} className="w-1/4 mx-2 rounded-full text-xs font-bold text-white bg-gray-800 py-1 px-2 text-center">All</Link>
              <button className="w-1/4 mx-2 rounded-full text-xs font-bold text-white bg-gray-800 py-1 px-2" name="category" value="Fitness">Fitness</button>
              <button className="w-1/4 mx-2 rounded-full text-xs font-bold text-white bg-gray-800 py-1 px-2" name="category" value="Spiritual">Spiritual</button>
             </Form>
          </div>
        <div className="w-full h-100 rounded-lg grid grid-cols-7 justify-items-center gap-4"> 
          {yearlyCalendar.map((day: any) => {
            return <Link to={`/daily/2024/${day.number}`} key={day.number}>
            <div className={`w-10 h-10 flex items-center justify-center 
              ${day.future ? 'bg-gray-200' : !day.future && day.complete ? 'bg-green-500' : 'bg-red-100'}`}>
              {day.number}
            </div>
            </Link>
          })}
        </div>
    </div>
  </main>
  );
}