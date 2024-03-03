import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams, useSearchParams, useNavigation, useLocation } from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";
import { getBehaviorList } from "~/utils/data-parsers";
import localforage from "localforage";
import { readUserSession } from "~/utils/auth";
import { FitnessIcon } from "../assets/fitness";
import { MentalIcon } from "~/assets/mental";
import { SpiritualIcon } from "~/assets/spiritual";
import { SocialIcon } from "~/assets/social";
import { PurposeIcon } from "~/assets/purpose";

export const meta: MetaFunction = () => {
  return [
    { title: "365 List" },
    { name: "description", content: "A look at the year's completed behaviors in a list view" },
  ];
};

const categoryEquals = (category: string | null) => (day: any) => day.category === category;
const goalEquals = (goal_id: string | null) => (day: any) => String(day.goal_id) === String(goal_id);

export async function loader({request}: LoaderFunctionArgs) {
  const user = await readUserSession(request);
  const { behaviorData, error } = await behaviorDataQuery(request);

  return json({ 
    user: user,
    behaviorData: behaviorData,
    error: error
  });
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const behaviorCached = await localforage.getItem('behaviorData');
  const userCached = await localforage.getItem('user');
  if (behaviorCached) {
    return { 
      behaviorData: behaviorCached,
      user: userCached
    }
  }

  const serverData = await serverLoader();
  localforage.setItem('behaviorData', serverData.behaviorData);
  localforage.setItem('user', serverData.user);
  return {
    behaviorData: serverData.behaviorData,
    user: serverData.user
  };
}

clientLoader.hydrate = true;

export default function YearlyList() {
  // get data from loader, log any errors
  const { behaviorData, error, user } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  const navigation = useNavigation();

  function CategoryIcon(category: string | null) {
    switch (category) {
      case 'Fitness':
        return <FitnessIcon />;
      case 'Spiritual':
        return <SpiritualIcon />;
      case 'Purpose':
        return <PurposeIcon />;
      case 'Mental':
        return <MentalIcon />;
      case 'Social':
        return <SocialIcon />;
      default:
        return <FitnessIcon />;
    }
  }

  const location = useLocation();
  let pathname = location.pathname;
  let search = location.search;


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
        <div className="w-full h-100 rounded-lg grid grid-cols-1 justify-items-start"> 
          <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} pathname={pathname} search={search}/>
          {filteredCalendarList?.map((day: any) => {
            return <div className={"w-full grid grid-rows-2 grid-flow-col py-4 border-b-2 border-gray-300"} key={day.id}>
              <div className="grid row-span-2 content-center justify-items-center">{CategoryIcon(day.category)}</div>
              <div className="col-span-2 text-sm text-gray-800 font-semibold">
                {new Date(day.activity_date).toString().split(' ').slice(1, 4).join(' ')}, {day.category}
              </div>
              <div className="col-span-2 text-md text-gray-800">{day.goal}</div>
            </div>
          })}
        </div>
    </div>
  );
}