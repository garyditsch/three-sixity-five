import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import type { ClientLoaderFunctionArgs } from "@remix-run/react";
import { useLoaderData, useParams, useSearchParams, useNavigation } from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";
import localforage from "localforage";

export const meta: MetaFunction = () => {
  return [
    { title: "365 List" },
    { name: "description", content: "A look at the year's completed behaviors in a list view" },
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
    error: error
  })
}

export async function clientLoader({ params, serverLoader }: ClientLoaderFunctionArgs) {
  let cacheKey = `all-behaviors`
  let cached = await localforage.getItem(cacheKey)
  if (cached) { return { data: cached.data }}

  const { data } = await serverLoader();
  localforage.setItem(cacheKey, { data })
  return { data } 
}

export default function YearlyList() {
  // get data from loader, log any errors
  const { data, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)
  const navigation = useNavigation();

  // get params and search params from url
  const params = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')
  
  // convert data to array to use for UI
  const sortedList = data ? data.sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()) : [];

  return (
      <div className="grid-flow-col auto-cols-auto gap-4 overflow-y-hidden">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-1 divide-y divide-slate-800 justify-items-start"> 
          <CategoryFilters navigation={navigation} categoryParam={categoryParam} params={params} />
          {sortedList.map((day: any) => {
            return <div className={"w-full grid grid-cols-1 py-4"} key={day.id}>
              <div className="text-sm text-gray-800 font-semibold">
                {new Date(day.activity_date).toString().split(' ').slice(1, 4).join(' ')}
              </div>
              <div className="text-md text-gray-800">{day.goals.goal}</div>
            </div>
          })}
        </div>
    </div>
  );
}