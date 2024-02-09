import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams, useSearchParams, useNavigation, Form } from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { YearlyCalendar } from "~/components/YearlyCalendar";
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
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const goalId = url.searchParams.get("goalId");
  const { data, error } = await behaviorDataQuery(request, category, Number(goalId));
  const { goalData, errorMsg } = await goalDataQuery(request);

  return json({ 
    data: data,
    goalData: goalData,
    errorMsg: errorMsg,
    category: category,
    goalId: goalId,
    error: error
  });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  let cacheKey = `all-behaviors`
  let cached = await localforage.getItem(cacheKey)
  if (cached) { return { data: cached.data, goalData: cached.goalData }}

  const { data, goalData } = await serverLoader();
  localforage.setItem(cacheKey, { data, goalData })
  return { data, goalData } 
}

export default function Calendar() {
  // get navitation state
  const navigation = useNavigation();

  // get data from loader, log any errors
  const { data, error, goalData, errorMsg } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  console.log('ERROR MSG', errorMsg)

  // get params and search params from url
  const params = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')
  const goalParam = searchParams.get('goal_id')
  console.log('GOAL PARAM', goalParam)
  console.log('CATEGORY PARAM', categoryParam)
  console.log('PARAMS', params)

  // convert data into an array that can be use to create a yearly calendar based on completed behaviors
  const list = getBehaviorList(data)
  const sortedList = list ? list.sort((a, b) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()) : [];
  console.log(sortedList)

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

  // create goal options
  const goalOptions = goalData?.map((goal) => {
    return <option key={goal.id} value={goal.id}>{goal.goal}</option>
  }) || null;

  return (
    <>
      <div className="w-full pt-2">
              <Form method="get" className="grid" >
                  <label htmlFor="goal" className="my-2 block text-lg font-medium text-gray-800">Filter by a specific goal.</label>
                  <select id="goal_id" name="goal_id" className="w-full border-gray-400 rounded-lg shadow-sm mb-4">
                  {goalOptions}
                  </select>
                  <div>
                      <button className="w-full p-2 bg-gray-800 text-white text-center rounded-md" type="submit">Filter</button>
                  </div>
              </Form>  
          </div>
      <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
        <div className="w-full h-100 rounded-lg grid grid-cols-1 justify-items-start"> 
          <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} />
          <div className="text-lg font-bold">Today is day {today} of this year.</div>
          <YearlyCalendar yearlyCalendar={calendarData} today={today} user={params.user} />
        </div>
      </div>
    </>
    );
}