import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, Link, Form, useSearchParams, useNavigation } from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { getDayOfYear } from "~/utils/date-helper";
import { getUniqueDayList, getBehaviorList } from "~/utils/data-parsers";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";

export const meta: MetaFunction = () => {
  return [
    { title: "Calendar" },
    { name: "description", content: "A calendar review of your daily completed behaviors." },
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const { data, error } = await behaviorDataQuery(request, category);

  return json({ 
    data: data,
    category: category,
    error: error
  })
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

export default function Calendar() {
  // get navitation state
  const navigation = useNavigation();

  // get data from loader, log any errors
  const { data, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)

  // get params and search params from url
  const params = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')

  // convert data into an array that can be use to create a yearly calendar
  const list = getBehaviorList(data)
  const sortedList = list ? list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : [];
  const completedDayObjectList = getUniqueDayList(sortedList)
  const completedDayOfYearList = completedDayObjectList.map(day => day.day_of_year)
  const yearlyCalendar = createYearlyCalendar(completedDayOfYearList)

  // get today 
  const today = getDayOfYear(new Date());

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} />
        <div className="mx-4 text-lg font-bold">Today is day {today} of the year.</div>
        <div className="w-full h-100 rounded-lg grid grid-cols-7 justify-items-center gap-4"> 
          {yearlyCalendar.map((day: any) => {
            return <Link to={`/daily/2024/${day.number}`} key={day.number}>
            <div className={`${today === day.number ? 'border-solid border-2 border-indigo-600' : ''}`} >
              <div className={`w-10 h-10 flex items-center justify-center 
                ${day.future ? 'bg-gray-200' : !day.future && day.complete ? 'bg-green-500' : 'bg-red-100'}`}>
                {day.number}
              </div>
            </div>
            </Link>
          })}
        </div>
    </div>
  </main>
  );
}