import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams, useSearchParams, useNavigation } from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { YearlyCalendar } from "~/components/YearlyCalendar";
import { getDayOfYear } from "~/utils/date-helper";
import { getUniqueDayList, getBehaviorList, createYearlyCalendar } from "~/utils/data-parsers";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";
import localforage from "localforage";

export const meta: MetaFunction = () => {
  return [
    { title: "Calendar" },
    { name: "description", content: "A calendar review of your daily completed behaviors." },
  ];
};

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const goalId = url.searchParams.get("goalId");
  const { data, error } = await behaviorDataQuery(request, category, Number(goalId));

  return json({ 
    data: data,
    category: category,
    goalId: goalId,
    error: error
  });
}

export async function clientLoader({ params, serverLoader }: ClientLoaderFunctionArgs) {
  let cacheKey = `all-behaviors`
  let cached = await localforage.getItem(cacheKey)
  if (cached) { return { data: cached.data, goalData: cached.goalData }}

  const { data } = await serverLoader();
  localforage.setItem(cacheKey, { data })
  return { data } 
}

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
  const sortedList = list ? list.sort((a, b) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()) : [];
  const completedDayObjectList = getUniqueDayList(sortedList)
  const completedDayOfYearList = completedDayObjectList.map(day => day.day_of_year)
  const calendarData = createYearlyCalendar(completedDayOfYearList)

  // get today 
  const today = getDayOfYear(new Date());

  return (
    <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
      <div className="w-full h-100 rounded-lg grid grid-cols-1 justify-items-start"> 
        <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} />
        <div className="text-lg font-bold">Today is day {today} of this year.</div>
        <YearlyCalendar yearlyCalendar={calendarData} today={today} user={params.user} />
      </div>
    </div>
    );
}