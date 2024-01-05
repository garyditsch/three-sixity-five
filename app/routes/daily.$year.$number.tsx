import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, Link } from "@remix-run/react";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "365" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const getMonthDayYear = (day: number, year: number) => {
  const date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

export async function loader({request, params}: LoaderFunctionArgs) {
  const selectedDay = getMonthDayYear(Number(params.number), Number(params.year));
  const nextDay = new Date(selectedDay).setDate(selectedDay.getDate() + 1)
  const stringDate = selectedDay.toISOString().split('T')[0]
  const nextDayString = new Date(nextDay).toISOString().split('T')[0]

  const { supabase } = await createSupabaseServerClient({request})
  const { data, error } = await supabase
    .from('behaviors')
    .select(`
      id, goal_id, created_at, user_id,
      goals (
        id, goal, value
      )
    `)
    .gte('created_at', stringDate)
    .lt('created_at', nextDayString)

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

const createBehaviorList = (data: any) => {
    const listItems = data.map(( day: any ) => {
        return <li key={day.id}>
                {day.goals.goal}  <span className="text-xs">( xx of {day.goals.value} )</span>
            </li>        
    })
    return (
        <ul className="mt-8 text-left text-lg border-blue-200 divide-y divide-blue-200">
            {listItems}
        </ul>
    )
  }

export default function Dashboard() {
  const params = useParams();
  const { data, error } = useLoaderData<typeof loader>();
  console.log('data return', data)
  console.log(error)

  const daysBehaviors = data?.filter((day) => {
    const day_of_year = getDayOfYear(new Date(day.created_at))
    if(String(day_of_year) === params.number){
        return day
    }
  })

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-1 gap-4"> 
          {createBehaviorList(daysBehaviors)}
        </div>
    </div>
  </main>
  );
}