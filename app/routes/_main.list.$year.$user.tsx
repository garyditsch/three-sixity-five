import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams, useSearchParams, useNavigation } from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";
import { getBehaviorList } from "~/utils/data-parsers";
import localforage from "localforage";

export const meta: MetaFunction = () => {
  return [
    { title: "365 List" },
    { name: "description", content: "A look at the year's completed behaviors in a list view" },
  ];
};

const categoryEquals = (category: string | null) => (day: any) => day.category === category;
const goalEquals = (goal_id: string | null) => (day: any) => String(day.goal_id) === String(goal_id);

export async function loader({request}: LoaderFunctionArgs) {
  const { behaviorData, error } = await behaviorDataQuery(request);

  return json({ 
    behaviorData: behaviorData,
    error: error
  });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const behaviorCached = await localforage.getItem('behaviorData');
  if (behaviorCached) {
    return { behaviorData: behaviorCached }
  }

  const serverData = await serverLoader();
  localforage.setItem('behaviorData', serverData.behaviorData);
  return {
    behaviorData: serverData.behaviorData,
  };
}

export default function YearlyList() {
  // get data from loader, log any errors
  const { behaviorData, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  const navigation = useNavigation();

  // get params and search params from url
  const params = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')
  const goalParam = searchParams.get('goal_id')
  
  // convert data to array to use for UI
  const list = getBehaviorList(behaviorData)
  const sortedList = list ? list.sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()) : [];

  // filter the list based on the category param if filter is selected
  let filteredCalendarList;

  if (categoryParam === null && goalParam === null) {
    filteredCalendarList = sortedList;
  } else if (categoryParam !== null && goalParam === null) {
    filteredCalendarList = sortedList.filter(categoryEquals(categoryParam))
  } else if (categoryParam === null && goalParam !== null) {  
    filteredCalendarList = sortedList.filter(goalEquals(goalParam))
  }

  return (
      <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-1 divide-y divide-slate-800 justify-items-start"> 
          <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} />
          {filteredCalendarList.map((day: any) => {
            return <div className={"w-full grid grid-cols-1 py-4"} key={day.id}>
              <div className="text-sm text-gray-800 font-semibold">
                {new Date(day.activity_date).toString().split(' ').slice(1, 4).join(' ')}
              </div>
              <div className="text-md text-gray-800">{day.goal_id}, {day.category}</div>
            </div>
          })}
        </div>
    </div>
  );
}