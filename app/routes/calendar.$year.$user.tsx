import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, useSearchParams, useNavigation, Form, Link } from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { YearlyCalendar } from "~/components/YearlyCalendar";
import { getDayOfYear } from "~/utils/date-helper";
import { getUniqueDayList, getBehaviorList, createYearlyCalendar } from "~/utils/data-parsers";
import { behaviorDataQuery, goalDataQuery } from "~/queries/behaviors-filtered";

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
  const { goalData, errorMsg } = await goalDataQuery(request);

  return json({ 
    data: data,
    goalData: goalData,
    errorMsg: errorMsg,
    category: category,
    goalId: goalId,
    error: error
  })
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

  // convert data into an array that can be use to create a yearly calendar
  const list = getBehaviorList(data)
  const sortedList = list ? list.sort((a, b) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime()) : [];
  const completedDayObjectList = getUniqueDayList(sortedList)
  console.log('COMPLETED DAY OBJECT LIST', completedDayObjectList)
  const completedDayOfYearList = completedDayObjectList.map(day => day.day_of_year)
  const calendarData = createYearlyCalendar(completedDayOfYearList)
  console.log('CALENDAR DATA', calendarData)

  // get today 
  const today = getDayOfYear(new Date());


  const goalOptions = goalData?.map((goal) => {
    console.log(goal)
    return <option key={goal.id} value={goal.id}>{goal.goal}</option>
  })

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} />
        <div>
        <div className="text-2xl text-gray-800">Log another behavior on this day.</div>
          <Link to="modal">Goal Filter</Link>
          <Form>
            <select id="goalId" name="goalId">
              {goalOptions}
            </select>
            <div>
              <button type="submit">Submit</button>
            </div>
          </Form>
        </div>
        <div className="mx-4 text-lg font-bold">Today is day {today} of this year.</div>
        <YearlyCalendar yearlyCalendar={calendarData} today={today} user={params.user} />
        </div>
    </main>
  );
}