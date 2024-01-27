import { json } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useParams, useSearchParams } from "@remix-run/react";
import { CategoryFilters } from "~/components/CategoryFilters";
import { behaviorDataQuery } from "~/queries/behaviors-filtered";

export const meta: MetaFunction = () => {
  return [
    { title: "365 List" },
    { name: "description", content: "A look at the year's completed behaviors in a list view" },
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

export default function YearlyList() {
  // get data from loader, log any errors
  const { data, error } = useLoaderData<typeof loader>();
  console.log('ERROR', error)

  // get params and search params from url
  const params = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category')
  
  // convert data to array to use for UI
  const sortedList = data ? data.sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()) : [];

  return (
    <main className="max-w-full h-full flex relative overflow-y-hidden">
      {/* <!-- Container --> */}
      <div className="h-100 w-full m-4 flex flex-wrap items-start justify-start rounded-tl grid-flow-col auto-cols-auto gap-4 overflow-y-scroll">
        {/* <!-- Container --> */}
        <div className="w-full h-100 rounded-lg grid grid-cols-1 divide-y divide-slate-200 justify-items-start"> 
          <CategoryFilters categoryParam={categoryParam} params={params} />
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
  </main>
  );
}