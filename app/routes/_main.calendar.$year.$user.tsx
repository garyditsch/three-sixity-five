import { useState } from "react";
import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams, useSearchParams, useNavigation, useLocation, Link} from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { YearlyCalendar } from "~/components/YearlyCalendar";
// import { Modal } from "~/components/GoalFilterModal";
import { getDayOfYear } from "~/utils/date-helper";
import { getUniqueDayList, getBehaviorList, createYearlyCalendar } from "~/utils/data-parsers";
import { behaviorDataQuery, goalDataQuery } from "~/queries/behaviors-filtered";
import localforage from "localforage";

export const meta: MetaFunction = () => {
  return [
    { title: "Calendar" },
    { name: "description", content: "A calendar review of your daily completed behaviors." },
  ];
};

const categoryEquals = (category: string | null) => (day: any) => day.category === category;
const goalEquals = (goal_id: string | null) => (day: any) => String(day.goal_id) === String(goal_id);

export async function loader({request}: LoaderFunctionArgs) {
  const { behaviorData, error } = await behaviorDataQuery(request);
  const { goalData, errorMsg } = await goalDataQuery(request);

  return json({ 
    behaviorData: behaviorData,
    goalData: goalData,
    errorMsg: errorMsg,
    error: error
  });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const behaviorCached = await localforage.getItem('behaviorData');
  const goalCached = await localforage.getItem('goalData');
  if (behaviorCached && goalCached) {
    return { behaviorData: behaviorCached, goalData: goalCached }
  }

  const serverData = await serverLoader();
  localforage.setItem('behaviorData', serverData.behaviorData);
  localforage.setItem('goalData', serverData.goalData);
  return {
    behaviorData: serverData.behaviorData,
    goalData: serverData.goalData
  };
}

export default function Calendar() {
  // const [modalOpen, setModalOpen] = useState(false);

  // get navitation state
  const navigation = useNavigation();
  console.log('NAVIGATION', navigation)

  const location = useLocation();
  console.log('LOCATION', location)
  let pathname = location.pathname;
  let search = location.search;


  // get data from loader, log any errors
  const { behaviorData, error, goalData, errorMsg } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('ERROR MSG', errorMsg)

  // get params and search params from url
  const params = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')
  const goalParam = searchParams.get('goal_id')

  // convert data into an array that can be use to create a yearly calendar based on completed behaviors
  const list = getBehaviorList(behaviorData)
  const sortedList = list ? list.sort((a, b) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()) : [];

  // filter the list based on the category param if filter is selected
  let filteredCalendarList;

  if (categoryParam === null && goalParam === null) {
    filteredCalendarList = sortedList;
  } else if (categoryParam !== null && goalParam === null) {
    filteredCalendarList = sortedList.filter(categoryEquals(categoryParam))
  } else if (categoryParam === null && goalParam !== null) {  
    filteredCalendarList = sortedList.filter(goalEquals(goalParam))
  }

  // take filtered list and get unique day list
  const completedDayObjectList = getUniqueDayList(filteredCalendarList)
  const completedDayOfYearList = completedDayObjectList.map(day => day.day_of_year)

  // builds the full year data object
  const calendarData = createYearlyCalendar(completedDayOfYearList)

  // get today 
  const today = getDayOfYear(new Date());

  return (
    <>
      <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
        <div className="w-full h-100 rounded-lg grid grid-cols-1 justify-items-start"> 
          <div><Link to="/goalfilters" state={{ from: pathname, searching: search }}>Goal Filters</Link></div>
          <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} />
          <div className="text-lg font-bold">Today is day {today} of this year.</div>
          <YearlyCalendar yearlyCalendar={calendarData} today={today} user={params.user} />
        </div>
      </div>
    </>
  );
}